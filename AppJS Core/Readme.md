# AppJS Core - Tutorial

This is a demo application showcasing AppJS API, which can be used as a startup project. To use this as a startup project, simply copy and rename this folder to match your needs. Then, you'll need to edit some stuff in following files:

 * `app/index.html` - Find substring `<title>App</title>` and change the title to your liking.
 * `app/debug.html` - Change the title `<title>App</title>` as well.

Now, what are all the files doing?

 * `app/debug.html` - This is the root file of your application for as long as you _develop_ the application. You need no tools to compile your application as long as you use this file, but the overall size of the application will be huge. You'll need to edit this file whenever you'll add a new *.js file.
 * `app/index.html` - This is preminified version of `debug.html`. It expects `app.min.css` and `app.min.js` files to exist (more on that [later](#compiling-app)), it does not care about the `src` subfolder or `app.css`. This is the root of the _minified/production_ application. You need some tools to get there.
 * `app/app.css` - These are the CSS styles of your application. You can add styles to your liking, but I discourage changing the styles present here.
 * `app/src/app.js` - The core library. I recommend do not touch. But I recommend to read it as every function in there is documented and you need to know them during development.
 * `app/src/main.js` - This file instantiates the application and renders the default page. If you need to add something to persistent context of the application, the `Main` function is a good place to do it. Also, if your entry point is called anything else than `PageMain`, you'll need to change it there as well.
 * `app/src/pages.js` - This file contains all the code needed for creating content of the application you can see when running `debug.html`. Study it, then you can delete it and replace it with your own.

> **NOTE ON BROWSER COMPATIBILITY:** Your browser has to support spread operator, fat arrow syntax, Array.prototype.concat, Array.prototype.map, Array.prototype.reduce and Array.prototype.filter (which should be supported in all major browsers).

That's all. Now let's examine, how the app is written.

## App architecture

Basically, file `main.js` defines a global variable called `appx`. It is of type `AppJs` and contains everything - root DOM element, persistent context, all the pages and logic for manipulating with all of those. The point of this being global is twofold. First, you can easily register new pages with the application and second, you can save a few bytes you'll otherwise need to pass it to every other function.

The file `main.js` also defines a `Main` function, but that is not interesting at this point, yet.

The file `pages.js` contains some application pages (or views) and when Javascript is loaded, two particular lines gets executed:

```js
appx.AddPage(
    ID('PageMain'),
    /* ... */
);

appx.AddPage(
    ID('PageNext'),
    /* ... */
);
```

These two lines handle page (view) registration with the app. Since these are called at top level, they will be executed when Javascript is loaded. And since `appx` is already defined, this is good. Each call will add a new page to the application. The first parameter is the name of the page. You can notice call to `ID` function. You don't have to do this and function only copies its input on the output. But if you use this function **every** time you are passing an ID of anything to AppJS, those IDs will be optimized (obfuscated beyond recognition) in the production version.

Now examine rest of the arguments:

```js
appx.AddPage(
    ID('PageMain'),
    'Header of the page',
    RenderMainPageContent,
    [
        new AppJsButton('Open modal', () => {
            appx.OpenModal('Modal', 'Some text', 0.8, 0.8);
        }),
        new AppJsButton('Next Page', () => {
            appx.DisplayPage(ID('PageNext'));
        })
    ]
);
```

Second parameter is a text that will be shown in the heading. You can also pass `null`. That way no heading will be displayed. Third parameter is a callback. It should be a function accepting `AppJsElement` and it is an application that draws the actual content of the page. Third parameter is an array of `AppJsButton` instances. These are buttons that will be displayed in the footer of the page. You can also pass `null` and no footer will be displayed.

Each button is defined by three parameters. First is its label. Second is a function that will get executed when button is clicked. Third (optional, defaults to `null`, not used in the example) will assign ID to the HTML element of the button. Use it whenever you need to change the behaviour of that particular HTML DOM element (line it's `innerHTML` or `onClick` event handler) later on.

Buttons in the example shows two useful commands. First is `appx.OpenModal` which as name suggests, opens a modal window. For now, window only has some _header_ text, some _text_ as its content and has _width_ and _height_. Note that modal window is always centered, is always closable by clicking outside of it and always has a X button in top right corner which closes it as well.

Second useful command is `appx.DisplayPage`. This command will display another page that has been registered with the application. This has some consequences, described in [this section](#resizing-the-window-and-responsiveness).

We will cover callbacks to content drawing [later](#drawing-content).

At this point, `appx` object exists, some pages are registered with the app and Javascript has been loaded. If you examine the HTML files, you notice that when `<body>` is loaded, it'll fire the `Main` function. At the end of the main function, there is a call to `DisplayPage` which displays the page called `PageMain`. And thus the page is rendered and application has started and can be used. Hooray!

[Top](#appjs-core---tutorial)

## Drawing content

So far you know how to setup the application, but how can you actually draw anything useful? It'll be covered in this section. First, some design philosophy.

AppJs is build around the concept of making application that are tiny. Any features that aren't needed on a frequent basis simply aren't there. So, when rendering content, you'll need to keep in mind following things:

 * Whenever you create `AppJsElement`, if it isn't stored in the variable, you **cannot** access it anymore, you cannot get to it anyhow.
 * `AppJsElement` is moreless just a fancy wrapper for HTML DOM element which you **can** access later on.
 * The hierarchy of the elements is the same as in HTML and same rules applies. However, this AppJS is [responsive](#resizing-the-window-and-responsiveness) by default and thus all positions and sizes are relative. But if you need absolute values for anything, there is a way.

All right, so what does it mean? Let's look at the code from `pages.js`:

```js
'static'; function RenderNextPageContent(canvas) {
    var section = canvas.AddElem(0.1, 0.1, 0.8, 0.8);
    section.SetColor('red');

    var fontSize = ReadFontSizeCache(section, 'Custom section', ID('NextPageText'));
    section.SetText('Custom section', fontSize);
}
```

Don't mind the strange `'static';` stuff before the function. It is [explained here](#writing-compact-code). Note the `canvas` parameter of the function. This is our root `AppJsElement`. In HTML terms, this is a `<div>` encapsulating all of our content. We can change its background color (`SetColor`), bind some events to it (`OnClick`, `AddEventCallback`), set some text to it (`SetText`) or put some other HTML elements into it (`AddElem` and `AddButtonArray`).

In the example, I am putting a child element, another div into it via `AddElem` call. First two parameters are XY coordinates of top left corner, relative to parent container (`canvas`). The numbers are on scale <0, 1>. Second two parameters are width and height, once again relative, but not necessarily on a scale <0, 1>. Height can be whatever number but remember - if you want to exceed bounds of the parent element, the child element needs to be given a class `scrollable` (using `AddClass`).

The newly created element is stored in variable `section`. It is given a background color. Then, there is some computation of fontSize. This is optional. It is perfectly fine to just call `section.SetText('blah blah');`. The text that will be rendered will be autoscaled to fit the element it is rendered into (mind the 10% padding on each side). Currently, wrapping of text is not supported and will not behave as you might expect, so you'll need to invent some handy CSS class to support paragraphs of text.

The computation of `fontSize` is a handy tool how to improve performance of your application. The more elements containing text are on a single page, the more time it takes to compute ideal font size for all of them (as this is something that CSS can't help with currently). Thus, you can precompute the font size and then apply it to all elements that share a similar properties. But, normal precomputing will only help for one page and needs to be done at least once when page is rendering. For these reasons, AppJS contains a cache of sorts, where you can store the computed values and just request them. This is what `ReadFontSizeCache` does. You pass it a element and next you need fit to it and an mandatory unique ID. Function will look up the cache, returning result if it there and if it is not, it will compute the result for you and store it there.

If you need to wipe the cache for whatever reason, you might notice that API has a function for that. In order to wipe that cache, you need to trigger resize event on the `window` object.

### Advanced example

Time for advanced example. Let's pretend you need to divide the content canvas to two horizontally divided section, the top one being tall one third of the second one (one quarter of the parent canvas). Second section will be then divided into two subsections. Each of them will have a single letter label in them and a different color:

```js
'static'; function RenderAdvancedExample(canvas) {
	var topSection = canvas.AddElem(0, 0, 1, 1/4);
	topSection.SetColor('red');
	topSection.SetText('A');

	var bottomSection = canvas.AddElem(0, 1/4, 1, 3/4);

	var leftSubsection = bottomSection.AddElem(0, 0, 1/2, 1);
	leftSubsection.SetColor('green');
	leftSubsection.SetText('B');

	var rightSubsection = bottomSection.AddElem(1/2, 0, 1/2, 1);
	rightSubsection.SetColor('blue');
	rightSubsection.SetText('C');
}
```

Go ahead, try it! Notice how subelements only care about position inside of parent.

### Scrollable content

This example showcases page with many rows and scrollable canvas.

```js
'static'; function RenderManyRowsExample(canvas) {
    var rows = [
        "Lorem ipsum",
        "Dolor sit amet",
        "consekventur elit.",
        "Duis aute irure dolor",
        "in reprehenderit",
        "in voluptate velit",
        "esse cillum dolore",
        "eu fugiat nulla",
        "pariatur. Pellentesque",
        "arcu. Duis risus.",
        "Etiam dictum tincidunt",
        "diam. Aenean fermentum",
        "risus id tortor.",
        "Aenean id metus id",
        "velit ullamcorper",
        "pulvinar. Integer in",
        "sapien. Praesent dapibus."
    ];

    var LONGEST_ROW_TEXT = LongestString(rows);
    var ROW_HEIGHT = 1/10;

    canvas.AddClass('scrollable');

    rows.forEach((text, i) => {
        var row = canvas.AddElem(0, i * ROW_HEIGHT, 1, ROW_HEIGHT);
        var fontSize = ReadFontSizeCache(row, LONGEST_ROW_TEXT, ID('ExampleRows'));
        row.SetText(i + ": " + text, fontSize);
        row.AddClass('align_left');
    });
}
```

As you can see, you have to add `scrollable` class to parent element and then you can add items even outside bounds of this parent. This example also uses font size caching. First it computes the longest string possible to occur on the row and then it uses to access the cache. The cherry on top is the class `align_left`.

### Button array example

Following example showcases button array - basically the same stuff used in toolbar, but you can render it anywhere in the content. For example control bar for something. This example has big display and three buttons that set text to it.

```js
'static'; function RenderButtonArrayExample(canvas) {
    var display = canvas.AddElem(0, 0, 1, 0.5, 'div', ID('Display'));
    display.SetText('-----');

    var buttons = [
        new AppJsButton('TEXT1', () => { $(ID('Display')).innerHTML = 'TEXT1'; }),
        new AppJsButton('TEXT2', () => { $(ID('Display')).innerHTML = 'TEXT2'; }),
        new AppJsButton('TEXT3', () => { $(ID('Display')).innerHTML = 'TEXT3'; })
    ];

    var buttonWrapper = canvas.AddElem(0, 0.5, 1, 0.25);
    buttonWrapper.AddButtonArray(buttons);
}
```

The most important thing about button array is that you need a container object that will be fully filled with buttons. Since buttons have transparent backgrounds, you can style the parent element if you need it to stand out. Note the `$` function used to retrieve dom by ID.

### Inputs

This example shows how to correctly make a checkbox, number input and a select dropdown. The code is a little bit longer, each function shows how to create each element. You need to have some persistent context set up (normally this would be `appx.context` and it would be set up in `Main`, but for the sake of simplicity, there is another global variable).

```js
'static'; var context = {
    number: 0,
    flag: false,
    option: 0
};

'static'; function RenderCheckbox(canvas, x, y, w, h, ctxID) {
    var checkbox = canvas.AddElem(x, y, w, h, 'input');
    checkbox.dom.type = 'checkbox';

    if (context[ctxID]) checkbox.dom.checked = 'checked';

    checkbox.OnClick(e => {
        context[ctxID] = !context[ctxID];
        e.target.blur(); // Should be manually blurred to drop the PREVENT_RESIZE flag
    });
}

'static'; function RenderSelect(canvas, x, y, w, h, options, ctxID) {
    var select = canvas.AddElem(x, y, w, h, 'select');
    select.AddEventCallback('change', e => {
        context[ctxID] = parseInt(e.target.selectedIndex);
    });

    options.forEach((label, i) => {
        var option = select.AddElem(0, 0, 1, 1,  'option');
        option.value = i;
        option.SetText(label);

        if (i == context[ctxID]) option.dom.selected = 'selected';
    });
}

'static'; function RenderNumberInput(canvas, x, y, w, h, ctxID) {
    var input = canvas.AddElem(x, y, w, h, 'input');
    input.dom.type = 'number';
    input.dom.value = context[ctxID];
    input.dom.autocomplete = 'off';
	
	// Set callback for updating context
	input.AddEventCallback('input', e => {
		if (e.target.validity.valid) {
			context[ctxID] = e.target.value;
		}
	});
}

'static'; function RenderInputs(canvas) {
    RenderCheckbox(canvas, 0, 0, 0.25, 0.20, 'flag');
    RenderSelect(canvas, 0, 0.25, 0.25, 0.20, ["label 1", "label 2", "label 3"], 'option');
    RenderNumberInput(canvas, 0, 0.50, 0.20, 'number');
}
```

You can notice that whenever you change something, you can resize the window or even switch pages and the changes will remain persistent. But of course it sucks that each element has differently named callback to deal with.

[Top](#appjs-core---tutorial)

## Resizing the window and responsiveness

As you might have noticed, AppJs is trying desperately to be always responsive. That is hard. Not only you have to compute optimal font sizes, but have to deal with window resizing, landscape vs portrait display orientations and weird behaviours of particular browsers. This section brings further light on how exactly does AppJs deal with that.

### Resize event

Each time you call `DisplayPage` or window resolution is changed (resize event, swapping between portrait/landscape, debugger opened or onscreen keyboard is displayed), the **whole** DOM is deleted and then the page currently set as active is rendered (meaning **your** content callbacks will be called). This implies that you cannot store any data in DOM, you have to cleverly store it into javascript variables. It also implies that interactive objects can reset their behaviour if coded uncarefully. Also, when `resize` event is triggered (any beforementioned event with the exception of `DisplayPage`), the whole font size cache gets wiped (for obvious reasons).

This approach works... most of the time. Some browsers/devices has quite annoying behaviour - their onscreen keyboard is not rendered atop of anything else, but as a physical part of the viewport. This normally means that clicking an input item will open keyboard, keyboard will trigger resize, resize will delete whole DOM including selected input, and since there is no active input anymore, keyboard will get closed, triggering another resize.

For this reason, there is a global variable `PREVENT_RESIZE`. When set to true, AppJs will still capture all resize events, but will ignore them. Note that **all** HTML elements of type `<input>` created using AppJs has a build in callbacks that will manage `PREVENT_RESIZE` to prevent bug mentioned earlier. If you want to get rid of this behaviour, you need to override their `focus` and `blur` events. On the other hand, if there are other elements you need to sanitize, those two events are a good start.

Note that behaviour of AppJs is weird if resize events are prevented. But whenever this poses a problem, simply drop the `PREVENT_RESIZE` flag and either call `ChangePage` or force resize event to fix it on runtime.

### Detecting display orientation

Since all units in AppJs are by default relative, you might not see how to detect display orientation. However, it is simple. Considering you have your global AppJs object instantiated and called `appx`, it has an attribute `canvas`, which is top level AppJsElement (for whole window) and you can read its attributes `width` and `height` which are in pixels.

So it is possible to write this code:

```js
function IsWidescreen(appx) {
    return appx.canvas.width > appx.canvas.height;
}
```

[Top](#appjs-core---tutorial)

## Writing compact code

AppJs was born from the need to create the most minified applications ever. For that purpose, your standard issue minifiers (not even babel) can really do the trick. AppJs employ a couple more tricks that try their best to be as less invasive as possible, but they put an extra requirement on the programmer. It also requires an extra step during compilation with a tool called `jsbloat`.

### 'static';

You should put a string `'static';` in front of every top level function (with the exception of `Main`), prototype function and global variable. It has **no effect** whatsoever on your code when debugging. It is just a plain string that does nothing. But when such code is run through `jsbloat`, it collects all identifiers declared as static and obfuscates their names, shortening them by a great amount (2 bytes per identifier in middle sized applications). There are still some rules - all identifiers of functions will start with letter f, global variables with letter v and prototype methods with letter p.

### ID()

By default, AppJs contains definition for function `ID` which does a single thing: it returns whatever it gets on input. So once again, it has **no effect** on your development. When compiled with `jsbloat`, all occurences of `ID(<string>)`, where `<string>` is a text encapsulated by single quotes, will be collected, strings will be once again obfuscated and minified and calls to ID will be completely replaced with those obfuscated strings. For example code: `var row = parent.AddElem(0, 0, 1, 1, 'div', ID('RowXXX'));` will be replaced with `var row = parent.pA(0, 0, 1, 1, 'div', 'x');` (taking into account transformation with static). Unless you have a really good amount of IDs, obfuscated strings will be 1 or 2 bytes.

### hints

Even though static and ID transformation really help a lot when minifying code, there are many strings that really no tool is able to collect and minify. Like attributes of prototypes. But if you can come up with really unique identifiers (ideally prefix them with $), you can use hints file to instruct jsbloat to obfuscate those as well. Hints file is a simple text file where each line contains a single string to obfuscate and globally replace. Following example showcases hints file for pure AppJs:

```js
pages
currentPage
longestBtnLabel
longestHeader
context
$header
$callback
$buttons
```

[Top](#appjs-core---tutorial)

## Compiling app

### Prerequisities

There are three prerequisities for compiling AppJs application. Two of them are distributed via npm:

 * css-minify
 * babel-minify

And you can install them with following commands:

```
npm install babel-minify -g
npm install css-minify -g
```

Third prerequisity is a binary called `jsbloat` which is part of [dsh suite](https://github.com/nerudaj/dsh/releases/tag/v1.0.0). It works under Windows and Ubuntu. ~~On Windows, prefer the VSx64 release where the binary works out of the box as long as you have up to date Visual C++ Redistributable packages.~~ Put the `jsbloat` binary somewhere where it will be in `%PATH%`.

### Toolchain

When building a production version of the application, three steps has to be taken: first two will compile the Javascript, third one will minify the CSS. Following commands are for Windows command line, but can be easily adapted for different shells:

```
rem Navigate to app/src folder. Assuming all your *.js files are here
jsbloat *.js -H hints.txt
cmd /c minify concat.min.js -o ..\app.min.js
del concat.min.js
cd ..

rem Now we are in app folder and app.min.js is there as well
rem Minifiying CSS
mkdir css-dist
cmd /c css-minify -d . -f app.css
move css-dist\app.min.css app.min.css
rmdir css-dist
```

After executing these commands, the `app` folder will contain two new files: `app.min.js` and `app.min.css`. Now you can run `index.html` and verify that everything works as expected.

[Top](#appjs-core---tutorial)
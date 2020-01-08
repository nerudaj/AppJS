# AppJS Core

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

That's all. Now let's examine, how the app is written.

# App architecture

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

Buttons in the example shows two useful commands. First is `appx.OpenModal` which as name suggests, opens a modal window. For now, window only has some _header_ text, some _text_ as its content and has _width_ and _height_. Note that modal window is always centered, is always closable by clicking outside of it and always has a X button in top right corner which closes it as well. Resizing the application window will also close the modal (more on that [later](#resizing-the-window-and-responsiveness)).

Second useful command is `appx.DisplayPage`. This command will display another page that has been registered with the application. This has some consequences, described in [this section](#resizing-the-window-and-responsiveness).

We will cover callbacks to content drawing [later](#drawing-content).

At this point, `appx` object exists, some pages are registered with the app and Javascript has been loaded. If you examine the HTML files, you notice that when `<body>` is loaded, it'll fire the `Main` function. At the end of the main function, there is a call to `DisplayPage` which displays the page called `PageMain`. And thus the page is rendered and application has started and can be used. Hooray!

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

TODO: hodně řádků s random textem a scrollováním

### Button array example

TODO: par buttonu, co nastavi text na display
NOTE: Ukazka ID, $

## Resizing the window and responsiveness

TODO: inputs, deleting dom, modals, font sizes

## Writing compact code

TODO: 'static', ID, jsbloat, hints

## Compiling app

### Prerequisities

TODO: jsbloat, babel-minify, css-minify

### Toolchain

TODO: Commands
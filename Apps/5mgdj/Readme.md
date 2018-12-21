# Core

This folder contains the minimal app and AppJS library and acts as a template for creating new apps.

## Files

 * index.html - Minified, production index.html. Uses app.min.css and app.min.js
 * debug.html - Development version of index.hmtl. Uses app.css and src/ folder
 * app.css - CSS styles for your app. Customize this file to fit your needs
 * app.min.css - Production CSS styles
 * app.min.js - ALL of javascript sources, minified
 * src/app.js - Core library API
 * src/template.js - Functions for generating basic layout of screen
 * src/main.js - Core function executed on startup
 * src/mainpage.js - Implementation of main view of application

## Usage

First of, make a copy of this folder. Preferably, put it to Apps folder and rename it to reflect application you are making.

Second, edit debug.html and index.html and change title of your app.

Now your starting point are files `src/main.js` and `src/mainpage.js`. The first is used for setting up internal context of application as well as adding new views (screens of app). The latter is implementation of a single view. When implementing new view, always keep in mind that all your functions need to have a unique name and also that your top level render function (here RenderMainPage) always can access property `this.app`.

This structure is crucial. `this.app.canvas` is the core DOM representing screen of target device. `this.app.context` is a storage that is being setup from `main.js`. You can say that `this.app.context` is the model of your App. View and controller is tightly bound together since you are expected to create both at once.

As you can notice from inspecting the Main function, all render functions are converted to ClassView and that mainpage view is toggled. This means that when your app is loaded, the render method for that view is exectuted. Also, when resolution changes, whole screen is wiped and render function is once again called. This keeps the app responsive.

For this reason, all methods use relative units when specifying size and position of an element. Also font can be dynamically resized to fit the textbox. More on that later.

## Minification hints

To ensure your app is as small as possible, you can use following minification hints in your code. These are also used in app.js and template.js files. They can only be processed properly by `jsbloat` utility from my dsh repository but don't worry - they are designed to be 100% compliant to strict js and they wont break your app or standard minifiers.

### static keyword

You can put string `'static';` in front of any function, prototype or global variable declaration. `jsbloat` will search for identifiers marked with static and minify these names using global search and replace through all files.

### ID method

Whenever you use some string identifier for DOM elements or array indexing, instead of writing `myarray["my_id"]` you can write `myarray[ID("my_id")]`. This is very similar to `'static';` keyword, only applied on string ids. jsbloat will search for those, minify, global replace and also will optimize away calls to ID function.

### Enum method

Equivalent to ID method, only with slight change - instead of minifying strings to smaller strings, this minifies strings to numbers. It is recommended to use ENUM with view ids and ID for everything else.

## API

### GetDOM(id)

Equivalent for calling document.getElementById.

### GetElementsByName(id)

Equivalent for calling document.getElementsByName.

### LogError(module, func, message)

Will produce an error message in format: `ERROR: module::func: message`. This will be reported to console. Also, if you set LOG_ERROR_LEVEL to number bigger than zero, this will be alerted to user as well. These alerts are enabled by default.

### Random(min, max)

A sane way for computing integer random numbers.

### DefaultArgument(arg, value)

This allows you to write function with optional arguments with default values. It works like that:

```js
'static'; function MyFoo(name, optvalue) {
	optvalue = DefaultArgument(optvalue, 10);
	
	// Now optvalue is always defined
}

MyFoo("helo"); // valid, optvalue is 10
MyFoo("ehlo", 20); // valid, optvalue is 20
```

### GetOptimalFontSize(str, width, height, startSize)

This function allows you to fit text to element it resides in. Simply pass your text to str, size of your element (in pixels) to width and height and optionaly set value of startSize (it is 100 by default).

This function will return optimal fontSize (in pixels) for your text.

| NOTE: This function is slow. It iteratively searches for the best resolution and that can be very slow for huge containers. Also if you have very big containers, you have to adjust the startSize so the function produces correct results. Since this is so slow, you might want to cache the results, see later.

## Classes

### ClassElement

Class representing DOM element. Has following members:

 * dom - reference to DOM object of element
 * width - Width in pixels
 * height - Height in pixels

Methods:

 * add(x, y, w, h, type, id) - Add a subelement of this element. xy represents position on screen (in %), wh represents size (in %), type is type of DOM (default is div), id is ID of DOM, for use with GetDOM method (default none). Function returns instance of ClassElement.
 * setColor(color) - Sets the background color of an element
 * setText(str, autofit, startSize) - Write text (str) to element. Autofit will enable text scaling to match the size of container (default false). StartSize sets the hint for GetOptimalFontSize but it autofit is set to false, startSize directly sets the fontsize. It is recommended to use autofit during development and cache in production.
 * addClass(name) - Add CSS class to element.

### ClassView

Class represeting view (single screen) of an app.

Members:

 * app - Reference to app object

Methods:

 * render - Draw the view
 * bootstrap(app) - Internal function for setting the app reference and possibly more in the future.

### ClassApp

Core class represing whole application, all views, context and dom.

Members:

 * context - Dictionary containing all of your data
 * canvas - Core ClassElement which has the dom attribute set to toplevel HTML DOM.
 * views - Array of views, populated in Main()
 * currentView - Pointer to currently selected view

Methods:

 * addView(view, name) - Add view to app. This is done in the loop in Main()
 * toggleView(name) - Change views. This will clear the screen, change currentView pointer to view called name and call its render method.
 * render - Draw current view. Internal shorthand.
 * bootstrap(id) - Setup the app object with id of top level HTML DOM object. This will also setup eventListener on resize event.

## Templates

To really improve your development process, you can use functions provided in teplate.js to quickly setup a view with or without a header, content canvas and a button toolbar. This section brings an overview of API present in template.js file.

### TEMPLATE_HEADER_HEIGHT

This is not a function but rather a global variable. Adjust this number (in %) if you feel like page header (and toolbar height) are too much.

### maxStr(str1, str2)

Returns longer of two strings.

### ButtonTemplate(label, action, id)

Create a object with some label text, function callback and optional id (default none).

### RenderButtonArray(canvas, buttons, x, y, w, h, cacheID)

Take an array of ButtonTemplate objects and draw it to canvas (ClassElement object) at given xy with bounding box with wh dimensions. CacheID is used for caching font size of each button.

This function will loop over all buttons, finds the longest label, computes optimal font size for that label and then renders all buttons, all with the same fontsize for labels.

This fontsize is also stored in cache using cacheID. All buttons are assigned onclick callback using ButtonTemplate::action.

### RenderToolbarTemplate(parentCanvas, buttons, cacheID)

Renders a toolbar at the bottom of parentCanvas (ClassElement). Toolbar is comprised from a number of buttons and fontsize for their labels is cached using cacheID.

### RenderHeaderTemplate(canvas, label)

Renders a header to canvas (ClassElement) with a label. It is assumed you are somewhat conservative with lengths of labels for headers and thus all headers share the same cacheID for fontsize.

### GetDrawingTemplate(core, hasHeader)

This function will return ClassElement which you can use as a toplevel content DOM object. Core is ClassElement, presumably the same one you have used for toolbar and header. HasHeader is true by default, but if your view has no header, then set it to false and your canvas will expand to space otherwise occupied by header.

I assume you always use toolbar.

## Caching

I've referenced caching multiple times in this text. The point is that the searching for optimal font size is time consuming and can really slow you app down. And most of the time, a lot of elements would share the font size anyways.

Because of that, you can compute your optimal font size once, store it into cache and then use it anytime. This cache will only be wiped if the user resizes or restarts the app so while initially there might be a small delay, after that the UX is smooth.

The cache is a dictionary global variable called GLOBAL_FONT_SIZE_CACHE (if you use jsbloat, this will get minified). It is automatically used by template functions to save you some time.

## Minification

Once you have your app ready for deployment, you should minify it. Here are the steps to get the smallest app possible:

 1. Go to `src/` and call `jsbloat *js`
 2. Go to [jscompress](https://jscompress.com/) and upload a `concat.min.js` file produced by jsbloat. Let compress to it's work and then save the resulting js to `app.min.js`.
 3. Use [cssminifier](https://cssminifier.com/) to minify `app.css` to new `app.min.css`
 4. If you changed anything in `debug.html`, you would have to link minified files in it and minify it as well, using something line [html minifier](https://www.willpeavy.com/minifier/) and save it as new `index.html`.
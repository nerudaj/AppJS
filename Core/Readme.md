# AppJS

This library is intended for single page application (SPA) development with fast performance and tiny memory footprint. It requires no compilation steps for debugging but it requires somewhat complex toolchain to produce production version of your application. It uses ES6 and thus is only compatible with browsers that support it.

## Quickstart

To quicky get on track, refer to `demo` folder with very basic application. You can run the application by launching `debug.html`. When developing your own app, start with files `app.js`, `template.js`, `demo/main.js`, `app.css`, `debug.html`, `index.html` and work from there. The file `index.html` is minified version of `debug.html` which expects minifed versions of JavaScript and CSS sources to exists.

## Compilation

In order to produce a production (super-minified) version of your application, you need to have following tools:

 * npm tools:
	* css-dist
	* minify
 * [dsh](https://github.com/nerudaj/dsh) tools:
	* jsbloat

If you have those in your %PATH%, simply run `prepare-release.bat` and production version will be compiled.
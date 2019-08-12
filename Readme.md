# AppJS

AppJS is a small and simple javascript library aimed on application that should be as fast and data conserving as possible. As such, AppJS prefers a graphic look with small customization options and a toolset with very specific building blocks in mind.

Go check the `Apps/` and see for yourself what kind of applications can be made using AppJS, then decide for yourself whether you are in for it.

## Usage

The `Core/` folder is your starting point. It contains a template for a starting project, generously documented as well as readme with overview on API.

## Dependencies

AppJS uses a set of special directives and functions which can really help with code minification. Since they are custom made for AppJS, you need special minifier available in my repo [dsh](http://github/nerudaj/dsh) as command line utility called `jsbloat`.

### NPM dependencies

```
npm install babel-minify -g
npm install css-minify -g
```
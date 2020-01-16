# AppJS

AppJS is a small and simple javascript library aimed on application that should be as fast and data conserving as possible. As such, AppJS prefers a graphic look with small customization options and a toolset with very specific building blocks in mind.

Each folder here contain its own application written in AppJs. The folder `AppJs Core` contains pure library, very minimal demo app and a detailed [tutorial](AppJs Core/Readme.md) on how to use the library. Start here if you want to get hands on AppJs.

## Production

If you want to deploy any app in production mode, you'll need following dependencies:

 * npm
    * babel-minify - `npm install babel-minify -g`
    * css-minify - `npm install css-minify -g`
 * [dsh](https://github.com/nerudaj/dsh)
    * jsbloat - In `bin` folder in newest releases

As long as those tools are in your `%PATH%`, you can (on Windows) go into any app folder and run `prepare-release.bat` script, which will yield a full, minified, production release.

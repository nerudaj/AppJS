@echo off

set /p version=<VERSION
set appname=AppJS

rem ## Build src
echo Phase 1 - Minifying Javascript

rem Delete old minified sources and auxiliary files
cd app
del app.min.js src\concat.min.js

rem Source jsbloat PATH
call C:\tools\doomsh.cmd

cd src
jsbloat *.js -H hints.txt
cmd /c minify concat.min.js -o ..\app.min.js
del concat.min.js
cd ..

rem Minify CSS
echo Phase 2 - Minifying CSS
mkdir css-dist
cmd /c css-minify -d . -f app.css
move css-dist\app.min.css app.min.css
rmdir css-dist

rem ## Release
set outdir=..\RELEASE\%appname%-%version%

echo Phase 3 - Building output filesys
mkdir %outdir%
robocopy . %outdir% index.html app.min.js app.min.css favicon.ico favicon.png CHANGELOG.txt
cd ..

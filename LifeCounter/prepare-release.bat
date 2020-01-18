@echo off

set /p version=<VERSION
set appname=LifeCounter

rem ## Build src
echo Phase 1 - Minifying Javascript

rem Source jsbloat PATH
call C:\tools\doomsh.cmd

cd app
cd src
jsbloat helper.js lang.js wave.js app.js main.js score.js chance.js timer.js timer_settings.js settings.js advanced_settings.js -H hints.txt
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

del app.min.js app.min.css
cd ..

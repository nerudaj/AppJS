@echo off

set /p version=<VERSION

rem Build src
echo Phase 1 - Minifying Javascript
del app.min.js
call C:\tools\doomsh.cmd
cd src
del concat.min.js
jsbloat *.js lang\cz.js
cmd /c minify concat.min.js -o ..\app.min.js
del concat.min.js
cd ..

rem Release
set outdir=RELEASE\LifeCounter-%version%

echo Phase 2 - Building output filesys
mkdir %outdir%
robocopy . %outdir% index.html app.min.js app.min.css favicon.ico favicon.png CHANGELOG.txt

@echo off

set /p version=<VERSION
set tgtfldr=RELEASE\AppJS-%version%

echo Target folder is: %tgtfldr%
mkdir %tgtfldr%

copy index.html     %tgtfldr%
copy debug.html     %tgtfldr%
copy app.css        %tgtfldr%
copy VERSION        %tgtfldr%
copy CHANGELOG.txt  %tgtfldr%
copy Readme.md      %tgtfldr%

robocopy /S src %tgtfldr%\src
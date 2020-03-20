# LifeCounter

## Introduction

LifeCounter is an app written with AppJS library and demonstrates all of its features. This app is a simple life/score counter for boardgames. It supports 2 to 8 players, with customisable colors, settable initial score and dice throws for determining who will start.

## Demo

You can see this app in action on [apps.wz.cz/counter](http://apps.wz.cz/counter)

## Installation

Simply put contents of release zip file to folder served by your favourite web server (for example `/var/www/html` for apache/httpd on linux). You can also use the app locally on your device without the need to set up the web server - simply execute the `index.html` file.

## Language selection

To change the language, go to Settings->Advanced settings

## Persistent settings

Please note the application uses Webstorage API to store all the settings under Advanced settings screen. If your browser supports it, it will keep your language selection, subscore visibility, etc. Webstore works locally on your device and does not send your data anywhere!

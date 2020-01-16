# LifeCounter

## Introduction

LifeCounter is an app written with AppJS library and demonstrates all of its features. This app is a simple life/score counter for boardgames. It supports 2 to 8 players, with customisable colors, settable initial score and dice throws for determining who will start.

## Demo

You can see this app in action on [apps.wz.cz/counter](apps.wz.cz/counter)

## Installation

Simply put contents of release zip file to folder served by your favourite web server (for example `/var/www/html` for apache/httpd on linux). You can also use the app locally on your device without the need to set up the web server - simply execute the `index.html` file.

## How to use

The application should be intuitive enough to be used, some advanced features are discussed here.

### Language selection

To change the language, go to Settings->Advanced settings

### Persistent settings

Please note the application uses Webstorage API to store all the settings under Advanced settings screen. If your browser supports it, it will keep your language selection, subscore visibility, etc. Webstore works locally on your device and does not send your data anywhere!

### Remote control

You may launch the application on two devices, for example computer hooked up to your TV screen (host) and on your phone (client). You can setup the app in such way that you can control the host from the client. Follow these steps:

 1. Make sure that settings, advanced settings and timer settings are set the same on both devices. Make sure all scores are reset.
 2. On host device, go to Settings->Advanced settings and enable Remote control checkbox
 3. An AppID string should appear after enabling it. Write it down
 4. On client device, go to Settings->Remote control
 5. Input AppID of host device to the text box.
 6. On host device, click Back and then Apply.
 7. On client device, click Apply.
 8. Now try to click the score of any player on client device. The change should be reflected on the host device as well.

**NOTE:** This feature uses additional internet connection and does send some data over the internet.

**ALSO NOTE:** You cannot change settings when remote control is in progress. Or more precisely, you can try, but you will break it.

**ALSO ALSO NOTE:** Results of random throws will differ on both devices. I suggest to keep the throw history enabled and stick to results on only one of the devices.
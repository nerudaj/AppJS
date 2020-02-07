# Knowledge Base

## Fullscreen API

```js
    if (document.fullscreenEnabled) { // is API available
        document.documentElement.requestFullscreen(); // enable fullscreen
    }
```

Must be triggered by a user generated, short lived event.

## Debugging mobile

Instead of remote debugging, following workaround on `app.min.js` can be used:

```js
try {
    var code = `original app.min.js contents`;
} catch (e) {
    alert(e.message);
}
```
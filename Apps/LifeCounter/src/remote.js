'static'; function RenderRemote() {
    var board = PageTemplate(appx.canvas, TEXT_REMOTE, [
        new ButtonTemplate(TEXT_APPLY, () => {
			StartControl();
			appx.toggleView(ENUM('score'));
		}),
		new ButtonTemplate(TEXT_BACK, () => {
			appx.toggleView(ENUM('settings'));
		})
    ], ID('CacheRenderToolbar'));

    RenderControlSection(board.add(0, 0, 1, 0.5));
}

'static'; function RenderControlSection(canvas) {
    var header = canvas.add(0, 0, 1, 0.3);
    header.setText('Enter AppID of remote device:', true);

    var keyinput = canvas.add(0.05, 0.35, 0.9, 0.2, 'input', ID('ApiKey'));
    RenderTextInput(keyinput);
}

'static'; function RenderTextInput(canvas) {
	// Setup dom
	canvas.dom.type = 'text';
	canvas.dom.value = '';
	canvas.dom.autocomplete = 'off';
}

'static'; function StartControl() {
    var apikey = GetDOM(ID('ApiKey')).value;
    window.addEventListener('mousedown', e => {
        var sock = CreateSocket(apikey, 'POST');
        sock.onreadystatechange = function() {
            //console.log(sock.readyState + "\n" + sock.status);
        }
        var x = e.clientX / appx.canvas.width;
        var y = e.clientY / appx.canvas.height;
        
        sock.send(JSON.stringify([x,y]));
    });
}

'static'; function StartDisplay() {
    var sock = CreateSocket(appx.context.$apikey, 'GET');
    
    sock.onreadystatechange = function() {
        //console.log(sock.readyState + "\n" + sock.status);
        if (sock.readyState == 4 && sock.status == 200) {
            var coords = JSON.parse(sock.responseText);
            document.elementFromPoint(coords[0] * appx.canvas.width, coords[1] * appx.canvas.height).click();
            StartDisplay();
        }
    }
    sock.send();
}

'static'; function CreateSocket(apikey, mode) {
    var sock = new XMLHttpRequest();
    if (sock === undefined) {
        alert("Cannot send messages!");
        return;
    }

    sock.open(mode, "https://httprelay.io/link/" + apikey, true);
    return sock;
}
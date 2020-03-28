'static'; function SetAjaxResponseCallback(callback) {
	let ajax = appx.context.ajax;
	ajax.onreadystatechange = () => {
		if (ajax.readyState == 4 && ajax.status == 200) {
			callback(JSON.parse(ajax.responseText));
		}
	}
}

function dec2hex(n){
    n = parseInt(n); var c = 'ABCDEF';
    var b = n / 16; var r = n % 16; b = b-(r/16);
    b = ((b>=0) && (b<=9)) ? b : c.charAt(b-10);
    return ((r>=0) && (r<=9)) ? b+''+r : b+''+c.charAt(r-10);
}

'static'; function GenerateRandomString(length) {
	var arr = new Uint8Array((length || 40) / 2);
	window.crypto.getRandomValues(arr);
	return Array.from(arr, dec2hex).join('');
}

'static'; function GetFieldViaAjax() {
	var rand = GenerateRandomString(10);

	let ajax = appx.context.ajax;
	ajax.open('GET', 'backend/entry.php?mode=get&gameid=' + appx.context.gameId + '&bypassCache=' + rand, true);
	ajax.send();
}

'static'; function SetFieldViaAjax(index) {
	var rand = GenerateRandomString(10);

	let ajax = appx.context.ajax;
	ajax.open('GET', 'backend/entry.php?mode=set&gameid=' + appx.context.gameId + '&index=' + index + '&bypassCache=' + rand, true);
	ajax.send();
}
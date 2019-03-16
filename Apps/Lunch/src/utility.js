'static'; function initAjax() {
	var ajaxRequest;

	try{			// Opera 8.0+, Firefox, Safari
		ajaxRequest = new XMLHttpRequest();
	} catch (e){	// Internet Explorer Browsers
		try{
			ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				// Something went wrong
				alert("Your browser broke!");
				return false;
			}
		}
	}

	return ajaxRequest;
}

'static'; function asyncJsonRequest(url, callback) {
	var ajaxRequest = initAjax();
	
		ajaxRequest.onreadystatechange = function(){	// callback
			if(ajaxRequest.readyState == 4){
				var output = JSON.parse(ajaxRequest.responseText);
				callback(output);
			}
		}
		
		//ajaxRequest.open("GET", "backend/proxy.php?url=" + encodeURIComponent("http://www.cafecrowbar.cz/poledni-menu.php"), true);
		ajaxRequest.open("GET", url, true);
		ajaxRequest.send();
}
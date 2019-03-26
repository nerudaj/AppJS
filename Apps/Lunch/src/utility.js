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

'static'; function asyncGetLunch(place) {
	var ajaxRequest = initAjax();
	
	ajaxRequest.onreadystatechange = function(){	// callback
		if(ajaxRequest.readyState == 4){
			console.log(ajaxRequest.responseText);
			try {
				var output = JSON.parse(ajaxRequest.responseText);
				RenderPlace(place, output);
			} catch(e) {
				//alert(e);
				RenderError(place);
			}
		}
	}
	
	ajaxRequest.open("GET", "php/menu.php?where=" + place, true);
	ajaxRequest.send();
}
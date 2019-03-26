function Main() {
	var places = ["adam", "crow", "grill", "kos", "naber", "rubin"];
	places.forEach(place => {
		asyncGetLunch(place);
	});
}

'static'; function RenderPlace(domID, place) {
	var str = "<h2><i class='fas fa-" + place.icon + "'></i>&nbsp;" + place.name + "</h2>";
	
	str += "<p>";
	place.food.forEach((dish) => {
		str += dish + "<br>";
	});
	str += "</p>";

	document.getElementById(domID).innerHTML = str;
}

'static'; function RenderError(domID) {
	var str = "<h2>Chyba - nepodařilo se načíst data pro " + domID + "</h2>";
	document.getElementById(domID).innerHTML = str;
}
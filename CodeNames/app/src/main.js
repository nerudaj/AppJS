'static'; var appx = new AppJs(); // This variable has to be global in order to register pages

// Bootstrap app
function Main() {
	appx.Bootstrap('Canvas');

	// Setup app context
	appx.context['gameId'] = '';
	appx.context['keyOnly'] = false;
	appx.context['roleCaptain'] = false;
	appx.context['language'] = 0;
	appx.context['pickedColor'] = 0;
	appx.context['ajax'] = new XMLHttpRequest();
	appx.context['online'] = true;
	appx.context['game'] = null;
	appx.context['fetchHandle'] = null;
	appx.context['dynamicFonts'] = false;

	// Toggle default page
	appx.DisplayPage(ID('PageMain'));
}
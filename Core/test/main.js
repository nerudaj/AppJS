// Global variables
'static'; var appx = new AppJs();

'static'; AppJs.prototype.backupContext = function() {
	this.backup = JSON.parse(JSON.stringify(this.context));
}

'static'; AppJs.prototype.rollbackContext = function() {
	this.context = JSON.parse(JSON.stringify(this.backup));
}

// Bootstrap app
function Main() {
	appx.bootstrap('Canvas');

	// Setup app context
	appx.backup = {};
	// app.context['key'] = value;

	// Setup views
	var views = [
		{ callback: RenderMainPage, name: ENUM('mainpage') }
	];
	
	// Add views to app
	for (var i = 0; i < views.length; i++) {
		var view = new AppJsView();
		view.render = views[i].callback;
		appx.addView(view, views[i].name);
	}
	
	// Toggle default view
	appx.toggleView(ENUM('mainpage'));
}
// Global variables
'static'; var appx = new ClassApp();

'static'; ClassApp.prototype.backupContext = function() {
	this.backup = JSON.parse(JSON.stringify(this.context));
}

'static'; ClassApp.prototype.rollbackContext = function() {
	this.context = JSON.parse(JSON.stringify(this.backup));
}

// Bootstrap app
function Main() {
	// Bootstrap app
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
		var view = new ClassView();
		view.render = views[i].callback;
		app.addView(view, views[i].name);
	}
	
	// Toggle default view
	app.toggleView(ENUM('mainpage'));
}
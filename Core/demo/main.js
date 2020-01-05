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
		{ callback: RenderMainPage, name: ENUM('mainpage') },
		{ callback: RenderNextPage, name: ENUM('nextpage') }
	];
	
	// Add views to app
	views.forEach(pair => {
		var view = new AppJsView();
		view.render = pair.callback;
		appx.addView(view, pair.name);
	})
	
	// Toggle default view
	appx.toggleView(ENUM('mainpage'));
}
// Global variables
var app = new ClassApp();

// Bootstrap app
function Main() {
	// Bootstrap app
	app.bootstrap('Canvas');

	// Setup app context
	app.context['time'] = 0;
	app.context['foo'] = 'SmoothStop(x, 2)'; // easing function string
	app.context['foobak'] = 'SmoothStop(x, 2)'; // easing function backup
	app.context['handle'] = null; // Interval handle

	// Setup views
	var views = [
		{ callback: RenderMainPage, name: ENUM('mainpage') },
		{ callback: RenderHintPage, name: ENUM('hints') }
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
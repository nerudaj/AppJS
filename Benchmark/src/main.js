// Global variables
var app = new ClassApp();

// Bootstrap app
function Main() {
	// Bootstrap app
	app.bootstrap('Canvas');

	// Setup app context
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
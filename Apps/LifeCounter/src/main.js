// The most important global variable
var app = new ClassApp();

// Main function will bootstrap the App
function Main() {
	app.bootstrap('Canvas');
	
	// Setup app context
	app.context['players'] = [];
	app.context['initScore'] = 0;
	app.context['numOfPlayers'] = 4;
	app.context['colorSetup'] = [ 0, 1, 2, 3, 4, 5 ];
	app.context['initCountdown'] = 30; // 30 seconds
	app.context['countdown'] = 0;
	app.context['cntIntHndl'] = null;
	
	// Instantiate players
	for (var i = 0; i < app.context.numOfPlayers; i++) {
		app.context.players.push(new ClassPlayer());
		app.context.players[i].score = app.context.initScore;
		app.context.players[i].color = Colors[app.context.colorSetup[i]];
	}
	
	// Setup views
	var views = [
		{ callback: RenderScore, name: ENUM('score') },
		{ callback: RenderSettings, name: ENUM('settings') },
		{ callback: RenderTimer, name: ENUM('timer') },
		{ callback: RenderTimerSettings, name: ENUM('timer_settings') },
		{ callback: RenderDice, name: ENUM('dice') }
	];
	
	// Instantiate views
	for (var i = 0; i < views.length; i++) {
		var view = new ClassView();
		view.render = views[i].callback;
		app.addView(view, views[i].name);
	}
	
	// Aaand toggle the main view
	app.toggleView(ENUM('score'));
}
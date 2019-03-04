// The most important global variable
'static'; var appx = new ClassApp();

// Main function will bootstrap the App
function Main() {
	appx.bootstrap('Canvas');
	
	// Setup appx context
	appx.context['players'] = [];
	appx.context['initScore'] = 0;
	appx.context['numOfPlayers'] = 4;
	appx.context['colorSetup'] = [ 0, 1, 2, 3, 4, 5 ];
	appx.context['initCountdown'] = 30; // 30 seconds
	appx.context['countdown'] = 0;
	appx.context['cntIntHndl'] = null;
	
	// Instantiate players
	for (var i = 0; i < appx.context.numOfPlayers; i++) {
		appx.context.players.push(new ClassPlayer());
		appx.context.players[i].score = appx.context.initScore;
		appx.context.players[i].color = Colors[appx.context.colorSetup[i]];
	}
	
	// Setup views
	var views = [
		{ callback: RenderScore,         name: ENUM('score') },
		{ callback: RenderSettings,      name: ENUM('settings') },
		{ callback: RenderTimer,         name: ENUM('timer') },
		{ callback: RenderTimerSettings, name: ENUM('timer_settings') },
		{ callback: RenderDice,          name: ENUM('dice') }
	];
	
	// Instantiate views
	for (var i = 0; i < views.length; i++) {
		var view = new ClassView();
		view.render = views[i].callback;
		appx.addView(view, views[i].name);
	}
	
	// Aaand toggle the main view
	appx.toggleView(ENUM('score'));
}
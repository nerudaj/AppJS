// The most important global variable
'static'; var appx = new AppJs();

'static'; AppJs.prototype.backupContext = function() {
	this.backup = JSON.parse(JSON.stringify(this.context));
}

'static'; AppJs.prototype.rollbackContext = function() {
	this.context = JSON.parse(JSON.stringify(this.backup));
}

// Main function will bootstrap the App
function Main() {
	appx.bootstrap('Canvas');
	
	// Setup appx context
	appx.backup = {};
	appx.context['$players'] = [];
	appx.context['$initScore'] = 0;
	appx.context['$initSubscore'] = 0;
	appx.context['$numOfPlayers'] = 4;
	appx.context['$colorSetup'] = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
	appx.context['$initCountdown'] = 30; // 30 seconds
	appx.context['$countdown'] = 0;
	appx.context['$cntIntHndl'] = null;
	appx.context['$history'] = "";
	appx.context['$diceCount'] = 3;
	appx.context['$apikey'] = GetRandomApiKey();

	// Advanced Context = locally stored
	appx.advctx = {};
	appx.advctx.$language = 1;
	appx.advctx.$useRemote = false;
	appx.advctx.$useSubscore = false;
	appx.advctx.$useThrowHistory = true;
	appx.advctx.$useScoreHistory = false;

	appx.advctx = appx.loadFromLocalStorage("LifeCounterV4.1", appx.advctx);
	SetLanguageById(appx.advctx.$language);
	
	// Instantiate players
	for (var i = 0; i < appx.context.$numOfPlayers; i++) {
		appx.context.$players.push(new ClassPlayer());
		appx.context.$players[i].score = appx.context.$initScore;
		appx.context.$players[i].color = COLOR_WHEEL[appx.context.$colorSetup[i]];
	}
	
	// Setup views
	var views = [
		{ callback: RenderScore,            name: ENUM('score') },
		{ callback: RenderSettings,         name: ENUM('settings') },
		{ callback: RenderAdvancedSettings, name: ENUM('advanced_settings') },
		{ callback: RenderTimer,            name: ENUM('timer') },
		{ callback: RenderTimerSettings,    name: ENUM('timer_settings') },
		{ callback: RenderDice,             name: ENUM('dice') },
		{ callback: RenderRemote,           name: ENUM('remote') }
	];
	
	// Instantiate views
	for (var i = 0; i < views.length; i++) {
		var view = new AppJsView();
		view.render = views[i].callback;
		appx.addView(view, views[i].name);
	}
	
	// Aaand toggle the main view
	appx.toggleView(ENUM('score'));
}
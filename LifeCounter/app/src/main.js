function ENUM(id){return id;}

// The most important global variable
'static'; var appx = new AppJs();

'static'; AppJs.prototype.backupContext = function() {
	this.backup = JSON.parse(JSON.stringify(this.context));
}

'static'; AppJs.prototype.rollbackContext = function() {
	this.context = JSON.parse(JSON.stringify(this.backup));
}

'static'; var LOCAL_STORAGE_ACCESS_KEY = "LCv4.9.1";

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
appx.context['$gameTime'] = 0;
appx.context['$timeTrackingHndl'] = null;

// Advanced Context = locally stored
appx.advctx = {};
appx.advctx.$language = 1;
appx.advctx.$useSubscore = false;
appx.advctx.$useThrowHistory = true;
appx.advctx.$useScoreHistory = false;
appx.advctx.$useTimeTracking = false;

appx.advctx = appx.LoadFromLocalStorage(LOCAL_STORAGE_ACCESS_KEY, appx.advctx);
SetLanguageById(appx.advctx.$language);

// Main function will bootstrap the App
function Main() {
	appx.Bootstrap('Canvas');

	// Instantiate players
	for (var i = 0; i < appx.context.$numOfPlayers; i++) {
		appx.context.$players.push(new ClassPlayer());
		appx.context.$players[i].score = appx.context.$initScore;
		appx.context.$players[i].color = COLOR_WHEEL[appx.context.$colorSetup[i]];
	}

	// Aaand toggle the main view
	appx.DisplayPage(ID('PageScore'));
}
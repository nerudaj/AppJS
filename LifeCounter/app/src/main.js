// The most important global variable
'static'; var appx = new AppJs();

'static'; AppJs.prototype.backupContext = function() {
	this.backup = JSON.parse(JSON.stringify(this.context));
}

'static'; AppJs.prototype.rollbackContext = function() {
	this.context = JSON.parse(JSON.stringify(this.backup));
}

'static'; var LOCAL_STORAGE_ACCESS_KEY = "LCv4.11.2";

// Setup appx context
appx.backup = {};

appx.context = {
	$players : [],
	$initScore : 0,
	$initSubscore : 0,
	$numOfPlayers : 4,
	$colorSetup : [ 0, 1, 2, 3, 4, 5, 6, 7 ],
	$initCountdown : 30, // 30 seconds
	$countdown : 0,
	$cntIntHndl : null,
	$history : "",
	$diceCount : 3,
	$gameTime : 0,
	$timeTrackingHndl : null
};

// Advanced Context = locally stored
appx.advctx = {
	$language : 1,
	$useSubscore : false,
	$useThrowHistory : true,
	$useScoreHistory : true,
	$useTimeTracking : false,
	$useScoreEditor : true
};

appx.advctx = appx.LoadFromLocalStorage(LOCAL_STORAGE_ACCESS_KEY, appx.advctx);
SetLanguageById(appx.advctx.$language);

'static'; function PrepareApplication() {
	appx.pages = {};

	appx.AddPage(
		ID('PageScore'),
		null,
		RenderPageScore,
		[
			new AppJsButton(TEXT_WHO_STARTS, () => { appx.DisplayPage(ID('PageChance')); }),
			new AppJsButton(TEXT_TIMER,      () => { appx.DisplayPage(ID('PageTimer')); }),
			new AppJsButton(TEXT_SETTINGS,   () => {
				appx.backupContext();
				appx.DisplayPage(ID('PageSettings'));
			})
		]
	);

	appx.AddPage(
		ID('PageChance'),
		TEXT_WHO_STARTS,
		RenderPageChance,
		[
			new AppJsButton(TEXT_THROW_DICE, () => {
				LAST_USED_FUNCTION = ThrowDice;
				RandomizationAnimation();
			}),
			new AppJsButton(TEXT_TOSS_COIN, () => {
				LAST_USED_FUNCTION = TossCoin;
				RandomizationAnimation();
			}),
			new AppJsButton(TEXT_WHOLL_START, () => {
				LAST_USED_FUNCTION = PickFirstPlayer;
				RandomizationAnimation();
			}),
			new AppJsButton(TEXT_BACK, () => {
				appx.DisplayPage(ID('PageScore'));
			})
		]
	);

	appx.AddPage(
		ID('PageTimer'),
		TEXT_TIMER,
		RenderPageTimer,
		[
			new AppJsButton(TEXT_SETTINGS, () => {
				TimeControl(ENUM('stop'), "$cntIntHndl", CountdownUpdater);
				appx.backupContext();
				appx.DisplayPage(ID('PageTimerSettings'));
			}),
			new AppJsButton(TEXT_BACK, () => {
				TimeControl(ENUM('stop'), "$cntIntHndl", CountdownUpdater);
				appx.DisplayPage(ID('PageScore'));
			})
		]
	);

	appx.AddPage(
		ID('PageTimerSettings'),
		TEXT_SETTINGS,
		RenderPageTimerSettings,
		[
			new AppJsButton(TEXT_APPLY, () => {
				appx.DisplayPage(ID('PageTimer'));
			}),
			new AppJsButton(TEXT_BACK, () => {
				appx.rollbackContext(); // All changes were cancelled
				appx.DisplayPage(ID('PageTimer'));
			})
		]
	);

	appx.AddPage(
		ID('PageSettings'),
		TEXT_SETTINGS,
		RenderPageSettings,
		[
			new AppJsButton(TEXT_APPLY, () => {
				ApplySettings(); // Some post process has to be done
				appx.DisplayPage(ID('PageScore'));
			}),
			new AppJsButton(TEXT_A_SETTINGS, () => {
				ApplySettings();
				appx.DisplayPage(ID('PageAdvancedSettings'));
			}),
			new AppJsButton(TEXT_BACK, () => {
				appx.rollbackContext();
				appx.DisplayPage(ID('PageScore'));
			})
		]
	);

	appx.AddPage(
		ID('PageAdvancedSettings'),
		TEXT_A_SETTINGS,
		RenderPageAdvancedSettings,
		[
			new AppJsButton(TEXT_BACK, () => {
				ApplyAdvancedSettings();
				appx.DisplayPage(ID('PageSettings'));
			})
		]
	);

	appx.Bootstrap('Canvas');
}

// Main function will bootstrap the App
function Main() {
	PrepareApplication();

	// Instantiate players
	for (var i = 0; i < appx.context.$numOfPlayers; i++) {
		appx.context.$players.push(new ClassPlayer());
		appx.context.$players[i].score = appx.context.$initScore;
		appx.context.$players[i].color = COLOR_WHEEL[appx.context.$colorSetup[i]];
	}

	// Aaand toggle the main view
	appx.DisplayPage(ID('PageScore'));
}
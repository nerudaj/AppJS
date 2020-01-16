'static'; var SCORE_TIMEOUT_HANDLE = null;
'static'; var SCORE_DIFFERENCE = 0;
'static'; var SCORE_HISTORY_ID = 0;
'static'; var SCORE_HISTORY_SLOT = [ '$subscoreHistory', '$scoreHistory' ];

appx.AddPage(
	ID('PageScore'),
	appx.advctx.$useTimeTracking ? IntToTimeStr(appx.context.$gameTime, true) : "",
	RenderPageScore,
	[
		new AppJsButton(TEXT_WHO_STARTS, () => { appx.DisplayPage(ID('PageChance')); }),
		new AppJsButton(TEXT_TIMER,	  () => { appx.DisplayPage(ID('PageTimer')); }),
		new AppJsButton(TEXT_SETTINGS,   () => {
			appx.backupContext();
			appx.DisplayPage(ID('PageSettings'));
		})
	]
);

'static'; function UpdateTimeTracking() {
	appx.context.$gameTime++;

	if (appx.currentView == ID('PageScore')) {
		var display = document.getElementsByClassName("header")[0];
		display.innerHTML = IntToTimeStr(appx.context.$gameTime, true);
	}
}

'static'; function RenderPageScore(canvas) {
	canvas.dom.className = "";

	// Bootstrap time tracking
	/*
		NOTE: This code cannot be anywhere else. If it is in main, then it is not affected by settings at run-time
		If it is in settings then it is not affected by start of the application.
		It has to be here.
	*/
	var context = appx.context;
	if (appx.advctx.$useTimeTracking && !context.$timeTrackingHndl) {
		context.$timeTrackingHndl = setInterval(UpdateTimeTracking, 1000);
	}
	else if (!appx.advctx.$useTimeTracking && context.$timeTrackingHndl) {
		context.$timeTrackingHndl = ReallyClearInterval(context.$timeTrackingHndl);
	}

	// Rendering itself
	var playersLength = appx.context.$players.length;

	var COL_COUNT = playersLength == 2 ? 1 : 2;
	var ROW_COUNT = Math.ceil(playersLength / COL_COUNT);
	var ITEM_WIDTH = 1 / COL_COUNT;
	var ITEM_HEIGHT = 1 / ROW_COUNT;

	var pid = 0;
	for (var y = 0; y < ROW_COUNT; y++) {
		for (var x = 0; x < COL_COUNT; x++) {
			if (playersLength % 2 == 1 && pid + 1 == playersLength) {
				ITEM_WIDTH = 1;
			}

			// Create score and subscore displays
			[ID('Score'), ID('Subscore')].forEach(item => {
				// ID is 'SContainer' + (score|subscore) + pid
				var display = canvas.AddElem(x * ITEM_WIDTH, y * ITEM_HEIGHT, ITEM_WIDTH, ITEM_HEIGHT, 'div', ID('SContainer') + item + pid);
				display.SetColor(appx.context.$players[pid].color);
				RenderDisplay(pid, display, item);
			});
			// By default, hide subscore
			$(ID('SContainer') + ID('Subscore') + pid).style.display = 'none';

			// Add a swap button if subscore is enabled
			if (appx.advctx.$useSubscore && ((i) => {
				var swap = canvas.AddElem((x + 0.45) * ITEM_WIDTH, y * ITEM_HEIGHT, ITEM_WIDTH * 0.1, ITEM_HEIGHT * 0.15, 'button');
				var fontSize = ReadFontSizeCache(swap, '⇄', ID('CacheScoreAuxSymbol'));
				swap.SetText('⇄', fontSize);
				swap.OnClick(() => {
					var subscore = $(ID('SContainer') + ID('Subscore') + i).style;
					var score = $(ID('SContainer') + ID('Score') + i).style.display = subscore.display;
					subscore.display = (score == '' ? 'none' : '');
				});
			}) (pid));

			pid++;
			if (playersLength == pid) return;
		}
	}
}

'static'; function RenderDisplay(id, canvas, type) {
	// Which display are we rendering
	var which = (type == ID('Score') ? 'score' : 'subscore'); // Used for indexing into context
	var players = appx.context.$players;

	// Create -/+ buttons
	var fontSize = 0;
	['-', '+'].forEach((str, ind) => {
		var dom = canvas.AddElem(0.75 * ind, 0, 0.25, 1, 'button');
		fontSize = ReadFontSizeCache(dom, 'XX', ID('CacheScoreDisplay'));

		dom.SetText(str, fontSize);
		dom.OnClick(() => {
			ModifyScore(players, id, parseInt(str + '1'), false, which);
		});
		dom.AddClass('score_btn');
	});

	// Create display canvas
	var score = canvas.AddElem(0.25, 0, 0.5, 1, 'div', ID('DOMDisplay') + which + id);
	score.dom.style.fontSize = fontSize + 'px';
	if (type == ID('Subscore')) score.AddClass('outline'); // Use different font style for subscore

	// Add a show button if score history is enabled
	if (appx.advctx.$useScoreHistory) {
		var hist = canvas.AddElem(0.45, 0.85, 0.1, 0.15, 'button');
		var fontSize = ReadFontSizeCache(hist, '⇄', ID('CacheScoreAuxSymbol'));
		hist.SetText('☰', fontSize);
		hist.OnClick(() => {
			if(SCORE_TIMEOUT_HANDLE) {
				clearTimeout(SCORE_TIMEOUT_HANDLE);
				LogScoreHistory();
			}

			var modalWidth = appx.canvas.width * 0.9 > 500 ? 500 / appx.canvas.width : 0.9; // Modal window must be max 500px wide or 90% wide
			appx.OpenModal("Player " + (id + 1) + ' ' + which + ' history:', appx.context.$players[id][SCORE_HISTORY_SLOT[which == 'score'? 1 : 0]], modalWidth, 0.8);
		});
	}

	// Can directly index using which
	ModifyScore(players, id, players[id][which], true, which);
}

'static'; function LogScoreHistory() {
	var pid = SCORE_HISTORY_ID % 10;
	var which = (SCORE_HISTORY_ID >= 10 ? 'sub' : '') + 'score';
	appx.context.$players[pid][SCORE_HISTORY_SLOT[which == 'score'?1:0]] += (appx.context.$players[pid][which] + " (" + (SCORE_DIFFERENCE > 0 ? '+' + SCORE_DIFFERENCE : SCORE_DIFFERENCE) + ')') + '<br>';
	SCORE_TIMEOUT_HANDLE = null;
}

'static'; function ModifyScore(players, id, amount, forceAssign, which) {
	players[id][which] = (forceAssign ? 0 : parseInt(players[id][which])) + amount;

	if (!forceAssign) {
		var hid = (which == 'score' ? 0 : 1) * 10 + id;

		if (SCORE_TIMEOUT_HANDLE) {
			clearTimeout(SCORE_TIMEOUT_HANDLE);

			if (SCORE_HISTORY_ID == hid) {
				SCORE_DIFFERENCE += amount;
			}
			else {
				LogScoreHistory();
				SCORE_DIFFERENCE = amount;
			}
		}
		else {
			SCORE_DIFFERENCE = amount;
		}

		SCORE_HISTORY_ID = hid;
		SCORE_TIMEOUT_HANDLE = setTimeout(LogScoreHistory, 2000);
	}

	$(ID('DOMDisplay') + which + id).innerHTML = players[id][which];
}
'static'; var SCORE_TIMEOUT_HANDLE = null;
'static'; var SCORE_DIFFERENCE = 0;
'static'; var SCORE_HISTORY_ID = 0;
'static'; var SCORE_HISTORY_SLOT = [ '$subscoreHistory', '$scoreHistory' ];

'static'; function UpdateTimeTracking() {
	appx.context.$gameTime++;

	if (appx.currentView == ENUM('score')) {
		var display = document.getElementsByClassName("header")[0];
		display.innerHTML = IntToTimeStr(appx.context.$gameTime, true);
	}
}

'static'; function RenderScore() {
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

	var board = PageTemplate(appx.canvas, appx.advctx.$useTimeTracking ? IntToTimeStr(appx.context.$gameTime, true) : "", [
		new ButtonTemplate(TEXT_WHO_STARTS, () => { appx.toggleView(ENUM('dice')); }),
		new ButtonTemplate(TEXT_TIMER,      () => { appx.toggleView(ENUM('timer')); }),
		new ButtonTemplate(TEXT_SETTINGS,   () => { 
			appx.backupContext();
			appx.toggleView(ENUM('settings'));
		})
	], ID('CacheScoreToolbar'));
	board.dom.className = ''; // Remove dark background
	RenderBoard(board);
}

'static'; function RenderBoard(canvas) {
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
			[ENUM('Score'), ENUM('Subscore')].forEach(item => {
				// ID is 'SContainer' + (score|subscore) + pid
				var display = canvas.add(x * ITEM_WIDTH, y * ITEM_HEIGHT, ITEM_WIDTH, ITEM_HEIGHT, 'div', ID('SContainer') + item + pid);
				display.setColor(appx.context.$players[pid].color);
				RenderDisplay(pid, display, item);
			});
			// By default, hide subscore
			GetDOM(ID('SContainer') + ENUM('Subscore') + pid).style.display = 'none';

			// Add a swap button if subscore is enabled
			if (appx.advctx.$useSubscore && ((i) => {
				var swap = canvas.add((x + 0.45) * ITEM_WIDTH, y * ITEM_HEIGHT, ITEM_WIDTH * 0.1, ITEM_HEIGHT * 0.15, 'button');
				var fontSize = ReadFontSizeCache(swap, 1, 1, '⇄', ID('CacheScoreAuxSymbol'));
				swap.setText('⇄', false, fontSize);
				swap.onClick(() => {
					var subscore = GetDOM(ID('SContainer') + ENUM('Subscore') + i).style;
					var score = GetDOM(ID('SContainer') + ENUM('Score') + i).style.display = subscore.display;
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
	var which = (type == ENUM('Score') ? 'score' : 'subscore'); // Used for indexing into context
	var FONT_SIZE = ReadFontSizeCache(canvas, 0.25, 1, 'XX', ID('CacheScoreDisplay'), 250);
	var players = appx.context.$players;

	// Create display canvas
	var score = canvas.add(0.25, 0, 0.5, 1, 'div', ID('DOMDisplay') + which + id);
	score.dom.style.fontSize = FONT_SIZE + 'px';
	if (type == ENUM('Subscore')) score.addClass('outline'); // Use different font style for subscore

	// Create -/+ buttons
	['-', '+'].forEach((str, ind) => {
		var dom = canvas.add(0.75 * ind, 0, 0.25, 1, 'button');
		dom.setText(str, false, FONT_SIZE);
		// Can directly index using which
		dom.onClick(() => { ModifyScore(players, id, parseInt(str + '1'), false, which); });
		dom.addClass('score_btn');
	});
	
	// Add a show button if score history is enabled
	if (appx.advctx.$useScoreHistory) {
		var hist = canvas.add(0.45, 0.85, 0.1, 0.15, 'button');
		var fontSize = ReadFontSizeCache(hist, 1, 1, '⇄', ID('CacheScoreAuxSymbol'));
		hist.setText('☰', false, fontSize);
		hist.onClick(() => {
			if(SCORE_TIMEOUT_HANDLE) {
				clearTimeout(SCORE_TIMEOUT_HANDLE);
				LogScoreHistory();
			}

			var modalWidth = appx.canvas.width * 0.9 > 500 ? 500 / appx.canvas.width : 0.9; // Modal window must be max 500px wide or 90% wide
			OpenModal("Player " + (id + 1) + ' ' + which + ' history:', appx.context.$players[id][SCORE_HISTORY_SLOT[which == 'score'? 1 : 0]], modalWidth, 0.8);
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

	GetDOM(ID('DOMDisplay') + which + id).innerHTML = players[id][which];
}
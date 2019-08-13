'static'; function RenderScore() {
	var board = PageTemplate(appx.canvas, "", [
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
	var playersLength = appx.context.players.length;
	
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
				display.setColor(appx.context.players[pid].color);
				RenderDisplay(pid, display, item);
			});
			// By default, hide subscore
			GetDOM(ID('SContainer') + ENUM('Subscore') + pid).style.display = 'none';

			// Add a swap button if subscore is enabled
			if (appx.advctx.useSubscore && ((i) => {
				var swap = canvas.add((x + 0.65) * ITEM_WIDTH, y * ITEM_HEIGHT, ITEM_WIDTH * 0.1, ITEM_HEIGHT * 0.15, 'button');
				swap.setText('⇄', true);
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
	var players = appx.context.players;

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

	// Can directly index using which
	ModifyScore(players, id, players[id][which], true, which);
}

'static'; function ModifyScore(players, id, amount, forceAssign, which) {
	players[id][which] = (forceAssign ? 0 : parseInt(players[id][which])) + amount;
	
	GetDOM(ID('DOMDisplay') + which + id).innerHTML = players[id][which];
}
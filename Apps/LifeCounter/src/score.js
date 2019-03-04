'static'; function RenderScore() {
	var board = PageTemplate(appx.canvas, "", [
		new ButtonTemplate(TEXT_WHO_STARTS, () => { appx.toggleView(ENUM('dice')); }),
		new ButtonTemplate(TEXT_TIMER,      () => { appx.toggleView(ENUM('timer')); }),
		new ButtonTemplate(TEXT_SETTINGS,   () => { appx.toggleView(ENUM('settings')); })
	], ID('CacheScoreToolbar'));
	board.dom.className = '';
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
			
			var display = canvas.add(x * ITEM_WIDTH, y * ITEM_HEIGHT, ITEM_WIDTH, ITEM_HEIGHT);
			display.setColor(appx.context.players[pid].color);
			RenderDisplay(pid, display);
			
			pid++;
			if (playersLength == pid) return;
		}
	}
}

'static'; function RenderDisplay(id, canvas) {
	var FONT_SIZE = ReadFontSizeCache(canvas, 0.25, 1, 'XX', ID('CacheScoreDisplay'), 250);
	var players = appx.context.players;

	var score = canvas.add(0.25, 0, 0.5, 1, 'div', ID('DOMDisplayScore') + id);
	score.dom.style.fontSize = FONT_SIZE + 'px';

	// Create -/+ buttons
	['-', '+'].forEach((str, ind) => {
		var dom = canvas.add(0.75 * ind, 0, 0.25, 1, 'button');
		dom.setText(str, false, FONT_SIZE);
		dom.onClick(() => { ModifyScore(players, id, parseInt(str + '1')); });
		dom.addClass('score_btn');
	});

	ModifyScore(players, id, players[id].score, true);
}

'static'; function ModifyScore(players, id, amount, forceAssign) {
	var forceAssign = DefaultArgument(forceAssign, false);
	
	players[id].score = (forceAssign ? 0 : parseInt(players[id].score)) + amount;
	
	GetDOM(ID('DOMDisplayScore') + id).innerHTML = players[id].score;
}
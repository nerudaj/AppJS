'static'; function RenderScore() {
	var board = PageTemplate(app.canvas, "", [
		new ButtonTemplate(TEXTS.whoStarts, () => { app.toggleView(ENUM('dice')); }),
		new ButtonTemplate(TEXTS.timer,     () => { app.toggleView(ENUM('timer')); }),
		new ButtonTemplate(TEXTS.settings,  () => { app.toggleView(ENUM('settings')); })
	], ID('CacheScoreToolbar'));
	board.dom.className = '';
	RenderBoard(board);
}

'static'; function RenderBoard(canvas) {
	var playersLength = app.context.players.length;
	
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
			display.setColor(app.context.players[pid].color);
			RenderDisplay(pid, display);
			
			pid++;
			if (playersLength == pid) return;
		}
	}
}

'static'; function RenderDisplay(id, canvas) {
	var FONT_SIZE = ReadFontSizeCache(canvas, 0.25, 1, 'XX', ID('CacheScoreDisplay'), 250);
	
	var score = canvas.add(0.25, 0, 0.5, 1, 'div', ID('DOMDisplayScore') + id);
	score.dom.style.fontSize = FONT_SIZE + 'px';
	
	var minus = canvas.add(0, 0, 0.25, 1, 'button');
	minus.setText('−', false, FONT_SIZE);
	minus.onClick(() => { ModifyScore(app.context.players, id, -1); });
	minus.addClass('score_btn');
	
	var plus = canvas.add(0.75, 0, 0.25, 1, 'button');
	plus.setText('+', false, FONT_SIZE);
	plus.onClick(() => { ModifyScore(app.context.players, id, 1); });
	plus.addClass('score_btn');
	
	ModifyScore(app.context.players, id, app.context.players[id].score, true);
}

'static'; function ModifyScore(players, id, amount, forceAssign) {
	var forceAssign = DefaultArgument(forceAssign, false);
	
	players[id].score = (forceAssign ? 0 : parseInt(players[id].score)) + amount;
	
	GetDOM(ID('DOMDisplayScore') + id).innerHTML = players[id].score;
}
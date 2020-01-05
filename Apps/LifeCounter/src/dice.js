'static'; var LAST_USED_FUNCTION = ThrowDice;

'static'; function RenderDice() {
	// Render page template and obtain reference to main drawing board
	// Construct toolbar buttons in place of a function argument
	var board = PageTemplate(appx.canvas, TEXT_WHO_STARTS, [
		new ButtonTemplate(TEXT_THROW_DICE, () => {
			LAST_USED_FUNCTION = ThrowDice;
			RandomizationAnimation();
		}),
		new ButtonTemplate(TEXT_TOSS_COIN, () => {
			LAST_USED_FUNCTION = TossCoin;
			RandomizationAnimation();
		}),
		new ButtonTemplate(TEXT_WHOLL_START, () => {
			LAST_USED_FUNCTION = PickFirstPlayer;
			RandomizationAnimation();
		}),
		new ButtonTemplate(TEXT_BACK, () => {
			appx.toggleView(ENUM('score'));
		})
	], ID('CacheDiceToolbar'));
	
	var HISTORY_HEIGHT = (appx.advctx.$useThrowHistory ? 0.1 : 0);
	var DISPLAY_HEIGHT = 1 - HISTORY_HEIGHT;

	// Render throw display
	board.onClick(() => { RandomizationAnimation(); });
	var display = board.add(0, 0, 1, DISPLAY_HEIGHT, 'div', ID('DOMThrowResultBoard'));

	// Needs to be recomputed each time this screen is accessed (variable number of dices)
	var FONT_SIZE = GetOptimalFontSize(
		longestStr([TEXT_DICE_SIDES[0].repeat(appx.context.$diceCount + 1)].concat(TEXT_COIN_SIDES)),
		board.width,
		board.height,
		Math.min(board.width, board.height)
	);
	display.setText("??", false, FONT_SIZE);

	// Render history
	if (appx.advctx.$useThrowHistory) {
		var hist = board.add(0, DISPLAY_HEIGHT, 1, HISTORY_HEIGHT, 'div', ID('DOMHistoryDisplay'));
		var HFONT_SIZE = ReadFontSizeCache(hist, 1, 1, 'Lorem ipsum dolor sit amet', ID('CacheHistoryDisplay'), 150);
		hist.setText('', false, HFONT_SIZE);
		// Set text bypasses interpretation of HTML tags which may be part of history since Who'll start update
		GetDOM(ID('DOMHistoryDisplay')).innerHTML = appx.context.$history; // This fixes it
		hist.addClass('align_left');
		hist.addClass('nowrap');
	}
}

'static'; function RandomizationAnimation() {
	GetDOM(ID('DOMThrowResultBoard')).innerHTML = '...';
	setTimeout(() => { 
		LAST_USED_FUNCTION(); 
	}, 500);
}

'static'; function ThrowDice() {
	var sum = 0;
	var output = '';
	for (var i = 0; i < appx.context.$diceCount; i++) {
		var throwResult = Random(0, 6);
		output += TEXT_DICE_SIDES[(throwResult)];
		sum += throwResult + 1;
	}

	GetDOM(ID('DOMThrowResultBoard')).innerHTML = output;
	UpdateHistory(output + '(' + sum + ')');
}

'static'; function TossCoin() {
	var throwResult = TEXT_COIN_SIDES[Random(0, 2)];

	GetDOM(ID('DOMThrowResultBoard')).innerHTML = throwResult;
	UpdateHistory(throwResult);
}

'static'; function PickFirstPlayer() {
	var players = appx.context.$players;
	var playerCount = players.length;
	var firstPlayer = Random(0, playerCount);
	var result = "<span style='color:" + players[firstPlayer].color + "'>■</span>";
	GetDOM(ID('DOMThrowResultBoard')).innerHTML = result;
	UpdateHistory(result);
}

'static'; function UpdateHistory(str) {
	// If history is disabled, return
	if (!appx.advctx.$useThrowHistory) return;

	var context = appx.context;

	// Compute new history - limit number of characters to remember
	context.$history = str + (context.$history ? ', ' : '') + context.$history.substr(0, 1024);

	// Write to DOM
	GetDOM(ID('DOMHistoryDisplay')).innerHTML = context.$history;
}
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
		new ButtonTemplate(TEXT_BACK, () => {
			appx.toggleView(ENUM('score'));
		})
	], ID('CacheDiceToolbar'));
	
	var HISTORY_HEIGHT = (appx.context.useHistory ? 0.1 : 0);
	var DISPLAY_HEIGHT = 1 - HISTORY_HEIGHT;

	// Render throw display
	board.onClick(() => { RandomizationAnimation(); });
	var display = board.add(0, 0, 1, DISPLAY_HEIGHT, 'div', ID('DOMThrowResultBoard'));

	// Needs to be recomputed each time this screen is accessed (variable number of dices)
	var FONT_SIZE = GetOptimalFontSize(
		longestStr([TEXT_DICE_SIDES[0].repeat(appx.context.diceCount), TEXT_COIN1, TEXT_COIN2]),
		board.width,
		board.height,
		Math.min(board.width, board.height)
	);
	display.setText("??", false, FONT_SIZE);

	// Render history
	if (appx.context.useHistory) {
		var history = board.add(0, DISPLAY_HEIGHT, 1, HISTORY_HEIGHT, 'div', ID('DOMHistoryDisplay'));
		var HFONT_SIZE = ReadFontSizeCache(history, 1, 1, 'Lorem ipsum dolor sit amet', ID('CacheHistoryDisplay'), 150);
		history.setText(appx.context.history, false, HFONT_SIZE);
		history.addClass('align_left');
		history.addClass('nowrap');
	}
}

'static'; function RandomizationAnimation() {
	GetDOM(ID('DOMThrowResultBoard')).innerHTML = '...';
	setTimeout(() => { 
		LAST_USED_FUNCTION(); 
		UpdateHistory();
	}, 500);
}

'static'; function ThrowDice() {
	var dom = GetDOM(ID('DOMThrowResultBoard'));
	dom.innerHTML = '';
	for (var i = 0; i < appx.context.diceCount; i++) {
		dom.innerHTML += TEXT_DICE_SIDES[(Random(1, 6) - 1)];
	}
}

'static'; function TossCoin() {
	var COIN_SIDES = [TEXT_COIN1, TEXT_COIN2];
	
	GetDOM(ID('DOMThrowResultBoard')).innerHTML = COIN_SIDES[Random(1, 2) - 1];
}

'static'; function UpdateHistory() {
	var context = appx.context;

	// If history is disabled, return
	if (!context.useHistory) return;

	// Initialize delimiter
	var delim = "";
	if (context.history) delim = ", ";

	// Compute new history - limit number of characters to remember
	context.history = GetDOM(ID('DOMThrowResultBoard')).innerHTML + delim + context.history.substr(0, 1024);

	// Write to DOM
	GetDOM(ID('DOMHistoryDisplay')).innerHTML = context.history;
}
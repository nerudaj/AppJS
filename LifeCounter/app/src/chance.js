'static'; var LAST_USED_FUNCTION = ThrowDice;

'static'; function RenderPageChance(canvas) {
	var HISTORY_HEIGHT = (appx.advctx.$useThrowHistory ? 0.1 : 0);
	var DISPLAY_HEIGHT = 1 - HISTORY_HEIGHT;

	// Render throw display
	canvas.OnClick(() => { RandomizationAnimation(); });
	var display = canvas.AddElem(0, 0, 1, DISPLAY_HEIGHT, 'div', ID('DOMThrowResultBoard'));

	// Needs to be recomputed each time this screen is accessed (variable number of dices)
	var fontSize = ReadFontSizeCache(
		canvas,
		LongestString([TEXT_DICE_SIDES[0].repeat(appx.context.$diceCount + 1)].concat([TEXT_COIN_SIDES[0]])),
		ID('CacheChanceDisplay')
	);
	display.SetText("??", fontSize);

	// Render history
	if (appx.advctx.$useThrowHistory) {
		var hist = canvas.AddElem(0, DISPLAY_HEIGHT, 1, HISTORY_HEIGHT, 'div', ID('DOMChanceHistory'));
		var fontSize = ReadFontSizeCache(hist, 'Lorem ipsum dolor sit amet', ID('CacheChanceHistory'));
		hist.SetText(appx.context.$history, fontSize);
		hist.AddClass('align_left');
		hist.AddClass('nowrap');
	}
}

'static'; function RandomizationAnimation() {
	$(ID('DOMThrowResultBoard')).innerHTML = '...';
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

	$(ID('DOMThrowResultBoard')).innerHTML = output;
	UpdateHistory(output + '(' + sum + ')');
}

'static'; function TossCoin() {
	var throwResult = TEXT_COIN_SIDES[Random(0, 2)];

	$(ID('DOMThrowResultBoard')).innerHTML = throwResult;
	UpdateHistory(throwResult);
}

'static'; function PickFirstPlayer() {
	var players = appx.context.$players;
	var firstPlayer = Random(0, players.length);

	var result = GetPlayerColorAsSymbol(players[firstPlayer].color);
	$(ID('DOMThrowResultBoard')).innerHTML = result;

	UpdateHistory(result);
}

'static'; function UpdateHistory(str) {
	// If history is disabled, return
	if (!appx.advctx.$useThrowHistory) return;

	var context = appx.context;

	// Compute new history - limit number of characters to remember
	context.$history = str + (context.$history ? ', ' : '') + context.$history.substr(0, 1024);

	// Write to DOM
	$(ID('DOMChanceHistory')).innerHTML = context.$history;
}
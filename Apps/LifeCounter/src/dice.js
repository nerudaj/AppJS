'static'; var LAST_USED_FUNCTION = ThrowDice;

'static'; function RenderDice() {
	// Render page template and obtain reference to main drawing board
	// Construct toolbar buttons in place of a function argument
	var board = PageTemplate(app.canvas, TEXTS.whoStarts, [
		new ButtonTemplate(TEXTS.throwDice, () => {
			LAST_USED_FUNCTION = ThrowDice;
			RandomizationAnimation();
		}),
		new ButtonTemplate(TEXTS.tossCoin, () => {
			LAST_USED_FUNCTION = TossCoin;
			RandomizationAnimation();
		}),
		new ButtonTemplate(TEXTS.back, () => {
			app.toggleView(ENUM('score'));
		})
	], ID('CacheDiceToolbar'));
	
	// Render throw display
	board.onClick(() => { RandomizationAnimation(); });
	var display = board.add(0, 0, 1, 1, 'div', ID('DOMThrowResultBoard'));
	
	var FONT_SIZE = ReadFontSizeCache(display, 1, 1, '⚀⚀⚀', ID('CacheThrowDisplay'), Math.min(board.width, board.height));
	display.setText("??", false, FONT_SIZE);
}

'static'; function RandomizationAnimation() {
	GetDOM(ID('DOMThrowResultBoard')).innerHTML = '...';
	setTimeout(() => { LAST_USED_FUNCTION(); }, 500);
}

'static'; function ThrowDice() {
	var DICE_SIDES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

	var dom = GetDOM(ID('DOMThrowResultBoard'));
	dom.innerHTML = '';
	for (var i = 0; i < 3; i++) {
		dom.innerHTML += DICE_SIDES[(Random(1, 6) - 1)];
	}
}

'static'; function TossCoin() {
	var COIN_SIDES = [TEXTS.coin1, TEXTS.coin2];
	
	var dom = GetDOM(ID('DOMThrowResultBoard'));
	dom.innerHTML = COIN_SIDES[Random(1, 2) - 1];
}
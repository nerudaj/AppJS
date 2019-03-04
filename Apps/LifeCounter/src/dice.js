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
	var COIN_SIDES = [TEXT_COIN1, TEXT_COIN2];
	
	var dom = GetDOM(ID('DOMThrowResultBoard'));
	dom.innerHTML = COIN_SIDES[Random(1, 2) - 1];
}
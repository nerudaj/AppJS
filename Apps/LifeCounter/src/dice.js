'static'; var LAST_USED_FUNCTION = ThrowDice;

'static'; function RenderDice() {
	var canvas = this.app.canvas;

	RenderHeaderTemplate(canvas, TEXTS.whoStarts);
	
	var board = GetDrawingTemplate(canvas);
	RenderThrowDisplay(board);
	
	// Render toolbar
	var buttons = [
		new ButtonTemplate(TEXTS.throwDice, function() {
			LAST_USED_FUNCTION = ThrowDice;
			RandomizationAnimation();
		}),
		new ButtonTemplate(TEXTS.tossCoin, function() {
			LAST_USED_FUNCTION = TossCoin;
			RandomizationAnimation();
		}),
		new ButtonTemplate(TEXTS.back, function() {
			app.toggleView(ENUM('score'));
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('CacheDiceToolbar'));
}

'static'; function RenderThrowDisplay(canvas) {
	canvas.addEventCallback('click', function() { RandomizationAnimation(); });
	var display = canvas.add(0, 0, 1, 1, 'div', ID('DOMThrowResultBoard'));
	
	var FONT_SIZE = ReadFontSizeCache(display, 1, 1, '⚀⚀⚀', ID('CacheThrowDisplay'), Math.min(canvas.width, canvas.height));
	display.setText("??", false, FONT_SIZE);
}

'static'; function RandomizationAnimation() {
	GetDOM(ID('DOMThrowResultBoard')).innerHTML = '...';
	setTimeout(function() { LAST_USED_FUNCTION(); }, 500);
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
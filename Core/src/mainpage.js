'static'; function RenderMainPage() {
	var board = PageTemplate(appx.canvas, 'Header of the page', [
		new ButtonTemplate('Nothing', function() {}),
		new ButtonTemplate('Useless', function() {})
	], ID('toolbar_button_cache'));
	board.setText('Hello world');
}
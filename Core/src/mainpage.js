'static'; function RenderMainPage() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, 'Header of the page');
	
	var board = GetDrawingTemplate(canvas);
	board.setText('Hello world');
	
	var buttons = [
		new ButtonTemplate('Nothing', function() {}),
		new ButtonTemplate('Useless', function() {})
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
}
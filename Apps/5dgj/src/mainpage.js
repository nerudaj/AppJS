'static'; function RenderMainPage() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, '5min Design Game Jam');
	
	var board = GetDrawingTemplate(canvas);
	board.setText('Hello world');
	
	var buttons = [
		new ButtonTemplate('Start the challenge', function() {
			app.toggleView(ENUM('challenge'));
		}),
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
}
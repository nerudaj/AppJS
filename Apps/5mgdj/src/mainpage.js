'static'; function RenderMainPage() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, '5 Minute Game Design Jam');
	
	var board = GetDrawingTemplate(canvas);
	board.setText('Hello world');
	
	var buttons = [
		new ButtonTemplate('Start the challenge', function() {
			clearContext(app.context);
			app.toggleView(ENUM('challenge'));
		}),
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
}
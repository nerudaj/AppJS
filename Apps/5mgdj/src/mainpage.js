'static'; function RenderMainPage() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, '5 Minute Game Design Jam');
	
	var board = GetDrawingTemplate(canvas);
	console.log(board.width + " " + board.height);
	board.setParagraph('Welcome to 5 Minute Game Design Jam!<br>Can you make a pitch of a game in 5 minutes? Let\'s see...<br><br>Rules: you must use the required design pattern and somehow conform to chosen restriction. You can spice up things with optional modifier.', true);
	
	var buttons = [
		new ButtonTemplate('Start the challenge', function() {
			clearContext(app.context);
			app.toggleView(ENUM('challenge'));
		}),
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
}
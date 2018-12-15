'static'; function RenderHintPage() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, "Hints");
	
	var board = GetDrawingTemplate(canvas);
	board.dom.innerHTML='<ul><li>Math.PI(x)</li><li>Math.sqrt(x)</li><li>Math.sin(x)</li><li>Math.cos(x)</li><li>Math.abs(x)</li><li>SmoothStart(x, level)</li><li>SmoothStop(x, level)</li><li>Flip(x)</li><li>Crossfade(a, b, x)</li></ul>';
	
	var buttons = [
		new ButtonTemplate('Back', function() {
			app.toggleView('mainpage');
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
}
'static'; var PATTERNS = [
	'Collecting',
	'Cooperation',
	'Driving',
	'Evasion',
	'Exploration',
	'Guessing',
	'Lives',
	'Looting',
	'Pattern matching',
	'Reflexes',
	'Resource management',
	'Role playing',
	'Score',
	'Shooting',
	'Swapping',
	'Tile placement',
];
'static'; var RESTRICTIONS = [
	'Card',
	'Cube',
	'Death is not game over',
	'Dice',
	'Hexes',
	'No enemies',
	'No points',
	'One button',
	'Quests',
];

'static'; function RenderChallengePage() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, 'XX:XX');
	
	var board = GetDrawingTemplate(canvas);
	
	// Labels
	AddLabelAndValue(board, 0, 'Pattern:', PATTERNS);
	AddLabelAndValue(board, 0.1, 'Restriction:', RESTRICTIONS);
	AddLabelAndValue(board, 0.2, 'Modifier:', PATTERNS.concat(RESTRICTIONS));
	
	// Create textbox
	var text = board.add(0.05, 0.35, 0.9, 0.6, 'textarea', ID('TextInput'));
	
	var buttons = [
		new ButtonTemplate('Submit', function() {}),
		new ButtonTemplate('Back', function() {
			stopTimer(app);
			app.toggleView(ENUM('mainpage'));
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
	
	if (this.app.context.handle == null) {
		startTimer(this.app);
	}
}

'static'; function AddLabelAndValue(canvas, yoffset, labelstr, array) {
	// TODO: fontCache
	
	var label = canvas.add(0, yoffset, 0.4, 0.1);
	label.setText(labelstr, true);
	
	// Get random string
	var str = array[Random(0, array.length)];
	
	var text = canvas.add(0.4, yoffset, 0.6, 0.1);
	text.setText(str, true);
}

'static'; function startTimer(app) {
	var context = app.context;
	
	context.timer = 5 * 60;
	
	context.handle = setInterval(function() {
		updateTimer(app);
	}, 1000);
}

'static'; function updateTimer(app) {
	var context = app.context;
	
	context.timer--;
	if (context.timer == 0) {
		GetDOM(ID('PageHeader')).innerHTML = 'END!';
		stopTimer(app);
		return;
	}
	
	printTimer(context.timer);
}

'static'; function stopTimer(app) {
	var context = app.context;
	
	clearInterval(context.handle);
	context.handle = null;
}

'static'; function printTimer(value) {
	// TODO: Format
	GetDOM(ID('PageHeader')).innerHTML = value;
}
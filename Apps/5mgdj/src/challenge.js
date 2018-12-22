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
	var app = this.app;
	var context = app.context;
	var canvas = app.canvas;
	
	RenderHeaderTemplate(canvas, 'Timer 05:00');
	
	var board = GetDrawingTemplate(canvas);
	
	// Setup pattern/restrict/mod
	if (context.pattern == -1) {
		context.pattern = RandomItemFromArray(PATTERNS);
		context.restrict = RandomItemFromArray(RESTRICTIONS);
		context.mod = RandomItemFromArray(PATTERNS.concat(RESTRICTIONS));
	}
	
	// Labels
	AddLabelAndValue(board, 0, 'Pattern:', context.pattern);
	AddLabelAndValue(board, 0.1, 'Restriction:', context.restrict);
	AddLabelAndValue(board, 0.2, 'Modifier:', context.mod);
	
	// Create textbox
	var text = board.add(0.05, 0.35, 0.9, 0.6, 'textarea', ID('TextInput'));
	text.addEventCallback("keyup", function() {
		context.pitch = GetDOM(ID('TextInput')).value;
	});
	text.dom.value = context.pitch;
	text.dom.style.resize = 'none';
	text.dom.style.outline = 'none';
	text.dom.style.background = 'rgb(31, 31, 31)';
	text.dom.style.color = 'rgb(176, 176, 176)';
	text.dom.style.border = '1px solid rgb(176, 176, 176)';
	
	var buttons = [
		new ButtonTemplate('Submit', function() {}),
		new ButtonTemplate('Back', function() {
			stopTimer(app);
			app.toggleView(ENUM('mainpage'));
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
	
	if (context.handle == null) {
		startTimer(app);
	}
}

'static'; function RandomItemFromArray(array) {
	return array[Random(0, array.length)];
}

'static'; function AddLabelAndValue(canvas, yoffset, labelstr, textstr) {
	// TODO: fontCache
	
	var label = canvas.add(0, yoffset, 0.4, 0.1);
	label.setText(labelstr, true);
	
	var text = canvas.add(0.4, yoffset, 0.6, 0.1);
	text.setText(textstr, true);
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

'static'; function printTimer(t) {
	var seconds = '0' + String(t % 60);
	var minutes = '0' + String(Math.floor(t / 60));

	GetDOM(ID('PageHeader')).innerHTML = 'Timer: ' + minutes.slice(-2) + ':' + seconds.slice(-2);
}
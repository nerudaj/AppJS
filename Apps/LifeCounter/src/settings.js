'static'; var MinPlayers = 2;
'static'; var MaxPlayers = 6;
var Colors = [ 'red', 'lightgreen', 'lightblue', 'yellow', 'pink', 'orange', 'grey', '#f5f5f5' ];

'static'; var TMP_PlayerCount = 4;
'static'; var TMP_PlayerColors = [ 0, 1, 2, 3, 4, 5 ];
'static'; var TMP_InitScore = 0;

'static'; function RenderSettings() {
	var canvas = app.canvas;
	
	// Render header
	RenderHeaderTemplate(canvas, TEXTS.settings);
	
	// Render main
	var board = GetDrawingTemplate(canvas);
	RenderSettingsBoard(board);
	
	// Render toolbar
	var buttons = [
		new ButtonTemplate(TEXTS.apply, () => {
			ApplySettings();
			app.toggleView(ENUM('score'));
		}),
		new ButtonTemplate(TEXTS.back, () => {
			RestoreTemporaries();
			app.toggleView(ENUM('score'));
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('CacheSettingsToolbar'));
}

// *** TOP level ***
'static'; function RenderSettingsBoard(canvas) {
	// Render labels
	var LABEL_WIDTH = 0.6;
	var LABEL_HEIGHT = 0.1;
	var labels = [ TEXTS.plCount, TEXTS.initScore ];
	var LABEL_FONT_SIZE = ReadFontSizeCache(
		canvas,
		LABEL_WIDTH,
		LABEL_HEIGHT,
		maxStr(labels[0], labels[1]),
		ID('CacheSettingsLabel')
	);
	
	for (var i = 0; i < labels.length; i++) {
		var label = canvas.add(0, i * LABEL_HEIGHT, LABEL_WIDTH, LABEL_HEIGHT);
		label.addClass('align_left');
		label.setText(labels[i], false, LABEL_FONT_SIZE);
	}
	
	var ALT_LABEL_HEIGHT = 1 / 9;
	// Render colors label
	var lcols = canvas.add(0, 2 * ALT_LABEL_HEIGHT, 1, ALT_LABEL_HEIGHT);
	lcols.dom.style.fontWeight = 'bold';
	lcols.setText(TEXTS.plColors, false, LABEL_FONT_SIZE);
	
	// Render each form
	var pcount = canvas.add(LABEL_WIDTH, 0, 1 - LABEL_WIDTH, LABEL_HEIGHT, 'select');
	RenderFormPlayerCount(pcount);
	
	var initscore = canvas.add(LABEL_WIDTH, LABEL_HEIGHT, 1 - LABEL_WIDTH, LABEL_HEIGHT, 'input', ID('DOMInitScoreInput'));
	RenderFormInitScore(initscore);
	
	var colorwheel = canvas.add(0, 3 * ALT_LABEL_HEIGHT, 1, 6 * ALT_LABEL_HEIGHT);
	RenderFormPlayerColors(colorwheel);
}

'static'; function ApplySettings() {
	var context = app.context;
	var players = context.players;
	
	context.numOfPlayers = TMP_PlayerCount;
	
	while (context.numOfPlayers < players.length) players.pop();
	while (context.numOfPlayers > players.length) players.push(new ClassPlayer());
	
	for (var i = 0; i < players.length; i++) {
		context.colorSetup[i] = TMP_PlayerColors[i];
		players[i].color = Colors[TMP_PlayerColors[i]];
		players[i].score = parseInt(TMP_InitScore);
	}
	
	context.initScore = parseInt(TMP_InitScore);
}

'static'; function RestoreTemporaries() {
	var context = app.context;

	TMP_PlayerCount = context.numOfPlayers;
	
	for (var i = 0; i < MaxPlayers; i++) {
		TMP_PlayerColors[i] = context.colorSetup[i];
	}
	
	TMP_InitScore = context.initScore;
}

// *** Second level ***
'static'; function RenderFormPlayerCount(canvas) {
	for (var i = MinPlayers; i <= MaxPlayers; i++) {
		(function(p) {
			var option = canvas.add(0, 0, 1, 1, 'option');
			option.value = i;
			option.setText(i);
			option.onClick(() => {
				TMP_PlayerCount = p;
				app.toggleView(ENUM('settings'));
			});
			if (p == TMP_PlayerCount) {
				option.dom.selected = 'selected';
			}
		}(i));
	}
}

'static'; function RenderFormInitScore(canvas) {
	canvas.dom.type = 'number';
	canvas.dom.value = TMP_InitScore;
	canvas.addEventCallback('input', () => { // either 'change' or 'input' are valid
		if (canvas.dom.validity.valid) {
			TMP_InitScore = canvas.dom.value;
		}
	});
	canvas.dom.autocomplete = 'off';
}

'static'; function RenderFormPlayerColors(canvas) {
	var COL_WIDTH = 1 / Colors.length;
	var ROW_HEIGHT = 1 / MaxPlayers;
	
	for (var i = 0; i < TMP_PlayerCount; i++) {
		for (var p = 0; p < Colors.length; p++) {
			(function(player, color) {
				var option = canvas.add(color * COL_WIDTH, player * ROW_HEIGHT, COL_WIDTH, ROW_HEIGHT);
				option.setColor(Colors[color]);
				
				var checked = '';
				if (TMP_PlayerColors[player] == color) {
					checked = 'checked';
				}
				
				option.dom.innerHTML = '<input type="radio" name="' + ID('FormPlayerColor') + player + '" value="' + color + '" ' + checked + '>';

				// Add TMP updater event
				option.onClick(function() {
					TMP_PlayerColors[player] = color;
				});
			}(i, p));
		}
	}
}
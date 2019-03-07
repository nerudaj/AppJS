'static'; var MinPlayers = 2;
'static'; var MaxPlayers = 8;
'static'; var Colors = [ 'red', 'lightgreen', 'lightblue', 'yellow', 'pink', 'orange', 'grey', '#f5f5f5' ];

'static'; function RenderSettings() {
	// Render page template and obtain reference to main drawing board
	// Craft buttons in place of function argument
	var board = PageTemplate(appx.canvas, TEXT_SETTINGS, [
		new ButtonTemplate(TEXT_APPLY, () => {
			ApplySettings(); // Some post process has to be done
			appx.toggleView(ENUM('score'));
		}),
		new ButtonTemplate(TEXT_BACK, () => {
			appx.rollbackContext();
			appx.toggleView(ENUM('score'));
		})
	], ID('CacheSettingsToolbar'));
	
	// Board will be scrollable
	board.addClass('scrollable');
	
	// Create huge canvas inside, scrolling
	// plCountSelect + initScore + useSubscore + ?initSubscore + plCount
	// But at least 9 rows
	var rowCount = Math.max(appx.context.numOfPlayers + appx.context.useSubscore + 3, 9);
	var content = board.add(0, 0, 1, rowCount / 9); // Single label is always 1/9 of board height
	
	RenderSettingsBoard(content, rowCount);
}

// *** TOP level ***
'static'; function RenderSettingsBoard(canvas, rowCount) {
	// Prepare variables
	var LABEL_WIDTH  = 0.6;
	var LABEL_HEIGHT = 1 / rowCount;
	
	// Declare available options (and filter hidden ones)
	var options = [
		[RenderFormPlayerCount, 'select', '', TEXT_PL_COUNT],
		[RenderNumericInput,    'input',  'initScore', TEXT_INIT_SCORE],
		[RenderCheckboxInput,   'input',  'useSubscore', TEXT_USE_SUBSCR],
		(appx.context.useSubscore ? [RenderNumericInput, 'input', 'initSubscore', TEXT_INIT_SUBSCR] : null)
	].filter(i => i);
	
	console.log(options.map(o => o[3]));
	console.log(longestStr(options.map(o => o[3])));
	
	// Get current cached font size
	var LABEL_FONT_SIZE = ReadFontSizeCache(
		canvas,
		LABEL_WIDTH,
		LABEL_HEIGHT,
		longestStr(options.map(o => o[3])),
		ID('CacheSettingsLabel')
	);
	
	// And render them
	options.forEach((input, index) => {
		var label = canvas.add(0, index * LABEL_HEIGHT, LABEL_WIDTH, LABEL_HEIGHT);
		label.addClass('align_left');
		label.setText(input[3], false, LABEL_FONT_SIZE);
		
		var dom = canvas.add(LABEL_WIDTH, index * LABEL_HEIGHT, 1 - LABEL_WIDTH, LABEL_HEIGHT * 0.9, input[1]);
		input[0](dom, input[2]);
	});
	
	// Render colors label - must be done differently
	var hskip = options.length;
	var lcols = canvas.add(0, hskip++ * LABEL_HEIGHT, 1, LABEL_HEIGHT);
	lcols.dom.style.fontWeight = 'bold';
	lcols.setText(TEXT_PL_COLORS, false, LABEL_FONT_SIZE);
	
	// Render color wheel
	var colorwheel = canvas.add(0, hskip * LABEL_HEIGHT, 1, appx.context.numOfPlayers * LABEL_HEIGHT);
	RenderFormPlayerColors(colorwheel);
}

// *** Second level ***
'static'; function RenderFormPlayerCount(canvas) {
	for (var i = MinPlayers; i <= MaxPlayers; i++) {
		(function(p) {
			var option = canvas.add(0, 0, 1, 1, 'option');
			option.value = i;
			option.setText(i);
			option.onClick(() => {
				appx.context.numOfPlayers = p;
				appx.toggleView(ENUM('settings')); // <--- problem
			});
			if (p == appx.context.numOfPlayers) {
				option.dom.selected = 'selected';
			}
		}(i));
	}
}

'static'; function RenderNumericInput(canvas, ctxitem) {
	// Setup dom
	canvas.dom.type = 'number';
	canvas.dom.value = appx.context[ctxitem];
	canvas.dom.autocomplete = 'off';
	
	// Set callback for updating context
	canvas.addEventCallback('input', () => {
		if (canvas.dom.validity.valid) {
			appx.context[ctxitem] = canvas.dom.value;
		}
	});
}

'static'; function RenderCheckboxInput(canvas, ctxitem) {
	canvas.dom.type = 'checkbox';
	canvas.dom.checked = appx.context[ctxitem];
	
	// Set callback for updating context
	canvas.onClick(() => {
		appx.context[ctxitem] = !appx.context[ctxitem];
		appx.toggleView('settings');
	});
}

'static'; function RenderFormPlayerColors(canvas) {
	var COL_WIDTH  = 1 / Colors.length;
	var ROW_HEIGHT = 1 / appx.context.numOfPlayers;
	
	for (var i = 0; i < appx.context.numOfPlayers; i++) {
		for (var p = 0; p < Colors.length; p++) {
			(function(player, color) {
				var option = canvas.add(color * COL_WIDTH, player * ROW_HEIGHT, COL_WIDTH, ROW_HEIGHT);
				option.setColor(Colors[color]);
				
				var checked = '';
				if (appx.context.colorSetup[player] == color) {
					checked = 'checked';
				}
				
				option.dom.innerHTML = '<input type="radio" name="' + ID('FormPlayerColor') + player + '" value="' + color + '" ' + checked + '>';

				// Add TMP updater event
				option.onClick(() => { appx.context.colorSetup[player] = color; });
			}(i, p));
		}
	}
}

'static'; function ApplySettings() {
	var context = appx.context;
	var players = context.players;
	
	while (context.numOfPlayers < players.length) players.pop();
	while (context.numOfPlayers > players.length) players.push(new ClassPlayer());
	
	for (var i = 0; i < players.length; i++) {
		players[i].color = Colors[context.colorSetup[i]];
		players[i].score = parseInt(context.initScore);
		players[i].subscore = parseInt(context.initSubscore);
	}
}
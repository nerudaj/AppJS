'static'; var COLOR_WHEEL = [ 'red', 'lightgreen', 'lightblue', 'yellow', 'pink', 'orange', 'grey', '#f5f5f5' ];

'static'; function RenderSettings() {
	// Render page template and obtain reference to main drawing board
	// Craft buttons in place of function argument
	var board = PageTemplate(appx.canvas, TEXT_SETTINGS, [
		new ButtonTemplate(TEXT_APPLY, () => {
			ApplySettings(); // Some post process has to be done
			appx.toggleView(ENUM('score'));
		}),
		new ButtonTemplate(TEXT_A_SETTINGS, () => {
			ApplySettings();
			appx.toggleView(ENUM('advanced_settings'));
		}),
		new ButtonTemplate(TEXT_REMOTE, () => {
			ApplySettings();
			appx.toggleView(ENUM('remote'));
		}),
		new ButtonTemplate(TEXT_BACK, () => {
			appx.rollbackContext();
			appx.toggleView(ENUM('score'));
		})
	], ID('CacheSettingsToolbar'));
	
	// Board will be scrollable
	board.addClass('scrollable');
	
	// Create huge canvas inside, scrolling
	// plCountSelect + initScore + useSubscore + useHistory + diceCount + ?initSubscore + plCount
	// But at least 9 rows
	var rowCount = Math.max(appx.context.$numOfPlayers + appx.advctx.$useSubscore + 3, 9);
	var content = board.add(0, 0, 1, rowCount / 9); // Single label is always 1/9 of board height

	RenderSettingsBoard(content, rowCount);
}

// *** TOP level ***
'static'; function RenderSettingsBoard(canvas, rowCount) {
	// Prepare variables
	var LABEL_HEIGHT = 1 / rowCount;
	
	// Declare available options (and filter hidden ones)
	var options = [
		[(dom, ctx) => { RenderFormSelect(2, 8, dom, ctx); }, // 2 = MinPlayers, 8 = MaxPlayers
								'select', '$numOfPlayers', TEXT_PL_COUNT],
		[(dom, ctx) => { RenderFormSelect(1, 6, dom, ctx); },
								'select', '$diceCount', TEXT_DICE_COUNT],
		[RenderNumericInput,    'input',  '$initScore', TEXT_INIT_SCORE],
		(appx.advctx.$useSubscore ? [RenderNumericInput, 'input', '$initSubscore', TEXT_INIT_SUBSCR] : null)
	].filter(i => i);
	
	var LABEL_FONT_SIZE = RenderSettingsOptions(canvas, options, rowCount);
	
	// Render colors label - must be done differently
	var hskip = options.length;
	var lcols = canvas.add(0, hskip++ * LABEL_HEIGHT, 1, LABEL_HEIGHT);
	lcols.dom.style.fontWeight = 'bold';
	lcols.setText(TEXT_PL_COLORS, false, LABEL_FONT_SIZE);
	
	// Render color wheel
	var colorwheel = canvas.add(0, hskip * LABEL_HEIGHT, 1, appx.context.$numOfPlayers * LABEL_HEIGHT);
	RenderFormPlayerColors(colorwheel);
}

'static'; function RenderSettingsOptions(canvas, options, rowCount) {
	// Prepare variables
	var LABEL_WIDTH  = 0.6;
	var LABEL_HEIGHT = 1 / rowCount;

	// Get current cached font size
	var LABEL_FONT_SIZE = ReadFontSizeCache(
		canvas,
		LABEL_WIDTH,
		LABEL_HEIGHT,
		TEXT_USE_REMOTE,
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

	return LABEL_FONT_SIZE;
}

// *** Second level ***
'static'; function RenderFormSelect(min, max, canvas, ctx) {
	canvas.addEventCallback('change', (event) => {
		var d = event.target;
		appx.context[ctx] = parseInt(d.options[d.selectedIndex].value);
		ClearOptimizationCache();
		appx.toggleView(ENUM('settings'));
	});

	for (var i = min; i <= max; i++) {
		(function(p) {
			// Add option to select
			var option = canvas.add(0, 0, 1, 1, 'option');
			option.value = i;
			option.setText(i, true);

			// Option set in context should be selected
			if (p == appx.context[ctx]) {
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

'static'; function RenderFormPlayerColors(canvas) {
	var COL_WIDTH  = 1 / COLOR_WHEEL.length;
	var ROW_HEIGHT = 1 / appx.context.$numOfPlayers;
	
	for (var i = 0; i < appx.context.$numOfPlayers; i++) {
		for (var p = 0; p < COLOR_WHEEL.length; p++) {
			(function(player, color) {
				var option = canvas.add(color * COL_WIDTH, player * ROW_HEIGHT, COL_WIDTH, ROW_HEIGHT);
				option.setColor(COLOR_WHEEL[color]);
				
				var checked = '';
				if (appx.context.$colorSetup[player] == color) {
					checked = 'checked';
				}
				
				option.dom.innerHTML = '<input type="radio" name="' + ID('FormPlayerColor') + player + '" value="' + color + '" ' + checked + '>';

				// Add TMP updater event
				option.onClick(() => { appx.context.$colorSetup[player] = color; });
			}(i, p));
		}
	}
}

'static'; function ApplySettings() {
	var context = appx.context;
	var players = context.$players;
	
	while (context.$numOfPlayers < players.length) players.pop();
	while (context.$numOfPlayers > players.length) players.push(new ClassPlayer());
	
	for (var i = 0; i < players.length; i++) {
		players[i].color = COLOR_WHEEL[context.$colorSetup[i]];
		players[i].score = parseInt(context.$initScore);
		players[i].subscore = parseInt(context.$initSubscore);
		players[i].$scoreHistory = '';
		players[i].$subscoreHistory = '';
	}
}
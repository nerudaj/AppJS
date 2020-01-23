'static'; var COLOR_WHEEL = [ 'red', 'lightgreen', 'lightblue', 'yellow', 'pink', 'orange', 'grey', '#f5f5f5' ];

appx.AddPage(
	ID('PageSettings'),
	TEXT_SETTINGS,
	RenderPageSettings,
	[
		new AppJsButton(TEXT_APPLY, () => {
			ApplySettings(); // Some post process has to be done
			appx.DisplayPage(ID('PageScore'));
		}),
		new AppJsButton(TEXT_A_SETTINGS, () => {
			ApplySettings();
			appx.DisplayPage(ID('PageAdvancedSettings'));
		}),
		new AppJsButton(TEXT_BACK, () => {
			appx.rollbackContext();
			appx.DisplayPage(ID('PageScore'));
		})
	]
);

'static'; function RenderPageSettings(canvas) {
	// Board will be scrollable
	canvas.AddClass('scrollable');

	var ROW_HEIGHT = 1 / 10;

	// Declare available options (and filter hidden ones)
	var options = [
		[(dom, ctx) => { RenderFormSelect(2, 8, dom, ctx); }, // 2 = MinPlayers, 8 = MaxPlayers
								'select', '$numOfPlayers', TEXT_PL_COUNT],
		[(dom, ctx) => { RenderFormSelect(1, 6, dom, ctx); },
								'select', '$diceCount', TEXT_DICE_COUNT],
		[RenderNumericInput,    'input',  '$initScore', TEXT_INIT_SCORE],
		(appx.advctx.$useSubscore ? [RenderNumericInput, 'input', '$initSubscore', TEXT_INIT_SUBSCR] : null)
	].filter(i => i);

	RenderSettingsOptions(canvas, options, ROW_HEIGHT);

	// Render colors label
	var hskip = options.length;
	var labelColors = canvas.AddElem(0, hskip++ * ROW_HEIGHT, 1, ROW_HEIGHT);
	labelColors.dom.style.fontWeight = 'bold';
	labelColors.SetText(TEXT_PL_COLORS, ReadFontSizeCache(labelColors, TEXT_PL_COUNT, ID('CacheSettingsLabel')));

	// Render color wheel
	var colorWheel = canvas.AddElem(0, hskip * ROW_HEIGHT, 1, appx.context.$numOfPlayers * ROW_HEIGHT);
	RenderFormPlayerColors(colorWheel);
}

'static'; function RenderSettingsOptions(canvas, options, LABEL_HEIGHT) {
	var LABEL_WIDTH = 0.7;

	options.forEach((input, index) => {
		var label = canvas.AddElem(0, index * LABEL_HEIGHT, LABEL_WIDTH * 0.9, LABEL_HEIGHT);
		var fontSize = ReadFontSizeCache(label, "X".repeat(22), ID('CacheSettingsLabel'));
		label.AddClass('align_left');
		label.SetText(input[3], fontSize);

		var dom = canvas.AddElem(LABEL_WIDTH, index * LABEL_HEIGHT, 1 - LABEL_WIDTH, LABEL_HEIGHT * 0.9, input[1]);
		input[0](dom, input[2]);
	});
}

// *** Second level ***
'static'; function RenderFormSelect(min, max, canvas, ctx) {
	canvas.AddEventCallback('change', (event) => {
		var d = event.target;
		appx.context[ctx] = parseInt(d.options[d.selectedIndex].value);
		ClearFontSizeCache();
		appx.DisplayPage(ID('PageSettings'));
	});

	for (let i = min; i <= max; i++) {
		// Add option to select
		var option = canvas.AddElem(0, 0, 1, 1, 'option');
		option.value = i;
		option.SetText(i);

		// Option set in context should be selected
		if (i == appx.context[ctx]) {
			option.dom.selected = 'selected';
		}
	}
}

'static'; function RenderNumericInput(canvas, ctxitem) {
	// Setup dom
	canvas.dom.type = 'number';
	canvas.dom.value = appx.context[ctxitem];
	canvas.dom.autocomplete = 'off';
	
	// Set callback for updating context
	canvas.AddEventCallback('input', () => {
		if (canvas.dom.validity.valid) {
			appx.context[ctxitem] = canvas.dom.value;
		}
	});
}

'static'; function RenderFormPlayerColors(canvas) {
	var context = appx.context;

	var COL_WIDTH  = 1 / COLOR_WHEEL.length;
	var ROW_HEIGHT = 1 / context.$numOfPlayers;

	for (let i = 0; i < context.$numOfPlayers; i++) {
		for (let p = 0; p < COLOR_WHEEL.length; p++) {
			var option = canvas.AddElem(p * COL_WIDTH, i * ROW_HEIGHT, COL_WIDTH, ROW_HEIGHT);
			option.SetColor(COLOR_WHEEL[p]);
			option.OnClick(() => {
				context.$colorSetup[i] = p;
			});

			var radio = option.AddElem(1/5, 1/5, 1/5, 1/5, 'input');
			radio.dom.name = ID('FormPlayerColor') + i;
			radio.dom.type = 'radio';
			radio.dom.checked = context.$colorSetup[i] == p ? 'checked' : '';
			radio.dom.value = p;
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

	context.$gameTime = 0;
}
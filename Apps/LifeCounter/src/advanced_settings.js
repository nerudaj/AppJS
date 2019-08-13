'static'; var COLOR_WHEEL = [ 'red', 'lightgreen', 'lightblue', 'yellow', 'pink', 'orange', 'grey', '#f5f5f5' ];

'static'; function RenderAdvancedSettings() {
	// Render page template and obtain reference to main drawing board
	// Craft buttons in place of function argument
	var board = PageTemplate(appx.canvas, TEXT_A_SETTINGS, [
		new ButtonTemplate(TEXT_BACK, () => {
			ApplyAdvancedSettings();
			appx.toggleView(ENUM('settings'));
		})
	], ID('CacheSettingsAdvancedToolbar'));
	
	// Board will be scrollable
	board.addClass('scrollable');
	
	// Create huge canvas inside, scrolling
	// plCountSelect + initScore + useSubscore + useHistory + diceCount + ?initSubscore + plCount
	// But at least 9 rows
	var rowCount = Math.max(appx.advctx.useRemote + 4, 9);
	var content = board.add(0, 0, 1, rowCount / 9); // Single label is always 1/9 of board height

	RenderAdvancedSettingsBoard(content, rowCount);
}

'static'; function RenderAdvancedSettingsBoard(canvas, rowCount) {
	// Declare available options (and filter hidden ones)
	var options = [
		[RenderLanguageDropdown, 'select', 'language',    TEXT_LANG],
		[RenderCheckboxInput,    'input',  'useHistory',  TEXT_USE_HISTORY],
		[RenderCheckboxInput,    'input',  'useSubscore', TEXT_USE_SUBSCR],
		[RenderCheckboxInput,    'input',  'useRemote',   TEXT_USE_REMOTE],
		(appx.advctx.useRemote ? [RenderApiKey, 'div', 'apikey', TEXT_APPID] : null)
	].filter(i => i);
	
	RenderSettingsOptions(canvas, options, rowCount);
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

	return LABEL_FONT_SIZE;
}

'static'; function RenderLanguageDropdown(canvas, ctx) {
	var LANGUAGES = [ "Čeština", "English" ];

	canvas.addEventCallback('change', (event) => {
		appx.advctx[ctx] = event.target.selectedIndex;
		SetLanguageById(appx.advctx[ctx]);
		appx.toggleView(ENUM('advanced_settings'));
	});

	var i = 0;
	LANGUAGES.forEach(l => {
		var option = canvas.add(0, 0, 1, 1, 'option');
		option.setText(l, true);

		if (i == appx.advctx[ctx]) {
			option.dom.selected = 'selected';
		}
		i++;
	});
}

'static'; function RenderCheckboxInput(canvas, ctxitem) {
	canvas.dom.type = 'checkbox';
	canvas.dom.checked = appx.advctx[ctxitem];
	
	// Set callback for updating context
	canvas.onClick(() => {
		appx.advctx[ctxitem] = !appx.advctx[ctxitem];
		appx.toggleView(ENUM('advanced_settings'));
	});
}

'static'; function RenderApiKey(canvas, ctxitem) {
	canvas.setText(appx.context[ctxitem], true);
}

'static'; function ApplyAdvancedSettings() {
	if (appx.context.useRemote) {
		StartDisplay();
	}

	appx.saveToLocalStorage(appx.advctx, "LifeCounter");
}
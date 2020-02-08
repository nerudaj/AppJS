'static'; function RenderPageAdvancedSettings(canvas) {
	canvas.AddClass('scrollable');

	var ROW_HEIGHT = 1 / 10;

	var options = [
		[RenderLanguageDropdown, 'select', '$language',         TEXT_LANG],
		[RenderCheckboxInput,    'input',  '$useThrowHistory',  TEXT_USE_THROW_HISTORY],
		[RenderCheckboxInput,    'input',  '$useScoreHistory',  TEXT_USE_SCORE_HISTORY],
		[RenderCheckboxInput,    'input',  '$useSubscore',      TEXT_USE_SUBSCR],
		[RenderCheckboxInput,    'input',  '$useTimeTracking',  TEXT_USE_TIME_TRACK],
		[RenderCheckboxInput,    'input',  '$useScoreEditor',   TEXT_USE_SCORE_EDIT]
	];

	RenderSettingsOptions(canvas, options, ROW_HEIGHT);
}

'static'; function RenderLanguageDropdown(canvas, ctx) {
	canvas.AddEventCallback('change', event => {
		appx.advctx[ctx] = event.target.selectedIndex;
		SetLanguageById(appx.advctx[ctx]);
		PrepareApplication();
		appx.DisplayPage(ID('PageAdvancedSettings'));
	});

	[ "Čeština", "English" ].forEach((label, index) => {
		var option = canvas.AddElem(0, 0, 1, 1, 'option');
		option.SetText(label);
		option.dom.selected = index == appx.advctx[ctx] ? 'selected' : '';
	});
}

'static'; function RenderCheckboxInput(canvas, ctxitem) {
	canvas.dom.type = 'checkbox';
	canvas.dom.checked = appx.advctx[ctxitem];

	// Set callback for updating context
	canvas.OnClick(() => {
		appx.advctx[ctxitem] = !appx.advctx[ctxitem];
		appx.DisplayPage(ID('PageAdvancedSettings'));
	});
}

'static'; function ApplyAdvancedSettings() {
	appx.SaveToLocalStorage(appx.advctx, LOCAL_STORAGE_ACCESS_KEY);
}
'static'; function RenderPageAdvancedSettings(canvas) {
	canvas.AddClass('scrollable');

	var ROW_HEIGHT = 1 / 10;

	var options = [
		[RenderLanguageDropdown, 'select', '$language',         TEXT_LANG],
		[RenderCheckboxInput,    'div',  '$useThrowHistory',  TEXT_USE_THROW_HISTORY],
		[RenderCheckboxInput,    'div',  '$useScoreHistory',  TEXT_USE_SCORE_HISTORY],
		[RenderCheckboxInput,    'div',  '$useSubscore',      TEXT_USE_SUBSCR],
		[RenderCheckboxInput,    'div',  '$useTimeTracking',  TEXT_USE_TIME_TRACK],
		[RenderCheckboxInput,    'div',  '$useScoreEditor',   TEXT_USE_SCORE_EDIT]
	];

	RenderSettingsOptions(canvas, options, ROW_HEIGHT);
}

'static'; function RenderLanguageDropdown(canvas, ctx) {
	canvas.AddEventCallback('change', event => {
		appx.advctx[ctx] = event.target.selectedIndex;
		SetLanguageById(appx.advctx[ctx]);
		PrepareApplication();
		appx.RefreshPage();
	});

	[ "Čeština", "English" ].forEach((label, index) => {
		var option = canvas.AddElem(0, 0, 1, 1, 'option');
		option.SetText(label);
		option.dom.selected = index == appx.advctx[ctx] ? 'selected' : '';
	});
}

'static'; function RenderCheckboxInput(wrap, key, disabled = false) {
	var width = wrap.height * 0.7 / wrap.width;

	var div = wrap.AddElem(0.5 - width / 2, 0.15, width, 0.7);
	div.AddClass("checkbox");
	div.OnClick(() => {
		appx.advctx[key] = !appx.advctx[key];
		appx.RefreshPage();
	});
	if (disabled) div.dom.setAttribute("disabled", "");

	var check = div.AddElem(0, 0, 1, 1, 'input', ID('Checkbox') + key);
	check.dom.type = "checkbox";
	check.dom.checked = appx.advctx[key];
	check.dom.disabled = disabled;

	var label = div.AddElem(0.1, 0.1, 0.8, 0.8, 'label');
	label.dom.for = ID('Checkbox') + key;
}

'static'; function ApplyAdvancedSettings() {
	appx.SaveToLocalStorage(appx.advctx, LOCAL_STORAGE_ACCESS_KEY);
}
appx.AddPage(
	ID('PageTimerSettings'),
	TEXT_SETTINGS,
	RenderPageTimerSettings,
	[
		new AppJsButton(TEXT_APPLY, () => {
			appx.DisplayPage(ID('PageTimer'));
		}),
		new AppJsButton(TEXT_BACK, () => {
			appx.rollbackContext(); // All changes were cancelled
			appx.DisplayPage(ID('PageTimer'));
		})
	]
);

'static'; function RenderPageTimerSettings(canvas) {
	// Draw display
	var display = canvas.AddElem(0, 0, 1, TIMER_DISPLAY_HEIGHT, 'div', ID('DisplayInitCountdown'));
	display.SetText('XX:XX', GetTimerDisplayFontSize(display));

	// Generate buttons out of array of labels
	var buttons = ["-10", "-5", "-1", "+1", "+5", "+10 "].map(
		elem => new AppJsButton(elem, () => { ModifyInitCountdown(parseInt(elem)); })
	);
	var buttonWrapper = canvas.AddElem(0, TIMER_DISPLAY_HEIGHT, 1, 0.1);
	buttonWrapper.AddButtonArray(buttons, ID('CacheTimerSettingsButtons'));

	// Initialize display - will set text of display
	ModifyInitCountdown(0);
}

'static'; function ModifyInitCountdown(amount) {
	var context = appx.context;

	if (context.$initCountdown + amount <= 0) {
		context.$initCountdown = 1;
	}
	else {
		context.$initCountdown += amount;
	}

	$(ID('DisplayInitCountdown')).innerHTML = IntToTimeStr(context.$initCountdown);
}
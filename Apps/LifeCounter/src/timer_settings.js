'static'; function RenderTimerSettings() {
	// Render page template, obtain main canvas reference and draw to it
	// Buttons are created directly in place of function argument
	var board = PageTemplate(appx.canvas, TEXT_SETTINGS, [
		new ButtonTemplate(TEXT_APPLY, () => {
			appx.toggleView(ENUM('timer'));
		}),
		new ButtonTemplate(TEXT_BACK, () => {
			appx.rollbackContext(); // All changes were cancelled
			appx.toggleView(ENUM('timer'));
		})
	], ID('CacheToolbarSettingsToolbar'));

	// Draw display
	var display = board.add(0, 0, TIMER_DISPLAY_WIDTH, TIMER_DISPLAY_HEIGHT, 'div', ID('DisplayInitCountdown'));
	display.setText('XX:XX', false, GetTimerDisplayFontSize(board));
	
	// Generate buttons out of array of labels
	var buttons = ["-10", "-5", "-1", "+1", "+5", "+10 "].map( elem => {
		return new ButtonTemplate(elem, () => {
			ModifyInitCountdown(parseInt(elem));
		}); 
	});
	RenderButtonArray(board, buttons, 0, TIMER_DISPLAY_HEIGHT, TIMER_DISPLAY_WIDTH, 0.1, ID('timer_settings_buttons'));
	
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
	
	GetDOM(ID('DisplayInitCountdown')).innerHTML = IntToTimeStr(context.$initCountdown);
}
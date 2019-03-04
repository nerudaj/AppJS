'static'; var TI_TMP_STORAGE = null;

'static'; function RenderTimerSettings() {
	// Backup initCountdown
	TI_TMP_STORAGE = appx.context.initCountdown;
	
	// Render page template, obtain main canvas reference and draw to it
	// Buttons are created directly in place of function argument
	var board = PageTemplate(appx.canvas, TEXT_SETTINGS, [
		new ButtonTemplate(TEXT_APPLY, () => {
			appx.context.initCountdown = TI_TMP_STORAGE; // Apply modifications to initCountdown
			appx.toggleView(ENUM('timer'));
		}),
		new ButtonTemplate(TEXT_BACK, () => {
			appx.toggleView(ENUM('timer'));
		})
	], ID('CacheToolbarSettingsToolbar'));
	
	// Display constants
	var DISPLAY_WIDTH = 1;
	var DISPLAY_HEIGHT = 0.4;
	
	// Refresh cache
	var DISPLAY_FONT_SIZE = ReadFontSizeCache(board, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'XX:XX', ID('CacheTimerDisplay'), 250);
	
	// Draw display
	var display = board.add(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'div', ID('DisplayInitCountdown'));
	display.dom.style.fontSize = DISPLAY_FONT_SIZE + 'px';
	
	// Generate buttons out of array of labels
	var buttons = ["-10", "-5", "-1", "+1", "+5", "+10"].map( elem => {
		return new ButtonTemplate(elem, () => {
			ModifyInitCountdown(parseInt(elem));
		}); 
	});
	RenderButtonArray(board, buttons, 0, 0.4, 1, 0.1, ID('timer_settings_buttons'));
	
	// Initialize display - will set text of display
	ModifyInitCountdown(0);
}

'static'; function ModifyInitCountdown(amount) {
	if (TI_TMP_STORAGE + amount <= 0) {
		TI_TMP_STORAGE = 1;
	}
	else {
		TI_TMP_STORAGE += amount;
	}
	
	GetDOM(ID('DisplayInitCountdown')).innerHTML = IntToTimeStr(TI_TMP_STORAGE);
}
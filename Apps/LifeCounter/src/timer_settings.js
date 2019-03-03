'static'; var TI_TMP_STORAGE = null;

// === TOP LEVEL ===

'static'; function RenderTimerSettings() {
	var canvas = this.app.canvas;
	TI_TMP_STORAGE = this.app.context.initCountdown;
	
	RenderHeaderTemplate(canvas, TEXTS.settings);
	
	var board = GetDrawingTemplate(canvas);
	RenderTimerSettingsBoard(board, this.app);
	
	// Render toolbar
	var buttons = [
		new ButtonTemplate(TEXTS.apply, () => {
			app.context.initCountdown = TI_TMP_STORAGE; // Apply modifications to initCountdown
			app.toggleView(ENUM('timer'));
		}),
		new ButtonTemplate(TEXTS.back, () => {
			app.toggleView(ENUM('timer'));
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('CacheToolbarSettingsToolbar'));
}

// === Second level ===

'static'; function RenderTimerSettingsBoard(canvas, app) {
	// Display constants
	var DISPLAY_WIDTH = 1;
	var DISPLAY_HEIGHT = 0.4;
	
	// Refresh cache
	var DISPLAY_FONT_SIZE = ReadFontSizeCache(canvas, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'XX:XX', ID('CacheTimerDisplay'), 250);
	
	// Draw display
	var display = canvas.add(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'div', ID('DisplayInitCountdown'));
	display.dom.style.fontSize = DISPLAY_FONT_SIZE + 'px';
	
	// Draw control buttons
	var buttons = [];                                       // Destination array for buttons
	["-10", "-5", "-1", "+1", "+5", "+10"].forEach(         // Loop over anonymous array of labels that work also as control values
		function(x) {
			buttons.push(new ButtonTemplate(x, function() { // Push button template, x is label
				ModifyInitCountdown(app, parseInt(x));      // Modify countdown with value x (same as label)
			}));
		}
	);
	RenderButtonArray(canvas, buttons, 0, 0.4, 1, 0.1, ID('timer_settings_buttons'));
	
	// Initialize display - will set text of display
	ModifyInitCountdown(app, 0);
}

// === Third level ===

'static'; function ModifyInitCountdown(app, amount) {
	if (TI_TMP_STORAGE + amount <= 0) {
		TI_TMP_STORAGE = 1;
	}
	else {
		TI_TMP_STORAGE += amount;
	}
	GetDOM(ID('DisplayInitCountdown')).innerHTML = IntToTimeStr(TI_TMP_STORAGE);
}
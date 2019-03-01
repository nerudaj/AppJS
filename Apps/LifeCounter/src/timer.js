'static'; var AudioHandle = null;

'static'; function RenderTimer() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, TEXTS.countdown);
	
	var board = GetDrawingTemplate(canvas);
	RenderTimerBoard(board, this.app);
	
	// Render toolbar
	var buttons = [
		new ButtonTemplate(TEXTS.settings, function() {
			CountdownControl(app, ENUM('stop'));
			app.toggleView(ENUM('timer_settings'));
		}),
		new ButtonTemplate(TEXTS.back, function() {
			CountdownControl(app, ENUM('stop'));
			app.toggleView(ENUM('score'));
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('timer'));
}

// === TOP LEVEL ===
'static'; function RenderTimerBoard(canvas, app) {
	var context = app.context;
	var DISPLAY_WIDTH = 1;
	var DISPLAY_HEIGHT = 0.4;
	
	// Reset countdown value
	context.countdown = context.initCountdown;

	var DISPLAY_FONT_SIZE = ReadFontSizeCache(canvas, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'XX:XX', ID('timer_display'), 250);
	
	var countdownDisplay = canvas.add(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'div', ID('CountdownDisplay'));
	countdownDisplay.dom.style.fontSize = DISPLAY_FONT_SIZE + 'px';
	countdownDisplay.setText(IntToTimeStr(context.initCountdown));

	var buttons = [
		new ButtonTemplate(TEXTS.play, function() {
			InitAudio();
			CountdownControl(app, ENUM('play_pause'));
		}, ID('DOMTimerPlayButton')),
		new ButtonTemplate(TEXTS.stop, function() {
			CountdownControl(app, ENUM('stop'));
		}),
		new ButtonTemplate(TEXTS.restart, function() {
			CountdownControl(app, ENUM('restart'));
		})
	];
	RenderButtonArray(canvas, buttons, 0, 0.4, 1, 0.1, ID('timer_buttons'));
}

'static'; function InitAudio() {
	if (AudioHandle === null) {
		var src = GenerateTone(0, 0.1);
		AudioHandle = new Audio(src);
		AudioHandle.play();
	}
}

// === Second level ===

'static'; function CountdownControl(app, action) {
	var context = app.context;
	var display = GetDOM(ID('CountdownDisplay'));
	
	if (action == ENUM('play_pause')) {
		if (context.cntIntHndl != null) { // pause behaviour
			context.cntIntHndl = ReallyClearInterval(context.cntIntHndl);
			GetDOM(ID('DOMTimerPlayButton')).innerHTML = TEXTS.play;
			return;
		}
		
		// play behaviour
		if (context.countdown == 0) {
			CountdownControl(app, ENUM('stop'));
		}
		GetDOM(ID('DOMTimerPlayButton')).innerHTML = TEXTS.pause;
		
		context.cntIntHndl = setInterval(function() {
			context.countdown--;
			display.innerHTML = IntToTimeStr(context.countdown);
			
			if (context.countdown == 0) {
				context.cntIntHndl = ReallyClearInterval(context.cntIntHndl);
				
				// Update audio object and play it
				AudioHandle.src = GenerateTone(440, 2);
				AudioHandle.play();
				
				// Update texts
				display.innerHTML = TEXTS.end;
				GetDOM(ID('DOMTimerPlayButton')).innerHTML = TEXTS.play;
			}
		}, 1000);
	}
	else if (action == ENUM('stop')) {
		context.cntIntHndl = ReallyClearInterval(context.cntIntHndl);
		context.countdown = context.initCountdown;
		display.innerHTML = IntToTimeStr(context.countdown);
		GetDOM(ID('DOMTimerPlayButton')).innerHTML = TEXTS.play;
	}
	else if (action == ENUM('restart')) {
		CountdownControl(app, ENUM('stop'));
		CountdownControl(app, ENUM('play_pause'));
	}
	else {
		LogError('Timer', 'CountdownControl', 'Invalid action name: ' + action);
	}
}
'static'; var AudioHandle = null;

'static'; function RenderTimer() {
	// Render page template and obtain reference to main drawing board
	// Craft buttons in place of function argument
	var board = PageTemplate(app.canvas, TEXTS.countdown, [
		new ButtonTemplate(TEXTS.settings, () => {
			CountdownControl(ENUM('stop'));
			app.toggleView(ENUM('timer_settings'));
		}),
		new ButtonTemplate(TEXTS.back, () => {
			CountdownControl(ENUM('stop'));
			app.toggleView(ENUM('score'));
		})
	], ID('timer'));

	// Render timer board
	var context = app.context;
	var DISPLAY_WIDTH = 1;
	var DISPLAY_HEIGHT = 0.4;
	
	// Reset countdown value
	context.countdown = context.initCountdown;

	var DISPLAY_FONT_SIZE = ReadFontSizeCache(board, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'XX:XX', ID('timer_display'), 250);
	
	var countdownDisplay = board.add(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'div', ID('CountdownDisplay'));
	countdownDisplay.dom.style.fontSize = DISPLAY_FONT_SIZE + 'px';
	countdownDisplay.setText(IntToTimeStr(context.initCountdown));

	var buttons = [
		new ButtonTemplate(TEXTS.play, () => {
			InitAudio();
			CountdownControl(ENUM('play_pause'));
		}, ID('DOMTimerPlayButton')),
		new ButtonTemplate(TEXTS.stop, () => {
			CountdownControl(ENUM('stop'));
		}),
		new ButtonTemplate(TEXTS.restart, () => {
			CountdownControl(ENUM('stop'));
			CountdownControl(ENUM('play_pause'));
		})
	];
	RenderButtonArray(board, buttons, 0, 0.4, 1, 0.1, ID('timer_buttons'));
}

'static'; function InitAudio() {
	if (AudioHandle === null) {
		var src = GenerateTone(0, 0.1);
		AudioHandle = new Audio(src);
		AudioHandle.play();
	}
}

// === Second level ===

'static'; function CountdownControl(action) {
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
			CountdownControl(ENUM('stop'));
		}
		GetDOM(ID('DOMTimerPlayButton')).innerHTML = TEXTS.pause;
		
		// When the countdown finishes
		context.cntIntHndl = setInterval(() => {
			display.innerHTML = IntToTimeStr(--context.countdown);
			
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
	else {
		LogError('Timer', 'CountdownControl', 'Invalid action name: ' + action);
	}
}
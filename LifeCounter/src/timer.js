'static'; var AudioHandle = null;
'static'; var TIMER_DISPLAY_WIDTH = 1;
'static'; var TIMER_DISPLAY_HEIGHT = 0.4;

'static'; function GetTimerDisplayFontSize(canvas) {
	return ReadFontSizeCache(canvas, TIMER_DISPLAY_WIDTH, TIMER_DISPLAY_HEIGHT, 'XX:XX', ID('CacheTimerDisplay'), 250);
}

'static'; function RenderTimer() {
	// Render page template and obtain reference to main drawing board
	// Craft buttons in place of function argument
	var board = PageTemplate(appx.canvas, TEXT_COUNTDOWN, [
		new ButtonTemplate(TEXT_SETTINGS, () => {
			CountdownControl(ENUM('stop'));
			appx.backupContext();
			appx.toggleView(ENUM('timer_settings'));
		}),
		new ButtonTemplate(TEXT_BACK, () => {
			CountdownControl(ENUM('stop'));
			appx.toggleView(ENUM('score'));
		})
	], ID('timer'));

	// Render timer board
	var context = appx.context;

	// Reset countdown value
	context.$countdown = context.$initCountdown;

	var countdownDisplay = board.add(0, 0, TIMER_DISPLAY_WIDTH, TIMER_DISPLAY_HEIGHT, 'div', ID('CountdownDisplay'));
	countdownDisplay.setText(IntToTimeStr(context.$initCountdown), false, GetTimerDisplayFontSize(board));

	var buttons = [
		new ButtonTemplate(TEXT_PLAY, () => {
			InitAudio();
			CountdownControl(ENUM('play_pause'));
		}, ID('DOMTimerPlayButton')),
		new ButtonTemplate(TEXT_STOP, () => {
			CountdownControl(ENUM('stop'));
		}),
		new ButtonTemplate(TEXT_RESTART, () => {
			CountdownControl(ENUM('stop'));
			CountdownControl(ENUM('play_pause'));
		})
	];
	RenderButtonArray(board, buttons, 0, TIMER_DISPLAY_HEIGHT, TIMER_DISPLAY_WIDTH, 0.1, ID('timer_buttons'));
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
	var context = appx.context;
	var display = GetDOM(ID('CountdownDisplay'));
	var playbtn = GetDOM(ID('DOMTimerPlayButton'));

	if (action == ENUM('play_pause')) {
		if (context.$cntIntHndl != null) { // pause behaviour
			context.$cntIntHndl = ReallyClearInterval(context.$cntIntHndl);
			playbtn.innerHTML = TEXT_PLAY;
			return;
		}

		// play behaviour
		if (context.$countdown == 0) {
			CountdownControl(ENUM('stop'));
		}
		playbtn.innerHTML = TEXT_PAUSE;

		// When the countdown finishes
		context.$cntIntHndl = setInterval(() => {
			display.innerHTML = IntToTimeStr(--context.$countdown);

			if (context.$countdown == 0) {
				context.$cntIntHndl = ReallyClearInterval(context.$cntIntHndl);

				// Update audio object and play it
				AudioHandle.src = GenerateTone(440, 2);
				AudioHandle.play();

				// Update texts
				display.innerHTML = TEXT_END;
				playbtn.innerHTML = TEXT_PLAY;
			}
		}, 1000);
	}
	else if (action == ENUM('stop')) {
		context.$cntIntHndl = ReallyClearInterval(context.$cntIntHndl);
		context.$countdown = context.$initCountdown;
		display.innerHTML = IntToTimeStr(context.$countdown);
		playbtn.innerHTML = TEXT_PLAY;
	}
	else {
		throw "Invalid action name: " + action;
	}
}
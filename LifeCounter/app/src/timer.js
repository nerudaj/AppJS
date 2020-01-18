'static'; var AudioHandle = null;
'static'; var TIMER_DISPLAY_HEIGHT = 0.4;

'static'; function GetTimerDisplayFontSize(canvas) {
	return ReadFontSizeCache(canvas, 'XX:XX', ID('CacheTimerDisplay'));
}

appx.AddPage(
	ID('PageTimer'),
	TEXT_TIMER,
	RenderPageTimer,
	[
		new AppJsButton(TEXT_SETTINGS, () => {
			CountdownControl(ENUM('stop'));
			appx.backupContext();
			appx.DisplayPage(ID('PageTimerSettings'));
		}),
		new AppJsButton(TEXT_BACK, () => {
			CountdownControl(ENUM('stop'));
			appx.DisplayPage(ID('PageScore'));
		})
	]
);

'static'; function RenderPageTimer(canvas) {
	// Render timer canvas
	var context = appx.context;

	// Reset countdown value (if no callback is active)
	if (!context.$cntIntHndl) context.$countdown = context.$initCountdown;

	var countdownDisplay = canvas.AddElem(0, 0, 1, TIMER_DISPLAY_HEIGHT, 'div', ID('CountdownDisplay'));
	countdownDisplay.SetText(IntToTimeStr(context.$countdown), GetTimerDisplayFontSize(countdownDisplay));

	var buttons = [
		new AppJsButton(TEXT_PLAY, () => {
			InitAudio();
			CountdownControl(ENUM('play_pause'));
		}, ID('DOMTimerPlayButton')),
		new AppJsButton(TEXT_STOP, () => {
			CountdownControl(ENUM('stop'));
		}),
		new AppJsButton(TEXT_RESTART, () => {
			CountdownControl(ENUM('stop'));
			CountdownControl(ENUM('play_pause'));
		})
	];
	var buttonWrapper = canvas.AddElem(0, TIMER_DISPLAY_HEIGHT, 1, 0.1);
	buttonWrapper.AddButtonArray(buttons, ID('CacheTimerButtons'));
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
	var playbtn = $(ID('DOMTimerPlayButton'));

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
			var display = $(ID('CountdownDisplay'));
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
		$(ID('CountdownDisplay')).innerHTML = IntToTimeStr(context.$countdown);
		playbtn.innerHTML = TEXT_PLAY;
	}
	else {
		throw "Invalid action name: " + action;
	}
}
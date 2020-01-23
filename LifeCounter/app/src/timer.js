'static'; var AudioHandle = null;
'static'; var TIMER_DISPLAY_HEIGHT = 0.4;

'static'; function TimeControl(action, handle, updater) {
    var context = appx.context;
    var playbtn = $(ID('DOMTimerPlayButton'));

    if (action == ENUM('play_pause')) {
        if (context[handle] != null) {
            context[handle] = ReallyClearInterval(context[handle]);
            playbtn.innerHTML = TEXT_PLAY;
        }
        else {
            playbtn.innerHTML = TEXT_PAUSE;
            context[handle] = setInterval(updater, 1000);
        }
    }
    else if (action == ENUM('stop')) {
        context[handle] = ReallyClearInterval(context[handle]);
        playbtn.innerHTML = TEXT_PLAY;
        updater(true);
    }
}

'static'; function CountdownUpdater(performReset = false) {
    var context = appx.context;
    var display = $(ID('CountdownDisplay'));

    if (performReset) {
        context.$countdown = context.$initCountdown;
    }
    else context.$countdown--;

    display.innerHTML = IntToTimeStr(context.$countdown);

    if (context.$countdown == 0) {
        // Reset play button
        TimeControl(ENUM('stop'), "$cntIntHndl", CountdownUpdater);

        // Display end string
        display.innerHTML = TEXT_END;

        // Update audio object and play it
        AudioHandle.src = GenerateTone(440, 2);
        AudioHandle.play();
    }
}

var CountdownControl = (action) => { TimeControl(action, "$cntIntHndl", CountdownUpdater); };

'static'; function GetTimerDisplayFontSize(canvas) {
	return ReadFontSizeCache(canvas, 'XX:XX', ID('CacheTimerDisplay'));
}

'static'; function GetTimeControlButtons(controller) {
    return [
		new AppJsButton(TEXT_PLAY, () => {
			InitAudio();
			controller(ENUM('play_pause'), );
		}, ID('DOMTimerPlayButton')),
		new AppJsButton(TEXT_STOP, () => {
			controller(ENUM('stop'));
		}),
		new AppJsButton(TEXT_RESTART, () => {
			controller(ENUM('stop'));
			controller(ENUM('play_pause'));
		})
	];
}

'static'; function RenderPageTimer(canvas) {
	// Render timer canvas
	var context = appx.context;

	// Reset countdown value (if no callback is active)
	if (!context.$cntIntHndl) context.$countdown = context.$initCountdown;

	var countdownDisplay = canvas.AddElem(0, 0, 1, TIMER_DISPLAY_HEIGHT, 'div', ID('CountdownDisplay'));
	countdownDisplay.SetText(IntToTimeStr(context.$countdown), GetTimerDisplayFontSize(countdownDisplay));

	var buttonWrapper = canvas.AddElem(0, TIMER_DISPLAY_HEIGHT, 1, 0.1);
	buttonWrapper.AddButtonArray(GetTimeControlButtons(CountdownControl), ID('CacheTimerButtons'));
}

'static'; function InitAudio() {
	if (AudioHandle === null) {
		var src = GenerateTone(0, 0.1);
		AudioHandle = new Audio(src);
		AudioHandle.play();
	}
}

// === Second level ===

/*'static'; function CountdownControl(action) {
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
}*/
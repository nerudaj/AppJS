'static'; var AudioHandle = null;
'static'; var TIMER_DISPLAY_HEIGHT = 0.4;

'static'; function CountdownUpdater(performReset = false) {
    var context = appx.context;
    var display = $(ID('CountdownDisplay'));

    if (performReset) context.$countdown = context.$initCountdown;
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

'static'; var CountdownControl = action => {
	TimeControl(action, "$cntIntHndl", CountdownUpdater);
};

'static'; function GetTimerDisplayFontSize(canvas) {
	return ReadFontSizeCache(canvas, 'XX:XX', ID('CacheTimerDisplay'));
}

'static'; function InitAudio() {
	if (AudioHandle === null) {
		var src = GenerateTone(0, 0.1);
		AudioHandle = new Audio(src);
		AudioHandle.play();
	}
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
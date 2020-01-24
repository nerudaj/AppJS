function ENUM(id){return id;}

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
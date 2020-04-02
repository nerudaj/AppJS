'static'; function RenderPageKeyContent(canvas) {
	let game = appx.context.game;
	$("WhoStarts").innerHTML = GetPageHeaderText(game);

	if (!appx.context.online) {
		var colorPicker = canvas.AddElem(0, 0.9, 1, 0.1);

		for (let i = 0; i < 4; i++) {
			var btnBgr = colorPicker.AddElem(i * 1/4, 0, 1/4, 1);
			btnBgr.AddClass(GetClassForCard(i));

			var btn = CreateRadio(colorPicker, i * 1/4, 0, 1/4, 1, ID('ColorPicker'), appx.context.pickedColor == i, () => {
				appx.context.pickedColor = i;
			});
		}

		canvas = canvas.AddElem(0, 0, 1, 0.9);
	}

	RenderWords(canvas, game);
}

'static'; function GetPageHeaderText(game) {
	let redSum = 0;
	let blueSum = 0;

	for (let i = 0; i < game.key.length; i++) {
		if (game.marked[i]) {
			if (game.key[i] == 0) redSum++;
			if (game.key[i] == 1) blueSum++;
		}
	}

	if ((redSum + blueSum == 0) || !appx.context.online) {
		return game.starts == 0 ? "Začínají červení" : "Začínají modří";
	}

	let redLeft = 8 + (game.starts == 0) - redSum;
	let blueLeft = 8 + (game.starts == 1) - blueSum;

	return "<span style='color:blue'>" + blueLeft + "</span> : <span style='color:red'>" + redLeft + "</span>";
}

'static'; function RenderWords(canvas, game) {
	let guesser = !appx.context.roleCaptain && !appx.context.keyOnly;
	let online = appx.context.online;

	let longest = LongestString(game.words);

	for (let y = 0; y < 5; y++) {
		for (let x = 0; x < 5; x++) {
			let index = y * 5 + x;
			let item = canvas.AddElem(x * 1/5, y * 1/5, 1/5, 1/5);
			//item.dom.style.border = 'solid 1px black';
			let fontSize = appx.context.dynamicFonts ? 0 : ReadFontSizeCache(item, longest, ID('CacheWord'));

			// Only captains see full colors
			item.AddClass(GetClassForCard(online ? 
				// If online, show cardNone for guesser, until it has been marked, then show true card
				// Online captain sees always the truth
				((guesser && game.marked[index] == 0) ? -1 : game.key[index]) :
				// If offline, field has not been marked and you are the captain, show the key
				// Otherways always render marked value (-1 is equivalent for cardNone)
				((game.marked[index] == -1 && !guesser) ? game.key[index] : game.marked[index])
			));

			if ((online && game.marked[index] == 1) || (!online && game.marked[index] != -1)) {
				item.AddClass('hiddenText');
			}

			// Only render words when full game is in progress
			if (!appx.context.keyOnly) {
				item.SetText(game.words[index], fontSize);
			}

			item.OnClick(() => {
				if (!online) {
					item.dom.className = (game.marked[index] == -1) ?
						GetClassForCard(appx.context.pickedColor) + ' hiddenText' : 
						GetClassForCard(guesser ? -1 : game.key[index]);

					game.marked[index] = (game.marked[index] == -1) ? appx.context.pickedColor : -1;
				}
				else if (online && game.marked[index] == 0) {
					appx.OpenModal('Opravdu odkrýt?', (c) => { RenderConfirmModal(item, game, index, c); }, 0.5, 0.3);
				}
			});
		}
	}
}

'static'; function GenerateGame() {
	SetSeed(ComputeStringHash(appx.context.gameId));

	var starts = Rand() % 2;

	let game = {
		"starts" : starts,
		"key": ShuffleArray([ starts, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3 ]),
		"words" : ShuffleArray(WORDS).splice(0, 25),
		"marked" : new Array(25).fill(appx.context.online ? 0 : -1)
	};

	return game;
}

'static'; function RenderConfirmModal(item, game, index, canvas) {
	var card = canvas.AddElem(0, 0, 1, 0.8);
	card.dom.className = item.dom.className;
	card.SetText(item.dom.innerHTML);

	var buttons = [
		new AppJsButton('Ano', () => {
			game.marked[index] = 1;
			item.dom.className = GetClassForCard(game.key[index]) + " hiddenText";

			clearTimeout(appx.context.fetchHandle);
			SetFieldViaAjax(index);
			appx.CloseModal();
		}),
		new AppJsButton('Ne', () => {
			appx.CloseModal();
		})
	];
	canvas.AddElem(0, 0.8, 1, 0.2).AddButtonArray(buttons);
}

'static'; function GetClassForCard(card) {
	var result = 'card ';
	if (card == 0) result += 'cardRed ';
	else if (card == 1) result += 'cardBlue ';
	else if (card == 2) result += 'cardBystand ';
	else if (card == 3) result += 'cardBlack ';
	else result += 'cardNone ';
	return result;
}
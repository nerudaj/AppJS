'static'; function RenderPageKeyContent(canvas) {
	let game = appx.context.game;
	$("WhoStarts").innerHTML = GetPageHeaderText(game);

	if (!appx.context.roleCaption && !appx.context.online) {
		var colorPicker = canvas.AddElem(0, 0.9, 1, 0.1);

		for (let i = 0; i < 4; i++) {
			var btnBgr = colorPicker.AddElem(i * 1/4, 0, 1/4, 1);
			btnBgr.AddClass(GetClassForCard(i));

			var btn = CreateRadio(colorPicker, i * 1/4, 0, 1/4, 1, 'ColorPicker', appx.context.pickedColor == i, () => {
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

	if (redSum + blueSum == 0) {
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
			item.dom.style.border = 'solid 1px black';
			let fontSize = appx.context.dynamicFonts ? 0 : ReadFontSizeCache(item, longest, 'CacheWord');

			// Only captains see full colors
			if (guesser && game.marked[index] == 0) {
				item.AddClass('cardNone');
			}
			else item.AddClass(GetClassForCard(game.key[index]));

			if (online && game.marked[index] == 1) {
				item.AddClass('hiddenText');
			}

			// Only render words when full game is in progress
			if (!appx.context.keyOnly) {
				item.SetText(game.words[index], fontSize);
			}

			item.OnClick(() => {
				if (guesser && !online) {
					item.dom.className = (game.marked[index] == 0) ?
						GetClassForCard(appx.context.pickedColor) + ' hiddenText':
						'cardNone';

					game.marked[index] = 1 - game.marked[index];
				}
				else if (!guesser && online && game.marked[index] == 0) {
					game.marked[index] = 1;
					item.dom.className = GetClassForCard(game.key[index]) + " hiddenText";

					clearTimeout(appx.context.fetchHandle);
					SetFieldViaAjax(index);
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
		"marked" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	};

	return game;
}

function GetClassForCard(card) {
	if (card == 0) return 'cardRed';
	if (card == 1) return 'cardBlue';
	if (card == 2) return 'cardBystand';
	return 'cardBlack';
}
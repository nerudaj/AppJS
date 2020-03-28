'static'; function AjaxCallback(data) {
	if (data.status == "error") {
		alert(data.payload);
		return;
	}
	else if (data.status == "set-ok") return;

	appx.context.game.marked = data.payload;
	appx.DisplayPage('PageKey');
	appx.context.fetchHandle = setTimeout(() => { GetFieldViaAjax() }, 3000);
}

/* MAIN PAGE */
appx.AddPage(
	ID('PageMain'),
	'Krycí jména',
	RenderMainPageContent,
	[
		new AppJsButton('Hrajem!', () => {
			appx.context.gameId = $(ID('InputSeed')).value;
			appx.context.game = GenerateGame();

			if (appx.context.online) {
				SetAjaxResponseCallback(AjaxCallback);
				appx.context.fetchHandle = setTimeout(() => { GetFieldViaAjax() }, 3000);
			}

			appx.DisplayPage(ID('PageKey'));
		})
	]
);

'static'; function CreateRadio(canvas, x, y, w, h, name, value, onClick) {
	var elem = canvas.AddElem(x, y, w, h, 'input');
	elem.dom.type = 'radio';
	elem.dom.name = name;
	elem.dom.checked = value;
	elem.OnClick(() => { onClick(); });
	return elem;
}

'static'; function CreateCheckbox(canvas, x, y, w, h, key) {
	check = canvas.AddElem(x, y, w, h, 'input');
	check.dom.type = 'checkbox';
	check.dom.checked = appx.context[key];
	check.OnClick(() => {
		appx.context[key] = check.dom.checked;
		appx.DisplayPage(appx.currentPage);
	});
}

'static'; function RenderMainPageContent(canvas) {
	const LABEL_WIDTH = 0.8;
	const LABEL_HEIGHT = 1/6;

	var radioCallback = () => {
		appx.context.roleGuesser = document.getElementsByName("WhoAmi")[0].checked;
	};

	var rows = [
		["Pouze klíč", (c, x, y, w, h) => { CreateCheckbox(c, x, y, w, h, 'keyOnly'); }],
		["Online mód", (c, x, y, w, h) => { CreateCheckbox(c, x, y, w, h, 'online'); }],
		["Jsem hadač", (c, x, y, w, h) => { CreateRadio(c, x, y, w, h, 'WhoAmi', appx.context.roleGuesser, radioCallback); }],
		["Jsem kapitán", (c, x, y, w, h) => { CreateRadio(c, x, y, w, h, 'WhoAmi', !appx.context.roleGuesser, radioCallback); }],
	];
	if (appx.context.keyOnly) rows = rows.splice(0, 1);

	rows.forEach((row, index) => {
		var label = canvas.AddElem(0, LABEL_HEIGHT * index, LABEL_WIDTH, LABEL_HEIGHT);
		label.SetText(row[0]);
		label.AddClass('align_left');
		row[1](canvas, LABEL_WIDTH, LABEL_HEIGHT * index, 1 - LABEL_WIDTH, LABEL_HEIGHT);
	});


	var input = canvas.AddElem(0.1, 0.7, 0.8, 0.2, 'input', ID('InputSeed'));
	input.dom.type = 'text';
	input.dom.placeholder = 'Zadej ID hry';
	input.dom.value = appx.context.gameId;
}

/* ANOTHER PAGE */
appx.AddPage(
	ID('PageKey'),
	'<span id="WhoStarts">XXX</span>',
	RenderPageKeyContent,
	[
		new AppJsButton('Zpět', () => {
			appx.DisplayPage(ID('PageMain'));

			if (appx.context.online) {
				clearTimeout(appx.context.fetchHandle);
			}
		})
	]
);

function GetClassForCard(card) {
	if (card == 0) return 'cardRed';
	if (card == 1) return 'cardBlue';
	if (card == 2) return 'cardBystand';
	return 'cardBlack';
}

'static'; function RenderWords(canvas, game) {
	let guesser = appx.context.roleGuesser;
	let online = appx.context.online;

	for (let y = 0; y < 5; y++) {
		for (let x = 0; x < 5; x++) {
			let index = y * 5 + x;
			let item = canvas.AddElem(x * 1/5, y * 1/5, 1/5, 1/5);

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
				item.SetText(game.words[index]);
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

					SetFieldViaAjax(index, game.marked[index]);
				}
			});
		}
	}
}

'static'; function GenerateGame() {
	console.log("Creating game");
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

'static'; function RenderPageKeyContent(canvas) {
	let game = appx.context.game;
	$("WhoStarts").innerHTML = game.starts == 0 ? "Začínají červení" : "Začínají modří";

	if (appx.context.roleGuesser && !appx.context.online) {
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
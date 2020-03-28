/* MAIN PAGE */
appx.AddPage(
	ID('PageMain'),
	'Krycí jména',
	RenderMainPageContent,
	[
		new AppJsButton('Hrajem!', () => {
			appx.context.seedStr = $(ID('InputSeed')).value;
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

'static'; function RenderMainPageContent(canvas) {
	const LABEL_WIDTH = 0.8;
	const LABEL_HEIGHT = 0.2;

	var labels = [ "Pouze klíč", "Jsem hadač", "Jsem kapitán" ];
	if (appx.context.keyOnly) labels = labels.splice(0, 1);
	labels.forEach((label, index) => {
		var labelElem = canvas.AddElem(0, index * LABEL_HEIGHT, LABEL_WIDTH, LABEL_HEIGHT);
		labelElem.SetText(label);
		labelElem.AddClass('align_left');
	});

	var keyOnlyCheck = canvas.AddElem(LABEL_WIDTH, 0, 1-LABEL_WIDTH, LABEL_HEIGHT, 'input', ID('InputKeyOnly'));
	keyOnlyCheck.dom.type = 'checkbox';
	keyOnlyCheck.dom.checked = appx.context.keyOnly;
	keyOnlyCheck.OnClick(() => {
		appx.context.keyOnly = $(ID('InputKeyOnly')).checked;
		appx.DisplayPage(ID('PageMain'));
	});

	if (!appx.context.keyOnly) {
		var radioCallback = () => {
			appx.context.roleGuesser = document.getElementsByName("WhoAmi")[0].checked;
		};

		CreateRadio(canvas, LABEL_WIDTH, LABEL_HEIGHT, 1-LABEL_WIDTH, LABEL_HEIGHT, 'WhoAmi', appx.context.roleGuesser, radioCallback);
		CreateRadio(canvas, LABEL_WIDTH, 2 * LABEL_HEIGHT, 1-LABEL_WIDTH, LABEL_HEIGHT, 'WhoAmi', !appx.context.roleGuesser, radioCallback);
	}


	var input = canvas.AddElem(0.1, 0.7, 0.8, 0.2, 'input', ID('InputSeed'));
	input.dom.type = 'text';
	input.dom.placeholder = 'Zadej ID hry';
	input.dom.value = appx.context.seedStr;
}

/* ANOTHER PAGE */
appx.AddPage(
	ID('PageKey'),
	'<span id="WhoStarts">XXX</span>',
	RenderPageKeyContent,
	[
		new AppJsButton('Zpět', () => {
			appx.DisplayPage(ID('PageMain'));
		})
	]
);

function GetClassForCard(card) {
	if (card == 0) return 'cardRed';
	if (card == 1) return 'cardBlue';
	if (card == 2) return 'cardBystand';
	return 'cardBlack';
}

'static'; function RenderWords(canvas) {
	SetSeed(ComputeStringHash(appx.context.seedStr));

	var starts = Rand() % 2;
	$("WhoStarts").innerHTML = starts == 0 ? "Začínají červení" : "Začínají modří";
	var items = [ starts, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3 ];
	items = ShuffleArray(items);
	var words = ShuffleArray(WORDS);

	for (let y = 0; y < 5; y++) {
		for (let x = 0; x < 5; x++) { (function (x, y) {
			var index = y * 5 + x;
			var item = canvas.AddElem(x * 1/5, y * 1/5, 1/5, 1/5);

			if (appx.context.roleGuesser) {
				item.AddClass('cardNone');
				item.OnClick(() => {
					if (item.dom.className == " cardNone") {
						item.dom.className = GetClassForCard(
							appx.context.pickedColor
						);
					} else {
						item.dom.className = " cardNone";
					}
				});
			}
			else item.AddClass(GetClassForCard(items[index]));


			if (!appx.context.keyOnly) {
				item.SetText(words[index]);
			}
		})(x, y);}
	}
}

'static'; function RenderPageKeyContent(canvas) {
	var wordCanvas = canvas.AddElem(0, 0, 1, 0.9);
	RenderWords(appx.context.roleGuesser ? wordCanvas : canvas);

	if (appx.context.roleGuesser) {
		var colorPicker = canvas.AddElem(0, 0.9, 1, 0.1);

		for (var i = 0; i < 4; i++) { (function(i) {
			var btnBgr = colorPicker.AddElem(i * 1/4, 0, 1/4, 1);
			btnBgr.AddClass(GetClassForCard(i));

			var btn = CreateRadio(colorPicker, i * 1/4, 0, 1/4, 1, 'ColorPicker', appx.context.pickedColor == i, () => {
				appx.context.pickedColor = i;
			});
		})(i); }
	}
}
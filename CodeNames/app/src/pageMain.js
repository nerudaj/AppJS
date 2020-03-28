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

'static'; function CreateRadio(canvas, x, y, w, h, name, value, onClick) {
	var elem = canvas.AddElem(x, y, w, h, 'input');
	elem.dom.type = 'radio';
	elem.dom.name = name;
	elem.dom.checked = value;
	elem.OnClick(() => { onClick(); });
	return elem;
}

'static'; function CreateCheckbox(canvas, x, y, w, h, key) {
	var check = canvas.AddElem(x, y, w, h, 'input');
	check.dom.type = 'checkbox';
	check.dom.checked = appx.context[key];
	check.OnClick(() => {
		appx.context[key] = check.dom.checked;
		appx.DisplayPage(appx.currentPage);
	});
}
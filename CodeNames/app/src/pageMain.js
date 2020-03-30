'static'; function RenderMainPageContent(canvas) {
	var rows = [
		["Jsem kapitán", (c, x, y, w, h) => { CreateCheckbox(c, x, y, w, h, 'roleCaptain', appx.context.keyOnly); }]
	];

	RenderRowsOfSettings(canvas, rows);

	var input = canvas.AddElem(0.1, 0.4, 0.8, 0.2, 'input', ID('InputSeed'));
	input.dom.type = 'text';
	input.dom.placeholder = 'Zadej ID hry';
	input.dom.value = appx.context.gameId;
}

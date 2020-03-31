'static'; var LABEL_WIDTH = 0.8;
'static'; var LABEL_HEIGHT = 1/10;

'static'; function RenderPageSettingsContent(canvas) {
	var disableCheckbox = appx.context.keyOnly;

	var rows = [
		["Pouze klíč", (c, x, y, w, h) => { CreateCheckbox(c, x, y, w, h, 'keyOnly'); }],
		["Online mód", (c, x, y, w, h) => { CreateCheckbox(c, x, y, w, h, 'online', disableCheckbox); }],
		["Dynamické fonty", (c, x, y, w, h) => { CreateCheckbox(c, x, y, w, h, 'dynamicFonts', disableCheckbox); }]
	];

	RenderRowsOfSettings(canvas, rows);
}

'static'; function RenderRowsOfSettings(canvas, rows) {
	rows.forEach((row, index) => {
		var label = canvas.AddElem(0, LABEL_HEIGHT * index, LABEL_WIDTH, LABEL_HEIGHT);
		label.SetText(row[0]);
		label.AddClass('align_left');
		row[1](canvas, LABEL_WIDTH, LABEL_HEIGHT * index, 1 - LABEL_WIDTH, LABEL_HEIGHT);
	});
}

'static'; function CreateRadio(canvas, x, y, w, h, name, value, onClick) {
	var elem = canvas.AddElem(x, y, w, h, 'input');
	elem.dom.type = 'radio';
	elem.dom.name = name;
	elem.dom.checked = value;
	elem.OnClick(() => { onClick(); });
	return elem;
}

'static'; function CreateCheckbox(canvas, x, y, w, h, key, disabled = false) {
	var check = canvas.AddElem(x, y, w, h, 'input');
	check.dom.type = 'checkbox';
	check.dom.checked = appx.context[key];
	check.dom.disabled = disabled;

	check.OnClick(() => {
		appx.context[key] = check.dom.checked;
		appx.DisplayPage(appx.currentPage);
	});
}
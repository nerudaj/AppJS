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
	var wrap = canvas.AddElem(x, y, w, h);
	var width = wrap.height * 0.8 / wrap.width;

	var div = wrap.AddElem(0.5 - width / 2, 0.1, width, 0.8);
	div.AddClass("checkbox");
	div.OnClick(() => {
		appx.context[key] = !appx.context[key];
		appx.RefreshPage();
	});
	if (disabled) div.dom.setAttribute("disabled", "");

	var check = div.AddElem(0, 0, 1, 1, 'input', ID("Checkbox") + key);
	check.dom.type = "checkbox";
	check.dom.checked = appx.context[key];
	check.dom.disabled = disabled;
	
	var label = div.AddElem(0.1, 0.1, 0.8, 0.8, 'label');
	label.dom.for = ID("Checkbox") + key;
}
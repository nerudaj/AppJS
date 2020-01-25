/* MAIN PAGE */
appx.AddPage(
    ID('PageMain'),
    'Hex <-> RGB',
    RenderMainPageContent,
    []
);

'static'; function RenderMainPageContent(canvas) {
    var hexSection = canvas.AddElem(0, 0, 1, 4/10);
	var hexDisplay = hexSection.AddElem(0.1, 0.1, 0.8, 0.8, 'div', ID('ColorDisplay'));
	hexDisplay.SetColor('#' + appx.context.hex);
	
	var hexLabel = canvas.AddElem(0, 4/10, 1, 1/10);
	hexLabel.SetText('hex');
	
	var hexInputCanvas = canvas.AddElem(0.1, 5/10, 0.8, 1/10);
	RenderHexInput(hexInputCanvas);
	
	var rgbLabel = canvas.AddElem(0, 6/10, 1, 1/10);
	rgbLabel.SetText('rgb');
	
	var rgbInputCanvas = canvas.AddElem(0.1, 7/10, 0.8, 1/10);
	RenderRgbInput(rgbInputCanvas);
	
	// TODO: radio buttons
}

'static'; function UpdateValues(fromHex = true) {
	var k_inv = appx.context.k_inv;
	var k = appx.context.k;

	if (fromHex) {
		appx.context.rgb[0] = parseInt(k_inv(appx.context.hex.slice(0, 2)), 16);
		appx.context.rgb[1] = parseInt(k_inv(appx.context.hex.slice(2, 4)), 16);
		appx.context.rgb[2] = parseInt(k_inv(appx.context.hex.slice(4, 6)), 16);
	}
	else {
		appx.context.hex = "";

		for (let i = 0; i < 3; i++) {
			appx.context.hex += ("0" + k(parseInt(appx.context.rgb[i])).toString(16)).slice(-2);
		}
	}

	$(ID('ColorDisplay')).style.background = '#' + appx.context.hex;
	$(ID('InputColorHex')).value = appx.context.hex;

	for (let i = 0; i < 3; i++) {
		$(ID('InputColorRgb') + i).value = appx.context.rgb[i];
	}
}

'static'; function RenderHexInput(canvas) {
	var input = canvas.AddElem(0, 0.1, 1, 0.8, 'input', ID('InputColorHex'));
	input.dom.type = 'text';
	input.dom.value = appx.context.hex;
	
	input.AddEventCallback('input', () => {
		appx.context.hex = $(ID('InputColorHex')).value;
		UpdateValues();
	});
}

'static'; function RenderRgbInput(canvas) {
	for (let i = 0; i < 3; i++) {
		var input = canvas.AddElem(1/3 * i, 0.1, 1/3, 0.8, 'input', ID('InputColorRgb') + i);
		input.dom.type = 'number';
		input.dom.min = 0;
		input.dom.max = mode;
		input.dom.value = appx.context.rgb[i];
		
		input.AddEventCallback('input', () => {
			appx.context.rgb[i] = $(ID('InputColorRgb') + i).value;
			UpdateValues(false);
		});
	}
}

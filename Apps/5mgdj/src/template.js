// *** CORE LAYOUT VALUES ***
'static'; var TEMPLATE_HEADER_HEIGHT = 0.0807;
'static'; var TEMPLATE_TOOLBAR_HEIGHT = TEMPLATE_HEADER_HEIGHT;

/**
 *  @brief Return longest of two strings
 *  
 *  @param [in] str1 First string
 *  @param [in] str2 Second string
 *  @return Longer of both strings
 */
'static'; function maxStr(str1, str2) {
	if (str1.length > str2.length) return str1;
	return str2;
}

/**
 *  @brief Create button for templater
 *  
 *  @param [in] label Label written on the button
 *  @param [in] action Function callback of the button
 *  @param [in] id Optional id assigned to the button
 */
'static'; function ButtonTemplate(label, action, id) {
	this.label = label;
	this.action = action;
	this.id = DefaultArgument(id, null);
}

/**
 *  @brief Render array of buttons in parent canvas
 *  
 *  @param [in] canvas Destination canvas to render
 *  @param [in] buttons Array of ButtonTemplates
 *  @param [in] x X coordinate within canvas
 *  @param [in] y Y coordinate within canvas
 *  @param [in] w Width of button array within canvas
 *  @param [in] h Height of button array within canvas
 *  @param [in] cacheID ID to cache with fontsizes
 *  
 *  @details If any of the fields of \p buttons is null, that
 *  element will be skipped and blank space will be rendered instead.
 */
'static'; function RenderButtonArray(canvas, buttons, x, y, w, h, cacheID) {
	var BUTTON_WIDTH = w / buttons.length;

	if (GLOBAL_FONT_SIZE_CACHE[cacheID] == null) {
		var longestStr = '';
		for (var i = 0; i < buttons.length; i++) {
			longestStr = maxStr(longestStr, buttons[i].label);
		}

		GLOBAL_FONT_SIZE_CACHE[cacheID] = GetOptimalFontSize(
			longestStr,
			canvas.width * BUTTON_WIDTH,
			canvas.height * h
		);
	}

	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i] == null) continue;
		(function(p) {
			var opt = canvas.add(x + i * BUTTON_WIDTH, y, BUTTON_WIDTH, h, 'button', buttons[p].id);
			opt.addEventCallback('click', buttons[p].action);
			opt.setText(buttons[p].label, false, GLOBAL_FONT_SIZE_CACHE[cacheID]);
			if (i > 0) opt.addClass('button_separator');
		}(i));
	}
}

/**
 *  @brief Render app standard toolbar
 *  
 *  @param [in] parentCanvas Parent canvas that should contain toolbar
 *  @param [in] buttons Array of ButtonTemplates
 *  @param [in] cacheID ID for fontsize cache
 *  
 *  @details This function will create new container element positioned appropriately within parent canvas,
 *  set its style and background color and then render buttons with \ref RenderButtonArray.
 *  
 *  Use this in conjunction with \ref RenderHeaderTemplate and \ref GetDrawingTemplate.
 */
'static'; function RenderToolbarTemplate(parentCanvas, buttons, cacheID) {
	var canvas = parentCanvas.add(0, 1 - TEMPLATE_TOOLBAR_HEIGHT, 1, TEMPLATE_TOOLBAR_HEIGHT);
	canvas.addClass('toolbar');
	
	RenderButtonArray(canvas, buttons, 0, 0, 1, 1, cacheID);
}

/**
 *  @brief Render header of the view
 *  
 *  @param [in] canvas Parent canvas where header should be rendered
 *  @param [in] label Label of the header
 *  
 *  @details This creates new container within canvas, sets the text label, sets background color.
 *  Container will be positioned appropriately within parent canvas. All headers use the same cache ID.
 *  
 *  Use this in conjunction with \ref RenderToolbarTemplate and \ref GetDrawingTemplate.
 */
'static'; function RenderHeaderTemplate(canvas, label) {
	var header = canvas.add(0, 0, 1, TEMPLATE_HEADER_HEIGHT, 'div', ID('PageHeader'));
	
	var cacheID = ID('CacheHeaders');
	if (GLOBAL_FONT_SIZE_CACHE[cacheID] == null) {
		GLOBAL_FONT_SIZE_CACHE[cacheID] = GetOptimalFontSize(label, header.width, header.height);
	}
	
	header.setText(label, false, GLOBAL_FONT_SIZE_CACHE[cacheID]);
	header.addClass('header');
}

/**
 *  @brief Get canvas for drawing view context (header and toolbar free)
 *  
 *  @param [in] core Core canvas where drawing canvas will be embedded
 *  @param [in] hasHeader Whether header is present in view
 *  @return Resulting canvas
 *  
 *  @details Use this in conjunction with \ref RenderToolbarTemplate and \ref RenderHeaderTemplate.
 */
'static'; function GetDrawingTemplate(core, hasHeader) {
	var HEADER_OFFSET = DefaultArgument(hasHeader, true) ? TEMPLATE_HEADER_HEIGHT : 0;
	var result = core.add(0, HEADER_OFFSET, 1, 1 - HEADER_OFFSET - TEMPLATE_TOOLBAR_HEIGHT);
	result.addClass('content');
	return result;
}
// *** CORE LAYOUT VALUES ***
'static'; var TEMPLATE_HEADER_HEIGHT = 0.0807;
'static'; var TEMPLATE_TOOLBAR_HEIGHT = TEMPLATE_HEADER_HEIGHT;

/**
 *  @brief Get longest string in array
 */
'static'; function longestStr(arr) {
	return arr.reduce((a, b) => { return a.length > b.length ? a : b; });
}

/**
 *  @brief Create button for templater
 *  
 *  @param [in] label Label written on the button
 *  @param [in] action Function callback of the button
 *  @param [in] id Optional id assigned to the button
 */
'static'; function ButtonTemplate(label, action, id = null) {
	this.label = label;
	this.action = action;
	this.id = id;
}

/**
 *  @brief Render array of buttons in chosen canvas
 *  
 *  @param [in] canvas Destination canvas to render
 *  @param [in] buttons Array of ButtonTemplates
 *  @param [in] cacheID ID to cache with fontsizes
 *  
 *  @details If any of the fields of \p buttons is null, that
 *  element will be skipped and blank space will be rendered instead.
 */
'static'; function RenderButtonArray(canvas, buttons, cacheID) {
	var BUTTON_WIDTH = 1 / buttons.length;

	var longestLabel = longestStr(buttons.map(btn => btn.label));

	buttons.forEach((button, index) => {
		if (!button) return;

		var opt = canvas.add(index * BUTTON_WIDTH, 0, BUTTON_WIDTH, 1, 'button', button.id);
		var fontSize = ReadFontSizeCache(opt, longestLabel, cacheID);
		opt.onClick(button.action);
		opt.setText(button.label, fontSize);

		if (index > 0) opt.addClass('button_separator');
	});
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
'static'; function CreateToolbarTemplate(canvas, buttons, cacheID) {
	var toolbar = canvas.add(0, 1 - TEMPLATE_TOOLBAR_HEIGHT, 1, TEMPLATE_TOOLBAR_HEIGHT);
	toolbar.addClass('toolbar');

	RenderButtonArray(toolbar, buttons, cacheID);
	return toolbar;
}

/**
 *  @brief Render header of the view
 *  
 *  @param [in] canvas Parent canvas where header should be rendered
 *  
 *  @details This creates new container within canvas, sets the text label, sets background color.
 *  Container will be positioned appropriately within parent canvas. All headers use the same cache ID.
 *  
 *  Use this in conjunction with \ref RenderToolbarTemplate and \ref GetDrawingTemplate.
 */
'static'; function CreateHeaderTemplate(canvas) {
	var header = canvas.add(0, 0, 1, TEMPLATE_HEADER_HEIGHT);
	header.addClass('header');
	return header;
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
'static'; function CreateContentTemplate(core, hasHeader = true, hasToolbar = true) {
	var HEADER_OFFSET = hasHeader ? TEMPLATE_HEADER_HEIGHT : 0;
	var TOOLBAR_OFFSET = hasToolbar ? TEMPLATE_TOOLBAR_HEIGHT : 0;

	var result = core.add(0, HEADER_OFFSET, 1, 1 - HEADER_OFFSET - TOOLBAR_OFFSET);
	result.addClass('content');
	return result;
}

/**
 *  @brief Creates an application page
 * 
 *  @param[in]  header          Text or function that will affect header
 *  @param[in]  content         Function that will render content
 *  @param[in]  toolbarButtons  Array of ButtonTemplates that will be rendered in toolbar
 *  @param[in]  pageID          ID of the rendered page (used in font cache)
 *  @param[in]  canvas          Canvas to render page into (Default: appx.canvas)
 * 
 *  If header is text, this text will be rendered in the heading. If it is
 *  a function, a subcanvas for heading will be created and passed to header function.
 *  Content is expected to be a function accepting parent canvas.
 *  If header is null, then no heading will be rendered and content will be bigger.
 *  If toolbarButtons is null, then no toolbar will be rendered and content will be bigger.
 */
'static'; function CreatePage(header, content, toolbarButtons, pageID, canvas = appx.canvas) {
	if (header) {
		var template = CreateHeaderTemplate(canvas);
		
		if (typeof header == "function") header(template);
		else {
			var fontSize = ReadFontSizeCache(template, header, ID('CacheHeaders'));
			template.setText(header, fontSize);
		}
	}

	if (toolbarButtons) {
		CreateToolbarTemplate(canvas, toolbarButtons, pageID);
	}

	var contentCanvas = CreateContentTemplate(canvas, header, toolbarButtons);
	content(contentCanvas);
}

/**
 *  @brief Construct and open modal window
 * 
 * 	@param[in]  header   Text that will go into header
 *  @param[in]  text     Text that will go into content
 *  @param[in]  w        Width of the modal in relation to parent canvas
 *  @param[in]  h        Height of the modal in relation to parent canvas
 *  @param[in]  modalID  ID of the modal. Will be used in font cache and for closing the window
 *  @param[in]  canvas   Parent canvas to render to (Default: appx.canvas)
 * 
 *  Every modal window will have close button in top right corner.
 *  If you click outside of the modal window, it will close.
 *  Size of the text in the content is governed by the size of the text in heading.
 *  Content is automatically scrollable.
 */
'static'; function CreateModal(header, text, w, h, modalID = ID('DefaultModal'), canvas = appx.canvas) {
	var modalWrapper = canvas.add(0, 0, 1, 1, 'div', modalID);
	modalWrapper.onClick(() => { CloseModal(modalID); });

	var modal = modalWrapper.add((1 - w) / 2, (1 - h) / 2, w, h);
	modal.onClick(e => e.stopPropagation()); // Clicking into modal will not close the modal

	var title = modal.add(0, 0, 0.9, 0.1);
	var fontSize = ReadFontSizeCache(title, header, modalID);
	title.setText(header, fontSize);
	title.addClass('header');

	var close = modal.add(0.9, 0, 0.1, 0.1, 'button');
	close.setText('✕', fontSize);
	close.addClass('toolbar');
	close.onClick(() => { CloseModal(modalID); });

	var content = modal.add(0, 0.1, 1, 0.9);
	content.addClass('scrollable content modal');
	content.setText(text, fontSize);
}

/**
 *  @brief Close opened modal window
 * 
 *  @param[in]  modalID  Id of the modal to close
 * 
 *  You can use this function to close the modal window programmatically.
 */
'static'; function CloseModal(modalID = ID('DefaultModal')) {
	$(modalID).remove();
}
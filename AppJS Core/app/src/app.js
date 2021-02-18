"use strict";

/**
 *  \brief Cache for speeding up text-fit computations
 */
'static'; var GLOBAL_FONT_SIZE_CACHE = {}
'static'; var PREVENT_RESIZE = false;

function ID(id) {return id;}

// =============== //
// === METHODS === //
// =============== //
/**
 *  @brief Get a value from a cache
 * 
 *  @param[in]  canvas   Parent canvas for computation
 *  @param[in]  label    Label to autosize
 *  @param[in]  cacheID  Index into cache
 * 
 *  @return Font size stored in cache
 * 
 *  If there is a record in cache for ID, it is returned.
 *  If there is no record, new record is computed (label is autofitted into canvas),
 *  stored in cache and returned.
 */
'static'; function ReadFontSizeCache(canvas, label, cacheID) {
    if (GLOBAL_FONT_SIZE_CACHE[cacheID] == null) {
        GLOBAL_FONT_SIZE_CACHE[cacheID] = GetOptimalFontSize(label, canvas.width, canvas.height);
    }

    return GLOBAL_FONT_SIZE_CACHE[cacheID];
}

'static'; function ClearFontSizeCache() {
    GLOBAL_FONT_SIZE_CACHE = {};
}

/**
 *  @brief Get element with given id
 */
function $(id) {
    return document.getElementById(id);
}

/**
 *  @brief Get longest string in an array of strings
 */
'static'; function LongestString(strings) {
    return strings.length ? strings.reduce((a, b) => a.length > b.length ? a : b) : "";
}

/**
 *  @brief How big the font should be to text fit the given boundaries
 *  
 *  @param[in]  str     Text that should fit
 *  @param[in]  width   Width of the bounding box
 *  @param[in]  height  Height of the bounding box
 *  @param[in]  xless   Size of text should not exceed width * xless (Default: 0.8)
 *  @param[in]  yless   Size of text should not exceed height * yless (Default: 0.8)
 *  @return Optimal font size
 *  
 *  @details This function does not take into account word breaking.
 *  
 *  For this to work, the html file must contain element with id 'HiddenResizer'. This element
 *  has to be span with visibility:hidden.
 */
'static'; function GetOptimalFontSize(str, width, height, xless = 0.8, yless = 0.8) {
    // Initialize bisection boundaries
    var min = 1;
    var max = height;

    // Access resizer and insert string
    var resizer = $("HiddenResizer");
    resizer.innerHTML = str;
    
    // Perform bisection
    while ((max - min) > 1) {
        // Compute middle
        var middle = parseInt((min + max) / 2);
        
        // Update resizer
        resizer.style.fontSize = middle + "px";
        
        // Update bisection control variables
        if (resizer.offsetWidth <= width * xless && resizer.offsetHeight <= height * yless) {
            min = middle;
        }
        else {
            max = middle;
        }
    }
    
    return min;
}

// =============== //
// === ELEMENT === //
// =============== //
'static'; function AppJsButton(label, action, id = null) {
    this.label = label;
    this.action = action;
    this.id = id;
}

'static'; function AppJsElement() {
    this.dom = null; ///< DOM of the element
    this.width = 0; ///< Width of the element in pixels
    this.height = 0; ///< Height of the element in pixels
}

/**
 *  @brief Add sub element to element
 *
 *  @param [in] x X coordinate, in %.
 *  @param [in] y Y coordinate, in %.
 *  @param [in] w Width of the element, in %.
 *  @param [in] h Height of the element, in %.
 *  @param [in] type Type of the element. (Default: div)
 *  @param [in] id ID of the DOM. (Default: none)
 *  @return Reference to new element
 *
 *  @details Parent element defines the coordinate system for the subelement.
 *  All % values are numbers from 0 to 1. XY goes from topleft corner of the
 *  parent element. Example: To create an element that takes left half of the parent,
 *  use add(0, 0, 0.5, 1);
 */
'static'; AppJsElement.prototype.AddElem = function(x, y, w, h, type = "div", id = null) {
    var result = new AppJsElement();
    var node = document.createElement(type);
    
    if (id != null) {
        node.setAttribute("id", id);
    }

    this.dom.appendChild(node);
    
    result.dom = node;
    result.width = this.width * w;
    result.height = this.height * h;
    result.dom.style.position = "absolute";
    result.dom.style.left = this.width * x + "px";
    result.dom.style.top = this.height * y + "px";
    result.dom.style.width = result.width + "px";
    result.dom.style.height = result.height + "px";

    if (type == 'input') {
        result.AddEventCallback('focus', () => { PREVENT_RESIZE = true; });
        result.AddEventCallback('blur', () => { setTimeout(() => { PREVENT_RESIZE = false; }, 500); });
    }

    return result;
}

'static'; AppJsElement.prototype.AddButtonArray = function(buttons, cacheID, longestLabel = null, maxButtonCnt = 0) {
    var BUTTON_WIDTH = 1 / buttons.length;
    if (longestLabel == null) var longestLabel = LongestString(buttons.map(btn => btn.label));

    // This is only relevant for toolbar buttons
    if (maxButtonCnt > 0) {
        var dummy = this.AddElem(0, 0, 1 / maxButtonCnt,1);
        ReadFontSizeCache(dummy, longestLabel, cacheID);
    }

    buttons.forEach((item, index) => {
        if (!item) return;

        var button = this.AddElem(index * BUTTON_WIDTH, 0, BUTTON_WIDTH, 1, 'button', item.id);
        var fontSize = ReadFontSizeCache(button, longestLabel, cacheID);
        button.OnClick(item.action);
        button.SetText(item.label, fontSize);

        if (index > 0) button.AddClass('button_separator');
    });
}

'static'; AppJsElement.prototype.SetColor = function(color) {
    this.dom.style.background = color;
}

'static'; AppJsElement.prototype.SetText = function(str, fontSize = 0) {
	if (str === "" && fontSize === 0) throw new Error("Can't call SetText with empty string and zero font size!");
    fontSize = fontSize == 0 ? GetOptimalFontSize(str, this.width, this.height) : fontSize;

    this.dom.style.fontSize = fontSize + "px";
    this.dom.innerHTML = str;
}

'static'; AppJsElement.prototype.AddClass = function(name) {
    this.dom.className += ' ' + name;
}

'static'; AppJsElement.prototype.AddEventCallback = function(event, action) {
    this.dom.addEventListener(event, action);
}

'static'; AppJsElement.prototype.OnClick = function(action) {
    this.AddEventCallback('click', action);
}

// =========== //
// === APP === //
// =========== //
/**
 *  @brief Object representing app itself
 *  
 *  @details App consists of drawing canvas, shared context
 *  and a number of view between which you can freely toggle.
 */
'static'; function AppJs() {
    this.context = {}; ///< Shared application context. Any data that should be persistent has to be saved there
    this.canvas = new AppJsElement(); ///< Core drawing canvas
    this.pages = {}; ///< Storage for pages
    this.currentPage = ""; ///< Index to current view
    this.longestHeader = "";
    this.longestBtnLabel = "";
    this.maxToolbarBtns = 0;
    this.restoreModal = () => {};
}

'static'; AppJs.prototype.Bootstrap = function(canvasId) {
    this.canvas.dom = $(canvasId);

    var computeLongest = () => {
        var flatten = arr => [].concat(...arr); // HOTFIX: Edge does not support Array.prototype.flat
        var rawPages = flatten(Object.entries(this.pages)).filter((p,i) => i % 2 == 1);
        this.longestHeader = LongestString(rawPages.map(i => i.$header).filter(i => i));
        this.longestBtnLabel = LongestString(flatten(rawPages.map(i => i.$buttons)).filter(i => i).map(i => i.label));
        this.maxToolbarBtns = rawPages.map(i => i.$buttons).map(i => i.length).reduce((a,b) => a > b ? a : b);
    }

    window.addEventListener('resize', () => {
        if (PREVENT_RESIZE) return;

        ClearFontSizeCache(); // Clear font size cache
        computeLongest();

        this.Render();
        this.restoreModal();
    });

    computeLongest();
}

/**
 *  @brief Add new page to application
 * 
 *  @param[in]  pageID   ID of the page (used for toggling)
 *  @param[in]  header   Text that will be displayed in heading (or null)
 *  @param[in]  content  Callback that accepts AppJsElement which will render content of page
 *  @param[in]  buttons  Array of AppJsButtons that will be displayed in toolbar
 * 
 *  If header is null, then no heading will be displayed and content canvas will be bigger.
 *  If buttons is null, then no toolbar will be displayed and content canvas will be bigger.
 * 
 *  Adding the page will not automatically display it, it will just be registered with the
 *  app. You need to call DisplayPage to display it.
 */
'static'; AppJs.prototype.AddPage = function(pageID, header, content, buttons) {
    var pages = this.pages;
    if (pages.hasOwnProperty(pageID)) {
        throw "View " + pageID + " already exists!";
    }

    // Each page is rendered using following function
    this.pages[pageID] = {
        $header: header, 
        $callback: content, 
        $buttons: buttons
    };
}

/**
 *  @brief Construct and open modal window
 * 
 * 	@param[in]  header   Text that will go into header
 *  @param[in]  text     Text that will go into content
 *  @param[in]  w        Width of the modal in relation to parent canvas
 *  @param[in]  h        Height of the modal in relation to parent canvas
 *  @param[in]  modalID  ID of the modal. Will be used in font cache and for closing the window
 * 
 *  Every modal window will have close button in top right corner.
 *  If you click outside of the modal window, it will close.
 *  Size of the text in the content is governed by the size of the text in heading.
 *  Content is automatically scrollable.
 */
'static'; AppJs.prototype.OpenModal = function(header, contentCallback, w, h, modalID = ID('AppJsModal')) {
    this.restoreModal = () => { this.OpenModal(header, contentCallback, w, h, modalID); };

    var modalWrapper = this.canvas.AddElem(0, 0, 1, 1, 'div', modalID);
	modalWrapper.OnClick(() => { this.CloseModal(modalID); });

	var modal = modalWrapper.AddElem((1 - w) / 2, (1 - h) / 2, w, h);
	modal.OnClick(e => e.stopPropagation()); // Clicking into modal will not close the modal

    var titleHeight = 50 / modal.height;
    var closeWidth = 50 / modal.width;

	var title = modal.AddElem(0, 0, 1-closeWidth, titleHeight);
	var fontSize = ReadFontSizeCache(title, header, modalID);
	title.SetText(header, fontSize);
	title.AddClass('header');

	var close = modal.AddElem(1-closeWidth, 0, closeWidth, titleHeight, 'button');
	close.SetText('✕', fontSize);
	close.AddClass('toolbar');
	close.OnClick(() => { this.CloseModal(modalID); });

	var content = modal.AddElem(0, titleHeight, 1, 1-titleHeight);
	content.AddClass('scrollable content modal');
	contentCallback(content, fontSize);
}

/**
 *  @brief Close opened modal window
 * 
 *  @param[in]  modalID  Id of the modal to close
 * 
 *  You can use this function to close the modal window programmatically.
 */
'static'; AppJs.prototype.CloseModal = function(modalID = ID('AppJsModal')) {
    this.restoreModal = () => {};
	$(modalID).remove();
}

/**
 *  @brief Change displayed page
 * 
 *  @param[in]  pageID  ID of page to display
 */
'static'; AppJs.prototype.DisplayPage = function(pageID) {
    if (!this.pages.hasOwnProperty(pageID)) {
        throw "View " + pageID + " does not exist!";
    }

    this.currentPage = pageID;
    this.Render();
    PREVENT_RESIZE = false;
}

'static'; AppJs.prototype.RefreshPage = function() {
    this.Render();
    PREVENT_RESIZE = false;
    this.restoreModal();
}

/**
 *  @brief Private method used to render the page
 *  
 *  @warn Do not call this function directly!
 */
'static'; AppJs.prototype.Render = function() {
    var canvas = this.canvas;
    
    // Clear everything rendered so far
    canvas.dom.innerHTML = "";
    
    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.dom.style.position = "absolute";
    canvas.dom.style.width = canvas.width + "px";
    canvas.dom.style.height = canvas.height + "px";

    // Declare some auxiliary private rendering functions
    var HEADER_HEIGHT = 0.0807;
    var TOOLBAR_HEIGHT = HEADER_HEIGHT;

    var CreateHeader = (canvas, text) => {
        var header = canvas.AddElem(0, 0, 1, HEADER_HEIGHT);
        header.AddClass('header');
        header.SetText(text, ReadFontSizeCache(header, text, ID('AppJsHeader')));
    };

    var CreateToolbar = (canvas, buttons) => {
        toolbar = canvas.AddElem(0, 1 - TOOLBAR_HEIGHT, 1, TOOLBAR_HEIGHT);
        toolbar.AddClass('toolbar');
        toolbar.AddButtonArray(buttons, ID('AppJsToolbar'), this.longestBtnLabel, this.maxToolbarBtns);
    };

    var CreateContentCanvas = (canvas, hasHeader = true, hasToolbar = true) => {
        var HEADER_OFFSET = hasHeader ? HEADER_HEIGHT : 0;
        var TOOLBAR_OFFSET = hasToolbar ? TOOLBAR_HEIGHT : 0;
    
        var result = canvas.AddElem(0, HEADER_OFFSET, 1, 1 - HEADER_OFFSET - TOOLBAR_OFFSET);
        result.AddClass('content');
        return result;
    }

    // Render current view
    var render = (canvas, header, callback, buttons) => {
        if (header) CreateHeader(canvas, header);
        if (buttons) CreateToolbar(canvas, buttons);
        callback(CreateContentCanvas(canvas, header, buttons));
    }
    var page = this.pages[this.currentPage];
    render(this.canvas, page.$header, page.$callback, page.$buttons);
}

'static'; AppJs.prototype.LocalStorageAvailable = function() {
    var storage;
    try {
        storage = window.localStorage;
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

'static'; AppJs.prototype.SaveToLocalStorage = function(item, id) {
    if (this.LocalStorageAvailable()) {
        window.localStorage.setItem(id, JSON.stringify(item));
    }
}

'static'; AppJs.prototype.LoadFromLocalStorage = function(id, fallback) {
    if (!this.LocalStorageAvailable()) return fallback;
    var result = window.localStorage.getItem(id);
    if (result == null) return fallback;
    return JSON.parse(result);
}

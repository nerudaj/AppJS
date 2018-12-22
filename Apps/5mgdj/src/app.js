"use strict";

var version = '2.0.0';

'static'; var LOG_ERROR_LEVEL = 1;
'static'; var PREVENT_RESIZE = false;
/**
 *  \brief Cache for speeding up text-fit computations
 */
'static'; var GLOBAL_FONT_SIZE_CACHE = {}


function ID(id) {return id;}

function ENUM(id) {return id;}

// =============== //
// === METHODS === //
// =============== //
'static'; function ClearOptimizationCache() {
	GLOBAL_FONT_SIZE_CACHE = {};
}

/**
 *  @brief Get reference to DOM object by id
 */
'static'; function GetDOM(id) {
	return document.getElementById(id);
}

'static'; function GetElementsByName(id) {
	return document.getElementsByName(id);
}

/**
 *  @brief Display error message
 *  
 *  @param [in] module Origin module of message
 *  @param [in] func In which function message occured
 *  @param [in] message Message itself
 *  
 *  @details The message will be printed to console.error and
 *  also will be printed by alert. Alert printing can be supressed
 *  globally by setting LOG_ERROR_LEVEL to 0.
 */
'static'; function LogError(module, func, message) {
	var str = "ERROR: " + module + "::" + func + ": " + message;
	console.error(str);
	
	if (LOG_ERROR_LEVEL > 0) alert(str);
}

/**
 *  @brief Get random number
 *  
 *  @param [in] min Minimum value (exclusive)
 *  @param [in] max Maximum value (exclusive)
 *  @return Random number
 */
'static'; function Random(min, max) {
	return Math.floor((Math.random() * max) + min);
}

/**
 *  @brief Assign default value to undefined argument
 *  
 *  @param [in] arg Argument to test
 *  @param [in] value Default value
 *  @return \p arg or \p value
 *  
 *  @details If \p arg is undefined then value is returned. Otherwise the \p arg is returned.
 */
'static'; function DefaultArgument(arg, value) {
	return typeof arg !== "undefined" ? arg : value;
}

/**
 *  @brief How big the font should be to text fit the given boundaries
 *  
 *  @param [in] str Text that should fit
 *  @param [in] width Width of the bounding box
 *  @param [in] height Height of the bounding box
 *  @param [in] startSize From which fontSize the algorithm should start (Default: 100)
 *  @return Optimal font size
 *  
 *  @details This function does not take into account word breaking. Also, the algorithm looks for
 *  the first fontSize that fit, so if you're element is bigger than a text at fontSize 100, try
 *  tweaking the \p startSize to higher values like 500.
 *  
 *  For this to work, the html file must contain element with id 'HiddenResizer'. This element
 *  has to be span with visibility:hidden.
 */
'static'; function GetOptimalFontSize(str, width, height, startSize, xless, yless) {
	// Initialize bisection boundaries
	var min = 1;
	var max = DefaultArgument(startSize, 100);
	
	// Initialize bounding box values
	width *= DefaultArgument(xless, 0.8);
	height *= DefaultArgument(yless, 0.8);
	
	// Access resizer and insert string
	var resizer = GetDOM("HiddenResizer");
	resizer.innerHTML = str;
	
	// Perform bisection
	while ((max - min) > 1) {
		// Compute middle
		var middle = parseInt((min + max) / 2);
		
		// Update resizer
		resizer.style.fontSize = middle + "px";
		var rw = resizer.offsetWidth;
		var rh = resizer.offsetHeight;
		
		// Update bisection control variables
		if (rw <= width && rh <= height) {
			min = middle;
		}
		else {
			max = middle;
		}
	}
	
	return min;
}

// =============== //
// === aELEMENT === //
// =============== //
'static'; function ClassElement() {
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
ClassElement.prototype.add = function(x, y, w, h, type, id) {
	type = DefaultArgument(type, "div");
	id = DefaultArgument(id, null);

	var result = new ClassElement();

	var node = document.createElement(type);
	
	if (id != null) {
		node.setAttribute("id", id);
	}
	
	this.dom.appendChild(node);

	result.dom = node;
	result.width = this.width * w;
	result.height= this.height * h;

	result.dom.style.position = "absolute";
	result.dom.style.left = this.width * x + "px";
	result.dom.style.top = this.height * y + "px";
	result.dom.style.width = result.width + "px";
	result.dom.style.height = result.height + "px";
	
	if (type == 'input' || type == 'textarea') {
		result.addEventCallback('focus', function() { PREVENT_RESIZE = true; });
		result.addEventCallback('blur', function() { setTimeout(function() { PREVENT_RESIZE = false; }, 500); });
	}

	return result;
}

/**
 *  @brief Set background color of an element
 *  
 *  @param [in] color Valid CSS string for color. You can use canonical names, hexa (#HHHHHH), hsl, rgb, ...
 */
'static'; ClassElement.prototype.setColor = function(color) {
	this.dom.style.background = color;
}

/**
 *  @brief Set text to the element
 *  
 *  @param [in] str Text
 *  @param [in] autofit Whether the text should autofit the element (Default: false)
 *  @param [in] startsize Starting fontSize for \ref GetOptimalFontSize. (Default: 100)
 *  
 *  @details If the text is not set to autofit, the fontSize is implicit and words can
 *  break.
 */
'static'; ClassElement.prototype.setText = function(str, autofit, startSize) {
	autofit = DefaultArgument(autofit, false);
	
	var fontSize = null;
	
	if (autofit) {
		startSize = DefaultArgument(startSize, 100);
		fontSize = GetOptimalFontSize(str, this.width, this.height, startSize);
	}
	else if (startSize !== 'undefined') {
		fontSize = startSize;
	}
	
	var t = document.createTextNode(str);
	
	if (fontSize != null) {
		this.dom.style.fontSize = fontSize + "px";
	}
	
	this.dom.appendChild(t);
}

'static'; ClassElement.prototype.setParagraph = function(str, autofit, startSize) {
	autofit = DefaultArgument(autofit, false);
	
	var fontSize = null;
	
	if (autofit) {
		startSize = DefaultArgument(startSize, 100);
		fontSize = GetOptimalFontSize(str, this.width, this.height, startSize, 1, 1);
	}
	else if (startSize !== 'undefined') {
		fontSize = startSize;
	}
	
	if (fontSize != null) {
		this.dom.style.fontSize = fontSize + "px";
	}
	
	this.dom.innerHTML = str;
}

'static'; ClassElement.prototype.addClass = function(name) {
	this.dom.className += ' ' + name;
}

'static'; ClassElement.prototype.addEventCallback = function(event, action) {
	this.dom.addEventListener(event, action);
}

// ============ //
// === VIEW === //
// ============ //
/**
 *  @brief Single page view of the application
 *  
 *  @details This object represents a single page of
 *  your application. Application can consist of many views.
 *  All views share the same canvas and when one is rendered,
 *  it deletes any data previously rendered to the canvas.
 *  
 *  When creating new view, placeholder \ref render method is
 *  used. You are obligated to replace it with your own. Then
 *  you can access the drawing canvas with this.app.canvas
 *  and you can also access app's shared data with this.app.context.
 */
'static'; function ClassView() {
	this.app = null; ///< Reference to the app object
}

/**
 *  @brief Render this view
 *  
 *  @details This method is only a placeholder. Upon creating new
 *  view, you are obligated to set this.render to your own callback.
 */
'static'; ClassView.prototype.render = function() {
	LogError("ClassView", "render", "This method is not implemented!");
}

/**
 *  @brief Bootstrap the view
 *  
 *  @param [in] canvas Reference to the \ref App object
 *  
 *  @details This method is called automatically by \ref App during \ref addView.
 */
'static'; ClassView.prototype.bootstrap = function(app) {
	this.app = app;
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
'static'; function ClassApp() {
	this.context = {}; ///< Shared application context. Any data that should be persistent has to be saved there
	this.canvas = new ClassElement(); ///< Core drawing canvas
	this.views = {}; ///< Storage for views
	this.currentView = ""; ///< Index to current view
}

/**
 *  @brief Add new view to application
 *  
 *  @param [in] view \ref View object
 *  @param [in] name Name for the view (must be unique)
 *  @return TRUE on success, FALSE if view already exists
 *  
 *  @details View is bootstraped automatically if added
 *  successfully.
 */
'static'; ClassApp.prototype.addView = function(view, name) {
	var views = this.views;
	
	if (views.hasOwnProperty(name)) {
		LogError("ClassApp", "addView", "View with name " + name + " already exists!");
		return false;
	}
	
	views[name] = view;
	views[name].bootstrap(this);
	
	return true;
}

/**
 *  @brief Change the rendered view
 *  
 *  @param [in] name Name of the view to change to
 *  
 *  @pre \ref addView with \p name was called
 */
'static'; ClassApp.prototype.toggleView = function(name) {
	if (!this.views.hasOwnProperty(name)) {
		LogError("ClassApp", "toggleView", "View called " + name + " does not exist!");
		return;
	}
	
	this.currentView = name;
	this.render();
}

/**
 *  @brief Render app. Basically redraws currently selected view
 *  
 *  @details When app is redrawed it also recomputes viewport, so it will resize if needed
 */
'static'; ClassApp.prototype.render = function() {
	var canvas = this.canvas;
	
	// Clear everything rendered so far
	canvas.dom.innerHTML = "";
	
	// Resize canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	canvas.dom.style.position = "absolute";
	canvas.dom.style.width = canvas.width + "px";
	canvas.dom.style.height = canvas.height + "px";
	
	// Render current view
	this.views[this.currentView].render();
}

/**
 *  @brief Bootstrap the app
 *  
 *  @param [in] id ID of the core canvas DOM element
 *  
 *  @details This method should be called as the first
 *  thing in your program. It registers automatic resize
 *  of the app as well as it binds to drawing canvas.
 */
'static'; ClassApp.prototype.bootstrap = function(id) {
	this.canvas.dom = GetDOM(id);
	
	var that = this;
	window.addEventListener('resize', function() {
		if (PREVENT_RESIZE) return;
		ClearOptimizationCache();
		that.render();
	});
}
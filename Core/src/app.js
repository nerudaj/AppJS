"use strict";

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
 *  @brief Get random integer number
 *  
 *  @param [in] min Minimum value (exclusive)
 *  @param [in] max Maximum value (exclusive)
 */
'static'; function Random(min, max) {
	return Math.floor((Math.random() * max) + min);
}

/**
 *  @brief How big the font should be to text fit the given boundaries
 *  
 *  @param [in] str     Text that should fit
 *  @param [in] width   Width of the bounding box
 *  @param [in] height  Height of the bounding box
 *  @param [in] max     Maximum possible size for a text
 *  @return Optimal font size
 *  
 *  @details This function does not take into account word breaking. Also, the algorithm looks for
 *  the first fontSize that fit, so if you're element is bigger than a text at fontSize 100, try
 *  tweaking the \p startSize to higher values like 500.
 *  
 *  For this to work, the html file must contain element with id 'HiddenResizer'. This element
 *  has to be span with visibility:hidden.
 */
'static'; function GetOptimalFontSize(str, width, height, max = 100, xless = 0.8, yless = 0.8) {
	// Initialize bisection boundaries
	var min = 1;

	// Access resizer and insert string
	var resizer = GetDOM("HiddenResizer");
	resizer.innerHTML = str;
	
	// Perform bisection
	while ((max - min) > 1) {
		// Compute middle
		var middle = parseInt((min + max) / 2);
		
		// Update resizer
		resizer.style.fontSize = middle + "px";
		
		// Update bisection control variables
		if (resizer.offsetWidth <= width && resizer.offsetHeight <= height) {
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
'static'; class ClassElement {
	constructor() {
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
	add(x, y, w, h, type = "div", id = null) {
		var result = new ClassElement();
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
			result.addEventCallback('focus', function () { PREVENT_RESIZE = true; });
			result.addEventCallback('blur', function () { setTimeout(function () { PREVENT_RESIZE = false; }, 500); });
		}

		return result;
	}

	setColor(color) {
		this.dom.style.background = color;
	}

	setText(str, autofit = false, startSize = 100) {
		var fontSize = startSize;
		if (autofit) {
			fontSize = GetOptimalFontSize(str, this.width, this.height, startSize);
		}

		var t = document.createTextNode(str);
		this.dom.style.fontSize = fontSize + "px";
		this.dom.appendChild(t);
	}

	addClass(name) {
		this.dom.className += ' ' + name;
	}

	addEventCallback(event, action) {
		this.dom.addEventListener(event, action);
	}

	onClick(action) {
		this.addEventCallback('click', action);
	}
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
'static'; class ClassView {
	constructor() { }
	render() {
		throw "this.render is not set!";
	}
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
'static'; class ClassApp {
	constructor() {
		this.context = {}; ///< Shared application context. Any data that should be persistent has to be saved there
		this.canvas = new ClassElement(); ///< Core drawing canvas
		this.views = {}; ///< Storage for views
		this.currentView = ""; ///< Index to current view
	}

	bootstrap(canvasID) {
		this.canvas.dom = GetDOM(canvasID);
		window.addEventListener('resize', () => {
			if (PREVENT_RESIZE) return;

			ClearOptimizationCache();
			this.render();
		});
	}

	addView(view, name) {
		var views = this.views;
		if (views.hasOwnProperty(name)) {
			throw "View " + name + " already exists!";
		}

		views[name] = view;
	}

	toggleView(name) {
		if (!this.views.hasOwnProperty(name)) {
			throw "View " + name + " does not exist!";
		}

		this.currentView = name;
		this.render();
		PREVENT_RESIZE = false;
	}

	render() {
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
}

'static'; var POINT_COUNT = 100;
'static'; var FRAME_TIME = 25; // in ms
'static'; var ANIMATION_DURATION = 1; // in s
'static'; var LABEL_INPUT = 'Input function:';
'static'; var LABEL_FOO = 'Function visualisation:';
'static'; var LABEL_ANIM = 'Animation visualisation:';
'static'; var STROKE_WHITE = '#FFFFFF';

/* PUBLIC FUNCTION DB START */
function Power(x, exp) {
	var result = 1;
	for (var i = 0; i < exp; i++) result = result * x;
	return result;
}

function Flip(x) {
	return 1-x;
}

function SmoothStart(x, level) {
	return Math.pow(x, level);
}

function SmoothStop(x, level) {
	return Flip(SmoothStart(Flip(x), level));
}

function Crossfade(a, b, x) {
	return a + (b - a) * x;
}
/* PUBLIC FUNCTION DB END */

'static'; function RenderMainPage() {
	var canvas = this.app.canvas;
	
	var board = GetDrawingTemplate(canvas, false); // No header
	
	if (IsWidescreen(board)) {
		RenderWidescreenSetup(this.app, board);
	}
	else {
		RenderPortraitscreenSetup(this.app, board);
	}
	
	var buttons = [
		new ButtonTemplate('Apply', function() {
			processFunction(app);
		}),
		new ButtonTemplate('Hints', function() {
			clearInterval(app.context.handle);
			app.toggleView(ENUM('hints'));
		})
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
	
	ReallyClearInterval(this.app);
}

// -------- First level

'static'; function ReallyClearInterval(app) {
	var context = app.context;
	if (context.handle != null) {
		clearInterval(context.handle);
		context.handle = null;
	}
}

'static'; function IsWidescreen(canvas) {
	return canvas.width > canvas.height;
}

'static'; function RenderWidescreenSetup(app, canvas) {
	// Precompute header size to cache
	if (GLOBAL_FONT_SIZE_CACHE[ID('MainpageHeaderFontSize')] == null) {
		GLOBAL_FONT_SIZE_CACHE[ID('MainpageHeaderFontSize')] = GetOptimalFontSize(
			LABEL_FOO,
			canvas.width * 0.5,
			canvas.height * 0.5 * 0.25,
			1000
		);
	}
	
	var inputbar = canvas.add(0, 0, 0.5, 0.5);
	RenderInputBar(app, inputbar, 0.25);
	
	var displaybar = canvas.add(0.5, 0, 0.5, 0.5);
	RenderFunctionDisplay(app, displaybar);
	
	var animbar = canvas.add(0, 0.5, 1, 0.5);
	RenderAnimationDisplay(app, animbar);
}

'static'; function RenderPortraitscreenSetup(app, canvas) {
	// Precompute header size to cache
	if (GLOBAL_FONT_SIZE_CACHE[ID('MainpageHeaderFontSize')] == null) {
		GLOBAL_FONT_SIZE_CACHE[ID('MainpageHeaderFontSize')] = GetOptimalFontSize(
			LABEL_FOO,
			canvas.width * 0.5,
			canvas.height * 0.1,
			1000
		);
	}
	
	var inputbar = canvas.add(0, 0, 1, 0.2);
	RenderInputBar(app, inputbar, 0.5);
	
	var displaybar = canvas.add(0, 0.2, 1, 0.4);
	RenderFunctionDisplay(app, displaybar);
	
	var animbar = canvas.add(0, 0.6, 1, 0.4);
	RenderAnimationDisplay(app, animbar);
}

// --------- Second level
'static'; function SetHeaderLabel(header, label) {
	header.setText(label, false, GLOBAL_FONT_SIZE_CACHE[ID('MainpageHeaderFontSize')]);
}

'static'; function RenderInputBar(app, canvas, headerHeight) {
	var header = canvas.add(0, 0, 1, headerHeight);
	SetHeaderLabel(header, LABEL_INPUT);
	
	var inputwrap = canvas.add(0, headerHeight, 1, 1 - headerHeight);
	
	var offsetX = 20 / inputwrap.width;
	var offsetY = 20 / inputwrap.height;
	var input = inputwrap.add(offsetX, offsetY, 1 - 2 * offsetX, 1 - 2 * offsetY, 'input', ID('FooInput'));
	input.addEventCallback('keyup', function() {
		app.context.foobak = input.dom.value;
	});
	input.dom.type = 'text';
	input.dom.value = app.context.foobak;
}

'static'; function RenderFunctionDisplay(app, canvas) {
	var header = canvas.add(0, 0, 1, 0.25);
	SetHeaderLabel(header, LABEL_FOO);
	
	var displaywrap = canvas.add(0, 0.25, 1, 0.75);
	
	var offsetX = 20 / displaywrap.width;
	var offsetY = 20 / displaywrap.height;
	var display = displaywrap.add(offsetX, offsetY, 1 - 2 * offsetX, 1 - 2 * offsetY, 'canvas', ID('FooDisplay'));
}

'static'; function RenderAnimationDisplay(app, canvas) {
	var header = canvas.add(0, 0, 1, 0.25);
	SetHeaderLabel(header, LABEL_ANIM);
	
	var displaywrap = canvas.add(0, 0.25, 1, 0.75);
	
	var offsetX = 20 / displaywrap.width;
	var offsetY = 20 / displaywrap.height;
	var display = displaywrap.add(offsetX, offsetY, 1 - 2 * offsetX, 1 - 2 * offsetY, 'canvas', ID('AnimDisplay'));
}

// --------- Third level

'static'; function processFunction(app) {
	var context = app.context;
	
	// Test function for errors
	try {
		var x = 0;
		eval(context.foobak); 
	}
	catch (e) {
		alert(e.message);
		return;
	}
	
	// Copy backup to full function
	context.foo = context.foobak;
	
	ReallyClearInterval(app);
	
	// Compute array of points to draw
	var points = new Array(POINT_COUNT);
	var x; // used by easingFunction
	for (var i = 0; i < POINT_COUNT; i++) {
		x = i / POINT_COUNT;
		points[i] = eval(context.foo);
	}
	
	// Draw points into canvas
	var canvas = GetDOM(ID('FooDisplay'));
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = STROKE_WHITE;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	for (var i = 0; i < points.length - 1; i++) {
		ctx.moveTo(i * canvas.width / points.length, canvas.height - points[i] * canvas.height);
		ctx.lineTo((i + 1) * canvas.width / points.length, canvas.height - points[i + 1] * canvas.height);
		ctx.stroke();
	}
	ctx.closePath();
	
	// Setup animation
	context.time = 0;
	context.handle = setInterval(function() {
		animate(app);
	}, FRAME_TIME);
}

'static'; function animate(app) {
	var context = app.context;
	var canvas = GetDOM(ID('AnimDisplay'));
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = STROKE_WHITE;
	
	var x = context.time / (1000 / FRAME_TIME * ANIMATION_DURATION);
	var position = eval(context.foo) * canvas.width;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	
	ctx.arc(position, canvas.height / 2, canvas.height / 4, 0, 2 * Math.PI);
	ctx.stroke();
	
	ctx.closePath();
	
	context.time++;
	if (context.time == (1000 / FRAME_TIME * ANIMATION_DURATION)) context.time = 0;
}
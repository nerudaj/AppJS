'static'; function RenderMainPage() {
	var canvas = this.app.canvas;
	
	RenderHeaderTemplate(canvas, 'HTML5 APIs benchmark');
	
	var board = GetDrawingTemplate(canvas);
	RenderAPITests(this.app, board);
	
	var buttons = [
		//new ButtonTemplate('Nothing', function() {}),
		//new ButtonTemplate('Useless', function() {})
	];
	RenderToolbarTemplate(canvas, buttons, ID('toolbar_button_cache'));
}

'static'; function ClassTest(label, testcase) {
	this.label = label;
	this.test = testcase;
}

'static'; function RenderAPITests(app, canvas) {
	var tests = [
		new ClassTest('Geolocation API', function() {
			return navigator.geolocation;
		}),
		new ClassTest('Webstorage API', function() {
			return typeof(Storage) !== "undefined";
		}),
		new ClassTest('Server-side Events API', function() {
			return typeof(EventSource) !== "undefined";
		}),
		new ClassTest('Web Workers API', function() {
			return typeof(Worker) !== "undefined";
		})
	];
	
	var LABEL_WIDTH = 0.8;
	var RESULT_WIDTH = 0.2;
	var LABEL_HEIGHT = 1 / tests.length;
	
	for (var i = 0; i < tests.length; i++) {
		(function(p) {
			var label = canvas.add(0, i * LABEL_HEIGHT, LABEL_WIDTH, LABEL_HEIGHT);
			label.setText(tests[p].label, true);
			
			var result = canvas.add(LABEL_WIDTH, i * LABEL_HEIGHT, RESULT_WIDTH, LABEL_HEIGHT);
			result.setText(tests[p].test() ? 'Yes' : 'No', true);
		}(i));
	}
} 
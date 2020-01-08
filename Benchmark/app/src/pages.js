appx.AddPage(
	ID('PageMain'),
	'HTML5 APIs benchmark',
	RenderPageMain,
	null
);

'static'; function ClassTest(label, testcase) {
	this.label = label;
	this.test = testcase;
}

'static'; function RenderPageMain(canvas) {
	var tests = [
		new ClassTest('Geolocation API', () => navigator.geolocation ),
		new ClassTest('Webstorage API', () => typeof(Storage) !== 'undefined' ),
		new ClassTest('Server-side Events API', () => typeof(EventSource) !== 'undefined' ),
		new ClassTest('Web Workers API', () => typeof(Worker) !== 'undefined' )
	];

	var LABEL_WIDTH = 0.8;
	var LABEL_HEIGHT = 1 / 10;

	tests.forEach((test, index) => {
		var label = canvas.AddElem(0, index * LABEL_HEIGHT, LABEL_WIDTH, LABEL_HEIGHT);
		label.SetText(test.label);

		var result = canvas.AddElem(LABEL_WIDTH, index * LABEL_HEIGHT, 1 - LABEL_WIDTH, LABEL_HEIGHT);
		result.SetText(test.test() ? 'Yes' : 'No');
	});
}

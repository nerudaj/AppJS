'static'; LUNCH_CACHE = null;

'static'; function RenderMainPage() {
	var board = PageTemplate(appx.canvas, 'Obědy.. nejen u Adama', null, null);
	
	// Request lunch files
	if (LUNCH_CACHE == null) {
		asyncJsonRequest("php/menu.php?mode=read", (data) => { RenderLunches(board, data); });
	}
	else {
		RenderLunches(board, LUNCH_CACHE);
	}
}

'static'; function RenderLunches(canvas, data) {
	LUNCH_CACHE = data;

	// Compute number of rows needed to render whole thing
	var totalHeight = 0;
	data.forEach((rest) => {
		totalHeight += 1 + rest.food.length; // Name of restaurant + all food items
	});
	totalHeight += data.length - 1;          // Separators between each restaurant
	totalHeight = Math.max(totalHeight, 8);  // At least 8 rows are there always

	var board = canvas.add(0, 0, 1, Math.max(totalHeight / 8, 1));
	board.addClass('scrollable');

	// Go restaurant by restaurant and render them
	var baseRowHeight = 1 / totalHeight;
	var y = 0;

	data.forEach((restaurant) => {
		if (y > 0) y++; // Separator
		var name = board.add(0, y++ * baseRowHeight, 1, baseRowHeight);
		name.setText(restaurant.name);
		name.addClass('align_left');

		restaurant.food.forEach((food) => {
			var row = board.add(0, y++ * baseRowHeight, 1, baseRowHeight);
			row.setText(food);
			row.addClass('align_left');
		});
	});
}
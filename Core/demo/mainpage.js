'static'; function RenderMainPage() {
	CreatePage(
		'Header of the page',
		RenderMainPageContent,
		[
			new ButtonTemplate('Open modal', () => {
				CreateModal('Modal', 'Some text', 0.8, 0.8);
			}),
			new ButtonTemplate('Next Page', () => {
				appx.toggleView(ENUM('nextpage'));
			})
		],
		ID('PageMain')
	);
}

'static'; function RenderMainPageContent(canvas) {
	canvas.setText('Hello world');
}
'static'; function RenderNextPage() {
    CreatePage(
        'Next Page',
        RenderNextPageContent,
        [ new ButtonTemplate('Back', () => { appx.toggleView(ENUM('mainpage')); }) ],
        ID('PageNext'),
    );
}

'static'; function RenderNextPageContent(canvas) {
    var section = canvas.add(0.1, 0.1, 0.8, 0.8);
    section.setColor('red');

    var fontSize = ReadFontSizeCache(section, 'Next page', ID('NextPageText'));
    section.setText('Custom section', fontSize);
}
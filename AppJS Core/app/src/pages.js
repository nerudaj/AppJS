/* MAIN PAGE */
appx.AddPage(
    ID('PageMain'),
    'Header of the page',
    RenderMainPageContent,
    [
        new AppJsButton('Open modal', () => {
            appx.OpenModal(
                'Modal', 
                c => {
                    var fontSize = ReadFontSizeCache(0, 0, ID('AppJsModal'));
                    c.SetText('Some text', fontSize);
                }, 
                0.8, 0.8);
        }),
        new AppJsButton('Next Page', () => {
            appx.DisplayPage(ID('PageNext'));
        })
    ]
);

'static'; function RenderMainPageContent(canvas) {
    canvas.SetText('Hello world');
}

/* ANOTHER PAGE */
appx.AddPage(
    ID('PageNext'),
    'Next Page',
    RenderNextPageContent,
    [ new AppJsButton('Back', () => { appx.DisplayPage(ID('PageMain')); }) ]
);

'static'; function RenderNextPageContent(canvas) {
    var section = canvas.AddElem(0.1, 0.1, 0.8, 0.8);
    section.SetColor('red');

    var fontSize = ReadFontSizeCache(section, 'Custom section', ID('NextPageText'));
    section.SetText('Custom section', fontSize);
}
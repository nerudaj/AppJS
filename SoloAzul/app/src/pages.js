/* MAIN PAGE */
appx.AddPage(
    ID('PageMain'),
    'Main Page',
    RenderMainPageContent,
    [
        new AppJsButton('Play game', () => {
            PrepareGame();
            appx.DisplayPage(ID('PageGame'));
        })
    ]
);

'static'; function RenderMainPageContent(canvas) {
    canvas.SetText('Hello world');
}

/* ANOTHER PAGE */
appx.AddPage(
    ID('PageGame'),
    'Moves left: <span id="MovesLeft">X</span>',
    RenderGamePageContent,
    [ new AppJsButton('Back', () => { appx.DisplayPage(ID('PageMain')); }) ]
);

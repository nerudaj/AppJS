'static'; function IsWidescreen() {
    return appx.canvas.width > appx.canvas.height;
}

'static'; function PrepareGame() {
    appx.context.game = {
        field: []
    };
    appx.context.marked = -1;
    appx.context.movesLeft = 10;

    for (let i = 0; i < 16; i++) {
        appx.context.game.field.push({
            id: i,
            color: i / 4,
            shape: i % 4
        });
    }
}

'static'; function RenderGamePageContent(canvas) {
    let fieldDimAbs = (IsWidescreen() ? canvas.height : canvas.width) * 0.8;
    let xOffset = (canvas.width - fieldDimAbs) / (2 * canvas.width);
    let yOffset = (canvas.height - fieldDimAbs) / (2 * canvas.height);
    let fieldCanvas = canvas.AddElem(xOffset, yOffset, fieldDimAbs / canvas.width, fieldDimAbs / canvas.height);

    RenderGameField(fieldCanvas, appx.context.game);

    $('MovesLeft').innerHTML = appx.context.movesLeft;
}

'static'; function RenderGameField(canvas, game) {
    const IMGS = [ 'g1', 'g2', 'g3', 'g4', 'r1', 'r2', 'r3', 'r4', 'b1', 'b2', 'b3', 'b4', 'c1', 'c2', 'c3', 'c4' ];
    let QUARTER = 1/4;

    for (let y = 0, i = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++, i++) {
            let img = canvas.AddElem(x * QUARTER, y * QUARTER, QUARTER, QUARTER, 'img');
            img.dom.src = 'resources/' + IMGS[game.field[i].id] + ".png";

            img.OnClick(() => {
                let i = y * 4 + x;
                console.log("onclick: " + i);
                if (appx.context.marked == -1) {
                    console.log(i + " not marked");
                    img.AddClass('marked');
                    appx.context.marked = i;
                }
                else if (appx.context.marked == i) {
                    console.log("unmarking " + i);
                    img.dom.className = "";
                    appx.context.marked = -1;
                }
                else {
                    SwapTiles(appx.context.marked, i);
                    console.log("swapping " + i + " and " + appx.context.marked);
                    appx.context.marked = -1;
                    appx.RefreshPage();
                }
            });
        }
    }
}

'static'; function SwapTiles(index1, index2) {
    /* TODO: this */
}
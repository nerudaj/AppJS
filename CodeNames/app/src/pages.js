function AjaxCallback(data) {
	if (data.status == "error") {
		alert(data.payload);
		return;
	}

	appx.context.game.marked = data.payload;
	appx.DisplayPage(ID('PageGame'));
	appx.context.fetchHandle = setTimeout(() => { GetFieldViaAjax() }, 3000);
}

/* MAIN PAGE */
appx.AddPage(
	ID('PageMain'),
	'Krycí jména',
	RenderMainPageContent,
	[
		new AppJsButton('Hrajem!', () => {
			ClearFontSizeCache(); // To prevent bugs related to word rendering
			appx.context.gameId = $(ID('InputSeed')).value;
			appx.context.game = GenerateGame();

			if (appx.context.online) {
				SetAjaxResponseCallback(AjaxCallback);
				appx.context.fetchHandle = setTimeout(() => { GetFieldViaAjax() }, 3000);
			}

			appx.DisplayPage(ID('PageGame'));
		}),
		new AppJsButton('Nastavení', () => {
			appx.DisplayPage(ID('PageSettings'));
		})
	]
);

appx.AddPage(
	ID('PageSettings'),
	"Nastavení",
	RenderPageSettingsContent,
	[
		new AppJsButton('Zpět', () => {
			appx.DisplayPage(ID('PageMain'));
		})
	]
);

appx.AddPage(
	ID('PageGame'),
	'<span id="WhoStarts">XXX</span>',
	RenderPageKeyContent,
	[
		new AppJsButton('Zpět', () => {
			appx.DisplayPage(ID('PageMain'));

			if (appx.context.online) {
				clearTimeout(appx.context.fetchHandle);
			}
		})
	]
);
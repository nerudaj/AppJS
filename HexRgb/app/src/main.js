'static'; var appx = new AppJs(); // This variable has to be global in order to register pages

var mode = 255;

// Bootstrap app
function Main() {
    appx.Bootstrap('Canvas');

    // Setup app context
    appx.context.hex = 'FADB0C';
	appx.context.rgb = [250, 219, 12];
	appx.context.k = x => x * mode / 255;
	appx.context.k_inv = x => x * 255 / mode;

    // Toggle default page
    appx.DisplayPage(ID('PageMain'));
}
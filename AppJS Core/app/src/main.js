'static'; var appx = new AppJs(); // This variable has to be global in order to register pages

// Bootstrap app
function Main() {
    appx.Bootstrap('Canvas');

    // Setup app context
    // app.context['key'] = value;

    // Toggle default page
    appx.DisplayPage(ID('PageMain'));
}
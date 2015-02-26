App = window.App || new Extension.Application();

$(function() {
    $.ajaxSetup({timeout:2000});

    // after booting the application
    App.on("start", function() {
        // initialize data
        App.setParameter('api_base_url', 'http://192.168.0.148');

        // render main view
        App.layout = new App.Views.Layout({
            el: $(".backbone-container:first")
        });

        App.layout.render();
    });

    // boot application
    App.start();
});
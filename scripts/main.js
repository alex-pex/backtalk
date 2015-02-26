App = window.App || new Extension.Application();

$(function() {
    // after booting the application
    App.on("before:start", function() {
        // initialize data
        App.setParameter('api_base_url', 'http://api-marionette.local/api');
    });

    App.on("start", function() {
        // render main view
        App.layout = new App.Views.Layout({
            el: $(".backbone-container:first")
        });

        App.layout.render();
    });

    $.ajax({
        url: 'build/templates.html',
        dataType: 'text'
    }).done(function(templates) {
        $(document.body).append(templates);
    
        $.ajaxSetup({
            timeout: 2000,
            headers: { 'X-Requested-With' : 'XMLHttpRequest' }
        });

        // boot application
        App.start();
    });
});
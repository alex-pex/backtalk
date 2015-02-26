App = window.App || new Extension.Application();

$(function() {
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

    $.ajax({
        url: 'build/templates.html',
        dataType: 'text'
    }).done(function(templates) {
        console.log(templates);

        $(document.body).append(templates);
    
        $.ajaxSetup({timeout:2000});

        // boot application
        App.start();
    });
});
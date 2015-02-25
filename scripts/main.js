// @koala-prepend "marionette-bundled.js"
// @koala-prepend "../packages/stadline/js-extension-bundle/Resources/public/backbone/extensions/application.js"
// @koala-prepend "../packages/stadline/js-extension-bundle/Resources/public/backbone/extensions/layoutview.js"
// @koala-prepend "../packages/stadline/js-extension-bundle/Resources/public/backbone/extensions/relationalmodel.js"
// @koala-prepend "../packages/stadline/js-extension-bundle/Resources/public/backbone/extensions/subcollection.js"
// @koala-prepend "models/question.js"
// @koala-prepend "collections/questions.js"
// @koala-prepend "views/chat-room.js"
// @koala-prepend "views/layout.js"
// @koala-prepend "views/message-form.js"

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
App = window.App || new Extension.Application();

App.module('Collections', function(module) {
    /**
     * Global limit collection
     */
    module.Messages = Backbone.Collection.extend({
        model: App.Models.Message,
        url: App.getParameter('api_base_url')+'/messages'
    });

    App.on("before:start", function() {
        App.messages = new App.Collections.Messages();
    });

    App.on("stop", function() {
        App.messages.reset();
    });
});
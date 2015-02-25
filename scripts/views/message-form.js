App = window.App || new Extension.Application();

App.module('Views', function(module) {
    module.MessageForm = Marionette.ItemView.extend({
        template: "#message-form-template",
        serializeData: function() {
            return {
                message: this.model
            };
        }
    });
});
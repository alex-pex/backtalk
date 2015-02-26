App = window.App || new Extension.Application();

App.module('Views', function(module) {
    module.MessageForm = Marionette.ItemView.extend({
        template: "#message-form-template",
        serializeData: function() {
            return {
                message: this.model
            };
        },

        events: {
            "submit form": "onFormSubmit"
        },

        onFormSubmit: function(event) {
            event.preventDefault();

            var values = this.$('form').serializeObject();
            var message = new App.Models.Message(values.message);
            App.messages.add(message);
            message.save();

            this.render();
        }
    });
});
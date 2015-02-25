App = window.App || new Extension.Application();

App.module('Views', function(module) {
    module.ChatRoom = Marionette.ItemView.extend({
        template: "#chat-room-template",
        serializeData: function() {
            return {
                messages: this.collection
            };
        }
    });
});
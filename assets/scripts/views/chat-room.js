App = window.App || new Extension.Application();

App.module('Views', function(module) {

    module.ChatRoomMessage = Marionette.ItemView.extend({
        template: "#chat-room-message-template",
        serializeData: function() {
            return {
                message: this.model
            };
        },

        modelEvents: {
            'change:text': 'render'
        },

        tagName: 'li'
    });

    module.ChatRoom = Marionette.CompositeView.extend({
        template: "#chat-room-template",
        serializeData: function() {
            return {
                messages: this.collection
            };
        },

        childView: module.ChatRoomMessage,
        childViewContainer: 'ul'
    });
});
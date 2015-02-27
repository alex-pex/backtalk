var Marionette = require('backbone.marionette');

var ChatRoomMessage = Marionette.ItemView.extend({
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

var ChatRoom = Marionette.CompositeView.extend({
    template: "#chat-room-template",
    serializeData: function() {
        return {
            messages: this.collection
        };
    },

    childView: ChatRoomMessage,
    childViewContainer: 'ul'
});

module.exports = ChatRoom;
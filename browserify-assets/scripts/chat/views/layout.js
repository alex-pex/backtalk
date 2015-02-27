var Marionette = require('backbone.marionette');
var ChatRoomView = require('./chat-room');
var MessageForm = require('./message-form');
var Message = require('../../entities/models/message');
var API = require('../../app');

module.exports = Marionette.LayoutView.extend({
    template: "#layout-template",

    regions: {
        chatRoom: "#chat-room-region",
        messageForm: "#message-form-region"
    },

    onRender: function() {
        this.chatRoom.show(new ChatRoomView({
            collection: API.request('message:entities')
        }));

        this.messageForm.show(new MessageForm({
            model: new Message()
        }));
    }
});
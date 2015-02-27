var Marionette = require('backbone.marionette');

//var ChatRoomView = require('./views/chat-room');

var Layout = Marionette.LayoutView.extend({
    template: "#layout-template",

    regions: {
        chatRoom: "#chat-room-region",
        messageForm: "#message-form-region"
    },

    onRender: function() {
        /*this.chatRoom.show(ChatRoomView({
            collection: App.messages
        }));

        /*
        this.messageForm.show(new App.Views.MessageForm({
            model: new App.Models.Message()
        }));*/
    }
});

module.exports = Layout;
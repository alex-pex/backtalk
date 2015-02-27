App = window.App || new Extension.Application();

App.module('Views', function(module) {
    module.Layout = Extension.LayoutView.extend({
        template: "#layout-template",

        events: {
            "click a[href]": "preventHashChange"
        },

        regions: {
            chatRoom: "#chat-room-region",
            messageForm: "#message-form-region"
        },

        onRender: function() {
            this.chatRoom.show(new App.Views.ChatRoom({
                collection: App.messages
            }));

            this.messageForm.show(new App.Views.MessageForm({
                model: new App.Models.Message()
            }));
        }
    });
});
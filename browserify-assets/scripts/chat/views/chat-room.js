var Marionette = require('backbone.marionette');

var ChildView = Marionette.ItemView.extend({
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

module.exports = Marionette.CompositeView.extend({
    template: "#chat-room-template",
    serializeData: function() {
        return {
            messages: this.collection
        };
    },

    childView: ChildView,
    childViewContainer: 'ul'
});
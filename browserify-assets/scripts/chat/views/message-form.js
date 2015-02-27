var Marionette = require('backbone.marionette');
var API = require('../../app');
var Message = require('../../entities/models/message');

module.exports = Marionette.ItemView.extend({
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
        var message = new Message(values.message);

        message.set('created_at', new Date());
        API.request('message:entities').add(message);
        message.save();

        this.render();
    }
});
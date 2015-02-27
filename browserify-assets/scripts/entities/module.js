var Marionette = require('backbone.marionette');
var Messages = require('./models/messages');

module.exports = Marionette.Module.extend({
    onStart: function() {
        var API = this.app.reqres;
        var storage = {};
        
        API.setHandler('message:entities', function() {
            if (!storage.hasOwnProperty('messages')) {
                storage.messages = new Messages();
                storage.messages.fetch();
            }
            return storage.messages;
        });
    }
});
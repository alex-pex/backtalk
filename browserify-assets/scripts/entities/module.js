var Marionette = require('backbone.marionette');
var Messages = require('./models/messages');

module.exports = Marionette.Module.extend({
    onStart: function() {
        var API = this.app.reqres;
        var messages = new Messages();
        
        API.setHandler('message:entities', function() {
            return messages;
        });
    }
});
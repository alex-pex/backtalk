var Backbone = require('backbone');
var Message = require('./message');
var App = require('../../app');

module.exports = Backbone.Collection.extend({
    model: Message,
    url: function() {
        return App.parameters.get('api_base_url')+'/messages.json';
    }
});
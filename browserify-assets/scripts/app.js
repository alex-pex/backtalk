var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

module.exports = new Marionette.Application({
    parameters: new Backbone.Model()
});
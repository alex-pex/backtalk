// vendors requirements
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

// modules requirements
var ChatModule = require('./chat/module');

// App bootstrap
var App = new Marionette.Application();

$.ajax({
    url: 'dist/templates.html',
    dataType: 'text'
}).done(function(templates) {
    $(document.body).append(templates);

    $.ajaxSetup({
        timeout: 2000,
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    });

    // boot application
    App.module('chat', ChatModule);
    App.start();
});

module.exports = App;
// vendor requirements
var $ = require('jquery');
require('../../packages/stadline/js-extension-bundle/Resources/public/js/jquery.serialize-object');
var Backbone = require('backbone');
Backbone.$ = $;

// application requirements
var App = require('./app');
var EntitiesModule = require('./entities/module');
var ChatModule = require('./chat/module');

console.log('App', App);

$.ajax({
    url: 'dist/templates.html',
    dataType: 'text'
}).done(function(templates) {
    $(document.body).append(templates);

    $.ajaxSetup({
        timeout: 2000,
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    });

    // set parameters
    App.parameters.set({
        api_base_url: 'http://api-marionette.local:8080/api'
    });

    // boot application
    App.module('entities', EntitiesModule);
    App.module('chat', ChatModule);
    App.start();
});

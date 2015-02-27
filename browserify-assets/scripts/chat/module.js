var Marionette = require('backbone.marionette');
var LayoutView = require('./views/layout');

var ChatModule = Marionette.Module.extend({
    onStart: function() {
        this.app.layout = new LayoutView({
            el: $(".backbone-container:first")
        });

        this.app.layout.render();
    }
});

module.exports = ChatModule;
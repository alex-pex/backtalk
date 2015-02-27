App = window.App || new Extension.Application();

App.module('Models', function(module) {
    module.Message = Extension.RelationalModel.extend({
        // nothing yet
    });
});
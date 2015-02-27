Extension = window.Extension || {};

Extension.Application = Marionette.Application.extend({
    initialize: function() {
        var App = this;

        Marionette.Behaviors.behaviorsLookup = function() {
            return App.Behaviors;
        };

        App.parameters = new Backbone.Model();

        App.on("stop", function() {
            App.parameters.clear();
        });
    },

    setParameter: function(key, value) {
        this.parameters.set(key, value);
    },

    getParameter: function(key) {
        return this.parameters.get(key);
    }
});
Extension = window.Extension || {};

Extension.LayoutView = Marionette.LayoutView.extend({
    /**
     * Removed default action on hash links
     * in order not to trigger router methods
     */
    preventHashChange: function(event) {
        var $target = $(event.currentTarget);

        if (_.string.startsWith($target.attr('href'), '#')) {
            event.preventDefault();
        }
    },

    /**
     * Open a view in a modal
     *
     * Attach a view to modal region
     * and trigger modal initialization
     */
    openModal: function(modalView, options) {
        var self = this;

        this.modal.show(modalView);

        $.magnificPopup.open(_.defaults({}, options, {
            items: {
                src: this.modal.$el,
                type: 'inline'
            },
            /*modal: true,*/
            midClick: true,
            callbacks: {
                open: function() {
                    self.modal.$el.on("click", ".mfp-close, .mfp-inline-close", function() {
                        App.layout.closeModal();
                    });

                    self.modal.$el.on("click", "a[href]", function(event) {
                        self.preventHashChange(event);
                    });
                },
                close: function() {
                    modalView.destroy();
                }
            }
        }));
    },

    /**
     * Close current modal
     *
     * A modal view class can be passed to prevent closing the wrong modal
     */
    closeModal: function(modalViewClass) {
        if (!modalViewClass || this.modal.currentView instanceof modalViewClass) {
            $.magnificPopup.close();
        }
    }
});
Extension = window.Extension || {};

/**
 * Relational model extension
 */
Extension.RelationalModel = Backbone.Model.extend({
    set: function() {
        Backbone.Model.prototype.set.apply(this, arguments);

        if (_.isUndefined(this._initialAttributes)) {
            this._initialAttributes = _(this.attributes).clone();
        }

        return this;
    },

    /**
     * To be used in parse process
     * > add model response to collection
     * > and return related model
     */
    addReference: function(collection, givenModel, additionalValues, callback) {
        var model = _(givenModel).extend(additionalValues);

        var addedModels = collection.add([model], {merge: true, parse: true});

        if (_.isFunction(callback)) {
            var self = this;

            _(addedModels).each(function(addedModel) {
                callback.call(self, addedModel);
            });
        }

        return addedModels[0];
    },

    /**
     * To be used in parse process
     * > add model responses to collection
     * > and return an array of related models
     */
    addReferences: function(collection, givenModels, additionalValues, callback) {
        var models = _(givenModels).map(function(model) {
            return _(model).extend(additionalValues);
        });

        var addedModels = collection.add(models, {merge: true, parse: true});

        if (_.isFunction(callback)) {
            var self = this;

            _(addedModels).each(function(addedModel) {
                callback.call(self, addedModel);
            });
        }

        return new Backbone.Collection(addedModels);
    },

    /**
     * Serialize model
     * > used in saving process
     */
    toJSON: function(options) {
        // serialize helper, which flatten related models to ids
        var serialize = function(value) {
            if (value instanceof Backbone.Collection) {
                return value.chain().map(serialize).reject(_.isUndefined).value();
            } else if (_.isObject(value) && value.cid) {
                return value.id;
            } else {
                return value;
            }
        };

        var attributes = {};

        _(this.attributes).each(function(value, key) {
            attributes[key] = serialize(value);
        });

        return attributes;
    },

    /**
     * Nested save process
     * > save related models before current model
     *
     * @returns {Deferred}
     */
    save: function(key, val, options) {
        var self = this;

        options = options || {
            models: []
        };

        // remember object tree to avoid infinite recursion
        if (_(options['models']).contains(this)) {
            return $.Deferred().resolve();
        } else {
            options['models'].push(this);
        }

        // get related models
        var relatedModels = [];
        _(this.attributes).each(function(attribute) {
            if (attribute instanceof Backbone.Model) {
                relatedModels.push(attribute);
            } else if (attribute instanceof Backbone.Collection) {
                relatedModels = relatedModels.concat(attribute.models);
            }
        });

        // check models to sync
        var modelsToSync = _(relatedModels).filter(function(model) {
            return model.hasUrl() && model.isSyncable();
        });

        // if there is no model to sync, use regular save method
        if (modelsToSync.length < 1) {
            return this._save(key, val, options);
        }

        // reject save if a related model is invalid
        if (!_(modelsToSync).every(function(model) {
            return model.isValid();
        })) {
            return false;
        }

        // prepare deferred save
        var deferredSave = $.Deferred();

        // sync related models first
        _(modelsToSync).each(function(model, i) {
            model.save(null, null, options).done(function() {
                modelsToSync.pop();

                // if we have synced all related model, save parent
                if (modelsToSync.length < 1) {
                    self._save(key, val, options).done(function() {
                        // then resolve the promise
                        deferredSave.resolve();
                    });
                }
            });
        });

        return deferredSave;
    },

    _save: function() {
        var self = this;
        var xhr = Backbone.Model.prototype.save.apply(this, arguments).done(function() {
            self._initialAttributes = _(self.attributes).clone();
        });
        return xhr;
    },
    
    /**
     * Test if model has changed this initialization
     * 
     * @returns {Boolean}
     */
    isVanilla: function() {
        return _(this._initialAttributes).isEqual(this.attributes);
    },

    /**
     * Test if model has data to be synced
     *
     * @returns {Boolean}
     */
    isSyncable: function() {
        return this.isNew() || !this.isVanilla();
    },

    /**
     * Test if model has a valid url
     *
     * @returns {Boolean}
     */
    hasUrl: function() {
        var baseUrl =
            _.result(this, 'urlRoot') ||
            _.result(this.collection, 'url');

        return !!baseUrl;
    }
});
Extension = window.Extension || {};

/**
 * Sub-collection extension
 * A sub collection sync with a parent collection
 *
 * Eg:
 * - subcollection:    activeUsers
 * - parentcollection: allUsers
 *
 * Add and remove in subcollection are synced with the parent collection, but add and remove in parent collection
 * are not synced the subcollections because we don't know how they are related.
 *
 * Model changes are sync with all collections because model are object references.
 */
Extension.SubCollection = Backbone.Collection.extend({
    constructor: function(models, options) {
        options || (options = {});

        // parent option should be set on initialization
        if (options.parent) {
            this.parent = options.parent;
            this.model = this.parent.model;
            this.comparator = this.parent.comparator;

            this.on("add", function(model, collection, options) {
                this.parent.add(model, options);
            });
            this.on("remove", function(model, collection, options) {
                this.parent.remove(model, options);
            });
            this.on("reset", function(collection, options) {
                this.parent.reset(options);
            });
            this.on("change", function(model, changes) {
                this.parent.get(model).set(model.toJSON());
            });
        }

        Backbone.Collection.apply(this, arguments);
    }
});
App = window.App || new Extension.Application();

App.module('Models', function(module) {
    module.Message = Extension.RelationalModel.extend({
        // nothing yet
    });
});
App = window.App || new Extension.Application();

App.module('Collections', function(module) {
    /**
     * Global limit collection
     */
    module.Messages = Backbone.Collection.extend({
        model: App.Models.Message,
        url: function() {
            return App.getParameter('api_base_url')+'/messages.json';
        }
    });

    App.on("before:start", function() {
        App.messages = new App.Collections.Messages();
    });

    App.on("start", function() {
        App.messages.fetch();
    });

    App.on("stop", function() {
        App.messages.reset();
    });
});
App = window.App || new Extension.Application();

App.module('Views', function(module) {

    module.ChatRoomMessage = Marionette.ItemView.extend({
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

    module.ChatRoom = Marionette.CompositeView.extend({
        template: "#chat-room-template",
        serializeData: function() {
            return {
                messages: this.collection
            };
        },

        childView: module.ChatRoomMessage,
        childViewContainer: 'ul'
    });
});
App = window.App || new Extension.Application();

App.module('Views', function(module) {
    module.Layout = Extension.LayoutView.extend({
        template: "#layout-template",

        events: {
            "click a[href]": "preventHashChange"
        },

        regions: {
            chatRoom: "#chat-room-region",
            messageForm: "#message-form-region"
        },

        onRender: function() {
            this.chatRoom.show(new App.Views.ChatRoom({
                collection: App.messages
            }));

            this.messageForm.show(new App.Views.MessageForm({
                model: new App.Models.Message()
            }));
        }
    });
});
App = window.App || new Extension.Application();

App.module('Views', function(module) {
    module.MessageForm = Marionette.ItemView.extend({
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
            var message = new App.Models.Message(values.message);

            message.set('created_at', new Date());
            App.messages.add(message);
            message.save();

            this.render();
        }
    });
});
App = window.App || new Extension.Application();

$(function() {
    // after booting the application
    App.on("before:start", function() {
        // initialize data
        App.setParameter('api_base_url', 'http://api-marionette.local/api');
    });

    App.on("start", function() {
        // render main view
        App.layout = new App.Views.Layout({
            el: $(".backbone-container:first")
        });

        App.layout.render();
    });

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
        App.start();
    });
});
//# sourceMappingURL=main.js.map
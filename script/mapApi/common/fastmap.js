/*
 Fastmap, a JavaScript library for the Navinfo corporations's fastmap platform and public apis.
 (c) 2016-2026, Navinfo Corporation
 (c) 2016.4.21 by chenxiao
*/
(function(window, document, undefined) {
    var oldFM = window.FM,
        FM = {};
    FM.version = '1.0.0';
    // define fastmap for Node module pattern loaders, including Browserify
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = FM;
        // define fastmap as an AMD module
    } else if (typeof define === 'function' && define.amd) {
        define(FM);
    }
    // define fastmap as a global FM variable, saving the original FM to restore later if needed
    FM.noConflict = function() {
        window.FM = oldFM;
        return this;
    };
    window.FM = FM;
    window.fastmap = FM; // 兼容道路里的fastmap
    /*
     * FM.Util contains various utility functions used throughout fastmap code.
     */
    FM.Util = {
        extend: function(dest) { // (Object[, Object, ...]) ->
            var sources = Array.prototype.slice.call(arguments, 1),
                i, j, len, src;
            for (j = 0, len = sources.length; j < len; j++) {
                src = sources[j] || {};
                for (i in src) {
                    if (src.hasOwnProperty(i)) {
                        dest[i] = src[i];
                    }
                }
            }
            return dest;
        },
        bind: function(fn, obj) { // (Function, Object) -> Function
            var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
            return function() {
                return fn.apply(obj, args || arguments);
            };
        },
        setOptions: function(obj, options) {
            obj.options = FM.Util.extend({}, obj.options, options);
            return obj.options;
        }
    };
    // shortcuts for most used utility functions
    FM.extend = FM.Util.extend;
    FM.bind = FM.Util.bind;
    FM.setOptions = FM.Util.setOptions;
    /*
     * FM.Class powers the OOP facilities of the library.
     */
    FM.Class = function() {};
    FM.Class.extend = function(props) {
        // extended class with the new prototype
        var FMClass = function() {
            // call the constructor
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
            // call all constructor hooks
            if (this._initHooks) {
                this.callInitHooks();
            }
        };
        // instantiate class without calling constructor
        var F = function() {};
        F.prototype = this.prototype;
        var proto = new F();
        proto.constructor = FMClass;
        FMClass.prototype = proto;
        //inherit parent's statics
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'prototype') {
                FMClass[i] = this[i];
            }
        }
        // mix static properties into the class
        if (props.statics) {
            FM.extend(FMClass, props.statics);
            delete props.statics;
        }
        // mix includes into the prototype
        if (props.includes) {
            FM.extend.apply(null, [proto].concat(props.includes));
            delete props.includes;
        }
        // merge options
        if (props.options && proto.options) {
            props.options = FM.extend({}, proto.options, props.options);
        }
        // mix given properties into the prototype
        FM.extend(proto, props);
        proto._initHooks = [];
        var parent = this;
        // jshint camelcase: false
        FMClass.__super__ = parent.prototype;
        // add method for calling all hooks
        proto.callInitHooks = function() {
            if (this._initHooksCalled) {
                return;
            }
            if (parent.prototype.callInitHooks) {
                parent.prototype.callInitHooks.call(this);
            }
            this._initHooksCalled = true;
            for (var i = 0, len = proto._initHooks.length; i < len; i++) {
                proto._initHooks[i].call(this);
            }
        };
        return FMClass;
    };
    // method for adding properties to prototype
    FM.Class.include = function(props) {
        FM.extend(this.prototype, props);
    };
    // merge new default options to the Class
    FM.Class.mergeOptions = function(options) {
        FM.extend(this.prototype.options, options);
    };
    // add a constructor hook
    FM.Class.addInitHook = function(fn) { // (Function) || (String, args...)
        var args = Array.prototype.slice.call(arguments, 1);
        var init = typeof fn === 'function' ? fn : function() {
            this[fn].apply(this, args);
        };
        this.prototype._initHooks = this.prototype._initHooks || [];
        this.prototype._initHooks.push(init);
    };
    FM.dataApi = {};
    FM.mapApi = {
        symbol: {},
    };
    FM.uikit = {};
}(window, document))
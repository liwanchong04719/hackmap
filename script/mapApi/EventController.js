/**
 * Created by zhongxiaoming on 2016/3/17.
 * Class EventController
 */

fastmap.mapApi.EventController = (function () {
    var instantiated;
    var eventsKey = '_leaflet_events';
    function init(options) {
        var eventController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: [L.Mixin.Events, {
                addEventListener: function (types, fn, context) {
 // (String, Function[, Object]) or (Object[, Object])

                    // types can be a map of types/handlers
                    if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

                    var events = this._leaflet_events = this._leaflet_events || {},
                        contextId = context && context !== this && L.stamp(context),
                        i,
                        len,
                        event,
                        type,
                        indexKey,
                        indexLenKey,
                        typeIndex;

                    // types can be a string of space-separated words
                    types = L.Util.splitWords(types);

                    for (i = 0, len = types.length; i < len; i++) {
                        event = {
                            action: fn,
                            context: context || this
                        };
                        type = types[i];

                        if (contextId) {
                            // store listeners of a particular context in a separate hash (if it has an id)
                            // gives a major performance boost when removing thousands of map layers

                            indexKey = type + '_idx';
                            indexLenKey = indexKey + '_len';

                            typeIndex = events[indexKey] = events[indexKey] || {};

                            if (!typeIndex[contextId]) {
                                typeIndex[contextId] = [];

                                // keep track of the number of keys in the index to quickly check if it's empty
                                events[indexLenKey] = (events[indexLenKey] || 0) + 1;
                            }

                            typeIndex[contextId].push(event);
                        } else {
                            events[type] = events[type] || [];
                            events[type].push(event);
                        }


                        if (!this.eventTypesMap[type]) {
                            this.eventTypesMap[type] = [];
                        }
                        this.eventTypesMap[type].push(fn);
                    }

                    return this;
                },
                removeEventListener: function (types, fn, context) {
 // ([String, Function, Object]) or (Object[, Object])

                    if (!this[eventsKey]) {
                        return this;
                    }

                    if (!types) {
                        return this.clearAllEventListeners();
                    }

                    if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }

                    var events = this[eventsKey],
                        contextId = context && context !== this && L.stamp(context),
                        i,
                        len,
                        type,
                        listeners,
                        j,
                        indexKey,
                        indexLenKey,
                        typeIndex,
                        removed;

                    types = L.Util.splitWords(types);

                    for (i = 0, len = types.length; i < len; i++) {
                        type = types[i];
                        indexKey = type + '_idx';
                        indexLenKey = indexKey + '_len';

                        typeIndex = events[indexKey];

                        if (!fn) {
                            // clear all listeners for a type if function isn't specified
                            delete events[type];
                            delete events[indexKey];
                            delete events[indexLenKey];
                            if (this.eventTypesMap[type]) {
                                delete this.eventTypesMap[type];
                            }
                        } else {
                            listeners = contextId && typeIndex ? typeIndex[contextId] : events[type];

                            if (listeners) {
                                for (j = listeners.length - 1; j >= 0; j--) {
                                    if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
                                        removed = listeners.splice(j, 1);
                                        // set the old action to a no-op, because it is possible
                                        // that the listener is being iterated over as part of a dispatch
                                        removed[0].action = L.Util.falseFn;
                                    }
                                }

                                if (context && typeIndex && (listeners.length === 0)) {
                                    delete typeIndex[contextId];
                                    events[indexLenKey]--;
                                }
                            }
                            if (this.eventTypesMap[type]) {
                                for (var i = 0, len = this.eventTypesMap[type].length; i < len; i++) {
                                    if (this.eventTypesMap[type][i] === fn) {
                                        this.eventTypesMap[type].splice(j, 1);
                                    }
                                }
                            }
                        }
                    }

                    return this;
                },
                clearAllEventListeners: function () {
                    // delete this[eventsKey];
                    this.eventTypesMap = {};
                    return this;
                }
            }],


            options: {
            },

            /** *
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.eventTypes = L.Mixin.EventTypes;
                this.on = this.addEventListener;
                this.off = this.removeEventListener;
                this.eventTypesMap = {};
            }


        });
        return new eventController(options);
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    };
}());


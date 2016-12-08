
FM.Util = FM.Util || {};
FM.Util.extend(FM.Util, {
    trim: function(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
    split: function(str, sep) {
        return FM.Util.trim(str).split(sep || /\s+/);
    },
    isObject: Object.isObject || function(obj) {
        return (Object.prototype.toString.call(obj) === '[object Object]');
    },
    isArray: Array.isArray || function(obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    },
    clone: function(obj) {
        // var ret = obj;
        // if (obj[key] && typeof obj[key] == 'object') {
        console.log(typeof obj);
            var ret = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] && typeof obj[key] == 'object') {
                        if (this.isArray(obj[key])) {
                            ret[key] = [];
                            for (var i = 0, n = obj[key].length; i < n; i++) {
                                if (obj[key][i] && typeof obj[key][i] == "object") {
                                    ret[key].push(this.clone(obj[key][i]));
                                } else {
                                    ret[key].push(obj[key][i]);
                                }
                            }
                        } else {
                            ret[key] = this.clone(obj[key]);
                        }
                    } else {
                        ret[key] = obj[key];
                    }
                }
            }
        // }
        return ret;
    },
    isEmptyObject: function(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }
});
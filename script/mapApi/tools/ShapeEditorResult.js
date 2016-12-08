/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class ShapeEditorResult
 */

fastmap.mapApi.ShapeEditorResult = L.Class.extend({
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.originalObject = null;
        this.final=null;
        this.original=null;
        this.properties = null;
    },
    /***
     * 当前编辑几何对象属性信息
     * @param obj
     */
    setProperties:function(obj){
        this.properties = obj;
    },
    getProperties:function(){
        return this.properties;
    },
    setOriginalObject: function (value) {
        this.originalObject = value;
    },

    getOriginalObject: function () {
        return this.originalObject;
    },

    setOriginalGeometry: function (value) {
        this.original = value;
    },

    getOriginalGeometry: function () {
        return this.original;
    },

    setFinalGeometry: function (value) {
        this.final = value;
    },

    getFinalGeometry: function () {
        return this.final;
    }

})

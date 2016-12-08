/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathSmooth
 */
fastmap.mapApi.PathSmooth = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
    },


    onMouseDown: function () {
    },

    onMouseMove: function () {
    },

    drawFeedBack: function () {
    }

})
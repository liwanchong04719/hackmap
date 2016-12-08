/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathCopy
 */

fastmap.mapApi.PathCopy = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
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
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },


    onMouseDown: function () {
        //获取元素
        //
    },

    onMouseMove: function () {
    },

    drawFeedBack: function () {
    }

})

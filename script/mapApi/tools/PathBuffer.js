/**
 * Created by zhaohang on 2016/5/4.
 */

fastmap.mapApi.pathBuffer = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.selectCtrl = fastmap.uikit.SelectController();
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.validation =fastmap.uikit.geometryValidation({transform:  this.transform});
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
       /* this._map.on('mousewheel', this.onMouseWheel, this);*/
        L.DomEvent
            .on(this._map.getContainer(), 'mousewheel',this.onMouseWheel,this)
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousewheel', this.onMouseWheel, this);
    },

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标滚轮处理事件
     * @param event
     */
    onMouseWheel: function (event) {
        this.scale =  this.transform.scale( this._map);

        var k =  this.shapeEditor.shapeEditorResult.original.linkWidth;
        var e = window.event || event; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        var scale =  k+delta*(1.7/this.scale);
        if (scale*this.scale<6.6) {
            scale = 6.6/this.scale;
        }else if (scale*this.scale>160) {
            scale = 160/this.scale;
        }
        this.shapeEditor.shapeEditorResult.getFinalGeometry().linkWidth = scale;
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();

    },
    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(){
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
    }
})
/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexAdd
 */

fastmap.mapApi.PathVertexAdd = L.Handler.extend({

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
        var points = null;
        this._map._container.style.cursor = 'pointer';
        this.startPoint = null;
        this.endPoint = null;
        this.insertPoint = null;
        this.start = false;
        this.end = false;
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.on('click', this.onMouseDown, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
        this._map.on('dblclick', this.onDbClick, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.off('click', this.onMouseDown, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
        this._map.off('dblclick', this.onDbClick, this);
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },


    onMouseDown: function (event) {
        var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
        if(this.start){
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            this.startPoint =  fastmap.mapApi.point(mousePoint.lng, mousePoint.lat)
        }else{
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length, 1, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            this.endPoint =  fastmap.mapApi.point(mousePoint.lng, mousePoint.lat)
        }
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'crosshair';

        //if (this._mapDraggable) {
        //    this._map.dragging.disable();
        //}
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;


        var disStart = this.distance(this._map.latLngToLayerPoint([this.startPoint.y, this.startPoint.x]), layerPoint);
        var disEnd = this.distance(this._map.latLngToLayerPoint([this.endPoint.y, this.endPoint.x]), layerPoint);

        this.insertPoint =  fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);

        if (disStart < disEnd) {
            this.targetIndex = 0;

            if(this.end == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1,1);
            }

            if(this.start == false && this.end ==false){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,0,this.insertPoint);
            }

            if(this.end == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,0,this.insertPoint);
            }
            if(this.end ==false)
            {
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1,this.insertPoint);
            }
            //this.startPoint = this.insertPoint;
            this.start = true;
            this.end = false;
        } else {
            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1);
            }
            this.targetIndex = this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length;
            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex,0,this.insertPoint);
            }
            else{
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex-1,1,this.insertPoint);
            }


            //this.endPoint = this.insertPoint;
            this.start = false;
            this.end = true;
        }


        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();

    },

    onDbClick: function (event) {
        if(this.start == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1,this.insertPoint)
        }
        if(this.end == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length,1,this.insertPoint)
        }
        this.shapeEditor.stopEditing();
    },
    /***
     * 重新设置节点
     */
    resetVertex:function(){



            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1);
                this.start = false;
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 0, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
            }

            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));

    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }

});

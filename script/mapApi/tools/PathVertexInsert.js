/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class PathVertexInsert
 */

fastmap.mapApi.PathVertexInsert = L.Handler.extend({


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
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.snapHandler = new fastmap.mapApi.Snap({
            map:this._map,
            shapeEditor:this.shapeEditor,
            selectedSnap:false,
            snapLine:true
        });
        this.snapHandler.enable();
        this.eventController = fastmap.uikit.EventController();
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
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
    },

    /***
     * 移除事件
     */
    removeHooks: function(){
        this._map.off('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.off('click', this.onMouseDown, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
    },

    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function(event){
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        if(this.snapHandler.snaped){
            //var layerPoint = event.layerPoint;
            this.resetVertex(this._map.latLngToLayerPoint(this.targetPoint));
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({changeTooltips:true});
        }
        else{
            this.snapHandler.targetindex=-1;
            this.snapHandler.onMouseMove(event);
            if(this.snapHandler.snaped){
                this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0]);
                layerPoint = this._map.latLngToLayerPoint(this.targetPoint);
                this.resetVertex(layerPoint);

                this.shapeEditor.shapeEditorResultFeedback.setupFeedback({changeTooltips:true});
                this.disable();
                this.snapHandler.snaped=false;
            }
        }
    },

    onMouseMove: function(event){

        this.snapHandler.setTargetIndex(0);
        var that = this;
        if(this.snapHandler.snaped){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }

    },
    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    resetVertex:function(layerPoint){
        var index = 0;
        var segments = this.shapeEditor.shapeEditorResult.getFinalGeometry().getSortedSegments();
        for(var i = 0,len = segments.length; i< len; i++){
            var distance =  L.LineUtil.pointToSegmentDistance(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2)))
            if(distance < 5){
                latlng =this._map.layerPointToLatLng(L.LineUtil.closestPointOnSegment(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2))));
                index = i;
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(index+1,0,fastmap.mapApi.point(latlng.lng, latlng.lat))

                this.shapeEditor.shapeEditorResult.setFinalGeometry(this.shapeEditor.shapeEditorResult.getFinalGeometry());
            }
        }
    }
});

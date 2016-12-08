/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexMove
 */

fastmap.mapApi.PathVertexMove = L.Handler.extend({

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
        this.interLinks = [];
        this.interNodes = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:true,snapVertex:true});
        this.snapHandler.enable();
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
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
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        // var transform = new fastmap.mapApi.MecatorTranform();
        // var PointLoc = transform.lonlat2Tile(event.latlng.lng, event.latlng.lat, map.getZoom());
        // var PointPixel = transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, map.getZoom());
        // PointPixel[0] = Math.ceil(PointPixel[0]);
        // PointPixel[1] = Math.ceil(PointPixel[1]);
        //
        // var x = PointPixel[0] - 256 * PointLoc[0];
        // var y = PointPixel[1] - 256 * PointLoc[1];

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;

        for (var j = 1, len = points.length-1; j < len; j++) {
            // var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y,points[j].x]), x , y);
            var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y,points[j].x]), layerPoint);
            if (disAB < 5) {
                this.targetIndex = j;
            }
        }
        this.snapHandler.setTargetIndex(this.targetIndex);
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        // var transform = new fastmap.mapApi.MecatorTranform();
        // var PointLoc = transform.lonlat2Tile(event.latlng.lng, event.latlng.lat, map.getZoom());
        // var PointPixel = transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, map.getZoom());
        // PointPixel[0] = Math.ceil(PointPixel[0]);
        // PointPixel[1] = Math.ceil(PointPixel[1]);
        //
        // var x = PointPixel[0] - 256 * PointLoc[0];
        // var y = PointPixel[1] - 256 * PointLoc[1];
        // var layerPoint = new fastmap.mapApi.point(x,y);

        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if(this.targetIndex == null){
            return;
        }

        var that = this;

        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.snapHandler.targetIndex = this.targetIndex;
            this.selectCtrl.setSnapObj(this.snapHandler);
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])

        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});

        }

        that.resetVertex(layerPoint);

        that.shapeEditor.shapeEditorResultFeedback.setupFeedback({index:that.targetIndex});
    },

    contains:function(obj,arr){
        for(var item in arr){
            if(arr[item].nodePid == obj.nodePid){
                arr.splice(item,1,obj);
                return true;
            }
        }

        return false;
    },
    onMouseUp: function(event){
        this.targetIndex = null;
        this.snapHandler.setTargetIndex(this.targetIndex);

        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        var nodePid = null;
        if(this.snapHandler.snaped == true){
            if(this.snapHandler){
                if(this.snapHandler.targetIndex == 0){
                    nodePid = this.selectCtrl.selectedFeatures.snode;
                }else if(this.snapHandler.targetIndex == this.selectCtrl.selectedFeatures.geometry.components.length-1) {
                    nodePid = this.selectCtrl.selectedFeatures.enode;
                }else{
                    nodePid = null;
                }
            }

            if(this.snapHandler.selectedVertex == true){
                if(this.interNodes.length==0 ||!this.contains(nodePid,this.interNodes)){
                if(this.snapHandler.snapIndex == 0){

                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.snode),nodePid:nodePid});
                }else{
                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.enode),nodePid:nodePid});
                }
                }


            }else{
                if(this.interLinks.length ==0 || !this.contains({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid},this.interLinks )){
                    this.snapHandler.interLinks.push({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid});
                }


            }

            if(nodePid == null){
                this.snapHandler.interNodes = [];
                this.snapHandler.interLinks = [];
            }
        }
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
        //var distance =0 , distance1 = this.targetIndex!=0?0:this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex-1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]),
        //distance2 = this.targetIndex!=this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1?this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex+1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]):0;
        //distance = distance1<distance2?distance1:distance2
        //if(distance < 2){
        //    console.log('形状点之间距离不能小于2米！')
        //}

    }
})
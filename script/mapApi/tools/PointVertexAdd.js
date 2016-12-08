/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class PointVertexAdd
 */
fastmap.mapApi.PointVertexAdd = L.Handler.extend({

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
        //this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.eventController = fastmap.uikit.EventController();
        this.snapHandler = new fastmap.mapApi.Snap({
            map:this._map,
            shapeEditor:this.shapeEditor,
            selectedSnap:false,
            snapLine:true,
            snapNode:false,
            snapVertex:false
        });
        this.snapHandler.enable();
        //this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
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
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },


    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        this.resetVertex(this.targetPoint);
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function () {
        this.container.style.cursor = 'pointer';
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped){
            this.shapeEditor.fire('snaped',{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.selectCtrl.selectedFeatures = this.snapHandler.properties;
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.shapeEditor.fire('snaped',{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },
    onMouseUp: function () {
    },

    resetVertex:function(latlng){
        this.shapeEditor.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(latlng.lng, latlng.lat));
        this.eventController.fire(this.eventController.eventTypes.RESETCOMPLETE,
            {
                'property':this.snapHandler.properties,
                'geometry':this.snapHandler.coordinates
            }
        );
    }
})
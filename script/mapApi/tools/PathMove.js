/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathMove
 */

fastmap.mapApi.PathMove = L.Handler.extend({
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
        this.targetGeo=null;
        this.copypoints = [];
        this.borderpoint=null;
        this.borderclick=false;
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
        //.components
        var geos = this.shapeEditor.shapeEditorResult.getFinalGeometry();

        outer:for (var j = 0, len = geos.length; j < len; j++) {
            inner:for(var i=0;i<geos[j].components.length;i++){
                //判断到直线的距离也可以
                if(i<geos[j].components.length-1){
                    var points1=this._map.latLngToLayerPoint([geos[j].components[i].y,geos[j].components[i].x]);
                    var points2=this._map.latLngToLayerPoint([geos[j].components[i+1].y,geos[j].components[i+1].x]);
                    var pointsm=layerPoint;

                    if(points1.x==points2){
                        var len=Math.abs(pointsm.x-points1.x);
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }else if(points1.y==points2.y){//这样就得计算了
                        var len=Math.abs(pointsm.y-points1.y);
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }else{
                        var k=(points1.y-points2.y)/(points1.x-points2.x);
                        //var k_1=-1/k;
                        var xr=((pointsm.x/k)+k*points1.x-points1.y+pointsm.y)/(1/k+k);
                        var yr=k*(xr-points1.x)+points1.y;

                        var len=Math.sqrt( Math.pow( (xr-pointsm.x) ,2 ) + Math.pow( (yr-pointsm.y) ,2) )
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }

                }


            }

        }

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();

    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if(this.targetIndex == null){
            return;
        }
        this.resetVertex(layerPoint);//{index:this.targetIndex}
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseUp: function(event){
        this.targetIndex = null;
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        fastmap.uikit.ShapeEditorController().stopEditing();
    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(apoint){

        var points=this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeo].components;


        var aimPixPoint=this._map.latLngToLayerPoint([points[this.targetIndex].y,points[this.targetIndex].x]);
        var offsetx;
        var offsety;
        offsetx=apoint.x-this.borderpoint.x;
        offsety=apoint.y-this.borderpoint.y;
        this.borderpoint=apoint;

        //console.log(points);
        var newpointsArray=[];
        for(var i=0;i<points.length;i++){
            //var latlngpoint=this._map.layerPointToLatLng(points[i]);
            var pointB=this._map.latLngToLayerPoint([points[i].y,points[i].x]);
            var pointc=this._map.layerPointToLatLng([(pointB.x+offsetx),(pointB.y+offsety)]);
            var pointd=fastmap.mapApi.point(pointc.lng,pointc.lat);

            //console.log(points[i]);
            newpointsArray.push(pointd);
            this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeo].components.splice(i, 1, pointd);

        }

    }


})
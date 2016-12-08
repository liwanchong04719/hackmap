/**
 * Created by liuyang on 2015/9/16.
 * Class PpoiAdd
 */

fastmap.mapApi.poiAdd = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        var layerCtrl = fastmap.uikit.LayerController();
        this.currentEditLayer = layerCtrl.getLayerById('rdLink');
        this.tiles = this.currentEditLayer.tiles;
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.eventController = fastmap.uikit.EventController();
        this.captureHandler = new fastmap.mapApi.Capture({map:this._map,shapeEditor:this.shapeEditor,selectedCapture:false,captureLine:true});
        this.captureHandler.enable();
        // this.captureHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('poi'));
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('tap', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },

    onMouseMove:function(event){
        this.container.style.cursor = 'pointer';
        this.captureHandler.setTargetIndex(0);

        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);

        var that = this;
        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        this.eventController.fire(this.eventController.eventTypes.CAPTURED,{'captured':true});
        this.captureHandler.targetIndex = this.targetIndex;
        // this.selectCtrl.setCaptureObj(this.captureHandler);
        if(this.captureHandler.captureLatlng){
            var guide = L.latLng(this.captureHandler.captureLatlng[1],this.captureHandler.captureLatlng[0]);
            points.components[1].x = guide.lng;
            points.components[1].y = guide.lat;
            points.linkPid = this.captureHandler.properties.id;
        }
        points.components[0].x = this.targetPoint.lng;
        points.components[0].y = this.targetPoint.lat;
        that.shapeEditor.shapeEditorResult.setFinalGeometry(points);
        that.shapeEditor.shapeEditorResultFeedback.setupFeedback({index:that.targetIndex});
    },

    onMouseDown: function (event) {

    },


    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPath: function (d, x, y) {
        var N = d.length;
        var p1x = d[0][0][0];
        var p1y = d[0][0][1];
        var arr=[];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0][0];
            var p2y = d[i][0][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0
            }
            if (t > 1) {
                t = 1
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            //if ((dx * dx + dy * dy) <= r * r) {
            //    return (dx * dx + dy * dy)
            //}
            p1x = p2x;
            p1y = p2y
            arr.push(dx * dx + dy * dy)
        }
        var temp = 0;
        for (var i = 0; i < arr.length; i++)
        {
            for (var j = 0; j < arr.length - i; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr[0];


    },
    cleanHeight: function () {
        this._cleanHeight();
    },
    /***
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.redrawTiles) {
            var data = this.redrawTiles[index].data;
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.c;
                    }

                    var style = this.currentEditLayer.styleFor(feature, color);

                    var geom = feature.geometry.coordinates;
                    if(!style) {
                        this.currentEditLayer._drawLineString(ctx, geom, true, {
                                size: 4,
                                color: '#FBD356',
                                mouseOverColor: 'rgba(255,0,0,1)',
                                clickColor: 'rgba(252,0,0,1)'
                            },
                            {
                                color: 'rgba(255,0,0,1) ',
                                radius: 3
                            }, feature.properties);
                    }else{
                        this.currentEditLayer._drawLineString(ctx, geom, true, style, {
                            color: '#696969',
                            radius: 3
                        }, feature.properties);
                    }


                }
            }

        }


    }
    ,
    /***
     * 绘制高亮
     * @param id
     * @private
     */
    _drawHeight: function (id,point) {
        this.redrawTiles = this.tiles;
        for (var obj in this.tiles) {

            var data = this.tiles[obj].data.features;

            for (var key in data) {

                if (data[key].properties.id == id) {
                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    };
                    this.currentEditLayer._drawImg({
                        ctx:ctx,
                        geo:point,
                        style:{src:'../../images/road/img/star.png'},
                        boolPixelCrs:true
                    })
                }
            }
        }


    }

});
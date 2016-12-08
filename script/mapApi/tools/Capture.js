/**
 * Created by liuyang on 2016/6/22.
 * Class capture
 * captureLine
 */
fastmap.mapApi.Capture = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.interLinks = [];
        this.interNodes = [];
        this._map = this.options.map;
        this.captureIndex = -1;
        this.shapeEditor = this.options.shapeEditor;
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.captureLine = this.options.captureLine == true ? this.options.captureLine : false;
        this.selectedCapture = this.options.selectedCapture == true ? this.options.selectedCapture : false;
        //鼠标点位，按瓦片坐标计算
        this.point = null;
        this.selectedLink = null;
        this._guides = [];
        this.captured = false;
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousemove', this.onMouseMove, this);
    },
    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousemove', this.onMouseMove, this);
    },
    addGuideLayer: function (layer) {
        for (var i = 0, n = this._guides.length; i < n; i++)
            if (L.stamp(layer) === L.stamp(this._guides[i]))
                return;
        this._guides.push(layer);
    },

    setTargetIndex: function (index) {
        this.targetindex = index;
    },

    setSelectedLink: function (link) {
        this.selectedLink = link;
    },
    setCaptureOptions: function (obj) {
        if(obj.captureLine){
            this.captureLine = obj.captureLine;
        }
    },
    getCaptureOptions:function() {
        var obj = {};
        obj.captureLine = this.captureLine;
        return obj;
    },
    onMouseMove: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        if (this.targetindex == null) {
            return;
        }
        var latlng = event.latlng;
        var pixels = this.transform.lonlat2Pixel(latlng.lng, latlng.lat, this._map.getZoom());
        //根据鼠标点计算所在的瓦片坐标
        var tiles = this.transform.lonlat2Tile(latlng.lng, latlng.lat, this._map.getZoom());
        var tilePixcel = new fastmap.mapApi.Point(pixels[0] - tiles[0] * 256, pixels[1] - tiles[1] * 256);
        var closest = null;
        for (var layerindex in this._guides) {

            //设置捕捉级别
            if(this._map.getZoom() < this._guides[layerindex].showNodeLevel){
                return;
            }
            this.selectedId = this._guides[layerindex].selectedid;
            // if(this._map.getZoom() == 20){
            //     this.tileDataList = [];//当前瓦片周边
            //     for(var tileData in this._guides[layerindex].tiles ){
            //         this.tileDataList = this.tileDataList.concat(this._guides[layerindex].tiles[tileData].data);
            //     }
            //     var closest = this.closeestCapture({
            //         point:tilePixcel,
            //         data:this.tileDataList,
            //         candidateId:this._guides[layerindex].selectedid
            //     });
            //     if (closest) {
            //         this.captured = true;
            //         this.properties = closest.properties;
            //         this.captureIndex = closest.index;
            //         this.coordinates = closest.layer;
            //         this.selectedVertex = closest.selectedVertexe;
            //         var captureTile = null;
            //         for(var tile in this._guides[layerindex].tiles){
            //             var tiledate = this._guides[layerindex].tiles[tile].data;
            //             for(var i = 0;i<tiledate.length;i++){
            //                 if(tiledate[i].properties.id == closest.properties.id && tiledate[i].properties.enode == closest.properties.enode &&tiledate[i].properties.snode == closest.properties.snode &&tiledate[i].geometry.coordinates.length == closest.layer.length ){
            //                     captureTile = tile.split(":");
            //                     break;
            //                 }
            //             }
            //             if(captureTile){
            //                 break;
            //             }
            //         }
            //         this.captureLatlng = this.transform.PixelToLonlat(closest.latlng[0] + parseInt(captureTile[0]) * 256, closest.latlng[1] + parseInt(captureTile[1]) * 256, this._map.getZoom());
            //         //break;
            //     } else {
            //         this.captured = false;
            //     }
            // }else {
                this.currentTileData = this._guides[layerindex].tiles[tiles[0] + ':' + tiles[1]];
                if (this.currentTileData&&this.currentTileData.data) {
                    closest = this.closeestCapture({
                        point:tilePixcel,
                        data:this.currentTileData.data,
                        candidateId:this._guides[layerindex].selectedid
                    });
                    if (closest) {
                        this.captured = true;
                        this.properties = closest.properties;
                        this.captureIndex = closest.index;
                        this.coordinates = closest.layer;
                        this.selectedVertex = closest.selectedVertexe;
                        this.captureLatlng = this.transform.PixelToLonlat(closest.latlng[0] + tiles[0] * 256, closest.latlng[1] + tiles[1] * 256, this._map.getZoom());
                        //break;
                    } else {
                        this.captured = false;
                    }
                // }
            }
        }
    },
    setPoint: function (point) {
        this.point = point;
    },
    enable: function () {
        this.disable();
        this.addHooks();
    },
    /***
     * 捕捉实现
     * @param options
     * @returns {*}
     */
    closeestCapture:function(options){
        //鼠标在当前瓦片中的坐标
        var mousePoint = options.point;
        //当前瓦片中缓存的数据
        var data = options.data;
        //捕捉候选id
        var candidateId = options.candidateId?options.candidateId:null;

        var mindistline = Infinity, mindistvertex = Infinity, mindistnode = Infinity,
            result = null,
            distaceResult = null,
            minDis = 500,
            fc = 0,
            distance = Infinity;
        for (var i = 0, n = data.length; i < n; i++) {

            var geometry = null;
            //道路、去除form of way = 50的道路
            if (data[i].geometry.type == "LineString" && data[i].properties.featType == "RDLINK" && data[i].properties.form.indexOf('50') == -1) {
                if (this.captureLine) {
                    if (this.selectedCapture == true) {
                        if (data[i].properties.id == this.selectedId) {
                            geometry = data[i].geometry.coordinates;

                            distaceResult = this.closest(geometry, mousePoint);

                            if (distaceResult){
                                if(distaceResult.distance.distance<minDis){
                                    minDis = distaceResult.distance.distance;
                                    result = {
                                        layer: geometry,
                                        latlng: [distaceResult.x, distaceResult.y],
                                        index: distaceResult.index,
                                        distance: minDis,
                                        properties: data[i].properties
                                    };
                                    fc = data[i].properties.fc;//把fc做为取舍条件之一
                                }else if(distaceResult.distance.distance==minDis && (data[i].properties.fc != 0 && data[i].properties.fc < fc)){//fc的原则：1>2>3>4>5>0
                                    minDis = distaceResult.distance.distance;
                                    result = {
                                        layer: geometry,
                                        latlng: [distaceResult.x, distaceResult.y],
                                        index: distaceResult.index,
                                        distance: minDis,
                                        properties: data[i].properties
                                    };
                                    fc = data[i].properties.fc;
                                }
                            }

                        }

                    } else {
                        geometry = data[i].geometry.coordinates;

                        distaceResult = this.closest(geometry, mousePoint);

                        if (distaceResult){
                            if(distaceResult.distance.distance<minDis){
                                minDis = distaceResult.distance.distance;
                                result = {
                                    layer: geometry,
                                    latlng: [distaceResult.x, distaceResult.y],
                                    index: distaceResult.index,
                                    distance: minDis,
                                    properties: data[i].properties
                                };
                                fc = data[i].properties.fc;//把fc做为取舍条件之一
                            }else if(distaceResult.distance.distance==minDis && (data[i].properties.fc != 0 && data[i].properties.fc < fc)){//fc的原则：1>2>3>4>5>0
                                minDis = distaceResult.distance.distance;
                                result = {
                                    layer: geometry,
                                    latlng: [distaceResult.x, distaceResult.y],
                                    index: distaceResult.index,
                                    distance: minDis,
                                    properties: data[i].properties
                                };
                                fc = data[i].properties.fc;
                            }
                        }
                    }
                }

            }

        }
        if (!result)
            return null;

        return result;

    },

    /***
     * 计算点到线的最近距离
     * @param layer
     * @param p
     * @param vertices
     * @returns {*}
     */
    closest: function ( layer, p, vertices) {
        if (typeof layer.getLatLngs != 'function')

        var latlngs = layer,
            mindist = Infinity,
            result = null,
            i, n, distance;

        // Lookup vertices
        if (vertices) {
            result = {};
            for (i = 0, n = latlngs.length; i < n; i++) {

                if (i != 0 || i != n - 1) {
                    var ll = latlngs[i];
                    var point = new fastmap.mapApi.Point(ll[0], ll[1]);

                    distance = point.distanceTo(new fastmap.mapApi.Point(p.x, p.y));
                    if (distance < mindist) {
                        mindist = distance;
                        result.x = ll[0];
                        result.y = ll[1];
                        result.distance = distance;
                        result.index = i;
                    }
                }

            }
            return result;
        }

        if (layer instanceof L.Polygon) {
            latlngs.push(latlngs[0]);
        }

        // Keep the closest point of all segments
        for (i = 0, n = latlngs.length; i < n - 1; i++) {

            var latlngA = latlngs[i],
                latlngB = latlngs[i + 1];

            var line = new fastmap.mapApi.LineString([new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1])])
            distance = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1]));

            if (distance.distance <= mindist) {
                mindist = distance.distance;

                result = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1]));
                result.distance = distance;
                result.index = -1;
            }
        }
        return result;
    }

});
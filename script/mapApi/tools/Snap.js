/**
 * Created by zhongxiaoming on 2015/12/14.
 * Class Snap
 * SnapPoint or SnapLine
 */
fastmap.mapApi.Snap = L.Handler.extend({

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
        this.snapIndex = -1;
        this.shapeEditor = this.options.shapeEditor;
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.snapVertex = this.options.snapVertex == true ? this.options.snapVertex : false;
        this.snapNode = this.options.snapNode == true ? this.options.snapNode : false;
        this.snapLine = this.options.snapLine == true ? this.options.snapLine : false;
        this.selectedSnap = this.options.selectedSnap == true ? this.options.selectedSnap : false;
        //鼠标点位，按瓦片坐标计算
        this.point = null;
        this.selectedLink = null;
        this._guides = [];
        this.snaped = false;
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
    /*
    * 先加的优先捕捉
    * */
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
    setSnapOptions: function (obj) {
        if(obj.snapVertex){
            this.snapVertex = obj.snapVertex;
        }
        if(obj.snapNode){
            this.snapNode = obj.snapNode;
        }
        if(obj.snapLine){
            this.snapLine = obj.snapLine;
        }
    },
    getSnapOptions:function() {
        var obj = {};
        obj.snapVertex = this.snapVertex;
        obj.snapNode = this.snapNode;
        obj.snapLine = this.snapLine;
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
        for (var layerindex in this._guides) {

            //设置捕捉级别
            if(this._map.getZoom() < this._guides[layerindex].showNodeLevel){
                return;
            }
            this.selectedId = this._guides[layerindex].selectedid;
            this.currentTileData = this._guides[layerindex].tiles[tiles[0] + ':' + tiles[1]];
            if (this.currentTileData&&this.currentTileData.data) {
                var closest = null;
                    closest = this.closeestSnap({
                        tolerance:10,
                        point:tilePixcel,
                        data:this.currentTileData.data,
                        candidateId:this._guides[layerindex].selectedid
                    })
                if (closest) {
                    this.snaped = true;
                    this.properties = closest.properties;
                    this.snapIndex = closest.index;

                    this.coordinates = closest.layer;
                    this.selectedVertex = closest.selectedVertexe;
                    this.snapLatlng = this.transform.PixelToLonlat(closest.latlng[0] + tiles[0] * 256, closest.latlng[1] + tiles[1] * 256, this._map.getZoom());
                    break;//增加break，多个捕捉层的时候要用到
                }
                else {
                    //this.selectedVertex = closest.selectedVertexe;
                    this.snaped = false;
                }
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
    closeestSnap:function(options){
        //捕捉的阈值
        var tolerance = typeof options.tolerance == 'number' ? options.tolerance : Infinity;
        //鼠标在当前瓦片中的坐标
        var mousePoint = options.point;
        //当前瓦片中缓存的数据
        var data = options.data;
        //捕捉候选id
        var candidateId = options.candidateId?options.candidateId:null;

        var mindistline = Infinity, mindistvertex = Infinity, mindistnode = Infinity,
            result = null,
            distaceResult = null,
            distance = Infinity;
        for (var i = 0, n = data.length; i < n; i++) {

            var geometry = null;
            //根据几何类型判断计算距离的方法；点/线；如果用户将三种捕捉全部打开，则优先捕捉node，然后是vertex，最后是line
            //捕捉线
            if (data[i].geometry.type == "LineString") {
                if (this.snapLine) {
                    if (this.selectedSnap == true) {
                        if (data[i].properties.id == this.selectedId) {
                            geometry = data[i].geometry.coordinates;

                            distaceResult = this.closest(geometry, mousePoint);

                            if (distaceResult) distance = distaceResult.distance.distance;  // Can return null if layer has no points.
                            if (distance <= 10) {
                                //mindistline = distance;
                                result = {
                                    layer: geometry,
                                    latlng: [distaceResult.x, distaceResult.y],
                                    index: distaceResult.index,
                                    distance: distance,
                                    properties: data[i].properties
                                };
                            }
                        }

                    } else {
                        geometry = data[i].geometry.coordinates;

                        distaceResult = this.closest(geometry, mousePoint);

                        if (distaceResult) distance = distaceResult.distance.distance;  // Can return null if layer has no points.

                        if (distance <= 10) {
                            //mindistline = distance;
                            result = {
                                layer: geometry,
                                latlng: [distaceResult.x, distaceResult.y],
                                index: distaceResult.index,
                                distance: distance,
                                properties: data[i].properties
                            };
                        }
                    }
                } else if (this.snapVertex == true) {
                    if (this.selectedSnap == true) {
                        if (data[i].properties.id == this.selectedId) {
                            geometry = data[i].geometry.coordinates;

                            distaceResult = this.closest(geometry, mousePoint, this.snapVertex);
                            if (distaceResult.distance < 10 && (distaceResult.index > 0 && distaceResult.index < geometry.length - 1)) {
                                //mindistvertex = mousePoint.distanceTo(new fastmap.mapApi.Point(distaceResult[0], distaceResult[1]))

                                result = {
                                    latlng: [distaceResult.x, distaceResult.y],
                                    distance: mousePoint.distanceTo(new fastmap.mapApi.Point(distaceResult[0], distaceResult[1])),
                                    index: distaceResult.index,
                                    selectedVertexe: true
                                }
                            }
                        }
                    } else {
                        geometry = data[i].geometry.coordinates;

                        distaceResult = this.closest(geometry, mousePoint, this.snapVertex);
                        if (distaceResult.distance < 10 && (distaceResult.index > 0 && distaceResult.index < geometry.length - 1)) {
                            //mindistvertex = mousePoint.distanceTo(new fastmap.mapApi.Point(distaceResult[0], distaceResult[1]))

                            result = {
                                latlng:[distaceResult.x, distaceResult.y],
                                distance:mousePoint.distanceTo(new fastmap.mapApi.Point(distaceResult[0], distaceResult[1])),
                                index: distaceResult.index,
                                selectedVertexe:true
                            }
                        }
                    }
                }


            }
            if (data[i].geometry.type == "Point") {
                if (this.snapNode) {
                    geometry = data[i].geometry.coordinates;
                    distaceResult = mousePoint.distanceTo(new fastmap.mapApi.point(geometry[0], geometry[1]));
                    if (distaceResult <= 10) {
                        result = {
                            latlng: geometry,
                            distance: distaceResult,
                            properties: data[i].properties,
                            index: -2
                        };

                    }
                }

                distaceResult = mousePoint.distanceTo(new fastmap.mapApi.point(geometry[0],geometry[1]));

                //if (distaceResult < mindist) {
                //    mindist = distaceResult;
                //    result = {
                //        latlng:geometry,
                //        distance: distaceResult,
                //        properties: data[i].properties,
                //        index:0
                //    };
                //}


            }

        }
        if (!result || result.distance > tolerance)
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
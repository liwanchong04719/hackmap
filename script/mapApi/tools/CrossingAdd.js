/**
 * Created by liwanchong on 2015/12/29.
 */
fastmap.mapApi.CrossingAdd = L.Handler.extend({
    /**
     * 参数
     */
    options: {
        shapeOptions: {
            stroke: true,
            color: '#f06eaa',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillColor: null, //same as color by default
            fillOpacity: 0.2,
            clickable: true
        },
        metric: true, // Whether to use the metric meaurement system or imperial
        repeatMode: true
    },
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.type = options.type;
        this._map = options.map;
//        this.boxLayer = options.layer;
        this.boxLayers = options.layer;
        this._container = this._map._container;
        this.eventController = fastmap.uikit.EventController();
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {
        if (this._map) {
            this._mapDraggable = this._map.dragging.enabled();

            if (this._mapDraggable) {
                this._map.dragging.disable();
            }
            this._container.style.cursor = 'crosshair';
            this._map
                .on('mousedown', this.onMouseDown, this)
                .on('mousemove', this.onMouseMove, this);
        }
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        if (this._map) {
            if (this._mapDraggable) {
                this._map.dragging.enable();
            }

            //TODO refactor: move cursor to styles
            this._map._container.style.cursor = '';

            this._map
                .off('mousedown', this.onMouseDown, this)
                .off('mousemove', this.onMouseMove, this);

            L.DomEvent.off(document, 'mouseup', this.onMouseUp, this);

            // If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
            if (this._shape) {
                this._map.removeLayer(this._shape);
                this._map.getPanes().overlayPane.style.zIndex = "1";
                delete this._shape;
            }
        }
        this._isDrawing = false;
    },
    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function (e) {
        this._isDrawing = true;
        this._startLatLng = e.latlng;
        if (this._map.getPanes().overlayPane.style.zIndex === "1") {
            this._map.getPanes().overlayPane.style.zIndex = "4";
        }

        L.DomEvent
            .on(document, 'mouseup', this.onMouseUp, this)
            .preventDefault(e.originalEvent);
    },
    onMouseUp: function (e) {
        if (this._shape) {
            this._fireCreatedEvent();
        }

        this.disable();
        if (this.options.repeatMode) {
            this.enable();
        }
    },
    onMouseMove: function (e) {
        var latlng = e.latlng;
        if (this._isDrawing) {
            this._drawShape(latlng);

        }
    },
    _fireCreatedEvent: function () {
        var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);
        //var dataOfRectangle = this._dataOfRectangle(rectangle, this.boxLayer.tiles);
        var dataOfRectangle = [];
        for(var i = 0; i<this.boxLayers.length; i++){
            var middleArr = this._getDataOfRectangle(rectangle, this.boxLayers[i].tiles);
        	if(middleArr.length>0){
        		dataOfRectangle = dataOfRectangle.concat(middleArr);
        	}

        }
//        var dataOfRectangle = this._getDataOfRectangle(rectangle, this.boxLayer.tiles);

        this.eventController.fire(this.eventController.eventTypes.GETBOXDATA,
            {data: dataOfRectangle, layerType: this.type,border:rectangle});
    },
    _arrayToWeigh: function (arr) {
        var hash = {},
            len = arr.length,
            re = [];
        for (var i = 0; i < len; i++) {
            if (!hash[arr[i]]) {
                hash[[arr[i]]] = true;
                re.push(arr[i]);
            }
        }
        return re;
    },
    _getDataOfRectangle: function (layer, tiles) {
        var points = layer._latlngs, dataOfRectangle = [];
        var transform = new fastmap.mapApi.MecatorTranform();
        var startTilePoint = transform.lonlat2Tile(points[1].lng, points[1].lat, map.getZoom()),
            endTilePoint = transform.lonlat2Tile(points[3].lng, points[3].lat, map.getZoom());
        var point0 = new fastmap.mapApi.Point(points[1].lng, points[1].lat);
        var point1 = new fastmap.mapApi.Point(points[2].lng, points[2].lat);
        var point2 = new fastmap.mapApi.Point(points[3].lng, points[3].lat);
        var point3 = new fastmap.mapApi.Point(points[0].lng, points[0].lat);
        var lineString = new fastmap.mapApi.LinearRing([point0, point1, point2, point3, point0]);
        var polygon = new fastmap.mapApi.Polygon([lineString]);
        for (var i = startTilePoint[0]; i <= endTilePoint[0]; i++) {
            for (var j = startTilePoint[1]; j <= endTilePoint[1]; j++) {

                if (tiles[i + ":" + j]) {
                    var data = tiles[i + ":" + j].data;
                    for (var item in data) {
                        var pointsLen = data[item].geometry.coordinates.length;
                        var linePoints = [];
                        for(var n=0;n<pointsLen;n++) {
                            var linePoint = data[item].geometry.coordinates[n];
                            linePoint = transform.PixelToLonlat(i * 256 + linePoint[0], j * 256 + linePoint[1], map.getZoom());
                            linePoint = new fastmap.mapApi.Point(linePoint[0], linePoint[1]);
                            linePoints.push(linePoint);
                        }
                        var line = new fastmap.mapApi.LineString(linePoints);
                        if(polygon.intersects(line)) {
                            var result = {};
                            result["data"] = data[item];
                            result["line"] = line;
                            dataOfRectangle.push(result);
                        }
                    }
                }
            }
        }

        return dataOfRectangle;
    },
    _dataOfRectangle: function (layer, tiles) {
        var points = layer._latlngs, linkArr = [], nodeArr = [], dataOfRectangle = null;
        var transform = new fastmap.mapApi.MecatorTranform();
        var startTilePoint = transform.lonlat2Tile(points[1].lng, points[1].lat, map.getZoom()),
            endTilePoint = transform.lonlat2Tile(points[3].lng, points[3].lat, map.getZoom());
        var point0 = new fastmap.mapApi.Point(points[1].lng, points[1].lat);
        var point1 = new fastmap.mapApi.Point(points[2].lng, points[2].lat);
        var point2 = new fastmap.mapApi.Point(points[3].lng, points[3].lat);
        var point3 = new fastmap.mapApi.Point(points[0].lng, points[0].lat);
        var lineString = new fastmap.mapApi.LinearRing([point0, point1, point2, point3, point0]);
        var polygon = new fastmap.mapApi.Polygon([lineString]);
        for (var i = startTilePoint[0]; i <= endTilePoint[0]; i++) {
            for (var j = startTilePoint[1]; j <= endTilePoint[1]; j++) {
                var data = tiles[i + ":" + j].data.features;
                if (data) {
                    for (var item in data) {
                        var pointsLen = data[item].geometry.coordinates.length;
                            var startPoint = data[item].geometry.coordinates[0][0],
                                endPoint = data[item].geometry.coordinates[pointsLen - 1][0];
                            startPoint = transform.PixelToLonlat(i * 256 + startPoint[0], j * 256 + startPoint[1], map.getZoom());
                            startPoint = new fastmap.mapApi.Point(startPoint[0], startPoint[1]);
                            endPoint = transform.PixelToLonlat(i * 256 + endPoint[0], j * 256 + endPoint[1], map.getZoom());
                            endPoint = new fastmap.mapApi.Point(endPoint[0], endPoint[1]);
                            if (polygon.containsPoint(startPoint)) {
                                if (polygon.containsPoint(endPoint)) {
                                    linkArr.push({
                                        "node": [parseInt(data[item].properties.snode), parseInt(data[item].properties.enode)],
                                        "link": parseInt(data[item].properties.id)
                                    });

                                } else {
                                    var sObj = {
                                        "node": parseInt(data[item].properties.snode),
                                        "link": parseInt(data[item].properties.id)
                                    }
                                    nodeArr.push(sObj);
                                }


                            } else if (polygon.containsPoint(endPoint)) {

                                if (polygon.containsPoint(startPoint)) {
                                    linkArr.push({
                                        "node": [parseInt(data[item].properties.snode), parseInt(data[item].properties.enode)],
                                        "link": parseInt(data[item].properties.id)
                                    });
                                } else {
                                    var eObj = {
                                        "node": parseInt(data[item].properties.enode),
                                        "link": parseInt(data[item].properties.id)
                                    };
                                    nodeArr.push(eObj);
                                }

                            }

                            dataOfRectangle = {
                                links: linkArr,
                                nodes: nodeArr
                            };


                    }
                }
            }
        }

        return dataOfRectangle;
    },
    _drawShape: function (latlng) {
        if (!this._shape) {
            this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
            this._map.addLayer(this._shape);
        } else {
            this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
        }
    },
    //两点之间的距离
    distance: function (pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }
})
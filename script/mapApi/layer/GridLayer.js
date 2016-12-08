/**
 * Created by wangtun on 2016/2/2.
 */
/**
 * Created by zhongxiaoming on 2015/9/2.
 * Class 1:25000图幅图层
 */
fastmap.mapApi.GridLayer = fastmap.mapApi.MeshLayer.extend({
    /***
     * 初始化可选参数
     * @param {Object}options
     */
    initialize: function(url, options) {
        this.url = url;
        this.options = options || {};
        fastmap.mapApi.MeshLayer.prototype.initialize(this, options);
        this.minShowZoom = this.options.minShowZoom || 9;
        this.maxShowZoom = this.options.maxShowZoom || 18;
        this.divideX = this.options.divideX || 0;
        this.divideY = this.options.divideY || 0;
    },
    /***
     * 图层添加到地图时调用
     * @param{L.Map} map
     */
    onAdd: function(map) {
        this.map = map;
        this._initContainer(this.options);
        var that = this;
        var center = null;
        this.canv.onclick = function(e) {
            var event = e;
            event.stopPropagation();
            event.preventDefault();
            var showFlag = false;
            for (var i = 0; i < that.gridArr.length; i++) {
                var latlngbounds = that.gridArr[i].getBounds();
                var bound = L.bounds(that.map.latLngToContainerPoint(latlngbounds.getNorthWest()), that.map.latLngToContainerPoint(latlngbounds.getSouthEast()));
                if (e.x <= bound.max.x && e.x >= bound.min.x && e.y <= bound.max.y && e.y >= bound.min.y) {
                    var center = latlngbounds.getCenter();
                    if (that.options.gridInfo[that.gridArr[i].options.gridId]) {
                        if (that.options.gridInfo[that.gridArr[i].options.gridId].couldBorrow) {
                            that.map.openPopup('<a href="javascript:void(0)" class="btn btn-warning">借数据</a>', center);
                        } else if (that.options.gridInfo[that.gridArr[i].options.gridId].couldReturn) {
                            that.map.openPopup('<a href="javascript:void(0)" class="btn btn-warning">还数据</a>', center);
                        } else if (that.options.gridInfo[that.gridArr[i].options.gridId].userId) {
                            that.map.openPopup('<div style="width:200px;text-align: center"><img src="css/img/pie.jpg" style="width:100px;height:100px"/></div>', center);
                        }
                        showFlag = true;
                    }
                }
            }
            if (!showFlag) {
                that.map.closePopup()
            }
        };
        this.canv.ondblclick = function() {
            window.location.href = "edit.html";
        }
        map.on("moveend", this._redraw, this);
        this._redraw();
    },
    /***
     * 图层被移除时调用
     * @param {L.Map}map
     */
    onRemove: function(map) {
        map.getPanes().tilePane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },
    /***
     * 根据bounds绘制图幅
     * @param {L.Bounds}bounds
     */
    draw: function(bounds) {
        var pointDL = bounds.getSouthWest();
        //右上角点
        var pointUR = bounds.getNorthEast();
        //var ret= this.CalculateMeshIds(pointDL.lng, pointUR.lng, pointDL.lat, pointUR.lat);
        var minPoint = this.Calculate25TMeshCorner(pointDL);
        var minLon = minPoint.lng;
        var minLat = minPoint.lat;
        this.gridArr = [];
        var labelArr = [];
        while (minLon <= pointUR.lng) {
            var gridObj = this.createGrid(minLon, minLon + 0.125, minLat, pointUR.lat);
            this.gridArr = this.gridArr.concat(gridObj);
            minLon += 0.125;
        }
        for (var i = 0, len = this.gridArr.length; i < len; i++) {
            var latlngbounds = this.gridArr[i].getBounds();
            var bound = L.bounds(this.map.latLngToContainerPoint(latlngbounds.getNorthWest()), this.map.latLngToContainerPoint(latlngbounds.getSouthEast()));
            var size = bound.getSize();
            this.drawRect(this._ctx, this.gridArr[i], {
                x: bound.min.x,
                y: bound.min.y,
                width: size.x,
                height: size.y
            });
        }
    },
    /***
     * 绘制格网
     * @param {Object}context canvas context
     * @param meshId 图幅id
     * @param options 可选参数
     */
    drawRect: function(context, grid, options) {
        context.globalAlpha = 0.3;
        context.linewidth = 1; //边框宽
        context.strokeStyle = '#000AFF' //边框颜色
        context.strokeRect(options.x, options.y, options.width, options.height);
    },
    /***
     * 重绘
     * @returns {fastmap.mapApi.MeshLayer}
     * @private
     */
    _redraw: function() {
        this._resetCanvasPosition();
        this.clear();
        if (this.map.getZoom() >= this.minShowZoom && this.map.getZoom() <= this.maxShowZoom) {
            this.draw(this.map.getBounds())
        }
        return this;
    },
    /***
     * 生成图幅格网
     * @param {number}minLon 最小经度
     * @param {number}maxLon 最大经度
     * @param {number}origin 原点
     * @param {number}destination 最大经度
     * @returns {Array}
     */
    createGrid: function(minLon, maxLon, origin, destination) {
        //保存生成的网格
        var grid = [];
        var labels = []
        while (origin <= destination) {
            var components = [];
            components.push([origin, minLon]);
            components.push([origin + 0.083333333333333, minLon]);
            components.push([origin + 0.083333333333333, maxLon]);
            components.push([origin, maxLon]);
            var meshId = this.Calculate25TMeshId({
                lng: (minLon + maxLon) / 2,
                lat: (origin + origin + 0.083333333333333) / 2
            });
            var bound = this.Calculate25TMeshBorder(meshId);
            this.createSubGrid(grid, bound, meshId, function() {
                origin += 0.083333333333333;
            });
        }
        return grid
    },
    createSubGrid: function(grid, bound, meshId, callback) {
        var differenceY = bound.maxLat - bound.minLat;
        if (this.divideY > 0) {
            differenceY = (bound.maxLat - bound.minLat) / this.divideY;
        }
        var differenceX = bound.maxLon - bound.minLon;
        if (this.divideX > 0) {
            differenceX = (bound.maxLon - bound.minLon) / this.divideX;
        }
        for (var i = 0; i < this.divideX; i++) {
            var boundXmin = bound.minLon + differenceX * i;
            var boundXmax = bound.minLon + differenceX * (i + 1);
            for (var j = 0; j < this.divideY; j++) {
                var boundYmin = bound.minLat + differenceY * j;
                var boundYmax = bound.minLat + differenceY * (j + 1)
                var b = L.latLngBounds([boundYmin, boundXmin], [boundYmax, boundXmax]);
                var polygon = L.rectangle(b, {
                    meshId: meshId,
                    gridId: meshId + "_" + j + "" + i
                });
                grid.push(polygon);
            }
        }
        callback();
    },
    /***
     * 清空图层
     */
    clear: function() {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },
    /***
     * 重新调整图层位置
     * @private
     */
    _resetCanvasPosition: function() {
        var bounds = this.map.getBounds();
        var topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);
    },
    /*
     *  根据纬度计算该点位于理想图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateIdealRowIndex: function(lat, remainder) {
        //相对区域纬度 = 绝对纬度 - 0.0
        var regionLatitude = lat - 0.0;
        //相对的以秒为单位的纬度
        var secondLatitude = regionLatitude * 3600;
        var longsecond;
        //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        if (secondLatitude * 1000 < 0) {
            longsecond = Math.ceil(secondLatitude * 1000);
        } else {
            longsecond = Math.floor(secondLatitude * 1000)
        }
        remainder = (longsecond % 300000);
        return {
            value: Math.floor(longsecond / 300000),
            reminder: remainder
        };
    },
    /*
     *  根据纬度计算该点位于实际图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateRealRowIndex: function(lat, remainder) {
        //理想行号
        var idealRow = this.CalculateIdealRowIndex(lat, remainder);
        switch (idealRow % 3) { //三个一组的余数
            case 0: //第一行
                {
                    if (300000 - idealRow.remainder <= 12) //余数距离上框小于0.012秒
                        idealRow.value++;
                }
                break;
            case 1: //第二行
                break;
            case 2: //第三行
                {
                    if (idealRow.remainder < 12) //余数距离下框小于等于0.012秒
                        idealRow.value--;
                }
                break;
        }
        return idealRow;
    },
    /*
     *  根据经度计算该点位于实际图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     */
    CalculateRealColumnIndex: function(lon, remainder) {
        return this.CalculateIdealColumnIndex(lon, remainder);
    },
    /*
     * 根据经度计算该点位于理想图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     *  @param{number}reminder           余数 单位“千秒”
     */
    CalculateIdealColumnIndex: function(lon, remainder) {
        //相对区域经度 = 绝对经度 - 60.0
        var regionLongitude = lon - 60.0;
        //相对的以秒为单位的经度
        var secondLongitude = regionLongitude * 3600;
        //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        var longsecond = Math.floor(secondLongitude * 1000);
        remainder = Math.floor(longsecond % 450000);
        return {
            value: Math.floor(longsecond / 450000),
            reminder: remainder
        };
    },
    MeshLocator_25T: function(lon, lat) {
        if (0x01 == (this.IsAt25TMeshBorder(lon, lat) & 0x0F)) //为了保证它总返回右上的图幅
            lat += 0.00001;
        var remainder = 0;
        var rowResult = this.CalculateRealRowIndex(lat, remainder);
        var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);
        //第1、2位 : 纬度取整拉伸1.5倍
        var M1M2 = Math.floor(lat * 1.5);
        //第3、4位 : 经度减去日本角点 60度
        var M3M4 = Math.floor(lon) - 60;
        //第5位 :
        var M5 = rowResult.value % 8;
        //第6位 : 每列450秒，每度包含8列
        var M6 = colResult.value % 8;
        //连接以上数字,组成图幅号
        var sMeshId = "" + M1M2 + M3M4 + M5 + M6;
        while (sMeshId.length < 6) {
            sMeshId = "0" + sMeshId;
        }
        return sMeshId;
    },
    /*
     *  点所在的图幅号,如果点在图幅边界上,返回右上的图幅号
     *
     *  @param {L.Latlng}point   经纬度点
     */
    Calculate25TMeshId: function(point) {
        var mesh = this.MeshLocator_25T(point.lng, point.lat);
        return mesh;
    },
    /*
     *  快速计算点所在的图幅左下角点
     *
     *  @param{L.Latlng}point          经纬度点
     */
    Calculate25TMeshCorner: function(point) {
        return this.Calculate25TMeshCornerByMeshId(this.Calculate25TMeshId(point));
    },
    /***
     * 计算图幅角点坐标
     * @param {String}mesh
     * @returns {*}
     * @constructor
     */
    Calculate25TMeshCornerByMeshId: function(mesh) {
        var cc = mesh.split("");
        var M1 = parseInt(cc[0]);
        var M2 = parseInt(cc[1]);
        var M3 = parseInt(cc[2]);
        var M4 = parseInt(cc[3]);
        var M5 = parseInt(cc[4]);
        var M6 = parseInt(cc[5]);
        var x = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        var y = (M1 * 10 + M2) * 2400 + M5 * 300;
        var point = L.latLng(y / 3600.0, x / 3600.0);
        return point;
    },
    /***
     *  计算图幅border
     * @param {String}mesh
     * @returns {{minLon: (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng), minLat: (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat), maxLon: (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng), maxLat: (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat)}}
     * @constructor
     */
    Calculate25TMeshBorder: function(mesh) {
        var cc = mesh.split("");
        var M1 = parseInt(cc[0]);
        var M2 = parseInt(cc[1]);
        var M3 = parseInt(cc[2]);
        var M4 = parseInt(cc[3]);
        var M5 = parseInt(cc[4]);
        var M6 = parseInt(cc[5]);
        var x_conner = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        var y_conner = (M1 * 10 + M2) * 2400 + M5 * 300;
        var x_upper = x_conner + 450.0;
        var y_upper = y_conner + 300.0;
        var leftBottom = L.latLng(y_conner / 3600.0, x_conner / 3600.0);
        var rightTop = L.latLng(y_upper / 3600.0, x_upper / 3600.0);
        return {
            minLon: leftBottom.lng,
            minLat: leftBottom.lat,
            maxLon: rightTop.lng,
            maxLat: rightTop.lat
        };
    },
    /*
     *  点是否在图框上
     *
     *  @param{number}lon               经度
     *  @param{number}lat               纬度
     */
    IsAt25TMeshBorder: function(lon, lat) {
        var model = 0;
        var remainder = 0;
        var rowResult = this.CalculateIdealRowIndex(lat, remainder);
        switch (rowResult.value % 3) {
            case 0: //第一行
                {
                    if (300000 - rowResult.remainder == 12) //余数距离上框等于0.012秒
                        model |= 0x01;
                    else if (rowResult.remainder == 0) model |= 0x01;
                }
                break;
            case 1: //第二行由于上下边框均不在其内，因此不在图框上
                break;
            case 2: //第三行
                {
                    if (rowResult.remainder == 12) //余数距离下框等于0.012秒
                        model |= 0x01;
                }
                break;
        }
        var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);
        if (0 == colResult.remainder) model |= 0x10;
        return model;
    }
});
fastmap.mapApi.gridLayer = function(url, options) {
    return new fastmap.mapApi.GridLayer(url, options);
};
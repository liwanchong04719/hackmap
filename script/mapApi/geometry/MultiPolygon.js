/**
 * Created by wangtun on 2015/9/10.
 */
fastmap.mapApi.MultiPolygon = fastmap.mapApi.Collection.extend({
    options: {},
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "MultiPolygon",
    /**
     * 构造函数
     * @class MultiPolygon
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}coordinates
     * @param {Object}options
     */
    initialize: function (coordinates, options) {
        this.coordinates = coordinates;
        this.options = options;
    },
    /**
     *添加polygon到MultiPolygon
     * @method appendPolygon
     * @param {Polygon}polygon
     */
    appendPolygon: function (polygon) {
    },
    /**
     * 复制一个完全的MultiPolygon
     * @method clone
     * @returns {.mapApi.MultiPolygon}
     */
    clone: function () {
        var polygons = new fastmap.mapApi.MultiPolygon(null);
        return polygons;
    },
    /**
     * 获取最近的点
     * @method closestPointXY
     * @param {Number}x
     * @param {Number}y
     * @param {Point}closestPoint
     * @param {Number}minSquaredDistance
     */
    closestPointXY: function (x, y, closestPoint, minSquaredDistance) {

    },
    /**
     * 是否包含x,y点
     * @method containsXY
     * @param {Number}x
     * @param {Number}y
     */
    containsXY: function (x, y) {

    },
    /**
     * 获取MultiPolygon的面积
     * @method getArea
     */
    getArea: function () {

    },
    /**
     * MultiPolygon坐标组
     * @method getCoordinates
     */
    getCoordinates: function () {

    },
    /**
     * 获取MultiPolygon内环
     * @param {Number}squaredTolerance
     * @returns {.mapApi.MultiPolygon}
     */
    getSimplifiedGeometryInternal: function (squaredTolerance) {
        var simplifiedMultiPolygonString = new fastmap.mapApi.MultiPolygon(null);
        return simplifiedMultiPolygonString;
    },
    /**
     * 获取MultiPolygon中的polygon
     * @method getPolygon
     * @param {Number}index
     * @returns {L.Polygon}
     */
    getPolygon: function (index) {
        var polygon = new fastmap.mapApi.Polygon(null);
        return polygon;
    },
    /**
     * 获取MultiPolygon中的polygons
     * @method getPolygons
     * @returns {Array}
     */
    getPolygons: function () {
        var polygons = [];
        return polygons;
    },
    /**
     *相交
     * @method intersectsExtend
     * @param {Object}extend
     */
    intersectsExtent: function (extend) {

    }
});
fastmap.mapApi.multiPolygon=function(coordiates,options) {
    return new fastmap.mapApi.MultiPolygon(coordiates, options);
};

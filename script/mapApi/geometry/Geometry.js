/**
 * Geometry
 * 基于leaflet的几何基类
 *
 * @namespace mapApi
 * @class Geometry
 */
fastmap.mapApi.Geometry = L.Class.extend({
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "Geometry",

    /**
     * @method initialize
     * 初始化构造函数
     *
     */
    initialize: function () {
        this.bounds = null;
    },

    /**
     * 深度拷贝几何.
     * @method clone
     * @return {!fastmap.mapApi.Geometry} Clone.
     */
    clone: fastmap.abstractMethod,

    /**
     * 获取几何的外包框.
     * @method  getExtent
     * @param {fastmap.mapApi.Extent} opt_extent Extent.
     * @return {fastmap.mapApi.Extent} extent Extent.
     */
    getExtent: fastmap.abstractMethod,

    /**
     * 清除外包框
     */
    clearBounds: function() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }
    },

    /**
     * 通过wkt生成几何类
     * @method fromWkt
     *
     * @param {string} wkt.
     * @return {fastmap.mapApi.Geometry} geometry.
     */
    fromWkt: function (wkt) {
        return null;
    },

    /**
     * 几何类生成wkt
     * @method toWkt
     *
     * @return {string} geoJsonString.
     */
    toWkt: function () {
        return "";
    },

    /**
     * 计算两个几何之间的距离
     * @method distanceTo
     *
     * @param {fastmap.mapApi.Geometry} 用于计算距离的另外一个几何
     * @param {Object} Optional 计算距离时所需要的其他参数
     *
     * @return {Number | Object} 返回距离和相应的两个点
     */
    distanceTo: function (geometry, options) {

    }
});

/**
 * Function: OpenLayers.Geometry.fromWKT
 * Generate a geometry given a Well-Known Text string.  For this method to
 *     work, you must include the OpenLayers.Format.WKT in your build
 *     explicitly.
 *
 * Parameters:
 * wkt - {String} A string representing the geometry in Well-Known Text.
 *
 * Returns:
 * {<OpenLayers.Geometry>} A geometry of the appropriate class.
 */
fastmap.mapApi.Geometry.fromWKT = function(wkt) {
    var geom;
    if (OpenLayers.Format && OpenLayers.Format.WKT) {
        var format = OpenLayers.Geometry.fromWKT.format;
        if (!format) {
            format = new OpenLayers.Format.WKT();
            OpenLayers.Geometry.fromWKT.format = format;
        }
        var result = format.read(wkt);
        if (result instanceof OpenLayers.Feature.Vector) {
            geom = result.geometry;
        } else if (OpenLayers.Util.isArray(result)) {
            var len = result.length;
            var components = new Array(len);
            for (var i=0; i<len; ++i) {
                components[i] = result[i].geometry;
            }
            geom = new OpenLayers.Geometry.Collection(components);
        }
    }
    return geom;
};

/**
 * Method: OpenLayers.Geometry.segmentsIntersect
 * Determine whether two line segments intersect.  Optionally calculates
 *     and returns the intersection point.  This function is optimized for
 *     cases where seg1.x2 >= seg2.x1 || seg2.x2 >= seg1.x1.  In those
 *     obvious cases where there is no intersection, the function should
 *     not be called.
 *
 * Parameters:
 * seg1 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * seg2 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * options - {Object} Optional properties for calculating the intersection.
 *
 * Valid options:
 * point - {Boolean} Return the intersection point.  If false, the actual
 *     intersection point will not be calculated.  If true and the segments
 *     intersect, the intersection point will be returned.  If true and
 *     the segments do not intersect, false will be returned.  If true and
 *     the segments are coincident, true will be returned.
 * tolerance - {Number} If a non-null value is provided, if the segments are
 *     within the tolerance distance, this will be considered an intersection.
 *     In addition, if the point option is true and the calculated intersection
 *     is within the tolerance distance of an end point, the endpoint will be
 *     returned instead of the calculated intersection.  Further, if the
 *     intersection is within the tolerance of endpoints on both segments, or
 *     if two segment endpoints are within the tolerance distance of eachother
 *     (but no intersection is otherwise calculated), an endpoint on the
 *     first segment provided will be returned.
 *
 * Returns:
 * {Boolean | <OpenLayers.Geometry.Point>}  The two segments intersect.
 *     If the point argument is true, the return will be the intersection
 *     point or false if none exists.  If point is true and the segments
 *     are coincident, return will be true (and the instersection is equal
 *     to the shorter segment).
 */
fastmap.mapApi.Geometry.segmentsIntersect = function(seg1, seg2, options) {
    var point = options && options.point;
    var tolerance = options && options.tolerance;
    var intersection = false;
    var x11_21 = seg1.x1 - seg2.x1;
    var y11_21 = seg1.y1 - seg2.y1;
    var x12_11 = seg1.x2 - seg1.x1;
    var y12_11 = seg1.y2 - seg1.y1;
    var y22_21 = seg2.y2 - seg2.y1;
    var x22_21 = seg2.x2 - seg2.x1;
    var d = (y22_21 * x12_11) - (x22_21 * y12_11);
    var n1 = (x22_21 * y11_21) - (y22_21 * x11_21);
    var n2 = (x12_11 * y11_21) - (y12_11 * x11_21);
    if(d == 0) {
        // parallel
        if(n1 == 0 && n2 == 0) {
            // coincident
            intersection = true;
        }
    } else {
        var along1 = n1 / d;
        var along2 = n2 / d;
        if(along1 >= 0 && along1 <= 1 && along2 >=0 && along2 <= 1) {
            // intersect
            if(!point) {
                intersection = true;
            } else {
                // calculate the intersection point
                var x = seg1.x1 + (along1 * x12_11);
                var y = seg1.y1 + (along1 * y12_11);
                intersection = new fastmap.mapApi.Point(x, y);
            }
        }
    }
    if(tolerance) {
        var dist;
        if(intersection) {
            if(point) {
                var segs = [seg1, seg2];
                var seg, x, y;
                // check segment endpoints for proximity to intersection
                // set intersection to first endpoint within the tolerance
                outer: for(var i=0; i<2; ++i) {
                    seg = segs[i];
                    for(var j=1; j<3; ++j) {
                        x = seg["x" + j];
                        y = seg["y" + j];
                        dist = Math.sqrt(
                                Math.pow(x - intersection.x, 2) +
                                Math.pow(y - intersection.y, 2)
                        );
                        if(dist < tolerance) {
                            intersection.x = x;
                            intersection.y = y;
                            break outer;
                        }
                    }
                }

            }
        } else {
            // no calculated intersection, but segments could be within
            // the tolerance of one another
            var segs = [seg1, seg2];
            var source, target, x, y, p, result;
            // check segment endpoints for proximity to intersection
            // set intersection to first endpoint within the tolerance
            outer: for(var i=0; i<2; ++i) {
                source = segs[i];
                target = segs[(i+1)%2];
                for(var j=1; j<3; ++j) {
                    p = {x: source["x"+j], y: source["y"+j]};
                    result = fastmap.mapApi.Geometry.distanceToSegment(p, target);
                    if(result.distance < tolerance) {
                        if(point) {
                            intersection = new fastmap.mapApi.Point(p.x, p.y);
                        } else {
                            intersection = true;
                        }
                        break outer;
                    }
                }
            }
        }
    }
    return intersection;
};

/**
 * Function: OpenLayers.Geometry.distanceToSegment
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with distance, along, x, and y properties.  The distance
 *     will be the shortest distance between the input point and segment.
 *     The x and y properties represent the coordinates along the segment
 *     where the shortest distance meets the segment. The along attribute
 *     describes how far between the two segment points the given point is.
 */
fastmap.mapApi.Geometry.distanceToSegment = function(point, segment) {
    var result = fastmap.mapApi.Geometry.distanceSquaredToSegment(point, segment);
    result.distance = Math.sqrt(result.distance);
    return result;
};

/**
 * Function: OpenLayers.Geometry.distanceSquaredToSegment
 *
 * Usually the distanceToSegment function should be used. This variant however
 * can be used for comparisons where the exact distance is not important.
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with squared distance, along, x, and y properties.
 *     The distance will be the shortest distance between the input point and
 *     segment. The x and y properties represent the coordinates along the
 *     segment where the shortest distance meets the segment. The along
 *     attribute describes how far between the two segment points the given
 *     point is.
 */
fastmap.mapApi.Geometry.distanceSquaredToSegment = function(point, segment) {
    var x0 = point.x;
    var y0 = point.y;
    var x1 = segment.x1;
    var y1 = segment.y1;
    var x2 = segment.x2;
    var y2 = segment.y2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
        (Math.pow(dx, 2) + Math.pow(dy, 2));
    var x, y;
    if(along <= 0.0) {
        x = x1;
        y = y1;
    } else if(along >= 1.0) {
        x = x2;
        y = y2;
    } else {
        x = x1 + along * dx;
        y = y1 + along * dy;
    }
    return {
        distance: Math.pow(x - x0, 2) + Math.pow(y - y0, 2),
        x: x, y: y,
        along: along
    };
};

fastmap.mapApi.geometry=function() {
    return new fastmap.mapApi.Geometry();
};

/**
 * Created by wangtun on 2015/9/10.
 * Polygon 对象
 * @namespace fast.mapApi
 * @class Polygon
 */
fastmap.mapApi.Polygon = fastmap.mapApi.Collection.extend({
    type: "Polygon",
    components: [],
    options: {},
    /**
     * 构造函数
     * @class Polygon
     * @constructor
     * @param {Array}components
     * @param {Object}options
     */
    initialize: function (components, options) {
        this.components = components;
        this.options = options;
    },
    /**
     * 获取面积
     * @method getArea
     * @returns {number}
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getArea());
            for (var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getArea());
            }
        }
        return area;
    },
    /**
     * 是否包含某点
     * @method containsPoint
     * @param {Point}point
     * @returns {boolean}
     */
    containsPoint: function (point) {
        var numRings = this.components.length;
        var contained = false;
        if(numRings > 0) {
            // check exterior ring - 1 means on edge, boolean otherwise
            contained = this.components[0].containsPoint(point);
            if(contained !== 1) {
                if(contained && numRings > 1) {
                    // check interior rings
                    var hole;
                    for(var i=1; i<numRings; ++i) {
                        hole = this.components[i].containsPoint(point);
                        if(hole) {
                            if(hole === 1) {
                                // on edge
                                contained = 1;
                            } else {
                                // in hole
                                contained = false;
                            }
                            break;
                        }
                    }
                }
            }
        }
        return contained;
    },
    /**
     * 相交
     * @method intersects
     * @param {Geometry}geometry
     * @returns {boolean}
     */
    intersects: function (geometry) {
        var intersect = false;
        var i, len;
        if(geometry.type == "Point") {
            intersect = this.containsPoint(geometry);
        } else if(geometry.type == "LineString" ||
            geometry.type == "LinearRing") {
            // check if rings/linestrings intersect
            for(i=0, len=this.components.length; i<len; ++i) {
                intersect = geometry.intersects(this.components[i]);
                if(intersect) {
                    break;
                }
            }
            if(!intersect) {
                // check if this poly contains points of the ring/linestring
                for(i=0, len=geometry.components.length; i<len; ++i) {
                    intersect = this.containsPoint(geometry.components[i]);
                    if(intersect) {
                        break;
                    }
                }
            }
        } else {
            for(i=0, len=geometry.components.length; i<len; ++ i) {
                intersect = this.intersects(geometry.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        // check case where this poly is wholly contained by another
        if(!intersect && geometry.type == "Polygon") {
            // exterior ring points will be contained in the other geometry
            var ring = this.components[0];
            for(i=0, len=ring.components.length; i<len; ++i) {
                intersect = geometry.containsPoint(ring.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        return intersect;
    },
    /**
     * 获取到polygon最近的点
     * @method distanceTo
     * @param {Geometry}geometry
     * @param {Object}options
     * @returns {*}
     */
    distanceTo: function (geometry, options) {
        var edge = !(options && options.edge === false);
        var result;
        // this is the case where we might not be looking for distance to edge
        if(!edge && this.intersects(geometry)) {
            result = 0;
        } else {
            result = fastmap.mapApi.Collection.prototype.distanceTo.apply(
                this, [geometry, options]
            );
        }
        return result;
    },
    /**
     * 复制完整的Polygon
     * @method Polygon
     * @returns {.mapApi.Polygon}
     */
    clone: function () {
        var polygon = new fastmap.mapApi.Polygon(null);
        return polygon;
    },
    /**
     * 获取多少为小数
     * @param num
     * @param sig
     * @returns {number}
     */
    limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    }
});
fastmap.mapApi.polygon=function(components,options) {
    return new fastmap.mapApi.Polygon(components, options);
};

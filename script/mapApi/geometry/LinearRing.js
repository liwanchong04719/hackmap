/**
 * Created by liwanchong on 2015/9/8.
 * LinearRing对象
 * @namespace fast.mapApi
 * @class LinearRing
 */
fastmap.mapApi.LinearRing = fastmap.mapApi.LineString.extend({
    options: {},
    components: [],

    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "LinearRing",

    /**
     * 构造函数
     * @class LinearRing
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}components
     * @param {Object}options
     */
    initialize: function (components, options) {
        this.components = components;
        this.options = options;
    },
    /**
     *  在geometry中添加点
     *  @method addComponent
     * @param point
     * @param index
     * @returns {boolean}
     */
    addComponent: function (point, index) {
        var added = false;

        //remove last point
        var lastPoint = this.components.pop();

        // given an index, add the point
        // without an index only add non-duplicate points
        if (index != null || !point.equals(lastPoint)) {
            added = fastmap.mapApi.Collection.prototype.addComponent.apply(this,
                arguments);
        }

        //append copy of first point
        var firstPoint = this.components[0];
        fastmap.mapApi.Collection.prototype.addComponent.apply(this,
            [firstPoint]);

        return added;
    },
    /**
     * 删除geometry中的点
     * @method removeComponent
     * @param point
     * @returns {Array}
     */
    removeComponent: function (point) {
        var removed = this.components && (this.components.length > 3);
        if (removed) {
            //remove last point
            this.components.pop();

            //remove our point
            fastmap.mapApi.Collection.prototype.removeComponent.apply(this,
                arguments);
            //append copy of first point
            var firstPoint = this.components[0];
            fastmap.mapApi.Collection.prototype.addComponent.apply(this,
                [firstPoint]);
        }
        return removed;
    },
    /**
     * 根据x,y的值移动geometry
     * @method move
     * @param x
     * @param y
     */
    move: function (x, y) {
        for (var i = 0, len = this.components.length; i < len - 1; i++) {
            this.components[i].move(x, y);
        }
    },

    rotate: function (angle, origin) {
        for (var i = 0, len = this.components.length; i < len - 1; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },
    /**
     * 调整geometry的大小
     * @method resize
     * @param scale
     * @param origin
     * @param ratio
     * @returns {fastmap.mapApi.LinearRing}
     */
    resize: function (scale, origin, ratio) {
        for (var i = 0, len = this.components.length; i < len - 1; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },

    transform: function (source, dest) {
        if (source && dest) {
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },

    /**
     * 获取中心点坐标
     * @method getCentroid
     */
    getCentroid: function () {
        if (this.components) {
            var len = this.components.length;
            if (len > 0 && len <= 2) {
                return this.components[0].clone();
            } else if (len > 2) {
                var sumX = 0.0;
                var sumY = 0.0;
                var x0 = this.components[0].x;
                var y0 = this.components[0].y;
                var area = -1 * this.getArea();
                if (area != 0) {
                    for (var i = 0; i < len - 1; i++) {
                        var b = this.components[i];
                        var c = this.components[i + 1];
                        sumX += (b.x + c.x - 2 * x0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                        sumY += (b.y + c.y - 2 * y0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                    }
                    var x = x0 + sumX / (6 * area);
                    var y = y0 + sumY / (6 * area);
                } else {
                    for (var i = 0; i < len - 1; i++) {
                        sumX += this.components[i].x;
                        sumY += this.components[i].y;
                    }
                    var x = sumX / (len - 1);
                    var y = sumY / (len - 1);
                }
                return new OpenLayers.Geometry.Point(x, y);
            } else {
                return null;
            }
        }
    },
    /**
     * geometry面积
     * @method getArea
     * @returns {number}
     */
    getArea: function () {
        var area = 0.0;
        if (this.components && (this.components.length > 2)) {
            var sum = 0.0;
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                var b = this.components[i];
                var c = this.components[i + 1];
                sum += (b.x + c.x) * (c.y - b.y);
            }
            area = -sum / 2.0;
        }
        return area;
    },
    /**
     * 获取geometry 周长
     * @method getGeodesicLength
     * @param projection
     * @returns {number}
     */
    getGeodesicLength: function (projection) {
        var length = 0.0;
        return length;
    },
    /**
     * 获取一份完整的LinearRing
     * @returns {fastmap.mapApi.LinearRing}
     */
    clone: function () {
        var linearRing = new fastmap.mapApi.LinearRing(null);
        return linearRing;
    },
    limitSigDigs: function (num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    /**
     * 是否包含某点
     * @method containsPoint
     * @param point
     * @returns {boolean}
     */
    containsPoint: function (point) {
        var digs = 14;
        var px = this.limitSigDigs(point.x, digs);
        var py = this.limitSigDigs(point.y, digs);

        function getX(y, x1, y1, x2, y2) {
            return (y - y2) * ((x2 - x1) / (y2 - y1)) + x2;
        }

        var numSeg = this.components.length - 1;
        var start, end, x1, y1, x2, y2, cx, cy;
        var crosses = 0;
        for (var i = 0; i < numSeg; ++i) {
            start = this.components[i];
            x1 = this.limitSigDigs(start.x?start.x:start[0], digs);
            y1 = this.limitSigDigs(start.y?start.y:start[1], digs);
            end = this.components[i + 1];
            x2 = this.limitSigDigs(end.x?end.x:end[0], digs);
            y2 = this.limitSigDigs(end.y?end.y:end[1], digs);

            /**
             * The following conditions enforce five edge-crossing rules:
             *    1. points coincident with edges are considered contained;
             *    2. an upward edge includes its starting endpoint, and
             *    excludes its final endpoint;
             *    3. a downward edge excludes its starting endpoint, and
             *    includes its final endpoint;
             *    4. horizontal edges are excluded; and
             *    5. the edge-ray intersection point must be strictly right
             *    of the point P.
             */
            if (y1 == y2) {
                // horizontal edge
                if (py == y1) {
                    // point on horizontal line
                    if (x1 <= x2 && (px >= x1 && px <= x2) || // right or vert
                        x1 >= x2 && (px <= x1 && px >= x2)) { // left or vert
                        // point on edge
                        crosses = -1;
                        break;
                    }
                }
                // ignore other horizontal edges
                continue;
            }
            cx = this.limitSigDigs(getX(py, x1, y1, x2, y2), digs);
            if (cx == px) {
                // point on line
                if (y1 < y2 && (py >= y1 && py <= y2) || // upward
                    y1 > y2 && (py <= y1 && py >= y2)) { // downward
                    // point on edge
                    crosses = -1;
                    break;
                }
            }
            if (cx <= px) {
                // no crossing to the right
                continue;
            }
            if (x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
                // no crossing
                continue;
            }
            if (y1 < y2 && (py >= y1 && py < y2) || // upward
                y1 > y2 && (py < y1 && py >= y2)) { // downward
                ++crosses;
            }
        }
        var contained = (crosses == -1) ?
            // on edge
            1 :
            // even (out) or odd (in)
            !!(crosses & 1);

        return contained;
    },
    /**
     * 相交
     * @method intersects
     * @param geometry
     * @returns {boolean}
     */
    intersects: function (geometry) {
        var intersect = false;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            intersect = geometry.intersects(this);
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            intersect = OpenLayers.Geometry.LineString.prototype.intersects.apply(
                this, [geometry]
            );
        } else {
            // check for component intersections
            for (var i = 0, len = geometry.components.length; i < len; ++i) {
                intersect = geometry.components[i].intersects(this);
                if (intersect) {
                    break;
                }
            }
        }
        return intersect;
    },
    /**
     * 是否获取geometry的坐标串
     * @method getVertices
     * @param nodes
     */
    getVertices: function (nodes) {
        return (nodes === true) ? [] : this.components.slice(0, this.components.length - 1);
    }
})
fastmap.mapApi.linearRing = function (coordiates, options) {
    return new fastmap.mapApi.LinearRing(coordiates, options);
};


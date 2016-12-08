/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.LineSegment = L.Class.extend({

    initialize: function (start, end) {
        if (start !== undefined) {
            this.start = start.clone();
        } else {
            this.start = new fastmap.mapApi.symbol.Point();
        }

        if (end !== undefined) {
            this.end = end.clone();
        } else {
            this.end = new fastmap.mapApi.symbol.Point();
        }
    },

    /**
     * 克隆对象
     * @method clone
     * @return fastmap.mapApi.symbol.LineSegment 克隆的对象
     */
    clone: function () {
        var cloneLineSegment = new fastmap.mapApi.symbol.LineSegment(this.start, this.end);
        return cloneLineSegment;
    },

    /**
     * 计算线段长度
     * @method length
     * @return Number 线段长度
     */
    length: function () {
        return this.start.distance(this.end);
    },

    /**
     * 计算线段指定长度处的点
     * 当指定长度小于等于0时，返回start.clone
     * 当指定长度大于或等于两点之间总长度时，返回end.clone
     * @method getPointByLength
     * @param length 要切分的长度
     * @return Point 坐标点
     */
    getPointByLength: function (length) {
        if (length <= 0) {
            return this.start.clone();
        }

        var lineLength = this.length();

        if (length >= lineLength) {
            return this.end.clone();
        }

        var vector = this.end.minus(this.start);
        vector.normalize();

        vector = vector.multiNumber(length);

        var point = this.start.plusVector(vector);

        return point;
    },

});

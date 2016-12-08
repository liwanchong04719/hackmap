/**
 * Created by xujie on 2016/5/11 0011.
 */
fastmap.mapApi.symbol.Point = L.Class.extend({

    initialize: function (x, y) {
        if (x === undefined) {
            this.x = 0;
        } else {
            this.x = x;
        }

        if (y === undefined) {
            this.y = 0;
        } else {
            this.y = y;
        }
    },

    /**
     * 克隆对象
     * @method clone
     * @return fastmap.mapApi.symbol.Point 克隆的对象
     */
    clone: function () {
        var clonePt = new fastmap.mapApi.symbol.Point();
        clonePt.x = this.x;
        clonePt.y = this.y;

        return clonePt;
    },

    /**
     * 计算当前点与目标点之间的距离
     * @method distance
     * @param p
     * @return Number 当前点与目标点之间的距离
     */
    distance: function (p) {
        return Math.sqrt((this.x - p.x ) * (this.x - p.x ) + (this.y - p.y ) * (this.y - p.y ));
    },

    /**
     * 计算p到当前点的向量
     * @method minus
     * @param p
     * @return fastmap.mapApi.symbol.Vector 计算p到当前点的向量
     */
    minus: function (p) {
        var x = this.x - p.x;
        var y = this.y - p.y;
        return new fastmap.mapApi.symbol.Vector(x, y);
    },

    /**
     * 叉乘矩阵变换坐标
     * 主要用于点平移，旋转，缩放等操作
     * @method crossMatrix
     * @param m
     * @return fastmap.mapApi.symbol.Point 变换之后的坐标
     */
    crossMatrix: function (m) {
        var tmpVec = [this.x, this.y, 1];
        var newVec = new fastmap.mapApi.symbol.Point(0, 0);
        newVec.x = tmpVec[0] * m.data[0][0] + tmpVec[1] * m.data[1][0] + tmpVec[2] * m.data[2][0];
        newVec.y = tmpVec[0] * m.data[0][1] + tmpVec[1] * m.data[1][1] + tmpVec[2] * m.data[2][1];

        return newVec;
    },

    /**
     * 判断两个点坐标是否相等
     * @method equal
     * @param p
     * @return {boolean}
     */
    equal: function (p) {
        if (this.x !== p.x) {
            return false;
        }

        if (this.y !== p.y) {
            return false;
        }

        return true;
    },

    /**
     * 定义点和向量的加法
     * 返回结果为点
     * 代表的几何意义是将点按照向量平移
     * @method plusVector
     * @param v
     * @return fastmap.mapApi.symbol.Point
     */
    plusVector: function (v) {
        var point = new fastmap.mapApi.symbol.Point();
        point.x = this.x + v.x;
        point.y = this.y + v.y;

        return point;
    }
});
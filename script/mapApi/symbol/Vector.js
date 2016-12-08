/**
 * Created by xujie on 2016/5/11 0011.
 */
fastmap.mapApi.symbol.Vector = L.Class.extend({

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
     * 向量减法
     * 返回结果为向量
     * @method minus
     * @param v
     * @return fastmap.mapApi.symbol.Vector
     */
    minus: function (v) {
        var x = this.x - v.x;
        var y = this.y - v.y;
        return new fastmap.mapApi.symbol.Vector(x, y);
    },

    /**
     * 向量加法
     * 返回结果为向量
     * @method plus
     * @param v
     * @return fastmap.mapApi.symbol.Vector
     */
    plus: function (v) {
        var x = this.x + v.x;
        var y = this.y + v.y;
        return new fastmap.mapApi.symbol.Vector(x, y);
    },

    /**
     * 向量和数字的乘法
     * 返回结果为向量
     * @method multiNumber
     * @param n
     * @return fastmap.mapApi.symbol.Vector
     */
    multiNumber: function (n) {
        var x = this.x * n;
        var y = this.y * n;
        return new fastmap.mapApi.symbol.Vector(x, y);
    },

    /**
     * 向量和数字的除法
     * 返回结果为向量
     * @method dividNumber
     * @param n
     * @return fastmap.mapApi.symbol.Vector
     */
    dividNumber: function (n) {
        var x = this.x / n;
        var y = this.y / n;
        return new fastmap.mapApi.symbol.Vector(x, y);
    },

    /**
     * 向量和向量的叉乘
     * 返回结果为叉乘结果的模长
     * 符号表示方向，符号为正表示与Z同向，否则反向
     * @method cross
     * @param v
     * @return Number
     */
    cross: function (v) {
        return this.x * v.y - this.y * v.x;
    },

    /**
     * 向量和向量的点积
     * 返回结果为数字
     * @method dot
     * @param v
     * @return Number
     */
    dot: function (v) {
        return this.x * v.x + this.y * v.y;
    },

    /**
     * 向量模长的平方
     * 返回结果为数字
     * @method length2
     * @return Number
     */
    length2: function () {
        return this.x * this.x + this.y * this.y;
    },

    /**
     * 向量模长
     * 返回结果为数字
     * @method length
     * @return Number
     */
    length: function () {
        return Math.sqrt(this.length2());
    },

    /**
     * 单位化向量
     * @method normalize
     */
    normalize: function () {
        var length = this.length();
        this.x = this.x / length;
        this.y = this.y / length;
    },

    /**
     * 向量和矩阵的叉乘
     * 返回结果为向量
     * 主要用于对向量进行平移，旋转，缩放等操作
     * @method crossMatrix
     * @param m
     * @return fastmap.mapApi.symbol.Vector
     */
    crossMatrix: function (m) {
        var tmpVec = [this.x, this.y, 1];
        var newVec = new fastmap.mapApi.symbol.Vector(0, 0);
        newVec.x = tmpVec[0] * m.data[0][0] + tmpVec[1] * m.data[1][0] + tmpVec[2] * m.data[2][0];
        newVec.y = tmpVec[0] * m.data[0][1] + tmpVec[1] * m.data[1][1] + tmpVec[2] * m.data[2][1];

        return newVec;
    },

    /**
     * 求向量之间的夹角
     * 返回结果为角度，单位度
     * @method angleTo
     * @param v
     * @return Number
     */
    angleTo: function (v) {
        var cos = this.dot(v) / (this.length() * v.length());
        var arcA = Math.acos(cos);

        return arcA * 180 / Math.PI;
    }
});
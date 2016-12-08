/**
 * Created by xujie on 2016/5/13 0013.
 */
fastmap.mapApi.symbol.Matrix = L.Class.extend({

    initialize: function () {
        this.data = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    },

    cross: function (other) {
        var m = new fastmap.mapApi.symbol.Matrix();

        m.data[0][0] = this.data[0][0] * other.data[0][0] + this.data[0][1] * other.data[1][0] + this.data[0][2] * other.data[2][0];
        m.data[0][1] = this.data[0][0] * other.data[0][1] + this.data[0][1] * other.data[1][1] + this.data[0][2] * other.data[2][1];
        m.data[0][2] = this.data[0][0] * other.data[0][2] + this.data[0][1] * other.data[1][2] + this.data[0][2] * other.data[2][2];

        m.data[1][0] = this.data[1][0] * other.data[0][0] + this.data[1][1] * other.data[1][0] + this.data[1][2] * other.data[2][0];
        m.data[1][1] = this.data[1][0] * other.data[0][1] + this.data[1][1] * other.data[1][1] + this.data[1][2] * other.data[2][1];
        m.data[1][2] = this.data[1][0] * other.data[0][2] + this.data[1][1] * other.data[1][2] + this.data[1][2] * other.data[2][2];

        m.data[2][0] = this.data[2][0] * other.data[0][0] + this.data[2][1] * other.data[1][0] + this.data[2][2] * other.data[2][0];
        m.data[2][1] = this.data[2][0] * other.data[0][1] + this.data[2][1] * other.data[1][1] + this.data[2][2] * other.data[2][1];
        m.data[2][2] = this.data[2][0] * other.data[0][2] + this.data[2][1] * other.data[1][2] + this.data[2][2] * other.data[2][2];

        return m;
    },

    makeTranslate: function (x, y) {
        var m = new fastmap.mapApi.symbol.Matrix();

        m.data[0][0] = 1;
        m.data[0][1] = 0;
        m.data[0][2] = 0;

        m.data[1][0] = 0;
        m.data[1][1] = 1;
        m.data[1][2] = 0;

        m.data[2][0] = x;
        m.data[2][1] = y;
        m.data[2][2] = 1;

        return m;
    },

    makeRotate: function (a) {
        var arca = (Math.PI / 180) * a;
        var m = new fastmap.mapApi.symbol.Matrix();

        m.data[0][0] = Math.cos(arca);
        m.data[0][1] = Math.sin(arca);
        m.data[0][2] = 0;

        m.data[1][0] = -Math.sin(arca);
        m.data[1][1] = Math.cos(arca);
        m.data[1][2] = 0;

        m.data[2][0] = 0;
        m.data[2][1] = 0;
        m.data[2][2] = 1;

        return m;
    },

    makeScale: function (sx, sy) {
        var m = new fastmap.mapApi.symbol.Matrix();

        m.data[0][0] = sx;
        m.data[0][1] = 0;
        m.data[0][2] = 0;

        m.data[1][0] = 0;
        m.data[1][1] = sy;
        m.data[1][2] = 0;

        m.data[2][0] = 0;
        m.data[2][1] = 0;
        m.data[2][2] = 1;

        return m;
    }
});
/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.SolidCirclePointSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'SolidCirclePointSymbol';

        this.radius = 10;
        this.color = '#000000';

        this.offsetX = 0;
        this.offsetY = 0;

        this.hasOutLine = false;
        this.outLineColor = '#000000';
        this.outLineWidth = 1;
        this.geometry = null;

        this.translate = [];
    },

    draw: function (ctx) {
        if (this.geometry === null) {
            return;
        }

        this.translate = this.getTranslate();

        //绘制前，先恢复到上次保存的状态，通常是初始状态，避免受到以前绘制设置的影响
        ctx.restore();

        //保存一下当前状态，方便绘制完成后恢复状态
        ctx.save();

        this.drawCircle(ctx);

        //绘制完成后恢复到上次保存的状态，通常是初始状态，避免影响以后的绘制
        ctx.restore();
    },

    getTranslate: function () {
        var translates = [];
        var matrix = new fastmap.mapApi.symbol.Matrix();
        translates.push(matrix.makeTranslate(this.offsetX, this.offsetY));

        return translates;
    },

    transform: function (geometry) {
        for (var i = 0; i < this.translate.length; ++i) {
            geometry = geometry.crossMatrix(this.translate[i]);
        }

        return geometry;
    },

    drawCircle: function (ctx) {
        ctx.fillStyle = this.color;

        var geometry = this.transform(this.geometry);

        ctx.beginPath();
        ctx.arc(geometry.x, geometry.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();

        if (this.hasOutLine) {
            ctx.lineWidth = this.outLineWidth;
            ctx.strokeStyle = this.outLineColor;
            ctx.stroke();
        }
    }
});

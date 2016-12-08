/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.SolidSquarePointSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'SolidSquarePointSymbol';

        this.size = 10;
        this.color = '#000000';

        this.offsetX = 0;
        this.offsetY = 0;

        this.angle = 0;

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

        this.drawSquare(ctx);

        //绘制完成后恢复到上次保存的状态，通常是初始状态，避免影响以后的绘制
        ctx.restore();
    },

    getTranslate: function () {
        var translates = [];
        var matrix = new fastmap.mapApi.symbol.Matrix();
        translates.push(matrix.makeTranslate(-this.geometry.x, -this.geometry.y));
        translates.push(matrix.makeRotate(this.angle));
        translates.push(matrix.makeTranslate(this.offsetX, this.offsetY));
        translates.push(matrix.makeTranslate(this.geometry.x, this.geometry.y));

        return translates;
    },

    transform: function (geometry) {
        for (var i = 0; i < this.translate.length; ++i) {
            geometry = geometry.crossMatrix(this.translate[i]);
        }

        return geometry;
    },

    drawSquare: function (ctx) {
        ctx.fillStyle = this.color;

        var geometry = this.getSquareGeometry();

        for (var i = 0; i < geometry.coordinates.length; ++i) {
            geometry.coordinates[i] = this.transform(geometry.coordinates[i]);
        }

        ctx.beginPath();
        ctx.moveTo(geometry.coordinates[0].x, geometry.coordinates[0].y);
        for (var i = 1; i < geometry.coordinates.length; ++i) {
            ctx.lineTo(geometry.coordinates[i].x, geometry.coordinates[i].y);
        }
        ctx.fill();

        if (this.hasOutLine) {
            ctx.lineWidth = this.outLineWidth;
            ctx.strokeStyle = this.outLineColor;
            ctx.stroke();
        }
    },

    getSquareGeometry: function () {
        var squareGeometry = new fastmap.mapApi.symbol.LineString;
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(this.geometry.x - this.size, this.geometry.y - this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(this.geometry.x + this.size, this.geometry.y - this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(this.geometry.x + this.size, this.geometry.y + this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(this.geometry.x - this.size, this.geometry.y + this.size));
        squareGeometry.coordinates.push(new fastmap.mapApi.symbol.Point(this.geometry.x - this.size, this.geometry.y - this.size));

        return squareGeometry;
    }
});

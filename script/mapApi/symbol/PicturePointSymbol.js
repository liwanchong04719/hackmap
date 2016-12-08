/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.PicturePointSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'PicturePointSymbol';

        this.image = null;
        this.size = 10;

        this.offsetX = 0;
        this.offsetY = 0;

        this.angle = 0;

        this.hasOutLine = false;
        this.outLineColor = '#000000';
        this.outLineWidth = 1;
        this.geometry = null;
    },

    draw: function (ctx) {
        if (this.geometry === null) {
            return;
        }

        if (this.image === null) {
            return;
        }

        //绘制前，先恢复到上次保存的状态，通常是初始状态，避免受到以前绘制设置的影响
        ctx.restore();

        //保存一下当前状态，方便绘制完成后恢复状态
        ctx.save();

        this.drawPicture(ctx);

        //绘制完成后恢复到上次保存的状态，通常是初始状态，避免影响以后的绘制
        ctx.restore();
    },

    drawPicture: function (ctx) {
        ctx.resetTransform();
        ctx.translate(this.geometry.x, this.geometry.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(this.offsetX, this.offsetY);
        ctx.translate(-this.geometry.x, -this.geometry.y);
        ctx.drawImage(this.image, this.geometry.x - this.size, this.geometry.y - this.size, 2 * this.size, 2 * this.size);

        if (this.hasOutLine) {
            ctx.lineWidth = this.outLineWidth;
            ctx.strokeStyle = this.outLineColor;

            var squareGeometry = this.getSquareGeometry();

            ctx.beginPath();
            ctx.moveTo(squareGeometry.coordinates[0].x, squareGeometry.coordinates[0].y);
            for (var i = 1; i < squareGeometry.coordinates.length; ++i) {
                ctx.lineTo(squareGeometry.coordinates[i].x, squareGeometry.coordinates[i].y);
            }

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

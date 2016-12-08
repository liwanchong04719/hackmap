/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.MarkerLineSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'MarkerLineSymbol';

        this.url = '';
        this.markerSymbol = null;
        this.template = new fastmap.mapApi.symbol.Template();
        this.geometry = [];
    },

    draw: function (ctx) {
        if (this.geometry.length < 2) {
            return;
        }

        if (this.markerSymbol === null) {
            return;
        }

        if (this.url === '') {
            return;
        }

        if (this.template === null) {
            return;
        }

        if (this.template.pattern.length === 0) {
            return;
        }

        if (this.markerSymbol.type === 'PicturePointSymbol') {
            var img = new Image();

            img.userData = this;
            img.geometry = this.geometry;
            //图片准备好之后再绘制
            img.onload = function () {
                this.userData.markerSymbol.image = this;
                this.userData.innerDraw(ctx, this.geometry);
            };
            img.src = this.url;
        } else {
            this.innerDraw(ctx, this.geometry);
        }
    },

    innerDraw: function (ctx, geometry) {
        //绘制前，先恢复到上次保存的状态，通常是初始状态，避免受到以前绘制设置的影响
        ctx.restore();

        //保存一下当前状态，方便绘制完成后恢复状态
        ctx.save();

        this.template.lineString = geometry;
        var segments = this.template.getSegments();

        ctx.beginPath();
        for (var i = 0; i < segments.length; ++i) {
            this.drawSegment(ctx, segments[i]);
        }
        ctx.stroke();

        //绘制完成后恢复到上次保存的状态，通常是初始状态，避免影响以后的绘制
        ctx.restore();
    },

    drawSegment: function (ctx, segment) {
        var marks = this.template.getMarks(segment);
        for (var i = 0; i < marks.length; ++i) {
            var vY = new fastmap.mapApi.symbol.Vector(0, -1);
            var vN = marks[0].coordinates[1].minus(marks[0].coordinates[0]);

            var angle = vY.angleTo(vN);
            var signal = vY.cross(vN);

            if (signal < 0) {
                angle = -angle;
            }

            this.drawMark(ctx, angle, marks[i]);
        }
    },

    drawMark: function (ctx, angle, mark) {
        this.markerSymbol.angle = angle;
        this.markerSymbol.geometry = mark.coordinates[0];
        this.markerSymbol.draw(ctx);
    }
});

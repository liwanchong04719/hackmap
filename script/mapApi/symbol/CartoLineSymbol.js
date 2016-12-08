/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.CartoLineSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'CartoLineSymbol';
        this.width = 1;
        this.color = '#000000';
        this.template = new fastmap.mapApi.symbol.Template();
        this.geometry = [];
    },

    draw: function (ctx) {
        if (this.geometry.length < 2) {
            return;
        }

        if (this.template === null) {
            return;
        }

        //绘制前，先恢复到上次保存的状态，通常是初始状态，避免受到以前绘制设置的影响
        ctx.restore();

        //保存一下当前状态，方便绘制完成后恢复状态
        ctx.save();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;

        this.template.lineString = this.geometry;
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
            this.drawMark(ctx, marks[i]);
        }
    },

    drawMark: function (ctx, mark) {
        ctx.moveTo(mark.coordinates[0].x, mark.coordinates[0].y);
        for (var i = 1; i < mark.coordinates.length; ++i) {
            ctx.lineTo(mark.coordinates[i].x, mark.coordinates[i].y);
        }
    }
});

/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.SampleLineSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'SampleLineSymbol';

        this.width = 1;
        this.color = '#000000';
        this.style = 'solid';
        this.geometry = [];
    },

    draw: function (ctx) {
        if (this.geometry.length < 2) {
            return;
        }

        //绘制前，先恢复到上次保存的状态，通常是初始状态，避免受到以前绘制设置的影响
        ctx.restore();

        //保存一下当前状态，方便绘制完成后恢复状态
        ctx.save();

        var dashPattern = this.styleToPattern(this.style);
        ctx.setLineDash(dashPattern);//设置虚线样式
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.geometry.coordinates[0].x, this.geometry.coordinates[0].y);
        for (var i = 1; i < this.geometry.coordinates.length; ++i) {
            ctx.lineTo(this.geometry.coordinates[i].x, this.geometry.coordinates[i].y);
        }
        ctx.stroke();

        //绘制完成后恢复到上次保存的状态，通常是初始状态，避免影响以后的绘制
        ctx.restore();
    },

    styleToPattern: function (style) {
        var dashPattern = [];
        switch (style) {
            case 'solid':
                dashPattern = [];
                break;
            case 'dash':
                dashPattern = [10, 5];
                break;
            case 'dot':
                dashPattern = [2, 2];
                break;
            case 'dashDot':
                dashPattern = [10, 2, 2, 2];
                break;
            case 'dashDotDot':
                dashPattern = [10, 2, 2, 2, 2, 2];
                break;
            default:
                dashPattern = [];
                break;
        }

        return dashPattern;
    }
});

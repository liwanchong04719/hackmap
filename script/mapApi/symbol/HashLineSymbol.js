/**
 * Created by xujie on 2016/5/11 0011.
 */
fastmap.mapApi.symbol.HashLineSymbol = L.Class.extend({

    initialize: function () {
        this.type = 'HashLineSymbol';

        this.hashHeight = 10;
        this.hashOffset = 0;
        this.hashAngle = -90;
        this.hashSymbol = null;
        this.template = new fastmap.mapApi.symbol.Template();
        this.template.pattern = [2, 5];
        this.geometry = [];
    },

    draw: function (ctx) {
        if (this.geometry.length < 2) {
            return;
        }

        if (this.hashSymbol === null) {
            return;
        }

        if (this.template === null) {
            return;
        }

        if (this.template.pattern.length === 0) {
            return;
        }

        this.template.lineString = this.geometry;

        var segments = this.template.getSegments();

        for (var i = 0; i < segments.length; ++i) {
            this.drawSegment(ctx, segments[i]);
        }
    },

    drawSegment: function (ctx, segment) {
        var marks = this.template.getMarks(segment);
        for (var i = 0; i < marks.length; ++i) {
            var mark = marks[i];

            //以mark的前两个点构造向量
            var vector = mark.coordinates[1].minus(mark.coordinates[0]);
            vector.normalize();

            //将向量顺时针旋转指定角度
            var matrix = new fastmap.mapApi.symbol.Matrix();
            matrix = matrix.makeRotate(this.hashAngle);
            vector = vector.crossMatrix(matrix);

            //hash的偏移向量
            var hashOffsetVector = vector.multiNumber(this.hashOffset);

            //单位向量乘以hash长度
            vector = vector.multiNumber(this.hashHeight);

            var startPoint = mark.coordinates[0].plusVector(hashOffsetVector);
            var endPoint = startPoint.plusVector(vector);

            //用计算出的起点和终点构造hash几何
            var hashGeo = new fastmap.mapApi.symbol.LineString();
            hashGeo.coordinates.push(startPoint);
            hashGeo.coordinates.push(endPoint);

            //设置hashSymbol的geometry并调用draw方法
            this.hashSymbol.geometry = hashGeo;
            this.hashSymbol.draw(ctx);
        }
    }
});
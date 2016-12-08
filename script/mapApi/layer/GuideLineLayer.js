/**
 * Created by liwanchong on 2016/5/16.
 */
fastmap.mapApi.GuideLineLayer = fastmap.mapApi.WholeLayer.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     * 初始化可选参数
     * @param {Object}options
     */
    initialize: function (url, options) {
        this.options = options || {};
        this.url = url;
        this.g = this._ctx;
        fastmap.mapApi.WholeLayer.prototype.initialize(this, options);
        this.linkFObj = {};
    },
    draw: function (guideObj) {
        var g = this._ctx;
        if (guideObj) {
            if (!this.linkFObj[guideObj["id"]]) {
                this.linkFObj[guideObj["id"]] = guideObj;
                this.drawLineString(guideObj["coordinates"], guideObj["guidePoint"], g, false, this);
            }

        }
    },
    drawMove: function (obj) {
        var g = this._ctx;
        //g.strokeStyle = "red";
        //g.lineWidth = 2;
        for (var item in obj) {
            this.drawLineString(obj[item]["coordinates"], obj[item]["guidePoint"], g, false, this);
        }


    },
    /***
     * 清空图层
     */
    clear: function () {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },
    /***
     * 图层添加到地图时调用
     * @param{L.Map} map
     */
    onAdd: function (map) {
        this.map = map;
        this._initContainer(this.options);
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param {L.Map}map
     */
    onRemove: function (map) {
        map.getPanes().tilePane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },
    drawLineString: function (geom, guidePoint, g, boolPixelCrs, self) {
        if (!geom) {
            return;
        }
        if(this.map.getZoom()>=17) {
            var proj = [];
            proj.push(this.map.latLngToLayerPoint([geom[1], geom[0]]));
            proj.push(this.map.latLngToLayerPoint([guidePoint[1], guidePoint[0]]));
            if (g.setLineDash) {
                g.setLineDash([6, 6]);
                //  Get the current offset
                g.lineDashOffset = 0;  // To animate the lines
                g.lineJoin = "round";
                g.lineWidth = "1";
                g.strokeStyle = "gray";
                g.beginPath();
                for (i = 0; i < proj.length; i++) {

                    var method = (i === 0 ? 'move' : 'line') + 'To';
                    g[method](proj[i].x, proj[i].y);
                }
                g.stroke();
            }

        }

    },
    _redraw: function () {
        //this._resetCanvasPosition();
        this.clear();
        this.drawMove(this.linkFObj);

        return this;
    }

});
fastmap.mapApi.guideLineLayer = function (url, options) {
    return new fastmap.mapApi.GuideLineLayer(url, options);
};
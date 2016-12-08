/**
 * Created by zhongxiaoming on 2016/1/4.
 * Class GeometryValidation
 */
fastmap.mapApi.GeometryValidation = L.Class.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.transform = this.options.transform?this.options.transform:null;
    },
    caculationDistance:function(latlngStart, latlngEnd){
        var startPoint = this.transform.lonLat2Mercator(latlngStart.x,latlngStart.y);
        var endPoint = this.transform.lonLat2Mercator(latlngEnd.x,latlngEnd.y);

        return fastmap.mapApi.point(startPoint[0],startPoint[1]).distanceTo(fastmap.mapApi.point(endPoint[0],endPoint[1]));
    }
});

fastmap.uikit.geometryValidation = function(options){
    return new fastmap.mapApi.GeometryValidation(options);
}
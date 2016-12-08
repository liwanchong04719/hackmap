/**
 * Created by zhongxiaoming on 2015/9/2.
 * Class Ilayer接口
 */
fastmap.mapApi.Layer = L.Class.extend({
    /***
     * @param {Object}options
     * isVisiable图层是否可见，默认为false
     * isSelectable图层是否可选择，默认为false
     */
    initialize: function(options) {
        this.options = options || {};
        this.isVisiable = options.isVisiable ? true : false;
        this.isSelectable = options.isSelectable ? true : false;
    },
    /***
     * 图层加入到地图时调用
     * onAdd所有继承Ilayer接口的类需要重写该方法
     * @param {L.Map}map
     */
    onAdd: function(map) {
        this._map = map;
        //map.addLayer(this)
    },
    /***
     * 图层被移除时调用
     * onRemove所有继承Ilayer接口的类需要重写该方法
     * @param {L.Map}map
     */
    onRemove: function(map) {
        //map.removeLayer(this);
        this._map = null;
    }
});
fastmap.mapApi.layer = function(options) {
    return new fastmap.mapApi.Layer(options);
};
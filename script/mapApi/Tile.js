/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class Tile
 */
fastmap.mapApi.Tile = L.Class.extend({
    options: {},
    /***
     *
     * @param {String}url 初始化url
     * @param {Object}options 可选参数
     */
    initialize: function(url, options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.url = url;
        this.data = {};
        this.xmlhttprequest = {};
    },
    /***
     * 获得当前tile的url
     * @returns {tileJson.url}
     */
    getUrl: function() {
        return this.url;
    },
    /***
     * 获得tile的data
     * @returns {*}
     */
    getData: function() {
        return this.data;
    },
    /***
     * 设置tile的data
     * @param {Object}data
     */
    setData: function(data) {
        this.data = data;
    },
    /***
     * 获得tile的httmxmlrequest对象
     * @returns {{}|*}
     */
    getRequest: function() {
        return this.xmlhttprequest;
    },
    /***
     * 设置tile的httmxmlrequest对象
     * @param {XMLHttpRequest}xmlhttprequest
     */
    setRequest: function(xmlhttprequest) {
        this.xmlhttprequest = xmlhttprequest;
    }
});
/***
 * 初始化tile
 * @param {String}url  初始化url
 * @param {Object}options 可选参数
 * @returns {.mapApi.Tile}
 */
fastmap.mapApi.tile = function(url, options) {
    return new fastmap.mapApi.Tile(url, options)
};
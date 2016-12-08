/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class mecator坐标转换类
 */
fastmap.mapApi.MecatorTranform = function() {
    this.M_PI = Math.PI;
    this.originShift = 2 * this.M_PI * 6378137 / 2.0; //原先为6378137，wt修改
    this.initialResolution = 2 * this.M_PI * 6378137 / 256;
};
/***
 * 计算当前地图分辨率
 * @param {number}zoom
 * @returns {number}
 */
fastmap.mapApi.MecatorTranform.prototype.resolution = function(zoom) {
    return this.initialResolution / Math.pow(2, zoom);
};
/**
 * 经纬度到mecator转换
 * @param {Number}lon
 * @param {Number}lat
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.lonLat2Mercator = function(lon, lat) {
    var xy = [];
    var x = lon * this.originShift / 180;
    var y = Math.log(Math.tan((90 + lat) * this.M_PI / 360)) / (this.M_PI / 180);
    y = y * this.originShift / 180;
    xy.push(x);
    xy.push(y);
    return xy;
};
/***
 *
 * mercator到经纬度坐标转化
 * @param {number}mx
 * @param {number}my
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.mer2lonlat = function(mx, my) {
    var lonlat = [];
    lonlat.push((mx / this.originShift) * 180);
    lonlat.push((my / this.originShift) * 180);
    lonlat[1] = 180 / this.M_PI * (2 * Math.atan(Math.exp(lonlat[1] * this.M_PI / 180)) - this.M_PI / 2);
    return lonlat;
};
/***
 * mecator到像素坐标转换
 * @param {number}x
 * @param {number}y
 * @param {number}zoom
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.mercator2Pixel = function(x, y, zoom) {
    var res = this.resolution(zoom);
    var px = (x + this.originShift) / res;
    var py = (-y + this.originShift) / res;
    var xy = [];
    xy.push(px);
    xy.push(py);
    return xy;
};
/***
 * mecator到qq地图像素坐标转换
 * @param {number}x
 * @param {number}y
 * @param {number}zoom
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.mercator2PixelQQ = function(x, y, zoom) {
    var res = this.resolution(zoom);
    var px = (x + originShift) / res;
    var py = (y + originShift) / res;
    var xy = [];
    xy.push(px);
    xy.push(py)
    return xy;
};
/***
 * 像素坐标到瓦片坐标转换
 * @param {number}x
 * @param {number}y
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.pixels2Tile = function(x, y) {
    var tx = Math.ceil(x / 256) - 1;
    var ty = Math.ceil(y / 256) - 1;
    var xy = [];
    xy.push(tx);
    xy.push(ty);
    return xy;
};
/***
 * mecator到瓦片坐标转换
 * @param {number}x
 * @param {number}y
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.mercator2Tile = function(x, y, zoom) {
    var merXY = [];
    merXY = this.mercator2Pixel(x, y, zoom);
    var xy = [];
    xy = this.pixels2Tile(merXY[0], merXY[1]);
    return xy;
};
/***
 * 经纬度到瓦片坐标转换
 * @param {number}x
 * @param {number}y
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.lonlat2Tile = function(lon, lat, zoom) {
    var xy = [];
    xy = this.lonLat2Mercator(lon, lat);
    xy = this.mercator2Pixel(xy[0], xy[1], zoom);
    var res = this.pixels2Tile(xy[0], xy[1]);
    return res;
};
/***
 * 经纬度到像素坐标转换
 * @param {number}x
 * @param {number}y
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.lonlat2Pixel = function(lon, lat, zoom) {
    var xy = [];
    xy = this.lonLat2Mercator(lon, lat);
    xy = this.mercator2Pixel(xy[0], xy[1], zoom);
    return xy;
};
fastmap.mapApi.MecatorTranform.prototype.PixelToLonlat = function(pixelX, pixelY, zoom) {
    var x = 360 * ((pixelX / (256 << zoom)) - 0.5);
    var y = 0.5 - (pixelY / (256 << zoom));
    y = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    return [x, y];
};
/***
 * 地图像素到实际距离转换
 * @param {number}x
 * @param {number}y
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.scale = function(map) {
    /*var titleSize = 256;
     var res = ((2 * Math.PI * 6378137) / titleSize) / Math.pow(2, zoom);
     return res;*/
    var bounds = map.getBounds();
    var centerLat = bounds.getCenter().lat;
    var halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180);
    var dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180;
    var size = map.getSize();
    var res = dist / size.x;
    return res;
};
fastmap.mapApi.MecatorTranform.prototype.rad = function(d) {
    return d * Math.PI / 180.0;
};
/***
 * 地图经纬度到实际距离转换
 * @param {number}x
 * @param {number}y
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.distance = function(lat1,lon1,lat2, lon2) {
    var radius =6378137;
    var a = fastmap.mapApi.MecatorTranform.prototype.rad(lat1) - fastmap.mapApi.MecatorTranform.prototype.rad(lat2);
    var b = fastmap.mapApi.MecatorTranform.prototype.rad(lon1) - fastmap.mapApi.MecatorTranform.prototype.rad(lon2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(fastmap.mapApi.MecatorTranform.prototype.rad(lat1))*Math.cos(fastmap.mapApi.MecatorTranform.prototype.rad(lat2))*Math.pow(Math.sin(b/2),2)));
    s = s * radius;
    return Math.abs(s);
};
/**
 * Bounds类
 * 用于表示包围框
 *
 * @namespace mapApi
 * @class Bounds
 */
fastmap.mapApi.Bounds = L.Class.extend({
    /**
     * @method initialize
     * 初始化构造函数
     *
     * @param {Number} left
     * @param {Number} bottom
     * @param {Number} right
     * @param {Number} top
     *
     * @return {fastmap.mapApi.Bounds} 返回拷贝对象
     */
    initialize: function(left, bottom, right, top) {
        if (left) {
            this.left = parseFloat(left);
        }
        if (bottom) {
            this.bottom = parseFloat(bottom);
        }
        if (right) {
            this.right = parseFloat(right);
        }
        if (top) {
            this.top = parseFloat(top);
        }
    },
    /**
     * @method clone
     * 深度拷贝当前bounds对象
     *
     * @return {fastmap.mapApi.Bounds} 返回拷贝对象
     */
    clone: function() {
        return new fastmap.mapApi.Bounds(this.left, this.bottom, this.right, this.top);
    },
    /**
     * @method equals
     * 判断两个bounds是否相等
     *
     * @param {fastmap.mapApi.Bounds} 用于比较的bounds
     * @return {Boolean} 如果两个bounds的上下左右相等，则两个bounds相等，否则不相等
     */
    equals: function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && (this.right == bounds.right) && (this.top == bounds.top) && (this.bottom == bounds.bottom));
        }
        return equals;
    }
});
fastmap.mapApi.bounds = function(options) {
    return new fastmap.mapApi.Bounds(options);
};
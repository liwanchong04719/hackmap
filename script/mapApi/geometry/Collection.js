/**
 * Created by zhongxiaoming on 2015/10/14.
 * Class Collection 组成几何对象的几何集合
 */
fastmap.mapApi.Collection = fastmap.mapApi.Geometry.extend({

    /**
     * 几何类型
     * type
     * @property type
     * @type Collection
     */
    type:"Collection",

    /**
     * 组成部分
     * components
     * @property components
     */
    components:[],

    initialize: function (components) {
        this.components = [];
        if (components != null) {
            this.addComponents(components);
        }
    },

    /***
     * 返回组成集合的字符串
     * @returns {string}
     */
    getComponentsString: function(){
        var strings = [];
        for(var i=0, len=this.components.length; i<len; i++) {
            strings.push(this.components[i].toShortString());
        }
        return strings.join(",");
    },

    /***
     * 计算外包框
     */
    calculateBounds: function() {},

    /***
     * 向几何对象中加入组件数组
     * @param components
     */
    addComponents: function(components){
        if(!(L.Util.isArray(components))) {
            components = [components];
        }
        for(var i=0, len=components.length; i<len; i++) {
            this.addComponent(components[i]);
        }
    },

    /***
     * 向几何对象中加入组件
     * @param component
     * @param index
     */
    addComponent: function(component, index) {
        var added = false;
        if(component) {
            if(this.componentTypes == null ||
                (OpenLayers.Util.indexOf(this.componentTypes,
                    component.CLASS_NAME) > -1)) {

                if(index != null && (index < this.components.length)) {
                    var components1 = this.components.slice(0, index);
                    var components2 = this.components.slice(index,
                        this.components.length);
                    components1.push(component);
                    this.components = components1.concat(components2);
                } else {
                    this.components.push(component);
                }
                component.parent = this;
                this.clearBounds();
                added = true;
            }
        }
        return added;
    },

    /***
     * 删除指定的组件数组
     * @param components
     */
    removeComponents: function(components) {},

    /***
     * 删除指定的组件
     * @param component
     */
    removeComponent: function(component) {},

    /***
     * 获取几何对象节点
     * @param nodes
     */
    getVertices: function(nodes) {}
})
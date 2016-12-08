/**
 * Created by lwc on 2015/12/22.
 */
fastmap.mapApi.TransformDirection = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.flag = this.shapeEditor.shapeEditorResult.getFinalGeometry() ? this.shapeEditor.shapeEditorResult.getFinalGeometry().flag : null;
        this.type = this.shapeEditor.shapeEditorResult.getFinalGeometry() ? this.shapeEditor.shapeEditorResult.getFinalGeometry().type : null;
        this.angle = this.shapeEditor.angle;
        this.sign = 0;
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
    },

    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
    },


    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        this.flag = this.shapeEditor.shapeEditorResult.getFinalGeometry() ? this.shapeEditor.shapeEditorResult.getFinalGeometry().flag : null;
        this.type = this.shapeEditor.shapeEditorResult.getFinalGeometry() ? this.shapeEditor.shapeEditorResult.getFinalGeometry().type : null;
        var layerPoint = this._map.latLngToContainerPoint([event.latlng.lat, event.latlng.lng]);
        var geos = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        var point = this._map.latLngToContainerPoint([geos.point.y, geos.point.x]);
        var orientation = geos.orientation;
        var len = this.distance(layerPoint, point);
        if (len < 100) {
            if (this.type === "intRticMarker") {
                switch (orientation) {
                    case "1":
                        if (this.sign === 0) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";//向左
                        } else if (this.sign === 1) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";//向右
                            this.sign = 0;
                        }
                        break;
                    case "2":
                        if (this.flag) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";
                        } else {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";
                        }
                        break;
                }
            } else {
                switch (orientation) {
                    case "1":
                        if (this.sign === 0) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "3";//向左
                        } else if (this.sign === 1) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";//向右
                            this.sign = 0;
                        }
                        break;
                    case "2":
                        if (this.flag) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";
                        } else {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "3";
                        }

                        break;
                    case "3":
                        if (this.flag) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";
                            this.sign = 1;
                        } else {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";

                        }
                        break;


                }
            }
        }

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },
    onMouseUp: function (event) {
        this.targetIndex = null;

        fastmap.uikit.ShapeEditorController().stopEditing();
    },

    drawFeedBack: function () {
    },
    //两点之间的距离
    distance: function (pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }

})
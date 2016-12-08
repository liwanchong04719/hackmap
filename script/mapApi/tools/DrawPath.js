/**
 * Created by zhoumingrui on 2015/11/3.
 * Class DrawPath
 */

fastmap.mapApi.DrawPath = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this.eventController = fastmap.uikit.EventController();
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.catches = [];
        this.insertPoint = null;
        this.clickcount = 1;
        this.targetGeoIndex = 0;
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            snapLine: true,
            snapVertex: true,
            snapNode: true

        });
        this.snapHandler.enable();
        this.validation = fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});

    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.on('click', this.onMouseDown, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.off('click', this.onMouseDown, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
    },


    onMouseDown: function (event) {

        var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
        var lastPoint = this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 2];
        if (lastPoint != null && lastPoint.x != 0) {
            var lpoint = this._map.latLngToLayerPoint(L.latLng(lastPoint.y, lastPoint.x));
            var dis = lpoint.distanceTo(event.layerPoint);
            if (dis < 5) {
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 1, 1);

                this.clickcount = 1;
                this.shapeEditor.stopEditing();
                fastmap.uikit.ShapeEditorController().stopEditing();
                return;
            }
        }
        if (this.snapHandler.snaped) {
            mousePoint = this.targetPoint;
        }
        if (this.clickcount == 1) {
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 1, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            console.log(mousePoint);
        } else {
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 1, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            console.log(mousePoint);
        }
        this.clickcount++;
        if (this.snapHandler.snaped) {
            // mousePoint = this.targetPoint;
            if (this.snapHandler.snapIndex == 0) {
                console.log(mousePoint);
                this.catches.push({
                    nodePid: parseInt(this.snapHandler.properties.snode),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                });
                if (this.clickcount == 2) {

                    this.snodePid = parseInt(this.snapHandler.properties.snode ? this.snapHandler.properties.snode : this.snapHandler.properties['id']);
                } else {
                    this.enodePid = parseInt(this.snapHandler.properties.enode ? this.snapHandler.properties.enode : this.snapHandler.properties['id']);

                }
            } else if (this.snapHandler.snapIndex == -1) {
                console.log(mousePoint);
                this.catches.push({
                    linkPid: parseInt(this.snapHandler.properties.id),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                })
            } else if (this.snapHandler.snapIndex == -2) {
                if (this.clickcount == 2) {
                    this.snodePid = parseInt(this.snapHandler.properties.id);
                } else {
                    this.enodePid = parseInt(this.snapHandler.properties.id);
                }
                console.log(mousePoint);
                this.catches.push({
                    nodePid: parseInt(this.snapHandler.properties.id),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                })
            }
            else {
                if (this.clickcount == 2) {
                    this.snodePid = parseInt(!this.snapHandler.properties.enode ? this.snapHandler.properties['id'] : this.snapHandler.properties.enode);
                } else {
                    this.enodePid = parseInt(this.snapHandler.properties.snode ? this.snapHandler.properties.snode : this.snapHandler.properties['id']);
                }
                console.log(mousePoint);
                this.catches.push({
                    nodePid: parseInt(this.snapHandler.properties.snode ? this.snapHandler.properties.snode : this.snapHandler.properties['id']),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                })
            }
        } else {

        }

        this.shapeEditor.shapeEditorResult.setProperties({
            snodePid: this.snodePid,
            catches: this.catches,
            enodePid: this.enodePid
        });

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'crosshair';
        var layerPoint = event.layerPoint;

        this.snapHandler.setTargetIndex(0);
        var that = this;
        if (this.snapHandler.snaped == true) {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {'snaped': true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0])
            this.insertPoint = fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);
            if (this.clickcount > 1) {
                var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
                if (points.length == 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 0, this.insertPoint);
                }
                if (points.length > 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 1, this.insertPoint);
                }
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                point: {
                    x: this.targetPoint.lng,
                    y: this.targetPoint.lat
                }
            });
        } else {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {'snaped': false});

            this.insertPoint = fastmap.mapApi.point(this._map.layerPointToLatLng(layerPoint).lng, this._map.layerPointToLatLng(layerPoint).lat);
            if (this.clickcount > 1) {
                var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
                if (points.length == 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 0, this.insertPoint);
                }
                if (points.length > 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 1, this.insertPoint);
                }
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }

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
     * 重新设置节点
     */
    resetVertex: function () {
        if (this.start == true) {
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 1);
            this.start = false;
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 0, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        }
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
    }
});

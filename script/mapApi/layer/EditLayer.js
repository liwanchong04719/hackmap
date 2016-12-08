/**
 * Created by zhongxiaoming on 2015/10/19
 * Class EditLayer 可编辑层
 */
fastmap.mapApi.EditLayer = fastmap.mapApi.WholeLayer.extend({
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
        fastmap.mapApi.WholeLayer.prototype.initialize(this, options);
        this.eventController = fastmap.uikit.EventController();
        this.minShowZoom = this.options.minShowZoom || 9;
        this.maxShowZoom = this.options.maxShowZoom || 18;
        this.eventController = fastmap.uikit.EventController();
        this.initEvent();
        this.drawGeometry = null;
    },

    initEvent: function () {
        var that = this;
        this.shapeEditor = fastmap.uikit.ShapeEditorController();

        this.eventController.on(this.eventController.eventTypes.SNAPED, function (event) {
            that.snaped = event.snaped;
        })
        this.eventController.on(this.eventController.eventTypes.STARTSHAPEEDITRESULTFEEDBACK, delegateDraw);
        function delegateDraw(event) {
            that.selectCtrl = fastmap.uikit.SelectController();
            if (that.shapeEditor.shapeEditorResult == null) {
                return;
            }
            that.drawGeometry = that.shapeEditor.shapeEditorResult.getFinalGeometry();
            that.clear();
            that.draw(that.drawGeometry, that, event.index);
            if (that.snaped == true) {
                var crosspoint = ( event.index != null && that.drawGeometry && that.drawGeometry.components[event.index]) ? that.drawGeometry.components[event.index] : event.point;
                if (crosspoint != undefined) {
                    crosspoint = fastmap.mapApi.point(crosspoint.x, crosspoint.y);
                    crosspoint.type = 'Cross';
                    that.draw(crosspoint, that);
                }

            }

        }

        this.eventController.on(this.eventController.eventTypes.STOPSHAPEEDITRESULTFEEDBACK, function () {
            that.map._container.style.cursor = '';

            var coordinate1 = [];
            if (that.drawGeometry) {
                for (var index in that.drawGeometry.components) {
                    coordinate1.push([that.drawGeometry.components[index].x, that.drawGeometry.components[index].y]);
                }

                that._redraw();
            }
        });

        this.eventController.on(this.eventController.eventTypes.ABORTSHAPEEDITRESULTFEEDBACK, function () {
            that.drawGeometry = that.shapEditor.shapeEditorResult.getOriginalGeometry();
            that.shapEditor.shapeEditorResult.setFinalGeometry(that.drawGeometry.clone());

            that._redraw()
        });
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

    /***
     * 绘制几何图形
     * @param currentGeo 当前几何
     * @param self
     * @param index 鼠标拖动的当前点
     */
    draw: function (currentGeo, self, index) {
        // this.clear();
        if (!currentGeo) {
            return;
        }

        switch (currentGeo.type) {

            case 'LineString':
                drawLineString(currentGeo.components, null, {color: 'red', size: 2}, false, null, false, false, self);
                break;
            case 'Link':
                self.clear();
                drawLineString(currentGeo.geometry.components, currentGeo.direct, {
                    color: 'red',
                    size: 2
                }, false, null, false, true, self);
                break;
            case 'Point':
                drawPoint(currentGeo, {color: 'red', radius: 3}, false);
                break;
            case'Polygon':
                drawPolygon(currentGeo, {color: 'red', outline: 3}, false);
                break;
            case 'Cross':
                drawCross(currentGeo, {color: 'blue', width: 1}, false, self);
                break;
            case 'marker':
                drawMarker(currentGeo.point, currentGeo.orientation, currentGeo.angle, false, self);
                break;
            case 'MultiPolyline':
                drawMultiPolyline(currentGeo.coordinates, {color: 'red', width: 2}, self);
                break;
            case 'intRticMarker':
                drawRticMarker(currentGeo.point, currentGeo.orientation, currentGeo.angle, false, self);
                break;
            case 'Buffer':
                drawBuffer(currentGeo.geometry.components, currentGeo.linkWidth, self);
                break;
            case 'Poi':
                drawPoiAndLink(currentGeo.components,{color: 'blue', size: 2}, self);
                break;
        }

        function drawCross(geom, style, boolPixelCrs, self) {
            if (!geom) {
                return;
            }
            var p = null;
            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }

            var verLineArr = [{x: p.x, y: p.y + 20}, {x: p.x, y: p.y - 20}];
            drawLineString(verLineArr, null, {color: 'blue', size: 1}, true, null, null, null, self);
            var horLineArr = [{x: p.x - 20, y: p.y}, {x: p.x + 20, y: p.y}];
            drawLineString(horLineArr, null, {color: 'blue', size: 1}, true, null, null, null, self);
        }

        function drawBuffer(geom, width, self) {
            var proj = [];
            this.transform = new fastmap.mapApi.MecatorTranform();
            var scale = this.transform.scale(map);
            var linkWidth = parseFloat(width * scale);
            linkWidth = linkWidth.toFixed(2);
            for (var i = 0; i < geom.length; i++) {
                proj.push(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]));
            }
            var ctx = self._ctx;
            ctx.lineWidth = width;
            ctx.save();
            ctx.beginPath();
            ctx.lineCap = "round";
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                ctx[method](proj[i].x, proj[i].y);
            }
            ctx.stroke();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                ctx[method](proj[i].x, proj[i].y);
            }
            ctx.lineWidth = width - 1;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.clip();
            ctx.restore();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                ctx[method](proj[i].x, proj[i].y);
            }
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillText(linkWidth + "m", proj[0].x, proj[0].y)


        }

        function drawPoint(geom, style, boolPixelCrs) {
            if (!geom) {
                return;
            }
            var p = null;
            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }

            var g = self._ctx;
            g.beginPath();
            g.fillStyle = style.color;
            g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
            g.closePath();
            g.fill();
            g.restore();
        }


        function drawLineString(geom, direct, style, boolPixelCrs, index, boolnode, boolselectnode, self) {
            if (!geom) {
                return;
            }

            var proj = [], i;

            for (var i = 0; i < geom.length; i++) {
                if (boolPixelCrs) {
                    proj.push({x: geom[i].x, y: geom[i].y});
                } else {

                    proj.push(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]));

                    if (boolselectnode && self.selectCtrl) {
                        if (self.selectCtrl.selectedFeatures.latlng && self.selectCtrl.selectedFeatures.latlng.lat == geom[i].y && self.selectCtrl.selectedFeatures.latlng.lng == geom[i].x) {
                            drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }
                    } else {
                        if (boolnode) {
                            if (i == 0 || i == geom.length - 1) {
                                drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                    color: 'blue',
                                    radius: 4
                                }, true);
                            }
                        } else {

                            drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                color: 'blue',
                                radius: 4
                            }, true);

                        }
                    }


                }
            }

            var g = self._ctx;
            g.strokeStyle = style.color;
            g.lineWidth = style.size;
            //g.opacity = 0.5;
            g.beginPath();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                g[method](proj[i].x, proj[i].y);
            }
            g.stroke();
            g.restore();
            if (direct == 2 || direct == 3) {
                var coords = proj;
                var arrowList = [];
                for (var k = 0; k < coords.length; k++) {
                    if (k < coords.length - 1) {
                        var oneArrow = [{x: coords[k]['x'], y: coords[k]['y']}, {
                            x: coords[k + 1]['x'],
                            y: coords[k + 1]['y']
                        }];
                        arrowList.push(oneArrow);
                    }
                }
                drawArrow(self._ctx,direct, arrowList,self)
            }
        }


        function drawMultiPolyline(geom, style, self) {

            for (var i = 0, len = geom.length; i < len; i++) {
                drawLineString(geom[i].components, style, false, null, true, true,true, self);
            }
        }


        function drawPolygon(geom, style) {
            if (!style) {
                return;
            }

            var coords = geom.components, proj = [], i;

            for (i = 0; i < coords.length; i++) {
                proj.push(this.map.latLngToContainerPoint([coords[i].y, coords[i].x]));
            }

            var g = self._ctx;
            var outline = style.outline;
            g.fillStyle = style.color;
            if (outline) {
                g.strokeStyle = outline.color;
                g.lineWidth = outline.size;
            }
            g.beginPath();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                g[method](proj[i].x, proj[i].y);
            }
            g.closePath();
            g.fill();
            if (outline) {
                g.stroke();
            }

        }

        function drawMarker(geom, type, angle, boolPixelCrs, self) {
            var url, p = null, angleOfTran = angle, that = this;
            if (!geom) {
                return;
            }

            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }
            //if(type==="3") {
            //    angleOfTran = angleOfTran + Math.PI;
            //}
            url = "../../images/road/img/" + type + ".svg";
            var g = self._ctx;
            loadImg(url, function (img) {
                g.save();
                g.translate(p.x, p.y);
                g.rotate(angleOfTran);
                g.drawImage(img, 0, 0);
                g.restore();
                currentGeo.pointForDirect = directOfPoint(p, 61, 32, angle);
                self.eventController.fire(self.eventController.eventTypes.DIRECTEVENT, {"geometry": currentGeo})
            })

        }

        function drawRticMarker(geom, type, angle, boolPixelCrs, self) {
            var url, p = null, angleOfTran = angle, that = this;
            if (!geom) {
                return;
            }

            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }
            if (type === "2") {
                angleOfTran = angleOfTran + Math.PI;
            }
            url = "../../images/road/intRtic/" + type + ".svg";
            var g = self._ctx;
            loadImg(url, function (img) {
                g.save();
                g.translate(p.x, p.y);
                g.rotate(angleOfTran);
                g.drawImage(img, 0, 0);
                g.restore();
                currentGeo.pointForDirect = directOfPoint(p, 61, 32, angle);
                self.eventController.fire(self.eventController.eventTypes.DIRECTEVENT, {"geometry": currentGeo})
            })

        }

        function loadImg(url, callBack) {
            var img = new Image();
            img.onload = function () {
                callBack(img);
            };
            img.src = url;
        }

        function directOfPoint(point, length, width, angle) {
            point.x = point.x + length;
            point.y = point.y + width / 2;
            point.x = point.x + Math.tan(angle);
            point.y = point.y + Math.tan(angle);
            //point=this.map.containerPointToLatLng(point);
            return point;
        }

        function drawArrow(ctx, direct, data,self) {
            var g = ctx.canvas.getContext('2d');
            g.linewidth = 2;
            g.strokeStyle = "#ff0000";
            if (direct == 0 || direct == 1) {
                return;
            }

            for (var i = 0, len = data.length; i < len; i++) {
                for (var j = 0, len2 = data[i].length; j < len2 - 1; j = j + 2) {

                    g.beginPath();
                    g.translate(0, 0, 0);

                    var point1 = data[i][j];
                    var point2 = data[i][j + 1];
                    var distance = self.distance(point1, point2);
                    if (distance < 20) {
                        break;
                    }

                    g.save()
                    var centerPoint = L.point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);

                    g.translate(centerPoint.x, centerPoint.y);
                    //先计算向量与y轴负方向向量(0,-1)的夹角


                    var ang = 0;
                    if (point1.y - point2.y == 0) {
                        if (point1.x - point2.x > 0) {
                            ang = Math.PI / -2;
                        }
                        else {
                            ang = Math.PI / 2;
                        }
                    }
                    else {
                        ang = (point1.x - point2.x) / (point1.y - point2.y);
                        ang = Math.atan(ang);
                    }
                    if (point2.y - point1.y >= 0) {
                        if (direct == 2) {
                            g.rotate(-ang);
                        } else if (direct == 3) {
                            g.rotate(-ang + Math.PI);
                        }
                    } else {
                        if (direct == 2) {
                            g.rotate(Math.PI - ang); //加个180度，反过来
                        } else if (direct == 3) {
                            g.rotate(-ang);
                        }

                    }
                    g.lineTo(-6, -12);
                    g.lineTo(0, 2);
                    g.lineTo(6, -12);
                    g.lineTo(0, 0);
                    g.stroke();
                    g.fill(); //箭头是个封闭图形
                    g.closePath();
                    g.restore();   //恢复到堆的上一个状态，其实这里没什么用。
                }
            }
        }

        function drawPoiAndLink(geom, style, self) {
            if (!geom) {
                return;
            }
            this.transform = new fastmap.mapApi.MecatorTranform();
            var proj = [];
            for (var i = 0; i < geom.length; i++) {
                var point = this.map.latLngToContainerPoint([geom[i].y, geom[i].x])
                proj.push([point.x,point.y]);
                if (i == 0) {
                    drawPoi(point, {
                        src:"../../../images/poi/map/marker_blue_32.png",
                        drawy:-32
                    }, true);
                } else if (i == 1) {
                    drawPoi(point, {
                        src:"../../../images/poi/map/marker_circle_blue_16.png"
                    }, true);
                }
            }
            var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
            var symbol = symbolFactory.dataToSymbol({
                type:'SampleLineSymbol',
                style:'dash',
                color:'blue'
            });
            drawSymbolLineString(self._ctx, proj, true,symbol);
        }
        function drawPoi(geom, style, boolPixelCrs) {
            if (!geom) {
                return;
            }
            var p = null;
            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }
            var g = self._ctx;
            var image = new Image();
            image.src = style.src;
            image.onload = function () {
                var scalex = style.scalex ? style.scalex : 1;
                var scaley = style.scaley ? style.scaley : 1;
                var drawx = style.drawx ? style.drawx : -image.width * scalex / 2;
                var drawy = style.drawy ? style.drawy : -image.height * scalex / 2;
                g.save();
                g.translate(p.x, p.y);
                g.drawImage(image, drawx, drawy, image.width * scalex, image.height * scaley);
                g.restore();
            }
        }
        function drawSymbolLineString(ctx, geom, boolPixelCrs, symbol) {
                if (!symbol) {
                    return;
                }
                var geometry = [];
                for (var i = 0; i < geom.length; i++) {
                    if (boolPixelCrs) {
                        geometry.push([geom[i][0], geom[i][1]]);
                    } else {
                        var point = this._tilePoint(ctx, geom[i]);
                        geometry.push([point.x, point.y]);
                    }
                }
                var lsGeometry = new fastmap.mapApi.symbol.LineString(geometry);
                var g = ctx.canvas.getContext('2d');
                symbol.geometry = lsGeometry;
                symbol.draw(g);
        }
    },


    /***
     * 清空图层
     */
    clear: function () {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },
    distance:function (pointA, pointB) {
    var len;
    if (pointA.x) {
        len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
    } else {
        len = Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2);
    }

    return Math.sqrt(len);
},
    _redraw: function () {

        this.clear();

        this.draw(this.drawGeometry, this);
        this._resetCanvasPosition();
        return this;
    }
});

fastmap.mapApi.editLayer = function (url, options) {
    return new fastmap.mapApi.EditLayer(url, options);
};


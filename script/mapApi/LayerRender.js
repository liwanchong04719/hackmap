/**
 * Created by zhongxiaoming on 2016/3/23.
 * Class fastmap.mapApi.LayerRender
 */
fastmap.mapApi.LayerRender = {
    /***
     * 绘制点
     * @param ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param geom 点对象
     * @param style 样式
     * @param boolPixelCrs 是否是像素坐标
     * @private
     */
    _drawPoint: function(options) {
        var p = null;
        if (options.boolPixelCrs) {
            p = {
                x: options.geom[0],
                y: options.geom[1]
            }
        } else {
            p = this._tilePoint(options.ctx, options.geom);
        }
        var c = options.ctx.canvas;
        var g = c.getContext('2d');
        g.beginPath();
        if (options.fillColor) {
            g.fillStyle = options.fillColor;
        }
        if (options.fillOpacity) {
            g.fillOpacity = options.fillOpacity;
        }
        if (options.strokeColor) {
            g.strokeColor = options.strokeColor;
        }
        if (options.strokeOpacity) {
            g.strokeOpacity = options.strokeOpacity;
        }
        g.arc(p.x, p.y, options.radius, 0, Math.PI * 2);
        g.closePath();
        g.fill();
        g.restore();
    },
    /***
     * 绘制空心圆
     * @param ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param geom 点对象
     * @param style 样式
     * @param boolPixelCrs 是否是像素坐标
     * @private
     */
    _drawCircle: function(ctx, geom, style, boolPixelCrs) {
        if (!style) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {
                x: geom[0],
                y: geom[1]
            }
        } else {
            p = this._tilePoint(ctx, geom);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.beginPath();
        g.fillStyle = style.color;
        g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
        g.stroke(); //画空心圆
        g.closePath();
    },
    /***
     * @param options
     * @param geo几何对象
     * @param boolPixelCrs是否以像素坐标绘制
     * @param ctx 绘制上下文
     * @param rotate旋转角度
     * @param scaley 缩放比例
     * @param drawx 绘制时x方向平移
     * @param drawy 绘制时y方向平移
     * @param fillStyle边框填充样式
     * @private
     */
    _drawImg: function(options) {
        var p = null;
        var style = options.style;
        if (options.boolPixelCrs) {
            p = {
                x: options.geo[0],
                y: options.geo[1]
            }
        } else {
            p = this._tilePoint(options.ctx, options.geo);
        }
        var c = options.ctx.canvas;
        var g = c.getContext('2d');
        var image = new Image();
        var rotate = options.rotate;
        image.src = style.src;
        image.onload = function() {
            var scalex = options.scalex ? options.scalex : 1;
            var scaley = options.scaley ? options.scaley : 1;
            var drawx = options.drawx ? options.drawx : -image.width * scalex / 2;
            var drawy = options.drawy ? options.drawy : -image.height * scalex / 2;
            //var drawx = -options.c * image.width/2;
            //var drawy = 0
            g.save();
            g.translate(p.x, p.y);
            if (options.fillStyle) {
                g.strokeStyle = options.fillStyle.lineColor; //边框颜色
                g.fillStyle = options.fillStyle.fillColor;
                g.linewidth = options.fillStyle.lineWidth; //边框宽
                if (options.fillStyle.fillType == "IXPOI") {
                    g.beginPath();
                    g.arc(0, 0, image.width * scalex / 2 + 2, 0, 2 * Math.PI);
                    g.stroke();
                } else {
                    g.fillRect(drawx, drawy, image.width, image.height); //填充颜色 x y坐标 宽 高
                    g.strokeRect(drawx, drawy, image.width, image.height); //填充边框 x y坐标 宽 高
                }
            }
            if (rotate) {
                g.rotate(rotate); //旋转度数
            }
            g.drawImage(image, drawx, drawy, image.width * scalex, image.height * scaley);
            g.restore();
        }
    },
    _drawBackground: function(options) {
        var p = null;
        if (options.boolPixelCrs) {
            p = {
                x: options.geo[0],
                y: options.geo[1]
            }
        } else {
            p = this._tilePoint(options.ctx, options.geom);
        }
        var c = options.ctx.canvas;
        var g = c.getContext('2d');
        var rotate = options.rotate;
        var scalex = options.scalex ? options.scalex : 1;
        var scaley = options.scaley ? options.scaley : 1;
        var drawx = options.drawx;
        var drawy = options.drawy;
        g.save();
        g.translate(p.x, p.y);
        if (rotate) {
            g.rotate(rotate); //旋转度数
        }
        g.strokeStyle = options.lineColor; //边框颜色
        g.fillStyle = options.fillColor;
        g.linewidth = options.lineWidth; //边框宽
        g.fillRect(drawx, drawy, options.width, options.height); //填充颜色 x y坐标 宽 高
        g.strokeRect(drawx, drawy, options.width, options.height); //填充边框 x y坐标 宽 高
        g.restore();
    },
    _drawLinkNameText: function(ctx, geom, name) {
        var startLen = geom.concat().length;
        geom = this._clip(ctx, geom);
        var endLen = geom.length;
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = "10px Courier New";
        g.textAlign = "center";
        var angle,
            nameArr = name.split(""),
            nameLen = name.length * 10,
            lineLen = 0;
        if (geom.length === 2) {
            angle = this._rotateAngle(geom[0], geom[1]);
            lineLen = this.distance(geom[0], geom[1]);
            if (nameLen < lineLen / 2 && lineLen > 160) {
                this._showTextOfAngle(ctx, 0, name, angle, [(geom[0][0] + geom[1][0]) / 2, (geom[0][1] + geom[1][1]) / 2]);
            }
        } else {
            var startPoint = geom[0],
                startPointForLen = geom[0],
                endPoint = geom[geom.length - 1],
                textLength = 0,
                startText = 0,
                textIndex = 0,
                betPointsLen, realLineLen = 0,
                linkArrLen = geom.length;
            for (var m = 1; m < linkArrLen; m++) {
                betPointsLen = this.distance(geom[m], startPointForLen);
                realLineLen += betPointsLen;
                startPointForLen = geom[m];
            }
            if (nameLen < realLineLen / 2 && realLineLen > 50) {
                startPoint = geom[2]
                for (var linkFLag = 1; linkFLag < linkArrLen; linkFLag++) {
                    if (textLength < nameArr.length) {
                        betPointsLen = this.distance(geom[linkFLag], startPoint);
                        angle = this._rotateAngle(startPoint, geom[linkFLag]);
                        if (betPointsLen > 10) {
                            textIndex = parseInt(betPointsLen / 10);
                            this._showTextOfAngle(ctx, 0, name, angle, startPoint);
                            break;
                        } else {
                            startPoint = geom[linkFLag];
                        }
                    }
                }
            }
        }
    },
    _drawBridge: function(cav, geom, that) {
        var c = cav.canvas;
        var ctx = c.getContext('2d');
        var oriStart, oriEnd;
        oriStart = geom[0][0];
        for (var i = 1, len = geom.length; i < len; i++) {
            oriEnd = geom[i][0];
            var angle = that._rotateAngle(oriStart, oriEnd),
                points = [];
            points = that._pointsFromAngle([oriStart, oriEnd], angle);
            that._drawObliqueLine(ctx, points, angle);
            oriStart = geom[i][0];
        }
    },
    _drawObliqueLine: function(ctx, points, angle) {
        var len = Math.floor(this.distance(points[0], points[1]) / 20);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";
        ctx.save();
        ctx.translate(points[0][0], points[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < len; i++) {
            ctx.moveTo(i * 20, 0);
            ctx.lineTo(i * 20, -6);
        }
        //最后一个点
        ctx.moveTo(points[1][0] - points[0][0], 0);
        ctx.lineTo(points[1][0] - points[0][0], -6);
        ctx.stroke();
        ctx.restore();
    },
    /**
     * 字体的旋转角度
     * @param startPoint
     * @param endPoint
     * @returns {*}
     * @private
     */
    _rotateAngle: function(startPoint, endPoint) {
        var angle;
        if ((startPoint[0] - endPoint[0]) === 0) {
            angle = Math.PI / 2;
        } else {
            if ((startPoint[1] - endPoint[1]) === 0) {
                angle = 0;
            } else {
                angle = Math.atan((startPoint[1] - endPoint[1]) / (startPoint[0] - endPoint[0]));
            }
        }
        return angle;
    },
    _showTextOfAngle: function(ctx, start, name, angle, textGeom, font, align) {
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = font ? font : "10px Courier New";
        g.textAlign = align ? align : "center";
        var nameArr = name.split(""),
            PI = Math.PI,
            end = nameArr.length;
        if (angle === 0) {
            g.fillText(name, textGeom[0], textGeom[1]);
            g.save();
        } else if ((angle < PI && angle > 2 * (PI / 5))) {
            for (var i = start; i < end; i++) {
                g.fillText(nameArr[i], textGeom[0], textGeom[1] + i * 13);
                g.save();
            }
        } else {
            var showName = name.substr(start, end);
            g.save();
            g.translate(textGeom[0], textGeom[1]);
            g.rotate(angle);
            g.fillText(showName, 0, 0);
            g.restore();
        }
    },
    //_drawConditionSpeedLimit: function (ctx, name, angle, textGeom, font, align) {
    _drawText: function(options) {
        var c = options.ctx.canvas;
        var g = c.getContext('2d');
        g.font = options.font ? options.font : "10px Courier New";
        g.textAlign = options.textAlign ? options.textAlign : "center";
        g.save();
        g.translate(options.geo[0], options.geo[1]);
        if (options.rotate) {
            g.rotate(options.rotate);
        }
        //g.fillText(options.text, 0, 12 / 2);
        g.fillText(options.text, options.drawx, options.drawy);
        g.restore();
    },
    /***
     * _drawArrow绘制方向箭头
     * @param {Object}ctx
     * @param {Number}direct 绘制方向
     * @param {Array}data 点数组
     * @private
     */
    _drawArrow: function(ctx, direct, data) {
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
                var distance = this.distance(point1, point2);
                if (distance < 30) {
                    return;
                }
                g.save()
                var centerPoint = L.point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
                g.translate(centerPoint.x, centerPoint.y);
                //先计算向量与y轴负方向向量(0,-1)的夹角
                var ang = 0;
                if (point1.y - point2.y == 0) {
                    if (point1.x - point2.x > 0) {
                        ang = Math.PI / -2;
                    } else {
                        ang = Math.PI / 2;
                    }
                } else {
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
                g.lineTo(-3, -6);
                g.lineTo(0, 1);
                g.lineTo(3, -6);
                g.lineTo(0, 0);
                g.stroke();
                g.fill(); //箭头是个封闭图形
                g.closePath();
                g.restore(); //恢复到堆的上一个状态，其实这里没什么用。
            }
        }
    },
    /**
     * 画区域内的道路
     * @param ctx
     * @param points
     * @param dashLength
     * @param that
     * @private
     */
    _drawDashLineOfAngle: function(ctx, points, dashLength, that) {
        var endPoint,
            startPoint = points[0][0];
        for (var i = 1, len = points.length; i < len; i++) {
            endPoint = points[i][0];
            var angle = that._rotateAngle(startPoint, endPoint);
            that._drawDashLine(ctx, [startPoint, endPoint], angle, dashLength, that);
            startPoint = points[i][0];
        }
    },
    /**
     * 画虚线
     * @param ctx
     * @param points
     * @param angle
     * @param dashLength
     * @param self
     * @private
     */
    _drawDashLine: function(ctx, points, angle, dashLength, self) {
        var pointsOfChange = self._pointsFromAngle(points, angle);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        var xPos = points[1][0] - points[0][0],
            yPos = points[1][1] - points[0][1];
        var dash = Math.floor(Math.sqrt(xPos * xPos + yPos * yPos) / dashLength);
        ctx.save();
        ctx.translate(pointsOfChange[0][0], pointsOfChange[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < dash; i++) {
            if (i % 2) {
                ctx.lineTo(dashLength * i, 0);
            } else {
                ctx.moveTo(dashLength * i, 0);
            }
        }
        ctx.stroke();
        ctx.restore();
    },
    /***
     * 绘制线
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 绘制几何对象
     * @param {Object}style 样式
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawLineString: function(ctx, geom, boolPixelCrs, linestyle, nodestyle, properties) {
        if (!linestyle) {
            return;
        }
        var proj = [],
            coords = this._clip(ctx, geom);
        for (var i = 0; i < coords.length; i++) {
            //if (this._map.getZoom() >= this.showNodeLevel && (i == 0 || i == coords.length - 1)) {
            //    this._drawPoint(ctx, coords[i], nodestyle, true);
            //}
            if (boolPixelCrs) {
                proj.push({
                    x: coords[i][0],
                    y: coords[i][1]
                });
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }
        }
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = linestyle.strokeColor;
        g.lineWidth = linestyle.strokeWidth;
        g.globalAlpha = linestyle.strokeOpacity || 1;//Opacity
        g.beginPath();
        for (var j = 0; j < proj.length; j++) {
            var method = (j === 0 ? 'move' : 'line') + 'To';
            g[method](proj[j].x, proj[j].y);
        }
        g.stroke();
        g.restore();
        if (properties.hasOwnProperty('symbol')) {
            //如果有symbol，则使用符号绘制
            this._drawLineStringWithSymbol(ctx, geom, boolPixelCrs, properties['symbol']);
        }
    },
    /***
     * 根据指定的符号名绘制线
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 绘制几何对象
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @symbol {Array}style 符号
     * @private
     */
    _drawLineStringWithSymbol: function(ctx, geom, boolPixelCrs, symbol) {
        if (!symbol) {
            return;
        }
        var geometry = [];
        //coords = this._clip(ctx, geom);
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
    },
    /***
     * 绘制polygon
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 几何对象
     * @param {Object}style 样式
     * @private
     */
    _drawPolygon: function(ctx, geom, style, boolPixelCrs) {
        if (!style) {
            return;
        }
        var coords = geom[0],
            proj = [],
            i;
        coords = this._clip(ctx, coords);
        for (var i = 0; i < coords.length; i++) {
            if (boolPixelCrs) {
                proj.push({
                    x: coords[i][0],
                    y: coords[i][1]
                });
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }
        }
        var g = ctx.canvas.getContext('2d');
        g.globalAlpha = style.fillOpacity;
        g.fillStyle = style.fillColor;
        if (style.strokeWidth > 0) {
            g.strokeStyle = style.strokeColor;
            g.lineWidth = style.strokeWidth;
        }
        g.beginPath();
        for (i = 0; i < proj.length; i++) {
            var method = (i === 0 ? 'move' : 'line') + 'To';
            g[method](proj[i].x, proj[i].y);
        }
        g.closePath();
        g.fill();
        if (style.strokeWidth > 0) {
            g.stroke();
        }
    },
    /**互联网rtic*/
    _drawrdrtic: function(ctx, geom, properties, boolPixelCrs) {
        var direct = null,
            stolecolor = null,
            reversecolor = null,
            coords = geom,
            proj = [],
            arrowlist = [];
        coords = this._clip(ctx, coords);
        for (var rtic = 0; rtic < coords.length; rtic++) {
            if (boolPixelCrs) {
                proj.push({
                    x: coords[rtic][0][0],
                    y: coords[rtic][0][1]
                });
            } else {
                proj.push(this._tilePoint(ctx, coords[rtic]));
            }
        }
        var g = ctx.canvas.getContext('2d');
        for (var rticj = 0; rticj < proj.length; rticj++) {
            var method = (rticj === 0 ? 'move' : 'line') + 'To';
            g[method](proj[rticj].x, proj[rticj].y);
            if (rticj < proj.length - 1) {
                var oneArrow = [proj[rticj], proj[rticj + 1]];
                arrowlist.push(oneArrow);
            }
        }
        if (properties.forwardLevel == 0) {
            stolecolor = "#808080"; //灰色
        } else if (properties.forwardLevel == 1) {
            stolecolor = "#FF0000"; //红色
        } else if (properties.forwardLevel == 2) {
            stolecolor = "#006400"; //绿色
        } else if (properties.forwardLevel == 3) {
            stolecolor = "#00008B"; //蓝色
        } else if (properties.forwardLevel == 4) {
            stolecolor = "#FF1493"; //粉色
        }
        if (properties.reverseLevel == 0) {
            reversecolor = "#808080"; //灰色
        } else if (properties.reverseLevel == 1) {
            reversecolor = "#FF0000"; //红色
        } else if (properties.reverseLevel == 2) {
            reversecolor = "#006400"; //绿色
        } else if (properties.reverseLevel == 3) {
            reversecolor = "#00008B"; //蓝色
        } else if (properties.reverseLevel == 4) {
            reversecolor = "#FF1493"; //粉色
        }
        if (properties.forwardLevel && properties.reverseLevel) {
            if (this._map.getZoom() >= this.showNodeLevel) {
                this._drawIntRticArrow(g, 2, arrowlist, stolecolor);
                this._drawIntRticArrow(g, 3, arrowlist, reversecolor);
                this._drawIntRticText(ctx, geom, properties.forwardInformation + "上", 2);
                this._drawIntRticText(ctx, geom, properties.reverseInformation + "下", 3);
            }
        } else {
            if (properties.forwardLevel) {
                direct = 2; //顺方向
            } else if (properties.reverseLevel) {
                direct = 3; //逆方向
            }
            if (direct == null || typeof(direct) == "undefined" || direct == "") {} else {
                if (this._map.getZoom() >= this.showNodeLevel) {
                    this._drawIntRticArrow(g, direct, arrowlist, (direct == 2 ? stolecolor : reversecolor));
                    if (direct === 2) {
                        this._drawIntRticText(ctx, geom, properties.forwardInformation + "上", 2);
                    }
                    if (direct === 3) {
                        this._drawIntRticText(ctx, geom, properties.reverseInformation + "下", 3);
                    }
                }
            }
        }
    },
    /***
     * _drawArrow绘制方向箭头
     * @param {Object}ctx
     * @param {Number}direct 绘制方向
     * @param {Array}data 点数组
     * * @param colors 点数组
     * @private
     */
    _drawIntRticArrow: function(ctx, direct, data, colors) {
        var ctx = ctx.canvas.getContext('2d');
        ctx.linewidth = 2;
        ctx.fillStyle = colors;
        if (direct == 0 || direct == 1) {
            return;
        }
        ctx.beginPath();
        var point1, point2;
        if (direct === 2) {
            point1 = data[data.length - 1][0];
            point2 = data[data.length - 1][1];
        } else if (direct === 3) {
            point1 = data[0][0];
            point2 = data[0][1];
        }
        var distance = this.distance(point1, point2);
        if (distance < 30) {
            return;
        }
        ctx.save();
        //var centerPoint = L.point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
        if (direct == 2) {
            var centerPoint = L.point(point2.x, point2.y);
        } else {
            var centerPoint = L.point(point1.x, point1.y);
        }
        ctx.translate(centerPoint.x, centerPoint.y);
        //先计算向量与y轴负方向向量(0,-1)的夹角
        var ang = 0;
        if (point1.y - point2.y == 0) {
            if (point1.x - point2.x > 0) {
                ang = Math.PI / -2;
            } else {
                ang = Math.PI / 2;
            }
        } else {
            ang = (point1.x - point2.x) / (point1.y - point2.y);
            ang = Math.atan(ang);
        }
        if (point2.y - point1.y >= 0) {
            if (direct == 2) {
                ctx.rotate(-ang);
            } else if (direct == 3) {
                ctx.rotate(-ang + Math.PI);
            }
        } else {
            if (direct == 2) {
                ctx.rotate(Math.PI - ang); //加个180度，反过来
            } else if (direct == 3) {
                ctx.rotate(-ang);
            }
        }
        ctx.lineTo(-6, -9);
        ctx.lineTo(0, 1);
        ctx.lineTo(6, -9);
        ctx.stroke();
        ctx.fill(); //箭头是个封闭图形
        ctx.closePath();
        ctx.restore(); //恢复到堆的上一个状态，其实这里没什么用。
    },
    _drawIntRticText: function(ctx, geom, name, direct) {
        geom = this._clip(ctx, geom);
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = "10px Courier New";
        g.textAlign = "center";
        var angle,
            nameArr = name.split(""),
            nameLen = name.length * 10,
            lineLen = 0;
        if (geom.length === 2) {
            angle = this._rotateAngle(geom[0], geom[1]);
            lineLen = this.distance(geom[0], geom[1]);
            if (nameLen < lineLen / 2 && lineLen > 160) {
                this._showIntRticTextOfAngle(g, 0, nameArr.length, name, angle, [(geom[0][0] + geom[1][0]) / 2, (geom[0][1] + geom[1][1]) / 2], direct);
            }
        } else {
            var startPoint = geom[0],
                startPointForLen = geom[0],
                endPoint = geom[geom.length - 1],
                textLength = 0,
                startText = 0,
                textIndex = 0,
                betPointsLen, realLineLen = 0,
                linkArrLen = geom.length;
            for (var m = 1; m < linkArrLen; m++) {
                betPointsLen = this.distance(geom[m], startPointForLen);
                realLineLen += betPointsLen;
                startPointForLen = geom[m];
            }
            if (nameLen < realLineLen / 2 && realLineLen > 50) {
                startPoint = geom[1]
                for (var linkFLag = 1; linkFLag < linkArrLen; linkFLag++) {
                    if (textLength < nameArr.length) {
                        betPointsLen = this.distance(geom[linkFLag], startPoint);
                        angle = this._rotateAngle(startPoint, geom[linkFLag]);
                        if (betPointsLen > 10) {
                            textIndex = parseInt(betPointsLen / 10);
                            this._showIntRticTextOfAngle(g, 0, nameArr.length, name, angle, startPoint, direct);
                            break;
                        } else {
                            startPoint = geom[linkFLag];
                        }
                    }
                }
            }
        }
    },
    _showIntRticTextOfAngle: function(ctx, start, end, name, angle, textGeom, direct) {
        var nameArr = name.split(""),
            PI = Math.PI;
        if (angle === 0) {
            if (direct === 2) {
                ctx.fillText(name, textGeom[0], textGeom[1] - 10);
            } else {
                ctx.fillText(name, textGeom[0], textGeom[1] + 13);
            }
            ctx.save();
        } else if ((angle < PI && angle > 2 * (PI / 5))) {
            if (direct === 2) {
                for (var l = start; l < end; l++) {
                    ctx.fillText(nameArr[l], textGeom[0] - 8, textGeom[1] + l * 14);
                    ctx.save();
                }
            } else {
                for (var i = start; i < end; i++) {
                    ctx.fillText(nameArr[i], textGeom[0] + 8, textGeom[1] + i * 14);
                    ctx.save();
                }
            }
        } else {
            var showName = name.substr(start, end);
            ctx.save();
            if (direct === 2) {
                ctx.translate(textGeom[0], textGeom[1] - 10);
            } else {
                ctx.translate(textGeom[0], textGeom[1] + 13);
            }
            ctx.rotate(angle);
            ctx.fillText(showName, 0, 0);
            ctx.restore();
        }
    },
    /**
     *行政区划画点画线
     * @param ctx
     * @param geom
     * @param boolPixelCrs
     * @param linestyle
     * @param nodestyle
     * @param properties
     * @private
     */
    _drawAdLineString: function(ctx, geom, boolPixelCrs, linestyle, nodestyle, properties) {
        if (!linestyle) {
            return;
        }
        var coords = geom,
            proj = [],
            arrowlist = [];
        coords = this._clip(ctx, coords);
        for (var i = 0; i < coords.length; i++) {
            if (this._map.getZoom() >= this.showNodeLevel && (i == 0 || i == coords.length - 1)) {
                if (i == 0) {
                    this._drawCircle(ctx, coords[i][0], nodestyle, true);
                } else if (coords[0][0][0] != coords[coords.length - 1][0][0] && coords[0][0][1] != coords[coords.length - 1][0][1]) {
                    this._drawCircle(ctx, coords[coords.length - 1][0], nodestyle, true);
                }
            }
            if (boolPixelCrs) {
                proj.push({
                    x: coords[i][0][0],
                    y: coords[i][0][1]
                });
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }
        }
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = linestyle.color;
        g.lineWidth = linestyle.size;
        g.beginPath();
        for (var j = 0; j < proj.length; j++) {
            var method = (j === 0 ? 'move' : 'line') + 'To';
            g[method](proj[j].x, proj[j].y);
        }
        g.stroke();
        g.restore();
    }
}
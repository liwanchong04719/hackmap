fastmap.uikit.canvasFeature = {};
fastmap.uikit.canvasFeature.Feature = L.Class.extend({
    geometry: null,
    properties: null,
    initialize: function(data) {
        this.geometry = {};
        this.properties = {};
        this.geometry['coordinates'] = data.g;
        this.properties['id'] = data.i;
        this.properties['style'] = {};
        this.setAttribute.apply(this, arguments);
    },
    setAttribute: function() {},
    statics: {
        create: function(data) {
            var ret = null;
            switch (data.t) {
                case 2: //照片
                    break;
                case 3: //交限
                    ret = new fastmap.uikit.canvasFeature.RdRestriction(data);
                    break;
                case 4: //rdlink
                    ret = new fastmap.uikit.canvasFeature.RdLink(data);
                    break;
                case 5: //车信
                    ret = new fastmap.uikit.canvasFeature.RdLaneConnexity(data);
                    break;
                case 6: //点限速
                    ret = new fastmap.uikit.canvasFeature.RdSpeedLimit(data);
                    break;
                case 7: //分歧
                    ret = new fastmap.uikit.canvasFeature.RdBranch(data);
                    break;
                case 8: //路口
                    ret = new fastmap.uikit.canvasFeature.RdCross(data);
                    break;
                case 9: //线限速
                    ret = new fastmap.uikit.canvasFeature.RdLinkSpeedLimit(data);
                    break;
                case 10: //rtic
                    ret = new fastmap.uikit.canvasFeature.RdRtic(data);
                    break;
                case 11: //立交
                    ret = new fastmap.uikit.canvasFeature.RdGsc(data);
                    break;
                case 12://行政区划线
                    ret = new fastmap.uikit.canvasFeature.AdLink(data);
                    break;
                case 13://行政区划面
                    ret = new fastmap.uikit.canvasFeature.AdFace(data);
                    break;
                case 14://铁路
                    ret = new fastmap.uikit.canvasFeature.RwLink(data);
                    break;
                case 15://行政区划点
                    if((data.g[0] >= -12 && data.g[0] <= 267) && (data.g[1] >= -12 && data.g[1] <= 267)) {
                        ret = new fastmap.uikit.canvasFeature.AdAdmin(data);
                    }
                    break;
                case 16://RDNODE
                    if((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new fastmap.uikit.canvasFeature.RdNode(data);
                    }
                    break;
                case 17://AdNode
                    if((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new fastmap.uikit.canvasFeature.AdNode(data);
                    }
                    break;
                case 18://zoneLink
                    ret = new fastmap.uikit.canvasFeature.ZoneLink(data);
                    break;
                case 19://zoneFace
                    ret = new fastmap.uikit.canvasFeature.ZoneFace(data);
                    break;
                case 20://zoneNode
                    if((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new fastmap.uikit.canvasFeature.ZoneNode(data);
                    }
                    break;
                case 21: //poi
                    // if((data.g[0] >= -5 && data.g[0] <= 260) && (data.g[1] >= -5 && data.g[1] <= 260)){
                    //     ret = new fastmap.uikit.canvasFeature.IXPOI(data);
                    // }
                    ret = new fastmap.uikit.canvasFeature.IXPOI(data);
                    break;
                case 22://rwNode
                    if((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new fastmap.uikit.canvasFeature.RwNode(data);
                    }
                    break;
                case 23://大门
                    ret = new fastmap.uikit.canvasFeature.RdGate(data);
                    break;
                case 24://坡度
                    ret = new fastmap.uikit.canvasFeature.RdSlope(data);
                    break;
                case 25://警示信息
                    ret = new fastmap.uikit.canvasFeature.RdWarningInfo(data);
                    break;
                case 26://电子眼
                    ret = new fastmap.uikit.canvasFeature.RdElectronicEye(data);
                    break;
                case 27://红绿灯
                    ret = new fastmap.uikit.canvasFeature.RdTrafficSignal(data);
                    break;
                case 28://LUNode
                    ret = new fastmap.uikit.canvasFeature.LUNode(data);
                    break;
                case 29://LULink
                    ret = new fastmap.uikit.canvasFeature.LULink(data);
                    break;
                case 30://LUFace
                    ret = new fastmap.uikit.canvasFeature.LUFace(data);
                    break;
                case 33://LCNode
                    ret = new fastmap.uikit.canvasFeature.LCNode(data);
                    break;
                case 31://LULink
                    ret = new fastmap.uikit.canvasFeature.LCLink(data);
                    break;
                case 32://LCFace
                    ret = new fastmap.uikit.canvasFeature.LCFace(data);
                    break;
                case 34://分叉口提示
                    ret = new fastmap.uikit.canvasFeature.RdSe(data);
                    break;
                case 35://顺行
                    ret = new fastmap.uikit.canvasFeature.RdDirectRoute(data);
                    break;
                case 36://减速带
                    ret = new fastmap.uikit.canvasFeature.RdSpeedBump(data);
                    break;
                case 37://同一点
                    if((data.g[0] >= -3 && data.g[0] <= 258) && (data.g[1] >= -3 && data.g[1] <= 258)) {
                        ret = new fastmap.uikit.canvasFeature.RdSameNode(data);
                    }
                    break;
                case 38://同一线
                    ret = new fastmap.uikit.canvasFeature.RdSameLink(data);
                    break;
                case 39://CRF交叉点
                    ret = new fastmap.uikit.canvasFeature.RdInter(data);
                    break;
                case 40://CRF道路
                    ret = new fastmap.uikit.canvasFeature.RdRoad(data);
                    break;
                case 41://CRF对象
                    ret = new fastmap.uikit.canvasFeature.RdObject(data);
                    break;
                case 42://收费站
                    ret = new fastmap.uikit.canvasFeature.RdTollgate(data);
                    break;
                case 44://语音导航
                    ret = new fastmap.uikit.canvasFeature.RdVoiceGuide(data);
                    break;
                case 43://收费站
                    ret = new fastmap.uikit.canvasFeature.RdVariableSpeed(data);
                    break;
                case 45: //rtic
                    ret = new fastmap.uikit.canvasFeature.RdRtic(data);
                    break;
                case 46: //CLM
                    ret = new fastmap.uikit.canvasFeature.RdLane(data);
                    break;
            }
            return ret;
        },
        transform: function(data) {
            var list = [];
            if (FM.Util.isObject(data)) {
                for (var key in data) {
                    for (var i = 0, n = data[key].length; i < n; i++) {
                        var tmp = fastmap.uikit.canvasFeature.Feature.create(data[key][i]);
                        if (FM.Util.isObject(tmp)) {
                            list.push(tmp);
                        } else if (FM.Util.isArray(tmp)) {
                            list = list.concat(tmp);
                        }
                    }
                }
            } else if (FM.Util.isArray(data)) {
                var temp = data;
                if (FM.Util.isArray(data[0])) {
                    temp = data[0];
                }
                for (var i = 0, n = temp.length; i < n; i++) {
                    var tmp = fastmap.uikit.canvasFeature.Feature.create(temp[i]);
                    if (FM.Util.isObject(tmp)) {
                        list.push(tmp);
                    } else if (FM.Util.isArray(tmp)) {
                        list = list.concat(tmp);
                    }
                }
            }
            return list;
        },
        getIconStyle: function(options) {
            var icon = {};
            icon["iconName"] = options.iconName || "";
            icon["row"] = options.row || "";
            icon["column"] = options.column || "";
            icon["status"] = options.status || null;
            icon["location"] = options.location || "";
            icon["rotate"] = options.rotate || "";
            icon["dx"] = options.dx || "";
            icon["dy"] = options.dy || "";
            icon["scalex"] = options.scalex || 1;
            icon["scaley"] = options.scaley || 1;
            icon["fillStyle"] = options.fillStyle || "";
            return icon;
        }
    }
});

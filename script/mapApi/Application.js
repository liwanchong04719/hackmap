"use strict"
// web app全局命名空间
var App = {};
// web app全局配置信息
App.Config = {
    appType: "WEB",
    serviceUrl: 'http://fs.navinfo.com',
    hbaseServiceUrl: "http://fastmap.navinfo.com/fos/datum",
    resourceUrl: "http://192.168.4.189/resources",
    specialUrl: "http://192.168.4.189/fos"
};
App.Temp = {
    accessToken: null,
    dbId: 17,
    subTaskId: 168,
    mdFlag: 'd',
    gridList: [60560301, 60560302, 60560303, 60560311, 60560312, 60560313, 60560322, 60560323, 60560331, 60560332, 60560333, 60560320, 60560330, 60560300, 60560321, 60560310],
    relationNameObj: {
        RDRESTRICTION: '交限',
        RDSPEEDLIMIT: '限速',
        RDBRANCH: '分歧',
        RDCROSS: '路口',
        RDLANECONNEXITY: '车信',
        RDLINKINTRTIC: '实时信息',
        RDGSC: '立交',
        RDWARNINGINFO:'警示信息',
        RDTRAFFICSIGNAL:'信号灯',
        RDELECTRONICEYE:'电子眼',
        RDSLOPE:'坡度',
        RDGATE:'大门',
        RDDIRECTROUTE:'顺行',
        RDSPEEDBUMP:'减速带',
        RDSE:'分叉口',
        RDINTER:'CRF交叉点',
        RDROAD:'CRF道路',
        RDOBJECT:'CRF对象',
        RDTOLLGATE:'收费站',
        RDVOICEGUIDE:'语音引导',
        RDSAMENODE:'同一点',
        RDSAMELINK:'同一线',
        RDLANE:'详细车道'
    }
};
// web app的公用函数命名空间
App.Util = {
    getAppPath: function() {
        return location.pathname.substr(0, location.pathname.indexOf("/apps"));
    },
    getFullUrl: function(url) {
        return App.Config.serviceUrl + "/" + url + "?access_token=" + (App.Temp.accessToken || "");
    },
    getHbaseUrl: function(url) {
        return App.Config.hbaseServiceUrl + "/" + url;
    },
    getSpecUrl: function(url) {
        return App.Config.specialUrl + "/" + url + "?access_token=" + (App.Temp.accessToken || "");
    },
    createTileRequestObject: function(url, requestType) {
        var reqObj = {};
        reqObj.url = App.Config.serviceUrl + url;
        reqObj.parameter = {
            dbId: App.Temp.dbId,
            gap: 80
        }
        if (requestType) {
            reqObj.parameter['types'] = requestType.split(',');
            if (requestType == "RDLINK") { //小于17级的时候用hbase渲染道路
                reqObj.hbaseUrl = reqObj.url;
            }
        }
        return reqObj;
    },
    createTileRequestObjectForTips: function(url, requestType) {
        var reqObj = {};
        reqObj.url = App.Config.serviceUrl + url;
        reqObj.parameter = {
            gap: 80,
            mdFlag: App.Temp.mdFlag,
        }
        if (requestType) {
            reqObj.parameter['types'] = requestType.split(',');
        }
        return reqObj;
    },
    getUrlParam: function(paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
    logout: function() {
        window.location.href = App.Util.getAppPath() + "/apps/imeep/login.html";
    }
};
//从url请求中获取token
App.Temp.accessToken = App.Util.getUrlParam("access_token");

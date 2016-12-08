/**
 * Created by zhongxiaoming on 2015/08/07.
 * Rebuild by chenxiao on 2016-06-30
 */
//App= {};
App.layersConfig = [{
    // 第三方的背景地图，以及图幅、网格和照片图层
    groupId: "backgroundLayers",
    groupName: "背景",
    layers: [

        {
        clazz: L.tileLayer,
        url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
        options: {
            id: 'tencent',
            name: '腾讯地图',
            subdomains: ["rt0", "rt1", "rt2", "rt3"],
            tms: true,
            selected: false,
            visible: false,
            added: true,
            singleSelect: true,
            maxZoom: 20,
            zIndex: 2
        }
    }

    ]
}, {
    // 主要用于加载17级以下的从hadoop库中取的路网数据
    groupId: "referenceLayers",
    groupName: "参考",
    layers: []
}, {
    groupId: "dataLayers",
    groupName: "数据",
    layers: [


        {
        url: '/smap/autoadas/linkinfo.json',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdLink',
            name: '道路线',
            // id: 'rdLink',
            maxZoom: 19,
            debug: false,
            // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: false,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'LineString',
            zIndex: 16,
            restrictZoom: 10,
            editable: false,
            visible: true,
            requestType: 'RDLINK',
            showNodeLevel: 17
        }
    }
        ,

        {
            url: '/smap/autoadas/rdlink.json',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                id: 'rdLink',
                name: '道路线',
                // id: 'rdLink',
                maxZoom: 19,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 5,
                boolPixelCrs: false,
                parse: fastmap.uikit.canvasFeature.Feature.transform,
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator: new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize: 256,
                type: 'LineString',
                zIndex: 16,
                restrictZoom: 10,
                editable: false,
                visible: true,
                requestType: 'RDLINK',
                showNodeLevel: 17
            }
        }
      ,
        {
            url: '/smap/autoadas/linkadas.json',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                id: 'rdLinkadas',
                name: '道路ADAS信息',
                // id: 'rdLink',
                maxZoom: 19,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 5,
                boolPixelCrs: false,
                parse: fastmap.uikit.canvasFeature.Feature.transform,
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator: new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize: 256,
                type: 'LineString',
                zIndex: 16,
                restrictZoom: 10,
                editable: false,
                visible: true,
                requestType: 'RDLINK',
                showNodeLevel: 17
            }
        },


        {
            url: '/smap/autoadas/event.json',
            clazz: fastmap.mapApi.tileJSON,
            options: {
               name: 'event信息',
               id: 'event',
               maxZoom: 20,
               debug: false,
               // this value should be equal to 'radius' of your points
               buffer: 10,
               boolPixelCrs: false,
               parse: fastmap.uikit.canvasFeature.Feature.transform,
               boundsArr: [],
               unloadInvisibleTiles: true,
               reuseTiles: false,
               mecator: new fastmap.mapApi.MecatorTranform(),
               updateWhenIdle: true,
               tileSize: 256,
               type: 'PointFeature',
               zIndex: 40,
               restrictZoom: 10,
               visible: true,
               requestType: 'IXPOI',
               showNodeLevel: 16
            }
        },


        {
            url: '/smap/autoadas/poiinfo.json',
            clazz: fastmap.mapApi.tileJSON,
            options: {
           name: 'poi信息',
           id: 'poi',
           maxZoom: 20,
           debug: false,
           // this value should be equal to 'radius' of your points
           buffer: 10,
           boolPixelCrs: false,
           parse: fastmap.uikit.canvasFeature.Feature.transform,
           boundsArr: [],
           unloadInvisibleTiles: true,
           reuseTiles: false,
           mecator: new fastmap.mapApi.MecatorTranform(),
           updateWhenIdle: true,
           tileSize: 256,
           type: 'PointFeature',
           zIndex: 40,
           restrictZoom: 10,
           visible: true,
           requestType: 'IXPOI',
           showNodeLevel: 16
            }
        }


    ]
}];

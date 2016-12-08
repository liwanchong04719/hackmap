fastmap.uikit.canvasFeature.IXPOI = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.geometry['type'] = 'Point';
        this.properties["featType"] = "IXPOI";
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        // this.properties['guide'] = data.m.c;
        // this.properties['kindCode'] = data.m.d;
        // this.properties['name'] = data.m.e;
        // this.properties['indoor'] = data.m.g;
        var redFill = {
            lineColor: '#FF0000',
            fillColor: 'rgba(225,225,225,0.5)',
            fillType :'IXPOI'
        };
        var blueFill = {
            lineColor: '#0000FF',
            fillColor: 'rgba(225,225,225,0.5)',
            fillType :'IXPOI'
        };
        var grayFill = {
            lineColor: '#999999',
            fillColor: 'rgba(225,225,225,0.5)',
            fillType :'IXPOI'
        };
        var poiColor = redFill;
        // if(data.m.b == 1){
        //     poiColor = redFill;
        // }else if(data.m.b == 2){
        //     poiColor = blueFill;
        // }else if(data.m.b == 3){
        //     poiColor = grayFill;
        // }
        // if(data.m.f){
        //     if(data.m.f == 1){
        //         this.properties['same'] = data.m.f;
        //         this.properties['markerStyle']["icon"].push(
        //             fastmap.uikit.canvasFeature.Feature.getIconStyle({
        //                 iconName: 'images/poi/map/poi_s.png',
        //                 row: 0,
        //                 column: 1,
        //                 location: this.geometry['coordinates']
        //                 // fillStyle:poiColor
        //             })
        //         );
        //     }
        // }else {
        //     this.properties['same'] = 0;
        //     if(data.m.a == 1){
        //         this.properties['markerStyle']["icon"].push(
        //             fastmap.uikit.canvasFeature.Feature.getIconStyle({
        //                 iconName: 'images/poi/map/poi_p.png',
        //                 row: 0,
        //                 column: 1,
        //                 location: this.geometry['coordinates']
        //                 // fillStyle:poiColor
        //             })
        //         );
        //     }else if(data.m.a == 2){
        //         this.properties['markerStyle']["icon"].push(
        //             fastmap.uikit.canvasFeature.Feature.getIconStyle({
        //                 iconName: 'images/poi/map/poi_c.png',
        //                 row: 0,
        //                 column: 1,
        //                 location: this.geometry['coordinates']
        //                 // fillStyle:poiColor
        //             })
        //         );
        //     }else if(data.m.a == 3){
        //         this.properties['markerStyle']["icon"].push(
        //             fastmap.uikit.canvasFeature.Feature.getIconStyle({
        //                 iconName: 'images/poi/map/poi_pc.png',
        //                 row: 0,
        //                 column: 1,
        //                 location: this.geometry['coordinates']
        //                 // fillStyle:poiColor
        //             })
        //         );
        //     }else {
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: 'images/poi/map/poi_n.png',
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates']
                        // fillStyle:poiColor
                    })
                );
            //}
        //}
    }
});
fastmap.uikit.canvasFeature.RdLink = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function(data) {
        var RD_LINK_Colors = [
            '#646464', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
            '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
            '#000000', '#7364C8', '#000000', '#DCBEBE'
        ];
        this.geometry['type'] = 'LineString';
        this.properties["featType"] = "RDLINK";
        // this.properties['name'] = data.m.b;
        // this.properties['direct'] = data.m.d;
        // this.properties['snode'] = data.m.e;
        // this.properties['enode'] = data.m.f;
        // this.properties['limit'] = data.m.c;
        // this.properties['form'] = data.m.h;
        // this.properties['fc'] = data.m.i;
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var compositeSymbol = symbolFactory.createSymbol('CompositeLineSymbol');
        if (this.properties['form'] && this.properties['form'].indexOf('30') !== -1) {
            var symbolData = {
                type: 'HashLineSymbol',
                hashHeight: 6,
                hashOffset: 0,
                hashAngle: -90,
                hashSymbol: {
                    type: 'SampleLineSymbol',
                    color: RD_LINK_Colors[parseInt(data.m.a)],
                    width: 1,
                    style: 'solid'
                },
                pattern: [2, 5]
            };
            var subSymbol = symbolFactory.dataToSymbol(symbolData);
            compositeSymbol.symbols.push(subSymbol);
        }
        if (this.properties['limit'] && this.properties['limit'].indexOf('4') !== -1) {
            var symbolData = {
                type: 'MarkerLineSymbol',
                markerSymbol: {
                    type: 'TiltedCrossPointSymbol',
                    size: 3,
                    color: 'red',
                    angle: 0,
                    offsetX: 0,
                    offsetY: 0,
                    hasOutLine: false,
                    outLineColor: 'black',
                    outLineWidth: 1
                },
                pattern: [2, 10]
            };
            var subSymbol = symbolFactory.dataToSymbol(symbolData);
            compositeSymbol.symbols.push(subSymbol);
        }
        if (this.properties['form'] && this.properties['form'].indexOf('52') !== -1) {
            var symbolData = {
                type: 'CompositeLineSymbol',
                symbols: [{
                    type: 'SampleLineSymbol',
                    color: 'gray',
                    width: 1,
                    style: 'solid'
                        }, {
                    type: 'CartoLineSymbol',
                    color: 'blue',
                    width: 1,
                    pattern: [4, 4, 12, 4]
                        }]
            };
            var subSymbol = symbolFactory.dataToSymbol(symbolData);
            compositeSymbol.symbols.push(subSymbol);
        }
        this.properties['symbol'] = compositeSymbol;
        this.properties['style']['strokeColor'] = RD_LINK_Colors[6];
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
    },
});
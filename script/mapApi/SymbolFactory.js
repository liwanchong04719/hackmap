/**
 * Created by xujie on 2016/5/11 0011.
 */
fastmap.mapApi.symbol.GetSymbolFactory = function () {
    var instantiated;
    var symbolGallery = {};

    var SymbolFactory = L.Class.extend({
        /**
         * 解析配置文件，创建符号
         * @method loadSymbols
         * @param symbolData
         */
        loadSymbols: function (symbolData) {
            for (var i = 0; i < symbolData.length; ++i) {
                var data = symbolData[i];
                var symbol = this.dataToSymbol(data);
                this.addSymbol(data.name, symbol);
            }
        },

        /**
         * 将配置解析成不同的symbol
         * @method createSymbol
         * @param data
         */
        dataToSymbol: function (data) {
            var type = data.type;
            var symbol = this.createSymbol(type);
            switch (type) {
                case 'CirclePointSymbol':
                    symbol.radius = data.radius;
                    symbol.color = data.color;
                    symbol.width = data.width;
                    symbol.offsetX = data.offsetX;
                    symbol.offsetY = data.offsetY;
                    break;
                case 'SolidCirclePointSymbol':
                    symbol.radius = data.radius;
                    symbol.color = data.color;
                    symbol.offsetX = data.offsetX;
                    symbol.offsetY = data.offsetY;
                    symbol.hasOutLine = data.hasOutLine;
                    symbol.outLineColor = data.color;
                    symbol.outLineWidth = data.width;
                    break;
                case 'SquarePointSymbol':
                    symbol.size = data.size;
                    symbol.color = data.color;
                    symbol.width = data.width;
                    symbol.angle = data.angle;
                    symbol.offsetX = data.offsetX;
                    symbol.offsetY = data.offsetY;
                    break;
                case 'SolidSquarePointSymbol':
                    symbol.size = data.size;
                    symbol.color = data.color;
                    symbol.angle = data.angle;
                    symbol.offsetX = data.offsetX;
                    symbol.offsetY = data.offsetY;
                    symbol.hasOutLine = data.hasOutLine;
                    symbol.outLineColor = data.color;
                    symbol.outLineWidth = data.width;
                    break;
                case 'CrossPointSymbol':
                    symbol.size = data.size;
                    symbol.color = data.color;
                    symbol.width = data.width;
                    symbol.angle = data.angle;
                    symbol.offsetX = data.offsetX;
                    symbol.offsetY = data.offsetY;
                    symbol.hasOutLine = data.hasOutLine;
                    symbol.outLineColor = data.color;
                    symbol.outLineWidth = data.width;
                    break;
                case 'TiltedCrossPointSymbol':
                    symbol.size = data.size;
                    symbol.color = data.color;
                    symbol.width = data.width;
                    symbol.angle = data.angle;
                    symbol.offsetX = data.offsetX;
                    symbol.offsetY = data.offsetY;
                    symbol.hasOutLine = data.hasOutLine;
                    symbol.outLineColor = data.color;
                    symbol.outLineWidth = data.width;
                    break;
                case 'PicturePointSymbol':
                    symbol.image = data.image;
                    symbol.size = data.size;
                    symbol.angle = data.angle;
                    symbol.offsetX = data.offsetX;
                    symbol.offsetY = data.offsetY;
                    symbol.hasOutLine = data.hasOutLine;
                    symbol.outLineColor = data.outLineColor;
                    symbol.outLineWidth = data.outLineWidth;
                    break;
                case 'CompositePointSymbol':
                    for (var i = 0; i < data.symbols.length; ++i) {
                        symbol.symbols.push(this.dataToSymbol(data.symbols[i]));
                    }
                    break;
                case 'SampleLineSymbol':
                    symbol.color = data.color;
                    symbol.width = data.width;
                    symbol.style = data.style;
                    break;
                case 'CartoLineSymbol':
                    symbol.color = data.color;
                    symbol.width = data.width;
                    symbol.template.pattern = data.pattern;
                    break;
                case 'MarkerLineSymbol':
                    symbol.url = data.url;
                    symbol.color = data.color;
                    symbol.width = data.width;
                    symbol.markerSymbol = this.dataToSymbol(data.markerSymbol);
                    symbol.template.pattern = data.pattern;
                    break;
                case 'HashLineSymbol':
                    symbol.hashHeight = data.hashHeight;
                    symbol.hashOffset = data.hashOffset;
                    symbol.hashAngle = data.hashAngle;
                    symbol.hashSymbol = this.dataToSymbol(data.hashSymbol);
                    symbol.template.pattern = data.pattern;
                    break;
                case 'CompositeLineSymbol':
                    for (var i = 0; i < data.symbols.length; ++i) {
                        symbol.symbols.push(this.dataToSymbol(data.symbols[i]));
                    }
                    break;
                default:
                    symbol = null;
                    break;
            }

            return symbol;
        },

        /**
         * 创建符号对象
         * @method createSymbol
         * @param symbolType
         */
        createSymbol: function (symbolType) {
            switch (symbolType) {
                case 'CirclePointSymbol':
                    return new fastmap.mapApi.symbol.CirclePointSymbol();
                case 'SolidCirclePointSymbol':
                    return new fastmap.mapApi.symbol.SolidCirclePointSymbol();
                case 'SquarePointSymbol':
                    return new fastmap.mapApi.symbol.SquarePointSymbol();
                case 'SolidSquarePointSymbol':
                    return new fastmap.mapApi.symbol.SolidSquarePointSymbol();
                case 'CrossPointSymbol':
                    return new fastmap.mapApi.symbol.CrossPointSymbol();
                case 'TiltedCrossPointSymbol':
                    return new fastmap.mapApi.symbol.TiltedCrossPointSymbol();
                case 'PicturePointSymbol':
                    return new fastmap.mapApi.symbol.PicturePointSymbol();
                case 'CompositePointSymbol':
                    return new fastmap.mapApi.symbol.CompositePointSymbol();
                case 'SampleLineSymbol':
                    return new fastmap.mapApi.symbol.SampleLineSymbol();
                case 'CartoLineSymbol':
                    return new fastmap.mapApi.symbol.CartoLineSymbol();
                case 'MarkerLineSymbol':
                    return new fastmap.mapApi.symbol.MarkerLineSymbol();
                case 'HashLineSymbol':
                    return new fastmap.mapApi.symbol.HashLineSymbol();
                case 'CompositeLineSymbol':
                    return new fastmap.mapApi.symbol.CompositeLineSymbol();
                default:
                    throw new Error('不支持的符号类型: ' + symbolType);
            }
        },

        /**
         * 根据名称查找预定义的符号
         * @method getSymbol
         * @param symbolName
         */
        getSymbol: function (symbolName) {
            return symbolGallery[symbolName];
        },

        /**
         * 检查符号库是否包含指定名字的符号
         * @method containSymbol
         * @param symbolName
         */
        containSymbol: function (symbolName) {
            return symbolGallery.hasOwnProperty(symbolName);
        },

        /**
         * 返回符号库中所有的符号名字
         * @method getSymbols
         */
        getSymbolNames: function () {
            var symbols = [];
            for (var p in symbolGallery) {
                if (symbolGallery.hasOwnProperty(p)) {
                    symbols.push(p);
                }
            }
            return symbols;
        },

        /**
         * 向符号库中添加指定名字的符号
         * 如果已经存在同名符号，添加失败，返回false
         * @method addSymbol
         * @param symbol
         * @param symbolName
         */
        addSymbol: function (symbolName, symbol) {
            if (symbolGallery.hasOwnProperty(symbolName)) {
                return false;
            }

            symbolGallery[symbolName] = symbol;
            return true;
        },

        /**
         * 根据名称删除符号，如果不存在指定名称的符号，什么也不做
         * @method removeSymbol
         * @param symbolName
         */
        removeSymbol: function (symbolName) {
            if (symbolGallery.hasOwnProperty(symbolName)) {
                delete symbolGallery[symbolName];
            }
        }
    });

    return function () {
        if (!instantiated) {
            instantiated = new SymbolFactory();
            instantiated.loadSymbols(fastmap.mapApi.symbol.symbols);
        }
        return instantiated;
    }
}();

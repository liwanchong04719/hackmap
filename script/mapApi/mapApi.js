/**
 * Created by liwanchong on 2016/4/28.
 */
(function() {
    var singleFile = (typeof FastMap == "object" && FastMap.singleFile);
    /**
     * Relative path of this script.
     */
    var scriptName = (!singleFile) ? "fastmap/lib/fastmapapi.js" : "fastmapapi.js";
    var jsFiles = window.FastMap;
    window.FastMap = {
        _getScriptLocation: (function() {
            var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "";
            for (var i = 0, len = s.length; i < len; i++) {
                src = s[i].getAttribute('src');
                if (src) {
                    m = src.match(r);
                    if (m) {
                        l = m[1];
                        break;
                    }
                }
            }
            return (function() {
                return l;
            });
        })(),
        ImgPath: ''
    };
    jsFiles = ["mapApi/fastmap.js", "mapApi/geometry/Geometry.js", "mapApi/geometry/Collection.js", "mapApi/geometry/Point.js", "mapApi/geometry/LineString.js", "mapApi/geometry/Polygon.js", "mapApi/geometry/LinearRing.js", "mapApi/geometry/MultiPolygon.js", "mapApi/geometry/MultiPolyline.js",
        //mapApi/
        "mapApi/Bounds.js", "mapApi/Map.js", "mapApi/MecatorTransform.js", "mapApi/Tile.js", "mapApi/ShapeOptionTypeEnum.js",
        //mapApi/layer
        "mapApi/layer/Layer.js", "mapApi/layer/WholeLayer.js", "mapApi/layer/MeshLayer.js", "mapApi/LayerRender.js", "mapApi/layer/TileJSONLayer.js", "mapApi/layer/EditLayer.js", "mapApi/layer/GuideLineLayer.js", "mapApi/layer/GridLayer.js", "mapApi/ajaxConstruct.js", "mapApi/L.FloatMenu.js",
        //mapApi/tools
        "mapApi/tools/adAdminAdd.js", "mapApi/tools/adAdminMove.js", "mapApi/tools/poiLocMove.js", "mapApi/tools/poiGuideMove.js", "mapApi/tools/CrossingAdd.js", "mapApi/tools/DrawPath.js", "mapApi/tools/DrawPolygon.js", "mapApi/tools/GeometryValidation.js",
        //"mapApi/tools/HighLightRender.js",
        "mapApi/tools/PathBreak.js", "mapApi/tools/PathCopy.js", "mapApi/tools/PathCut.js", "mapApi/tools/PathMove.js", "mapApi/tools/PathNodeMove.js", "mapApi/tools/PathSmooth.js", "mapApi/tools/PathVertexAdd.js", "mapApi/tools/PathVertexInsert.js", "mapApi/tools/PathVertexMove.js", "mapApi/tools/PathVertexRemove.js", "mapApi/tools/PointVertexAdd.js", "mapApi/tools/PointVertexMove.js", "mapApi/tools/ShapeEditorFactory.js", "mapApi/tools/ShapeEditorResult.js", "mapApi/tools/ShapeEditorResultFeedback.js", "mapApi/tools/PathBuffer.js", "mapApi/tools/Snap.js", "mapApi/tools/TransformDirection.js", "mapApi/symbol/Point.js",
        //symbol
        "mapApi/symbol/Matrix.js", "mapApi/symbol/Vector.js", "mapApi/symbol/Point.js", "mapApi/symbol/LineSegment.js", "mapApi/symbol/LineString.js", "mapApi/symbol/Template.js", "mapApi/symbol/CirclePointSymbol.js", "mapApi/symbol/SolidCirclePointSymbol.js", "mapApi/symbol/SquarePointSymbol.js", "mapApi/symbol/SolidSquarePointSymbol.js", "mapApi/symbol/CrossPointSymbol.js", "mapApi/symbol/TiltedCrossPointSymbol.js", "mapApi/symbol/PicturePointSymbol.js", "mapApi/symbol/CompositePointSymbol.js", "mapApi/symbol/SampleLineSymbol.js", "mapApi/symbol/CartoLineSymbol.js", "mapApi/symbol/MarkerLineSymbol.js", "mapApi/symbol/HashLineSymbol.js", "mapApi/symbol/CompositeLineSymbol.js", "mapApi/symbol/SymbolsFile.js", "mapApi/symbol/SymbolFactory.js"
    ]; // etc.
    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = "../../scripts/";
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();
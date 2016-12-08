/**
 * Created by wangtun on 2015/9/10.
 * MultiPolyline对象
 * @namespace fast.mapApi
 * @class MultiPolyline
 */
fastmap.mapApi.MultiPolyline = fastmap.mapApi.Collection.extend({
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "MultiPolyline",
    /**
     * 构造函数
     * @class MultiPolyline
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}coordinates
     * @param {Object}options
     */
    initialize: function (coordinates, options) {
        this.coordinates = coordinates;
        this.options = options;
    },
    /**
     * 在MultiPolylineZ中怎加lineString
     * @method appendLineString
     * @param {LineString}lineString
     */
    appendLineString: function (lineString) {

    },
    /**
     * 获取一份完整的MultiPolyline
     * @method clone
     * @returns {L.MultiPolyline}
     */
    clone: function () {
        var lineStrings = new fastmap.mapApi.MultiPolyline(null);
        return lineStrings;
    },

    /**
     * 切分几何.
     * @method splitWith
     * @return {Array} 几何对象集合
     */
    split:function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, sourceLine, sourceLines, sourceSplit, targetSplit;
        var sourceParts = [];
        var targetParts = [geometry];
        for(var i=0, len=this.components.length; i<len; ++i) {
            sourceLine = this.components[i];
            sourceSplit = false;
            for(var j=0; j < targetParts.length; ++j) {
                splits = sourceLine.split(targetParts[j], options);
                if(splits) {
                    if(mutual) {
                        sourceLines = splits[0];
                        for(var k=0, klen=sourceLines.length; k<klen; ++k) {
                            if(k===0 && sourceParts.length) {
                                sourceParts[sourceParts.length-1].addComponent(
                                    sourceLines[k]
                                );
                            } else {
                                sourceParts.push(
                                    new fastmap.mapApi.multiPolyline([
                                        sourceLines[k]
                                    ])
                                );
                            }
                        }
                        sourceSplit = true;
                        splits = splits[1];
                    }
                    if(splits.length) {
                        // splice in new target parts
                        splits.unshift(j, 1);
                        Array.prototype.splice.apply(targetParts, splits);
                        break;
                    }
                }
            }
            if(!sourceSplit) {
                // source line was not hit
                if(sourceParts.length) {
                    // add line to existing multi
                    sourceParts[sourceParts.length-1].addComponent(
                        sourceLine.clone()
                    );
                } else {
                    // create a fresh multi
                    sourceParts = [
                        new fastmap.mapApi.multiPolyline(
                            sourceLine.clone()
                        )
                    ];
                }
            }
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * 切分几何.
     * @method splitWith
     * @return {Array} 几何对象集合
     */
    splitWith: function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, targetLine, sourceLines, sourceSplit, targetSplit, sourceParts, targetParts;
        if(geometry instanceof fastmap.mapApi.LineString) {
            targetParts = [];
            sourceParts = [geometry];
            for(var i=0, len=this.components.length; i<len; ++i) {
                targetSplit = false;
                targetLine = this.components[i];
                for(var j=0; j<sourceParts.length; ++j) {
                    splits = sourceParts[j].split(targetLine, options);
                    if(splits) {
                        if(mutual) {
                            sourceLines = splits[0];
                            if(sourceLines.length) {
                                // splice in new source parts
                                sourceLines.unshift(j, 1);
                                Array.prototype.splice.apply(sourceParts, sourceLines);
                                j += sourceLines.length - 2;
                            }
                            splits = splits[1];
                            if(splits.length === 0) {
                                splits = [targetLine.clone()];
                            }
                        }
                        for(var k=0, klen=splits.length; k<klen; ++k) {
                            if(k===0 && targetParts.length) {
                                targetParts[targetParts.length-1].addComponent(
                                    splits[k]
                                );
                            } else {
                                targetParts.push(
                                    new fastmap.mapApi.multiPolyline([
                                        splits[k]
                                    ])
                                );
                            }
                        }
                        targetSplit = true;
                    }
                }
                if(!targetSplit) {
                    // target component was not hit
                    if(targetParts.length) {
                        // add it to any existing multi-line
                        targetParts[targetParts.length-1].addComponent(
                            targetLine.clone()
                        );
                    } else {
                        // or start with a fresh multi-line
                        targetParts = [
                            new fastmap.mapApi.multiPolyline([
                                targetLine.clone()
                            ])
                        ];
                    }

                }
            }
        } else {
            results = geometry.split(this);
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * 获取坐标数组
     * @method getCoordinates
     */
    getCoordinates: function () {

    },
    /**
     * 获得MultiPolyline中的单个lineString
     * @method getLineString
     * @param {Number}index
     * @returns {fastmap.mapApi.LineString}
     */
    getLineString: function (index) {
        var lineString = new fastmap.mapApi.LineString(null);
        return lineString;
    },
    /**
     * 获得MultiPolyline中的全部lineString
     * @method getLineStrings
     * @returns {Array}
     */
    getLineStrings: function () {
        var lineStrings = [];
        return lineStrings;
    },
    /**
     * set lineStrings
     * @method setLineString
     * @param {Array}lineStrings
     */
    setLineStrings: function (lineStrings) {

    },
    /**
     * 获取最近的点
     * @method closestPointXY
     */
    closestPointXY: function () {

    },
    /**
     * 是否相交
     * @method intersectsExtend
     * @param {object}extend
     */
    intersectsExtent: function (extend) {

    },
    /**
     * 获取MultiPolyline内环
     * @param {Number}squaredTolerance
     * @returns {L.MultiPolyline}
     */
    getSimplifiedGeometryInternal: function (squaredTolerance) {
        var simplifiedFlatCoordinates = [];
        var simplifiedMultiLineString = new fastmap.mapApi.MultiPolyline(null);
        return simplifiedMultiLineString;
    }
});
fastmap.mapApi.multiPolyline=function(coordiates,options) {
    return new fastmap.mapApi.MultiPolyline(coordiates, options);
};

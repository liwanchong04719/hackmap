/**
 * Created by xujie on 2016/5/12 0012.
 */

/**
 * Created by xujie on 2016/5/11 0011.
 */
fastmap.mapApi.symbol.Template = L.Class.extend({

    initialize: function (pattern, lineString) {
        if (pattern !== undefined) {
            this.pattern = pattern;
        } else {
            this.pattern = [];
        }

        if (lineString !== undefined) {
            this.lineString = lineString;
        } else {
            this.lineString = null;
        }
    },

    /**
     * 将传入的线几何坐标按照模式切分成若干小段
     * 如果pattern元素为0，则返回[LineString]
     * 如果线几何坐标元素小于2，返回[]
     * @method getSegments
     * @return Array [lineString,lineString,...]
     */
    getSegments: function () {
        var segments = [];

        if (this.lineString.coordinates.length < 2) {
            return segments;
        }

        if (this.pattern.length === 0) {
            segments.push(this.lineString.clone());
            return segments;
        }

        //处理pattern，确保包含偶数个元素
        var newPattern = this.processPattern(this.pattern);

        //计算pattern的总长度
        var patternLength = this.getPatternLength(newPattern);

        //将线几何按照模式总长度打段
        this.breakGeometry(patternLength, this.lineString, segments);

        return segments;
    },

    /**
     * 将segment按照pattern每个元素依次打段
     * 返回下标为偶数的子段，不改变segment
     * segment长度必须小于等于pattern总长度
     * 超出部分将被忽略
     * pattern值为0的元素将被忽略
     * @method getMarks
     * @param segment 要打断的几何
     * @return Array 所有下标为偶数的子段
     */
    getMarks: function (segment) {

        var pattern = this.processPattern(this.pattern);

        var marks = [];
        if (pattern.length === 0) {
            marks.push(segment);
            return marks;
        }

        var sourceSegment = segment;
        for (var i = 0; i < pattern.length; ++i) {
            var subSegments = sourceSegment.splitByLength(pattern[i]);
            if (i % 2 === 0 && subSegments[0] !== null) {
                marks.push(subSegments[0]);//取下标为偶数的subSegment作为mark
            }

            //当segment长度小于等于pattern长度时，subSegments[1]为[]
            if (subSegments[1] === null) {
                break;
            }

            sourceSegment = subSegments[1];
        }

        return marks;
    },

    /**
     * 将线几何按照pattern长度依次打段成若干段，不改变原几何
     * 当线长度小于或者等于length时，
     * segments包含一条几何，与原几何相等，但不是同一对象
     * @method breakGeometry
     * @param length 模式的总长度
     * @param lineString 要切分的几何
     * @param segments 切分产生的结果
     */
    breakGeometry: function (length, lineString, segments) {
        //计算geometry长度
        var geometryLength = lineString.length();

        //如果geometry长度不足以再次切分，停止切分
        if (length <= 0 || geometryLength <= length) {
            var newGeometry = lineString.clone();//拷贝geometry
            segments.push(newGeometry);

            return;
        }

        //将几何切分成两段
        var subLineStrings = lineString.splitByLength(length);

        //将切下来的第一段加入segments
        segments.push(subLineStrings[0]);

        // 第二段递归处理，继续切分
        this.breakGeometry(length, subLineStrings[1], segments);
    },

    /**
     * 计算模式长度
     * @method getPatternLength
     * @param patternArray
     * @return number pattern总长度
     */
    getPatternLength: function (patternArray) {
        var length = 0;

        for (var i = 0; i < patternArray.length; ++i) {
            length += patternArray[i];
        }

        return length;
    },

    /**
     * 对模式进行处理，如果模式元素是奇数个，
     * 则将模式重复一遍以保证模式元素总是偶数个
     * @method processPattern
     * @param patternArray
     */
    processPattern: function (patternArray) {

        if (patternArray.length % 2 !== 0) {
            return patternArray = patternArray.concat(patternArray);
        }

        return patternArray;
    }
});


/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorResultFeedback
 */

fastmap.mapApi.ShapeEditResultFeedback = L.Class.extend({


    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);

        this.eventController = fastmap.uikit.EventController();
        this.tooltip = {};
        this.map = {};
    },

    /***
     *开始编辑
     * @param {Object}data
     * @constructor
     */
    setupFeedback: function (data) {
        this.eventController.fire(this.eventController.eventTypes.STARTSHAPEEDITRESULTFEEDBACK, data);
    },

    /***
     * 放弃编辑
     */
    abortFeedback: function(data){
        this.eventController.fire(this.eventController.eventTypes.ABORTSHAPEEDITRESULTFEEDBACK, data);
    },

    showTooltip: function () {

    },

    /***
     * 停止编辑
     */
    stopFeedback: function () {
        this.eventController.fire(this.eventController.eventTypes.STOPSHAPEEDITRESULTFEEDBACK);
    }
})

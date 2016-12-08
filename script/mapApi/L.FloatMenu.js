/**
 * Created by wangtun on 2016/3/31.
 */
L.Control.FloatMenu = fastmap.mapApi.Layer.extend({
    initialize: function(pid, mouseEvent, options) {
        this.selectObjPid = pid;
        this._mouseEvent = mouseEvent;
        this.items = options.items || [];
        this.visible = false;
        L.Util.setOptions(this, options);
    },
    onAdd: function(map) {
        this._latlng = map.mouseEventToLatLng(this._mouseEvent);
        this._el = L.DomUtil.create('div', 'leaflet-layer leaflet-zoom-hide');
        this.toolBarContainer = L.DomUtil.create('ul', 'floatMenu');
        this._map = map;
        var buttons = [];
        for (var i = 0; i < this.items.length; i++) {
            buttons.push(this._createButton(this.items[i].text, this.items[i].title, this.items[i].type, this.items[i].class || "", this.toolBarContainer, this.items[i].callback, this));
        }
        this._el.appendChild(this.toolBarContainer);
        map.getPanes().overlayPane.appendChild(this._el);
        if (this._map.getPanes().overlayPane.style.zIndex == "1") {
            this._map.getPanes().overlayPane.style.zIndex = "4";
        }
        // add a viewreset event listener for updating layer's position, do the latter
        map.on('viewreset', this._reset, this);
        map.on('moveend', this._reset, this);
        this._reset();
    },
    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
        map.off('moveend', this._reset, this);
        this._el = null;
        this.toolBarContainer = null;
        this._latlng = null;
        this._mouseEvent = null;
        this.items = null;
        this.visible = false;
        this.selectObjPid = null;
        this._map = null;
    },
    setVisible: function(flag) {
        var buttons = $(".floatMenu>li");
        this.visible = flag;
        var r = 50,
            n = buttons.length;
        if (flag) {
            $(".floatMenu").show();
            setTimeout(function() {
                for (var i = 0, len = buttons.length; i < len; i++) {
                    var transformStr = "translate(" + (r * Math.cos((45 - 180 / n * i) * (Math.PI / 180))) + "px," + (-r * Math.sin((45 - 180 / n * i) * (Math.PI / 180))) + "px)";
                    $(buttons[i]).css("display", "block").css({
                        "-ms-transform": transformStr,
                        "-webkit-transform": transformStr,
                        "-moz-transform": transformStr,
                        "-o-transform": transformStr,
                        "transform": transformStr,
                        "-ms-transition": '0.5s',
                        "-webkit-transition": '0.5s',
                        "-moz-transition": '0.5s',
                        "-o-transition": '0.5s',
                        "transition": '0.5s'
                    })
                }
            }, 10)
        } else {
            for (var i = 0, len = buttons.length; i < len; i++) {
                $(buttons[i]).css({
                    "-ms-transform": "translate(0px,0px)",
                    "-webkit-transform": "translate(0px,0px)",
                    "-moz-transform": "translate(0px,0px)",
                    "-o-transform": "translate(0px,0px)",
                    "transform": "translate(0px,0px)",
                    "-ms-transition": "1s",
                    "-webkit-transition": '1s',
                    "-moz-transition": '1s',
                    "-o-transition": '1s',
                    "transition": '1s'
                })
            }
            setTimeout(function() {
                $(".floatMenu").hide();
            }, 1000)
        }
    },
    _createButton: function(html, title, type, className, container, fn, context) {
        var link = L.DomUtil.create('li', className, container);
        link.innerHTML = html;
        link.type = type;
        link.title = title;
        var stop = L.DomEvent.stopPropagation;
        if (fn) {
            L.DomEvent.on(link, 'click', stop).on(link, 'mousedown', stop).on(link, 'click', L.DomEvent.preventDefault).on(link, 'click', fn, context)
        }
        return link;
    },
    _reset: function() {
        var bounds = this._map.getBounds();
        var topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._el, topLeft);
        var pos = this._map.latLngToContainerPoint(this._latlng);
        L.DomUtil.setPosition(this.toolBarContainer, pos);
    }
});
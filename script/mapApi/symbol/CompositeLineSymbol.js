/**
 * Created by xujie on 2016/5/13 0013.
 */

fastmap.mapApi.symbol.CompositeLineSymbol = L.Class.extend({
    initialize: function () {
        this.type = 'CompositeLineSymbol';

        this.symbols = [];
        this.geometry = null;
    },

    draw: function (ctx) {
        if (this.geometry === null) {
            return;
        }

        if (this.symbols.length === 0) {
            return;
        }

        for (var i = 0; i < this.symbols.length; ++i) {
            this.symbols[i].geometry = this.geometry;
            this.symbols[i].draw(ctx);
        }
    }
});

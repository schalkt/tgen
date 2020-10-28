/**
 * tgen.js - the seamless texture generator
 * https://github.com/schalkt/tgen/
 * http://texture-generator.com/
 *
 * Copyright (c) 2015-2019 Tamas Schalk
 * MIT license
 */

var SeamlessTextureGenerator = (function() {

    return {

        version: '1.2.5',
        defaults: {},
        effects: {},
        filters: [],
        functions: [],
        blends: {},
        shapes: {},
        colormaps: {},

        events: {
            beforeEffect: {},
            afterEffect: {},
            beforeRender: {},
            afterRender: {}
        },

        config: {
            historyLast: 0, // save last rendered texture params to localStorage
            historyName: 'history',
            historyList: []
        },

        blendSafe: [
            "average",
            "lighten",
            "linearburn",
            "linearlight",
            "difference",
            "difference-invert",
            "screen",
            "lineardodge",
            "lineardodge-invert",
            "opacity",
            "exclusion"
        ],

        blendFlat: [
            "lighten",
            "screen",
            "opacity",
        ],

        effect: function(name, defaults, func) {

            this.defaults[name] = defaults;
            this.effects[name] = func;

        },

        function: function(name, defaults, func) {

            this.functions.push(name);
            this.defaults[name] = defaults;
            this.effects[name] = func;

        },

        filter: function(name, defaults, func) {

            this.filters.push(name);
            this.defaults[name] = defaults;
            this.effects[name] = func;

        },

        event: function(when, name, func) {

            if (this.events[when] == undefined) {
                return;
            }

            this.events[when][name] = func;

        },

        blend: function(name, func) {

            this.blends[name] = func;

        },

        shape: function(name, func) {

            this.shapes[name] = func;

        },

        colormap: function(name, func) {

            this.colormaps[name] = func;

        },

        init: function(width, height, normalize) {

            return this.getGenerator(width, height, normalize);

        }

    };

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {

    module.exports = SeamlessTextureGenerator;

} else {

    if (typeof define === 'function' && define.amd) {

        define([], function() {
            return SeamlessTextureGenerator;
        });

    } else {

        window.tgen = SeamlessTextureGenerator;

    }
}
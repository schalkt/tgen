/*
 * tgen.js - the seamless texture generator
 * https://github.com/schalkt/tgen
 *
 * Copyright (c) 2015 Tamas Schalk
 * MIT license
 *
 * @version 0.1
 *
 */

var tgen = function (width, height) {


    var generator = {} // generator object
    var canvases = []; // rendered layer canvases
    var rendered = []; // rendered effects real params
    var time = {}; // time object for stat
    var layer = 0; // start layer id
    var logEnabled = true; // enable console.log()

    // available blend types
    generator.blends = [
        'opacity',
        'multiply',
        'screen',
        'overlay',
        'difference',
        'exclusion',
        'darken',
        'lighten',
        'lineardodge',
        'linearlight',
        'linearburn',
        'softlight'
    ];

    // default width
    if (width == undefined) {
        width = 128;
    }

    // if undefined height = width
    if (height == undefined) {
        height = width;
    }

    // reset the generator
    var reset = function () {

        texture.clear();
        canvases = [];
        rendered = [];
        layer = 0;

        // start time
        time.start = new Date().getTime();

    }

    // texture object
    var texture = {

        data: null,

        pixels: function () {
            return width * height * 4;
        },

        clear: function () {
            this.data = new Float32Array(width * height * 4)
        },

        // copy canvas to texture
        set: function (canvas) {

            var pixels = this.pixels();
            var context = canvas.getContext('2d');
            var image = context.getImageData(0, 0, width, height);
            var imageData = image.data;

            while (pixels--) {
                texture.data[pixels] = imageData[pixels];
            }

        },

        // currently not used function
        opacity: function (opacity) {

            if (opacity === undefined) {
                opacity = 0.5;
            }

            var pixels = this.pixels();

            for (var i = 0; i < pixels; i = i + 4) {
                texture.data[i] = opacity;
            }

            return this;

        }

    };


    reset();


    // merge params objects
    var mergeParams = function (obj1, obj2) {

        var obj3 = {};

        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }

        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }

        return obj3;

    }


    // random int min max
    var randInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // random real min max
    var randReal = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    // random color
    var randColor = function (opacity) {

        if (opacity === undefined) {
            opacity = 1;
        }
        if (opacity === true) {
            opacity = 0.2 + (Math.random() / 1.5);
        }

        return [randInt(0, 255), randInt(0, 255), randInt(0, 255), opacity];

    }

    // random color state for sphere effect (red,green or blue)
    var randColorState = function (rgba) {

        if (rgba !== undefined) {
            return rgba;
        }

        rgba = [
            randInt(0, 1),
            randInt(0, 1),
            randInt(0, 1),
            randReal(0.3, 1)
        ];

        // if all channel 0, then blue
        if (rgba[0] + rgba[1] + rgba[2] == 0) {
            rgba[2] = 1;
        }

        return rgba;

    }

    // get random blend mode
    var randBlend = function () {
        var count = generator.blends.length;
        var index = randInt(0, count - 1);
        return generator.blends[index];
    }


    // default effect params
    generator.defaults = {

        fill: {
            blend: "opacity",
            rgba: [128, 128, 228, 1]
        },
        merge: {
            blend: "opacity",
            opacity: 0.5
        },
        noise: {
            blend: "random",
            mode: 'monochrome', // monochrome or color
            opacity: 0.5
        },
        colorize: {
            level: 50,
            rgb: "random"
        },
        vibrance: {
            adjust: 50
        },
        contrast: {
            adjust: 50
        },
        threshold: {
            threshold: 96
        },
        invert: {},
        brightness: {
            adjust: 50,
            legacy: true
        },
        waves: {
            blend: "random",
            level: 50
        },
        crosshatch: {
            blend: "random",
            level: 50
        },
        lines: {
            blend: "softlight",
            rgba: "random",
            count: 200,
            sizeMin: 10,
            sizeMax: 120
        },
        circles: {
            blend: "lighten",
            rgba: "random",
            origin: "random",
            count: 21,
            sizeMin: 1,
            sizeMax: 15
        },
        spheres: {
            blend: "lighten",
            origin: "random",
            count: 21,
            sizeMin: 20,
            sizeMax: 70
        },
        squares: {
            blend: "lighten",
            rgba: "random",
            origin: "random",
            count: 21,
            sizeMin: 1,
            sizeMax: 50
        }
    };

    // set rgba color - if the channel is an array then random
    var rgba = function (rgba) {

        if (rgba === 'random') {
            rgba = randColor(true);
        }

        if (typeof rgba[0] == "object") {
            rgba[0] = randInt(rgba[0][0], rgba[0][1]);
        }

        if (typeof rgba[1] == "object") {
            rgba[1] = randInt(rgba[1][0], rgba[1][1]);
        }

        if (typeof rgba[2] == "object") {
            rgba[2] = randInt(rgba[2][0], rgba[2][1]);
        }

        if (typeof rgba[3] == "object") {
            rgba[3] = randReal(rgba[3][0], rgba[3][1]);
        }

        return rgba;

    };

    // effect parameters fill with default values
    var paramsCheck = function (type, params, func) {

        if (params === undefined) {
            params = mergeParams({}, generator.defaults[type]);
        } else {
            params = mergeParams(generator.defaults[type], params);
        }

        if (func !== undefined) {
            params = func(params);
        }

        if (typeof params.count == 'object') {
            params.count = randInt(params.count[0], params.count[1]);
        }

        if (params['blend'] === undefined || params['blend'] === null) {
            params.blend = '';
        }

        if (params.blend === 'random') {
            params.blend = randBlend();
        }

        // set blend
        if (params.blend !== undefined) {
            point.blend = params.blend;
        } else {
            point.blend = '';
        }

        // set color
        if (params.rgba) {
            params.rgba = rgba(params.rgba);
            point.rgba = params.rgba;
        }

        if (params.rgb) {
            params.rgb = rgba(params.rgb);
            point.rgba = params.rgb;
        }

        //log(type, params);

        return params;

    };

    // console log
    var log = function (type, params) {

        if (logEnabled) {
            console.log(layer, type, params);
        }

    }

    // store generated texture params for save
    var store = function (type, params) {

        rendered.push([layer, type, params])
        log(type, params);

    }

    // draw
    var draw = {

        rect: function (x, y, sizeX, sizeY, centered) {

            if (centered !== undefined) {
                var offsetX = parseInt(-sizeX / 2);
                var offsetY = parseInt(-sizeY / 2);
            } else {
                var offsetX = 0;
                var offsetY = 0;
            }

            for (var ix = 0; ix < sizeX; ix++) {
                for (var iy = 0; iy < sizeY; iy++) {
                    point.set(offsetX + x + ix, offsetY + y + iy);
                }
            }

        },

        circle: function (x1, y1, radius, centered) {

            if (centered !== undefined) {
                var offsetX = 0;
                var offsetY = 0;
            } else {
                var offsetX = radius;
                var offsetY = radius;
            }

            for (var x = -radius; x < radius; x++) {

                var h = parseInt(Math.sqrt(radius * radius - x * x));

                for (var y = -h; y < h; y++) {
                    point.set(x1 + offsetX + x, y1 + offsetY + y);
                }
            }

        },

        line: function (x1, y1, x2, y2) {

            var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            var dx = (x2 - x1) / d;
            var dy = (y2 - y1) / d;
            var x = 0;
            var y = 0;

            for (var i = 0; i < d; i++) {
                x = x1 + (dx * i);
                y = y1 + (dy * i);
                point.set(x, y)
            }

        },

        sphere: function (x1, y1, radius, centered, rgba) {

            if (centered !== undefined) {
                var offsetX = 0;
                var offsetY = 0;
            } else {
                var offsetX = radius;
                var offsetY = radius;
            }

            for (var x = -radius; x < radius; x++) {

                var h = parseInt(Math.sqrt(radius * radius - x * x));

                for (var y = -h; y < h; y++) {

                    var c = Math.min(255, Math.max(0, (255 - 255 * Math.sqrt((y * y) + (x * x)) / (radius / 2))));
                    point.rgba = [(rgba[0] == 1) ? c : 0, (rgba[1] == 1) ? c : 0, (rgba[2] == 1) ? c : 0, rgba[3]];
                    point.set(x1 + offsetX + x, y1 + offsetY + y);

                }
            }

        }

    };

    // currently only for grayscale
    var calc = {

        luminance: function (color) {
            //return (0.299 * color[0]) + (0.587 * color[1]) + (0.114 * color[2]);
            return (0.21 * color[0]) + (0.72 * color[1]) + (0.07 * color[2]);
        }

    }

    // put a point, the magic is here
    var point = {

        rgba: [0, 0, 0, 1],
        mixed: [0, 0, 0, 1],
        blend: 'opacity',

        normalize: function (rgba) {

            rgba[0] = Math.round(rgba[0]);
            rgba[1] = Math.round(rgba[1]);
            rgba[2] = Math.round(rgba[2]);

            return rgba;

        },

        colorize: function (rgba1, rgba2, level) {

            if (level === undefined) {
                level = 50;
            }

            return [
                rgba1[0] - (rgba1[0] - rgba2[0]) * (level / 100),
                rgba1[1] - (rgba1[1] - rgba2[1]) * (level / 100),
                rgba1[2] - (rgba1[2] - rgba2[2]) * (level / 100),
                rgba2[3] ? rgba2[3] : 0.5
            ];

        },

        pattern: function (val, max) {

            // important for correct draw
            val = parseInt(val);

            // if in the correct size then return
            if (val >= 0 && val < max) {
                return val;
            }

            var s = val / max;

            if (val >= max) {
                var smax = Math.floor(s) * (max);
                var sval = (val - smax);
                return sval;
            }

            if (val < 0) {

                var smax = Math.ceil(s) * (max);
                var sval = max - Math.abs((val - smax));

                if (sval >= max) {
                    var sval = (sval - max);
                    return sval;
                }

                return sval;

            }

        },

        opacity: function (input, current) {

            // normalize opacity value
            if (input[3] > 1) {
                input[3] = input[3] / 255;
            }

            // if no opacity then return original values
            if (input[3] == 1) {
                return [
                    input[0],
                    input[1],
                    input[2],
                    input[3]
                ];
            }

            // calc opacity
            return [
                input[0] * (input[3] ) + current[0] * (1 - input[3]),
                input[1] * (input[3] ) + current[1] * (1 - input[3]),
                input[2] * (input[3] ) + current[2] * (1 - input[3]),
                input[3]
            ];

        },

        // calculate blend
        calc: function (input, current) {

            switch (this.blend) {

                case 'opacity':
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'multiply':
                    input[0] = (current[0] * input[0]) / 255;
                    input[1] = (current[1] * input[1]) / 255;
                    input[2] = (current[2] * input[2]) / 255;
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'screen':
                    input[0] = 255 - (((255 - current[0]) * (255 - input[0])) / 255);
                    input[1] = 255 - (((255 - current[1]) * (255 - input[1])) / 255);
                    input[2] = 255 - (((255 - current[2]) * (255 - input[2])) / 255);
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'overlay':
                    input[0] = (current[0] > 128) ? 255 - 2 * (255 - input[0]) * (255 - current[0]) / 255 : (current[0] * input[0] * 2) / 255;
                    input[1] = (current[1] > 128) ? 255 - 2 * (255 - input[1]) * (255 - current[1]) / 255 : (current[1] * input[1] * 2) / 255;
                    input[2] = (current[2] > 128) ? 255 - 2 * (255 - input[2]) * (255 - current[2]) / 255 : (current[2] * input[2] * 2) / 255;
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'difference':
                    input[0] = Math.abs(input[0] - current[0]);
                    input[1] = Math.abs(input[1] - current[1]);
                    input[2] = Math.abs(input[2] - current[2]);
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'exclusion':
                    input[0] = 128 - 2 * (current[0] - 128) * (input[0] - 128) / 255
                    input[1] = 128 - 2 * (current[1] - 128) * (input[1] - 128) / 255
                    input[2] = 128 - 2 * (current[2] - 128) * (input[2] - 128) / 255
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'darken':
                    input[0] = (input[0] < current[0]) ? input[0] : current[0];
                    input[1] = (input[1] < current[1]) ? input[1] : current[1];
                    input[2] = (input[2] < current[2]) ? input[2] : current[2];
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'lighten':
                    input[0] = (input[0] > current[0]) ? input[0] : current[0];
                    input[1] = (input[1] > current[1]) ? input[1] : current[1];
                    input[2] = (input[2] > current[2]) ? input[2] : current[2];
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'lineardodge':
                    input[0] = current[0] + input[0];
                    input[1] = current[1] + input[1];
                    input[2] = current[2] + input[2];
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'linearlight':
                    input[0] = current[0] + 2 * input[0] - 255;
                    input[1] = current[1] + 2 * input[1] - 255;
                    input[2] = current[2] + 2 * input[2] - 255;
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok
                case 'linearburn':
                    input[0] = current[0] + input[0] - 255;
                    input[1] = current[1] + input[1] - 255;
                    input[2] = current[2] + input[2] - 255;
                    var mixed = this.opacity(input, current);
                    break;

                // photoshop test ok but NOT 100%
                case 'softlight':
                    input[0] = (current[0] > 128) ? 255 - ((255 - current[0]) * (255 - (input[0] - 128))) / 255 : (current[0] * (input[0] + 128)) / 255;
                    input[1] = (current[1] > 128) ? 255 - ((255 - current[1]) * (255 - (input[1] - 128))) / 255 : (current[1] * (input[1] + 128)) / 255;
                    input[2] = (current[2] > 128) ? 255 - ((255 - current[2]) * (255 - (input[2] - 128))) / 255 : (current[2] * (input[2] + 128)) / 255;
                    var mixed = this.opacity(input, current);
                    break;

                default:
                    var mixed = [
                        input[0],
                        input[1],
                        input[2],
                        input[3]
                    ];
                    break;

            }

            return mixed;

        },

        // set the pixel
        set: function (x, y) {

            x = this.pattern(x, width);
            y = this.pattern(y, height);

            //this.rgba = this.normalize(this.rgba);
            this.mixed = this.calc(this.rgba, this.get(x, y));
            var offset = y * width * 4 + x * 4;

            texture.data[offset] = this.mixed[0];
            texture.data[offset + 1] = this.mixed[1];
            texture.data[offset + 2] = this.mixed[2];
            texture.data[offset + 3] = this.mixed[3];

        },

        // get the pixel
        get: function (x, y) {

            x = this.pattern(x, width);
            y = this.pattern(y, height);

            var offset = y * width * 4 + x * 4;

            return [
                texture.data[offset],
                texture.data[offset + 1],
                texture.data[offset + 2],
                texture.data[offset + 3]
            ];

        }

    }

    // read and modify all pixel by callback function
    var walk = function (func) {

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var color = point.get(x, y);
                color = func(color, x, y);
                point.rgba = color;
                point.set(x, y);

            }
        }

    }


    // generator public functions


    // merge one or more layer
    generator.merge = function (params) {

        params = paramsCheck('merge', params);

        if (canvases[params.layer] === undefined) {
            return this;
        }

        var context = canvases[params.layer].getContext('2d');
        var image = context.getImageData(0, 0, width, height);
        var imageData = image.data;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {

                var offset = y * width * 4 + x * 4;

                point.rgba = [
                    imageData[offset],
                    imageData[offset + 1],
                    imageData[offset + 2],
                    imageData[offset + 3]
                ];

                point.rgba[3] = (point.rgba[3] > 1) ? point.rgba[3] / 255 : point.rgba[3];
                point.set(x, y);

            }
        }

        store('merge', params);
        return this;

    };


    // one layer full copy to the current layer
    generator.copy = function (layer) {

        var pixels = texture.pixels();
        var context = canvases[layer].getContext('2d');
        var image = context.getImageData(0, 0, width, height);
        var imageData = image.data;

        while (pixels--) {
            texture.data[pixels] = imageData[pixels];
        }

        store('copy', layer);

        return this;

    };

    // brightness
    // photoshop ok with legacy mode
    generator.brightness = function (params) {

        params = paramsCheck('brightness', params);
        point.blend = '';

        walk(function (color) {

            if (params.legacy === true) {

                return [
                    Math.min(color[0] + params.adjust, 255),
                    Math.min(color[1] + params.adjust, 255),
                    Math.min(color[2] + params.adjust, 255),
                    color[3]
                ];

            } else {

                params.adjust = Math.pow((params.adjust + 100) / 100, 2);

                return [
                    ((((color[0] / 255) - 0.5) * params.adjust) + 0.5) * 255,
                    ((((color[1] / 255) - 0.5) * params.adjust) + 0.5) * 255,
                    ((((color[2] / 255) - 0.5) * params.adjust) + 0.5) * 255,
                    color[3]
                ];
            }

        });

        store('brightness', params);
        return this;

    };

    // contrast
    // photoshop test ok with NO legacy mode
    generator.contrast = function (params) {

        params = paramsCheck('contrast', params);

        var adjust = (100 + params.adjust) / 100;
        point.blend = '';

        walk(function (color) {

            color[0] = ((((color[0] / 255) - 0.5) * adjust) + 0.5) * 255;
            color[1] = ((((color[1] / 255) - 0.5) * adjust) + 0.5) * 255;
            color[2] = ((((color[2] / 255) - 0.5) * adjust) + 0.5) * 255;

            return [
                Math.max(Math.min(color[0], 255), 0),
                Math.max(Math.min(color[1], 255), 0),
                Math.max(Math.min(color[2], 255), 0),
                color[3]
            ];
        });


        store('contrast', params);
        return this;

    };

    // grayscale
    generator.grayscale = function (method) {

        if (!method) {
            method = 'average';
        }

        point.blend = '';

        switch (method) {

            case 'ligthness':
                walk(function (color) {
                    var minmax = Math.max(color[0], color[1], color[2]) + Math.min(color[0], color[1], color[2]);
                    return [
                        minmax,
                        minmax,
                        minmax,
                        color[3]
                    ];
                });
                break;

            case 'average':
                walk(function (color) {
                    var avg = (color[0] + color[1] + color[2]) / 3;
                    return [
                        avg,
                        avg,
                        avg,
                        color[3]
                    ];
                });
                break;

            case 'luminosity':
                walk(function (color) {
                    var lum = calc.luminance(color);
                    return [
                        lum,
                        lum,
                        lum,
                        color[3]
                    ];
                });
                break;

        }

        store('grayscale', method);

        return this;

    };

    // colorize
    generator.colorize = function (params) {

        params = paramsCheck('colorize', params);
        point.blend = '';

        walk(function (color) {
            return point.colorize(color, params.rgb, params.level);
        });

        store('colorize', params);

        return this;

    }

    // invert
    generator.invert = function () {

        params = paramsCheck('invert', {});
        point.blend = '';

        walk(function (color) {
            return [
                255 - color[0],
                255 - color[1],
                255 - color[2],
                color[3]
            ]
        });

        store('invert', params);

        return this;

    }

    // threshold
    generator.threshold = function (threshold) {

        params = paramsCheck('threshold', {}, function (params) {

            if (threshold !== undefined) {
                params.threshold = threshold;
            }

            return params;

        });

        point.blend = '';

        walk(function (color) {

            var t = ((0.2126 * color[0]) + (0.7152 * color[1]) + (0.0722 * color[2]) <= params.threshold) ? 0 : 255;
            return [
                t,
                t,
                t,
                1
            ]
        });

        store('threshold', params);

        return this;

    }

    // vibrance
    generator.vibrance = function (params) {

        params = paramsCheck('vibrance', params);
        var adjust = params.adjust * -1;
        point.blend = '';

        walk(function (color) {

            var avg = (color[0] + color[1] + color[2]) / 3;
            var max = Math.max(color[0], color[1], color[2]);
            var amt = ((Math.abs(max - avg) * 2 / 255) * adjust) / 100;

            if (color[0] !== max) {
                color[0] += (max - color[0]) * amt;
            }
            if (color[1] !== max) {
                color[1] += (max - color[1]) * amt;
            }
            if (color[2] !== max) {
                color[2] += (max - color[2]) * amt;
            }

            return [
                color[0],
                color[1],
                color[2],
                color[3]
            ];
        });

        store('vibrance', params);

        return this;

    }

    // waves
    generator.waves = function (input) {

        params = paramsCheck('waves', input, function (params) {

            if (params.xsines === undefined) {
                params.xsines = randInt(1, 10);
            } else if (typeof params.xsines == 'object') {
                params.xsines = randInt(params.xsines[0], params.xsines[1]);
            }

            if (params.ysines === undefined) {
                params.ysines = randInt(1, 10);
            } else if (typeof params.ysines == 'object') {
                params.ysines = randInt(params.ysines[0], params.ysines[1]);
            }

            if (params.rgba === undefined) {
                var o = (params.opacity !== undefined) ? params.opacity : 1;
                params.rgba = rgba([
                    [0, 255],
                    [0, 255],
                    [0, 255],
                    o
                ]);
            }

            return params;
        });

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var c = 127 + 63.5 * Math.sin(x / width * params.xsines * 2 * 3.1415) + 63.5 * Math.sin(y / height * params.ysines * 2 * 3.1415);
                point.rgba = point.colorize([c, c, c, 1], params.rgba, params.level);
                point.set(x, y);

            }
        }

        store('waves', params);

        return this;

    };

    // spheres
    generator.spheres = function (params) {

        params = paramsCheck('spheres', params, function (params) {

            params.rgba = randColorState(params.rgba);
            return params;

        });
        params.elements = [];

        var sizeMin = parseInt((params.sizeMin / 100) * width);
        var sizeMax = parseInt((params.sizeMax / 100) * height);


        for (var i = 0; i < params.count; i++) {

            if (params.origin == 'random') {
                var x = randInt(0, width);
                var y = randInt(0, height);
            } else {
                var x = parseInt((params.origin[0] / 100) * width);
                var y = parseInt((params.origin[1] / 100) * height);
            }

            var size = randInt(sizeMin, sizeMax);
            draw.sphere(x, y, size, true, params.rgba);

            params.elements.push({x: x, y: y, size: size});

        }


        store('spheres', params);

        return this;

    };

    // crosshatch
    generator.crosshatch = function (input) {

        params = paramsCheck('crosshatch', input, function (params) {

            if (params.xadjust == undefined) {
                params.xadjust = randInt(1, 10);
            }
            if (params.yadjust === undefined) {
                params.yadjust = randInt(1, 10);
            }
            if (params.rgba === undefined) {
                params.rgba = [randInt(0, 255), randInt(0, 255), randInt(0, 255), 1];
            }

            return params;
        });

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var c = 127 + 63.5 * Math.sin(x * x / params.xadjust) + 63.5 * Math.cos(y * y / params.yadjust);
                point.rgba = point.colorize([c, c, c, 1], params.rgba, params.level);
                point.set(x, y);

            }
        }

        store('crosshatch', params);

        return this;

    };

    // squares
    generator.squares = function (params) {

        params = paramsCheck('squares', params);
        params.elements = [];

        var sizeMin = parseInt((params.sizeMin / 100) * width);
        var sizeMax = parseInt((params.sizeMax / 100) * height);

        for (var i = 0; i < params.count; i++) {

            if (params.origin == 'random') {
                var x = randInt(0, width);
                var y = randInt(0, height);
            } else {
                var x = parseInt((params.origin[0] / 100) * width);
                var y = parseInt((params.origin[1] / 100) * height);
            }

            var size = randInt(sizeMin, sizeMax);
            draw.rect(x, y, size, size, false);

            params.elements.push({x: x, y: y, size: size});

        }

        store('squares', params);

        return this;

    };

    // circles
    generator.circles = function (params) {

        params = paramsCheck('circles', params);
        params.elements = [];

        var sizeMin = parseInt((params.sizeMin / 100) * width);
        var sizeMax = parseInt((params.sizeMax / 100) * height);

        for (var i = 0; i < params.count; i++) {

            if (params.origin == 'random') {
                var x = randInt(0, width);
                var y = randInt(0, height);
            } else {
                var x = parseInt((params.origin[0] / 100) * width);
                var y = parseInt((params.origin[1] / 100) * height);
            }

            var size = randInt(sizeMin, sizeMax);
            draw.circle(x, y, size, true);

            params.elements.push({x: x, y: y, size: size});

        }

        store('circles', params);

        return this;

    };

    // lines
    generator.lines = function (params) {

        params = paramsCheck('lines', params, function (params) {

            params.s1 = randInt(5, 32);
            params.c1 = randInt(5, 32);
            return params;

        });

        for (var i = 0; i < params.count; i++) {

            var x1 = width / 2 + Math.sin(i / params.s1) * width * .7;
            var y1 = height / 2 + Math.cos(i / params.c1) * height * .7;
            var x2 = width / 2 + Math.sin(i / params.c1) * width * .7;
            var y2 = height / 2 + Math.cos(i / params.s1) * height * .7;

            draw.line(x1, y1, x2, y2);

        }

        store('lines', params);

        return this;

    };

    // noise
    generator.noise = function (params) {

        params = paramsCheck('noise', params);

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                if (params.mode == 'color') {
                    point.rgba = [randInt(0, 255), randInt(0, 255), randInt(0, 255), params.opacity];
                } else {
                    var rnd = randInt(0, 255);
                    point.rgba = [rnd, rnd, rnd, params.opacity];
                }

                point.set(x, y);

            }
        }

        store('noise', params);

        return this;

    };

    // test for correct positioning and colors
    generator.test = function () {

        width = 200;
        height = 200;

        point.blend = 'opacity';

        point.rgba = [255, 255, 155, 1];
        draw.rect(1, 1, width - 2, height - 2);

        var s = 20;
        point.rgba = [0, 150, 0, 0.6];
        draw.rect(2, 2, s, s);
        draw.rect(width - s - 2, 2, s, s);
        draw.rect(2, height - 2 - s, s, s);
        draw.rect(width - 2 - s, height - 2 - s, s, s);

        point.rgba = [20, 20, 10, 0.2];
        draw.rect(width / 2, height / 2, 178, 178, true);

        point.rgba = [10, 20, 210, 0.7];
        draw.rect(width - 5, height - 5, 10, 10);

        var s = 20;
        point.rgba = [0, 0, 0, 1];

        draw.line(s, s, width - s, height - s);
        draw.line(width - s, s, s, height - s);
        draw.line(0, height / 2, width, height / 2);
        draw.line(width / 2, 0, width / 2, height);


        point.rgba = [255, 55, 55, 0.5];
        draw.rect(10, 10, width - 20, height - 20);

        point.rgba = [0, 0, 255, 0.3];
        draw.rect(width - 2, height - 2, 4, 4);

        point.rgba = [255, 255, 255, 1];
        point.set(0, 0);
        point.set(width - 1, 0);
        point.set(0, height - 1);
        point.set(width - 1, height - 1);


        point.rgba = [25, 25, 0, 0.2];
        draw.circle(width / 4, height / 4, width / 4, true);

        point.rgba = [255, 255, 0, 0.1];
        draw.circle(width, height, width, true);

        this.brightness(50, true);
        this.vibrance(100);
        this.contrast(20);

        return this;

    };

    // fill a layer
    generator.fill = function (params) {

        paramsCheck('fill', params);
        draw.rect(1, 1, width, height);

        store('fill', params);

        return this;

    };

    // copy texture to image
    generator.toImage = function (context) {

        var image = context.createImageData(width, height);
        var data = image.data;
        var pixels = texture.pixels();

        for (var i = 0; i < pixels; i += 4) {

            data[i] = texture.data[i];
            data[i + 1] = texture.data[i + 1];
            data[i + 2] = texture.data[i + 2];
            data[i + 3] = 255;
        }

        return image;

    };

    // copy image to canvas
    generator.toCanvas = function () {

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        var image = this.toImage(context);
        context.putImageData(image, 0, 0);

        return canvas;
    }

    // get canvas
    generator.getCanvas = function (func) {

        if (func) {
            func(canvases[canvases.length - 1]);
        }

        return this;

    }

    // get phases (layers)
    generator.getPhases = function (func) {

        if (func) {

            var phases = [];
            var length = canvases.length;

            for (var i = 0; i < length; i++) {
                phases.push(canvases[i]);
            }

            func(phases);
        }

        return this;

    }

    // stat
    generator.stat = function (func) {

        time.stop = new Date().getTime();
        time.elapsed = (time.stop - time.start) / 1000;

        if (func) {
            func(time);
        }

        return this;

    }

    // get all real params to save
    generator.save = function () {

        return {
            "width": width,
            "height": height,
            "items": rendered
        }

    };

    // parse params
    generator.params = function (config, noclear) {

        // store current layer
        var current = 0;

        // set canvas size;
        if (config.width != undefined) {
            width = config.width;
        }

        if (config.height != undefined) {
            height = config.height;
        }

        if (noclear != true) {
            reset();
        }

        // items parse
        for (var key in config.items) {

            layer = config.items[key][0];
            var effect = config.items[key][1];
            var values = config.items[key][2];

            if (current != layer) {
                if (canvases[layer] != undefined) {
                    texture.set(canvases[layer]);
                } else {
                    texture.clear();
                }
                current = layer;
            }


            switch (effect) {

                case 'merge':

                    for (var m in values) {

                        var p = {layer: values[m][0]}

                        if (values[m][1] !== undefined) {
                            p.blend = values[m][1];
                        }

                        if (values[m][2] !== undefined) {
                            p.opacity = values[m][2];
                        }

                        generator.merge(p);
                    }
                    break;

                default:

                    if (generator[effect] == undefined) {
                        console.warn('undefined effect: ' + effect);
                    } else {
                        generator[effect](values);
                    }
                    break;

            }

            canvases[layer] = generator.toCanvas();

        }

        return this;

    }

    // the generator object
    return generator;

}


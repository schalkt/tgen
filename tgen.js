/*
 * tgen.js - the seamless texture generator
 * https://github.com/schalkt/tgen
 *
 * Copyright (c) 2015 Tamas Schalk
 * MIT license
 *
 * @version 0.2.0
 *
 */

var tgen = function (width, height) {

    var version = '0.1';
    var generator = {} // generator object
    var canvases = []; // rendered layer canvases
    var rendered = []; // rendered effects real params
    var time = {}; // time object for stat
    var layer = 0; // start layer id
    var logEnabled = true; // enable console.log()
    var historyLast = 15; // save last rendered texture params to localStorage
    var historyName = 'history';
    var historyList = [];
    var wha = null; // width and height average

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


    var checkSize = function () {

        // default width
        if (width == undefined) {
            width = 256;
        }

        if (width < 1) {
            width = 256;
        }

        if (height < 1) {
            height = 256;
        }

        if (width > 1024) {
            width = 1024;
        }

        if (height > 1024) {
            height = 1024;
        }

        // if undefined height = width
        if (height == undefined) {
            height = width;
        }

        wha = (width + height) / 2;

    };

    checkSize();

    // reset the generator
    var reset = function () {

        texture.clear();
        canvases = [];
        rendered = [];
        layer = 0;

        // start time
        time.start = new Date().getTime();

    }


    generator.buffer = function (size, w, h) {

        this.data = null;
        this.size = size ? size : 4;
        this.width = w ? w : width;
        this.height = h ? h : height;

        this.pixels = function () {
            return this.width * this.height * this.size;
        };

        this.clear = function () {
            this.data = new Float32Array(this.width * this.height * this.size);
        };

        this.pattern = function (val, max) {

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

        };


        this.offset = function (x, y) {

            x = parseInt(x);
            y = parseInt(y);

            // if x not in the correct size
            if (x < 0 || x >= this.width) {
                x = this.pattern(x, this.width);
            }

            // if y not in the correct size
            if (y < 0 || y >= this.height) {
                y = this.pattern(y, this.height);
            }

            return y * this.width * this.size + x * this.size;
        };

        this.set = function (x, y, values) {

            var offset = this.offset(x, y);

            for (var i = 0; i < this.size; i++) {
                this.data[offset + i] = values[i];
            }

        };

        this.get = function (x, y) {

            var offset = this.offset(x, y);
            var output = [];

            for (var i = 0; i < this.size; i++) {
                output[i] = this.data[offset + i];
            }

            return output;

        };


        // copy canvas to texture
        this.canvas = function (canvas) {

            var pixels = this.pixels();
            var context = canvas.getContext('2d');
            var image = context.getImageData(0, 0, this.width, this.height);
            var imageData = image.data;

            while (pixels--) {
                texture.data[pixels] = imageData[pixels];
            }

        };

        // currently not used function
        this.opacity = function (opacity) {

            if (opacity === undefined) {
                opacity = 0.5;
            }

            var pixels = this.pixels();

            for (var i = 0; i < pixels; i = i + this.size) {
                texture.data[i] = opacity;
            }

            return this;

        };

        if (this.data === null) {
            this.clear();
        }

    };

    // texture object
    var texture = new generator.buffer();
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

    var randByArray = function (data, real) {

        if (typeof data == "object") {

            if (real != undefined) {
                data = randReal(data[0], data[1]);
            } else {
                data = randInt(data[0], data[1]);
            }

        }

        return data;

    }

    // random color
    var randColor = function (opacity) {

        if (opacity === undefined) {
            opacity = 1;
        }
        if (opacity === true) {
            opacity = 0.5 + (Math.random() / 2);
        }

        return [randInt(0, 255), randInt(0, 255), randInt(0, 255), opacity];

    }


    // get random blend mode
    var randBlend = function () {
        return randItem(generator.blends);
    }

    // get random array item
    var randItem = function (array) {
        var count = array.length;
        var index = randInt(0, count - 1);
        return array[index];
    }


    // get random property from object
    var randProperty = function (obj) {

        var result;
        var count = 0;
        for (var prop in obj) {
            if (Math.random() < 1 / ++count) {
                result = prop;
            }
        }

        return result;

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
        gamma: {
            adjust: 0.5
        },
        threshold: {
            threshold: 96
        },
        invert: {},
        brightness: {
            adjust: 50,
            legacy: true
        },
        convolute: {
            blend: "opacity",
            transparent: false,
            weights: null
        },
        emboss: {
            type: 1
        },
        blur: {
            type: 1
        },
        sharpen: {
            type: 1
        },
        edgedetect: {
            type: 1
        },
        sobel: {
            type: 1
        },
        waves: {
            blend: "random",
            level: 50
        },
        crosshatch: {
            blend: "random",
            level: 50
        },
        circles: {
            blend: "lighten",
            rgba: "random",
            origin: "random",
            count: 21,
            size: [1, 15]
        },
        spheres: {
            blend: "lighten",
            rgba: "random",
            origin: "random",
            dynamic: false,
            count: 21,
            size: [20, 70]
        },
        pyramids: {
            blend: "lighten",
            rgba: "random",
            origin: "random",
            dynamic: false,
            count: 21,
            size: [21, 100]
        },
        squares: {
            blend: "lighten",
            rgba: "random",
            origin: "random",
            count: [4, 7],
            size: [2, 50]
        },
        map: {
            xamount: [5, 255],
            yamount: [5, 255],
            xchannel: [0, 3], // 0=r, 1=g, 2=b, 3=a
            ychannel: [0, 3], // 0=r, 1=g, 2=b, 3=a
            xlayer: 0,
            ylayer: 0
        },
        lines: {
            blend: "opacity",
            rgba: "random",
            size: [100, 200],
            count: [100, 400],
            freq1s: [21, 150],
            freq1c: [21, 150],
            freq2s: [21, 150],
            freq2c: [21, 150]
        },
        lines2: {
            blend: ["opacity", "lighten", "screen"],
            rgba: "random",
            type: "vertical",
            size: [0.1, 11],
            count: [4, 21]
        },
        clouds: {
            blend: "opacity",
            rgba: "random",
            seed: [1, 65535],
            roughness: [2, 16]
        },
        subplasma: {
            seed: [1, 65535],
            size: [3, 4],
            rgba: "random"
        },
        sinecolor: {
            sines: [1, 7],
            channel: [0, 2]
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

        if (params.blend === 'random') {
            params.blend = randBlend();
        }

        // random blend by array
        if (typeof params.blend == 'object') {
            var max = params.blend.length;
            params.blend = params.blend[randInt(0, max - 1)];
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
            point.rgba = [params.rgba[0], params.rgba[1], params.rgba[2], params.rgba[3]];
        }

        if (params.rgb) {
            params.rgb = rgba(params.rgb);
            point.rgba = [params.rgb[0], params.rgb[1], params.rgb[2], 1];
        }

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
                x = x - parseInt(sizeX / 2);
                y = y - parseInt(sizeY / 2);
            }

            for (var ix = 0; ix < sizeX; ix++) {
                for (var iy = 0; iy < sizeY; iy++) {
                    point.set(x + ix, y + iy);
                }
            }

        },

        circle: function (x1, y1, radius, centered) {

            if (centered == undefined) {
                x1 = x1 + radius;
                y1 = y1 + radius;
            }

            for (var x = -radius; x < radius; x++) {

                var h = parseInt(Math.sqrt(radius * radius - x * x));

                for (var y = -h; y < h; y++) {
                    point.set(x1 + x, y1 + y);
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

        sphere: function (x1, y1, radius, centered, rgba, dynamicopacity) {

            if (centered == undefined) {
                x1 = x1 + radius;
                y1 = y1 + radius;
            }

            for (var x = -radius; x < radius; x++) {

                var h = parseInt(Math.sqrt(radius * radius - x * x));

                for (var y = -h; y < h; y++) {

                    var c = Math.min(255, Math.max(0, (255 - 255 * Math.sqrt((y * y) + (x * x)) / (radius / 2))));
                    if (c > 0) {

                        if (dynamicopacity) {
                            var o = (c / 255);
                        } else {
                            var o = rgba[3];
                        }

                        point.rgba = [(rgba[0] / 255) * c, (rgba[1] / 255) * c, (rgba[2] / 255) * c, o];
                        point.set(x1 + x, y1 + y);
                    }

                }
            }

        },

        pyramid: function (x, y, sizeX, sizeY, centered, rgba, dynamicopacity) {

            var halfX = parseInt(sizeX / 2);
            var halfY = parseInt(sizeY / 2);

            if (centered != true) {
                x = x + halfX;
                y = y + halfY;
            }

            for (var ix = -halfX; ix < halfX; ix++) {
                for (var iy = -halfY; iy < halfY; iy++) {

                    var cx = (0.25 - Math.abs(ix / sizeX)) * 255;
                    var cy = (0.25 - Math.abs(iy / sizeY)) * 255;
                    var c = cx + cy;

                    if (dynamicopacity) {
                        var o = (c / 255);
                    } else {
                        var o = rgba[3];
                    }

                    if (c > 0) {
                        point.rgba = [(rgba[0] / 255) * c, (rgba[1] / 255) * c, (rgba[2] / 255) * c, o];
                        point.set(x + ix, y + iy);
                    }

                }
            }

        }

    };

    // calculations
    var calc = {

        pi: 3.1415927,

        luminance: function (color) {
            //return (0.299 * color[0]) + (0.587 * color[1]) + (0.114 * color[2]);
            return (0.21 * color[0]) + (0.72 * color[1]) + (0.07 * color[2]);
        },

        randomseed: function (seed) {

            if (this.seed == undefined) {
                this.seed = randInt(1, 65535);
            }

            if (seed !== undefined) {
                this.seed = seed;
            }

            var x = Math.sin(this.seed++) * 10000;
            return x - Math.floor(x);

        },

        normalize1: function (value) {

            return calc.normalize(value, 0, 1);

        },

        normalize255: function (value) {

            return calc.normalize(value, 0, 255);

        },

        normalize: function (value, min, max) {

            if (value > max) {
                return max;
            }

            if (value < min) {
                return min;
            }

            return value;

        },

        interpolate: {

            linear: function (a, b, x) {

                return a * (1 - x) + b * x;

            },

            cosine: function (a, b, x) {

                var ft = x * calc.pi;
                var f = (1 - Math.cos(ft)) * 0.5;

                return a * (1 - f) + b * f;

            },

            catmullrom: function (v0, v1, v2, v3, x, distance) {

                var xx = x / distance;
                var P = (v3 - v2) - (v0 - v1);
                var Q = (v0 - v1) - P;
                var R = v2 - v0;
                var t = (P * xx * xx * xx) + (Q * xx * xx) + (R * xx) + v1;

                if (t < 0) t = 0;
                if (t > 1) t = 1;

                return t;

            }

        }

    }


    var wrapx = function (x) {
        return x & (width - 1);
    }

    var wrapy = function (y) {
        return y & (height - 1);
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

            //this.rgba = this.normalize(this.rgba);
            this.mixed = this.calc(this.rgba, this.get(x, y));
            texture.set(x, y, this.mixed);

        },

        // get the pixel
        get: function (x, y) {

            return texture.get(x, y);

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

    // for percent calculations
    var p = function (c, max) {
        return parseInt((c / 100) * max);
    }


    var xysize = function (i, params) {


        if (params.elements != undefined) {

            // x and y values from params elements array
            var x = params.elements[i].x;
            var y = params.elements[i].y;
            var size = params.elements[i].size;

        } else if (params.origin == 'random') {

            // random x and y
            var x = randInt(0, width);
            var y = randInt(0, height);
            var size = randByArray(params.size);

        } else {

            // centered x and y, only size random
            var x = params.origin[0];
            var y = params.origin[1];
            var size = randByArray(params.size);

        }

        return {x: x, y: y, size: size};

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

                var offset = texture.offset(x, y);

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


    // gamma
    // photoshop test ok
    generator.gamma = function (params) {

        params = paramsCheck('gamma', params);

        var adjust = params.adjust;

        walk(function (color) {

            color[0] = Math.pow(color[0] / 255, 1 / adjust) * 255;
            color[1] = Math.pow(color[1] / 255, 1 / adjust) * 255;
            color[2] = Math.pow(color[2] / 255, 1 / adjust) * 255;

            return [
                color[0],
                color[1],
                color[2],
                color[3]
            ];
        });


        store('gamma', params);
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


    generator.sharpen = function (params) {

        params = paramsCheck('sharpen', params);


        if (params.type == 1) {

            var weights = [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ];

        } else {

            var weights = [
                -1, -1, -1,
                -1, 9, -1,
                -1, -1, -1
            ];

        }

        generator.convolute({
            store: false,
            transparent: false,
            weights: weights
        });

        store('sharpen', params);

        return this;

    };

    generator.blur = function (params) {

        params = paramsCheck('blur', params);

        var divisor = 9;

        generator.convolute({
            store: false,
            transparent: false,
            weights: [
                1 / divisor, 1 / divisor, 1 / divisor,
                1 / divisor, 1 / divisor, 1 / divisor,
                1 / divisor, 1 / divisor, 1 / divisor
            ]
        });

        store('blur', params);

        return this;

    };

    generator.emboss = function (params) {

        params = paramsCheck('emboss', params);

        if (params.type == 1) {

            var weights = [
                1, 1, 1,
                1, 0.7, -1,
                -1, -1, -1
            ];

        } else {

            var weights = [
                -2, -1, 0,
                -1, 1, 1,
                0, 1, 2
            ];

        }

        generator.convolute({
            store: false,
            transparent: false,
            weights: weights
        });

        store('emboss', params);

        return this;

    };


    generator.edgedetect = function (params) {

        params = paramsCheck('edgedetect', params);

        if (params.type == 1) {

            var weights = [
                -1, -1, -1,
                -1, 8, -1,
                -1, -1, -1
            ];

        } else {

            var weights = [
                0, 1, 0,
                1, -4, 1,
                0, 1, 0
            ];

        }

        generator.convolute({
            store: false,
            transparent: false,
            weights: weights
        });

        store('edgedetect', params);

        return this;

    };

    generator.sobel = function (params) {

        params = paramsCheck('sobel', params);

        if (params.type == 1) {

            var weights = [
                -1, -2, -1,
                0, 0, 0,
                1, 2, 1
            ];

        } else {

            var weights = [
                -1, 0, 1,
                -2, 0, 2,
                -1, 0, 1
            ];

        }

        generator.convolute({
            store: false,
            transparent: false,
            weights: weights
        });

        store('sobel', params);

        return this;

    };


    generator.convolute = function (params) {

        params = paramsCheck('convolute', params);

        if (typeof params.weights != 'object') {
            return this;
        }

        var buffer = new generator.buffer();
        buffer.clear();
        var side = Math.round(Math.sqrt(params.weights.length));
        var halfSide = Math.floor(side / 2);
        var alphaFac = params.transparent ? 1 : 0;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {

                var r = 0, g = 0, b = 0, a = 0;

                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {

                        var wt = params.weights[cy * side + cx];
                        var scy = y + cy - halfSide;
                        var scx = x + cx - halfSide;
                        var color = texture.get(scx, scy);

                        r += color[0] * wt;
                        g += color[1] * wt;
                        b += color[2] * wt;
                        a += color[3] * wt;
                    }
                }

                buffer.set(x, y, [r, g, b, a + alphaFac * (255 - a)]);

            }
        }

        var pixels = texture.pixels();
        while (pixels--) {
            texture.data[pixels] = buffer.data[pixels];
        }

        if (params.store !== false) {
            store('convolute', params);
        }

        return this;

    },

        // waves
        generator.waves = function (params) {

            params = paramsCheck('waves', params, function (params) {

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

                    var c = 127 + 63.5 * Math.sin(x / width * params.xsines * 2 * calc.pi) + 63.5 * Math.sin(y / height * params.ysines * 2 * calc.pi);
                    if (typeof params.channels == "object") {
                        point.rgba = [params.channels[0] ? c : 0, params.channels[1] ? c : 0, params.channels[2] ? c : 0, params.channels[3] ? c : 0];
                    } else {
                        point.rgba = point.colorize([c, c, c, 1], params.rgba, params.level);
                    }

                    point.set(x, y);

                }
            }

            store('waves', params);

            return this;

        };

    // spheres
    generator.spheres = function (params) {

        params = paramsCheck('spheres', params);

        var elements = [];

        for (var i = 0; i < params.count; i++) {

            var xys = xysize(i, params);
            draw.sphere(p(xys.x, width), p(xys.y, height), p(xys.size, wha), true, params.rgba, params.dynamic);
            elements.push(xys);

        }

        params.elements = elements;
        store('spheres', params);

        return this;

    };

    // pyramids
    generator.pyramids = function (params) {

        params = paramsCheck('pyramids', params);

        var elements = [];

        for (var i = 0; i < params.count; i++) {

            var xys = xysize(i, params);
            draw.pyramid(p(xys.x, width), p(xys.y, height), p(xys.size, wha), p(xys.size, wha), true, params.rgba, params.dynamic);
            elements.push(xys);

        }

        params.elements = elements;
        store('pyramids', params);

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

        var elements = [];

        for (var i = 0; i < params.count; i++) {

            var xys = xysize(i, params);
            draw.rect(p(xys.x, width), p(xys.y, height), p(xys.size, wha), p(xys.size, wha), false);
            elements.push(xys);

        }

        params.elements = elements;
        store('squares', params);

        return this;

    };

    // circles
    generator.circles = function (params) {

        params = paramsCheck('circles', params);

        var elements = [];

        for (var i = 0; i < params.count; i++) {

            var xys = xysize(i, params);
            draw.circle(p(xys.x, width), p(xys.y, height), p(xys.size, wha), true);
            elements.push(xys);

        }

        params.elements = elements;
        store('circles', params);

        return this;

    };

    // lines
    generator.lines = function (params) {

        params = paramsCheck('lines', params, function (params) {

            params.freq1s = randByArray(params.freq1s, true);
            params.freq1c = randByArray(params.freq1c, true);
            params.freq2s = randByArray(params.freq2s, true);
            params.freq2c = randByArray(params.freq2c, true);
            params.size = randByArray(params.size);
            return params;

        });

        for (var i = 0; i < params.count; i++) {

            var x1 = width / 2 + Math.sin(i / params.freq1s * calc.pi) * params.size;
            var y1 = height / 2 + Math.cos(i / params.freq1c * calc.pi) * params.size;
            var x2 = width / 2 + Math.sin(i / params.freq2s * calc.pi) * params.size;
            var y2 = height / 2 + Math.cos(i / params.freq2c * calc.pi) * params.size;

            draw.line(x1, y1, x2, y2);

        }

        store('lines', params);

        return this;

    };

    // lines2
    generator.lines2 = function (params) {

        params = paramsCheck('lines2', params);

        var elements = [];
        var item = null;

        for (var i = 0; i < params.count; i++) {

            if (params.elements != undefined) {

                item = params.elements[i];

            } else {

                item = {
                    size: randByArray(params.size, true),
                    d: randReal(0.1, 100)
                }

            }

            if (params.type == 'vertical') {
                draw.rect(p(item.d, width), 0, p(item.size, width), height);
            } else {
                draw.rect(0, p(item.d, width), width, p(item.size, width));
            }

            elements.push(item);

        }

        params.elements = elements;
        store('lines2', params);

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


    // clouds - midpoint displacement
    generator.clouds = function (params) {

        params = paramsCheck('clouds', params, function (params) {

            params.seed = randByArray(params.seed);
            params.roughness = randByArray(params.roughness);

            return params;

        });

        var map = [];
        var generateMap = function () {
            for (var x = 0; x <= width; x++) {
                map[x] = [];
                for (var y = 0; y <= height; y++) {
                    map[x][y] = 0;
                }
            }
        }

        var mapV = function (x, y, value) {

            if (x < 0) {
                x = width + x;
            }

            if (x >= width) {
                x = x - width;
            }

            if (y < 0) {
                y = height + y;

            }

            if (y >= height) {
                y = y - height;
            }

            if (value !== undefined) {
                return map[x][y] = value;
            } else {
                return map[x][y];
            }

        }

        var displace = function (num) {
            return (calc.randomseed() - 0.5) * (num / (width + width) * params.roughness);
        }

        var generateCloud = function (step) {

            var stepHalf = step / 2;
            if (stepHalf <= 1) {
                return;
            }

            for (var i = stepHalf - stepHalf; i <= (width + stepHalf); i += stepHalf) {
                for (var j = stepHalf - stepHalf; j <= (height + stepHalf); j += stepHalf) {

                    var topLeft = mapV(i - stepHalf, j - stepHalf);
                    var topRight = mapV(i, j - stepHalf);
                    var bottomLeft = mapV(i - stepHalf, j);
                    var bottomRight = mapV(i, j);

                    var x = i - (stepHalf / 2);
                    var y = j - (stepHalf / 2);

                    // center
                    var center = mapV(x, y, calc.normalize1((topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(step)));

                    // left
                    var xx = i - (step) + (stepHalf / 2);
                    mapV(i - stepHalf, y, calc.normalize1((topLeft + bottomLeft + center + mapV(xx, y)) / 4 + displace(step)));

                    // top
                    var yy = j - (step) + (stepHalf / 2);
                    mapV(x, j - stepHalf, calc.normalize1((topLeft + topRight + center + mapV(x, yy)) / 4 + displace(step)));

                }

            }

            generateCloud(stepHalf);

        }

        // init random seeder
        calc.randomseed(params.seed);

        // generate empty map
        generateMap();

        // generate cloud
        generateCloud(width);

        // colorize
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var color = 256 * map[x][y];
                point.rgba = point.colorize(params.rgba, [color, color, color, 1]);
                point.set(x, y);

            }
        }

        store('clouds', params);

        return this;

    };

    // map effect - aDDict2
    generator.map = function (params) {

        params = paramsCheck('map', params, function (params) {

            params.xamount = randByArray(params.xamount);
            params.yamount = randByArray(params.yamount);
            params.xchannel = randByArray(params.xchannel);
            params.ychannel = randByArray(params.ychannel);
            params.xlayer = randByArray(params.xlayer);
            params.ylayer = randByArray(params.ylayer);
            return params;

        });

        var buffer = new generator.buffer();

        var xcontext = canvases[params.xlayer].getContext('2d');
        var ximage = xcontext.getImageData(0, 0, width, height);
        var ximageData = ximage.data;

        var ycontext = canvases[params.ylayer].getContext('2d');
        var yimage = ycontext.getImageData(0, 0, width, height);
        var yimageData = yimage.data;


        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var offset = texture.offset(x, y);

                var sx = ximageData[offset + params.xchannel];
                var sy = yimageData[offset + params.ychannel];

                if ((width % 16) == 0) {
                    var ox = wrapx(x + ((sx * params.xamount * width) >> 16));
                } else {
                    var ox = x + ((sx * params.xamount * width) / (width * width));
                }

                if ((height % 16) == 0) {
                    var oy = wrapy(y + ((sy * params.yamount * height) >> 16));
                } else {
                    var oy = y + ((sy * params.yamount * height) / (height * height));
                }

                var rgba = point.get(ox, oy);

                buffer.data[offset] = rgba[0];
                buffer.data[offset + 1] = rgba[1];
                buffer.data[offset + 2] = rgba[2];
                buffer.data[offset + 3] = rgba[3];

            }
        }

        var pixels = texture.pixels();
        while (pixels--) {
            texture.data[pixels] = buffer.data[pixels];
        }

        store('map', params);

        return this;

    };


    // sinecolor - aDDict2
    generator.sinecolor = function (params) {

        params = paramsCheck('sinecolor', params, function (params) {

            params.sines = randByArray(params.sines);
            params.channel = randByArray(params.channel);
            return params;

        });

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var color = texture.get(x, y);
                var n = parseInt(Math.sin(color[params.channel] * (calc.pi / 180.0) * (255 / 360) * params.sines) * 255);
                color[params.channel] = Math.abs(n);
                texture.set(x, y, color);
            }
        }

        store('sinecolor', params);

        return this;

    };

    // subplasma - aDDict2
    generator.subplasma = function (params) {

        params = paramsCheck('subplasma', params, function (params) {

            params.seed = randByArray(params.seed);
            params.size = randByArray(params.size);
            return params;

        });

        calc.randomseed(params.seed);

        var np = 1 << params.size;
        var rx = width;
        var ry = rx;
        var buffer = [];
        var x, y;

        if (np > rx) {
            np = rx;
        }

        var ssize = rx / np;

        for (y = 0; y < np; y++) {
            for (x = 0; x < np; x++) {
                buffer[x * ssize + y * ssize * rx] = calc.randomseed();
            }
        }

        for (y = 0; y < np; y++) {
            for (x = 0; x < rx; x++) {
                var p = x & (~(ssize - 1));
                var zy = y * ssize * rx;
                buffer[x + zy] = calc.interpolate.catmullrom(
                    buffer[((p - ssize * 1) & (rx - 1)) + zy],
                    buffer[((p - ssize * 0) & (rx - 1)) + zy],
                    buffer[((p + ssize * 1) & (rx - 1)) + zy],
                    buffer[((p + ssize * 2) & (rx - 1)) + zy],
                    x % ssize, ssize);
            }
        }

        for (y = 0; y < ry; y++) {
            for (x = 0; x < rx; x++) {
                var p = y & (~(ssize - 1));
                buffer[x + y * rx] = calc.interpolate.catmullrom(
                    buffer[x + ((p - ssize * 1) & (ry - 1)) * rx],
                    buffer[x + ((p - ssize * 0) & (ry - 1)) * rx],
                    buffer[x + ((p + ssize * 1) & (ry - 1)) * rx],
                    buffer[x + ((p + ssize * 2) & (ry - 1)) * rx],
                    y % ssize, ssize);
            }
        }

        // colorize
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var color = 256 * buffer[x + y * rx];
                point.rgba = point.colorize(params.rgba, [color, color, color, 1]);
                point.set(x, y);

            }
        }

        store('subplasma', params);

        return this;

    };


    // test for correct positioning and colors
    generator.test = function () {

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

        params = paramsCheck('fill', params);
        draw.rect(1, 1, width, height);
        store('fill', params);

        return this;

    };

    // copy texture to image
    generator.toContext = function (context) {

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
        var imageData = this.toContext(context);
        context.putImageData(imageData, 0, 0);

        return canvas;
    };

    // get canvas
    generator.getCanvas = function (func) {

        if (func) {
            func(canvases[canvases.length - 1]);
        }

        return this;

    };

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


    // save to localstorage
    generator.history = {

        available: function () {

            try {
                return 'localStorage' in window && window['localStorage'] !== null && window['localStorage'] !== undefined;
            } catch (e) {
                return false;
            }

        },

        list: function () {

            if (!this.available()) {
                return [];
            }

            return JSON.parse(localStorage.getItem(historyName)) || [];

        },

        last: function () {

            if (!this.available()) {
                return [];
            }

            return historyList[historyList.length - 1];

        },

        get: function (index) {

            if (!this.available()) {
                return [];
            }

            if (!historyList[index]) {
                return null;
            }

            return historyList[index];

        },

        add: function (name) {

            if (!historyLast) {
                return;
            }

            if (!this.available()) {
                return [];
            }

            var params = generator.params(name);

            historyList = JSON.parse(localStorage.getItem(historyName)) || [];

            if (historyList.length >= historyLast) {
                historyList.shift();
            }

            historyList.push(params);

            localStorage.setItem(historyName, JSON.stringify(historyList));

        }

    }


    generator.params = function (name) {

        if (name == undefined) {

            var d = new Date();
            var itemcount = rendered.length;
            var layers = canvases.length;
            name = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' l' + layers + ' i' + itemcount;

        }

        return {
            "name": name,
            "version": version,
            "width": width,
            "height": height,
            "items": rendered
        }

    }

    // parse params
    generator.render = function (config, noclear) {

        // store current layer
        var current = 0;

        // set canvas size;
        if (config.width != undefined) {
            width = config.width;
        }

        if (config.height != undefined) {
            height = config.height;
        }

        checkSize();
        texture = new generator.buffer();

        if (noclear != true) {
            reset();
        }

        // items parse
        for (var key in config.items) {

            layer = config.items[key][0];
            var effect = config.items[key][1];
            var values = config.items[key][2];

            if (effect == "random") {
                effect = randProperty(generator.defaults);
            }

            // if random effect
            if (typeof effect == "object") {
                effect = randItem(effect);
            }

            if (current != layer) {
                if (canvases[layer] != undefined) {
                    texture.canvas(canvases[layer]);
                } else {
                    texture.clear();
                }
                current = layer;
            }


            switch (effect) {

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

        // save to localstorage
        generator.history.add();

        return this;

    }

    // the generator object
    return generator;

}


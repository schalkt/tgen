module.exports = function (tgen) {
  tgen.getGenerator = function (width, height, normalize) {
    var self = this;
    var rendered = []; // rendered effects real params
    var time = {}; // time object for stat
    var layerId = 0; // start layer id
    var wha = null; // width and height average

    // generator object
    var generator = {
      shape: self.shapes,
      effects: Object.keys(self.effects),
      layers: [],
      normalize: normalize ? normalize : "limitless", // clamped, pingpong, limitless, compress
    };

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

      if (width > 2048) {
        width = 2048;
      }

      if (height > 2048) {
        height = 2048;
      }

      // if undefined height = width
      if (height == undefined) {
        height = width;
      }

      wha = (width + height) / 2;
    };

    checkSize();

    // log
    generator.log = function () {
      if (this.debug && arguments.length > 0) {
        var output = [];
        for (var i = 0; i < arguments.length; i++) {
          output.push(arguments[i]);
        }
        console.log(output);
      }
    };

    // reset the generator
    generator.clear = function () {
      generator.texture.clear();
      generator.layers = [];
      rendered = [];
      layerId = 0;

      // start time
      time.start = new Date().getTime();

      return generator;
    };

    generator.buffer = function (background) {
      this.data = null;
      this.debug = false;
      this.components = 4;
      this.width = width;
      this.height = height;
      this.wha = (this.width + this.height) / 2;
      this.background = [0, 0, 0, 255];

      if (typeof background == "object") {
        this.background = background;
      }

      this.pixels = function () {
        return this.width * this.height;
      };

      this.size = function () {
        return this.data.length;
      };

      this.export = function (normalize, texture) {
        //var size = this.size();
        normalize = normalize !== undefined ? normalize : generator.normalize;
        texture = texture ? texture : this.data;
        var size = texture.length;
        var data;

        switch (normalize) {
          case "limitless":
            data = new Float32Array(size);
            while (size--) {
              data[size] = texture[size];
            }
            break;

          case "clamped":
            data = new Uint8ClampedArray(size);
            while (size--) {
              data[size] = texture[size];
            }
            break;

          case "pingpong":
            data = new Uint8ClampedArray(size);
            while (size--) {
              data[size] = generator.calc.pingpong(texture[size], 0, 255);
            }
            break;

          case "compress":
            data = new Uint8ClampedArray(size);
            var min = texture[0];
            var max = texture[0];
            var s = size;

            while (s--) {
              if (texture[s]) {
                min = Math.min(min, texture[s]);
                max = Math.max(max, texture[s]);
              }
            }

            min = Math.floor(min);
            max = Math.ceil(max);
            var range = max - min;
            var percent = 255 / range;

            while (size) {
              data[size - 1] = texture[size - 1]; // opacity
              data[size - 2] = (texture[size - 2] - min) * percent;
              data[size - 3] = (texture[size - 3] - min) * percent;
              data[size - 4] = (texture[size - 4] - min) * percent;
              size = size - 4;
            }
            break;
        }

        return data;
      };

      this.clear = function (rgba) {
        this.data = new Float32Array(
          this.width * this.height * this.components
        );

        if (rgba == undefined) {
          rgba = this.background;
        }

        var size = this.size();
        while (size) {
          this.data[size - 1] = rgba[3];
          this.data[size - 2] = rgba[2];
          this.data[size - 3] = rgba[1];
          this.data[size - 4] = rgba[0];
          size = size - this.components;
        }
      };

      this.pattern = function (val, max) {
        var smax, sval;
        var s = val / max;

        if (val >= max) {
          smax = Math.floor(s) * max;
          sval = val - smax;
          return sval;
        }

        if (val < 0) {
          smax = Math.ceil(s) * max;
          sval = max - Math.abs(val - smax);
          if (sval >= max) {
            sval = sval - max;
            return sval;
          }
          return sval;
        }
      };

      this.offset = function (x, y) {
        x = Math.round(x);
        y = Math.round(y);

        // if x not in the correct size
        if (x < 0 || x >= this.width) {
          x = this.pattern(x, this.width);
        }

        // if y not in the correct size
        if (y < 0 || y >= this.height) {
          y = this.pattern(y, this.height);
        }

        return y * this.width * this.components + x * this.components;
      };

      this.set = function (x, y, values) {
        var offset = this.offset(x, y);

        this.data[offset] = values[0];
        this.data[offset + 1] = values[1];
        this.data[offset + 2] = values[2];
        this.data[offset + 3] = values[3];
      };

      this.get = function (x, y) {
        var offset = this.offset(x, y);

        return [
          this.data[offset],
          this.data[offset + 1],
          this.data[offset + 2],
          this.data[offset + 3],
        ];
      };

      this.alpha = function (type) {
        switch (type) {
          case "sphere":
            while (size) {
              generator.texture.data[size] = 0.5; //imageData[size];
              size = size - 4;
            }

            break;
        }
      };

      // copy canvas to texture
      this.canvas = function (canvas) {
        var size = this.size();
        var context = canvas.getContext("2d");
        var image = context.getImageData(0, 0, this.width, this.height);
        var imageData = image.data;

        while (size--) {
          generator.texture.data[size] = imageData[size];
        }
      };

      if (this.data === null) {
        this.clear();
      }
    };

    // texture object
    generator.texture = new generator.buffer();

    generator.layerCopy = function (layerId) {
      var data = [];
      var layer = this.layers[layerId];
      var length = layer.length;

      while (length--) {
        data[length] = layer[length];
      }

      return data;
    };

    // generator.clone = function (destination, source) {
    //   return Object.assign(destination, source);     
    // };

    generator.minMaxNormalize = function (min, max) {
      return {
        min: Math.min(min, max),
        max: Math.max(min, max),
      };
    };

    // random int min max
    generator.randInt = function (min, max, even) {
      var mul;
      var norm = generator.minMaxNormalize(min, max);

      min = norm.min;
      max = norm.max;

      if (even === true) {
        min = Math.round(min / 2);
        max = Math.round(max / 2);
        mul = 2;
      } else {
        mul = 1;
      }

      return mul * (Math.floor(Math.random() * (max - min + 1)) + min);
    };

    // random int min max by seed
    generator.randIntSeed = function (min, max, even) {
      var norm = generator.minMaxNormalize(min, max);
      min = norm.min;
      max = norm.max;

      if (even === true) {
        min = Math.round(min / 2);
        max = Math.round(max / 2);
        mul = 2;
      } else {
        mul = 1;
      }

      return (
        mul * (Math.floor(generator.calc.randomseed() * (max - min + 1)) + min)
      );
    };

    // random real min max
    generator.randReal = function (min, max) {
      var norm = generator.minMaxNormalize(min, max);
      min = norm.min;
      max = norm.max;
      return Math.random() * (max - min) + min;
    };

    // random real min max by seed
    generator.randRealSeed = function (min, max) {
      var norm = generator.minMaxNormalize(min, max);
      min = norm.min;
      max = norm.max;
      return generator.calc.randomseed() * (max - min) + min;
    };

    generator.randByArray = function (data, real) {
      if (
        data === null || data === undefined ||
        typeof data !== "object" ||
        data[0] === undefined
      ) {
        generator.calc.seed++;
        return data;
      }

      if (real !== undefined) {
        data = generator.randReal(data[0], data[1]);
      } else {
        data = generator.randInt(data[0], data[1]);
      }

      return data;
    };

    generator.randByArraySeed = function (data, real, even) {
      if (
        data === undefined ||
        data === null ||
        typeof data !== "object" ||
        data[0] === undefined
      ) {
        generator.calc.seed++;
        return data;
      }

      if (real) {
        data = generator.randRealSeed(data[0], data[1]);
      } else {
        data = generator.randIntSeed(data[0], data[1], even);
      }

      return data;
    };

    // get random int by array or defaults
    generator.randIntByArraySeed = function (data, defaults, even) {
      if (data === undefined || data === null || data === "random") {
        data = defaults;
      }

      if (typeof data !== "object") {
        generator.calc.seed++;
        return data;
      }

      data = generator.randIntSeed(data[0], data[1], even);

      return data;
    };

    // get random real by array or defaults
    generator.randRealByArraySeed = function (data, defaults) {
      if (data === undefined || data === null || data === "random") {
        data = defaults;
      }

      if (typeof data !== "object") {
        generator.calc.seed++;
        return data;
      }

      data = generator.randRealSeed(data[0], data[1]);

      return data;
    };

    // get random array item
    generator.randItemSeed = function (array) {
      if (typeof array !== "object" || array[0] === undefined) {
        generator.calc.seed++;
        return array;
      }

      var count = array.length;
      var index = generator.randIntSeed(0, count - 1);
      return array[index];
    };

    generator.randItemByArray = function (current, array) {
      
      if (current !== undefined && current !== null && current !== "random") {
        return current;
      }

      var count = array.length;
      var index = generator.randInt(0, count - 1);

      return array[index];

    };    

    generator.randItemByArraySeed = function (current, array) {
      if (current !== undefined && current !== null && current !== "random") {
        generator.calc.seed++;
        return current;
      }

      var count = array.length;
      var index = generator.randIntSeed(0, count - 1);

      return array[index];
    };

    // get random property from object
    generator.randProperty = function (current, obj) {
      if (current !== undefined && current !== null && current !== "random") {
        generator.calc.seed++;
        return current;
      }

      var keys = Object.keys(obj);
      var key = generator.randByArraySeed([0, keys.length - 1]);

      return keys[key];
    };

    // set rgba color - if the channel is an array then random
    generator.rgba = function (rgba, alpha) {

      if (rgba === "random" || rgba === undefined || rgba === null) {
        rgba = [[0, 255], [0, 255], [0, 255], 255];
      }

      if (rgba === "randomalpha") {
        rgba = [
          [0, 255],
          [0, 255],
          [0, 255],
          [128, 255],
        ];
      }

      if (rgba[0] === undefined || rgba[0] === null) {
        rgba[0] = 0;
      }

      if (rgba[1] === undefined || rgba[1] === null) {
        rgba[1] = 0;
      }

      if (rgba[2] === undefined || rgba[2] === null) {
        rgba[2] = 0;
      }

      if (rgba[3] === undefined || rgba[3] === null) {
        rgba[3] = 255;
      }

      rgba[0] = generator.randByArraySeed(rgba[0]);
      rgba[1] = generator.randByArraySeed(rgba[1]);
      rgba[2] = generator.randByArraySeed(rgba[2]);
      rgba[3] = generator.randByArraySeed(rgba[3]);

      // opacity fallback
      // TODO remove after update the database
      if (rgba[3] % 1 !== 0) {
        rgba[3] = Math.round(rgba[3] * 255);
      }

      if (rgba[3] == 1) {
        rgba[3] = 255;
      }

      return rgba;
    };

    // effect parameters fill with default values
    var paramsCheck = function (params, name) {

      params.count = generator.randByArraySeed(params.count);
      params.level = generator.randByArraySeed(params.level);
      params.opacity = generator.randByArraySeed(params.opacity);

      // set blend
      if (params.blend !== undefined) {
        // random blend
        params.blend = generator.randProperty(params.blend, self.blends);

        // random blend by array
        params.blend = generator.randItemSeed(params.blend);
        generator.point.blend = params.blend;
      } else {
        generator.point.blend = "";
      }

      // set rgba only if needed          
      if (self.defaults[name] && self.defaults[name].rgba) {
        params.rgba = generator.rgba(params.rgba);
      }

      if (params.rgba) {
        generator.point.rgba = [
          params.rgba[0],
          params.rgba[1],
          params.rgba[2],
          params.rgba[3],
        ];
      }

      // remove undefined
      Object.keys(params).forEach(function (key) {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      return params;
    };

    // store generated texture params for save
    var store = function (layerId, type, params) {
      rendered.push([layerId, type, params]);
    };

    // find closest item in array
    generator.findClosestIndex = function (array, start, step) {
      for (var i = start; i >= 0 && i <= array.length - 1; i += step)
        if (array[i]) {
          return i;
        }

      return array.length - 1;
    };


    generator.easing = {

      PI: 3.1415926535, //Math.PI;
      c1: 1.70158,
      c2: this.c1 * 1.525,
      c3: this.c1 + 1,
      c4: (2 * this.PI) / 3,
      c5: (2 * this.PI) / 4.5,

      InQuad(x) {
        return x * x;
      },

      OutQuad(x) {
        return 1 - (1 - x) * (1 - x);
      },

      InOutQuad(x) {
        return x < 0.5 ?
          2 * x * x :
          1 - Math.pow(-2 * x + 2, 2) / 2;
      },

      InCubic(x) {
        return x * x * x;
      },

      OutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
      },

      InOutCubic(x) {
        return x < 0.5 ?
          4 * x * x * x :
          1 - Math.pow(-2 * x + 2, 3) / 2;
      },

      InQuart(x) {
        return x * x * x * x;
      },

      OutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
      },

      InOutQuart(x) {
        return x < 0.5 ?
          8 * x * x * x * x :
          1 - Math.pow(-2 * x + 2, 4) / 2;
      },

      InQuint(x) {
        return x * x * x * x * x;
      },

      OutQuint(x) {
        return 1 - Math.pow(1 - x, 5);
      },

      InOutQuint(x) {
        return x < 0.5 ?
          16 * x * x * x * x * x :
          1 - Math.pow(-2 * x + 2, 5) / 2;
      },

      InSine(x) {
        return 1 - Math.cos(x * this.PI / 2);
      },

      OutSine(x) {
        return Math.sin(x * this.PI / 2);
      },

      InOutSine(x) {
        return -(Math.cos(this.PI * x) - 1) / 2;
      },

      InExpo(x) {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
      },

      OutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },

      InOutExpo(x) {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ?
          Math.pow(2, 20 * x - 10) / 2 :
          (2 - Math.pow(2, -20 * x + 10)) / 2;
      },

      InCirc(x) {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
      },

      OutCirc(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
      },

      InOutCirc(x) {
        return x < 0.5 ?
          (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 :
          (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
      },

      InBack(x) {
        return this.c3 * x * x * x - this.c1 * x * x;
      },

      OutBack(x) {
        return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
      },

      InOutBack(x) {
        return x < 0.5 ?
          (Math.pow(2 * x, 2) * ((this.c2 + 1) * 2 * x - this.c2)) / 2 :
          (Math.pow(2 * x - 2, 2) * ((this.c2 + 1) * (x * 2 - 2) + this.c2) + 2) / 2;
      },

      InElastic(x) {
        return x === 0 ? 0 : x === 1 ? 1 :
          -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * this.c4);
      },

      OutElastic(x) {
        return x === 0 ? 0 : x === 1 ? 1 :
          Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
      },

      InOutElastic(x) {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ?
          -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * this.c5)) / 2 :
          Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * this.c5) / 2 + 1;
      },

      InBounce(x) {
        return 1 - this.OutBounce(1 - x);
      },

      OutBounce(x) {

        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
          return n1 * x * x;
        } else if (x < 2 / d1) {
          return n1 * (x -= (1.5 / d1)) * x + .75;
        } else if (x < 2.5 / d1) {
          return n1 * (x -= (2.25 / d1)) * x + .9375;
        } else {
          return n1 * (x -= (2.625 / d1)) * x + .984375;
        }

      },

      InOutBounce(x) {
        return x < 0.5 ?
          (1 - this.OutBounce(1 - 2 * x)) / 2 :
          (1 + this.OutBounce(2 * x - 1)) / 2;
      },

    };

    // calculations
    generator.calc = {
      seed: undefined,
      pi: 3.1415927,

      luminance: function (color) {
        //return (0.299 * color[0]) + (0.587 * color[1]) + (0.114 * color[2]);
        return 0.21 * color[0] + 0.72 * color[1] + 0.07 * color[2];
      },

      randomseed: function (seed) {

        if (seed !== undefined) {
          this.seed = seed;
        } else if (this.seed === undefined) {
          this.seed = generator.randInt(1, Number.MAX_SAFE_INTEGER);
        }

        var x = Math.sin(this.seed++) * 10000;

        return x - Math.floor(x);

      },

      normalize1: function (value) {
        return generator.calc.normalize(value, 0, 1);
      },

      normalize255: function (value) {
        return generator.calc.normalize(value, 0, 255);
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

      pingpong: function (value, min, max) {
        var range = max - min;
        var range2 = range + range;

        value = value - Math.floor(value / range2) * range2;
        value = range - Math.abs(value - range);

        return value;
      },

      interpolate: {
        linear: function (a, b, x) {
          return a * (1 - x) + b * x;
        },

        cosine: function (a, b, x) {
          var ft = x * generator.calc.pi;
          var f = (1 - Math.cos(ft)) * 0.5;

          return a * (1 - f) + b * f;
        },

        catmullrom: function (v0, v1, v2, v3, x, distance) {
          var xx = x / distance;
          var P = v3 - v2 - (v0 - v1);
          var Q = v0 - v1 - P;
          var R = v2 - v0;
          var t = P * xx * xx * xx + Q * xx * xx + R * xx + v1;

          if (t < 0) t = 0;
          if (t > 1) t = 1;

          return t;
        },
      },
    };

    generator.colormap = {

      data: null,
      easing: null,
      reverse: false,
      size: 255,

      init: function (colormap, size, callback) {

        this.data = null;
        this.size = size == undefined ? width : size;

        if (colormap == undefined || colormap == null) {
          return colormap;
        }

        // colormap random by arrays
        if (typeof colormap == "object") {

          if (typeof colormap[0] == "object") {

            // by items rgba
            for (var key in colormap) {
              var item = colormap[key];
              item.rgba = generator.rgba(item.rgba);
              colormap[key] = item;
            }

          } else {

            // by name
            colormap = generator.randItemSeed(colormap);

          }
        }

        // random
        if (colormap === "random") {
          colormap = this.random();
        }

        if (typeof colormap == "string") {

          // var parts = colormap.split('|');
          // var colormap = parts[0];
          // this.easing = parts[1] ? parts[1] : null;

          if (colormap.charAt(0) == "!") {
            colormap = colormap.substring(1);
            this.reverse = true;
          }


          if (typeof self.colormaps[colormap] == "function") {
            var items = self.colormaps[colormap](size);
            this.data = this.render(items);
          }
        }

        if (typeof colormap == "object") {
          this.data = this.render(colormap);
        }

        // callback for store real params
        if (typeof callback == "function") {
          callback(colormap);
        }

      },

      random: function(count) {

        count = count ? count : generator.randIntSeed(2, 7);
        var map = [];

        for (var i = 0; i <= count; i++) {
          map[i] = {
            percent: parseInt((i / count) * 100),
            rgba: [
              generator.randIntSeed(0, 255),
              generator.randIntSeed(0, 255),
              generator.randIntSeed(0, 255),
              255,
            ],
          };
        }

        return map;

      },

      render: function (items) {

        var colormap = [];

        for (var p = 0; p < items.length - 1; p++) {

          var current = items[p];
          var next = items[p + 1];
          var currentIndex = Math.round(this.size * (current.percent / 100));
          var nextIndex = Math.round(this.size * (next.percent / 100));
          var idx;

          for (var i = currentIndex; i <= nextIndex; i++) {

            idx = this.reverse ? this.size - i : i;

            colormap[idx] = [
              current.rgba[0] +
              ((i - currentIndex) / (nextIndex - currentIndex)) *
              (next.rgba[0] - current.rgba[0]),
              current.rgba[1] +
              ((i - currentIndex) / (nextIndex - currentIndex)) *
              (next.rgba[1] - current.rgba[1]),
              current.rgba[2] +
              ((i - currentIndex) / (nextIndex - currentIndex)) *
              (next.rgba[2] - current.rgba[2]),
              current.rgba[3] +
              ((i - currentIndex) / (nextIndex - currentIndex)) *
              (next.rgba[3] - current.rgba[3]),
            ];

          }
        }

        return colormap;

      },

      get: function (index, rgba) {

        var indexNew = generator.calc.pingpong(parseInt(index), 0, this.size);
        var color = this.data[indexNew];

        // save original alpha
        if (rgba !== undefined) {
          color[3] = rgba[3];
        }

        return color;
      },

    };

    generator.wrapx = function (x) {
      return x & (width - 1);
    };

    generator.wrapy = function (y) {
      return y & (height - 1);
    };

    generator.blend = function (type, rgba1, rgba2) {

      if (self.blends[type]) {
        return self.blends[type](generator, rgba1, rgba2);
      }
      
    };

    // put a point, the magic is here
    generator.point = {
      rgba: [],
      mixed: [],
      blend: "opacity",

      colorize: function (rgba1, rgba2, level) {
        if (level === undefined) {
          level = 50;
        }

        return [
          rgba1[0] - (rgba1[0] - rgba2[0]) * (level / 100),
          rgba1[1] - (rgba1[1] - rgba2[1]) * (level / 100),
          rgba1[2] - (rgba1[2] - rgba2[2]) * (level / 100),
          rgba2[3] ? rgba2[3] : 255,
        ];
      },

      opacity: function (input, current) {
        // if no opacity then return original values with current alpha
        if (input[3] == 255) {
          input[3] = current[3]; // set current alpha
          return input;
        }

        if (current[3] == 0) {
          return current;
        }

        var io = input[3] / 255;

        // calc opacity
        return [
          input[0] * io + current[0] * (1 - io),
          input[1] * io + current[1] * (1 - io),
          input[2] * io + current[2] * (1 - io),
          current[3],
        ];
      },

      // set the pixel
      set: function (x, y) {
        var current = generator.texture.get(x, y);

        // calculate blend
        if (self.blends[this.blend] !== undefined) {
          this.rgba = self.blends[this.blend](generator, current, this.rgba);
          this.mixed = this.opacity(this.rgba, current);
        } else {
          this.mixed = this.rgba;
        }

        switch (generator.normalize) {
          case "clamped":
            this.mixed[0] = Math.max(0, Math.min(255, this.mixed[0]));
            this.mixed[1] = Math.max(0, Math.min(255, this.mixed[1]));
            this.mixed[2] = Math.max(0, Math.min(255, this.mixed[2]));
            this.mixed[3] = Math.max(0, Math.min(255, this.mixed[3]));
            break;

          case "pingpong":
            this.mixed[0] = generator.calc.pingpong(this.mixed[0], 0, 255);
            this.mixed[1] = generator.calc.pingpong(this.mixed[1], 0, 255);
            this.mixed[2] = generator.calc.pingpong(this.mixed[2], 0, 255);
            this.mixed[3] = generator.calc.pingpong(this.mixed[3], 0, 255);
            break;

          default:
            // do nothing :)
            break;
        }

        generator.texture.set(x, y, this.mixed);
      },

      // get the pixel
      get: function (x, y) {
        return generator.texture.get(x, y);
      },
    };

    // read and modify all pixel by callback function
    generator.walk = function (func) {
      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          var color = generator.point.get(x, y);
          color = func(color, x, y);
          generator.point.rgba = color;
          generator.point.set(x, y);
        }
      }
    };

    // for percent calculations
    generator.percent = function (c, max) {
      return parseInt((c / 100) * max, 10);
    };

    generator.percentX = function (c) {
      return parseInt((c / 100) * width, 10);
    };

    generator.percentY = function (c) {
      return parseInt((c / 100) * height, 10);
    };

    generator.percentXY = function (c) {
      return parseInt((c / 100) * wha, 10);
    };

    generator.percentRGBA = function (rgbFrom, rgbTo, percent) {
      rgbTo[0] = rgbTo[0] === null ? rgbFrom[0] : rgbTo[0];
      rgbTo[1] = rgbTo[1] === null ? rgbFrom[1] : rgbTo[1];
      rgbTo[2] = rgbTo[2] === null ? rgbFrom[2] : rgbTo[2];
      rgbTo[3] = rgbTo[3] === null ? rgbFrom[3] : rgbTo[3];

      return [
        Math.round(rgbFrom[0] + (rgbTo[0] - rgbFrom[0]) * percent),
        Math.round(rgbFrom[1] + (rgbTo[1] - rgbFrom[1]) * percent),
        Math.round(rgbFrom[2] + (rgbTo[2] - rgbFrom[2]) * percent),
        Math.round(rgbFrom[3] + (rgbTo[3] - rgbFrom[3]) * percent),
      ];
    };

    generator.xysize = function (i, params) {
      var x, y, size;

      if (params.elements != undefined) {
        // x and y values from params elements array
        x = params.elements[i].x;
        y = params.elements[i].y;
        size = params.elements[i].size;
      } else if (params.origin == "random") {
        // random x and y
        x = generator.randIntSeed(0, width);
        y = generator.randIntSeed(0, height);
        size = generator.randByArraySeed(params.size);
      } else {
        // centered x and y, only size random
        x = params.origin[0];
        y = params.origin[1];
        size = generator.randByArraySeed(params.size);
      }

      return {
        x: x,
        y: y,
        size: size,
      };
    };

    // copy texture to image
    generator.toContext = function (context, texture) {
      var image = context.createImageData(width, height);
      var data = image.data;
      var length = texture.length;

      for (var i = 0; i < length; i += 4) {
        data[i] = texture[i];
        data[i + 1] = texture[i + 1];
        data[i + 2] = texture[i + 2];
        data[i + 3] = texture[i + 3];
      }

      return image;
    };

    // copy image to canvas
    generator.toCanvas = function (texture, w, h) {

      if (texture === undefined || texture === null) {
        texture = generator.texture.data;
      }

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      var imageData = this.toContext(context, texture);

      context.putImageData(imageData, 0, 0);

      if (w && h) {
        var newcanvas = document.createElement("canvas");
        var newcontext = newcanvas.getContext("2d");
        newcontext.imageSmoothingEnabled = true;
        newcanvas.width = w;
        newcanvas.height = h;
        newcontext.drawImage(canvas, 0, 0, width, height, 0, 0, w, h);

        return newcanvas;
      } else {
        return canvas;
      }

    };

    // get canvas
    generator.getCanvas = function (func) {
      if (func) {
        func(this.toCanvas(this.layers[this.layers.length - 1]));
      }

      return this;
    };

    // get phases (layers)
    generator.getPhases = function (func) {
      if (func) {
        var phases = [];
        var length = generator.layers.length;

        for (var i = 0; i < length; i++) {
          phases.push(this.toCanvas(this.layers[i]));
        }

        func(phases);
      }

      return this;
    };

    // stat
    generator.stat = function (func) {
      time.stop = new Date().getTime();
      time.elapsed = (time.stop - time.start) / 1000;

      if (func) {
        func(time);
      }

      return this;
    };

    generator.params = function (name) {

      if (name == undefined) {
        var d = new Date();
        name =
          d.getHours() +
          ":" +
          d.getMinutes() +
          ":" +
          d.getSeconds() +
          " l" +
          generator.layers.length +
          " i" +
          rendered.length;
      }

      return {
        name: name,
        version: self.version,
        width: width,
        height: height,
        normalize: generator.normalize,
        items: rendered,
      };
    };

    generator.parseLayers = function (config) {

      if (!config.layers) {
        return;
      }

      var items = [];

      config.layers.forEach(function (layer, index) {
        layer.items.forEach(function (item) {
          items.push([
            index,
            item[0],
            item[1],
          ]);
        });
      });

      config.items = items;

    };

    generator.prepareConfig = function (config) {

      if (config === undefined || config === null) {
        config = {};
      }

      this.parseLayers(config);

      // parse items and set defaults
      for (var index in config.items) {

        effect = config.items[index][1];
        values = (config.items[index][2] !== undefined && config.items[index][2] !== null) ? config.items[index][2] : {};

        if (self.defaults[effect]) {
          for (var key in self.defaults[effect]) {

            if (values[key] === undefined) {
              values[key] = self.defaults[effect][key];

              if (values[key] === 'randomalpha') {
                values[key] = tgen.randomRGBA;
              }

            }

          }

        }
      }

    };

    // parse params
    generator.render = function (configInput, progress, prepared) {

      var configOriginal = JSON.parse(JSON.stringify(configInput));
      this.prepareConfig(configInput);

      var config = JSON.parse(JSON.stringify(configInput));

      // console.log('prepared', configInput.items[0][2]);
      // console.log('original', configOriginal.items[0][2]);
      // console.log('progress', config.items[0][2]);

      // return;

      this.config = config;
      this.debug = config.debug === true ? true : false;


      this.itemsAll = config.items.length;

      // set progress callback
      generator.progress = progress;

      // store current layer
      var layerId = 0;
      var currentId = 0;
      var effect, values;

      // set canvas size;
      if (config.width != undefined) {
        width = config.width;
      }

      if (config.height != undefined) {
        height = config.height;
      }

      if (config.normalize != undefined) {
        generator.normalize = config.normalize;
      } else {
        generator.normalize = "limitless";
      }

      checkSize();
      generator.texture = new generator.buffer(config.background);
      generator.clear();


      // import preset items
      if (config.preset && config.preset.name) {
        var name = config.preset.name;

        if (config.preset.name === "random") {
          name = generator.randItemByArraySeed(null, Object.keys(tgen.presets));
        }

        if (typeof config.preset.name === "object") {
          name = generator.randItemByArraySeed(null, config.preset.name);
        }

        if (name) {
          var key;
          var items = JSON.parse(JSON.stringify(tgen.presets[name].items));

          if (config.preset.seed) {
            for (key in items) {
              if (items[key][2] && self.defaults[name].seed) {
                items[key][2].seed = config.preset.seed;
              }
            }
          }

          for (key in config.items) {
            items.push(config.items[key]);
          }

          config.items = items;
        }
      }


      // call event
      generator.event("before-render", {
        config: {
          original: configOriginal,
          current: config
        }
      });


      // items parse
      for (var index in config.items) {

        layerId = config.items[index][0];
        effect = config.items[index][1];
        values = (config.items[index][2] !== undefined && config.items[index][2] !== null) ? config.items[index][2] : {};

        if (layerId === null) {
          layerId = effect === "copy" ? currentId + 1 : currentId;
        }

        if (config.seed !== undefined && config.seed !== null && self.defaults[name].seed) {
          if (values.seed === undefined || values.seed === null) {
            values.seed = config.seed;
          }
        }

        if (effect == "random") {
          effect = generator.randProperty(generator.defaults);
        }

        // if random effect
        if (typeof effect == "object") {
          effect = generator.randItemSeed(effect);
        }

        if (currentId != layerId) {
          if (generator.layers[layerId] != undefined) {
            generator.texture.data = generator.layers[layerId];
          } else {
            generator.texture.clear();
          }
          currentId = layerId;
        }

        // call event
        generator.event("before-effect", {
          layerId: layerId,
          itemIndex: index,
          effect: name,
          params: values,
        });

        if (!values.skip) {

          if (generator[effect] != undefined) {
            generator[effect](values);
          } else if (self.effects[effect] != undefined) {
            config.items[index][2] = generator.do(effect, values, layerId, index);
          } else {
            console.warn("undefined effect: " + effect);
          }

        }

        generator.layers[layerId] = generator.texture.export();

        // call event
        generator.event("after-effect", {
          layerId: layerId,
          itemIndex: index,
          effect: name,
          params: config.items[index][2]
        });

      }

      // call event
      generator.event("after-render", {
        config: generator.config,
        original: configOriginal
      });

      return this;

    };

    // call events
    generator.event = function (eventName, data) {

      if (generator.progress) {

        data = data ? data : {};
        data.config = generator.params();
        data.layers = generator.layers.length;
        data.items = generator.itemsAll;
        data.$g = generator;

        if (data.layerId !== undefined && data.layerId !== null) {
          data.layer = generator.layers[data.layerId];
        }

        generator.progress(eventName, data);

      }

      // for (var key in self.events[eventName]) {
      //   var event = self.events[eventName][key];
      //   if (typeof event == "function") {
      //     event(generator, data);
      //   }
      // }

    };

    generator.do = function (name, params, layerId, itemIndex) {

      // params = params ? params : self.defaults[name];
      //mergeParams(params, self.defaults[name], false);  

      params = Object.assign({}, self.defaults[name], params);

      // setup random seed if undefined
      if (params.seed !== undefined) {
        params.seed = params.seed !== null ? params.seed : [1, Number.MAX_SAFE_INTEGER];
        params.seed = generator.randByArray(params.seed);
      }

      // init random seed
      generator.calc.randomseed(params.seed);

      // check params
      paramsCheck(params, name);

      // run effect
      if (typeof self.effects[name] === "function") {

        if (self.prepare[name] && typeof self.prepare[name] === "function") {
          self.prepare[name](generator, params);
        }

        self.effects[name](generator, params);

      } else {
        console.warn("effect not callable: " + name);
      }

      // if (params === undefined) {
      //   params = originalparams;
      // }

      if (params && params.store !== false) {
        store(layerId, name, params);
      }

      return params;

    };

    // generator.preset = function (name, seed) {

    //     if (!name || !self.presets[name]) {
    //         console.warn('preset not found:'.name);
    //         return;
    //     }

    //     var params = mergeParams({}, self.presets[name]);
    //     params.width = self.width;
    //     params.height = self.height;

    //     if (seed) {

    //         for (var index in params.items) {

    //             var layer = params.items[index];

    //             seed++;

    //             if (layer[2]) {
    //                 params.items[index][2].seed = seed;
    //             } else {
    //                 params.items[index][2] = {
    //                     seed: seed
    //                 };
    //             }
    //         }

    //     }

    //     var texture = generator.render(params);

    //     return texture;

    // };

    return generator;
  };

};


/*
 tgen.js - the seamless texture generator
 https://github.com/schalkt/tgen/
 http://texture-generator.com/

 Copyright (c) 2015 Tamas Schalk
 MIT license

 @version 0.5.0
*/
(function(fn) {
  window[fn] = {version:"0.5.0", defaults:{}, effects:{}, blends:{}, shapes:{}, colormaps:{}, events:{beforeEffect:{}, afterEffect:{}, beforeRender:{}, afterRender:{}}, config:{historyLast:15, historyName:"history", historyList:[]}, effect:function(name, defaults, func) {
    this.defaults[name] = defaults;
    this.effects[name] = func;
  }, event:function(when, name, func) {
    if (this.events[when] == undefined) {
      return;
    }
    this.events[when][name] = func;
  }, blend:function(name, func) {
    this.blends[name] = func;
  }, shape:function(name, func) {
    this.shapes[name] = func;
  }, colormap:function(name, func) {
    this.colormaps[name] = func;
  }, init:function(width, height, normalize) {
    var self = this;
    var rendered = [];
    var time = {};
    var layer = 0;
    var wha = null;
    var generator = {shape:self.shapes, effects:Object.keys(self.effects), layers:[], normalize:normalize ? normalize : "limitless"};
    var checkSize = function() {
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
      if (height == undefined) {
        height = width;
      }
      wha = (width + height) / 2;
    };
    checkSize();
    generator.clear = function() {
      generator.texture.clear();
      generator.layers = [];
      rendered = [];
      layer = 0;
      time.start = (new Date).getTime();
      return generator;
    };
    generator.buffer = function(background) {
      this.data = null;
      this.components = 4;
      this.width = width;
      this.height = height;
      this.wha = (this.width + this.height) / 2;
      this.background = [0, 0, 0, 255];
      if (typeof background == "object") {
        this.background = background;
      }
      this.pixels = function() {
        return this.width * this.height;
      };
      this.size = function() {
        return this.data.length;
      };
      this.export = function() {
        var size = this.size();
        switch(generator.normalize) {
          case "limitless":
            var data = new Float32Array(size);
            while (size--) {
              data[size] = this.data[size];
            }
            break;
          case "clamped":
            var data = new Uint8ClampedArray(size);
            while (size--) {
              data[size] = this.data[size];
            }
            break;
          case "pingpong":
            var data = new Uint8ClampedArray(size);
            while (size--) {
              data[size] = generator.calc.pingpong(this.data[size], 0, 255);
            }
            break;
        }
        return data;
      };
      this.clear = function(rgba) {
        this.data = new Float32Array(this.width * this.height * this.components);
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
      this.pattern = function(val, max) {
        var s = val / max;
        if (val >= max) {
          var smax = Math.floor(s) * max;
          var sval = val - smax;
          return sval;
        }
        if (val < 0) {
          var smax = Math.ceil(s) * max;
          var sval = max - Math.abs(val - smax);
          if (sval >= max) {
            sval = sval - max;
            return sval;
          }
          return sval;
        }
      };
      this.offset = function(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.width) {
          x = this.pattern(x, this.width);
        }
        if (y < 0 || y >= this.height) {
          y = this.pattern(y, this.height);
        }
        return y * this.width * this.components + x * this.components;
      };
      this.set = function(x, y, values) {
        var offset = this.offset(x, y);
        this.data[offset] = values[0];
        this.data[offset + 1] = values[1];
        this.data[offset + 2] = values[2];
        this.data[offset + 3] = values[3];
      };
      this.get = function(x, y) {
        var offset = this.offset(x, y);
        return [this.data[offset], this.data[offset + 1], this.data[offset + 2], this.data[offset + 3]];
      };
      this.canvas = function(canvas) {
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
    generator.texture = new generator.buffer;
    generator.layerCopy = function(layer) {
      var data = [];
      var layer = this.layers[layer];
      var length = layer.length;
      while (length--) {
        data[length] = layer[length];
      }
      return data;
    };
    var mergeParams = function(obj1, obj2) {
      var obj3 = {};
      for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
      }
      for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
      }
      return obj3;
    };
    generator.clone = function(destination, source) {
      for (var property in source) {
        if (typeof source[property] === "object" && source[property] !== null && destination[property]) {
          this.clone(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
    };
    generator.randInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    generator.randIntSeed = function(min, max) {
      return Math.floor(generator.calc.randomseed() * (max - min + 1)) + min;
    };
    generator.randReal = function(min, max) {
      return Math.random() * (max - min) + min;
    };
    generator.randRealSeed = function(min, max) {
      return generator.calc.randomseed() * (max - min) + min;
    };
    generator.randByArray = function(data, real) {
      if (typeof data == "object") {
        if (real != undefined) {
          data = generator.randReal(data[0], data[1]);
        } else {
          data = generator.randInt(data[0], data[1]);
        }
      }
      return data;
    };
    generator.randByArraySeed = function(data, real) {
      if (typeof data == "object") {
        if (real != undefined) {
          data = generator.randRealSeed(data[0], data[1]);
        } else {
          data = generator.randIntSeed(data[0], data[1]);
        }
      }
      return data;
    };
    var randColor = function(opacity) {
      if (opacity === undefined) {
        opacity = 255;
      }
      if (opacity === true) {
        opacity = 128 + generator.randInt(0, 128);
      }
      return [generator.randInt(0, 255), generator.randInt(0, 255), generator.randInt(0, 255), opacity];
    };
    var randBlend = function() {
      return randProperty(self.blends);
    };
    generator.randItem = function(array) {
      var count = array.length;
      var index = generator.randInt(0, count - 1);
      return array[index];
    };
    var randProperty = function(obj) {
      var result;
      var count = 0;
      for (var prop in obj) {
        if (Math.random() < 1 / ++count) {
          result = prop;
        }
      }
      return result;
    };
    generator.rgba = function(rgba, alpha) {
      if (rgba === "random") {
        return randColor(alpha);
      }
      if (rgba === "randomalpha") {
        return randColor(true);
      }
      if (typeof rgba[0] == "object") {
        rgba[0] = generator.randInt(rgba[0][0], rgba[0][1]);
      }
      if (typeof rgba[1] == "object") {
        rgba[1] = generator.randInt(rgba[1][0], rgba[1][1]);
      }
      if (typeof rgba[2] == "object") {
        rgba[2] = generator.randInt(rgba[2][0], rgba[2][1]);
      }
      if (typeof rgba[3] == "object") {
        rgba[3] = generator.randInt(rgba[3][0], rgba[3][1]);
      }
      if (rgba[3] % 1 !== 0) {
        rgba[3] = Math.round(rgba[3] * 255);
      }
      if (rgba[3] == 1) {
        rgba[3] = 255;
      }
      return rgba;
    };
    var paramsCheck = function(type, params, func) {
      if (func !== undefined) {
        params = func(params);
      }
      if (typeof params.count == "object") {
        params.count = generator.randInt(params.count[0], params.count[1]);
      }
      if (params.blend === "random") {
        params.blend = randBlend();
      }
      if (typeof params.blend == "object") {
        var max = params.blend.length;
        params.blend = params.blend[generator.randInt(0, max - 1)];
      }
      if (params.blend !== undefined) {
        generator.point.blend = params.blend;
      } else {
        generator.point.blend = "";
      }
      if (params.rgba) {
        params.rgba = generator.rgba(params.rgba);
        generator.point.rgba = [params.rgba[0], params.rgba[1], params.rgba[2], params.rgba[3]];
      }
      if (params.rgb) {
        params.rgb = generator.rgba(params.rgb);
        generator.point.rgba = [params.rgb[0], params.rgb[1], params.rgb[2], 255];
      }
      return params;
    };
    var store = function(type, params) {
      rendered.push([layer, type, params]);
    };
    generator.findClosestIndex = function(array, start, step) {
      for (var i = start; i >= 0 && i <= array.length - 1; i += step) {
        if (array[i]) {
          return i;
        }
      }
      return array.length - 1;
    };
    generator.calc = {pi:3.1415927, luminance:function(color) {
      return 0.21 * color[0] + 0.72 * color[1] + 0.07 * color[2];
    }, randomseed:function(seed) {
      if (this.seed == undefined) {
        this.seed = generator.randInt(1, 262140);
      }
      if (seed !== undefined) {
        this.seed = seed;
      }
      var x = Math.sin(this.seed++) * 10000;
      return x - Math.floor(x);
    }, normalize1:function(value) {
      return generator.calc.normalize(value, 0, 1);
    }, normalize:function(value, min, max) {
      if (value > max) {
        return max;
      }
      if (value < min) {
        return min;
      }
      return value;
    }, pingpong:function(value, min, max) {
      if (value > max) {
        var r = value - max;
        return max - r;
      }
      if (value < min) {
        return Math.abs(min);
      }
      return value;
    }, interpolate:{linear:function(a, b, x) {
      return a * (1 - x) + b * x;
    }, cosine:function(a, b, x) {
      var ft = x * generator.calc.pi;
      var f = (1 - Math.cos(ft)) * 0.5;
      return a * (1 - f) + b * f;
    }, catmullrom:function(v0, v1, v2, v3, x, distance) {
      var xx = x / distance;
      var P = v3 - v2 - (v0 - v1);
      var Q = v0 - v1 - P;
      var R = v2 - v0;
      var t = P * xx * xx * xx + Q * xx * xx + R * xx + v1;
      if (t < 0) {
        t = 0;
      }
      if (t > 1) {
        t = 1;
      }
      return t;
    }}};
    generator.colormap = {data:null, size:255, init:function(colormap, size, callback) {
      this.data = null;
      this.size = size == undefined ? width : size;
      if (colormap == undefined || colormap == null) {
        return colormap;
      }
      if (typeof colormap == "object") {
        if (typeof colormap[0] == "object") {
          for (key in colormap) {
            var item = colormap[key];
            item.rgba = generator.rgba(item.rgba);
            colormap[key] = item;
          }
        } else {
          colormap = generator.randItem(colormap);
        }
      }
      if (colormap === "random") {
        var count = generator.randInt(1, 4);
        var colormap = [];
        for (var i = 0; i <= count; i++) {
          colormap[i] = {percent:parseInt(i / count * 100), rgba:[generator.randInt(0, 255), generator.randInt(0, 255), generator.randInt(0, 255), 255]};
        }
      }
      if (typeof callback == "function") {
        callback(colormap);
      }
      if (typeof colormap == "string") {
        var reverse = false;
        if (colormap.charAt(0) == "!") {
          colormap = colormap.substring(1);
          reverse = true;
        }
        if (typeof self.colormaps[colormap] == "function") {
          var items = self.colormaps[colormap](size);
          this.data = this.render(items, reverse);
        }
      }
      if (typeof colormap == "object") {
        this.data = this.render(colormap);
      }
    }, render:function(items, reverse) {
      var colormap = [];
      for (var p = 0; p < items.length - 1; p++) {
        var current = items[p];
        var next = items[p + 1];
        var currentIndex = Math.round(this.size * (current.percent / 100));
        var nextIndex = Math.round(this.size * (next.percent / 100));
        for (var i = currentIndex; i <= nextIndex; i++) {
          var idx = reverse ? this.size - i : i;
          colormap[idx] = [current.rgba[0] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[0] - current.rgba[0]), current.rgba[1] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[1] - current.rgba[1]), current.rgba[2] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[2] - current.rgba[2]), current.rgba[3] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[3] - current.rgba[3])];
        }
      }
      return colormap;
    }, get:function(index, rgba) {
      if (index == undefined) {
        return this.data;
      }
      index = generator.calc.pingpong(parseInt(index), 0, this.size);
      var color = this.data[index];
      if (rgba !== undefined) {
        color[3] = rgba[3];
      }
      return color;
    }};
    generator.wrapx = function(x) {
      return x & width - 1;
    };
    generator.wrapy = function(y) {
      return y & height - 1;
    };
    generator.point = {rgba:[], mixed:[], blend:"opacity", colorize:function(rgba1, rgba2, level) {
      if (level === undefined) {
        level = 50;
      }
      return [rgba1[0] - (rgba1[0] - rgba2[0]) * (level / 100), rgba1[1] - (rgba1[1] - rgba2[1]) * (level / 100), rgba1[2] - (rgba1[2] - rgba2[2]) * (level / 100), rgba2[3] ? rgba2[3] : 255];
    }, opacity:function(input, current) {
      if (input[3] == 255) {
        input[3] = current[3];
        return input;
      }
      if (current[3] == 0) {
        return current;
      }
      var io = input[3] / 255;
      return [input[0] * io + current[0] * (1 - io), input[1] * io + current[1] * (1 - io), input[2] * io + current[2] * (1 - io), current[3]];
    }, set:function(x, y) {
      var current = generator.texture.get(x, y);
      if (self.blends[this.blend] !== undefined) {
        this.rgba = self.blends[this.blend](generator, current, this.rgba);
        this.mixed = this.opacity(this.rgba, current);
      } else {
        this.mixed = this.rgba;
      }
      switch(generator.normalize) {
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
        case "limitless":
        default:
          break;
      }
      generator.texture.set(x, y, this.mixed);
    }, get:function(x, y, normalize) {
      return generator.texture.get(x, y);
    }};
    generator.walk = function(func) {
      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          var color = generator.point.get(x, y);
          color = func(color, x, y);
          generator.point.rgba = color;
          generator.point.set(x, y);
        }
      }
    };
    generator.percent = function(c, max) {
      return parseInt(c / 100 * max, 10);
    };
    generator.percentX = function(c) {
      return parseInt(c / 100 * width, 10);
    };
    generator.percentY = function(c) {
      return parseInt(c / 100 * height, 10);
    };
    generator.percentXY = function(c) {
      return parseInt(c / 100 * wha, 10);
    };
    generator.xysize = function(i, params) {
      if (params.elements != undefined) {
        var x = params.elements[i].x;
        var y = params.elements[i].y;
        var size = params.elements[i].size;
      } else {
        if (params.origin == "random") {
          var x = generator.randIntSeed(0, width);
          var y = generator.randIntSeed(0, height);
          var size = generator.randByArraySeed(params.size);
        } else {
          var x = params.origin[0];
          var y = params.origin[1];
          var size = generator.randByArraySeed(params.size);
        }
      }
      return {x:x, y:y, size:size};
    };
    generator.toContext = function(context, texture) {
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
    generator.toCanvas = function(texture) {
      if (texture == undefined) {
        texture = generator.texture.data;
      }
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      var imageData = this.toContext(context, texture);
      context.putImageData(imageData, 0, 0);
      return canvas;
    };
    generator.getCanvas = function(func) {
      if (func) {
        var layer = this.layers[this.layers.length - 1];
        var canvas = this.toCanvas(layer);
        func(canvas);
      }
      return this;
    };
    generator.getPhases = function(func) {
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
    generator.stat = function(func) {
      time.stop = (new Date).getTime();
      time.elapsed = (time.stop - time.start) / 1000;
      if (func) {
        func(time);
      }
      return this;
    };
    generator.history = {available:function() {
      try {
        return "localStorage" in window && window["localStorage"] !== null && window["localStorage"] !== undefined;
      } catch (e) {
        return false;
      }
    }, list:function() {
      if (!this.available()) {
        return [];
      }
      return JSON.parse(window.localStorage.getItem(self.config.historyName)) || [];
    }, last:function() {
      if (!this.available()) {
        return [];
      }
      return self.config.historyList[self.config.historyList.length - 1];
    }, get:function(index) {
      if (!this.available()) {
        return [];
      }
      if (!self.config.historyList[index]) {
        return null;
      }
      return self.config.historyList[index];
    }, add:function(name) {
      if (!self.config.historyLast) {
        return;
      }
      if (!this.available()) {
        return [];
      }
      var params = generator.params(name);
      self.config.historyList = JSON.parse(window.localStorage.getItem(self.config.historyName)) || [];
      if (self.config.historyList.length >= self.config.historyLast) {
        self.config.historyList.shift();
      }
      self.config.historyList.push(params);
      window.localStorage.setItem(self.config.historyName, JSON.stringify(self.config.historyList));
    }};
    generator.params = function(name) {
      if (name == undefined) {
        var d = new Date;
        name = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " l" + generator.layers.length + " i" + rendered.length;
      }
      return {"name":name, "version":self.version, "width":width, "height":height, "normalize":generator.normalize, "items":rendered};
    };
    generator.render = function(config, noclear) {
      generator.event("beforeRender", config);
      var current = 0;
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
      if (noclear != true) {
        generator.clear();
      }
      for (var key in config.items) {
        layer = config.items[key][0];
        var effect = config.items[key][1];
        var values = config.items[key][2];
        if (effect == "random") {
          effect = randProperty(generator.defaults);
        }
        if (typeof effect == "object") {
          effect = generator.randItem(effect);
        }
        if (current != layer) {
          if (generator.layers[layer] != undefined) {
            generator.texture.data = generator.layers[layer];
          } else {
            generator.texture.clear();
          }
          current = layer;
        }
        if (generator[effect] != undefined) {
          generator[effect](values);
        } else {
          if (self.effects[effect] != undefined) {
            generator.do(effect, values);
          } else {
            console.warn("undefined effect: " + effect);
          }
        }
        generator.layers[layer] = generator.texture.export();
      }
      generator.event("afterRender", generator.params());
      generator.history.add();
      return this;
    };
    generator.event = function(eventName, data) {
      for (var key in self.events[eventName]) {
        var event = self.events[eventName][key];
        if (typeof event == "function") {
          event(generator, data);
        }
      }
    };
    generator.do = function(name, params) {
      var originalparams = params;
      if (params === undefined) {
        params = mergeParams({}, self.defaults[name]);
      } else {
        if (typeof params == "object") {
          params = mergeParams(self.defaults[name], params);
        }
      }
      params = paramsCheck(name, params);
      generator.event("beforeEffect", {layer:layer, name:name, params:params});
      if (typeof self.effects[name] == "function") {
        params = self.effects[name](generator, params);
      } else {
        console.warn("effect not callable: " + name);
      }
      if (params === undefined) {
        params = originalparams;
      }
      generator.event("afterEffect", {layer:layer, name:name, params:params});
      if (params.store !== false) {
        store(name, params);
      }
      return generator;
    };
    return generator;
  }};
})("tgen");
(function(fn) {
  var tgen = window[fn];
  tgen.colormap("blackwhite", function() {
    return [{percent:0, rgba:[0, 0, 0, 255]}, {percent:25, rgba:[255, 255, 255, 255]}, {percent:50, rgba:[0, 0, 0, 255]}, {percent:75, rgba:[255, 255, 255, 255]}, {percent:100, rgba:[0, 0, 0, 255]}];
  });
  tgen.colormap("dawn", function() {
    return [{percent:0, rgba:[255, 255, 192, 255]}, {percent:25, rgba:[255, 255, 128, 255]}, {percent:50, rgba:[255, 128, 128, 255]}, {percent:75, rgba:[128, 0, 128, 255]}, {percent:100, rgba:[0, 0, 128, 255]}];
  });
  tgen.colormap("dusk", function() {
    return [{percent:0, rgba:[255, 255, 255, 255]}, {percent:25, rgba:[255, 128, 255, 255]}, {percent:50, rgba:[128, 0, 255, 255]}, {percent:75, rgba:[0, 0, 128, 255]}, {percent:100, rgba:[0, 0, 0, 255]}];
  });
  tgen.colormap("kryptonite", function() {
    return [{percent:0, rgba:[255, 255, 255, 255]}, {percent:25, rgba:[255, 255, 128, 255]}, {percent:50, rgba:[128, 255, 0, 255]}, {percent:75, rgba:[0, 128, 0, 255]}, {percent:100, rgba:[0, 0, 0, 255]}];
  });
  tgen.colormap("ice", function() {
    return [{percent:0, rgba:[255, 255, 255, 255]}, {percent:25, rgba:[128, 255, 255, 255]}, {percent:50, rgba:[0, 128, 255, 255]}, {percent:75, rgba:[0, 0, 128, 255]}, {percent:100, rgba:[0, 0, 0, 255]}];
  });
  tgen.colormap("fire", function() {
    return [{percent:0, rgba:[255, 255, 255, 255]}, {percent:25, rgba:[255, 255, 128, 255]}, {percent:50, rgba:[255, 128, 0, 255]}, {percent:75, rgba:[128, 0, 0, 255]}, {percent:100, rgba:[0, 0, 0, 255]}];
  });
  tgen.colormap("redblue", function() {
    return [{percent:0, rgba:[96, 0, 0, 255]}, {percent:25, rgba:[192, 0, 0, 255]}, {percent:50, rgba:[255, 255, 255, 255]}, {percent:75, rgba:[0, 0, 192, 255]}, {percent:100, rgba:[0, 0, 96, 255]}];
  });
  tgen.colormap("seashore", function() {
    return [{percent:0, rgba:[255, 255, 192, 255]}, {percent:25, rgba:[255, 255, 128, 255]}, {percent:50, rgba:[128, 255, 128, 255]}, {percent:75, rgba:[0, 128, 128, 255]}, {percent:100, rgba:[0, 0, 128, 255]}];
  });
})("tgen");
(function(fn) {
  var tgen = window[fn];
  tgen.blend("opacity", function($g, current, input) {
    return input;
  });
  tgen.blend("multiply", function($g, current, input) {
    input[0] = current[0] * input[0] / 255;
    input[1] = current[1] * input[1] / 255;
    input[2] = current[2] * input[2] / 255;
    return input;
  });
  tgen.blend("difference", function($g, current, input) {
    input[0] = Math.abs(input[0] - current[0]);
    input[1] = Math.abs(input[1] - current[1]);
    input[2] = Math.abs(input[2] - current[2]);
    return input;
  });
  tgen.blend("screen", function($g, current, input) {
    input[0] = 255 - (255 - current[0]) * (255 - input[0]) / 255;
    input[1] = 255 - (255 - current[1]) * (255 - input[1]) / 255;
    input[2] = 255 - (255 - current[2]) * (255 - input[2]) / 255;
    return input;
  });
  tgen.blend("overlay", function($g, current, input) {
    input[0] = current[0] > 128 ? 255 - 2 * (255 - input[0]) * (255 - current[0]) / 255 : current[0] * input[0] * 2 / 255;
    input[1] = current[1] > 128 ? 255 - 2 * (255 - input[1]) * (255 - current[1]) / 255 : current[1] * input[1] * 2 / 255;
    input[2] = current[2] > 128 ? 255 - 2 * (255 - input[2]) * (255 - current[2]) / 255 : current[2] * input[2] * 2 / 255;
    return input;
  });
  tgen.blend("exclusion", function($g, current, input) {
    input[0] = 128 - 2 * (current[0] - 128) * (input[0] - 128) / 255;
    input[1] = 128 - 2 * (current[1] - 128) * (input[1] - 128) / 255;
    input[2] = 128 - 2 * (current[2] - 128) * (input[2] - 128) / 255;
    return input;
  });
  tgen.blend("darken", function($g, current, input) {
    input[0] = input[0] < current[0] ? input[0] : current[0];
    input[1] = input[1] < current[1] ? input[1] : current[1];
    input[2] = input[2] < current[2] ? input[2] : current[2];
    return input;
  });
  tgen.blend("lighten", function($g, current, input) {
    input[0] = input[0] > current[0] ? input[0] : current[0];
    input[1] = input[1] > current[1] ? input[1] : current[1];
    input[2] = input[2] > current[2] ? input[2] : current[2];
    return input;
  });
  tgen.blend("lineardodge", function($g, current, input) {
    input[0] = current[0] + input[0];
    input[1] = current[1] + input[1];
    input[2] = current[2] + input[2];
    return input;
  });
  tgen.blend("linearlight", function($g, current, input) {
    input[0] = current[0] + 2 * input[0] - 255;
    input[1] = current[1] + 2 * input[1] - 255;
    input[2] = current[2] + 2 * input[2] - 255;
    return input;
  });
  tgen.blend("linearburn", function($g, current, input) {
    input[0] = current[0] + input[0] - 255;
    input[1] = current[1] + input[1] - 255;
    input[2] = current[2] + input[2] - 255;
    return input;
  });
  tgen.blend("softlight", function($g, current, input) {
    input[0] = current[0] > 128 ? 255 - (255 - current[0]) * (255 - (input[0] - 128)) / 255 : current[0] * (input[0] + 128) / 255;
    input[1] = current[1] > 128 ? 255 - (255 - current[1]) * (255 - (input[1] - 128)) / 255 : current[1] * (input[1] + 128) / 255;
    input[2] = current[2] > 128 ? 255 - (255 - current[2]) * (255 - (input[2] - 128)) / 255 : current[2] * (input[2] + 128) / 255;
    return input;
  });
})("tgen");
(function(fn) {
  var tgen = window[fn];
  tgen.effect("fill", {blend:"", rgba:[128, 128, 128, 255]}, function($g, params) {
    $g.shape.rect($g, 1, 1, $g.texture.width, $g.texture.height);
    return params;
  });
  tgen.effect("copy", {"layer":null}, function($g, params) {
    if (typeof params == "number") {
      params = {"layer":params};
    }
    if (params.layer === null) {
      params.layer = $g.layers.length - 1;
    }
    if ($g.layers[params.layer] != undefined) {
      $g.texture.data = $g.layerCopy(params.layer);
    }
    return params;
  });
  tgen.effect("merge", {blend:"opacity", layer:0, opacity:null}, function($g, params) {
    if ($g.layers[params.layer] === undefined) {
      return this;
    }
    var imageData = $g.layers[params.layer];
    for (var y = 0; y < $g.texture.height; y++) {
      for (var x = 0; x < $g.texture.width; x++) {
        var offset = $g.texture.offset(x, y);
        $g.point.rgba = [imageData[offset], imageData[offset + 1], imageData[offset + 2], params.opacity ? params.opacity : imageData[offset + 3]];
        $g.point.set(x, y);
      }
    }
    return params;
  });
  tgen.effect("noise", {blend:"softlight", mode:"monochrome", opacity:128}, function($g, params) {
    if (params.mode == "color") {
      $g.walk(function(color) {
        color = [$g.randInt(0, 255), $g.randInt(0, 255), $g.randInt(0, 255), params.opacity];
        return color;
      });
    } else {
      $g.walk(function(color) {
        var rnd = $g.randInt(0, 255);
        color = [rnd, rnd, rnd, params.opacity];
        return color;
      });
    }
    return params;
  });
  tgen.effect("spheres", {blend:"lighten", rgba:"random", origin:"random", dynamic:false, count:21, size:[20, 70], seed:[1, 262140]}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    $g.calc.randomseed(params.seed);
    for (var i = 0; i < params.count; i++) {
      var xys = $g.xysize(i, params);
      $g.shape.sphere($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true, params.rgba, params.dynamic);
    }
    return params;
  });
  tgen.effect("pyramids", {blend:"lighten", rgba:"random", origin:"random", dynamic:false, count:21, size:[21, 100], seed:[1, 262140]}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    $g.calc.randomseed(params.seed);
    for (var i = 0; i < params.count; i++) {
      var xys = $g.xysize(i, params);
      $g.shape.pyramid($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), true, params.rgba, params.dynamic);
    }
    return params;
  });
  tgen.effect("squares", {blend:"lighten", rgba:"random", origin:"random", count:[4, 7], size:[2, 50], seed:[1, 262140]}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    $g.calc.randomseed(params.seed);
    for (var i = 0; i < params.count; i++) {
      var xys = $g.xysize(i, params);
      $g.shape.rect($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), false);
    }
    return params;
  });
  tgen.effect("circles", {blend:"lighten", rgba:"random", origin:"random", count:21, size:[1, 15], seed:[1, 262140]}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    $g.calc.randomseed(params.seed);
    for (var i = 0; i < params.count; i++) {
      var xys = $g.xysize(i, params);
      $g.shape.circle($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true);
    }
    return params;
  });
  tgen.effect("lines", {blend:"opacity", rgba:"random", size:[100, 200], count:[100, 400], freq1s:[21, 150], freq1c:[21, 150], freq2s:[21, 150], freq2c:[21, 150]}, function($g, params) {
    params.freq1s = $g.randByArray(params.freq1s, true);
    params.freq1c = $g.randByArray(params.freq1c, true);
    params.freq2s = $g.randByArray(params.freq2s, true);
    params.freq2c = $g.randByArray(params.freq2c, true);
    params.size = $g.randByArray(params.size);
    for (var i = 0; i < params.count; i++) {
      var x1 = $g.texture.width / 2 + Math.sin(i / params.freq1s * $g.calc.pi) * params.size;
      var y1 = $g.texture.height / 2 + Math.cos(i / params.freq1c * $g.calc.pi) * params.size;
      var x2 = $g.texture.width / 2 + Math.sin(i / params.freq2s * $g.calc.pi) * params.size;
      var y2 = $g.texture.height / 2 + Math.cos(i / params.freq2c * $g.calc.pi) * params.size;
      $g.shape.line($g, x1, y1, x2, y2);
    }
    return params;
  });
  tgen.effect("lines2", {blend:["opacity", "lighten", "screen"], rgba:"random", type:"vertical", size:[0.1, 12], count:[2, 32], seed:[1, 262140]}, function($g, params) {
    var item = null;
    params.seed = $g.randByArray(params.seed);
    $g.calc.randomseed(params.seed);
    for (var i = 0; i < params.count; i++) {
      if (params.elements != undefined) {
        item = params.elements[i];
      } else {
        item = {size:$g.randByArraySeed(params.size, true), d:$g.randRealSeed(0.1, 100)};
      }
      if (params.type == "vertical") {
        $g.shape.rect($g, $g.percentX(item.d), 0, $g.percentX(item.size), $g.texture.height);
      } else {
        $g.shape.rect($g, 0, $g.percentX(item.d), $g.texture.width, $g.percentX(item.size));
      }
    }
    return params;
  });
  tgen.effect("subplasma", {seed:[1, 262140], size:[3, 4], rgba:"random"}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    params.size = $g.randByArray(params.size);
    $g.calc.randomseed(params.seed);
    var np = 1 << params.size;
    var rx = $g.texture.width;
    var ry = rx;
    var buffer = [];
    var x, y;
    if (np > rx) {
      np = rx;
    }
    var ssize = rx / np;
    for (y = 0; y < np; y++) {
      for (x = 0; x < np; x++) {
        buffer[x * ssize + y * ssize * rx] = $g.calc.randomseed();
      }
    }
    for (y = 0; y < np; y++) {
      for (x = 0; x < rx; x++) {
        var p = x & ~(ssize - 1);
        var zy = y * ssize * rx;
        buffer[x + zy] = $g.calc.interpolate.catmullrom(buffer[(p - ssize * 1 & rx - 1) + zy], buffer[(p - ssize * 0 & rx - 1) + zy], buffer[(p + ssize * 1 & rx - 1) + zy], buffer[(p + ssize * 2 & rx - 1) + zy], x % ssize, ssize);
      }
    }
    for (y = 0; y < ry; y++) {
      for (x = 0; x < rx; x++) {
        var p = y & ~(ssize - 1);
        buffer[x + y * rx] = $g.calc.interpolate.catmullrom(buffer[x + (p - ssize * 1 & ry - 1) * rx], buffer[x + (p - ssize * 0 & ry - 1) * rx], buffer[x + (p + ssize * 1 & ry - 1) * rx], buffer[x + (p + ssize * 2 & ry - 1) * rx], y % ssize, ssize);
      }
    }
    for (x = 0; x < $g.texture.width; x++) {
      for (y = 0; y < $g.texture.height; y++) {
        var color = 255 * buffer[x + y * rx];
        $g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 255]);
        $g.point.set(x, y);
      }
    }
    return params;
  });
  tgen.effect("waves", {blend:"opacity", rgba:"random", level:50, xsines:[1, 10], ysines:[1, 10]}, function($g, params) {
    if (params.xsines === undefined) {
      params.xsines = $g.randInt(1, 10);
    } else {
      if (typeof params.xsines == "object") {
        params.xsines = $g.randInt(params.xsines[0], params.xsines[1]);
      }
    }
    if (params.ysines === undefined) {
      params.ysines = $g.randInt(1, 10);
    } else {
      if (typeof params.ysines == "object") {
        params.ysines = $g.randInt(params.ysines[0], params.ysines[1]);
      }
    }
    if (params.rgba === undefined) {
      var o = params.opacity !== undefined ? params.opacity : 255;
      params.rgba = $g.rgba([[0, 255], [0, 255], [0, 255], o]);
    }
    for (var x = 0; x < $g.texture.width; x++) {
      for (var y = 0; y < $g.texture.height; y++) {
        var c = 127 + 63.5 * Math.sin(x / $g.texture.width * params.xsines * 2 * $g.calc.pi) + 63.5 * Math.sin(y / $g.texture.height * params.ysines * 2 * $g.calc.pi);
        if (typeof params.channels == "object") {
          $g.point.rgba = [params.channels[0] ? c : 0, params.channels[1] ? c : 0, params.channels[2] ? c : 0, params.channels[3] ? c : 0];
        } else {
          $g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
        }
        $g.point.set(x, y);
      }
    }
    return params;
  });
  tgen.effect("crosshatch", {blend:"random", level:50}, function($g, params) {
    if (params.xadjust == undefined) {
      params.xadjust = $g.randInt(1, 10);
    }
    if (params.yadjust === undefined) {
      params.yadjust = $g.randInt(1, 10);
    }
    if (params.rgba === undefined) {
      params.rgba = [$g.randInt(0, 255), $g.randInt(0, 255), $g.randInt(0, 255), 255];
    }
    for (var x = 0; x < $g.texture.width; x++) {
      for (var y = 0; y < $g.texture.height; y++) {
        var c = 127 + 63.5 * Math.sin(x * x / params.xadjust) + 63.5 * Math.cos(y * y / params.yadjust);
        $g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
        $g.point.set(x, y);
      }
    }
    return params;
  });
  tgen.effect("map", {xamount:[5, 255], yamount:[5, 255], xchannel:[0, 2], ychannel:[0, 2], xlayer:0, ylayer:0}, function($g, params) {
    params.xamount = $g.randByArray(params.xamount);
    params.yamount = $g.randByArray(params.yamount);
    params.xchannel = $g.randByArray(params.xchannel);
    params.ychannel = $g.randByArray(params.ychannel);
    params.xlayer = $g.randByArray(params.xlayer);
    params.ylayer = $g.randByArray(params.ylayer);
    var buffer = new $g.buffer;
    var width = $g.texture.width;
    var height = $g.texture.height;
    var ximageData = $g.layers[params.xlayer];
    var yimageData = $g.layers[params.ylayer];
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var offset = $g.texture.offset(x, y);
        var sx = ximageData[offset + params.xchannel];
        var sy = yimageData[offset + params.ychannel];
        if (width % 16 == 0) {
          var ox = $g.wrapx(x + (sx * params.xamount * width >> 16));
        } else {
          var ox = x + sx * params.xamount * width / (width * width);
        }
        if (height % 16 == 0) {
          var oy = $g.wrapy(y + (sy * params.yamount * height >> 16));
        } else {
          var oy = y + sy * params.yamount * height / (height * height);
        }
        var rgba = $g.point.get(ox, oy);
        buffer.data[offset] = rgba[0];
        buffer.data[offset + 1] = rgba[1];
        buffer.data[offset + 2] = rgba[2];
        buffer.data[offset + 3] = rgba[3];
      }
    }
    var size = $g.texture.size();
    while (size--) {
      $g.texture.data[size] = buffer.data[size];
    }
    return params;
  });
  tgen.effect("clouds", {blend:"opacity", rgba:"random", seed:[1, 262140], roughness:[2, 16], colormap:null}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    params.roughness = $g.randByArray(params.roughness);
    var width = $g.texture.width;
    var height = $g.texture.height;
    var map = [];
    var generateMap = function() {
      for (var x = 0; x <= width; x++) {
        map[x] = [];
        for (var y = 0; y <= height; y++) {
          map[x][y] = 0;
        }
      }
    };
    var mapV = function(x, y, value) {
      x = Math.round(x);
      y = Math.round(y);
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
    };
    var displace = function(num) {
      return ($g.calc.randomseed() - 0.5) * (num / (width + width) * params.roughness);
    };
    var generateCloud = function(step) {
      var stepHalf = step / 2;
      if (stepHalf <= 1) {
        return params;
      }
      for (var i = stepHalf - stepHalf; i <= width + stepHalf; i += stepHalf) {
        for (var j = stepHalf - stepHalf; j <= height + stepHalf; j += stepHalf) {
          var topLeft = mapV(i - stepHalf, j - stepHalf);
          var topRight = mapV(i, j - stepHalf);
          var bottomLeft = mapV(i - stepHalf, j);
          var bottomRight = mapV(i, j);
          var x = i - stepHalf / 2;
          var y = j - stepHalf / 2;
          var center = mapV(x, y, $g.calc.normalize1((topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(step)));
          var xx = i - step + stepHalf / 2;
          mapV(i - stepHalf, y, $g.calc.normalize1((topLeft + bottomLeft + center + mapV(xx, y)) / 4 + displace(step)));
          var yy = j - step + stepHalf / 2;
          mapV(x, j - stepHalf, $g.calc.normalize1((topLeft + topRight + center + mapV(x, yy)) / 4 + displace(step)));
        }
      }
      generateCloud(stepHalf);
    };
    $g.calc.randomseed(params.seed);
    generateMap();
    generateCloud(width);
    $g.colormap.init(params.colormap, 255, function(cmap) {
      params.colormap = cmap;
    });
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var color = parseInt(255 * map[x][y], 10);
        if ($g.colormap.data !== null) {
          $g.point.rgba = $g.colormap.get(color, params.rgba);
        } else {
          $g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 255]);
        }
        $g.point.set(x, y);
      }
    }
    return params;
  });
  tgen.effect("colorbar", {type:"horizontal", mirror:false, colormap:[{percent:0, rgba:[[0, 255], [0, 255], [0, 255], 255]}, {percent:25, rgba:[[0, 255], [0, 255], [0, 255], 255]}, {percent:50, rgba:[[0, 255], [0, 255], [0, 255], 255]}, {percent:75, rgba:[[0, 255], [0, 255], [0, 255], 255]}, {percent:100, rgba:[[0, 255], [0, 255], [0, 255], 255]}]}, function($g, params) {
    var width = $g.texture.width;
    var height = $g.texture.height;
    var size = params.type == "horizontal" ? width : height;
    var colormap = $g.colormap.init(params.colormap, size, function(cmap) {
      params.colormap = cmap;
    });
    if (params.type == "horizontal") {
      for (var x = 0; x < width; x++) {
        if (params.mirror) {
          var q = x < width / 2 ? x * 2 : width * 2 - x * 2;
          $g.point.rgba = $g.colormap.get(q);
        } else {
          $g.point.rgba = $g.colormap.get(q);
        }
        for (var y = 0; y < height; y++) {
          $g.point.set(x, y);
        }
      }
    } else {
      for (var y = 0; y < height; y++) {
        if (params.mirror) {
          var q = y < height / 2 ? y * 2 : height * 2 - y * 2;
          $g.point.rgba = $g.colormap.get(q);
        } else {
          $g.point.rgba = $g.colormap.get(q);
        }
        for (var x = 0; x < width; x++) {
          $g.point.set(x, y);
        }
      }
    }
    return params;
  });
  tgen.effect("checkerboard", {size:[8, 8], rgba:"randomalpha"}, function($g, params) {
    var width = $g.texture.width;
    var height = $g.texture.height;
    if (typeof params.size == "object") {
      var sizeX = params.size[0] = $g.randByArray(params.size[0]);
      var sizeY = params.size[1] = $g.randByArray(params.size[1]);
    } else {
      var sizeX = params.size;
      var sizeY = params.size;
    }
    var cellX = width / sizeX;
    var cellY = height / sizeY;
    var drawCell = function(offsetX, offsetY) {
      for (var x = 0; x < cellX; x++) {
        for (var y = 0; y < cellY; y++) {
          if (x + offsetX < width && y + offsetY < height) {
            $g.point.set(x + offsetX, y + offsetY);
          }
        }
      }
    };
    for (var cx = 0; cx < sizeX; cx++) {
      if (cx % 2 == 0) {
        for (var cy = 0; cy < sizeY; cy++) {
          if (cy % 2 == 0) {
            drawCell(cx * cellX, cy * cellY);
          } else {
            drawCell(cx * cellX + cellX, cy * cellY);
          }
        }
      }
    }
    return params;
  });
  tgen.effect("dots", {blend:"opacity", gridX:[1, 64], gridY:[1, 64], size:[1, 250], seed:[1, 262140], rgba:"randomalpha", shape:"sphere", dynamic:true, xsines:[1, 16], ysines:[1, 16]}, function($g, params) {
    params.gridX = $g.randByArray(params.gridX);
    params.gridY = $g.randByArray(params.gridY);
    params.seed = $g.randByArray(params.seed);
    if (params.xsines === undefined) {
      params.xsines = $g.randInt(1, 10);
    } else {
      if (typeof params.xsines == "object") {
        params.xsines = $g.randInt(params.xsines[0], params.xsines[1]);
      }
    }
    if (params.ysines === undefined) {
      params.ysines = $g.randInt(1, 10);
    } else {
      if (typeof params.ysines == "object") {
        params.ysines = $g.randInt(params.ysines[0], params.ysines[1]);
      }
    }
    $g.calc.randomseed(params.seed);
    var percent = $g.randByArraySeed(params.size) / 100;
    var width = $g.texture.width;
    var height = $g.texture.height;
    var stepX = width / params.gridX;
    var stepY = height / params.gridY;
    var halfstepX = stepX / 2;
    var halfstepY = stepY / 2;
    for (var gx = 1; gx <= params.gridX; gx++) {
      for (var gy = 1; gy <= params.gridY; gy++) {
        var m = percent * (stepX + stepY) / 2 / 2;
        var size = m - m / 2 * Math.sin(gx / params.gridX * params.xsines * 2 * $g.calc.pi) + m / 2 * Math.sin(gy / params.gridY * params.ysines * 2 * $g.calc.pi);
        switch(params.shape) {
          case "sphere":
            $g.shape.sphere($g, gx * stepX - halfstepX, gy * stepY - halfstepY, size * 2, true, params.rgba, params.dynamic);
            break;
          case "pyramid":
            $g.shape.pyramid($g, gx * stepX - halfstepX, gy * stepY - halfstepY, size, size, true, params.rgba, params.dynamic);
            break;
          case "rect":
            $g.shape.rect($g, gx * stepX - halfstepX, gy * stepY - halfstepY, size, size, true, params.rgba, params.dynamic);
            break;
          default:
            size = size / 2;
            $g.shape.circle($g, gx * stepX - halfstepX, gy * stepY - halfstepY, size, true);
            break;
        }
      }
    }
    return params;
  });
  tgen.effect("mandelbrot", {blend:"opacity", rgba:"randomalpha", seed:[1, 262140], iteration:[8, 512], skip:[0, 8]}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    $g.calc.randomseed(params.seed);
    params.skip = $g.randByArray(params.skip);
    params.iteration = $g.randByArray(params.iteration);
    var width = $g.texture.width;
    var height = $g.texture.height;
    var xMin = -2.0;
    var xMax = 1.0;
    var yMin = -1.5;
    var yMax = 1.5;
    var mr0 = params.rgba[0];
    var mg0 = params.rgba[1];
    var mb0 = params.rgba[2];
    var mr1 = 256 / mr0;
    var mg1 = 256 / mg0;
    var mb1 = 256 / mb0;
    var maxIt = params.iteration;
    var x = 0.0;
    var y = 0.0;
    var zx = 0.0;
    var zx0 = 0.0;
    var zy = 0.0;
    var zx2 = 0.0;
    var zy2 = 0.0;
    for (var ky = 0; ky < height; ky++) {
      y = yMin + (yMax - yMin) * ky / height;
      for (var kx = 0; kx < width; kx++) {
        x = xMin + (xMax - xMin) * kx / width;
        zx = x;
        zy = y;
        for (var i = 0; i < maxIt; i++) {
          zx2 = zx * zx;
          zy2 = zy * zy;
          if (zx2 + zy2 > 4.0) {
            break;
          }
          zx0 = zx2 - zy2 + x;
          zy = 2.0 * zx * zy + y;
          zx = zx0;
        }
        if (i > params.skip) {
          $g.point.rgba = [i % mr0 * mr1, i % mg0 * mg1, i % mb0 * mb1, $g.point.rgba[3]];
          $g.point.set(kx, ky);
        }
      }
    }
    return params;
  });
})("tgen");
(function(fn) {
  var tgen = window[fn];
  tgen.effect("opacity", {adjust:128}, function($g, params) {
    $g.walk(function(color) {
      color[3] = params.adjust;
      return color;
    });
    return params;
  });
  tgen.effect("vibrance", {adjust:50}, function($g, params) {
    var adjust = params.adjust * -1;
    $g.walk(function(color) {
      var avg = (color[0] + color[1] + color[2]) / 3;
      var max = Math.max(color[0], color[1], color[2]);
      var amt = Math.abs(max - avg) * 2 / 255 * adjust / 100;
      if (color[0] !== max) {
        color[0] += (max - color[0]) * amt;
      }
      if (color[1] !== max) {
        color[1] += (max - color[1]) * amt;
      }
      if (color[2] !== max) {
        color[2] += (max - color[2]) * amt;
      }
      return [color[0], color[1], color[2], color[3]];
    });
    return params;
  });
  tgen.effect("brightness", {adjust:50, legacy:true}, function($g, params) {
    if (params.legacy === true) {
      $g.walk(function(color) {
        return [Math.min(color[0] + params.adjust, 255), Math.min(color[1] + params.adjust, 255), Math.min(color[2] + params.adjust, 255), color[3]];
      });
    } else {
      $g.walk(function(color) {
        return [color[0] = Math.min(255 / color[0] * (params.adjust / 255), 255), color[1] = Math.min(255 / color[1] * (params.adjust / 255), 255), color[2] = Math.min(255 / color[2] * (params.adjust / 255), 255), color[3]];
      });
    }
    return params;
  });
  tgen.effect("contrast", {adjust:50}, function($g, params) {
    var adjust = (100 + params.adjust) / 100;
    $g.walk(function(color) {
      color[0] = ((color[0] / 255 - 0.5) * adjust + 0.5) * 255;
      color[1] = ((color[1] / 255 - 0.5) * adjust + 0.5) * 255;
      color[2] = ((color[2] / 255 - 0.5) * adjust + 0.5) * 255;
      return [Math.max(Math.min(color[0], 255), 0), Math.max(Math.min(color[1], 255), 0), Math.max(Math.min(color[2], 255), 0), color[3]];
    });
    return params;
  });
  tgen.effect("threshold", {adjust:128}, function($g, params) {
    $g.walk(function(color) {
      var t = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2] <= params.adjust ? 0 : 255;
      return [t, t, t, 1];
    });
    return params;
  });
  tgen.effect("gamma", {adjust:0.5}, function($g, params) {
    $g.walk(function(color) {
      color[0] = Math.pow(color[0] / 255, 1 / params.adjust) * 255;
      color[1] = Math.pow(color[1] / 255, 1 / params.adjust) * 255;
      color[2] = Math.pow(color[2] / 255, 1 / params.adjust) * 255;
      return [color[0], color[1], color[2], color[3]];
    });
    return params;
  });
  tgen.effect("grayscale", {method:["ligthness", "average", "luminosity"]}, function($g, params) {
    if (typeof params == "string") {
      params = {method:params};
    }
    if (typeof params.method == "object") {
      params.method = $g.randItem(params.method);
    }
    switch(params.method) {
      case "ligthness":
        $g.walk(function(color) {
          var minmax = Math.max(color[0], color[1], color[2]) + Math.min(color[0], color[1], color[2]);
          return [minmax, minmax, minmax, color[3]];
        });
        break;
      case "average":
        $g.walk(function(color) {
          var avg = (color[0] + color[1] + color[2]) / 3;
          return [avg, avg, avg, color[3]];
        });
        break;
      case "luminosity":
        $g.walk(function(color) {
          var lum = $g.calc.luminance(color);
          return [lum, lum, lum, color[3]];
        });
        break;
    }
    return params;
  });
  tgen.effect("colorize", {level:50, rgba:"random", colormap:null}, function($g, params) {
    $g.colormap.init(params.colormap, 255, function(cmap) {
      params.colormap = cmap;
    });
    $g.walk(function(color) {
      if ($g.colormap.data) {
        var avg = (color[0] + color[1] + color[2]) / 3;
        var c = $g.colormap.get(avg, params.rgba);
        c[3] = color[3];
        return c;
      } else {
        return $g.point.colorize(color, params.rgba, params.level);
      }
    });
    return params;
  });
  tgen.effect("invert", {channels:[1, 1, 1]}, function($g, params) {
    $g.walk(function(color) {
      return [params.channels[0] ? 255 - color[0] : color[0], params.channels[1] ? 255 - color[1] : color[1], params.channels[2] ? 255 - color[2] : color[2], color[3]];
    });
    return params;
  });
  tgen.effect("sobel", {type:1}, function($g, params) {
    if (params.type == 1) {
      var weights = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    } else {
      var weights = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    }
    $g.do("convolute", {store:false, transparent:false, weights:weights});
    return params;
  });
  tgen.effect("emboss", {type:1}, function($g, params) {
    if (params.type == 1) {
      var weights = [1, 1, 1, 1, 0.7, -1, -1, -1, -1];
    } else {
      var weights = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
    }
    $g.do("convolute", {store:false, transparent:false, weights:weights});
    return params;
  });
  tgen.effect("edgedetect", {type:1}, function($g, params) {
    if (params.type == 1) {
      var weights = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
    } else {
      var weights = [0, 1, 0, 1, -4, 1, 0, 1, 0];
    }
    $g.do("convolute", {store:false, transparent:false, weights:weights});
    return params;
  });
  tgen.effect("sharpen", {type:1}, function($g, params) {
    if (params.type == 1) {
      var weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    } else {
      var weights = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
    }
    $g.do("convolute", {store:false, transparent:false, weights:weights});
    return params;
  });
  tgen.effect("blur", {}, function($g, params) {
    var divisor = 9;
    $g.do("convolute", {store:false, transparent:false, weights:[1 / divisor, 1 / divisor, 1 / divisor, 1 / divisor, 1 / divisor, 1 / divisor, 1 / divisor, 1 / divisor, 1 / divisor]});
    return params;
  });
  tgen.effect("sinecolor", {sines:[1, 7], channel:[0, 2]}, function($g, params) {
    params.sines = $g.randByArray(params.sines);
    params.channel = $g.randByArray(params.channel);
    $g.walk(function(color) {
      var n = parseInt(Math.sin(color[params.channel] * ($g.calc.pi / 180.0) * (255 / 360) * params.sines) * 255);
      color[params.channel] = Math.abs(n);
      return color;
    });
    return params;
  });
  tgen.effect("convolute", {blend:"opacity", transparent:false, weights:[1, 1, 1, 1, 1, 1, 1, 1, 1]}, function($g, params) {
    if (typeof params.weights != "object" || params.weights == null) {
      return params;
    }
    var buffer = new $g.buffer;
    buffer.clear();
    var side = Math.round(Math.sqrt(params.weights.length));
    var halfSide = Math.floor(side / 2);
    var alphaFac = params.transparent ? 1 : 0;
    for (var y = 0; y < $g.texture.height; y++) {
      for (var x = 0; x < $g.texture.width; x++) {
        var r = 0, g = 0, b = 0, a = 0;
        for (var cy = 0; cy < side; cy++) {
          for (var cx = 0; cx < side; cx++) {
            var wt = params.weights[cy * side + cx];
            var scy = y + cy - halfSide;
            var scx = x + cx - halfSide;
            var color = $g.texture.get(scx, scy);
            r += color[0] * wt;
            g += color[1] * wt;
            b += color[2] * wt;
            a += color[3];
          }
        }
        buffer.set(x, y, [r, g, b, a + alphaFac * (255 - a)]);
      }
    }
    var size = $g.texture.size();
    while (size--) {
      $g.texture.data[size] = buffer.data[size];
    }
    return params;
  });
})("tgen");
(function(fn) {
  var tgen = window[fn];
  tgen.shape("rect", function($g, x, y, sizeX, sizeY, centered) {
    if (centered !== undefined) {
      x = x - parseInt(sizeX / 2, 10);
      y = y - parseInt(sizeY / 2, 10);
    }
    for (var ix = 0; ix < sizeX; ix++) {
      for (var iy = 0; iy < sizeY; iy++) {
        $g.point.set(x + ix, y + iy);
      }
    }
  });
  tgen.shape("circle", function($g, x1, y1, radius, centered) {
    if (centered == undefined) {
      x1 = x1 + radius;
      y1 = y1 + radius;
    }
    for (var x = -radius; x < radius; x++) {
      var h = Math.round(Math.sqrt(radius * radius - x * x));
      for (var y = -h; y < h; y++) {
        $g.point.set(x1 + x, y1 + y);
      }
    }
  });
  tgen.shape("line", function($g, x1, y1, x2, y2) {
    var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var dx = (x2 - x1) / d;
    var dy = (y2 - y1) / d;
    var x = 0;
    var y = 0;
    for (var i = 0; i < d; i++) {
      x = x1 + dx * i;
      y = y1 + dy * i;
      $g.point.set(x, y);
    }
  });
  tgen.shape("colorLine", function($g, x1, y1, x2, y2, colorMap) {
    var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var dx = (x2 - x1) / d;
    var dy = (y2 - y1) / d;
    var x = 0;
    var y = 0;
    var colorMapSize = colorMap.length;
    var weight = 7;
    for (var i = 0; i < d; i++) {
      x = x1 + dx * i;
      y = y1 + dy * i;
      var percent = i / d;
      var index = parseInt(colorMapSize * percent);
      $g.point.rgba = colorMap[index];
      for (var w = 1; w <= weight; w++) {
        $g.point.set(x - w, y + w);
      }
    }
  });
  tgen.shape("sphere", function($g, x1, y1, radius, centered, rgba, dynamicopacity) {
    if (centered == undefined) {
      x1 = x1 + radius;
      y1 = y1 + radius;
    }
    for (var x = -radius; x < radius; x++) {
      var h = parseInt(Math.sqrt(radius * radius - x * x), 10);
      for (var y = -h; y < h; y++) {
        var c = Math.min(255, Math.max(0, 255 - 255 * Math.sqrt(y * y + x * x) / (radius / 2))) / 255;
        if (c > 0) {
          if (dynamicopacity) {
            var o = c * 255;
          } else {
            var o = rgba[3];
          }
          $g.point.rgba = [rgba[0] * c, rgba[1] * c, rgba[2] * c, o];
          $g.point.set(x1 + x, y1 + y);
        }
      }
    }
  });
  tgen.shape("pyramid", function($g, x, y, sizeX, sizeY, centered, rgba, dynamicopacity) {
    var halfX = parseInt(sizeX / 2, 10);
    var halfY = parseInt(sizeY / 2, 10);
    if (centered != true) {
      x = x + halfX;
      y = y + halfY;
    }
    for (var ix = -halfX; ix < halfX; ix++) {
      for (var iy = -halfY; iy < halfY; iy++) {
        var cx = (0.25 - Math.abs(ix / sizeX)) * 255;
        var cy = (0.25 - Math.abs(iy / sizeY)) * 255;
        var c = cx + cy;
        if (c > 1) {
          if (dynamicopacity) {
            var o = c;
          } else {
            var o = rgba[3];
          }
          $g.point.rgba = [rgba[0] / 255 * c, rgba[1] / 255 * c, rgba[2] / 255 * c, o];
          $g.point.set(x + ix, y + iy);
        }
      }
    }
  });
})("tgen");


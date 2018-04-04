/*
 tgen.js - the seamless texture generator
 https://github.com/schalkt/tgen/
 http://texture-generator.com/

 Copyright (c) 2015 Tamas Schalk
 MIT license

 @version 0.3.0
*/
(function(fn) {
  window[fn] = {version:"0.3.0", defaults:{}, effects:{}, blends:{}, shapes:{}, events:{beforeRender:{}, beforeEffect:{}, afterEffect:{}, afterRender:{}}, config:{historyLast:15, historyName:"history", historyList:[]}, effect:function(name, defaults, func) {
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
  }, init:function(width, height) {
    var self = this;
    var rendered = [];
    var time = {};
    var layer = 0;
    var wha = null;
    var generator = {shape:self.shapes, effects:Object.keys(self.effects), canvases:[]};
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
      generator.canvases = [];
      rendered = [];
      layer = 0;
      time.start = (new Date).getTime();
      return generator;
    };
    generator.buffer = function(size, w, h) {
      this.data = null;
      this.size = size ? size : 4;
      this.width = w ? w : width;
      this.height = h ? h : height;
      this.wha = (this.width + this.height) / 2;
      this.pixels = function() {
        return this.width * this.height * this.size;
      };
      this.clear = function() {
        this.data = new Float32Array(this.width * this.height * this.size);
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
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        if (x < 0 || x >= this.width) {
          x = this.pattern(x, this.width);
        }
        if (y < 0 || y >= this.height) {
          y = this.pattern(y, this.height);
        }
        return y * this.width * this.size + x * this.size;
      };
      this.set = function(x, y, values) {
        var offset = this.offset(x, y);
        for (var i = 0;i < this.size;i++) {
          this.data[offset + i] = values[i];
        }
      };
      this.get = function(x, y) {
        var offset = this.offset(x, y);
        var output = [];
        for (var i = 0;i < this.size;i++) {
          output[i] = this.data[offset + i];
        }
        return output;
      };
      this.canvas = function(canvas) {
        var pixels = this.pixels();
        var context = canvas.getContext("2d");
        var image = context.getImageData(0, 0, this.width, this.height);
        var imageData = image.data;
        while (pixels--) {
          generator.texture.data[pixels] = imageData[pixels];
        }
      };
      if (this.data === null) {
        this.clear();
      }
    };
    generator.texture = new generator.buffer;
    generator.clear();
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
    generator.randInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    generator.randReal = function(min, max) {
      return Math.random() * (max - min) + min;
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
    var randColor = function(opacity) {
      if (opacity === undefined) {
        opacity = 1;
      }
      if (opacity === true) {
        opacity = .5 + Math.random() / 2;
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
    generator.rgba = function(rgba) {
      if (rgba === "random") {
        rgba = randColor(true);
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
        rgba[3] = generator.randReal(rgba[3][0], rgba[3][1]);
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
        generator.point.rgba = [params.rgb[0], params.rgb[1], params.rgb[2], 1];
      }
      return params;
    };
    var store = function(type, params) {
      rendered.push([layer, type, params]);
    };
    generator.calc = {pi:3.1415927, luminance:function(color) {
      return .21 * color[0] + .72 * color[1] + .07 * color[2];
    }, randomseed:function(seed) {
      if (this.seed == undefined) {
        this.seed = generator.randInt(1, 65535);
      }
      if (seed !== undefined) {
        this.seed = seed;
      }
      var x = Math.sin(this.seed++) * 1E4;
      return x - Math.floor(x);
    }, normalize1:function(value) {
      return generator.calc.normalize(value, 0, 1);
    }, normalize255:function(value) {
      return generator.calc.normalize(value, 0, 255);
    }, normalize:function(value, min, max) {
      if (value > max) {
        return max;
      }
      if (value < min) {
        return min;
      }
      return value;
    }, interpolate:{linear:function(a, b, x) {
      return a * (1 - x) + b * x;
    }, cosine:function(a, b, x) {
      var ft = x * generator.calc.pi;
      var f = (1 - Math.cos(ft)) * .5;
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
    generator.wrapx = function(x) {
      return x & width - 1;
    };
    generator.wrapy = function(y) {
      return y & height - 1;
    };
    generator.point = {rgba:[0, 0, 0, 1], mixed:[0, 0, 0, 1], blend:"opacity", normalize:function(rgba) {
      rgba[0] = Math.round(rgba[0]);
      rgba[1] = Math.round(rgba[1]);
      rgba[2] = Math.round(rgba[2]);
      return rgba;
    }, colorize:function(rgba1, rgba2, level) {
      if (level === undefined) {
        level = 50;
      }
      return [rgba1[0] - (rgba1[0] - rgba2[0]) * (level / 100), rgba1[1] - (rgba1[1] - rgba2[1]) * (level / 100), rgba1[2] - (rgba1[2] - rgba2[2]) * (level / 100), rgba2[3] ? rgba2[3] : .5];
    }, opacity:function(input, current) {
      if (input[3] > 1) {
        input[3] = input[3] / 255;
      }
      if (input[3] == 1) {
        return [input[0], input[1], input[2], input[3]];
      }
      return [input[0] * input[3] + current[0] * (1 - input[3]), input[1] * input[3] + current[1] * (1 - input[3]), input[2] * input[3] + current[2] * (1 - input[3]), input[3]];
    }, calc:function(input, current) {
      if (self.blends[this.blend] !== undefined) {
        input = self.blends[this.blend](generator, current, input);
        return this.opacity(input, current);
      } else {
        return input;
      }
    }, set:function(x, y) {
      this.mixed = this.calc(this.rgba, this.get(x, y));
      generator.texture.set(x, y, this.mixed);
    }, get:function(x, y) {
      return generator.texture.get(x, y);
    }};
    generator.walk = function(func) {
      for (var x = 0;x < width;x++) {
        for (var y = 0;y < height;y++) {
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
          var x = generator.randInt(0, width);
          var y = generator.randInt(0, height);
          var size = generator.randByArray(params.size);
        } else {
          var x = params.origin[0];
          var y = params.origin[1];
          var size = generator.randByArray(params.size);
        }
      }
      return {x:x, y:y, size:size};
    };
    generator.toContext = function(context) {
      var image = context.createImageData(width, height);
      var data = image.data;
      var pixels = generator.texture.pixels();
      for (var i = 0;i < pixels;i += 4) {
        data[i] = generator.texture.data[i];
        data[i + 1] = generator.texture.data[i + 1];
        data[i + 2] = generator.texture.data[i + 2];
        data[i + 3] = 255;
      }
      return image;
    };
    generator.toCanvas = function() {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      var imageData = this.toContext(context);
      context.putImageData(imageData, 0, 0);
      return canvas;
    };
    generator.getCanvas = function(func) {
      if (func) {
        func(generator.canvases[generator.canvases.length - 1]);
      }
      return this;
    };
    generator.getPhases = function(func) {
      if (func) {
        var phases = [];
        var length = generator.canvases.length;
        for (var i = 0;i < length;i++) {
          phases.push(generator.canvases[i]);
        }
        func(phases);
      }
      return this;
    };
    generator.stat = function(func) {
      time.stop = (new Date).getTime();
      time.elapsed = (time.stop - time.start) / 1E3;
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
        var itemcount = rendered.length;
        var layers = generator.canvases.length;
        name = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " l" + layers + " i" + itemcount;
      }
      return {"name":name, "version":self.version, "width":width, "height":height, "items":rendered};
    };
    generator.render = function(config, noclear) {
      var current = 0;
      if (config.width != undefined) {
        width = config.width;
      }
      if (config.height != undefined) {
        height = config.height;
      }
      checkSize();
      generator.texture = new generator.buffer;
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
          if (generator.canvases[layer] != undefined) {
            generator.texture.canvas(generator.canvases[layer]);
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
        generator.canvases[layer] = generator.toCanvas();
      }
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
  tgen.effect("fill", {blend:"", rgba:[128, 128, 228, .5]}, function($g, params) {
    $g.shape.rect($g, 1, 1, $g.texture.width, $g.texture.height);
    return params;
  });
  tgen.effect("copy", {"layer":null}, function($g, params) {
    if (typeof params == "number") {
      params = {"layer":params};
    }
    if (params.layer === null) {
      params.layer = $g.canvases.length - 1;
    }
    if ($g.canvases[params.layer] == undefined) {
      return params;
    }
    var pixels = $g.texture.pixels();
    var context = $g.canvases[params.layer].getContext("2d");
    var image = context.getImageData(0, 0, $g.texture.width, $g.texture.height);
    var imageData = image.data;
    while (pixels--) {
      $g.texture.data[pixels] = imageData[pixels];
    }
    return params;
  });
  tgen.effect("merge", {blend:"opacity", opacity:.5, layer:0}, function($g, params) {
    if ($g.canvases[params.layer] === undefined) {
      return this;
    }
    var context = $g.canvases[params.layer].getContext("2d");
    var image = context.getImageData(0, 0, $g.texture.width, $g.texture.height);
    var imageData = image.data;
    for (var y = 0;y < $g.texture.height;y++) {
      for (var x = 0;x < $g.texture.width;x++) {
        var offset = $g.texture.offset(x, y);
        $g.point.rgba = [imageData[offset], imageData[offset + 1], imageData[offset + 2], imageData[offset + 3]];
        $g.point.rgba[3] = $g.point.rgba[3] > 1 ? $g.point.rgba[3] / 255 : $g.point.rgba[3];
        $g.point.set(x, y);
      }
    }
    return params;
  });
  tgen.effect("noise", {blend:"softlight", mode:"monochrome", opacity:.5}, function($g, params) {
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
  tgen.effect("spheres", {blend:"lighten", rgba:"random", origin:"random", dynamic:false, count:21, size:[20, 70]}, function($g, params) {
    var elements = [];
    for (var i = 0;i < params.count;i++) {
      var xys = $g.xysize(i, params);
      $g.shape.sphere($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true, params.rgba, params.dynamic);
      elements.push(xys);
    }
    params.elements = elements;
    return params;
  });
  tgen.effect("pyramids", {blend:"lighten", rgba:"random", origin:"random", dynamic:false, count:21, size:[21, 100]}, function($g, params) {
    var elements = [];
    for (var i = 0;i < params.count;i++) {
      var xys = $g.xysize(i, params);
      $g.shape.pyramid($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), true, params.rgba, params.dynamic);
      elements.push(xys);
    }
    params.elements = elements;
    return params;
  });
  tgen.effect("squares", {blend:"lighten", rgba:"random", origin:"random", count:[4, 7], size:[2, 50]}, function($g, params) {
    var elements = [];
    for (var i = 0;i < params.count;i++) {
      var xys = $g.xysize(i, params);
      $g.shape.rect($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), false);
      elements.push(xys);
    }
    params.elements = elements;
    return params;
  });
  tgen.effect("circles", {blend:"lighten", rgba:"random", origin:"random", count:21, size:[1, 15]}, function($g, params) {
    var elements = [];
    for (var i = 0;i < params.count;i++) {
      var xys = $g.xysize(i, params);
      $g.shape.circle($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true);
      elements.push(xys);
    }
    params.elements = elements;
    return params;
  });
  tgen.effect("lines", {blend:"opacity", rgba:"random", size:[100, 200], count:[100, 400], freq1s:[21, 150], freq1c:[21, 150], freq2s:[21, 150], freq2c:[21, 150]}, function($g, params) {
    params.freq1s = $g.randByArray(params.freq1s, true);
    params.freq1c = $g.randByArray(params.freq1c, true);
    params.freq2s = $g.randByArray(params.freq2s, true);
    params.freq2c = $g.randByArray(params.freq2c, true);
    params.size = $g.randByArray(params.size);
    for (var i = 0;i < params.count;i++) {
      var x1 = $g.texture.width / 2 + Math.sin(i / params.freq1s * $g.calc.pi) * params.size;
      var y1 = $g.texture.height / 2 + Math.cos(i / params.freq1c * $g.calc.pi) * params.size;
      var x2 = $g.texture.width / 2 + Math.sin(i / params.freq2s * $g.calc.pi) * params.size;
      var y2 = $g.texture.height / 2 + Math.cos(i / params.freq2c * $g.calc.pi) * params.size;
      $g.shape.line($g, x1, y1, x2, y2);
    }
    return params;
  });
  tgen.effect("lines2", {blend:["opacity", "lighten", "screen"], rgba:"random", type:"vertical", size:[.1, 11], count:[4, 21]}, function($g, params) {
    var elements = [];
    var item = null;
    for (var i = 0;i < params.count;i++) {
      if (params.elements != undefined) {
        item = params.elements[i];
      } else {
        item = {size:$g.randByArray(params.size, true), d:$g.randReal(.1, 100)};
      }
      if (params.type == "vertical") {
        $g.shape.rect($g, $g.percentX(item.d), 0, $g.percentX(item.size), $g.texture.height);
      } else {
        $g.shape.rect($g, 0, $g.percentX(item.d), $g.texture.width, $g.percentX(item.size));
      }
      elements.push(item);
    }
    params.elements = elements;
    return params;
  });
  tgen.effect("subplasma", {seed:[1, 65535], size:[3, 4], rgba:"random"}, function($g, params) {
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
    for (y = 0;y < np;y++) {
      for (x = 0;x < np;x++) {
        buffer[x * ssize + y * ssize * rx] = $g.calc.randomseed();
      }
    }
    for (y = 0;y < np;y++) {
      for (x = 0;x < rx;x++) {
        var p = x & ~(ssize - 1);
        var zy = y * ssize * rx;
        buffer[x + zy] = $g.calc.interpolate.catmullrom(buffer[(p - ssize * 1 & rx - 1) + zy], buffer[(p - ssize * 0 & rx - 1) + zy], buffer[(p + ssize * 1 & rx - 1) + zy], buffer[(p + ssize * 2 & rx - 1) + zy], x % ssize, ssize);
      }
    }
    for (y = 0;y < ry;y++) {
      for (x = 0;x < rx;x++) {
        var p = y & ~(ssize - 1);
        buffer[x + y * rx] = $g.calc.interpolate.catmullrom(buffer[x + (p - ssize * 1 & ry - 1) * rx], buffer[x + (p - ssize * 0 & ry - 1) * rx], buffer[x + (p + ssize * 1 & ry - 1) * rx], buffer[x + (p + ssize * 2 & ry - 1) * rx], y % ssize, ssize);
      }
    }
    for (x = 0;x < $g.texture.width;x++) {
      for (y = 0;y < $g.texture.height;y++) {
        var color = 256 * buffer[x + y * rx];
        $g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 1]);
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
      var o = params.opacity !== undefined ? params.opacity : 1;
      params.rgba = $g.rgba([[0, 255], [0, 255], [0, 255], o]);
    }
    for (var x = 0;x < $g.texture.width;x++) {
      for (var y = 0;y < $g.texture.height;y++) {
        var c = 127 + 63.5 * Math.sin(x / $g.texture.width * params.xsines * 2 * $g.calc.pi) + 63.5 * Math.sin(y / $g.texture.height * params.ysines * 2 * $g.calc.pi);
        if (typeof params.channels == "object") {
          $g.point.rgba = [params.channels[0] ? c : 0, params.channels[1] ? c : 0, params.channels[2] ? c : 0, params.channels[3] ? c : 0];
        } else {
          $g.point.rgba = $g.point.colorize([c, c, c, 1], params.rgba, params.level);
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
      params.rgba = [$g.randInt(0, 255), $g.randInt(0, 255), $g.randInt(0, 255), 1];
    }
    for (var x = 0;x < $g.texture.width;x++) {
      for (var y = 0;y < $g.texture.height;y++) {
        var c = 127 + 63.5 * Math.sin(x * x / params.xadjust) + 63.5 * Math.cos(y * y / params.yadjust);
        $g.point.rgba = $g.point.colorize([c, c, c, 1], params.rgba, params.level);
        $g.point.set(x, y);
      }
    }
    return params;
  });
  tgen.effect("map", {xamount:[5, 255], yamount:[5, 255], xchannel:[0, 3], ychannel:[0, 3], xlayer:0, ylayer:0}, function($g, params) {
    params.xamount = $g.randByArray(params.xamount);
    params.yamount = $g.randByArray(params.yamount);
    params.xchannel = $g.randByArray(params.xchannel);
    params.ychannel = $g.randByArray(params.ychannel);
    params.xlayer = $g.randByArray(params.xlayer);
    params.ylayer = $g.randByArray(params.ylayer);
    var buffer = new $g.buffer;
    var width = $g.texture.width;
    var height = $g.texture.height;
    var xcontext = $g.canvases[params.xlayer].getContext("2d");
    var ximage = xcontext.getImageData(0, 0, width, height);
    var ximageData = ximage.data;
    var ycontext = $g.canvases[params.ylayer].getContext("2d");
    var yimage = ycontext.getImageData(0, 0, width, height);
    var yimageData = yimage.data;
    for (var x = 0;x < width;x++) {
      for (var y = 0;y < height;y++) {
        var offset = $g.texture.offset(x, y);
        var sx = ximageData[offset + params.xchannel];
        var sy = yimageData[offset + params.ychannel];
        if (width % 16 == 0) {
          var ox = $g.wrapx(x + (sx * params.xamount * width >> 16))
        } else {
          var ox = x + sx * params.xamount * width / (width * width)
        }
        if (height % 16 == 0) {
          var oy = $g.wrapy(y + (sy * params.yamount * height >> 16))
        } else {
          var oy = y + sy * params.yamount * height / (height * height)
        }
        var rgba = $g.point.get(ox, oy);
        buffer.data[offset] = rgba[0];
        buffer.data[offset + 1] = rgba[1];
        buffer.data[offset + 2] = rgba[2];
        buffer.data[offset + 3] = rgba[3];
      }
    }
    var pixels = $g.texture.pixels();
    while (pixels--) {
      $g.texture.data[pixels] = buffer.data[pixels];
    }
    return params;
  });
  tgen.effect("clouds", {blend:"opacity", rgba:"random", seed:[1, 65535], roughness:[2, 16]}, function($g, params) {
    params.seed = $g.randByArray(params.seed);
    params.roughness = $g.randByArray(params.roughness);
    var width = $g.texture.width;
    var height = $g.texture.height;
    var map = [];
    var generateMap = function() {
      for (var x = 0;x <= width;x++) {
        map[x] = [];
        for (var y = 0;y <= height;y++) {
          map[x][y] = 0;
        }
      }
    };
    var mapV = function(x, y, value) {
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
      return ($g.calc.randomseed() - .5) * (num / (width + width) * params.roughness);
    };
    var generateCloud = function(step) {
      var stepHalf = step / 2;
      if (stepHalf <= 1) {
        return params;
      }
      for (var i = stepHalf - stepHalf;i <= width + stepHalf;i += stepHalf) {
        for (var j = stepHalf - stepHalf;j <= height + stepHalf;j += stepHalf) {
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
    for (var x = 0;x < width;x++) {
      for (var y = 0;y < height;y++) {
        var color = 256 * map[x][y];
        $g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 1]);
        $g.point.set(x, y);
      }
    }
    return params;
  });
})("tgen");
(function(fn) {
  var tgen = window[fn];
  tgen.effect("opacity", {adjust:.5}, function($g, params) {
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
    $g.walk(function(color) {
      if (params.legacy === true) {
        return [Math.min(color[0] + params.adjust, 255), Math.min(color[1] + params.adjust, 255), Math.min(color[2] + params.adjust, 255), color[3]];
      } else {
        params.adjust = Math.pow((params.adjust + 100) / 100, 2);
        return [((color[0] / 255 - .5) * params.adjust + .5) * 255, ((color[1] / 255 - .5) * params.adjust + .5) * 255, ((color[2] / 255 - .5) * params.adjust + .5) * 255, color[3]];
      }
    });
    return params;
  });
  tgen.effect("contrast", {adjust:50}, function($g, params) {
    var adjust = (100 + params.adjust) / 100;
    $g.walk(function(color) {
      color[0] = ((color[0] / 255 - .5) * adjust + .5) * 255;
      color[1] = ((color[1] / 255 - .5) * adjust + .5) * 255;
      color[2] = ((color[2] / 255 - .5) * adjust + .5) * 255;
      return [Math.max(Math.min(color[0], 255), 0), Math.max(Math.min(color[1], 255), 0), Math.max(Math.min(color[2], 255), 0), color[3]];
    });
    return params;
  });
  tgen.effect("threshold", {adjust:128}, function($g, params) {
    $g.walk(function(color) {
      var t = .2126 * color[0] + .7152 * color[1] + .0722 * color[2] <= params.adjust ? 0 : 255;
      return [t, t, t, 1];
    });
    return params;
  });
  tgen.effect("gamma", {adjust:.5}, function($g, params) {
    $g.walk(function(color) {
      color[0] = Math.pow(color[0] / 255, 1 / params.adjust) * 255;
      color[1] = Math.pow(color[1] / 255, 1 / params.adjust) * 255;
      color[2] = Math.pow(color[2] / 255, 1 / params.adjust) * 255;
      return [color[0], color[1], color[2], color[3]];
    });
    return params;
  });
  tgen.effect("grayscale", {method:["ligthness", "average", "luminosity"]}, function($g, params) {
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
  tgen.effect("colorize", {level:50, rgb:"random"}, function($g, params) {
    $g.walk(function(color) {
      return $g.point.colorize(color, params.rgb, params.level);
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
      var weights = [-1, -2, -1, 0, 0, 0, 1, 2, 1]
    } else {
      var weights = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
    }
    $g.do("convolute", {store:false, transparent:false, weights:weights});
    return params;
  });
  tgen.effect("emboss", {type:1}, function($g, params) {
    if (params.type == 1) {
      var weights = [1, 1, 1, 1, .7, -1, -1, -1, -1]
    } else {
      var weights = [-2, -1, 0, -1, 1, 1, 0, 1, 2]
    }
    $g.do("convolute", {store:false, transparent:false, weights:weights});
    return params;
  });
  tgen.effect("edgedetect", {type:1}, function($g, params) {
    if (params.type == 1) {
      var weights = [-1, -1, -1, -1, 8, -1, -1, -1, -1]
    } else {
      var weights = [0, 1, 0, 1, -4, 1, 0, 1, 0]
    }
    $g.do("convolute", {store:false, transparent:false, weights:weights});
    return params;
  });
  tgen.effect("sharpen", {type:1}, function($g, params) {
    if (params.type == 1) {
      var weights = [0, -1, 0, -1, 5, -1, 0, -1, 0]
    } else {
      var weights = [-1, -1, -1, -1, 9, -1, -1, -1, -1]
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
      var n = parseInt(Math.sin(color[params.channel] * ($g.calc.pi / 180) * (255 / 360) * params.sines) * 255);
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
    for (var y = 0;y < $g.texture.height;y++) {
      for (var x = 0;x < $g.texture.width;x++) {
        var r = 0, g = 0, b = 0, a = 0;
        for (var cy = 0;cy < side;cy++) {
          for (var cx = 0;cx < side;cx++) {
            var wt = params.weights[cy * side + cx];
            var scy = y + cy - halfSide;
            var scx = x + cx - halfSide;
            var color = $g.texture.get(scx, scy);
            r += color[0] * wt;
            g += color[1] * wt;
            b += color[2] * wt;
            a += color[3] * wt;
          }
        }
        buffer.set(x, y, [r, g, b, a + alphaFac * (255 - a)]);
      }
    }
    var pixels = $g.texture.pixels();
    while (pixels--) {
      $g.texture.data[pixels] = buffer.data[pixels];
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
    for (var ix = 0;ix < sizeX;ix++) {
      for (var iy = 0;iy < sizeY;iy++) {
        $g.point.set(x + ix, y + iy);
      }
    }
  });
  tgen.shape("circle", function($g, x1, y1, radius, centered) {
    if (centered == undefined) {
      x1 = x1 + radius;
      y1 = y1 + radius;
    }
    for (var x = -radius;x < radius;x++) {
      var h = parseInt(Math.sqrt(radius * radius - x * x), 10);
      for (var y = -h;y < h;y++) {
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
    for (var i = 0;i < d;i++) {
      x = x1 + dx * i;
      y = y1 + dy * i;
      $g.point.set(x, y);
    }
  });
  tgen.shape("sphere", function($g, x1, y1, radius, centered, rgba, dynamicopacity) {
    if (centered == undefined) {
      x1 = x1 + radius;
      y1 = y1 + radius;
    }
    for (var x = -radius;x < radius;x++) {
      var h = parseInt(Math.sqrt(radius * radius - x * x), 10);
      for (var y = -h;y < h;y++) {
        var c = Math.min(255, Math.max(0, 255 - 255 * Math.sqrt(y * y + x * x) / (radius / 2)));
        if (c > 0) {
          if (dynamicopacity) {
            var o = c / 255
          } else {
            var o = rgba[3]
          }
          $g.point.rgba = [rgba[0] / 255 * c, rgba[1] / 255 * c, rgba[2] / 255 * c, o];
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
    for (var ix = -halfX;ix < halfX;ix++) {
      for (var iy = -halfY;iy < halfY;iy++) {
        var cx = (.25 - Math.abs(ix / sizeX)) * 255;
        var cy = (.25 - Math.abs(iy / sizeY)) * 255;
        var c = cx + cy;
        if (dynamicopacity) {
          var o = c / 255
        } else {
          var o = rgba[3]
        }
        if (c > 0) {
          $g.point.rgba = [rgba[0] / 255 * c, rgba[1] / 255 * c, rgba[2] / 255 * c, o];
          $g.point.set(x + ix, y + iy);
        }
      }
    }
  });
})("tgen");


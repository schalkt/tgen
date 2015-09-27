/**
 * @preserve tgen.js - the seamless texture generator
 * https://github.com/schalkt/tgen/
 * http://seamless-texture.com/
 *
 * Copyright (c) 2015 Tamas Schalk
 * MIT license
 *
 * @version 0.3.0
 */

(function (fn) {

	window[fn] = {

		version: '0.3.0',
		defaults: {},
		effects: {},
		blends: {},
		shapes: {},

		events: {
			beforeRender: {},
			beforeEffect: {},
			afterEffect: {},
			afterRender: {}
		},

		config: {
			historyLast: 15, // save last rendered texture params to localStorage
			historyName: 'history',
			historyList: []
		},

		effect: function (name, defaults, func) {

			this.defaults[name] = defaults;
			this.effects[name] = func;

		},

		event: function (when, name, func) {

			if (this.events[when] == undefined) {
				return;
			}

			this.events[when][name] = func;

		},

		blend: function (name, func) {

			this.blends[name] = func;

		},

		shape: function (name, func) {

			this.shapes[name] = func;

		},

		init: function (width, height) {

			var self = this;
			var rendered = []; // rendered effects real params
			var time = {}; // time object for stat
			var layer = 0; // start layer id
			var wha = null; // width and height average


			// generator object
			var generator = {
				shape: self.shapes,
				effects: Object.keys(self.effects),
				canvases: []
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
			generator.clear = function () {

				generator.texture.clear();
				generator.canvases = [];
				rendered = [];
				layer = 0;

				// start time
				time.start = new Date().getTime();

				return generator;

			};

			generator.buffer = function (size, w, h) {

				this.data = null;
				this.size = size ? size : 4;
				this.width = w ? w : width;
				this.height = h ? h : height;
				this.wha = (this.width + this.height) / 2;

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
							sval = (sval - max);
							return sval;
						}
						return sval;
					}

				};


				this.offset = function (x, y) {

					x = parseInt(x, 10);
					y = parseInt(y, 10);

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
						generator.texture.data[pixels] = imageData[pixels];
					}

				};

				if (this.data === null) {
					this.clear();
				}

			};

			// texture object
			generator.texture = new generator.buffer();
			generator.clear();


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
			generator.randInt = function (min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			// random real min max
			generator.randReal = function (min, max) {
				return Math.random() * (max - min) + min;
			};

			generator.randByArray = function (data, real) {

				if (typeof data == "object") {

					if (real != undefined) {
						data = generator.randReal(data[0], data[1]);
					} else {
						data = generator.randInt(data[0], data[1]);
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

				return [generator.randInt(0, 255), generator.randInt(0, 255), generator.randInt(0, 255), opacity];

			}

			// get random blend mode
			var randBlend = function () {
				return randProperty(self.blends);
			}

			// get random array item
			generator.randItem = function (array) {
				var count = array.length;
				var index = generator.randInt(0, count - 1);
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

			// set rgba color - if the channel is an array then random
			generator.rgba = function (rgba) {

				if (rgba === 'random') {
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

			// effect parameters fill with default values
			var paramsCheck = function (type, params, func) {

				if (func !== undefined) {
					params = func(params);
				}

				if (typeof params.count == 'object') {
					params.count = generator.randInt(params.count[0], params.count[1]);
				}

				if (params.blend === 'random') {
					params.blend = randBlend();
				}

				// random blend by array
				if (typeof params.blend == 'object') {
					var max = params.blend.length;
					params.blend = params.blend[generator.randInt(0, max - 1)];
				}

				// set blend
				if (params.blend !== undefined) {
					generator.point.blend = params.blend;
				} else {
					generator.point.blend = '';
				}

				// set color
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


			// store generated texture params for save
			var store = function (type, params) {

				rendered.push([layer, type, params])

			};


			// calculations
			generator.calc = {

				pi: 3.1415927,

				luminance: function (color) {
					//return (0.299 * color[0]) + (0.587 * color[1]) + (0.114 * color[2]);
					return (0.21 * color[0]) + (0.72 * color[1]) + (0.07 * color[2]);
				},

				randomseed: function (seed) {

					if (this.seed == undefined) {
						this.seed = generator.randInt(1, 65535);
					}

					if (seed !== undefined) {
						this.seed = seed;
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


			generator.wrapx = function (x) {
				return x & (width - 1);
			}

			generator.wrapy = function (y) {
				return y & (height - 1);
			}

			// put a point, the magic is here
			generator.point = {

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

					if (self.blends[this.blend] !== undefined) {
						input = self.blends[this.blend](generator, current, input);
						return this.opacity(input, current);
					} else {
						return input;
					}

				},

				// set the pixel
				set: function (x, y) {

					//this.rgba = this.normalize(this.rgba);
					this.mixed = this.calc(this.rgba, this.get(x, y));

					generator.texture.set(x, y, this.mixed);

				},

				// get the pixel
				get: function (x, y) {

					return generator.texture.get(x, y);

				}

			}

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

			}

			// for percent calculations
			generator.percent = function (c, max) {
				return parseInt((c / 100) * max, 10);
			}

			generator.percentX = function (c) {
				return parseInt((c / 100) * width, 10);
			}

			generator.percentY = function (c) {
				return parseInt((c / 100) * height, 10);
			}

			generator.percentXY = function (c) {
				return parseInt((c / 100) * wha, 10);
			}

			generator.xysize = function (i, params) {


				if (params.elements != undefined) {

					// x and y values from params elements array
					var x = params.elements[i].x;
					var y = params.elements[i].y;
					var size = params.elements[i].size;

				} else if (params.origin == 'random') {

					// random x and y
					var x = generator.randInt(0, width);
					var y = generator.randInt(0, height);
					var size = generator.randByArray(params.size);

				} else {

					// centered x and y, only size random
					var x = params.origin[0];
					var y = params.origin[1];
					var size = generator.randByArray(params.size);

				}

				return {x: x, y: y, size: size};

			}


			// copy texture to image
			generator.toContext = function (context) {

				var image = context.createImageData(width, height);
				var data = image.data;
				var pixels = generator.texture.pixels();

				for (var i = 0; i < pixels; i += 4) {

					data[i] = generator.texture.data[i];
					data[i + 1] = generator.texture.data[i + 1];
					data[i + 2] = generator.texture.data[i + 2];
					data[i + 3] = 255;

					//TODO fix this for opacity
					//data[i + 3] = generator.texture.data[i + 3] * 256;
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
					func(generator.canvases[generator.canvases.length - 1]);
				}

				return this;

			};

			// get phases (layers)
			generator.getPhases = function (func) {

				if (func) {

					var phases = [];
					var length = generator.canvases.length;

					for (var i = 0; i < length; i++) {
						phases.push(generator.canvases[i]);
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

					return JSON.parse(window.localStorage.getItem(self.config.historyName)) || [];

				},

				last: function () {

					if (!this.available()) {
						return [];
					}

					return self.config.historyList[self.config.historyList.length - 1];

				},

				get: function (index) {

					if (!this.available()) {
						return [];
					}

					if (!self.config.historyList[index]) {
						return null;
					}

					return self.config.historyList[index];

				},

				add: function (name) {

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

				}

			}


			generator.params = function (name) {

				if (name == undefined) {

					var d = new Date();
					var itemcount = rendered.length;
					var layers = generator.canvases.length;
					name = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' l' + layers + ' i' + itemcount;

				}

				return {
					"name": name,
					"version": self.version,
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
				generator.texture = new generator.buffer();

				if (noclear != true) {
					generator.clear();
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
					} else if (self.effects[effect] != undefined) {
						generator.do(effect, values);
					} else {
						console.warn('undefined effect: ' + effect);
					}

					generator.canvases[layer] = generator.toCanvas();

				}

				// save to localstorage
				generator.history.add();

				return this;

			};


			// call events
			generator.event = function (eventName, data) {

				for (var key in self.events[eventName]) {
					var event = self.events[eventName][key];
					if (typeof event == "function") {
						event(generator, data);
					}
				}

			};

			generator.do = function (name, params) {

				var originalparams = params;

				if (params === undefined) {
					params = mergeParams({}, self.defaults[name]);
				} else if (typeof params == 'object') {
					params = mergeParams(self.defaults[name], params);
				}

				params = paramsCheck(name, params);

				// call event
				generator.event('beforeEffect', {
					layer: layer,
					name: name,
					params: params
				});

				// run effect
				if (typeof self.effects[name] == 'function') {
					params = self.effects[name](generator, params);
				} else {
					console.warn('effect not callable: ' + name);
				}

				if (params === undefined) {
					params = originalparams;
				}

				// call event
				generator.event('afterEffect', {
					layer: layer,
					name: name,
					params: params
				});

				if (params.store !== false) {
					store(name, params);
				}

				return generator;

			};

			// the generator object
			return generator;
		}
	}


})('tgen');

/**
 * tgen.js - the seamless texture generator
 * https://github.com/schalkt/tgen/
 * http://texture-generator.com/
 *
 * Copyright (c) 2015-2018 Tamas Schalk
 * MIT license
 */

(function (fn) {

	window[fn] = {

		version: '0.6.7',
		defaults: {},
		effects: {},
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

		colormap: function (name, func) {

			this.colormaps[name] = func;

		},

		init: function (width, height, normalize) {

			var self = this;
			var rendered = []; // rendered effects real params
			var time = {}; // time object for stat
			var layer = 0; // start layer id
			var wha = null; // width and height average


			// generator object
			var generator = {
				shape: self.shapes,
				effects: Object.keys(self.effects),
				layers: [],
				normalize: normalize ? normalize : 'limitless' // clamped, pingpong, limitless
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


			// reset the generator
			generator.clear = function () {

				generator.texture.clear();
				generator.layers = [];
				rendered = [];
				layer = 0;

				// start time
				time.start = new Date().getTime();

				return generator;

			};

			generator.buffer = function (background) {

				this.data = null;
				this.components = 4;
				this.width = width;
				this.height = height;
				this.wha = (this.width + this.height) / 2;
				this.background = [0, 0, 0, 255];

				if (typeof background == 'object') {
					this.background = background;
				}

				this.pixels = function () {
					return this.width * this.height;
				};

				this.size = function () {
					return this.data.length;
				}

				this.export = function () {

					var size = this.size();

					switch (generator.normalize) {

						case 'limitless':
							var data = new Float32Array(size);
							while (size--) {
								data[size] = this.data[size];
							}
							break;

						case 'clamped':
							var data = new Uint8ClampedArray(size);
							while (size--) {
								data[size] = this.data[size];
							}
							break;

						case 'pingpong':
							var data = new Uint8ClampedArray(size);
							while (size--) {
								data[size] = generator.calc.pingpong(this.data[size], 0, 255);
							}
							break;


					}

					return data;

				};

				this.clear = function (rgba) {

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
						this.data[offset + 3]
					];

				};

				// copy canvas to texture
				this.canvas = function (canvas) {

					var size = this.size();
					var context = canvas.getContext('2d');
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


			generator.layerCopy = function (layer) {

				var data = [];
				var layer = this.layers[layer];
				var length = layer.length;

				while (length--) {
					data[length] = layer[length];
				}

				return data;

			};


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

			generator.clone = function (destination, source) {
				for (var property in source) {
					if (typeof source[property] === "object" && source[property] !== null && destination[property]) {
						this.clone(destination[property], source[property]);
					} else {
						destination[property] = source[property];
					}
				}
			};


			// random int min max
			generator.randInt = function (min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			// random int min max by seed
			generator.randIntSeed = function (min, max) {
				return Math.floor(generator.calc.randomseed() * (max - min + 1)) + min;
			}

			// random real min max
			generator.randReal = function (min, max) {
				return Math.random() * (max - min) + min;
			};

			// random real min max by seed
			generator.randRealSeed = function (min, max) {
				return generator.calc.randomseed() * (max - min) + min;
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

			generator.randByArraySeed = function (data, real) {

				if (typeof data == "object") {

					if (real != undefined) {
						data = generator.randRealSeed(data[0], data[1]);
					} else {
						data = generator.randIntSeed(data[0], data[1]);
					}

				}

				return data;

			}


			// random color
			var randColor = function (opacity) {

				if (opacity === undefined) {
					opacity = 255;
				}
				if (opacity === true) {
					opacity = 128 + (generator.randInt(0, 128));
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
			generator.rgba = function (rgba, alpha) {

				if (rgba === 'random') {
					return randColor(alpha);
				}

				if (rgba === 'randomalpha') {
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
					generator.point.rgba = [params.rgb[0], params.rgb[1], params.rgb[2], 255];
				}

				return params;

			};


			// store generated texture params for save
			var store = function (type, params) {

				rendered.push([layer, type, params])

			};


			// find closest item in array
			generator.findClosestIndex = function (array, start, step) {

				for (var i = start; i >= 0 && i <= array.length - 1; i += step)
					if (array[i]) {
						return i;
					}

				return array.length - 1;

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
						this.seed = generator.randInt(1, 262140);
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

					if (value > max) {
						var r = value - max;
						return max - r;
					}

					if (value < min) {
						return Math.abs(value);
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


			generator.colormap = {

				data: null,
				size: 255,

				init: function (colormap, size, callback) {

					this.data = null;
					this.size = (size == undefined) ? width : size;

					if (colormap == undefined || colormap == null) {
						return colormap;
					}

					// colormap random by arrays
					if (typeof colormap == 'object') {

						if (typeof colormap[0] == 'object') {

							// by items rgba
							for (key in colormap) {
								var item = colormap[key];
								item.rgba = generator.rgba(item.rgba);
								colormap[key] = item;
							}

						} else {
							// by name
							colormap = generator.randItem(colormap);
						}

					}

					// random
					if (colormap === 'random') {

						var count = generator.randInt(1, 4);
						var colormap = [];
						for (var i = 0; i <= count; i++) {
							colormap[i] = {
								percent: parseInt((i / count) * 100),
								rgba: [generator.randInt(0, 255), generator.randInt(0, 255), generator.randInt(0, 255), 255]
							}
						}

					}

					// callback for store real params
					if (typeof callback == 'function') {
						callback(colormap);
					}

					if (typeof colormap == 'string') {

						var reverse = false;

						if (colormap.charAt(0) == '!') {
							colormap = colormap.substring(1);
							reverse = true;
						}

						if (typeof self.colormaps[colormap] == "function") {
							var items = self.colormaps[colormap](size);
							this.data = this.render(items, reverse);
						}

					}

					if (typeof colormap == 'object') {
						this.data = this.render(colormap);
					}

				},

				render: function (items, reverse) {

					var colormap = [];

					for (var p = 0; p < items.length - 1; p++) {

						var current = items[p];
						var next = items[p + 1];
						var currentIndex = Math.round(this.size * (current.percent / 100));
						var nextIndex = Math.round(this.size * (next.percent / 100));

						for (var i = currentIndex; i <= nextIndex; i++) {

							var idx = reverse ? this.size - i : i;

							colormap[idx] = [
								current.rgba[0] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[0] - current.rgba[0]),
								current.rgba[1] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[1] - current.rgba[1]),
								current.rgba[2] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[2] - current.rgba[2]),
								current.rgba[3] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[3] - current.rgba[3])
							];
						}

					}

					return colormap;

				},

				get: function (index, rgba) {

					if (index == undefined) {
						return this.data;
					}

					index = generator.calc.pingpong(parseInt(index), 0, this.size);

					var color = this.data[index];

					// save original alpha
					if (rgba !== undefined) {
						color[3] = rgba[3];
					}

					return color;

				}

			};

			generator.wrapx = function (x) {
				return x & (width - 1);
			};

			generator.wrapy = function (y) {
				return y & (height - 1);
			};

			// put a point, the magic is here
			generator.point = {

				rgba: [],
				mixed: [],
				blend: 'opacity',

				colorize: function (rgba1, rgba2, level) {

					if (level === undefined) {
						level = 50;
					}

					return [
						rgba1[0] - (rgba1[0] - rgba2[0]) * (level / 100),
						rgba1[1] - (rgba1[1] - rgba2[1]) * (level / 100),
						rgba1[2] - (rgba1[2] - rgba2[2]) * (level / 100),
						rgba2[3] ? rgba2[3] : 255
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
						input[0] * io + (current[0]) * (1 - io),
						input[1] * io + (current[1]) * (1 - io),
						input[2] * io + (current[2]) * (1 - io),
						current[3]
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

						case 'clamped':
							this.mixed[0] = Math.max(0, Math.min(255, this.mixed[0]));
							this.mixed[1] = Math.max(0, Math.min(255, this.mixed[1]));
							this.mixed[2] = Math.max(0, Math.min(255, this.mixed[2]));
							this.mixed[3] = Math.max(0, Math.min(255, this.mixed[3]));
							break;

						case 'pingpong':
							this.mixed[0] = generator.calc.pingpong(this.mixed[0], 0, 255);
							this.mixed[1] = generator.calc.pingpong(this.mixed[1], 0, 255);
							this.mixed[2] = generator.calc.pingpong(this.mixed[2], 0, 255);
							this.mixed[3] = generator.calc.pingpong(this.mixed[3], 0, 255);
							break;

						case 'limitless':
						default:
							// do nothing :)
							break;
					}

					generator.texture.set(x, y, this.mixed);

				},

				// get the pixel
				get: function (x, y, normalize) {

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
					var x = generator.randIntSeed(0, width);
					var y = generator.randIntSeed(0, height);
					var size = generator.randByArraySeed(params.size);

				} else {

					// centered x and y, only size random
					var x = params.origin[0];
					var y = params.origin[1];
					var size = generator.randByArraySeed(params.size);

				}

				return {
					x: x,
					y: y,
					size: size
				};

			}


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
			generator.toCanvas = function (texture) {

				if (texture == undefined) {
					texture = generator.texture.data;
				}

				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				var context = canvas.getContext('2d');
				var imageData = this.toContext(context, texture);
				context.putImageData(imageData, 0, 0);

				return canvas;
			};

			// get canvas
			generator.getCanvas = function (func) {

				if (func) {

					var layer = this.layers[this.layers.length - 1];
					var canvas = this.toCanvas(layer);

					func(canvas);
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
					name = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' l' + generator.layers.length + ' i' + rendered.length;

				}

				return {
					"name": name,
					"version": self.version,
					"width": width,
					"height": height,
					"normalize": generator.normalize,
					"items": rendered
				}

			}

			// parse params
			generator.render = function (config, noclear) {

				// call event
				generator.event('beforeRender', config);

				// store current layer
				var current = 0;

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
					generator.normalize = 'limitless';
				}

				checkSize();
				generator.texture = new generator.buffer(config.background);

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
						if (generator.layers[layer] != undefined) {
							generator.texture.data = generator.layers[layer];
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

					generator.layers[layer] = generator.texture.export();

				}

				// call event
				generator.event('afterRender', generator.params());

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
(function (fn) {

	var tgen = window[fn];

	// opacity
	tgen.filter('opacity', {
		adjust: 128
	}, function ($g, params) {

		$g.walk(function (color) {
			color[3] = params.adjust;
			return color;
		});

		return params;

	});


	// vibrance
	tgen.filter('vibrance', {
		adjust: 128
	}, function ($g, params) {

		var adjust = params.adjust * -1;

		$g.walk(function (color) {

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

		return params;

	});


	// brightness
	// photoshop ok with legacy mode
	tgen.filter('brightness', {
		adjust: 50,
		legacy: true
	}, function ($g, params) {


		if (params.legacy === true) {


			$g.walk(function (color) {

				return [
					Math.min(color[0] + params.adjust, 255),
					Math.min(color[1] + params.adjust, 255),
					Math.min(color[2] + params.adjust, 255),
					color[3]
				];

			});

		} else {

			// TODO fix
			$g.walk(function (color) {

				return [
					color[0] = Math.min((255 / color[0]) * (params.adjust / 255), 255),
					color[1] = Math.min((255 / color[1]) * (params.adjust / 255), 255),
					color[2] = Math.min((255 / color[2]) * (params.adjust / 255), 255),
					color[3]
				];

			});

		}

		return params;

	});


	// contrast
	// photoshop test ok with NO legacy mode
	tgen.filter('contrast', {
		adjust: 50
	}, function ($g, params) {

		var adjust = (100 + params.adjust) / 100;

		$g.walk(function (color) {

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

		return params;

	});


	// threshold
	tgen.filter('threshold', {
		adjust: [64, 128]
	}, function ($g, params) {

		params.adjust = $g.randByArray(params.adjust);

		$g.walk(function (color) {
			var t = ((0.2126 * color[0]) + (0.7152 * color[1]) + (0.0722 * color[2]) <= params.adjust) ? 0 : 255;
			return [t, t, t, color[3]];
		});

		return params;

	});


	// gamma
	// photoshop test ok
	tgen.filter('gamma', {
		adjust: 0.5
	}, function ($g, params) {

		$g.walk(function (color) {

			color[0] = Math.pow(color[0] / 255, 1 / params.adjust) * 255;
			color[1] = Math.pow(color[1] / 255, 1 / params.adjust) * 255;
			color[2] = Math.pow(color[2] / 255, 1 / params.adjust) * 255;

			return [
				color[0],
				color[1],
				color[2],
				color[3]
			];
		});

		return params;

	});


	// grayscale
	tgen.filter('grayscale', {
		method: ['ligthness', 'average', 'luminosity']
	}, function ($g, params) {

		if (typeof params == 'string') {
			params = {
				method: params
			}
		}

		if (typeof params.method == 'object') {
			params.method = $g.randItem(params.method);
		}

		switch (params.method) {

			case 'ligthness':
				$g.walk(function (color) {
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
				$g.walk(function (color) {
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
				$g.walk(function (color) {
					var lum = $g.calc.luminance(color);
					return [
						lum,
						lum,
						lum,
						color[3]
					];
				});
				break;

		}

		return params;

	});

	// colorize
	tgen.filter('colorize', {
		level: 50,
		rgba: "random",
		colormap: null
	}, function ($g, params) {

		$g.colormap.init(params.colormap, 255, function (cmap) {
			params.colormap = cmap;
		});

		$g.walk(function (color) {

			if ($g.colormap.data) {

				var avg = (color[0] + color[1] + color[2]) / 3;
				var c = $g.colormap.get(avg, params.rgba);
				// preserve aplha
				c[3] = color[3];
				return c;

			} else {
				return $g.point.colorize(color, params.rgba, params.level);
			}

		});

		return params;

	});

	// invert
	tgen.filter('invert', {
		channels: [1, 1, 1]
	}, function ($g, params) {

		$g.walk(function (color) {
			return [
				params.channels[0] ? 255 - color[0] : color[0],
				params.channels[1] ? 255 - color[1] : color[1],
				params.channels[2] ? 255 - color[2] : color[2],
				color[3]
			]
		});

		return params;

	});

	// channel
	tgen.filter('channel', {
		channels: [
			[0.2, 0.8],
			[0.4, 1.0],
			[0.8, 1.2]
		]
	}, function ($g, params) {

		params.channels[0] = $g.randByArray(params.channels[0], true);
		params.channels[1] = $g.randByArray(params.channels[1], true);
		params.channels[2] = $g.randByArray(params.channels[2], true);

		$g.walk(function (color) {
			return [
				color[0] * params.channels[0],
				color[1] * params.channels[1],
				color[2] * params.channels[2],
				color[3]
			]
		});

		return params;

	});

	// backlight
	tgen.filter('backlight', {
		channels: [1, 1, 1]
	}, function ($g, params) {

		$g.walk(function (color) {
			return [
				params.channels[0] ? (255 / color[0]) * (255 / color[0]) : color[0],
				params.channels[1] ? (255 / color[1]) * (255 / color[1]) : color[1],
				params.channels[2] ? (255 / color[2]) * (255 / color[2]) : color[2],
				color[3]
			]
		});

		return params;

	});

	// sobel
	tgen.filter('sobel', {
		type: 3
	}, function ($g, params) {

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: 'sobel' + params.type
		});

		return params;

	});


	// emboss
	tgen.filter('emboss', {
		type: 2
	}, function ($g, params) {

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: 'emboss' + params.type
		});

		return params;

	});


	// edgedetect
	tgen.filter('edgedetect', {
		type: 1
	}, function ($g, params) {

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: 'edgedetect' + params.type
		});

		return params;

	});

	
	// sharpen
	tgen.filter('sharpen', {
		type: 2
	}, function ($g, params) {

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: 'sharpen' + params.type
		});

		return params;

	});


	// blur
	tgen.filter('blur', {}, function ($g, params) {

		var divisor = 9;

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: [
				1 / divisor, 1 / divisor, 1 / divisor,
				1 / divisor, 1 / divisor, 1 / divisor,
				1 / divisor, 1 / divisor, 1 / divisor
			]
		});

		return params;

	});


	// sinecolor - aDDict2
	tgen.filter('sinecolor', {
		sines: [1, 7],
		channel: [0, 2]
	}, function ($g, params) {

		params.sines = $g.randByArray(params.sines);
		params.channel = $g.randByArray(params.channel);

		$g.walk(function (color) {

			var n = parseInt(Math.sin(color[params.channel] * ($g.calc.pi / 180.0) * (255 / 360) * params.sines) * 255);
			color[params.channel] = Math.abs(n);
			return color;

		});

		return params;

	});


	// convolute
	tgen.filter('convolute', {
		blend: "opacity",
		transparent: false,
		weights: 'default1' // string or array
	}, function ($g, params) {

		if ((typeof params.weights != 'object' && typeof params.weights != 'string') || params.weights == null) {
			return params;
		}

		if (typeof params.weights[0] == 'string') {
			params.weights = $g.randByArray(params.weights);
		}

		if (typeof params.weights == 'string') {

			if (params.weights === 'random') {				
				
				var min = -32;
				var max = 32;
				params.weights = [
					$g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max),$g.randIntSeed(min, max),
					$g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max),$g.randIntSeed(min, max),
					$g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max),$g.randIntSeed(min, max),
				];
				
				console.log(params.weights.join(', '));

			} else {

				var presets = {
					edgedetect1: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
					edgedetect2: [0, 1, 0, 1, -4, 1, 0, 1, 0],
					edgedetect3: [1, 0, -1, 0, 0, 0, -1, 0, 1],					
					sharpen1: [0, -1, 0, -1, 5, -1, 0, -1, 0],
					sharpen2: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
					emboss1: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
					emboss2: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
					emboss3: [10, 3, -2, -8, -5, 7, -3, -12, 11],
					emboss4: [-6, 11, -9, -9, 0, -4, 12, 8, -2],
					sobel1: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
					sobel2: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
					sobel3: [-5, -8, 12, -4, -8, -12, 9, 6, 9],
					default1: [1, -11, -7, 5, 2, 4, 4, 9, -2],
					default2: [-5, -21, 25, 22, 31, -16, -2, -21, -10],
					default3: [1, 1, 1, 1, 1, 1, 1, 1, 1]
				};

				if (presets[params.weights] == undefined) {
					return params;
				}

				params.weights = presets[params.weights];

			}

		}

		var buffer = new $g.buffer();
		buffer.clear();
		var side = Math.round(Math.sqrt(params.weights.length));
		var halfSide = Math.floor(side / 2);
		var alphaFac = params.transparent ? 1 : 0;

		for (var y = 0; y < $g.texture.height; y++) {
			for (var x = 0; x < $g.texture.width; x++) {

				var r = 0,
					g = 0,
					b = 0,
					a = 0;

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


})('tgen');
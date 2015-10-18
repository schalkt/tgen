(function (fn) {

	var tgen = window[fn];

	// opacity
	tgen.effect('opacity', {
		adjust: 128
	}, function ($g, params) {

		$g.walk(function (color) {
			color[3] = params.adjust;
			return color;
		});

		return params;

	});


	// vibrance
	tgen.effect('vibrance', {
		adjust: 50
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
	tgen.effect('brightness', {
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
	tgen.effect('contrast', {
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
	tgen.effect('threshold', {
		adjust: 128
	}, function ($g, params) {

		$g.walk(function (color) {

			var t = ((0.2126 * color[0]) + (0.7152 * color[1]) + (0.0722 * color[2]) <= params.adjust) ? 0 : 255;
			return [
				t,
				t,
				t,
				1
			]
		});

		return params;

	});


	// gamma
	// photoshop test ok
	tgen.effect('gamma', {
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
	tgen.effect('grayscale', {
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
	tgen.effect('colorize', {
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
	tgen.effect('invert', {
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

	// sobel
	tgen.effect('sobel', {
		type: 1
	}, function ($g, params) {

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

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: weights
		});

		return params;

	});

	// emboss
	tgen.effect('emboss', {
		type: 1
	}, function ($g, params) {

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

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: weights
		});

		return params;

	});


	// edgedetect
	tgen.effect('edgedetect', {
		type: 1
	}, function ($g, params) {

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

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: weights
		});

		return params;

	});


	// sharpen
	tgen.effect('sharpen', {
		type: 1
	}, function ($g, params) {

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

		$g.do('convolute', {
			store: false,
			transparent: false,
			weights: weights
		});

		return params;

	});


	// blur
	tgen.effect('blur', {}, function ($g, params) {

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
	tgen.effect('sinecolor', {
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
	tgen.effect('convolute', {
		blend: "opacity",
		transparent: false,
		weights: [
			1, 1, 1,
			1, 1, 1,
			1, 1, 1
		]
	}, function ($g, params) {

		if (typeof params.weights != 'object' || params.weights == null) {
			return params;
		}

		var buffer = new $g.buffer();
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
						//a += color[3] * wt;
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
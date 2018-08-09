$(document).ready(function () {

	// initialize the generator
	var generator = tgen.init(128, 128);

	var params = {
		"items": [
			[0, "fill"],
			[1, "noise"],
			[2, "spheres"],
			[3, "pyramids"],
			[4, "squares"],
			[5, "circles"],
			[6, "lines"],
			[7, "lines2"],
			[8, "subplasma"],
			[9, "waves"],
			[10, "crosshatch"],
			[11, "clouds"],
			[12, "colorbar"],
			[13, "checkerboard"],
			[14, "dots"],
			[15, "mandelbrot"]
		]
	};

	var addImage = function (key, canvas, selector) {
		var img = '<img src="' + canvas.toDataURL("image/png") + '" />';
		var images = $('<div class="img"><small>' + key + '</small>' + img + '</div>');
		$(selector).append(images);
	}

	var texture = generator.render(params);

	for (var i = 0; i < params.items.length; i++) {
		params['items'][i][2] = {
			"rgba": [
				[128, 255],
				[128, 255],
				[128, 255], 255
			]
		};
		addImage(params['items'][i][1], texture.toCanvas(texture.layers[i]), '#effects');
	}

	$('.hideme').html('');

});
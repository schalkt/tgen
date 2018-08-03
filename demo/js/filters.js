$(document).ready(function () {

	// initialize the generator
	var generator = tgen.init(128, 128);

	var params = {
		"items": [
			[0, "spheres", {
				"seed": [1, 2000]
			}],
			[0, "spheres", {
				"seed": [1, 2000]
			}]
		]
	};

	var addBlendedImage = function (key, canvas, selector) {
		var img = '<img src="' + canvas.toDataURL("image/png") + '" />';
		var images = $('<div class="img"><small>' + key + '</small>' + img + '</div>');
		$(selector).append(images);
	}

	var texture = generator.render(params);
	addBlendedImage('original', texture.toCanvas(texture.layers[0]), '#imgA');

	params = texture.params();
	params['items'].push([0, "filterName"]);

	for (var key in tgen.filters) {
		var filterName = tgen.filters[key];
		params['items'][2][1] = filterName;
		texture = generator.render(params);
		addBlendedImage(filterName, texture.toCanvas(), '#filters');

	}

	$('.hideme').html('');

});
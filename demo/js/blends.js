
$(document).ready(function () {

   	// initialize the generator
   	var generator = tgen.init(128, 128);

   	var params = {
   		"items": [
   			[0, "spheres", {
   				"seed": [1, 2000]
   			}],
   			[1, "spheres", {
   				"seed": [1, 2000]
   			}],
   			[2, "copy", 0],
   			[2, "merge", {
   				"layer": 1,
   				"blend": "opacity"
   			}]
   		]
   	};

   	var addBlendedImage = function (key, canvas, selector) {
   		var img = '<img src="' + canvas.toDataURL("image/png") + '" />';
   		var images = $('<div class="img"><small>' + key + '</small>' + img + '</div>');
   		$(selector).append(images);
   	}

   	var texture = generator.render(params);
   	addBlendedImage('img A', texture.toCanvas(texture.layers[0]), '#imgAB');
   	addBlendedImage('img B', texture.toCanvas(texture.layers[1]), '#imgAB');

   	params = texture.params();

   	for (var key in tgen.blends) {

   		if (key !== 'opacity') {
			params['items'][3][2]['blend'] = key;
			texture = generator.render(params);
			addBlendedImage(key, texture.toCanvas(), '#blends');				
   		}
   	}

   	$('.hideme').html('');

});

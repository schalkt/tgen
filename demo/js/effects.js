$(document).ready(function () {

	// initialize the generator
	var generator = tgen.init(128, 128);

	var params = {
		"items": [
			[0, "fill"],
			[1, "noise"],
			[2, "spheres",  {
				"blend": "lighten",			
				"origin": "random",
				"dynamic": false,
				"count": 21,
				"size": [
				  21,
				  42
				],
			  }],
			[3, "pyramids",  {
				"blend": "difference-invert",
				"rgba": [
				  242,
				  198,
				  13,
				  183
				],
				"origin": "random",
				"dynamic": true,
				"count": 17,
				"size": [
				  6.13875885419558,
				  65.06580611909934
				],
				"seed": 698883
			  }],
			[4, "squares", {
				"blend": "lighten",
				"rgba": [
				  215,
				  177,
				  225,
				  187
				],
				"origin": "random",
				"count": 77,
				"size": [
				  1.960330601878923,
				  20.631680655331365
				],
				"seed": 13618783
			  }],
			[5, "circles", {
				"blend": "lighten",
				"rgba": [
				  59,
				  82,
				  184,
				  147
				],
				"origin": "random",
				"count": 15,
				"size": [
				  19.960330601878923,
				  5.631680655331365
				],
				"seed": 9805408
			  }],
			[6, "lines", {
				"blend": "opacity",
				"rgba": [
				  57,
				  161,
				  112,
				  77
				],
				"size": 201,
				"count": 210,
			}],
			[7, "lines2", {
				"blend": "screen",
				"rgba": [
				  175,
				  199,
				  23,
				  153
				],
				"type": "vertical",
				"size": [
				  0.1,
				  21
				],
				"count": 18,
				"seed": 6005181
			}],
			[8, "subplasma",   {
				"seed": 4771973,
				"size": 4,
				"rgba": [
				  126,
				  131,
				  133,
				  238
				]
			  }],
			[9, "waves", {
				"blend": "lineardodge",
				"rgba": [
				  6,
				  48,
				  52,
				  230
				],
				"level": 68,
				"xsines": 13,
				"ysines": 4,
				"seed": 5090682
			}],
			[10, "crosshatch", {
				"blend": "screen",
				"rgba": [
				  52,
				  92,
				  86,
				  230
				],
				"level": 39,
				"xadjust": 74.62633158935496,
				"yadjust": 45.021245801724405,
				"seed": 4889645
			}],
			[11, "clouds",  {
				"blend": "lighten",
				"rgba": [
				  55,
				  125,
				  255,
				  255
				],
				"seed": 11904915,
				"roughness": 5,
				"colormap": null
			  }],
			[12, "colorbar",   {
				"type": "vertical",
				"colormap": "fire",
				"mirror": true,
				"seed": 10080281
			  }],
			[13, "checkerboard", {
				"rgba": [
					14,
					121,
					197,
					177
				  ],
				  "even": false,
				  "size": 16,
				  "seed": 6079974
			}],
			[14, "dots",   {
				"blend": "lighten",
				"gridX": 11,
				"gridY": 10,
				"size": [
				  200,
				  400
				],
				"seed": 3205906,
				"rgba": [
				  29,
				  137,
				  198,
				  226
				],
				"shape": "sphere",
				"dynamic": true,
				"xsines": 9,
				"ysines": 5
			  }],			
			[15, "xor", {
				"rgba": [
					115,
					45,
					39,
					213
				  ],
				  "level": 43,
				  "zoom": 2,
				  "seed": 15009948
			}]
		]
	};

	var addImage = function (key, canvas, selector) {
		var img = '<img src="' + canvas.toDataURL("image/png") + '" />';
		var images = $('<div class="img"><small>' + key + '</small>' + img + '</div>');
		$(selector).append(images);
	};
	
	var i;

	for (i = 0; i < params.items.length; i++) {
		
		if (params.items[i][2] === undefined) {			
			params.items[i][2] = {};
		}
		if (params.items[i][2].rgba === undefined) {			
			params.items[i][2].rgba = [
				[128, 255],
				[128, 255],
				[128, 255], 255
			];
		}
		if (params.items[i][2].seed === undefined) {			
			params.items[i][2].seed = 7771;
		}
		
	}

	var texture = generator.render(params);
	
	for (i = 0; i < params.items.length; i++) {
		addImage(params.items[i][1], texture.toCanvas(texture.layers[i]), '#effects');
	}


	$('.hideme').html('');

});
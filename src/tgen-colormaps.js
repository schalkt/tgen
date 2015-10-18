(function (fn) {

	var tgen = window[fn];

	// dawn
	tgen.colormap('dawn', function () {

		return [
			{percent: 0, rgba: [255, 255, 192, 255]},
			{percent: 25, rgba: [255, 255, 128, 255]},
			{percent: 50, rgba: [255, 128, 128, 255]},
			{percent: 75, rgba: [128, 0, 128, 255]},
			{percent: 100, rgba: [0, 0, 128, 255]}
		];

	});

	// dusk
	tgen.colormap('dusk', function () {

		return [
			{percent: 0, rgba: [255, 255, 255, 255]},
			{percent: 25, rgba: [255, 128, 255, 255]},
			{percent: 50, rgba: [128, 0, 255, 255]},
			{percent: 75, rgba: [0, 0, 128, 255]},
			{percent: 100, rgba: [0, 0, 0, 255]}
		];

	});

	// kryptonite
	tgen.colormap('kryptonite', function () {

		return [
			{percent: 0, rgba: [255, 255, 255, 255]},
			{percent: 25, rgba: [255, 255, 128, 255]},
			{percent: 50, rgba: [128, 255, 0, 255]},
			{percent: 75, rgba: [0, 128, 0, 255]},
			{percent: 100, rgba: [0, 0, 0, 255]}
		];

	});


	// ice
	tgen.colormap('ice', function () {

		return [
			{percent: 0, rgba: [255, 255, 255, 255]},
			{percent: 25, rgba: [128, 255, 255, 255]},
			{percent: 50, rgba: [0, 128, 255, 255]},
			{percent: 75, rgba: [0, 0, 128, 255]},
			{percent: 100, rgba: [0, 0, 0, 255]}
		];

	});

	// fire
	tgen.colormap('fire', function () {

		return [
			{percent: 0, rgba: [255, 255, 255, 255]},
			{percent: 25, rgba: [255, 255, 128, 255]},
			{percent: 50, rgba: [255, 128, 0, 255]},
			{percent: 75, rgba: [128, 0, 0, 255]},
			{percent: 100, rgba: [0, 0, 0, 255]}
		];

	});

	// redblue
	tgen.colormap('redblue', function () {

		return [
			{percent: 0, rgba: [96, 0, 0, 255]},
			{percent: 25, rgba: [192, 0, 0, 255]},
			{percent: 50, rgba: [255, 255, 255, 255]},
			{percent: 75, rgba: [0, 0, 192, 255]},
			{percent: 100, rgba: [0, 0, 96, 255]}
		];

	});

	// seashore
	tgen.colormap('seashore', function () {

		return [
			{percent: 0, rgba: [255, 255, 192, 255]},
			{percent: 25, rgba: [255, 255, 128, 255]},
			{percent: 50, rgba: [128, 255, 128, 255]},
			{percent: 75, rgba: [0, 128, 128, 255]},
			{percent: 100, rgba: [0, 0, 128, 255]}
		];

	});

})('tgen');
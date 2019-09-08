(function (tgen) {

	// rect
	tgen.shape('rect', function ($g, x, y, sizeX, sizeY, centered) {

		if (centered !== undefined) {
			x = x - parseInt(sizeX / 2, 10);
			y = y - parseInt(sizeY / 2, 10);
		}

		for (var ix = 0; ix < sizeX; ix++) {
			for (var iy = 0; iy < sizeY; iy++) {
				$g.point.set(x + ix, y + iy);
			}
		}

	});

	// circle
	tgen.shape('circle', function ($g, x1, y1, radius, centered) {

		if (centered == undefined) {
			x1 = x1 + radius;
			y1 = y1 + radius;
		}

		for (var x = -radius; x < radius; x++) {

			var h = Math.round(Math.sqrt(radius * radius - x * x));

			for (var y = -h; y < h; y++) {
				$g.point.set(x1 + x, y1 + y);
			}
		}

	});

	// line
	tgen.shape('line', function ($g, x1, y1, x2, y2) {

		var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
		var dx = (x2 - x1) / d;
		var dy = (y2 - y1) / d;
		var x = 0;
		var y = 0;
		var i;

		for (i = 0; i < d; i++) {
			x = x1 + (dx * i);
			y = y1 + (dy * i);
			$g.point.set(x, y);
		}

	});


	// colorLine
	tgen.shape('colorLine', function ($g, x1, y1, x2, y2, colorMap) {

		var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
		var dx = (x2 - x1) / d;
		var dy = (y2 - y1) / d;
		var x = 0;
		var y = 0;
		var percent, index, w, i;

		var colorMapSize = colorMap.length;
		var weight = 7;

		for (i = 0; i < d; i++) {
			x = x1 + (dx * i);
			y = y1 + (dy * i);

			percent = i / d;
			index = parseInt(colorMapSize * percent);
			$g.point.rgba = colorMap[index];

			for (w = 1; w <= weight; w++) {
				$g.point.set(x - w, y + w);
			}

		}

	});

	// sphere
	tgen.shape('sphere', function ($g, x1, y1, radius, centered, rgba, dynamicopacity) {

		var c, o, h, x, y;

		if (centered == undefined) {
			x1 = x1 + radius;
			y1 = y1 + radius;
		}

		for (x = -radius; x < radius; x++) {

			h = parseInt(Math.sqrt(radius * radius - x * x), 10);

			for (y = -h; y < h; y++) {

				c = Math.min(255, Math.max(0, (255 - 255 * Math.sqrt((y * y) + (x * x)) / (radius / 2)))) / 255;

				if (c > 0) {

					if (dynamicopacity) {
						o = c * 255;
					} else {
						o = rgba[3];
					}

					$g.point.rgba = [rgba[0] * c, rgba[1] * c, rgba[2] * c, o];
					$g.point.set(x1 + x, y1 + y);

				}

			}
		}

	});

	// pyramid
	tgen.shape('pyramid', function ($g, x, y, sizeX, sizeY, centered, rgba, dynamicopacity) {

		var halfX = parseInt(sizeX / 2, 10);
		var halfY = parseInt(sizeY / 2, 10);
		var c, o, cx, cy, ix, iy;

		if (centered != true) {
			x = x + halfX;
			y = y + halfY;
		}

		for (ix = -halfX; ix < halfX; ix++) {
			for (iy = -halfY; iy < halfY; iy++) {

				cx = (0.25 - Math.abs(ix / sizeX)) * 255;
				cy = (0.25 - Math.abs(iy / sizeY)) * 255;
				c = cx + cy;

				if (c > 1) {

					if (dynamicopacity) {
						o = c;
					} else {
						o = rgba[3];
					}

					$g.point.rgba = [(rgba[0] / 255) * c, (rgba[1] / 255) * c, (rgba[2] / 255) * c, o];
					$g.point.set(x + ix, y + iy);
				}

			}
		}

	});


})(SeamlessTextureGenerator);
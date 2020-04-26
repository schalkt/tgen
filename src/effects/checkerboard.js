(function(tgen) {

    // checkerboard
    tgen.effect('checkerboard', {
        blend: tgen.blendFlat,
        rgba: "randomalpha",
        even: "random",
        size: [
            [2, 32],
            [2, 32],
        ],
    }, function($g, params) {

        params.even = $g.randItemByArraySeed(params.even, [true, false]);

        var width = $g.texture.width;
        var height = $g.texture.height;
        var sizeX, sizeY;

        if (typeof params.size === 'number') {
            sizeX = sizeY = params.size;
        } else {
            sizeX = params.size[0] = $g.randByArraySeed(params.size[0], null, true);
            sizeY = params.size[1] = $g.randByArraySeed(params.size[1], null, true);
        }

        var cellX = width / sizeX;
        var cellY = height / sizeY;

        var drawCell = function(offsetX, offsetY) {
            for (var x = 0; x < cellX; x++) {
                for (var y = 0; y < cellY; y++) {
                    if (x + offsetX < width && y + offsetY < height) {
                        $g.point.set(x + offsetX, y + offsetY);
                    }
                }
            }
        };

        for (var cx = 0; cx < sizeX; cx++) {
            if (cx % 2 == 0) {
                for (var cy = 0; cy < sizeY; cy++) {
                    if (cy % 2 == 0) {
                        drawCell(cx * cellX, cy * cellY);
                    } else {
                        drawCell(cx * cellX + cellX, cy * cellY);
                    }
                }
            }
        }

        return params;

    });

})(SeamlessTextureGenerator);
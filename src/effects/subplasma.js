(function(tgen) {

    // subplasma - aDDict2
    tgen.effect('subplasma', {
        seed: [1, 16777216],
        size: [1, 7],
        rgba: "randomalpha"
    }, function($g, params) {

        params.size = $g.randByArraySeed(params.size);

        var np = 1 << params.size;
        var rx = $g.texture.width;
        var ry = rx;
        var buffer = [];
        var x, y, p, zy, color;

        if (np > rx) {
            np = rx;
        }

        var ssize = rx / np;

        for (y = 0; y < np; y++) {
            for (x = 0; x < np; x++) {
                buffer[x * ssize + y * ssize * rx] = $g.calc.randomseed();
            }
        }

        for (y = 0; y < np; y++) {
            for (x = 0; x < rx; x++) {
                p = x & (~(ssize - 1));
                zy = y * ssize * rx;
                buffer[x + zy] = $g.calc.interpolate.catmullrom(
                    buffer[((p - ssize * 1) & (rx - 1)) + zy],
                    buffer[((p - ssize * 0) & (rx - 1)) + zy],
                    buffer[((p + ssize * 1) & (rx - 1)) + zy],
                    buffer[((p + ssize * 2) & (rx - 1)) + zy],
                    x % ssize, ssize);
            }
        }

        for (y = 0; y < ry; y++) {
            for (x = 0; x < rx; x++) {
                p = y & (~(ssize - 1));
                buffer[x + y * rx] = $g.calc.interpolate.catmullrom(
                    buffer[x + ((p - ssize * 1) & (ry - 1)) * rx],
                    buffer[x + ((p - ssize * 0) & (ry - 1)) * rx],
                    buffer[x + ((p + ssize * 1) & (ry - 1)) * rx],
                    buffer[x + ((p + ssize * 2) & (ry - 1)) * rx],
                    y % ssize, ssize);
            }
        }

        // colorize
        for (x = 0; x < $g.texture.width; x++) {
            for (y = 0; y < $g.texture.height; y++) {

                color = 255 * buffer[x + y * rx];
                $g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 255]);
                $g.point.set(x, y);

            }
        }

        return params;

    });

})(SeamlessTextureGenerator);
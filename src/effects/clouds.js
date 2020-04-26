(function(tgen) {

    // clouds - midpoint displacement
    tgen.effect('clouds', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        seed: [1, Number.MAX_SAFE_INTEGER],
        roughness: [1, 32],
        colormap: null
    }, function($g, params) {

        params.roughness = $g.randByArraySeed(params.roughness);

        var width = $g.texture.width;
        var height = $g.texture.height;
        var map = [];

        var generateMap = function() {
            for (var x = 0; x <= width; x++) {
                map[x] = [];
                for (var y = 0; y <= height; y++) {
                    map[x][y] = 0;
                }
            }
        };

        var mapV = function(x, y, value) {

            x = Math.round(x);
            y = Math.round(y);

            if (x < 0) {
                x = width + x;
            }

            if (x >= width) {
                x = x - width;
            }

            if (y < 0) {
                y = height + y;

            }

            if (y >= height) {
                y = y - height;
            }

            if (value !== undefined) {
                map[x][y] = value;
            }

            return map[x][y];

        };

        var displace = function(num) {
            return ($g.calc.randomseed() - 0.5) * (num / (width + width) * params.roughness);
        };

        var generateCloud = function(step) {

            var stepHalf = (step / 2);

            if (stepHalf <= 1) {
                return params;
            }

            for (var i = 0; i <= (width + stepHalf); i += stepHalf) {
                for (var j = 0; j <= (height + stepHalf); j += stepHalf) {

                    var topLeft = mapV(i - stepHalf, j - stepHalf);
                    var topRight = mapV(i, j - stepHalf);
                    var bottomLeft = mapV(i - stepHalf, j);
                    var bottomRight = mapV(i, j);

                    var x = i - (stepHalf / 2);
                    var y = j - (stepHalf / 2);

                    // center
                    var center = mapV(x, y, $g.calc.normalize1((topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(step)));

                    // left
                    var xx = i - (step) + (stepHalf / 2);
                    mapV(i - stepHalf, y, $g.calc.normalize1((topLeft + bottomLeft + center + mapV(xx, y)) / 4 + displace(step)));

                    // top
                    var yy = j - (step) + (stepHalf / 2);
                    mapV(x, j - stepHalf, $g.calc.normalize1((topLeft + topRight + center + mapV(x, yy)) / 4 + displace(step)));

                }

            }

            generateCloud(stepHalf);

        };

        // init random seeder
        $g.calc.randomseed(params.seed);

        // generate empty map
        generateMap();

        // generate cloud
        generateCloud(width);

        // render colormap
        $g.colormap.init(params.colormap, 255, function(cmap) {
            params.colormap = cmap;
        });

        // colorize
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var color = parseInt(255 * map[x][y], 10);

                if ($g.colormap.data !== null) {
                    $g.point.rgba = $g.colormap.get(color, params.rgba);
                } else {
                    $g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 255]);
                }

                $g.point.set(x, y);

            }
        }

        return params;

    });

})(SeamlessTextureGenerator);
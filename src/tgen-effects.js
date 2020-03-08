(function(tgen) {

    var blendSafe = [
        "average",
        "lighten",
        "linearburn",
        "linearlight",
        "difference",
        "difference-invert",
        "screen",
        "lineardodge",
        "lineardodge-invert",
        "opacity",
        "exclusion"
    ];

    var blendFlat = [
        "lighten",
        "screen",
        "opacity",
    ];

    // fill a layer
    tgen.effect('fill', {
        blend: "",
        rgba: "randomalpha"
    }, function($g, params) {

        $g.shape.rect($g, 1, 1, $g.texture.width, $g.texture.height);

        return params;

    });


    // noise
    tgen.effect('noise', {
        blend: "lighten",
        mode: 'monochrome', // monochrome or color
        channels: [255, 255, 255], // max rgb per channels in color mode
        opacity: 128,
        seed: [1, 16777216]
    }, function($g, params) {

        switch (params.mode) {

            case 'color':
                $g.walk(function(color) {

                    var r = params.channels[0] ? $g.randIntSeed(0, params.channels[0]) : 0;
                    var g = params.channels[1] ? $g.randIntSeed(0, params.channels[1]) : 0;
                    var b = params.channels[2] ? $g.randIntSeed(0, params.channels[2]) : 0;
                    color = [r, g, b, params.opacity];
                    return color;

                });
                break;

            case 'monochrome':
                $g.walk(function(color) {
                    var rnd = $g.randIntSeed(0, 255);
                    color = [rnd, rnd, rnd, params.opacity];
                    return color;
                });
                break;

            case 'colorize':
                $g.walk(function(color) {
                    color = $g.point.colorize(color, params.rgba);
                    return color;
                });
                break;

        }

        return params;

    });


    // spheres
    tgen.effect('spheres', {
        blend: blendSafe,
        rgba: "randomalpha",
        origin: "random",
        dynamic: "random",
        count: [1, 77],
        size: [
            [1, 92],
            [1, 92]
        ],
        seed: [1, 16777216]
    }, function($g, params) {

        if (params.dynamic === "random") {
            params.dynamic = $g.randInt(0, 1) === 1 ? true : false;
        }

        if (typeof params.size[0] == 'object') {
            params.size[0] = $g.randByArray(params.size[0], false);
        }

        if (typeof params.size[1] == 'object') {
            params.size[1] = $g.randByArray(params.size[1], false);
        }

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.sphere($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true, params.rgba, params.dynamic);

        }

        return params;

    });


    // pyramids
    tgen.effect('pyramids', {
        blend: blendSafe,
        rgba: "randomalpha",
        origin: "random",
        dynamic: "random",
        count: [1, 77],
        size: [
            [1, 92],
            [1, 92]
        ],
        seed: [1, 16777216]
    }, function($g, params) {

        if (params.dynamic === "random") {
            params.dynamic = $g.randInt(0, 1) === 1 ? true : false;
        }

        if (typeof params.size[0] == 'object') {
            params.size[0] = $g.randByArray(params.size[0], false);
        }

        if (typeof params.size[1] == 'object') {
            params.size[1] = $g.randByArray(params.size[1], false);
        }

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.pyramid($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), true, params.rgba, params.dynamic);

        }

        return params;

    });


    // squares
    tgen.effect('squares', {
        blend: blendFlat,
        rgba: "randomalpha",
        origin: "random",
        count: [1, 42],
        size: [
            [1, 77],
            [1, 77]
        ],
        seed: [1, 16777216]
    }, function($g, params) {

        if (typeof params.size[0] == 'object') {
            params.size[0] = $g.randByArraySeed(params.size[0], false);
        }

        if (typeof params.size[1] == 'object') {
            params.size[1] = $g.randByArraySeed(params.size[1], false);
        }

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.rect($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), false);


        }

        return params;

    });


    // circles
    tgen.effect('circles', {
        blend: blendFlat,
        rgba: "randomalpha",
        origin: "random",
        count: [1, 42],
        size: [
            [1, 42],
            [1, 42]
        ],
        seed: [1, 16777216]
    }, function($g, params) {

        if (typeof params.size[0] == 'object') {
            params.size[0] = $g.randByArraySeed(params.size[0], false);
        }

        if (typeof params.size[1] == 'object') {
            params.size[1] = $g.randByArraySeed(params.size[1], false);
        }

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.circle($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true);

        }

        return params;

    });


    // lines
    tgen.effect('lines', {
        blend: blendFlat,
        rgba: "randomalpha",
        size: [77, 221],
        count: [21, 512],
        freq1s: [4, 221],
        freq1c: [4, 221],
        freq2s: [4, 221],
        freq2c: [4, 221]
    }, function($g, params) {

        params.freq1s = $g.randByArraySeed(params.freq1s, true);
        params.freq1c = $g.randByArraySeed(params.freq1c, true);
        params.freq2s = $g.randByArraySeed(params.freq2s, true);
        params.freq2c = $g.randByArraySeed(params.freq2c, true);
        params.size = $g.randByArraySeed(params.size);

        for (var i = 0; i < params.count; i++) {

            var x1 = $g.texture.width / 2 + Math.sin(i / params.freq1s * $g.calc.pi) * params.size;
            var y1 = $g.texture.height / 2 + Math.cos(i / params.freq1c * $g.calc.pi) * params.size;
            var x2 = $g.texture.width / 2 + Math.sin(i / params.freq2s * $g.calc.pi) * params.size;
            var y2 = $g.texture.height / 2 + Math.cos(i / params.freq2c * $g.calc.pi) * params.size;

            $g.shape.line($g, x1, y1, x2, y2);

        }

        return params;

    });


    // lines2
    tgen.effect('lines2', {
        blend: blendFlat,
        rgba: "randomalpha",
        type: "random",
        size: [0.1, 21],
        count: [1, 42],
        seed: [1, 16777216]
    }, function($g, params) {

        if (params.type === "random") {
            params.type = $g.randInt(0, 1) === 1 ? 'vertical' : 'horizontal';
        }

        var item = null;

        for (var i = 0; i < params.count; i++) {

            if (params.elements != undefined) {

                item = params.elements[i];

            } else {

                item = {
                    size: $g.randByArraySeed(params.size, true),
                    d: $g.randRealSeed(0.1, 100)
                };

            }

            if (params.type == 'vertical') {
                $g.shape.rect($g, $g.percentX(item.d), 0, $g.percentX(item.size), $g.texture.height);
            } else {
                $g.shape.rect($g, 0, $g.percentX(item.d), $g.texture.width, $g.percentX(item.size));
            }

        }

        return params;

    });


    // subplasma - aDDict2
    tgen.effect('subplasma', {
        seed: [1, 16777216],
        size: [1, 7],
        rgba: "randomalpha"
    }, function($g, params) {

        params.size = $g.randByArray(params.size);

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


    // waves
    tgen.effect('waves', {
        blend: blendSafe,
        rgba: "randomalpha",
        level: [1, 100],
        xsines: [1, 14],
        ysines: [1, 14]
    }, function($g, params) {


        if (params.xsines === undefined) {
            params.xsines = $g.randIntSeed(1, 10);
        } else if (typeof params.xsines == 'object') {
            params.xsines = $g.randIntSeed(params.xsines[0], params.xsines[1]);
        }

        if (params.ysines === undefined) {
            params.ysines = $g.randIntSeed(1, 10);
        } else if (typeof params.ysines == 'object') {
            params.ysines = $g.randIntSeed(params.ysines[0], params.ysines[1]);
        }

        if (params.rgba === undefined) {
            var o = (params.opacity !== undefined) ? params.opacity : 255;
            params.rgba = $g.rgba([
                [0, 255],
                [0, 255],
                [0, 255],
                o
            ]);
        }


        for (var x = 0; x < $g.texture.width; x++) {
            for (var y = 0; y < $g.texture.height; y++) {

                var c = 127 + 63.5 * Math.sin(x / $g.texture.width * params.xsines * 2 * $g.calc.pi) + 63.5 * Math.sin(y / $g.texture.height * params.ysines * 2 * $g.calc.pi);
                if (typeof params.channels == "object") {
                    $g.point.rgba = [params.channels[0] ? c : 0, params.channels[1] ? c : 0, params.channels[2] ? c : 0, params.channels[3] ? c : 0];
                } else {
                    $g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
                }

                $g.point.set(x, y);

            }
        }

        return params;

    });


    // crosshatch
    tgen.effect('crosshatch', {
        blend: blendSafe,
        rgba: "randomalpha",
        level: [1, 100],
        xadjust: "random",
        yadjust: "random",
    }, function($g, params) {


        if (params.xadjust === undefined || params.xadjust == 'random') {
            params.xadjust = $g.randRealSeed(0.1, 121);
        }
        if (params.yadjust === undefined || params.yadjust == 'random') {
            params.yadjust = $g.randRealSeed(0.1, 121);
        }
        if (params.rgba === undefined) {
            params.rgba = [$g.randIntSeed(0, 255), $g.randIntSeed(0, 255), $g.randIntSeed(0, 255), 255];
        }

        for (var x = 0; x < $g.texture.width; x++) {
            for (var y = 0; y < $g.texture.height; y++) {

                var c = 127 + 63.5 * Math.sin(x * x / params.xadjust) + 63.5 * Math.cos(y * y / params.yadjust);
                $g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
                $g.point.set(x, y);

            }
        }


        return params;

    });


    // clouds - midpoint displacement
    tgen.effect('clouds', {
        blend: blendSafe,
        rgba: "randomalpha",
        seed: [1, 16777216],
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

            for (var i = stepHalf - stepHalf; i <= (width + stepHalf); i += stepHalf) {
                for (var j = stepHalf - stepHalf; j <= (height + stepHalf); j += stepHalf) {

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


    // colorbar
    tgen.effect('colorbar', {
        type: "random",
        colormap: "random",
        mirror: true
    }, function($g, params) {

        if (params.type === "random") {
            params.type = $g.randInt(0, 1) === 1 ? 'vertical' : 'horizontal';
        }

        var width = $g.texture.width;
        var height = $g.texture.height;

        // render colormap
        var size = (params.type == 'horizontal') ? width : height;

        $g.colormap.init(params.colormap, size, function(cmap) {
            params.colormap = cmap;
        });

        var x, y, q;

        if (params.type == 'horizontal') {

            for (x = 0; x < width; x++) {

                if (params.mirror) {
                    q = (x < width / 2) ? x * 2 : (width * 2) - (x * 2);
                    $g.point.rgba = $g.colormap.get(q);
                } else {
                    $g.point.rgba = $g.colormap.get(x);
                }

                for (y = 0; y < height; y++) {
                    $g.point.set(x, y);
                }

            }

        } else {

            for (y = 0; y < height; y++) {

                if (params.mirror) {
                    q = (y < height / 2) ? y * 2 : (height * 2) - (y * 2);
                    $g.point.rgba = $g.colormap.get(q);
                } else {
                    $g.point.rgba = $g.colormap.get(y);
                }


                for (x = 0; x < width; x++) {
                    $g.point.set(x, y);
                }

            }

        }


        return params;

    });


    // checkerboard
    tgen.effect('checkerboard', {
        blend: blendFlat,
        rgba: "randomalpha",
        even: "random",
        size: [
            [2, 32],
            [2, 32],
        ],
    }, function($g, params) {

        if (params.even === "random") {
            params.even = $g.randInt(0, 1) === 1 ? true : false;
        }

        var width = $g.texture.width;
        var height = $g.texture.height;
        var sizeX, sizeY;

        if (typeof params.size === 'number') {

            sizeX = sizeY = params.size;

        } else {

            if (typeof params.size[0] == 'object') {
                sizeX = params.size[0] = $g.randByArraySeed(params.size[0], null, true);
            } else {
                sizeX = params.size[0];
            }

            if (typeof params.size[1] == 'object') {
                sizeY = params.size[1] = $g.randByArraySeed(params.size[1], null, true);
            } else {
                sizeY = params.size[1];
            }

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


    // dotsdots
    tgen.effect('dots', {
        blend: "opacity",
        gridX: [2, 64],
        gridY: [2, 64],
        size: [1, 250],
        seed: [1, 16777216],
        rgba: "randomalpha",
        shape: "sphere",
        dynamic: true,
        xsines: [1, 16],
        ysines: [1, 16]
    }, function($g, params) {

        params.gridX = $g.randByArray(params.gridX);
        params.gridY = $g.randByArray(params.gridY);

        if (params.xsines === undefined) {
            params.xsines = $g.randInt(1, 10);
        } else if (typeof params.xsines == 'object') {
            params.xsines = $g.randInt(params.xsines[0], params.xsines[1]);
        }

        if (params.ysines === undefined) {
            params.ysines = $g.randInt(1, 10);
        } else if (typeof params.ysines == 'object') {
            params.ysines = $g.randInt(params.ysines[0], params.ysines[1]);
        }

        var percent = $g.randByArraySeed(params.size) / 100;
        var width = $g.texture.width;
        var height = $g.texture.height;
        var stepX = ((width) / params.gridX);
        var stepY = ((height) / params.gridY);
        var halfstepX = (stepX / 2);
        var halfstepY = (stepY / 2);

        for (var gx = 1; gx <= params.gridX; gx++) {
            for (var gy = 1; gy <= params.gridY; gy++) {

                //var percent = $g.randByArraySeed(params.size) / 100;
                //var size = (percent * (stepX + stepY) / 2);

                var m = (percent * (stepX + stepY) / 2 / 2);

                var size = m - (m / 2) * Math.sin(gx / params.gridX * params.xsines * 2 * $g.calc.pi) + (m / 2) * Math.sin(gy / params.gridY * params.ysines * 2 * $g.calc.pi);

                switch (params.shape) {

                    case 'sphere':
                        $g.shape.sphere($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size * 2, true, params.rgba, params.dynamic);
                        break;
                    case 'pyramid':
                        $g.shape.pyramid($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size, size, true, params.rgba, params.dynamic);
                        break;
                    case 'rect':
                        $g.shape.rect($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size, size, true, params.rgba, params.dynamic);
                        break;
                    default:
                        size = size / 2;
                        $g.shape.circle($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size, true);
                        break;

                }

            }
        }

        return params;

    });


    // xor texture
    tgen.effect('xor', {
        blend: "",
        rgba: "randomalpha",
        level: [1, 100],
        zoom: [0.1, 77],
    }, function($g, params) {

        var width = $g.texture.width;
        var height = $g.texture.height;

        if (params.zoom === undefined) {
            params.zoom = $g.randIntSeed(1, 10);
        } else if (typeof params.zoom == 'object') {
            params.zoom = $g.randIntSeed(params.zoom[0], params.zoom[1]);
        }

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                var color = (x * params.zoom) ^ y * (params.zoom);
                $g.point.rgba = $g.point.colorize([color, color, color, 255], params.rgba, params.level);
                //$g.point.rgba = [color, color, color, 255];
                $g.point.set(x, y);

            }
        }

        return params;

    });

    // fractal [UNDER DEVELOPMENT]
    tgen.effect('mandelbrot', {
        blend: "opacity",
        rgba: "randomalpha",
        seed: [1, 16777216],
        iteration: [8, 512],
        skip: [0, 8]
    }, function($g, params) {

        params.skip = $g.randByArraySeed(params.skip);
        params.iteration = $g.randByArraySeed(params.iteration);

        var width = $g.texture.width;
        var height = $g.texture.height;

        var xMin = -2.0;
        var xMax = 1.0;
        var yMin = -1.5;
        var yMax = 1.5;

        var mr0 = params.rgba[0];
        var mg0 = params.rgba[1];
        var mb0 = params.rgba[2];

        var mr1 = 256 / mr0;
        var mg1 = 256 / mg0;
        var mb1 = 256 / mb0;

        var maxIt = params.iteration;
        var x = 0.0;
        var y = 0.0;
        var zx = 0.0;
        var zx0 = 0.0;
        var zy = 0.0;
        var zx2 = 0.0;
        var zy2 = 0.0;

        for (var ky = 0; ky < height; ky++) {

            y = yMin + (yMax - yMin) * ky / height;

            for (var kx = 0; kx < width; kx++) {

                x = xMin + (xMax - xMin) * kx / width;
                zx = x;
                zy = y;

                for (var i = 0; i < maxIt; i++) {

                    zx2 = zx * zx;
                    zy2 = zy * zy;

                    if (zx2 + zy2 > 4.0) {
                        break;
                    }

                    zx0 = zx2 - zy2 + x;
                    zy = 2.0 * zx * zy + y;
                    zx = zx0;

                }

                if (i > params.skip) {
                    $g.point.rgba = [i % mr0 * mr1, i % mg0 * mg1, i % mb0 * mb1, $g.point.rgba[3]];
                    $g.point.set(kx, ky);
                }

            }
        }


        return params;

    });


})(SeamlessTextureGenerator);
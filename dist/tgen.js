/**
 * tgen.js - the seamless texture generator
 * https://github.com/schalkt/tgen/
 * http://texture-generator.com/
 *
 * Copyright (c) 2015-2020 Tamas Schalk
 * MIT license
 */

var SeamlessTextureGenerator = (function() {

    return {

        version: '1.3.5',
        defaults: {},
        effects: {},
        filters: [],
        presets: {},
        functions: [],
        blends: {},
        shapes: {},
        colormaps: {},

        events: {
            beforeEffect: {},
            afterEffect: {},
            beforeRender: {},
            afterRender: {}
        },

        config: {
            historyLast: 0, // save last rendered texture params to localStorage
            historyName: 'history',
            historyList: []
        },

        blendSafe: [
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
        ],

        blendFlat: [
            "lighten",
            "screen",
            "opacity",
        ],

        effect: function(name, defaults, func) {

            this.defaults[name] = defaults;
            this.effects[name] = func;

        },

        function: function(name, defaults, func) {

            this.functions.push(name);
            this.defaults[name] = defaults;
            this.effects[name] = func;

        },

        filter: function(name, defaults, func) {

            this.filters.push(name);
            this.defaults[name] = defaults;
            this.effects[name] = func;

        },

        preset: function(name, params) {

            params.name = name ;
            this.presets[name] = params;

        },

        event: function(when, name, func) {

            if (this.events[when] == undefined) {
                return;
            }

            this.events[when][name] = func;

        },

        blend: function(name, func) {

            this.blends[name] = func;

        },

        shape: function(name, func) {

            this.shapes[name] = func;

        },

        colormap: function(name, func) {

            this.colormaps[name] = func;

        },

        init: function(width, height, normalize) {

            return this.getGenerator(width, height, normalize);

        }

    };

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {

    module.exports = SeamlessTextureGenerator;

} else {

    if (typeof define === 'function' && define.amd) {

        define([], function() {
            return SeamlessTextureGenerator;
        });

    } else {

        window.tgen = SeamlessTextureGenerator;

    }
}
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
(function (tgen) {

    // circles
    tgen.effect('circles', {
        blend: tgen.blendFlat,
        rgba: "randomalpha",
        origin: "random",
        count: [1, 42],
        size: [
            [1, 42],
            [1, 42]
        ],
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function ($g, params) {

        params.size[0] = $g.randByArraySeed(params.size[0], false);
        params.size[1] = $g.randByArraySeed(params.size[1], false);

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.circle($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true);

        }

        return params;

    });

})(SeamlessTextureGenerator);
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
            return ($g.randRealSeed(0, 1) - 0.5) * (num / (width + width) * params.roughness);
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
(function(tgen) {

    // colorbar
    tgen.effect('colorbar', {
        type: "random",
        colormap: "random",
        mirror: true
    }, function($g, params) {

        params.type = $g.randItemByArraySeed(params.type, ['vertical', 'horizontal']);

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

})(SeamlessTextureGenerator);
(function(tgen) {

    // crosshatch
    tgen.effect('crosshatch', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        level: [1, 100],
        xadjust: "random",
        yadjust: "random",
    }, function($g, params) {

        params.xadjust = $g.randRealByArraySeed(params.xadjust, [0.1, 121]);
        params.yadjust = $g.randRealByArraySeed(params.yadjust, [0.1, 121]);
        
        for (var x = 0; x < $g.texture.width; x++) {
            for (var y = 0; y < $g.texture.height; y++) {

                var c = 127 + 63.5 * Math.sin(x * x / params.xadjust) + 63.5 * Math.cos(y * y / params.yadjust);
                $g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
                $g.point.set(x, y);

            }
        }

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // dots
    tgen.effect('dots', {
        blend: "opacity",
        gridX: [2, 64],
        gridY: [2, 64],
        size: [1, 250],
        seed: [1, Number.MAX_SAFE_INTEGER],
        rgba: "randomalpha",
        shape: "sphere",
        dynamic: true,
        xsines: [1, 16],
        ysines: [1, 16]
    }, function($g, params) {

        params.gridX = $g.randByArraySeed(params.gridX);
        params.gridY = $g.randByArraySeed(params.gridY);
        params.xsines = $g.randIntByArraySeed(params.xsines, [1, 16]);
        params.ysines = $g.randIntByArraySeed(params.ysines, [1, 16]);
        params.shape = $g.randItemByArraySeed(params.shape, ['sphere', 'pyramid', 'rect', 'circle']);

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

})(SeamlessTextureGenerator);
(function(tgen) {

    // fill a layer
    tgen.effect('fill', {
        blend: "",
        rgba: "randomalpha"
    }, function($g, params) {

        $g.shape.rect($g, 1, 1, $g.texture.width, $g.texture.height);

        return params;

    });


})(SeamlessTextureGenerator);
(function(tgen) {

    // fractal [UNDER DEVELOPMENT]
    tgen.effect('mandelbrot', {
        blend: "opacity",
        rgba: "randomalpha",
        seed: [1, Number.MAX_SAFE_INTEGER],
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
(function(tgen) {

    // lines
    tgen.effect('lines', {
        blend: tgen.blendFlat,
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

})(SeamlessTextureGenerator);
(function (tgen) {

    // lines2
    tgen.effect('lines2', {
        blend: tgen.blendFlat,
        rgba: "randomalpha",
        type: "random",
        size: [0.1, 21],
        count: [1, 42],
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function ($g, params) {

        params.type = $g.randItemByArraySeed(params.type, ['vertical', 'horizontal']);

        var size, percent, i;

        for (i = 0; i < params.count; i++) {
                        
            size = $g.randByArraySeed(params.size, true);
            percent = $g.randRealSeed(0.1, 100);
            
            if (params.type == 'vertical') {
                $g.shape.rect($g, $g.percentX(percent), 0, $g.percentX(size), $g.texture.height);
            } else {
                $g.shape.rect($g, 0, $g.percentX(percent), $g.texture.width, $g.percentX(size));
            }

        }

        return params;

    });

})(SeamlessTextureGenerator);
(function (tgen) {

    // noise
    tgen.effect('noise', {
        blend: "lighten",
        mode: 'monochrome', // monochrome or color
        channels: [255, 255, 255], // max rgb per channels in color mode
        opacity: 128,
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function ($g, params) {

        switch (params.mode) {

            case 'color':
                $g.walk(function (color) {

                    var r = params.channels[0] ? $g.randIntSeed(0, params.channels[0]) : 0;
                    var g = params.channels[1] ? $g.randIntSeed(0, params.channels[1]) : 0;
                    var b = params.channels[2] ? $g.randIntSeed(0, params.channels[2]) : 0;
                    color = [r, g, b, params.opacity];
                    return color;

                });
                break;

            case 'monochrome':
                $g.walk(function (color) {
                    var rnd = $g.randIntSeed(0, 255);
                    color = [rnd, rnd, rnd, params.opacity];
                    return color;
                });
                break;

            case 'colorize':

                $g.walk(function (color) {                    
                    var rnd = $g.randIntSeed(0, 255);
                    color = $g.point.colorize([rnd, rnd, rnd, params.opacity], params.rgba);
                    return color;
                });
                break;

        }

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // pyramids
    tgen.effect('pyramids', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        origin: "random",
        dynamic: "random",
        count: [1, 77],
        size: [
            [1, 92],
            [1, 92]
        ],
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function($g, params) {

        params.dynamic = $g.randItemByArraySeed(params.dynamic, [true, false]);    
        params.size[0] = $g.randByArraySeed(params.size[0], false);    
        params.size[1] = $g.randByArraySeed(params.size[1], false);
        
        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.pyramid($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), true, params.rgba, params.dynamic);

        }

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // spheres
    tgen.effect('spheres', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        origin: "random",
        dynamic: true,
        count: [1, 77],
        size: [
            [1, 92],
            [1, 92]
        ],
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function($g, params) {

        params.dynamic = $g.randItemByArraySeed(params.dynamic, [true, false]);    
        params.size[0] = $g.randByArraySeed(params.size[0], false);    
        params.size[1] = $g.randByArraySeed(params.size[1], false);
        
        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.sphere($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true, params.rgba, params.dynamic);

        }

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // squares
    tgen.effect('squares', {
        blend: tgen.blendFlat,
        rgba: "randomalpha",
        origin: "random",
        count: [1, 42],
        size: [
            [1, 77],
            [1, 77]
        ],
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function($g, params) {

        params.size[0] = $g.randByArraySeed(params.size[0], false);    
        params.size[1] = $g.randByArraySeed(params.size[1], false);

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.rect($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), false);

        }

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // subplasma - aDDict2
    tgen.effect('subplasma', {
        seed: [1, Number.MAX_SAFE_INTEGER],
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
                buffer[x * ssize + y * ssize * rx] = $g.randRealSeed(0,1);
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
(function(tgen) {

    // waves
    tgen.effect('waves', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        level: [1, 100],
        xsines: [1, 14],
        ysines: [1, 14]
    }, function($g, params) {

        params.xsines = $g.randIntByArraySeed(params.xsines, [1, 16]);
        params.ysines = $g.randIntByArraySeed(params.ysines, [1, 16]);

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

})(SeamlessTextureGenerator);
(function(tgen) {

    // xor texture
    tgen.effect('xor', {
        blend: "",
        rgba: "randomalpha",
        level: [1, 100],
        zoom: [0.1, 77],
    }, function($g, params) {

        var width = $g.texture.width;
        var height = $g.texture.height;

        params.zoom = $g.randIntByArraySeed(params.zoom, [1, 10]);

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

})(SeamlessTextureGenerator);
(function(tgen) {

    // backlight
    tgen.filter('backlight', {
        channels: [1, 1, 1]
    }, function($g, params) {

        $g.walk(function(color) {
            return [
                params.channels[0] ? (255 / color[0]) * (255 / color[0]) : color[0],
                params.channels[1] ? (255 / color[1]) * (255 / color[1]) : color[1],
                params.channels[2] ? (255 / color[2]) * (255 / color[2]) : color[2],
                color[3]
            ]
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // blur
    tgen.filter('blur', {}, function($g, params) {

        var divisor = 9;

        $g.do('convolute', {
            store: false,
            transparent: false,
            weights: [
                1 / divisor, 1 / divisor, 1 / divisor,
                1 / divisor, 1 / divisor, 1 / divisor,
                1 / divisor, 1 / divisor, 1 / divisor
            ]
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // brightness
    // photoshop ok with legacy mode
    tgen.filter('brightness', {
        adjust: 50,
        legacy: true
    }, function($g, params) {


        if (params.legacy === true) {


            $g.walk(function(color) {

                return [
                    Math.min(color[0] + params.adjust, 255),
                    Math.min(color[1] + params.adjust, 255),
                    Math.min(color[2] + params.adjust, 255),
                    color[3]
                ];

            });

        } else {

            // TODO fix
            $g.walk(function(color) {

                return [
                    color[0] = Math.min((255 / color[0]) * (params.adjust / 255), 255),
                    color[1] = Math.min((255 / color[1]) * (params.adjust / 255), 255),
                    color[2] = Math.min((255 / color[2]) * (params.adjust / 255), 255),
                    color[3]
                ];

            });

        }

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // channel
    tgen.filter('channel', {
        channels: [
            [0.2, 0.8],
            [0.4, 1.0],
            [0.8, 1.2]
        ]
    }, function($g, params) {

        params.channels[0] = $g.randByArray(params.channels[0], true);
        params.channels[1] = $g.randByArray(params.channels[1], true);
        params.channels[2] = $g.randByArray(params.channels[2], true);

        $g.walk(function(color) {
            return [
                color[0] * params.channels[0],
                color[1] * params.channels[1],
                color[2] * params.channels[2],
                color[3]
            ]
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // colorize
    tgen.filter('colorize', {
        level: 50,
        rgba: "random",
        colormap: null
    }, function($g, params) {

        $g.colormap.init(params.colormap, 255, function(cmap) {
            params.colormap = cmap;
        });

        $g.walk(function(color) {

            if ($g.colormap.data) {

                var avg = (color[0] + color[1] + color[2]) / 3;
                var c = $g.colormap.get(avg, params.rgba);
                // preserve aplha
                c[3] = color[3];
                return c;

            } else {
                return $g.point.colorize(color, params.rgba, params.level);
            }

        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // contrast
    // photoshop test ok with NO legacy mode
    tgen.filter('contrast', {
        adjust: 50
    }, function($g, params) {

        var adjust = (100 + params.adjust) / 100;

        $g.walk(function(color) {

            color[0] = ((((color[0] / 255) - 0.5) * adjust) + 0.5) * 255;
            color[1] = ((((color[1] / 255) - 0.5) * adjust) + 0.5) * 255;
            color[2] = ((((color[2] / 255) - 0.5) * adjust) + 0.5) * 255;

            return [
                Math.max(Math.min(color[0], 255), 0),
                Math.max(Math.min(color[1], 255), 0),
                Math.max(Math.min(color[2], 255), 0),
                color[3]
            ];
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // convolute
    tgen.filter('convolute', {
        blend: "opacity",
        transparent: false,
        weights: 'default1' // string or array
    }, function($g, params) {

        if ((typeof params.weights != 'object' && typeof params.weights != 'string') || params.weights == null) {
            return params;
        }

        if (typeof params.weights[0] == 'string') {
            params.weights = $g.randByArray(params.weights);
        }

        if (typeof params.weights == 'string') {

            if (params.weights === 'random') {

                var min = -32;
                var max = 32;
                params.weights = [
                    $g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max),
                    $g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max),
                    $g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max), $g.randIntSeed(min, max),
                ];

                $g.log(params.weights.join(', '));

            } else {

                var presets = {
                    edgedetect1: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
                    edgedetect2: [0, 1, 0, 1, -4, 1, 0, 1, 0],
                    edgedetect3: [1, 0, -1, 0, 0, 0, -1, 0, 1],
                    sharpen1: [0, -1, 0, -1, 5, -1, 0, -1, 0],
                    sharpen2: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
                    emboss1: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
                    emboss2: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
                    emboss3: [10, 3, -2, -8, -5, 7, -3, -12, 11],
                    emboss4: [-6, 11, -9, -9, 0, -4, 12, 8, -2],
                    sobel1: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
                    sobel2: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
                    sobel3: [-5, -8, 12, -4, -8, -12, 9, 6, 9],
                    default1: [1, -11, -7, 5, 2, 4, 4, 9, -2],
                    default2: [-5, -21, 25, 22, 31, -16, -2, -21, -10],
                    default3: [1, 1, 1, 1, 1, 1, 1, 1, 1]
                };

                if (presets[params.weights] == undefined) {
                    return params;
                }

                params.weights = presets[params.weights];

            }

        }

        var buffer = new $g.buffer();
        buffer.clear();
        var side = Math.round(Math.sqrt(params.weights.length));
        var halfSide = Math.floor(side / 2);
        var alphaFac = params.transparent ? 1 : 0;

        for (var y = 0; y < $g.texture.height; y++) {
            for (var x = 0; x < $g.texture.width; x++) {

                var r = 0,
                    g = 0,
                    b = 0,
                    a = 0;

                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {

                        var wt = params.weights[cy * side + cx];
                        var scy = y + cy - halfSide;
                        var scx = x + cx - halfSide;
                        var color = $g.texture.get(scx, scy);

                        r += color[0] * wt;
                        g += color[1] * wt;
                        b += color[2] * wt;
                        a += color[3];
                    }
                }

                buffer.set(x, y, [r, g, b, a + alphaFac * (255 - a)]);

            }
        }

        var size = $g.texture.size();
        while (size--) {
            $g.texture.data[size] = buffer.data[size];
        }

        return params;

    });


})(SeamlessTextureGenerator);
(function(tgen) {

    // edgedetect
    tgen.filter('edgedetect', {
        type: 1
    }, function($g, params) {

        $g.do('convolute', {
            store: false,
            transparent: false,
            weights: 'edgedetect' + params.type
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // emboss
    tgen.filter('emboss', {
        type: 2
    }, function($g, params) {

        $g.do('convolute', {
            store: false,
            transparent: false,
            weights: 'emboss' + params.type
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // gamma
    // photoshop test ok
    tgen.filter('gamma', {
        adjust: 0.5
    }, function($g, params) {

        $g.walk(function(color) {

            color[0] = Math.pow(color[0] / 255, 1 / params.adjust) * 255;
            color[1] = Math.pow(color[1] / 255, 1 / params.adjust) * 255;
            color[2] = Math.pow(color[2] / 255, 1 / params.adjust) * 255;

            return [
                color[0],
                color[1],
                color[2],
                color[3]
            ];
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // grayscale
    tgen.filter('grayscale', {
        method: ['ligthness', 'average', 'luminosity']
    }, function($g, params) {

        if (typeof params == 'string') {
            params = {
                method: params
            }
        }

        if (typeof params.method == 'object') {
            params.method = $g.randItemSeed(params.method);
        }

        switch (params.method) {

            case 'ligthness':
                $g.walk(function(color) {
                    var minmax = Math.max(color[0], color[1], color[2]) + Math.min(color[0], color[1], color[2]);
                    return [
                        minmax,
                        minmax,
                        minmax,
                        color[3]
                    ];
                });
                break;

            case 'average':
                $g.walk(function(color) {
                    var avg = (color[0] + color[1] + color[2]) / 3;
                    return [
                        avg,
                        avg,
                        avg,
                        color[3]
                    ];
                });
                break;

            case 'luminosity':
                $g.walk(function(color) {
                    var lum = $g.calc.luminance(color);
                    return [
                        lum,
                        lum,
                        lum,
                        color[3]
                    ];
                });
                break;

        }

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // invert
    tgen.filter('invert', {
        channels: [1, 1, 1]
    }, function($g, params) {

        $g.walk(function(color) {
            return [
                params.channels[0] ? 255 - color[0] : color[0],
                params.channels[1] ? 255 - color[1] : color[1],
                params.channels[2] ? 255 - color[2] : color[2],
                color[3]
            ]
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // opacity
    tgen.filter('opacity', {
        adjust: 128
    }, function($g, params) {

        $g.walk(function(color) {
            color[3] = params.adjust;
            return color;
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // sharpen
    tgen.filter('sharpen', {
        type: 2
    }, function($g, params) {

        $g.do('convolute', {
            store: false,
            transparent: false,
            weights: 'sharpen' + params.type
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // sinecolor - aDDict2
    tgen.filter('sinecolor', {
        sines: [1, 7],
        channel: [0, 2]
    }, function($g, params) {

        params.sines = $g.randByArray(params.sines);
        params.channel = $g.randByArray(params.channel);

        $g.walk(function(color) {

            var n = parseInt(Math.sin(color[params.channel] * ($g.calc.pi / 180.0) * (255 / 360) * params.sines) * 255);
            color[params.channel] = Math.abs(n);
            return color;

        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // sobel
    tgen.filter('sobel', {
        type: 3
    }, function($g, params) {

        $g.do('convolute', {
            store: false,
            transparent: false,
            weights: 'sobel' + params.type
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // threshold
    tgen.filter('threshold', {
        adjust: [64, 128]
    }, function($g, params) {

        params.adjust = $g.randByArray(params.adjust);

        $g.walk(function(color) {
            var t = ((0.2126 * color[0]) + (0.7152 * color[1]) + (0.0722 * color[2]) <= params.adjust) ? 0 : 255;
            return [t, t, t, color[3]];
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // vibrance
    tgen.filter('vibrance', {
        adjust: 128
    }, function($g, params) {

        var adjust = params.adjust * -1;

        $g.walk(function(color) {

            var avg = (color[0] + color[1] + color[2]) / 3;
            var max = Math.max(color[0], color[1], color[2]);
            var amt = ((Math.abs(max - avg) * 2 / 255) * adjust) / 100;

            if (color[0] !== max) {
                color[0] += (max - color[0]) * amt;
            }
            if (color[1] !== max) {
                color[1] += (max - color[1]) * amt;
            }
            if (color[2] !== max) {
                color[2] += (max - color[2]) * amt;
            }

            return [
                color[0],
                color[1],
                color[2],
                color[3]
            ];
        });

        return params;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // opacity
    tgen.blend('opacity', function($g, c, i) {

        // opacity always calculated in the engine by alpha channel
        return i;

    });

    // multiply
    // photoshop test ok
    tgen.blend('multiply', function($g, c, i) {

        i[0] = (c[0] * i[0]) / 255;
        i[1] = (c[1] * i[1]) / 255;
        i[2] = (c[2] * i[2]) / 255;
        return i;

    });

    // linearburn
    // photoshop test ok
    tgen.blend('linearburn', function($g, c, i) {

        i[0] = c[0] + i[0] - 255;
        i[1] = c[1] + i[1] - 255;
        i[2] = c[2] + i[2] - 255;
        return i;

    });

    // difference
    // photoshop test FALSE
    tgen.blend('difference', function($g, c, i) {

        i[0] = Math.abs(i[0] - c[0]);
        i[1] = Math.abs(i[1] - c[1]);
        i[2] = Math.abs(i[2] - c[2]);
        return i;

    });

    // difference-invert
    // photoshop test ok 
    tgen.blend('difference-invert', function($g, c, i) {

        i[0] = 255 - Math.abs(i[0] - c[0]);
        i[1] = 255 - Math.abs(i[1] - c[1]);
        i[2] = 255 - Math.abs(i[2] - c[2]);
        return i;

    });

    // screen
    // photoshop test ok
    tgen.blend('screen', function($g, c, i) {

        i[0] = 255 - (((255 - c[0]) * (255 - i[0])) / 255);
        i[1] = 255 - (((255 - c[1]) * (255 - i[1])) / 255);
        i[2] = 255 - (((255 - c[2]) * (255 - i[2])) / 255);
        return i;

    });

    // overlay
    // photoshop test ok
    tgen.blend('overlay', function($g, c, i) {

        i[0] = (c[0] > 128) ? 255 - 2 * (255 - i[0]) * (255 - c[0]) / 255 : (c[0] * i[0] * 2) / 255;
        i[1] = (c[1] > 128) ? 255 - 2 * (255 - i[1]) * (255 - c[1]) / 255 : (c[1] * i[1] * 2) / 255;
        i[2] = (c[2] > 128) ? 255 - 2 * (255 - i[2]) * (255 - c[2]) / 255 : (c[2] * i[2] * 2) / 255;
        return i;

    });

    // exclusion
    // photoshop test ok
    tgen.blend('exclusion', function($g, c, i) {

        i[0] = 128 - 2 * (c[0] - 128) * (i[0] - 128) / 255;
        i[1] = 128 - 2 * (c[1] - 128) * (i[1] - 128) / 255;
        i[2] = 128 - 2 * (c[2] - 128) * (i[2] - 128) / 255;
        return i;

    });

    // darken
    // photoshop test ok
    tgen.blend('darken', function($g, c, i) {

        i[0] = (i[0] < c[0]) ? i[0] : c[0];
        i[1] = (i[1] < c[1]) ? i[1] : c[1];
        i[2] = (i[2] < c[2]) ? i[2] : c[2];
        return i;

    });

    // lighten
    // photoshop test ok
    tgen.blend('lighten', function($g, c, i) {

        i[0] = (i[0] > c[0]) ? i[0] : c[0];
        i[1] = (i[1] > c[1]) ? i[1] : c[1];
        i[2] = (i[2] > c[2]) ? i[2] : c[2];
        return i;

    });

    // lineardodge
    // photoshop test ok
    tgen.blend('lineardodge', function($g, c, i) {

        i[0] = c[0] + i[0];
        i[1] = c[1] + i[1];
        i[2] = c[2] + i[2];
        return i;

    });

    // lineardodge-invert
    // photoshop test ok
    tgen.blend('lineardodge-invert', function($g, c, i) {

        i[0] = 255 - (i[0] + c[0]);
        i[1] = 255 - (i[1] + c[1]);
        i[2] = 255 - (i[2] + c[2]);
        return i;

    });

    // linearlight
    // photoshop test ok
    tgen.blend('linearlight', function($g, c, i) {

        i[0] = c[0] + 2 * i[0] - 255;
        i[1] = c[1] + 2 * i[1] - 255;
        i[2] = c[2] + 2 * i[2] - 255;
        return i;

    });

    // linearburn
    // photoshop test ok
    tgen.blend('linearburn', function($g, c, i) {

        i[0] = c[0] + i[0] - 255;
        i[1] = c[1] + i[1] - 255;
        i[2] = c[2] + i[2] - 255;
        return i;

    });

    // softlight
    // photoshop NOT 100%
    tgen.blend('softlight', function($g, c, i) {

        i[0] = (c[0] > 128) ? 255 - ((255 - c[0]) * (255 - (i[0] - 128))) / 255 : (c[0] * (i[0] + 128)) / 255;
        i[1] = (c[1] > 128) ? 255 - ((255 - c[1]) * (255 - (i[1] - 128))) / 255 : (c[1] * (i[1] + 128)) / 255;
        i[2] = (c[2] > 128) ? 255 - ((255 - c[2]) * (255 - (i[2] - 128))) / 255 : (c[2] * (i[2] + 128)) / 255;
        return i;

    });

    // subbtract
    // photoshop test ok
    tgen.blend('subbtract', function($g, c, i) {

        i[0] = Math.max(c[0] - i[0], 0);
        i[1] = Math.max(c[1] - i[1], 0);
        i[2] = Math.max(c[2] - i[2], 0);
        return i;

    });

    // backlight
    tgen.blend('backlight', function($g, c, i) {

        c[0] = (c[0] === 0) ? 0.01 : c[0];
        c[1] = (c[1] === 0) ? 0.01 : c[1];
        c[2] = (c[2] === 0) ? 0.01 : c[2];

        i[0] = (255 / c[0]) * (255 / i[0]);
        i[1] = (255 / c[1]) * (255 / i[1]);
        i[2] = (255 / c[2]) * (255 / i[2]);

        return i;

    });

    // average
    tgen.blend('average', function($g, c, i) {

        i[0] = (i[0] + c[0]) / 2;
        i[1] = (i[1] + c[1]) / 2;
        i[2] = (i[2] + c[2]) / 2;

        return i;

    });

    // alphamap
    tgen.blend('alphamap', function($g, c, i) {

        c[3] = (i[0] + i[1] + i[2]) / 3;

        return c;

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    // dawn
    tgen.colormap('blackwhite', function() {

        return [
            { percent: 0, rgba: [0, 0, 0, 255] },
            { percent: 25, rgba: [255, 255, 255, 255] },
            { percent: 50, rgba: [0, 0, 0, 255] },
            { percent: 75, rgba: [255, 255, 255, 255] },
            { percent: 100, rgba: [0, 0, 0, 255] }
        ];

    });


    // dawn
    tgen.colormap('dawn', function() {

        return [
            { percent: 0, rgba: [255, 255, 192, 255] },
            { percent: 25, rgba: [255, 255, 128, 255] },
            { percent: 50, rgba: [255, 128, 128, 255] },
            { percent: 75, rgba: [128, 0, 128, 255] },
            { percent: 100, rgba: [0, 0, 128, 255] }
        ];

    });

    // dusk
    tgen.colormap('dusk', function() {

        return [
            { percent: 0, rgba: [255, 255, 255, 255] },
            { percent: 25, rgba: [255, 128, 255, 255] },
            { percent: 50, rgba: [128, 0, 255, 255] },
            { percent: 75, rgba: [0, 0, 128, 255] },
            { percent: 100, rgba: [0, 0, 0, 255] }
        ];

    });

    // kryptonite
    tgen.colormap('kryptonite', function() {

        return [
            { percent: 0, rgba: [255, 255, 255, 255] },
            { percent: 25, rgba: [255, 255, 128, 255] },
            { percent: 50, rgba: [128, 255, 0, 255] },
            { percent: 75, rgba: [0, 128, 0, 255] },
            { percent: 100, rgba: [0, 0, 0, 255] }
        ];

    });


    // ice
    tgen.colormap('ice', function() {

        return [
            { percent: 0, rgba: [255, 255, 255, 255] },
            { percent: 25, rgba: [128, 255, 255, 255] },
            { percent: 50, rgba: [0, 128, 255, 255] },
            { percent: 75, rgba: [0, 0, 128, 255] },
            { percent: 100, rgba: [0, 0, 0, 255] }
        ];

    });

    // fire
    tgen.colormap('fire', function() {

        return [
            { percent: 0, rgba: [255, 255, 255, 255] },
            { percent: 25, rgba: [255, 255, 128, 255] },
            { percent: 50, rgba: [255, 128, 0, 255] },
            { percent: 75, rgba: [128, 0, 0, 255] },
            { percent: 100, rgba: [0, 0, 0, 255] }
        ];

    });

    // redblue
    tgen.colormap('redblue', function() {

        return [
            { percent: 0, rgba: [96, 0, 0, 255] },
            { percent: 25, rgba: [192, 0, 0, 255] },
            { percent: 50, rgba: [255, 255, 255, 255] },
            { percent: 75, rgba: [0, 0, 192, 255] },
            { percent: 100, rgba: [0, 0, 96, 255] }
        ];

    });

    // seashore
    tgen.colormap('seashore', function() {

        return [
            { percent: 0, rgba: [255, 255, 192, 255] },
            { percent: 25, rgba: [255, 255, 128, 255] },
            { percent: 50, rgba: [128, 255, 128, 255] },
            { percent: 75, rgba: [0, 128, 128, 255] },
            { percent: 100, rgba: [0, 0, 128, 255] }
        ];

    });

})(SeamlessTextureGenerator);
(function(tgen) {

    var time;
    var fulltime;

    tgen.event('beforeEffect', 'save start time', function($g, effect) {
        time = new Date().getTime();
    });

    tgen.event('afterEffect', 'log', function($g, effect) {
        
        var elapsed = new Date().getTime() - time;
        $g.log(effect.layer, elapsed, effect.name, effect.params);

    });

    tgen.event('beforeRender', 'log', function($g, params) {
        fulltime = new Date().getTime();
    });

    tgen.event('afterRender', 'log', function($g, params) {

        var elapsed = new Date().getTime() - fulltime;
        $g.log(elapsed, params);

    });


})(SeamlessTextureGenerator);
(function (tgen) {

    // layer copy to the current layer
    tgen.function('copy', {
        "layer": null,
    }, function ($g, params) {

        if (typeof params == 'number') {
            params = {
                "layer": params
            };
        }

        if (params.layer === null) {
            params.layer = $g.layers.length - 1;
        }

        if ($g.layers[params.layer] != undefined) {
            $g.texture.data = $g.layerCopy(params.layer);
        }

        return params;

    });


    // merge all layers
    tgen.function('mergeall', {
        blend: "opacity",
        firstcopy: true,
        opacity: null
    }, function ($g, params) {

        var length = $g.layers.length;

        for (var i = 0; i <= length; i++) {

            var imageData = $g.layers[i];

            if (i === 0 && params.firstcopy === true) {

                $g.do('copy', {
                    layer: 0,
                });

            } else {

                $g.do('merge', {
                    blend: params.blend,
                    layer: i,
                    opacity: params.opacity
                });

            }

        }

        return params;

    });

    // merge one or more layer
    tgen.function('merge', {
        blend: "opacity",
        layer: 0,
        opacity: null
    }, function ($g, params) {

        if ($g.layers[params.layer] === undefined) {
            return params;
        }

        var imageData = $g.layers[params.layer];

        for (var y = 0; y < $g.texture.height; y++) {
            for (var x = 0; x < $g.texture.width; x++) {

                var offset = $g.texture.offset(x, y);

                $g.point.rgba = [
                    imageData[offset],
                    imageData[offset + 1],
                    imageData[offset + 2],
                    params.opacity ? params.opacity : imageData[offset + 3]
                ];

                $g.point.set(x, y);

            }
        }

        return params;

    });

    // map effect - aDDict2
    tgen.function('map', {
        xamount: [5, 255],
        yamount: [5, 255],
        xchannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
        ychannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
        xlayer: 0,
        ylayer: 0
    }, function ($g, params) {

        params.xamount = $g.randByArraySeed(params.xamount);
        params.yamount = $g.randByArraySeed(params.yamount);
        params.xchannel = $g.randByArraySeed(params.xchannel);
        params.ychannel = $g.randByArraySeed(params.ychannel);
        params.xlayer = $g.randByArraySeed(params.xlayer);
        params.ylayer = $g.randByArraySeed(params.ylayer);

        var buffer = new $g.buffer();

        var width = $g.texture.width;
        var height = $g.texture.height;
        var ximageData = $g.layers[params.xlayer];
        var yimageData = $g.layers[params.ylayer];
        var x, y, ox, oy, rgba, offset, sx, sy;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {

                offset = $g.texture.offset(x, y);
                sx = ximageData[offset + params.xchannel];
                sy = yimageData[offset + params.ychannel];

                if ((width % 16) == 0) {
                    ox = $g.wrapx(x + ((sx * params.xamount * width) >> 16));
                } else {
                    ox = x + ((sx * params.xamount * width) / (width * width));
                }

                if ((height % 16) == 0) {
                    oy = $g.wrapy(y + ((sy * params.yamount * height) >> 16));
                } else {
                    oy = y + ((sy * params.yamount * height) / (height * height));
                }

                rgba = $g.point.get(ox, oy);

                buffer.data[offset] = rgba[0];
                buffer.data[offset + 1] = rgba[1];
                buffer.data[offset + 2] = rgba[2];
                buffer.data[offset + 3] = rgba[3];

            }
        }

        var size = $g.texture.size();
        while (size--) {
            $g.texture.data[size] = buffer.data[size];
        }

        return params;

    });


    tgen.function('rotate', {
        angle: 90,
        times: 1,
        type: 1,
        blend: tgen.blendSafe,
    }, function ($g, params) {

        params.type = $g.randByArraySeed(params.type);

        if (params.angle === null) {
            params.angle = $g.randItemByArraySeed(params.angle, [90, 180, 270]);
        } else {
            params.angle = $g.randByArraySeed(params.angle);
        }

        params.times = $g.randByArraySeed(params.times);

        var noop;
        var buffer = new $g.buffer();
        var size = $g.texture.size();
        var width = $g.texture.width;
        var height = $g.texture.height;
        var rad = params.angle * (Math.PI / 180);
        var x, y, rgba, offset, newX, newY;

        var rotateType1 = function () {

            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {

                    newX = Math.ceil(Math.cos(rad) * x - Math.sin(rad) * y);
                    newY = Math.ceil(Math.sin(rad) * x + Math.cos(rad) * y);

                    rgba1 = $g.point.get(x, y);
                    rgba2 = $g.point.get(newX, newY);
                    rgba = $g.blend(params.blend, rgba2, rgba1);

                    offset = $g.texture.offset(x, y);
                    buffer.data[offset] = rgba[0];
                    buffer.data[offset + 1] = rgba[1];
                    buffer.data[offset + 2] = rgba[2];
                    buffer.data[offset + 3] = rgba[3];

                }
            }

            while (size--) {
                $g.texture.data[size] = buffer.data[size];
            }

        };

        var rotateType2 = function () {

            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {

                    newX = Math.ceil(Math.cos(rad) * x - Math.sin(rad) * y);
                    newY = Math.ceil(Math.sin(rad) * x + Math.cos(rad) * y);

                    rgba1 = $g.point.get(x, y);
                    rgba2 = $g.point.get(newX, newY);
                    rgba = $g.blend(params.blend, rgba2, rgba1);

                    offset = $g.texture.offset(newX, newY);

                    buffer.data[offset] = rgba[0];
                    buffer.data[offset + 1] = rgba[1];
                    buffer.data[offset + 2] = rgba[2];
                    buffer.data[offset + 3] = rgba[3];

                }
            }

            while (size--) {
                $g.texture.data[size] = buffer.data[size];
            }

        };

        for (var i = 1; i <= params.times; i++) {
            size = $g.texture.size();
            rad = i * params.angle * (Math.PI / 180);
            noop = params.type === 1 ? rotateType1() : rotateType2();
        }

        return params;

    });

    
    // WIP - equirectangular
    // https://stackoverflow.com/questions/51869432/converting-360-degree-view-to-equirectangular-in-node-js

    tgen.function('equirectangular', {
        layer: null,
    }, function ($g, params) {

        if (params.layer === null) {
            params.layer = $g.layers.length - 1;
        }

        var buffer = new $g.buffer();
        var width = $g.texture.width;
        var height = $g.texture.height;
        var x, y, rgba, offset, theta_deg, phi_deg, r, dx, dy, inputx, inputy;

        var radius = height / 2;
        var PI = Math.PI;
        var centerx = width / 2;
        var centery = height / 2;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {

                theta_deg = 360 - x * 360 / width - 180;
                phi_deg = 180 - y * 180 / height;
                r = Math.sin(phi_deg * PI / 180);
                dx = Math.cos(theta_deg * PI / 180) * r;
                dy = Math.sin(theta_deg * PI / 180) * r;
                inputx = Math.round(dx * radius + centerx);
                inputy = Math.round(dy * radius + centery);

                rgba = $g.point.get(inputx, inputy);

                // 32 32 180 90 1 1.2246467991473532e-16 -1 32 0
                //console.log(x, y, theta_deg, phi_deg, r, dx, dy, inputx, inputy);

                offset = $g.texture.offset(x, y);
                buffer.data[offset] = rgba[0];
                buffer.data[offset + 1] = rgba[1];
                buffer.data[offset + 2] = rgba[2];
                buffer.data[offset + 3] = rgba[3];

            }
        }

        var size = $g.texture.size();
        while (size--) {
            $g.texture.data[size] = buffer.data[size];
        }

        return params;

    });


})(SeamlessTextureGenerator);
(function (tgen) {

    tgen.getGenerator = function (width, height, normalize) {

        var self = this;
        var rendered = []; // rendered effects real params
        var time = {}; // time object for stat
        var layerId = 0; // start layer id
        var wha = null; // width and height average

        // generator object
        var generator = {
            shape: self.shapes,
            effects: Object.keys(self.effects),
            layers: [],
            normalize: normalize ? normalize : 'limitless' // clamped, pingpong, limitless, compress
        };

        var checkSize = function () {

            // default width
            if (width == undefined) {
                width = 256;
            }

            if (width < 1) {
                width = 256;
            }

            if (height < 1) {
                height = 256;
            }

            if (width > 2048) {
                width = 2048;
            }

            if (height > 2048) {
                height = 2048;
            }

            // if undefined height = width
            if (height == undefined) {
                height = width;
            }

            wha = (width + height) / 2;

        };

        checkSize();

        // log
        generator.log = function () {

            if (this.debug && arguments.length > 0) {
                var output = [];
                for (var i = 0; i < arguments.length; i++) {
                    output.push(arguments[i]);
                }
                console.log(output);
            }

        };

        // reset the generator
        generator.clear = function () {

            generator.texture.clear();
            generator.layers = [];
            rendered = [];
            layerId = 0;

            // start time
            time.start = new Date().getTime();

            return generator;

        };

        generator.buffer = function (background) {

            this.data = null;
            this.debug = false;
            this.components = 4;
            this.width = width;
            this.height = height;
            this.wha = (this.width + this.height) / 2;
            this.background = [0, 0, 0, 255];

            if (typeof background == 'object') {
                this.background = background;
            }

            this.pixels = function () {
                return this.width * this.height;
            };

            this.size = function () {
                return this.data.length;
            };

            this.export = function (normalize, texture) {

                //var size = this.size();
                normalize = (normalize !== undefined) ? normalize : generator.normalize;
                texture = texture ? texture : this.data;
                var size = texture.length;
                var data;

                switch (normalize) {

                    case 'limitless':
                        data = new Float32Array(size);
                        while (size--) {
                            data[size] = texture[size];
                        }
                        break;

                    case 'clamped':
                        data = new Uint8ClampedArray(size);
                        while (size--) {
                            data[size] = texture[size];
                        }
                        break;

                    case 'pingpong':
                        data = new Uint8ClampedArray(size);
                        while (size--) {
                            data[size] = generator.calc.pingpong(texture[size], 0, 255);
                        }
                        break;

                    case 'compress':
                        data = new Uint8ClampedArray(size);
                        var min = texture[0];
                        var max = texture[0];
                        var s = size;

                        while (s--) {
                            if (texture[s]) {
                                min = Math.min(min, texture[s]);
                                max = Math.max(max, texture[s]);
                            }
                        }

                        min = Math.floor(min);
                        max = Math.ceil(max);
                        var range = max - min;
                        var percent = 255 / range;

                        while (size) {
                            data[size - 1] = texture[size - 1]; // opacity
                            data[size - 2] = (texture[size - 2] - min) * percent;
                            data[size - 3] = (texture[size - 3] - min) * percent;
                            data[size - 4] = (texture[size - 4] - min) * percent;
                            size = size - 4;
                        }
                        break;

                }

                return data;

            };

            this.clear = function (rgba) {

                this.data = new Float32Array(this.width * this.height * this.components);

                if (rgba == undefined) {
                    rgba = this.background;
                }

                var size = this.size();
                while (size) {
                    this.data[size - 1] = rgba[3];
                    this.data[size - 2] = rgba[2];
                    this.data[size - 3] = rgba[1];
                    this.data[size - 4] = rgba[0];
                    size = size - this.components;
                }

            };

            this.pattern = function (val, max) {

                var smax, sval;
                var s = val / max;

                if (val >= max) {
                    smax = Math.floor(s) * (max);
                    sval = (val - smax);
                    return sval;
                }

                if (val < 0) {
                    smax = Math.ceil(s) * (max);
                    sval = max - Math.abs((val - smax));
                    if (sval >= max) {
                        sval = (sval - max);
                        return sval;
                    }
                    return sval;
                }

            };


            this.offset = function (x, y) {

                x = Math.round(x);
                y = Math.round(y);

                // if x not in the correct size
                if (x < 0 || x >= this.width) {
                    x = this.pattern(x, this.width);
                }

                // if y not in the correct size
                if (y < 0 || y >= this.height) {
                    y = this.pattern(y, this.height);
                }

                return y * this.width * this.components + x * this.components;
            };

            this.set = function (x, y, values) {

                var offset = this.offset(x, y);

                this.data[offset] = values[0];
                this.data[offset + 1] = values[1];
                this.data[offset + 2] = values[2];
                this.data[offset + 3] = values[3];

            };

            this.get = function (x, y) {

                var offset = this.offset(x, y);

                return [
                    this.data[offset],
                    this.data[offset + 1],
                    this.data[offset + 2],
                    this.data[offset + 3]
                ];

            };

            this.alpha = function (type) {

                switch (type) {

                    case 'sphere':

                        while (size) {
                            generator.texture.data[size] = 0.5; //imageData[size];
                            size = size - 4;
                        }

                        break;

                }


            };

            // copy canvas to texture
            this.canvas = function (canvas) {

                var size = this.size();
                var context = canvas.getContext('2d');
                var image = context.getImageData(0, 0, this.width, this.height);
                var imageData = image.data;

                while (size--) {
                    generator.texture.data[size] = imageData[size];
                }

            };

            if (this.data === null) {
                this.clear();
            }

        };

        // texture object
        generator.texture = new generator.buffer();


        generator.layerCopy = function (layerId) {

            var data = [];
            var layer = this.layers[layerId];
            var length = layer.length;

            while (length--) {
                data[length] = layer[length];
            }

            return data;

        };


        // merge params objects
        var mergeParams = function (obj1, obj2) {

            var obj3 = {};
            var attrname;

            for (attrname in obj1) {
                obj3[attrname] = obj1[attrname];
            }

            for (attrname in obj2) {
                obj3[attrname] = obj2[attrname];
            }

            return obj3;

        };

        generator.clone = function (destination, source) {
            for (var property in source) {
                if (typeof source[property] === "object" && source[property] !== null && destination[property]) {
                    this.clone(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
        };

        generator.minMaxNormalize = function (min, max) {
            return {
                min: Math.min(min, max),
                max: Math.max(min, max)
            };
        };

        // random int min max
        generator.randInt = function (min, max, even) {

            var mul;
            var norm = generator.minMaxNormalize(min, max);

            min = norm.min;
            max = norm.max;

            if (even === true) {
                min = Math.round(min / 2);
                max = Math.round(max / 2);
                mul = 2;
            } else {
                mul = 1;
            }

            return mul * (Math.floor(Math.random() * (max - min + 1)) + min);

        };

        // random int min max by seed
        generator.randIntSeed = function (min, max, even) {

            var norm = generator.minMaxNormalize(min, max);
            min = norm.min;
            max = norm.max;

            if (even === true) {
                min = Math.round(min / 2);
                max = Math.round(max / 2);
                mul = 2;
            } else {
                mul = 1;
            }

            return mul * (Math.floor(generator.calc.randomseed() * (max - min + 1)) + min);

        };

        // random real min max
        generator.randReal = function (min, max) {
            var norm = generator.minMaxNormalize(min, max);
            min = norm.min;
            max = norm.max;
            return Math.random() * (max - min) + min;
        };

        // random real min max by seed
        generator.randRealSeed = function (min, max) {
            var norm = generator.minMaxNormalize(min, max);
            min = norm.min;
            max = norm.max;
            return generator.calc.randomseed() * (max - min) + min;
        };

        generator.randByArray = function (data, real) {

            if (data === undefined || typeof data !== "object" || data[0] === undefined) {
                generator.calc.seed++;
                return data;
            }

            if (real !== undefined) {
                data = generator.randReal(data[0], data[1]);
            } else {
                data = generator.randInt(data[0], data[1]);
            }

            return data;

        };

        generator.randByArraySeed = function (data, real, even) {

            if (data === undefined || data === null || typeof data !== "object" || data[0] === undefined) {
                generator.calc.seed++;
                return data;
            }

            if (real !== undefined) {
                data = generator.randRealSeed(data[0], data[1]);
            } else {
                data = generator.randIntSeed(data[0], data[1], even);
            }

            return data;

        };

        // get random int by array or defaults
        generator.randIntByArraySeed = function (data, defaults, even) {

            if (data === undefined || data === null || data === 'random') {
                data = defaults;
            }

            if (typeof data !== "object") {
                generator.calc.seed++;
                return data;
            }

            data = generator.randIntSeed(data[0], data[1], even);

            return data;

        };

        // get random real by array or defaults
        generator.randRealByArraySeed = function (data, defaults) {

            if (data === undefined || data === null || data === 'random') {
                data = defaults;
            }

            if (typeof data !== "object") {
                generator.calc.seed++;
                return data;
            }

            data = generator.randRealSeed(data[0], data[1]);

            return data;

        };


        // get random array item
        generator.randItemSeed = function (array) {

            if (typeof array !== "object" || array[0] === undefined) {
                generator.calc.seed++;
                return array;
            }

            var count = array.length;
            var index = generator.randIntSeed(0, count - 1);
            return array[index];

        };

        generator.randItemByArraySeed = function (current, array) {

            if (current !== undefined && current !== null && current !== 'random') {
                generator.calc.seed++;
                return current;
            }

            var count = array.length;
            var index = generator.randIntSeed(0, count - 1);

            return array[index];

        };

        // get random property from object
        generator.randProperty = function (current, obj) {

            if (current !== undefined && current !== null && current !== 'random') {
                generator.calc.seed++;
                return current;
            }

            var keys = Object.keys(obj);
            var key = generator.randByArraySeed([0, keys.length - 1]);

            return keys[key];

        };

        // set rgba color - if the channel is an array then random
        generator.rgba = function (rgba, alpha) {

            if (rgba === 'random' || rgba === undefined || rgba === null) {
                rgba = [[0, 255], [0, 255], [0, 255], 255];
            }

            if (rgba === 'randomalpha') {
                rgba = [[0, 255], [0, 255], [0, 255], [128, 255]];
            }

            if (rgba[0] === undefined || rgba[0] === null) {
                rgba[0] = 0;
            }

            if (rgba[1] === undefined || rgba[1] === null) {
                rgba[1] = 0;
            }

            if (rgba[2] === undefined || rgba[2] === null) {
                rgba[2] = 0;
            }

            if (rgba[3] === undefined || rgba[3] === null) {
                rgba[3] = 1;
            }

            rgba[0] = generator.randByArraySeed(rgba[0]);
            rgba[1] = generator.randByArraySeed(rgba[1]);
            rgba[2] = generator.randByArraySeed(rgba[2]);
            rgba[3] = generator.randByArraySeed(rgba[3]);

            // opacity fallback
            // TODO remove after update the database
            if (rgba[3] % 1 !== 0) {
                rgba[3] = Math.round(rgba[3] * 255);
            }

            if (rgba[3] == 1) {
                rgba[3] = 255;
            }

            return rgba;

        };

        // effect parameters fill with default values
        var paramsCheck = function (params) {

            params.count = generator.randByArraySeed(params.count);
            params.level = generator.randByArraySeed(params.level);
            params.opacity = generator.randByArraySeed(params.opacity);

            // set blend
            if (params.blend !== undefined) {

                // random blend
                params.blend = generator.randProperty(params.blend, self.blends);

                // random blend by array
                params.blend = generator.randItemSeed(params.blend);
                generator.point.blend = params.blend;

            } else {

                generator.point.blend = '';

            }

            // set rgba
            params.rgba = generator.rgba(params.rgb ? params.rgb : params.rgba);

            if (params.rgba) {
                generator.point.rgba = [params.rgba[0], params.rgba[1], params.rgba[2], params.rgba[3]];
            }

            // remove undefined
            Object.keys(params).forEach(function (key) {
                if (params[key] === undefined) {
                    delete params[key];
                }
            });

            return params;

        };


        // store generated texture params for save
        var store = function (layerId, type, params) {

            rendered.push([layerId, type, params]);

        };


        // find closest item in array
        generator.findClosestIndex = function (array, start, step) {

            for (var i = start; i >= 0 && i <= array.length - 1; i += step)
                if (array[i]) {
                    return i;
                }

            return array.length - 1;

        };

        // calculations
        generator.calc = {

            seed: undefined,
            pi: 3.1415927,

            luminance: function (color) {
                //return (0.299 * color[0]) + (0.587 * color[1]) + (0.114 * color[2]);
                return (0.21 * color[0]) + (0.72 * color[1]) + (0.07 * color[2]);
            },

            randomseed: function (seed) {

                if (this.seed === undefined) {
                    this.seed = generator.randInt(1, Number.MAX_SAFE_INTEGER);
                }

                if (seed !== undefined) {
                    this.seed = seed;
                }

                var x = Math.sin(this.seed++) * 10000;

                return x - Math.floor(x);

            },

            normalize1: function (value) {

                return generator.calc.normalize(value, 0, 1);

            },

            normalize255: function (value) {

                return generator.calc.normalize(value, 0, 255);

            },

            normalize: function (value, min, max) {

                if (value > max) {
                    return max;
                }

                if (value < min) {
                    return min;
                }

                return value;

            },

            pingpong: function (value, min, max) {

                var range = max - min;
                var range2 = range + range;

                value = value - (Math.floor(value / range2) * range2);
                value = range - Math.abs(value - range);

                return value;

            },

            interpolate: {

                linear: function (a, b, x) {

                    return a * (1 - x) + b * x;

                },

                cosine: function (a, b, x) {

                    var ft = x * generator.calc.pi;
                    var f = (1 - Math.cos(ft)) * 0.5;

                    return a * (1 - f) + b * f;

                },

                catmullrom: function (v0, v1, v2, v3, x, distance) {

                    var xx = x / distance;
                    var P = (v3 - v2) - (v0 - v1);
                    var Q = (v0 - v1) - P;
                    var R = v2 - v0;
                    var t = (P * xx * xx * xx) + (Q * xx * xx) + (R * xx) + v1;

                    if (t < 0) t = 0;
                    if (t > 1) t = 1;

                    return t;

                }

            }

        };


        generator.colormap = {

            data: null,
            size: 255,

            init: function (colormap, size, callback) {

                this.data = null;
                this.size = (size == undefined) ? width : size;

                if (colormap == undefined || colormap == null) {
                    return colormap;
                }

                // colormap random by arrays
                if (typeof colormap == 'object') {

                    if (typeof colormap[0] == 'object') {

                        // by items rgba
                        for (var key in colormap) {
                            var item = colormap[key];
                            item.rgba = generator.rgba(item.rgba);
                            colormap[key] = item;
                        }

                    } else {
                        // by name
                        colormap = generator.randItemSeed(colormap);
                    }

                }

                // random
                if (colormap === 'random') {

                    var count = generator.randIntSeed(1, 4);
                    colormap = [];

                    for (var i = 0; i <= count; i++) {
                        colormap[i] = {
                            percent: parseInt((i / count) * 100),
                            rgba: [generator.randIntSeed(0, 255), generator.randIntSeed(0, 255), generator.randIntSeed(0, 255), 255]
                        };
                    }

                }

                // callback for store real params
                if (typeof callback == 'function') {
                    callback(colormap);
                }

                if (typeof colormap == 'string') {

                    var reverse = false;

                    if (colormap.charAt(0) == '!') {
                        colormap = colormap.substring(1);
                        reverse = true;
                    }

                    if (typeof self.colormaps[colormap] == "function") {
                        var items = self.colormaps[colormap](size);
                        this.data = this.render(items, reverse);
                    }

                }

                if (typeof colormap == 'object') {
                    this.data = this.render(colormap);
                }

            },

            render: function (items, reverse) {

                var colormap = [];

                for (var p = 0; p < items.length - 1; p++) {

                    var current = items[p];
                    var next = items[p + 1];
                    var currentIndex = Math.round(this.size * (current.percent / 100));
                    var nextIndex = Math.round(this.size * (next.percent / 100));

                    for (var i = currentIndex; i <= nextIndex; i++) {

                        var idx = reverse ? this.size - i : i;

                        colormap[idx] = [
                            current.rgba[0] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[0] - current.rgba[0]),
                            current.rgba[1] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[1] - current.rgba[1]),
                            current.rgba[2] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[2] - current.rgba[2]),
                            current.rgba[3] + (i - currentIndex) / (nextIndex - currentIndex) * (next.rgba[3] - current.rgba[3])
                        ];
                    }

                }

                return colormap;

            },

            get: function (index, rgba) {

                var indexNew = generator.calc.pingpong(parseInt(index), 0, this.size);
                var color = this.data[indexNew];

                // save original alpha
                if (rgba !== undefined) {
                    color[3] = rgba[3];
                }

                return color;

            }

        };

        generator.wrapx = function (x) {
            return x & (width - 1);
        };

        generator.wrapy = function (y) {
            return y & (height - 1);
        };

        generator.blend = function (type, rgba1, rgba2) {
            return self.blends[type](generator, rgba1, rgba2);
        };

        // put a point, the magic is here
        generator.point = {

            rgba: [],
            mixed: [],
            blend: 'opacity',

            colorize: function (rgba1, rgba2, level) {

                if (level === undefined) {
                    level = 50;
                }

                return [
                    rgba1[0] - (rgba1[0] - rgba2[0]) * (level / 100),
                    rgba1[1] - (rgba1[1] - rgba2[1]) * (level / 100),
                    rgba1[2] - (rgba1[2] - rgba2[2]) * (level / 100),
                    rgba2[3] ? rgba2[3] : 255
                ];

            },

            opacity: function (input, current) {

                // if no opacity then return original values with current alpha
                if (input[3] == 255) {
                    input[3] = current[3]; // set current alpha
                    return input;
                }

                if (current[3] == 0) {
                    return current;
                }

                var io = input[3] / 255;

                // calc opacity
                return [
                    input[0] * io + (current[0]) * (1 - io),
                    input[1] * io + (current[1]) * (1 - io),
                    input[2] * io + (current[2]) * (1 - io),
                    current[3]
                ];

            },

            // set the pixel
            set: function (x, y) {

                var current = generator.texture.get(x, y);

                // calculate blend
                if (self.blends[this.blend] !== undefined) {
                    this.rgba = self.blends[this.blend](generator, current, this.rgba);
                    this.mixed = this.opacity(this.rgba, current);
                } else {
                    this.mixed = this.rgba;
                }


                switch (generator.normalize) {

                    case 'clamped':
                        this.mixed[0] = Math.max(0, Math.min(255, this.mixed[0]));
                        this.mixed[1] = Math.max(0, Math.min(255, this.mixed[1]));
                        this.mixed[2] = Math.max(0, Math.min(255, this.mixed[2]));
                        this.mixed[3] = Math.max(0, Math.min(255, this.mixed[3]));
                        break;

                    case 'pingpong':
                        this.mixed[0] = generator.calc.pingpong(this.mixed[0], 0, 255);
                        this.mixed[1] = generator.calc.pingpong(this.mixed[1], 0, 255);
                        this.mixed[2] = generator.calc.pingpong(this.mixed[2], 0, 255);
                        this.mixed[3] = generator.calc.pingpong(this.mixed[3], 0, 255);
                        break;

                    default:
                        // do nothing :)
                        break;
                }

                generator.texture.set(x, y, this.mixed);

            },

            // get the pixel
            get: function (x, y) {

                return generator.texture.get(x, y);

            }

        };

        // read and modify all pixel by callback function
        generator.walk = function (func) {

            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {

                    var color = generator.point.get(x, y);
                    color = func(color, x, y);
                    generator.point.rgba = color;
                    generator.point.set(x, y);

                }
            }

        };

        // for percent calculations
        generator.percent = function (c, max) {
            return parseInt((c / 100) * max, 10);
        };

        generator.percentX = function (c) {
            return parseInt((c / 100) * width, 10);
        };

        generator.percentY = function (c) {
            return parseInt((c / 100) * height, 10);
        };

        generator.percentXY = function (c) {
            return parseInt((c / 100) * wha, 10);
        };

        generator.percentRGBA = function (rgbFrom, rgbTo, percent) {

            rgbTo[0] = (rgbTo[0] === null) ? rgbFrom[0] : rgbTo[0];
            rgbTo[1] = (rgbTo[1] === null) ? rgbFrom[1] : rgbTo[1];
            rgbTo[2] = (rgbTo[2] === null) ? rgbFrom[2] : rgbTo[2];
            rgbTo[3] = (rgbTo[3] === null) ? rgbFrom[3] : rgbTo[3];

            return [
                Math.round(rgbFrom[0] + ((rgbTo[0] - rgbFrom[0]) * percent)),
                Math.round(rgbFrom[1] + ((rgbTo[1] - rgbFrom[1]) * percent)),
                Math.round(rgbFrom[2] + ((rgbTo[2] - rgbFrom[2]) * percent)),
                Math.round(rgbFrom[3] + ((rgbTo[3] - rgbFrom[3]) * percent)),
            ];

        };

        generator.xysize = function (i, params) {

            var x, y, size;

            if (params.elements != undefined) {

                // x and y values from params elements array
                x = params.elements[i].x;
                y = params.elements[i].y;
                size = params.elements[i].size;

            } else if (params.origin == 'random') {

                // random x and y
                x = generator.randIntSeed(0, width);
                y = generator.randIntSeed(0, height);
                size = generator.randByArraySeed(params.size);

            } else {

                // centered x and y, only size random
                x = params.origin[0];
                y = params.origin[1];
                size = generator.randByArraySeed(params.size);

            }

            return {
                x: x,
                y: y,
                size: size
            };

        };


        // copy texture to image
        generator.toContext = function (context, texture) {


            var image = context.createImageData(width, height);
            var data = image.data;
            var length = texture.length;

            for (var i = 0; i < length; i += 4) {
                data[i] = texture[i];
                data[i + 1] = texture[i + 1];
                data[i + 2] = texture[i + 2];
                data[i + 3] = texture[i + 3];
            }

            return image;

        };

        // copy image to canvas
        generator.toCanvas = function (texture) {

            if (texture === undefined || texture === null) {
                texture = generator.texture.data;
            }

            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext('2d');
            var imageData = this.toContext(context, texture);
            context.putImageData(imageData, 0, 0);

            return canvas;

        };

        // get canvas
        generator.getCanvas = function (func) {

            if (func) {
                func(this.toCanvas(this.layers[this.layers.length - 1]));
            }

            return this;

        };

        // get phases (layers)
        generator.getPhases = function (func) {

            if (func) {

                var phases = [];
                var length = generator.layers.length;

                for (var i = 0; i < length; i++) {
                    phases.push(this.toCanvas(this.layers[i]));
                }

                func(phases);
            }

            return this;

        };

        // stat
        generator.stat = function (func) {

            time.stop = new Date().getTime();
            time.elapsed = (time.stop - time.start) / 1000;

            if (func) {
                func(time);
            }

            return this;

        };


        // save to localstorage
        generator.history = {

            available: function () {

                try {
                    return window && 'localStorage' in window && window.localStorage !== null && window.localStorage !== undefined;
                } catch (e) {
                    return false;
                }

            },

            list: function () {

                if (!this.available()) {
                    return [];
                }

                return JSON.parse(window.localStorage.getItem(self.config.historyName)) || [];

            },

            last: function () {

                if (!this.available()) {
                    return [];
                }

                return self.config.historyList[self.config.historyList.length - 1];

            },

            get: function (index) {

                if (!this.available()) {
                    return [];
                }

                if (!self.config.historyList[index]) {
                    return null;
                }

                return self.config.historyList[index];

            },

            add: function (name) {

                if (!self.config.historyLast) {
                    return;
                }

                if (!this.available()) {
                    return [];
                }

                var params = generator.params(name);

                self.config.historyList = JSON.parse(window.localStorage.getItem(self.config.historyName)) || [];

                if (self.config.historyList.length >= self.config.historyLast) {
                    self.config.historyList.shift();
                }

                self.config.historyList.push(params);

                window.localStorage.setItem(self.config.historyName, JSON.stringify(self.config.historyList));

            }

        };


        generator.params = function (name) {

            if (name == undefined) {

                var d = new Date();
                name = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' l' + generator.layers.length + ' i' + rendered.length;

            }

            return {
                "name": name,
                "version": self.version,
                "width": width,
                "height": height,
                "normalize": generator.normalize,
                "items": rendered
            };

        };

        // parse params
        generator.render = function (config, noclear) {

            this.debug = (config.debug === true) ? true : false;

            // call event
            generator.event('beforeRender', config);

            // store current layer            
            var layerId = 0;
            var currentId = 0;
            var effect, values;

            // set canvas size;
            if (config.width != undefined) {
                width = config.width;
            }

            if (config.height != undefined) {
                height = config.height;
            }

            if (config.normalize != undefined) {
                generator.normalize = config.normalize;
            } else {
                generator.normalize = 'limitless';
            }

            checkSize();
            generator.texture = new generator.buffer(config.background);

            if (noclear != true) {
                generator.clear();
            }

            // import preset items
            if (config.preset && config.preset.name) {

                var name = config.preset.name;

                if (config.preset.name === 'random') {
                    name = generator.randItemByArraySeed(null, Object.keys(tgen.presets));
                }

                if (typeof config.preset.name === 'object') {
                    name = generator.randItemByArraySeed(null, config.preset.name);
                }

                if (name) {

                    var key;
                    var items = JSON.parse(JSON.stringify(tgen.presets[name].items));

                    if (config.preset.seed) {

                        for (key in items) {
                            if (items[key][2]) {
                                items[key][2].seed = config.preset.seed;
                            }
                        }

                    }

                    for (key in config.items) {
                        items.push(config.items[key]);
                    }

                    config.items = items;

                }

            }

            // items parse
            for (var index in config.items) {

                layerId = config.items[index][0];
                effect = config.items[index][1];
                values = config.items[index][2] !== undefined ? config.items[index][2] : {};

                if (layerId === null) {
                    layerId = effect === 'copy' ? currentId + 1 : currentId;
                }

                if (config.seed) {
                    values.seed = config.seed * index;
                }

                if (effect == "random") {
                    effect = generator.randProperty(generator.defaults);
                }

                // if random effect
                if (typeof effect == "object") {
                    effect = generator.randItemSeed(effect);
                }

                if (currentId != layerId) {
                    if (generator.layers[layerId] != undefined) {
                        generator.texture.data = generator.layers[layerId];
                    } else {
                        generator.texture.clear();
                    }
                    currentId = layerId;
                }

                if (generator[effect] != undefined) {
                    generator[effect](values);
                } else if (self.effects[effect] != undefined) {
                    generator.do(effect, values, layerId);
                } else {
                    console.warn('undefined effect: ' + effect);
                }

                generator.layers[layerId] = generator.texture.export();

            }

            // call event
            generator.event('afterRender', generator.params());

            // save to localstorage
            generator.history.add();

            return this;

        };


        // call events
        generator.event = function (eventName, data) {

            for (var key in self.events[eventName]) {
                var event = self.events[eventName][key];
                if (typeof event == "function") {
                    event(generator, data);
                }
            }

        };

        generator.do = function (name, params, layerId) {

            var originalparams = params;

            if (params === undefined) {
                params = mergeParams({}, self.defaults[name]);
            } else if (typeof params == 'object') {
                params = mergeParams(self.defaults[name], params);
            }

            // setup random seed				
            params.seed = (params.seed !== undefined && params.seed !== null) ? params.seed : [1, Number.MAX_SAFE_INTEGER];
            params.seed = generator.randByArray(params.seed);

            // init random seed		
            generator.calc.randomseed(params.seed);

            // check params
            params = paramsCheck(params);

            // call event
            generator.event('beforeEffect', {
                layer: layerId,
                name: name,
                params: params
            });

            // run effect
            if (typeof self.effects[name] === 'function') {
                params = self.effects[name](generator, params);
            } else {
                console.warn('effect not callable: ' + name);
            }

            if (params === undefined) {
                params = originalparams;
            }

            // call event
            generator.event('afterEffect', {
                layer: layerId,
                name: name,
                params: params
            });

            if (params && params.store !== false) {
                store(layerId, name, params);
            }

            return generator;

        };


        // generator.preset = function (name, seed) {

        //     if (!name || !self.presets[name]) {
        //         console.warn('preset not found:'.name);
        //         return;
        //     }

        //     var params = mergeParams({}, self.presets[name]);
        //     params.width = self.width;
        //     params.height = self.height;            

        //     if (seed) {

        //         for (var index in params.items) {

        //             var layer = params.items[index];

        //             seed++;

        //             if (layer[2]) {
        //                 params.items[index][2].seed = seed;
        //             } else {
        //                 params.items[index][2] = {
        //                     seed: seed
        //                 };
        //             }
        //         }

        //     }

        //     var texture = generator.render(params);

        //     return texture;

        // };

        return generator;

    };


})(SeamlessTextureGenerator);
(function(tgen) {

    // rect
    tgen.shape('rect', function($g, x, y, sizeX, sizeY, centered) {

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
    tgen.shape('circle', function($g, x1, y1, radius, centered) {

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
    tgen.shape('line', function($g, x1, y1, x2, y2) {

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
    tgen.shape('colorLine', function($g, x1, y1, x2, y2, colorMap) {

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
    tgen.shape('sphere', function($g, x1, y1, radius, centered, rgba, dynamicopacity) {

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
    tgen.shape('pyramid', function($g, x, y, sizeX, sizeY, centered, rgba, dynamicopacity) {

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
(function(tgen) {

    // pattern test
    tgen.effect('test-pattern', {}, function($g, params) {

        var width = $g.texture.width;
        var height = $g.texture.height;
        var s;
    
        $g.point.blend = 'opacity';
                
        // clear texture
        $g.texture.clear();

        $g.point.rgba = [255, 255, 155, 255];
        $g.shape.rect($g, 1, 1, width - 2, height - 2);

        s = 20;
        $g.point.rgba = [0, 150, 0, 153];
        $g.shape.rect($g, 2, 2, s, s);
        $g.shape.rect($g, width - s - 2, 2, s, s);
        $g.shape.rect($g, 2, height - 2 - s, s, s);
        $g.shape.rect($g, width - 2 - s, height - 2 - s, s, s);

        $g.point.rgba = [20, 20, 10, 51];
        $g.shape.rect($g, width / 2, height / 2, 178, 178, true);

        $g.point.rgba = [10, 20, 210, 178];
        $g.shape.rect($g, width - 5, height - 5, 10, 10);

        s = 20;
        $g.point.rgba = [10, 10, 210, 250];
        $g.shape.line($g, s, s, width - s, height - s);
        $g.shape.line($g, width - s, s, s, height - s);
        $g.shape.line($g, 0, height / 2, width, height / 2);
        $g.shape.line($g, width / 2, 0, width / 2, height);
        
        $g.point.rgba = [255, 55, 55, 128];
        $g.shape.rect($g, 10, 10, width - 20, height - 20);

        $g.point.rgba = [0, 0, 255, 76];
        $g.shape.rect($g, width - 2, height - 2, 4, 4);

        $g.point.rgba = [255, 255, 255, 255];
        $g.point.set(0, 0);
        $g.point.set(width - 1, 0);
        $g.point.set(0, height - 1);
        $g.point.set(width - 1, height - 1);

        $g.point.rgba = [25, 25, 0, 51];
        $g.shape.circle($g, width / 4, height / 4, width / 4, true);

        $g.point.rgba = [255, 255, 0, 25];
        $g.shape.circle($g, width, height, width, true);

        $g.shape.sphere($g, width / 4, height - height / 4, width / 2, true, [255, 0, 0, 0], true);
        $g.shape.sphere($g, width / 2, height - height / 4, width / 2, true, [0, 255, 0, 0], true);
        $g.shape.sphere($g, width - width / 4, height - height / 4, width / 2, true, [255, 255, 255, 0], true);
        $g.shape.pyramid($g, width - width / 4, height / 4, width / 2, height / 2, true, [0, 0, 0, 255], true);

        $g.do('brightness', { "adjust": 50 });
        $g.do('vibrance', { "adjust": 100 });
        $g.do('contrast', { "adjust": 20 });

        return params;

    });


    // all effect test with custom blends
    tgen.effect('test-all', {}, function($g, params) {

        $g.normalize = 'limitless';

        var effectName;
        var layer = 0;
        var skipped = ['test-all', 'test-pattern', 'copy', 'merge', 'mergeall'];

        for (var key in $g.effects) {

            effectName = $g.effects[key];

            if (skipped.indexOf(effectName) < 0) {

                $g.do(effectName);
                $g.layers[layer++] = $g.texture.export();

            }

        }

        return params;

    });


})(SeamlessTextureGenerator);
(function (fn) {

    var tgen = window[fn];

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

            var h = parseInt(Math.sqrt(radius * radius - x * x), 10);

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

        for (var i = 0; i < d; i++) {
            x = x1 + (dx * i);
            y = y1 + (dy * i);
            $g.point.set(x, y)
        }

    });

    // sphere
    tgen.shape('sphere', function ($g, x1, y1, radius, centered, rgba, dynamicopacity) {

        if (centered == undefined) {
            x1 = x1 + radius;
            y1 = y1 + radius;
        }

        for (var x = -radius; x < radius; x++) {

            var h = parseInt(Math.sqrt(radius * radius - x * x), 10);

            for (var y = -h; y < h; y++) {

                var c = Math.min(255, Math.max(0, (255 - 255 * Math.sqrt((y * y) + (x * x)) / (radius / 2))));
                if (c > 0) {

                    if (dynamicopacity) {
                        var o = (c / 255);
                    } else {
                        var o = rgba[3];
                    }

                    $g.point.rgba = [(rgba[0] / 255) * c, (rgba[1] / 255) * c, (rgba[2] / 255) * c, o];
                    $g.point.set(x1 + x, y1 + y);
                }

            }
        }

    });

    // pyramid
    tgen.shape('pyramid', function ($g, x, y, sizeX, sizeY, centered, rgba, dynamicopacity) {

        var halfX = parseInt(sizeX / 2, 10);
        var halfY = parseInt(sizeY / 2, 10);

        if (centered != true) {
            x = x + halfX;
            y = y + halfY;
        }

        for (var ix = -halfX; ix < halfX; ix++) {
            for (var iy = -halfY; iy < halfY; iy++) {

                var cx = (0.25 - Math.abs(ix / sizeX)) * 255;
                var cy = (0.25 - Math.abs(iy / sizeY)) * 255;
                var c = cx + cy;

                if (dynamicopacity) {
                    var o = (c / 255);
                } else {
                    var o = rgba[3];
                }

                if (c > 0) {
                    $g.point.rgba = [(rgba[0] / 255) * c, (rgba[1] / 255) * c, (rgba[2] / 255) * c, o];
                    $g.point.set(x + ix, y + iy);
                }

            }
        }

    });


})('tgen');
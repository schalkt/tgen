module.exports = function (tgen) {

    // pyramid
    tgen.shape(
        "pyramid",
        function ($g, x, y, sizeX, sizeY, centered, rgba, dynamicopacity) {
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

                        $g.point.rgba = [
                            (rgba[0] / 255) * c,
                            (rgba[1] / 255) * c,
                            (rgba[2] / 255) * c,
                            o,
                        ];
                        $g.point.set(x + ix, y + iy);
                    }
                }
            }
        }
    );

};
module.exports = function (tgen) {

    // rect
    tgen.shape("rect", function ($g, x, y, sizeX, sizeY, centered) {
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

};
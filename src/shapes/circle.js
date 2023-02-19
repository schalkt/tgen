module.exports = function (tgen) {

    // circle
    tgen.shape("circle", function ($g, x1, y1, radius, centered) {
        
        if (centered == undefined) {
            x1 = x1 + radius;
            y1 = y1 + radius;
        }

        let x, y, h;

        for (x = -radius; x < radius; x++) {

            h = Math.round(Math.sqrt(radius * radius - x * x));

            for (y = -h; y < h; y++) {
                $g.point.set(x1 + x, y1 + y);
            }

        }
    });

};
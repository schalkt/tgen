module.exports = function (tgen) {

    // colorLine
    tgen.shape(
        "colorLine",
        function ($g, x1, y1, x2, y2, colorMap, weight, fadeinout) {
            var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            var dx = (x2 - x1) / d;
            var dy = (y2 - y1) / d;
            var x = 0;
            var y = 0;
            var percent, index, w, i;
            var colorMapSize = colorMap.length;
            var alpha;

            weight = weight ? weight : 1;

            for (i = 0; i < d; i++) {
                x = x1 + dx * i;
                y = y1 + dy * i;

                percent = i / d;

                index = parseInt(colorMapSize * percent);
                $g.point.rgba = colorMap[index];

                if (fadeinout) {
                    alpha = 255 * Math.sin(percent * $g.calc.pi);
                    $g.point.rgba[3] = alpha; // * $g.easing['InOutQuad'](percent);
                }

                for (w = 1; w <= weight; w++) {
                    $g.point.set(x, y + w);
                }
            }
        }
    );

};
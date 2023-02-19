module.exports = function (tgen) {

    // line
    tgen.shape("line", function ($g, x1, y1, x2, y2) {
        var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var dx = (x2 - x1) / d;
        var dy = (y2 - y1) / d;
        var x = 0;
        var y = 0;
        var i;

        for (i = 0; i < d; i++) {
            x = x1 + dx * i;
            y = y1 + dy * i;
            $g.point.set(x, y);
        }
    });

};
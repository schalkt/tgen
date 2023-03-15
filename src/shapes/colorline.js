module.exports = function (tgen) {
  // colorLine
  tgen.shape(
    "colorLine",
    function ($g, x1, y1, x2, y2, colorMap, weight, fadeinout) {
      const colorMapSize = colorMap.length;
      const d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      const dx = (x2 - x1) / d;
      const dy = (y2 - y1) / d;

      let percent, index, w, i, alpha;
      let x = 0;
      let y = 0;

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

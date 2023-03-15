module.exports = function (tgen) {
  // sphere
  tgen.shape(
    "sphere",
    function ($g, x1, y1, radius, centered, rgba, dynamicopacity) {
      let c, o, h, x, y;

      if (centered == undefined) {
        x1 = x1 + radius;
        y1 = y1 + radius;
      }

      for (x = -radius; x < radius; x++) {
        h = parseInt(Math.sqrt(radius * radius - x * x), 10);

        for (y = -h; y < h; y++) {
          c =
            Math.min(
              255,
              Math.max(0, 255 - (255 * Math.sqrt(y * y + x * x)) / (radius / 2))
            ) / 255;

          if (c > 0) {
            o = dynamicopacity ? c * 255 : rgba[3];
            $g.point.rgba = [rgba[0] * c, rgba[1] * c, rgba[2] * c, o];
            $g.point.set(x1 + x, y1 + y);
          }
        }
      }
    }
  );
};

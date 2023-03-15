module.exports = function (tgen) {
  // waves
  tgen.effect(
    "waves",
    {
      seed: null,
      blend: tgen.blendSafe(),
      rgba: "randomalpha",
      level: [1, 100],
      xsines: [1, 14],
      ysines: [1, 14],
    },
    function ($g, params) {
      params.xsines = $g.randIntByArraySeed(params.xsines, [1, 16]);
      params.ysines = $g.randIntByArraySeed(params.ysines, [1, 16]);

      let x, y, c;

      for (x = 0; x < $g.texture.width; x++) {
        for (y = 0; y < $g.texture.height; y++) {
          c =
            127 +
            63.5 *
              Math.sin(
                (x / $g.texture.width) * params.xsines * 2 * $g.calc.pi
              ) +
            63.5 *
              Math.sin(
                (y / $g.texture.height) * params.ysines * 2 * $g.calc.pi
              );
          if (typeof params.channels == "object") {
            $g.point.rgba = [
              params.channels[0] ? c : 0,
              params.channels[1] ? c : 0,
              params.channels[2] ? c : 0,
              params.channels[3] ? c : 0,
            ];
          } else {
            $g.point.rgba = $g.point.colorize(
              [c, c, c, 255],
              params.rgba,
              params.level
            );
          }

          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

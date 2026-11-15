module.exports = function (tgen) {
  // crosshatch
  tgen.effect(
    "crosshatch",
    {
      seed: null,
      blend: tgen.blendSafe(),
      rgba: "randomalpha",
      level: [1, 100],
      xadjust: "random",
      yadjust: "random",
    },
    function ($g, params) {
      params.xadjust = $g.randRealByArraySeed(params.xadjust, [0.1, 121]);
      params.yadjust = $g.randRealByArraySeed(params.yadjust, [0.1, 121]);

      // sin(x * x / a) repeats every `size` pixels only when a = size / (PI * k)
      // for a whole k with k * size even, so snap to the nearest such value
      const seamless = function (a, size) {
        if ($g.legacy) {
          return a;
        }

        const step = size % 2 ? 2 : 1;
        const k = Math.max(step, Math.round(size / (Math.PI * a) / step) * step);

        return size / (Math.PI * k);
      };
      const xadjust = seamless(params.xadjust, $g.texture.width);
      const yadjust = seamless(params.yadjust, $g.texture.height);

      let x, y, c;

      for (x = 0; x < $g.texture.width; x++) {
        for (y = 0; y < $g.texture.height; y++) {
          c =
            127 +
            63.5 * Math.sin((x * x) / xadjust) +
            63.5 * Math.cos((y * y) / yadjust);
          $g.point.rgba = $g.point.colorize(
            [c, c, c, 255],
            params.rgba,
            params.level
          );
          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

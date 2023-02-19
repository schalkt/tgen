module.exports = function (tgen) {
  // threshold
  tgen.filter(
    "threshold",
    {
      seed: null,
      adjust: [64, 128],
    },
    function ($g, params) {
      params.adjust = $g.randByArraySeed(params.adjust);

      $g.walk(function (color) {
        let t =
          0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2] <=
          params.adjust
            ? 0
            : 255;
        return [t, t, t, color[3]];
      });

      return params;
    }
  );
};

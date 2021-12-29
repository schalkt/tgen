module.exports = function (tgen) {
  // opacity
  tgen.filter(
    "opacity",
    {
      seed: null,
      adjust: [32, 192],
    },
    function ($g, params) {
      params.adjust = $g.randByArraySeed(params.adjust);

      $g.walk(function (color) {
        color[3] = params.adjust;
        return color;
      });

      return params;
    }
  );
};

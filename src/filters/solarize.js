module.exports = function (tgen) {
  // solarize - invert the channels above the threshold
  tgen.filter(
    "solarize",
    {
      seed: null,
      adjust: [96, 192],
    },
    function ($g, params) {
      params.adjust = $g.randByArraySeed(params.adjust);

      $g.walk(function (color) {
        return [
          color[0] > params.adjust ? 255 - color[0] : color[0],
          color[1] > params.adjust ? 255 - color[1] : color[1],
          color[2] > params.adjust ? 255 - color[2] : color[2],
          color[3],
        ];
      });

      return params;
    }
  );
};

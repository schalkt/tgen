module.exports = function (tgen) {
  // posterize
  tgen.filter(
    "posterize",
    {
      seed: null,
      levels: [2, 8],
    },
    function ($g, params) {
      params.levels = Math.max(2, $g.randByArraySeed(params.levels));

      const step = 255 / (params.levels - 1);

      $g.walk(function (color) {
        return [
          Math.round(color[0] / step) * step,
          Math.round(color[1] / step) * step,
          Math.round(color[2] / step) * step,
          color[3],
        ];
      });

      return params;
    }
  );
};

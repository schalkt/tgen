module.exports = function (tgen) {
  // sinecolor - aDDict2
  tgen.filter(
    "sinecolor",
    {
      seed: null,
      sines: [1, 10],
      channel: [0, 2],
    },
    function ($g, params) {
      params.sines = $g.randByArraySeed(params.sines);
      params.channel = $g.randByArraySeed(params.channel);

      $g.walk(function (color) {
        let n = parseInt(
          Math.sin(
            color[params.channel] *
              ($g.calc.pi / 180.0) *
              (255 / 360) *
              params.sines
          ) * 255
        );
        color[params.channel] = Math.abs(n);
        return color;
      });

      return params;
    }
  );
};

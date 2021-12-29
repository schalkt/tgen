module.exports = function (tgen) {
  // invert
  tgen.filter(
    "invert",
    {
      seed: null,
      channels: [[0, 1], [0, 1], [0, 1], 0],
    },
    function ($g, params) {
      params.channels[0] = $g.randByArraySeed(params.channels[0]);
      params.channels[1] = $g.randByArraySeed(params.channels[1]);
      params.channels[2] = $g.randByArraySeed(params.channels[2]);

      $g.walk(function (color) {
        return [
          params.channels[0] ? 255 - color[0] : color[0],
          params.channels[1] ? 255 - color[1] : color[1],
          params.channels[2] ? 255 - color[2] : color[2],
          params.channels[3] ? 255 - color[3] : color[3],
        ];
      });

      return params;
    }
  );
};

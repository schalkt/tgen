module.exports = function (tgen) {
  // channel
  tgen.filter(
    "channel",
    {
      channels: [
        [0.2, 0.8],
        [0.4, 1.0],
        [0.8, 1.2],
      ],
    },
    function ($g, params) {
      params.channels[0] = $g.randByArraySeed(params.channels[0], true);
      params.channels[1] = $g.randByArraySeed(params.channels[1], true);
      params.channels[2] = $g.randByArraySeed(params.channels[2], true);

      $g.walk(function (color) {
        return [
          color[0] * params.channels[0],
          color[1] * params.channels[1],
          color[2] * params.channels[2],
          color[3],
        ];
      });

      return params;
    }
  );
};

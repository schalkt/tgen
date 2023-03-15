module.exports = function (tgen) {
  // lines
  tgen.effect(
    "lines",
    {
      seed: null,
      blend: tgen.blendFlat(),
      rgba: "randomalpha",
      size: [77, 221],
      count: [21, 512],
      freq1s: [4, 221],
      freq1c: [4, 221],
      freq2s: [4, 221],
      freq2c: [4, 221],
    },
    function ($g, params) {
      params.freq1s = $g.randByArraySeed(params.freq1s, true);
      params.freq1c = $g.randByArraySeed(params.freq1c, true);
      params.freq2s = $g.randByArraySeed(params.freq2s, true);
      params.freq2c = $g.randByArraySeed(params.freq2c, true);
      params.size = $g.randByArraySeed(params.size);

      let i, x1, y1, x2, y2;

      for (i = 0; i < params.count; i++) {
        x1 =
          $g.texture.width / 2 +
          Math.sin((i / params.freq1s) * $g.calc.pi) * params.size;
        y1 =
          $g.texture.height / 2 +
          Math.cos((i / params.freq1c) * $g.calc.pi) * params.size;
        x2 =
          $g.texture.width / 2 +
          Math.sin((i / params.freq2s) * $g.calc.pi) * params.size;
        y2 =
          $g.texture.height / 2 +
          Math.cos((i / params.freq2c) * $g.calc.pi) * params.size;

        $g.shape.line($g, x1, y1, x2, y2);
      }

      return params;
    }
  );
};

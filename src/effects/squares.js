module.exports = function (tgen) {
  // squares
  tgen.effect(
    "squares",
    {
      seed: null,
      blend: tgen.blendFlat(),
      rgba: "randomalpha",
      origin: "random",
      count: [1, 42],
      size: [
        [1, 77],
        [1, 77],
      ],
    },
    function ($g, params) {
      params.size[0] = $g.randByArraySeed(params.size[0], false);
      params.size[1] = $g.randByArraySeed(params.size[1], false);

      let i, xys;

      for (i = 0; i < params.count; i++) {
        xys = $g.xysize(i, params);
        $g.shape.rect(
          $g,
          $g.percentX(xys.x),
          $g.percentY(xys.y),
          $g.percentXY(xys.size),
          $g.percentXY(xys.size),
          false
        );
      }

      return params;
    }
  );
};

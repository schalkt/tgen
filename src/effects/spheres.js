module.exports = function (tgen) {
  // spheres
  tgen.effect(
    "spheres",
    {
      seed: null,
      blend: tgen.blendFlat(),
      rgba: "randomalpha",
      origin: "random",
      dynamic: true,
      count: [1, 77],
      size: [
        [1, 92],
        [1, 92],
      ],
    },
    function ($g, params) {
      params.dynamic = $g.randItemByArraySeed(params.dynamic, [true, false]);
      params.size[0] = $g.randByArraySeed(params.size[0], false);
      params.size[1] = $g.randByArraySeed(params.size[1], false);

      let i, xys;

      for (i = 0; i < params.count; i++) {
        xys = $g.xysize(i, params);
        $g.shape.sphere(
          $g,
          $g.percentX(xys.x),
          $g.percentY(xys.y),
          $g.percentXY(xys.size),
          true,
          params.rgba,
          params.dynamic
        );
      }

      return params;
    }
  );
};

(function (tgen) {
  // lines2
  tgen.effect(
    "lines2",
    {
      blend: tgen.blendFlat,
      rgba: "randomalpha",
      type: "random",
      size: [0.1, 21],
      count: [1, 42],
      seed: [1, Number.MAX_SAFE_INTEGER],
    },
    function ($g, params) {
      params.type = $g.randItemByArraySeed(params.type, [
        "vertical",
        "horizontal",
      ]);

      var size, percent, i;

      for (i = 0; i < params.count; i++) {
        size = $g.randByArraySeed(params.size, true);
        percent = $g.randRealSeed(0.1, 100);

        if (params.type == "vertical") {
          $g.shape.rect(
            $g,
            $g.percentX(percent),
            0,
            $g.percentX(size),
            $g.texture.height
          );
        } else {
          $g.shape.rect(
            $g,
            0,
            $g.percentX(percent),
            $g.texture.width,
            $g.percentX(size)
          );
        }
      }

      return params;
    }
  );
})(SeamlessTextureGenerator);

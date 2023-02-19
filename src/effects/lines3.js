module.exports = function (tgen) {
  // lines3
  tgen.effect(
    "lines3",
    {
      seed: null,
      type: null,
      blend: "opacity",
      colormap: "random",
      fadeinout: 1,
      step: [1, 2, 4, 8, 16, 32, 64],
      size: [7, 210],
      waves: [1, 21],
      amplitude: [0, 42],
      //weight: [1, 2, 4, 8, 16, 32],
      weight: [1, 32],
    },

    function ($g, params) {
      params.type = $g.randItemByArraySeed(params.type, [
        "vertical",
        "horizontal",
      ]);

      params.fadeinout = $g.randIntByArraySeed(null, params.fadeinout);

      params.size = $g.randByArraySeed(params.size);
      params.amplitude = $g.randByArraySeed(params.amplitude);
      params.waves = $g.randIntByArraySeed(params.waves);

      params.step = $g.randItemByArraySeed(null, params.step);
      //params.weight = $g.randItemByArraySeed(null, params.weight);
      params.weight = $g.randIntByArraySeed(params.weight);

      let x, y, x1, x2, y1, y2;

      $g.colormap.init(params.colormap, params.size, function (cmap) {
        params.colormap = cmap;
      });

      if (params.type === "horizontal") {
        for (y = 0; y < $g.texture.height; y += params.step) {
          x1 =
            Math.sin((y / $g.texture.width) * params.waves * $g.calc.pi) *
            $g.texture.width *
            (params.amplitude / 100);
          x2 = x1 + $g.texture.width * (params.size / 100);
          $g.shape.colorLine(
            $g,
            x1,
            y,
            x2,
            y,
            $g.colormap.data,
            params.weight,
            params.fadeinout
          );
        }
      } else {
        for (x = 0; x < $g.texture.width; x += params.step) {
          y1 =
            Math.sin((x / $g.texture.height) * params.waves * $g.calc.pi) *
            $g.texture.width *
            (params.amplitude / 100);
          y2 = y1 + $g.texture.height * (params.size / 100);
          $g.shape.colorLine(
            $g,
            x,
            y1,
            x,
            y2,
            $g.colormap.data,
            params.weight,
            params.fadeinout
          );
        }
      }

      return params;

    }
  );
};

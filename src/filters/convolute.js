module.exports = function (tgen) {
  // convolute
  tgen.filter(
    "convolute",
    {
      blend: "opacity",
      transparent: false,
      weights: "default1", // string or array
    },
    function ($g, params) {
      if (
        (typeof params.weights != "object" &&
          typeof params.weights != "string") ||
        params.weights == null
      ) {
        return params;
      }

      if (typeof params.weights[0] == "string") {
        params.weights = $g.randByArraySeed(params.weights);
      }

      if (typeof params.weights == "string") {
        if (params.weights === "random") {
          const min = -32;
          const max = 32;
          params.weights = [
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
            $g.randIntSeed(min, max),
          ];

          $g.log(params.weights.join(", "));
        } else {
          const presets = {
            edgedetect1: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
            edgedetect2: [0, 1, 0, 1, -4, 1, 0, 1, 0],
            edgedetect3: [1, 0, -1, 0, 0, 0, -1, 0, 1],
            sharpen1: [0, -1, 0, -1, 5, -1, 0, -1, 0],
            sharpen2: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
            emboss1: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
            emboss2: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
            emboss3: [10, 3, -2, -8, -5, 7, -3, -12, 11],
            emboss4: [-6, 11, -9, -9, 0, -4, 12, 8, -2],
            sobel1: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
            sobel2: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
            sobel3: [-5, -8, 12, -4, -8, -12, 9, 6, 9],
            default1: [1, -11, -7, 5, 2, 4, 4, 9, -2],
            default2: [-5, -21, 25, 22, 31, -16, -2, -21, -10],
            default3: [1, 1, 1, 1, 1, 1, 1, 1, 1],
          };

          if (presets[params.weights] == undefined) {
            return params;
          }

          params.weights = presets[params.weights];
        }
      }

      const side = Math.round(Math.sqrt(params.weights.length));
      const halfSide = Math.floor(side / 2);
      const alphaFac = params.transparent ? 1 : 0;
      const buffer = new $g.buffer();

      buffer.clear();

      let x, y, r, g, b, a, cx, cy, wt, scy, scx, color;
      let size = $g.texture.size();

      for (y = 0; y < $g.texture.height; y++) {
        for (x = 0; x < $g.texture.width; x++) {
          r = 0;
          g = 0;
          b = 0;
          a = 0;

          for (cy = 0; cy < side; cy++) {
            for (cx = 0; cx < side; cx++) {
              wt = params.weights[cy * side + cx];
              scy = y + cy - halfSide;
              scx = x + cx - halfSide;
              color = $g.texture.get(scx, scy);

              r += color[0] * wt;
              g += color[1] * wt;
              b += color[2] * wt;
              a += color[3];
            }
          }

          buffer.set(x, y, [r, g, b, a + alphaFac * (255 - a)]);
        }
      }

      while (size--) {
        $g.texture.data[size] = buffer.data[size];
      }

      return params;
    }
  );
};

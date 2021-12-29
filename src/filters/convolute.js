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
          var min = -32;
          var max = 32;
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
          var presets = {
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

      var buffer = new $g.buffer();
      buffer.clear();
      var side = Math.round(Math.sqrt(params.weights.length));
      var halfSide = Math.floor(side / 2);
      var alphaFac = params.transparent ? 1 : 0;

      for (var y = 0; y < $g.texture.height; y++) {
        for (var x = 0; x < $g.texture.width; x++) {
          var r = 0,
            g = 0,
            b = 0,
            a = 0;

          for (var cy = 0; cy < side; cy++) {
            for (var cx = 0; cx < side; cx++) {
              var wt = params.weights[cy * side + cx];
              var scy = y + cy - halfSide;
              var scx = x + cx - halfSide;
              var color = $g.texture.get(scx, scy);

              r += color[0] * wt;
              g += color[1] * wt;
              b += color[2] * wt;
              a += color[3];
            }
          }

          buffer.set(x, y, [r, g, b, a + alphaFac * (255 - a)]);
        }
      }

      var size = $g.texture.size();
      while (size--) {
        $g.texture.data[size] = buffer.data[size];
      }

      return params;
    }
  );
};

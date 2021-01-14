(function (tgen) {
  // fractal [UNDER DEVELOPMENT]
  tgen.effect(
    "mandelbrot",
    {
      blend: "opacity",
      rgba: "randomalpha",
      seed: [1, Number.MAX_SAFE_INTEGER],
      iteration: [8, 512],
      skip: [0, 8],
    },
    function ($g, params) {
      params.skip = $g.randByArraySeed(params.skip);
      params.iteration = $g.randByArraySeed(params.iteration);

      var width = $g.texture.width;
      var height = $g.texture.height;

      var xMin = -2.0;
      var xMax = 1.0;
      var yMin = -1.5;
      var yMax = 1.5;

      var mr0 = params.rgba[0];
      var mg0 = params.rgba[1];
      var mb0 = params.rgba[2];

      var mr1 = 256 / mr0;
      var mg1 = 256 / mg0;
      var mb1 = 256 / mb0;

      var maxIt = params.iteration;
      var x = 0.0;
      var y = 0.0;
      var zx = 0.0;
      var zx0 = 0.0;
      var zy = 0.0;
      var zx2 = 0.0;
      var zy2 = 0.0;

      for (var ky = 0; ky < height; ky++) {
        y = yMin + ((yMax - yMin) * ky) / height;

        for (var kx = 0; kx < width; kx++) {
          x = xMin + ((xMax - xMin) * kx) / width;
          zx = x;
          zy = y;

          for (var i = 0; i < maxIt; i++) {
            zx2 = zx * zx;
            zy2 = zy * zy;

            if (zx2 + zy2 > 4.0) {
              break;
            }

            zx0 = zx2 - zy2 + x;
            zy = 2.0 * zx * zy + y;
            zx = zx0;
          }

          if (i > params.skip) {
            $g.point.rgba = [
              (i % mr0) * mr1,
              (i % mg0) * mg1,
              (i % mb0) * mb1,
              $g.point.rgba[3],
            ];
            $g.point.set(kx, ky);
          }
        }
      }

      return params;
    }
  );
})(SeamlessTextureGenerator);

module.exports = function (tgen) {
  // fractal [UNDER DEVELOPMENT]
  tgen.effect(
    "mandelbrot",
    {
      seed: null,
      blend: "opacity",
      rgba: "randomalpha",
      iteration: [8, 512],
      skip: [0, 8],
    },
    function ($g, params) {
      params.skip = $g.randByArraySeed(params.skip);
      params.iteration = $g.randByArraySeed(params.iteration);

      const width = $g.texture.width;
      const height = $g.texture.height;

      const xMin = -2.0;
      const xMax = 1.0;
      const yMin = -1.5;
      const yMax = 1.5;

      const mr0 = params.rgba[0];
      const mg0 = params.rgba[1];
      const mb0 = params.rgba[2];

      const mr1 = 256 / mr0;
      const mg1 = 256 / mg0;
      const mb1 = 256 / mb0;

      const maxIt = params.iteration;

      let x = 0.0;
      let y = 0.0;
      let zx = 0.0;
      let zx0 = 0.0;
      let zy = 0.0;
      let zx2 = 0.0;
      let zy2 = 0.0;
      let ky, kx, i;

      for (ky = 0; ky < height; ky++) {
        y = yMin + ((yMax - yMin) * ky) / height;

        for (kx = 0; kx < width; kx++) {
          x = xMin + ((xMax - xMin) * kx) / width;
          zx = x;
          zy = y;

          for (i = 0; i < maxIt; i++) {
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
};

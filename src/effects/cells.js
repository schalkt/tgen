module.exports = function (tgen) {
  // cells - seamless worley (voronoi) noise
  tgen.effect(
    "cells",
    {
      seed: null,
      blend: tgen.blendFlat(),
      rgba: "randomalpha",
      colorize: 0,
      count: [4, 32],
      mode: "random", // f1, f2, edge
      invert: 0,
    },
    function ($g, params) {
      params.count = $g.randIntByArraySeed(params.count, [4, 32]);
      params.mode = $g.randItemByArraySeed(params.mode, ["f1", "f2", "edge"]);

      const width = $g.texture.width;
      const height = $g.texture.height;
      const points = [];
      const buffer = new Float32Array(width * height);

      let i, x, y, dx, dy, d, f1, f2, value, max, color;

      for (i = 0; i < params.count; i++) {
        points.push([$g.randRealSeed(0, width), $g.randRealSeed(0, height)]);
      }

      max = 0;

      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          f1 = Infinity;
          f2 = Infinity;

          for (i = 0; i < params.count; i++) {
            // toroidal distance keeps the texture seamless
            dx = Math.abs(x - points[i][0]);
            dy = Math.abs(y - points[i][1]);
            dx = Math.min(dx, width - dx);
            dy = Math.min(dy, height - dy);
            d = dx * dx + dy * dy;

            if (d < f1) {
              f2 = f1;
              f1 = d;
            } else if (d < f2) {
              f2 = d;
            }
          }

          f1 = Math.sqrt(f1);
          f2 = Math.sqrt(f2);

          switch (params.mode) {
            case "f2":
              value = f2;
              break;
            case "edge":
              value = f2 - f1;
              break;
            default:
              value = f1;
              break;
          }

          buffer[x + y * width] = value;
          max = Math.max(max, value);
        }
      }

      max = max || 1;

      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          color = (255 * buffer[x + y * width]) / max;

          if (params.invert) {
            color = 255 - color;
          }

          if (params.colorize) {
            $g.point.rgba = $g.point.colorize(params.rgba, [
              color,
              color,
              color,
              255,
            ]);
          } else {
            $g.point.rgba = [color, color, color, 255];
          }

          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

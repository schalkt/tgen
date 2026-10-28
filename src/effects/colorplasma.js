const tools = require("./noise-tools.js");

module.exports = function (tgen) {
  // colorplasma - the classic "render plasma": diamond-square midpoint
  // displacement on a wrapped grid, separately for the red, green and blue
  // channels, so it is colorful and seamless
  tgen.effect(
    "colorplasma",
    {
      seed: null,
      blend: "opacity",
      rgba: [255, 255, 255, 255], // tint and opacity
      colormap: null, // by the red channel only, null: rgb
      roughness: [0.5, 0.75], // detail kept on every level, higher: rougher
      scale: [1, 2, 4, 8], // random points on each side at start, picks one
      contrast: [1, 1.6],
    },
    function ($g, params) {
      params.roughness = $g.randByArraySeed(params.roughness, true);
      params.scale = $g.randItemSeed(params.scale);
      params.contrast = $g.randByArraySeed(params.contrast, true);

      const random = tools.seededRandom($g, params);
      const wrap = tools.wrap;
      const width = $g.texture.width;
      const height = $g.texture.height;

      // grid: power of two, at least as big as the texture
      let size = 1;

      while (size < Math.max(width, height)) {
        size *= 2;
      }

      // power of two, the grid is halved at every level
      const scale = Math.min(
        size,
        Math.pow(2, Math.round(Math.log2(Math.max(1, params.scale))))
      );

      // one channel of diamond-square, wrapped, 0..1
      const channel = function () {
        const grid = new Float32Array(size * size);
        const at = function (x, y) {
          return grid[wrap(y, size) * size + wrap(x, size)];
        };

        let step = Math.max(1, Math.floor(size / scale));
        let amplitude = 1;
        let x, y, half;

        for (y = 0; y < size; y += step) {
          for (x = 0; x < size; x += step) {
            grid[y * size + x] = random();
          }
        }

        while (step > 1) {
          half = step / 2;
          amplitude *= params.roughness;

          // square: centers of the cells
          for (y = half; y < size; y += step) {
            for (x = half; x < size; x += step) {
              grid[y * size + x] =
                (at(x - half, y - half) +
                  at(x + half, y - half) +
                  at(x - half, y + half) +
                  at(x + half, y + half)) /
                  4 +
                (random() - 0.5) * amplitude;
            }
          }

          // diamond: middles of the edges
          for (y = 0; y < size; y += half) {
            for (x = (y / half) % 2 === 0 ? half : 0; x < size; x += step) {
              grid[y * size + x] =
                (at(x - half, y) +
                  at(x + half, y) +
                  at(x, y - half) +
                  at(x, y + half)) /
                  4 +
                (random() - 0.5) * amplitude;
            }
          }

          step = half;
        }

        // normalize with contrast around the middle
        let min = Infinity;
        let max = -Infinity;

        for (let k = 0; k < grid.length; k++) {
          min = Math.min(min, grid[k]);
          max = Math.max(max, grid[k]);
        }

        const range = max - min || 1;

        for (let k = 0; k < grid.length; k++) {
          const t = ((grid[k] - min) / range - 0.5) * params.contrast + 0.5;
          grid[k] = Math.max(0, Math.min(1, t));
        }

        return grid;
      };

      const channels = [channel(), channel(), channel()];

      // the grid is periodic, sampling it scaled keeps the texture seamless
      const sample = function (grid, fx, fy) {
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = fx - x0;
        const ty = fy - y0;
        const a = at(grid, x0, y0) + (at(grid, x0 + 1, y0) - at(grid, x0, y0)) * tx;
        const b =
          at(grid, x0, y0 + 1) +
          (at(grid, x0 + 1, y0 + 1) - at(grid, x0, y0 + 1)) * tx;

        return a + (b - a) * ty;
      };

      const at = function (grid, x, y) {
        return grid[wrap(y, size) * size + wrap(x, size)];
      };

      $g.colormap.init(params.colormap, 255, function (cmap) {
        params.colormap = cmap;
      });

      let x, y, fx, fy, r, g, b;

      for (y = 0; y < height; y++) {
        fy = (y * size) / height;

        for (x = 0; x < width; x++) {
          fx = (x * size) / width;
          r = sample(channels[0], fx, fy);

          if ($g.colormap.data !== null) {
            $g.point.rgba = $g.colormap.get(r * 255, params.rgba);
          } else {
            g = sample(channels[1], fx, fy);
            b = sample(channels[2], fx, fy);

            $g.point.rgba = [
              r * params.rgba[0],
              g * params.rgba[1],
              b * params.rgba[2],
              params.rgba[3],
            ];
          }

          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

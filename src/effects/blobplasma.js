const tools = require("./noise-tools.js");

module.exports = function (tgen) {
  // blobplasma - metaball field: charged points, the field is the sum of
  // charge / distance^falloff from the nearest copy of every point, it
  // fades to 0 at half of the texture size, so it is seamless; the colormap
  // cycles give contour like bands
  tgen.effect(
    "blobplasma",
    {
      seed: null,
      blend: "opacity",
      rgba: [255, 255, 255, 255], // tint and opacity without colormap
      colormap: "pickone",
      count: [4, 16], // points
      size: [4, 12], // radius of the points, in percent of the size
      falloff: [1, 2], // 1: soft, 2: round blobs
      negative: [0, 0.3], // part of the points with negative charge
      cycles: [1, 4], // colormap repeats
    },
    function ($g, params) {
      params.size = $g.randByArraySeed(params.size, true);
      params.falloff = $g.randByArraySeed(params.falloff, true);
      params.negative = $g.randByArraySeed(params.negative, true);
      params.cycles = $g.randByArraySeed(params.cycles, true);

      const random = tools.seededRandom($g, params);
      const width = $g.texture.width;
      const height = $g.texture.height;
      const size = Math.min(width, height);

      const points = [];

      for (let k = 0; k < params.count; k++) {
        points.push({
          x: random() * width,
          y: random() * height,
          radius: ((size * params.size) / 100) * (0.5 + random()),
          charge: random() < params.negative ? -1 : 1,
        });
      }

      $g.colormap.init(params.colormap, 255, function (cmap) {
        params.colormap = cmap;
      });

      const values = new Float32Array(width * height);
      const exponent = params.falloff / 2;

      // reach of a point: half of the texture, the field is 0 there
      const reach = size / 2;
      const field = function (d2, radius) {
        // + 0.5: soft cores, without many rings around the points
        return Math.pow(d2 / (radius * radius) + 0.5, -exponent);
      };

      let x, y, k, dx, dy, d2, value, point, min, max, t, color;
      min = Infinity;
      max = -Infinity;

      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          value = 0;

          for (k = 0; k < points.length; k++) {
            point = points[k];

            // the nearest copy of the point
            dx = x - point.x;
            dy = y - point.y;
            dx -= Math.round(dx / width) * width;
            dy -= Math.round(dy / height) * height;
            d2 = dx * dx + dy * dy;

            if (d2 < reach * reach) {
              value +=
                point.charge *
                (field(d2, point.radius) - field(reach * reach, point.radius));
            }
          }

          values[y * width + x] = value;
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      }

      // log scale, the field is huge near the points
      const scaled = function (value) {
        return Math.sign(value) * Math.log(1 + Math.abs(value));
      };
      const low = scaled(min);
      const range = scaled(max) - low || 1;

      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          t = (scaled(values[y * width + x]) - low) / range;

          // back and forth on the colormap, so the cycles are smooth
          t = (t * params.cycles * 2) % 2;
          t = t > 1 ? 2 - t : t;

          if ($g.colormap.data !== null) {
            color = $g.colormap.get(t * 255, params.rgba);
          } else {
            color = [
              params.rgba[0] * t,
              params.rgba[1] * t,
              params.rgba[2] * t,
              params.rgba[3],
            ];
          }

          $g.point.rgba = color;
          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

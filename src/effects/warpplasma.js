const tools = require("./noise-tools.js");

module.exports = function (tgen) {
  // warpplasma - liquid plasma by domain warping: the periodic noise is
  // distorted by itself several times, f(p + k * f(p + k * f(p))), the
  // color comes from the last value, the brightness from the distortion
  tgen.effect(
    "warpplasma",
    {
      seed: null,
      blend: "opacity",
      rgba: [255, 255, 255, 255], // tint and opacity without colormap
      colormap: "pickone",
      scale: [2, 4], // noise cells on the texture
      octaves: [3, 5],
      warp: [1, 3], // strength of the distortion
      depth: [1, 3], // times of the distortion
      cycles: [1, 2], // colormap repeats
      shade: [0.3, 0.7], // darker where the distortion is small
    },
    function ($g, params) {
      params.scale = $g.randByArraySeed(params.scale);
      params.octaves = $g.randByArraySeed(params.octaves);
      params.warp = $g.randByArraySeed(params.warp, true);
      params.depth = $g.randByArraySeed(params.depth);
      params.cycles = $g.randByArraySeed(params.cycles, true);
      params.shade = $g.randByArraySeed(params.shade, true);

      const random = tools.seededRandom($g, params);
      const periodic = tools.periodicNoise(random);
      const width = $g.texture.width;
      const height = $g.texture.height;

      const fbm = function (x, y, layer) {
        return periodic.fbm(x, y, layer, params.scale, params.octaves);
      };

      $g.colormap.init(params.colormap, 255, function (cmap) {
        params.colormap = cmap;
      });

      const values = new Float32Array(width * height);
      const lengths = new Float32Array(width * height);

      let x, y, u, v, qx, qy, d, n, value, offset, color, t, light;
      let min = Infinity;
      let max = -Infinity;
      let maxLength = 0;

      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          u = (x / width) * params.scale;
          v = (y / height) * params.scale;
          qx = 0;
          qy = 0;

          // the distortion is periodic too, so it stays seamless
          for (d = 0; d < params.depth; d++) {
            n = fbm(u + params.warp * qx, v + params.warp * qy, d * 2 + 1);
            qy = fbm(u + params.warp * qx + 5.2, v + params.warp * qy + 1.3, d * 2 + 2);
            qx = n;
          }

          value = fbm(u + params.warp * qx, v + params.warp * qy, 0);
          offset = y * width + x;
          values[offset] = value;
          lengths[offset] = Math.sqrt(qx * qx + qy * qy);

          min = Math.min(min, value);
          max = Math.max(max, value);
          maxLength = Math.max(maxLength, lengths[offset]);
        }
      }

      const range = max - min || 1;

      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          offset = y * width + x;

          // back and forth on the colormap, so the cycles are smooth
          t = (((values[offset] - min) / range) * params.cycles * 2) % 2;
          t = t > 1 ? 2 - t : t;

          light =
            1 - params.shade + params.shade * (lengths[offset] / (maxLength || 1));

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

          $g.point.rgba = [
            color[0] * light,
            color[1] * light,
            color[2] * light,
            color[3],
          ];
          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

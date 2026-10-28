module.exports = function (tgen) {
  // electricity - seamless lightning bolts or an electric field
  tgen.effect(
    "electricity",
    {
      seed: null,
      blend: "screen",
      rgba: [[40, 160], [120, 220], [200, 255], 255],
      colormap: null, // by the intensity
      type: ["bolt", "field"], // picks one
      count: [1, 4], // bolts
      glow: [0.3, 0.8], // strength of the glow around the core
      core: 1, // white hot core without colormap, 0: plain color (e.g. veins)

      // bolt
      // bolt length and detail, in percent, like zooming in (the thickness
      // is set by width and radius)
      size: [100, 250],
      length: [40, 120], // in percent of the texture size
      jagged: [0.15, 0.35], // midpoint displacement
      branches: [2, 8], // per bolt
      width: [0.6, 2], // thickness of the core, in pixels
      radius: [3, 12], // thickness of the glow, in pixels

      // field
      layers: [3, 6], // the first is the brightest, the others are fainter
      scale: [2, 3], // noise cells on the texture
      octaves: [2, 3],
      warp: [0.2, 0.8],
      thickness: [0.008, 0.02], // of the lines, in noise units
    },
    function ($g, params) {
      params.type = $g.randItemSeed(params.type);
      params.glow = $g.randByArraySeed(params.glow, true);
      params.core = $g.randByArraySeed(params.core, true);

      const width = $g.texture.width;
      const height = $g.texture.height;
      const size = Math.min(width, height);
      const intensity = new Float32Array(width * height);
      const core = new Float32Array(width * height);

      // own generator for the many random values, mixed with the item seed
      let state =
        Math.imul(((Number(params.seed) || 0) % 2147483647) | 0, 0x9e3779b1) ^
        $g.randIntSeed(1, 2147483647);
      const random = function () {
        state = (state + 0x6d2b79f5) | 0;
        let m = Math.imul(state ^ (state >>> 15), 1 | state);
        m = (m + Math.imul(m ^ (m >>> 7), 61 | m)) ^ m;
        return ((m ^ (m >>> 14)) >>> 0) / 4294967296;
      };

      const wrap = function (value, max) {
        value = value % max;
        return value < 0 ? value + max : value;
      };

      // drop the params of the other type, they are not used
      const unused =
        params.type === "bolt"
          ? ["layers", "scale", "octaves", "warp", "thickness"]
          : ["count", "size", "length", "jagged", "branches", "width", "radius"];

      for (const key of unused) {
        delete params[key];
      }

      if (params.type === "bolt") {
        params.size = $g.randByArraySeed(params.size, true);
        params.length = $g.randByArraySeed(params.length, true);
        params.jagged = $g.randByArraySeed(params.jagged, true);
        params.branches = $g.randByArraySeed(params.branches);
        params.width = $g.randByArraySeed(params.width, true);
        params.radius = $g.randByArraySeed(params.radius, true);

        // one bolt into its own buffer with max, so the joints of the
        // segments are not brighter, then added to the others
        const zoom = Math.max(0.01, params.size / 100);
        const bolt = new Float32Array(width * height);
        const boltCore = new Float32Array(width * height);

        // jagged line by midpoint displacement
        const jaggedLine = function (x1, y1, x2, y2) {
          let points = [
            [x1, y1],
            [x2, y2],
          ];
          let length = Math.hypot(x2 - x1, y2 - y1);
          let offset = length * params.jagged;

          while (length > 2 * zoom) {
            const next = [points[0]];

            for (let k = 1; k < points.length; k++) {
              const a = points[k - 1];
              const b = points[k];
              const dx = b[0] - a[0];
              const dy = b[1] - a[1];
              const d = Math.hypot(dx, dy) || 1;
              const shift = (random() * 2 - 1) * offset;

              next.push([
                (a[0] + b[0]) / 2 - (dy / d) * shift,
                (a[1] + b[1]) / 2 + (dx / d) * shift,
              ]);
              next.push(b);
            }

            points = next;
            length /= 2;
            offset /= 2;
          }

          return points;
        };

        // capsule around a segment, wrapped around the texture edges
        const segment = function (a, b, lineWidth, radius, strength) {
          const reach = radius * 4 + lineWidth;
          const minX = Math.floor(Math.min(a[0], b[0]) - reach);
          const maxX = Math.ceil(Math.max(a[0], b[0]) + reach);
          const minY = Math.floor(Math.min(a[1], b[1]) - reach);
          const maxY = Math.ceil(Math.max(a[1], b[1]) + reach);
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const lengthSq = dx * dx + dy * dy || 1;

          for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
              let t = ((x - a[0]) * dx + (y - a[1]) * dy) / lengthSq;
              t = Math.max(0, Math.min(1, t));

              const d = Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
              const c = Math.exp(-((d / lineWidth) * (d / lineWidth)));
              const g = params.glow * Math.exp(-d / radius);
              const offset = wrap(y, height) * width + wrap(x, width);

              bolt[offset] = Math.max(bolt[offset], (c + g) * strength);
              boltCore[offset] = Math.max(boltCore[offset], c * strength);
            }
          }
        };

        const drawLine = function (points, lineWidth, radius, strength) {
          for (let k = 1; k < points.length; k++) {
            segment(points[k - 1], points[k], lineWidth, radius, strength);
          }
        };

        for (let n = 0; n < params.count; n++) {
          bolt.fill(0);
          boltCore.fill(0);

          const x1 = random() * width;
          const y1 = random() * height;
          const angle = random() * Math.PI * 2;
          const length = (size * params.length * zoom) / 100;
          const points = jaggedLine(
            x1,
            y1,
            x1 + Math.cos(angle) * length,
            y1 + Math.sin(angle) * length,
          );

          drawLine(points, params.width, params.radius, 1);

          // branches from random points, a bit aside of the main direction
          for (let k = 0; k < params.branches; k++) {
            const index = Math.floor(random() * (points.length - 1));
            const start = points[index];
            const side = random() < 0.5 ? -1 : 1;
            const branchAngle = angle + side * (0.3 + random() * 0.6);
            const branchLength =
              length * (1 - index / points.length) * (0.3 + random() * 0.4);
            const branch = jaggedLine(
              start[0],
              start[1],
              start[0] + Math.cos(branchAngle) * branchLength,
              start[1] + Math.sin(branchAngle) * branchLength,
            );

            drawLine(
              branch,
              params.width * 0.6,
              params.radius * 0.7,
              0.5 + random() * 0.3,
            );
          }

          for (let k = 0; k < bolt.length; k++) {
            intensity[k] += bolt[k];
            core[k] += boltCore[k];
          }
        }
      } else {
        params.layers = $g.randByArraySeed(params.layers);
        params.scale = $g.randByArraySeed(params.scale);
        params.octaves = $g.randByArraySeed(params.octaves);
        params.warp = $g.randByArraySeed(params.warp, true);
        params.thickness = $g.randByArraySeed(params.thickness, true);

        // periodic gradient noise, the lattice repeats on the texture
        const gradients = [];

        for (let k = 0; k < 256; k++) {
          const a = random() * Math.PI * 2;
          gradients.push([Math.cos(a), Math.sin(a)]);
        }

        const perm = [];

        for (let k = 0; k < 256; k++) {
          perm.push(k);
        }

        for (let k = 255; k > 0; k--) {
          const j = Math.floor(random() * (k + 1));
          const swap = perm[k];
          perm[k] = perm[j];
          perm[j] = swap;
        }

        const gradient = function (ix, iy, period, layer) {
          ix = wrap(ix, period);
          iy = wrap(iy, period);
          return gradients[perm[(perm[(ix + layer * 31) & 255] + iy) & 255]];
        };

        const fade = function (t) {
          return t * t * t * (t * (t * 6 - 15) + 10);
        };

        const noise = function (x, y, period, layer) {
          const ix = Math.floor(x);
          const iy = Math.floor(y);
          const fx = x - ix;
          const fy = y - iy;

          const dot = function (gx, gy, dx, dy) {
            const g = gradient(gx, gy, period, layer);
            return g[0] * dx + g[1] * dy;
          };

          const u = fade(fx);
          const v = fade(fy);
          const top =
            dot(ix, iy, fx, fy) +
            (dot(ix + 1, iy, fx - 1, fy) - dot(ix, iy, fx, fy)) * u;
          const bottom =
            dot(ix, iy + 1, fx, fy - 1) +
            (dot(ix + 1, iy + 1, fx - 1, fy - 1) -
              dot(ix, iy + 1, fx, fy - 1)) *
              u;

          return top + (bottom - top) * v;
        };

        // fractal noise, every octave doubles the period, so it stays seamless
        // shifted octaves: the noise is 0 on the lattice points, without the
        // shift every octave would be 0 there and the lattice would show
        const fbm = function (x, y, layer) {
          let value = 0;
          let amplitude = 0.5;
          let period = params.scale;

          for (let o = 0; o < params.octaves; o++) {
            value +=
              amplitude *
              noise(
                x * (period / params.scale) + 0.37 * (o + 1) + layer * 0.21,
                y * (period / params.scale) + 0.61 * (o + 1) + layer * 0.13,
                period,
                layer,
              );
            amplitude /= 2;
            period *= 2;
          }

          return value;
        };

        for (let n = 0; n < params.layers; n++) {
          const layer = n * 3;
          const strength = n === 0 ? 1 : 0.25 + random() * 0.45;

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const u = (x / width) * params.scale;
              const v = (y / height) * params.scale;

              // domain warp makes the lines twist like arcs
              const wu = u + params.warp * fbm(u, v, layer + 1);
              const wv = v + params.warp * fbm(u, v, layer + 2);
              const d = Math.abs(fbm(wu, wv, layer));

              // long, soft falloff: thickness / distance
              const line = Math.min(
                4,
                params.thickness / (d + params.thickness * 0.25),
              );
              const g = params.glow * Math.pow(line, 1.4);
              const c = Math.pow(line / 4, 1.5);
              const offset = y * width + x;

              intensity[offset] += (c + g) * strength;
              core[offset] += c * strength;
            }
          }
        }
      }

      $g.colormap.init(params.colormap, 255, function (cmap) {
        params.colormap = cmap;
      });

      // the core gets the brighter end of the colormap, the glow fades
      // toward the darker end, whichever way the colormap goes
      let brightFirst = true;

      if ($g.colormap.data !== null) {
        const first = $g.colormap.get(0);
        const last = $g.colormap.get(255);
        brightFirst = $g.calc.luminance(first) >= $g.calc.luminance(last);
      }

      let x, y, offset, value, hot, color;

      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          offset = y * width + x;
          value = Math.min(1, intensity[offset]);

          if (value < 0.004) {
            continue;
          }

          if ($g.colormap.data !== null) {
            color = $g.colormap.get(
              (brightFirst ? 1 - value : value) * 255
            );
          } else {
            // the core is white hot
            hot = Math.min(1, core[offset]) * params.core;
            color = [
              params.rgba[0] + (255 - params.rgba[0]) * hot,
              params.rgba[1] + (255 - params.rgba[1]) * hot,
              params.rgba[2] + (255 - params.rgba[2]) * hot,
            ];
          }

          $g.point.rgba = [
            color[0],
            color[1],
            color[2],
            params.rgba[3] * value,
          ];
          $g.point.set(x, y);
        }
      }

      return params;
    },
  );
};

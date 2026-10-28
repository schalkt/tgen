module.exports = function (tgen) {
  // fractals: mandelbrot and julia sets

  const defaults = {
    seed: null,
    blend: "opacity",
    rgba: "randomalpha",
    iteration: [64, 256],
    // iterations below this are not drawn (not "skip": that skips the whole
    // item for the renderer)
    threshold: [0, 8],
    x: [0, 100], // centre, in percent of the width
    y: [0, 100], // centre, in percent of the height
    size: [50, 400], // in percent of the texture size, above 100 zooms in
    // zoom only: the point of the set in the centre, in percent of the
    // set area, null: a random point near the edge of the set
    focusX: null,
    focusY: null,
    power: [2, 2, 3, 4], // z^power, picks one
    angle: [0, 360], // rotation of the set
    colormap: null, // by the iteration count
    density: [2, 12], // colormap cycle speed
    glow: [2, 8], // iterations to fade in from transparent, 0: hard edge
    inside: "transparent", // inside of the set: "transparent" or "color"
    antialias: 2, // samples per pixel on each axis
  };

  const fractal = function ($g, params, julia) {
    params.threshold = $g.randByArraySeed(params.threshold);
    params.iteration = $g.randByArraySeed(params.iteration);
    params.x = $g.randByArraySeed(params.x);
    params.y = $g.randByArraySeed(params.y);
    params.size = $g.randByArraySeed(params.size);
    params.power = $g.randItemSeed(params.power);
    params.angle = $g.randByArraySeed(params.angle, true);
    params.density = $g.randByArraySeed(params.density, true);
    params.glow = $g.randByArraySeed(params.glow, true);
    params.inside = $g.randItemSeed(params.inside);
    params.antialias = $g.randByArraySeed(params.antialias);

    $g.colormap.init(params.colormap, 255, function (cmap) {
      params.colormap = cmap;
    });

    const width = $g.texture.width;
    const height = $g.texture.height;

    const power = Math.max(2, Math.round(params.power));
    const logPower = Math.log(power);
    const maxIt = params.iteration;
    const bailout = 256; // big radius for smooth coloring

    // square window around the whole set, the set fits into its inner
    // circle, so it stays inside in any rotation
    const half = julia ? 1.8 : power === 2 ? 1.4 : 1.5;
    const originX = julia || power !== 2 ? 0 : -0.7;
    const originY = 0;

    let cx = 0;
    let cy = 0;
    let zx, zy, zx2, zy2, px, py, t, i, p;

    // smooth (fractional) iteration count, -1 inside the set
    const iterate = function (x, y, juliaSet) {
      const re = juliaSet ? cx : x;
      const im = juliaSet ? cy : y;

      zx = x;
      zy = y;

      for (i = 0; i < maxIt; i++) {
        zx2 = zx * zx;
        zy2 = zy * zy;

        if (zx2 + zy2 > bailout) {
          return i + 1 - Math.log(Math.log(zx2 + zy2) / 2) / logPower;
        }

        if (power === 2) {
          zy = 2.0 * zx * zy + im;
          zx = zx2 - zy2 + re;
        } else {
          px = zx;
          py = zy;

          for (p = 1; p < power; p++) {
            t = px * zx - py * zy;
            py = px * zy + py * zx;
            px = t;
          }

          zx = px + re;
          zy = py + im;
        }
      }

      return -1;
    };

    // a random point near the edge of the set: it escapes, but late
    const edgePoint = function (juliaSet) {
      // own generator, mixed with the item seed: the seeded one of $g gives
      // shifted sequences for close seeds, the search would find the same
      // point again
      let state =
        Math.imul((Number(params.seed) || 0) % 2147483647 | 0, 0x9e3779b1) ^
        $g.randIntSeed(1, 2147483647);
      const random = function () {
        state = (state + 0x6d2b79f5) | 0;
        let m = Math.imul(state ^ (state >>> 15), 1 | state);
        m = (m + Math.imul(m ^ (m >>> 7), 61 | m)) ^ m;
        return ((m ^ (m >>> 14)) >>> 0) / 4294967296;
      };

      const target = Math.min(32, maxIt / 2);
      let best = [originX, originY];
      let bestN = -1;
      let x, y, n;

      for (let k = 0; k < 1000; k++) {
        x = originX + (random() * 2 - 1) * half;
        y = originY + (random() * 2 - 1) * half;
        n = iterate(x, y, juliaSet);

        if (n > bestN) {
          best = [x, y];
          bestN = n;
        }

        if (n > target) {
          break;
        }
      }

      return best;
    };

    const round = function (value) {
      return Math.round(value * 100000) / 100000;
    };

    // julia constant: a point near the edge of the mandelbrot set
    if (julia) {
      if (params.c === null) {
        params.c = edgePoint(false).map(round);
      }

      cx = params.c[0];
      cy = params.c[1];
    }

    if (params.focusX === null || params.focusY === null) {
      const focus = edgePoint(julia);
      params.focusX =
        params.focusX === null
          ? round(((focus[0] - originX + half) / (2 * half)) * 100)
          : params.focusX;
      params.focusY =
        params.focusY === null
          ? round(((focus[1] - originY + half) / (2 * half)) * 100)
          : params.focusY;
    }

    params.focusX = $g.randByArraySeed(params.focusX, true);
    params.focusY = $g.randByArraySeed(params.focusY, true);

    const areaWidth = (width * params.size) / 100;
    const areaHeight = (height * params.size) / 100;
    const centreX = (width * params.x) / 100;
    const centreY = (height * params.y) / 100;

    // the point of the set at the centre, in area pixels
    const zoom = params.size > 100;
    const focusU = zoom ? (areaWidth * params.focusX) / 100 : areaWidth / 2;
    const focusV = zoom ? (areaHeight * params.focusY) / 100 : areaHeight / 2;

    // rotated around the focus point (zoom) or the window centre
    const rad = params.angle * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const pivotX = originX - half + (2 * half * focusU) / areaWidth;
    const pivotY = originY - half + (2 * half * focusV) / areaHeight;

    // area pixels to the complex plane
    const toComplex = function (u, v) {
      const dx = originX - half + (2 * half * u) / areaWidth - pivotX;
      const dy = originY - half + (2 * half * v) / areaHeight - pivotY;

      return [pivotX + cos * dx - sin * dy, pivotY + sin * dx + cos * dy];
    };

    // the highest count on the area edges: below it nothing is drawn, so
    // the drawn area has no hard edges and can be wrapped without seams;
    // zoomed in the area edges are never visible
    let edge = 0;
    const edgeSteps = zoom ? -1 : 1024;

    for (let k = 0; k <= edgeSteps; k++) {
      const eu = (areaWidth * k) / edgeSteps;
      const ev = (areaHeight * k) / edgeSteps;

      for (const point of [
        toComplex(eu, 0),
        toComplex(eu, areaHeight),
        toComplex(0, ev),
        toComplex(areaWidth, ev),
      ]) {
        const n = iterate(point[0], point[1], julia);
        edge = Math.max(edge, n < 0 ? maxIt : n);
      }
    }

    const minIteration = Math.max(params.threshold, edge + 0.5);

    // texture pixel distance from the centre, wrapped into -size/2..size/2;
    // zoomed in the set is bigger than the texture, so it is mirrored
    // around the centre and the wrap line to stay seamless
    const toArea = function (k, centre, size, focus) {
      let d = k - centre;
      d = d - Math.round(d / size) * size;

      if (zoom) {
        d = Math.abs(d) - size / 4;
      }

      return focus + d;
    };

    const mr = 256 / params.rgba[0];
    const mg = 256 / params.rgba[1];
    const mb = 256 / params.rgba[2];

    const samples = Math.max(1, Math.round(params.antialias));
    const sampleCount = samples * samples;

    let kx, ky, sx, sy, u, v, n, alpha, color, point;
    let r, g, b, a;

    for (ky = 0; ky < height; ky++) {
      for (kx = 0; kx < width; kx++) {
        r = g = b = a = 0;

        for (sy = 0; sy < samples; sy++) {
          v = toArea(ky + (sy + 0.5) / samples - 0.5, centreY, height, focusV);

          if (v < 0 || v > areaHeight) {
            continue;
          }

          for (sx = 0; sx < samples; sx++) {
            u = toArea(kx + (sx + 0.5) / samples - 0.5, centreX, width, focusU);

            if (u < 0 || u > areaWidth) {
              continue;
            }

            point = toComplex(u, v);
            n = iterate(point[0], point[1], julia);

            if (n < 0) {
              if (params.inside !== "color") {
                continue;
              }

              alpha = 1;
              n = 0;
            } else if (n <= minIteration) {
              continue;
            } else {
              alpha =
                params.glow > 0
                  ? Math.min(1, (n - minIteration) / params.glow)
                  : 1;
            }

            if ($g.colormap.data !== null) {
              color = $g.colormap.get(n * params.density);
            } else {
              color = [
                (n % params.rgba[0]) * mr,
                (n % params.rgba[1]) * mg,
                (n % params.rgba[2]) * mb,
              ];
            }

            r += color[0] * alpha;
            g += color[1] * alpha;
            b += color[2] * alpha;
            a += alpha;
          }
        }

        if (a > 0) {
          $g.point.rgba = [
            r / a,
            g / a,
            b / a,
            (params.rgba[3] * a) / sampleCount,
          ];
          $g.point.set(kx, ky);
        }
      }
    }

    return params;
  };

  tgen.effect("mandelbrot", { ...defaults }, function ($g, params) {
    return fractal($g, params, false);
  });

  tgen.effect(
    "julia",
    {
      ...defaults,
      // [real, imaginary], null: a random point near the edge of the
      // mandelbrot set (with the same power)
      c: null,
    },
    function ($g, params) {
      return fractal($g, params, true);
    }
  );
};

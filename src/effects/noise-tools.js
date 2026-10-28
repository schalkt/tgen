// shared helpers of the noise based effects (not an effect)

const wrap = function (value, max) {
  value = value % max;
  return value < 0 ? value + max : value;
};

// own generator for many random values, mixed with the item seed: the
// seeded one of $g gives shifted sequences for close seeds
const seededRandom = function ($g, params) {
  let state =
    Math.imul((Number(params.seed) || 0) % 2147483647 | 0, 0x9e3779b1) ^
    $g.randIntSeed(1, 2147483647);

  return function () {
    state = (state + 0x6d2b79f5) | 0;
    let m = Math.imul(state ^ (state >>> 15), 1 | state);
    m = (m + Math.imul(m ^ (m >>> 7), 61 | m)) ^ m;
    return ((m ^ (m >>> 14)) >>> 0) / 4294967296;
  };
};

// periodic gradient noise, the lattice repeats on the texture
const periodicNoise = function (random) {
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
      (dot(ix + 1, iy + 1, fx - 1, fy - 1) - dot(ix, iy + 1, fx, fy - 1)) * u;

    return top + (bottom - top) * v;
  };

  // fractal noise, every octave doubles the period, so it stays seamless
  // shifted octaves: the noise is 0 on the lattice points, without the
  // shift every octave would be 0 there and the lattice would show
  const fbm = function (x, y, layer, scale, octaves) {
    let value = 0;
    let amplitude = 0.5;
    let period = scale;

    for (let o = 0; o < octaves; o++) {
      value +=
        amplitude *
        noise(
          x * (period / scale) + 0.37 * (o + 1) + layer * 0.21,
          y * (period / scale) + 0.61 * (o + 1) + layer * 0.13,
          period,
          layer
        );
      amplitude /= 2;
      period *= 2;
    }

    return value;
  };

  return { noise: noise, fbm: fbm };
};

module.exports = {
  wrap: wrap,
  seededRandom: seededRandom,
  periodicNoise: periodicNoise,
};

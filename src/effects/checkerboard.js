module.exports = function (tgen) {
  // checkerboard
  tgen.effect(
    "checkerboard",
    {
      seed: null,
      blend: tgen.blendFlat(),
      rgba: "randomalpha",
      even: "random",
      size: [
        [2, 32],
        [2, 32],
      ],
    },
    function ($g, params) {
      params.even = $g.randItemByArraySeed(params.even, [true, false]);

      const width = $g.texture.width;
      const height = $g.texture.height;

      let sizeX, sizeY;
      let x, y, cx, cy;

      if (typeof params.size === "number") {
        sizeX = sizeY = params.size;
      } else {
        sizeX = params.size[0] = $g.randByArraySeed(params.size[0], null, true);
        sizeY = params.size[1] = $g.randByArraySeed(params.size[1], null, true);
      }

      // Pre-2.0 params: keep the original (non-seamless) cell sizing
      if ($g.legacy) {
        const cellX = Math.round(width / sizeX);
        const cellY = Math.round(height / sizeY);

        const drawCell = function (offsetX, offsetY) {
          for (x = 0; x < cellX; x++) {
            for (y = 0; y < cellY; y++) {
              if (x + offsetX < width && y + offsetY < height) {
                $g.point.set(x + offsetX, y + offsetY);
              }
            }
          }
        };

        for (cx = 0; cx < sizeX; cx++) {
          if (cx % 2 == 0) {
            for (cy = 0; cy < sizeY; cy++) {
              if (cy % 2 == 0) {
                drawCell(cx * cellX, cy * cellY);
              } else {
                drawCell(cx * cellX + cellX, cy * cellY);
              }
            }
          }
        }

        return params;
      }

      // Even cell counts so left/right (and top/bottom) alternate when tiled.
      // Do not mutate params.size — snap only at render time (like crosshatch).
      let cellsX = Math.max(2, sizeX);
      let cellsY = Math.max(2, sizeY);

      if (cellsX % 2) {
        cellsX += 1;
      }

      if (cellsY % 2) {
        cellsY += 1;
      }

      // Exact coverage: cell edges at round(i * dim / cells) — no gap/crop at wrap
      for (cx = 0; cx < cellsX; cx++) {
        for (cy = 0; cy < cellsY; cy++) {
          if ((cx + cy) % 2 !== 0) {
            continue;
          }

          const x0 = Math.round((cx * width) / cellsX);
          const x1 = Math.round(((cx + 1) * width) / cellsX);
          const y0 = Math.round((cy * height) / cellsY);
          const y1 = Math.round(((cy + 1) * height) / cellsY);

          for (x = x0; x < x1; x++) {
            for (y = y0; y < y1; y++) {
              $g.point.set(x, y);
            }
          }
        }
      }

      return params;
    }
  );
};

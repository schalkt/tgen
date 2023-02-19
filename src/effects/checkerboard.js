module.exports = function (tgen) {

  // checkerboard
  tgen.effect(
    "checkerboard",
    {
      seed: null,
      blend: tgen.blendFlat,
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
  );
};

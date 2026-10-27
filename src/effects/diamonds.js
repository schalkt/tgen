module.exports = function (tgen) {
  // diamonds
  tgen.effect(
    "diamonds",
    {
      seed: null,
      blend: tgen.blendFlat(),
      rgba: "randomalpha",
      origin: "random",
      layout: "random", // scatter, grid (harlequin)
      style: "random", // flat, faceted, gem
      shade: [0.35, 1], // brightness per diamond
      count: [1, 42],
      size: [
        [1, 77],
        [1, 77],
      ],
      gridX: [2, 12],
      gridY: [2, 12],
    },
    function ($g, params) {
      params.layout = $g.randItemByArraySeed(params.layout, [
        "scatter",
        "grid",
      ]);
      params.style = $g.randItemByArraySeed(params.style, [
        "flat",
        "faceted",
        "gem",
      ]);
      params.gridX = $g.randIntByArraySeed(params.gridX, [2, 12]);
      params.gridY = $g.randIntByArraySeed(params.gridY, [2, 12]);

      const rgba = params.rgba;

      const randShade = function () {
        if (typeof params.shade === "number") {
          return params.shade;
        }

        return $g.randRealSeed(params.shade[0], params.shade[1]);
      };

      // light factor of the pixel inside the diamond, d: 0 center, 1 edge
      const light = function (ix, iy, d) {
        let facet;

        switch (params.style) {
          case "faceted":
            // four facets lit from the top-left
            facet = ix < 0 ? (iy < 0 ? 1 : 0.6) : iy < 0 ? 0.8 : 0.4;
            return facet;

          case "gem":
            facet = ix < 0 ? (iy < 0 ? 1 : 0.7) : iy < 0 ? 0.85 : 0.55;
            return facet * (1 - d * 0.6);

          default:
            return 1;
        }
      };

      const drawDiamond = function (cx, cy, rx, ry, shade) {
        const fromX = Math.ceil(-rx);
        const toX = Math.floor(rx);
        const fromY = Math.ceil(-ry);
        const toY = Math.floor(ry);

        let ix, iy, d, l;

        for (ix = fromX; ix <= toX; ix++) {
          for (iy = fromY; iy <= toY; iy++) {
            d = Math.abs(ix) / rx + Math.abs(iy) / ry;

            if (d > 1) {
              continue;
            }

            l = light(ix, iy, d) * shade;
            $g.point.rgba = [rgba[0] * l, rgba[1] * l, rgba[2] * l, rgba[3]];
            $g.point.set(cx + ix, cy + iy);
          }
        }
      };

      let i, gx, gy, xys, radius;

      if (params.layout === "grid") {
        // two offset grids tile the plane without gaps (harlequin)
        const stepX = $g.texture.width / params.gridX;
        const stepY = $g.texture.height / params.gridY;
        const rx = stepX / 2;
        const ry = stepY / 2;

        for (gx = 0; gx < params.gridX; gx++) {
          for (gy = 0; gy < params.gridY; gy++) {
            drawDiamond(
              (gx + 0.5) * stepX,
              (gy + 0.5) * stepY,
              rx,
              ry,
              randShade()
            );
            drawDiamond(gx * stepX, gy * stepY, rx, ry, randShade());
          }
        }

        return params;
      }

      params.size[0] = $g.randByArraySeed(params.size[0], false);
      params.size[1] = $g.randByArraySeed(params.size[1], false);

      for (i = 0; i < params.count; i++) {
        xys = $g.xysize(i, params);
        radius = Math.max(1, $g.percentXY(xys.size));
        drawDiamond(
          $g.percentX(xys.x),
          $g.percentY(xys.y),
          radius,
          radius,
          randShade()
        );
      }

      return params;
    }
  );
};

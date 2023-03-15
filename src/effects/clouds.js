module.exports = function (tgen) {
  // clouds - midpoint displacement
  tgen.effect(
    "clouds",
    {
      seed: null,
      blend: tgen.blendSafe(),
      rgba: "randomalpha",
      roughness: [1, 32],
      colormap: null,
    },
    function ($g, params) {
      params.roughness = $g.randByArraySeed(params.roughness);

      const width = $g.texture.width;
      const height = $g.texture.height;
      const map = [];

      let x, y, xx, yy, color, center;
      let i, j, topLeft, topRight, bottomLeft, bottomRight;

      const generateMap = function () {
        for (x = 0; x <= width; x++) {
          map[x] = [];
          for (y = 0; y <= height; y++) {
            map[x][y] = 0;
          }
        }
      };

      const mapV = function (x, y, value) {
        x = Math.round(x);
        y = Math.round(y);

        if (x < 0) {
          x = width + x;
        }

        if (x >= width) {
          x = x - width;
        }

        if (y < 0) {
          y = height + y;
        }

        if (y >= height) {
          y = y - height;
        }

        if (value !== undefined) {
          map[x][y] = value;
        }

        return map[x][y];
      };

      const displace = function (num) {
        return (
          ($g.randRealSeed(0, 1) - 0.5) *
          ((num / (width + width)) * params.roughness)
        );
      };

      const generateCloud = function (step) {
        let stepHalf = step / 2;

        if (stepHalf <= 1) {
          return params;
        }

        for (i = 0; i <= width + stepHalf; i += stepHalf) {
          for (j = 0; j <= height + stepHalf; j += stepHalf) {
            topLeft = mapV(i - stepHalf, j - stepHalf);
            topRight = mapV(i, j - stepHalf);
            bottomLeft = mapV(i - stepHalf, j);
            bottomRight = mapV(i, j);

            x = i - stepHalf / 2;
            y = j - stepHalf / 2;

            // center
            center = mapV(
              x,
              y,
              $g.calc.normalize1(
                (topLeft + topRight + bottomLeft + bottomRight) / 4 +
                  displace(step)
              )
            );

            // left
            xx = i - step + stepHalf / 2;
            mapV(
              i - stepHalf,
              y,
              $g.calc.normalize1(
                (topLeft + bottomLeft + center + mapV(xx, y)) / 4 +
                  displace(step)
              )
            );

            // top
            yy = j - step + stepHalf / 2;
            mapV(
              x,
              j - stepHalf,
              $g.calc.normalize1(
                (topLeft + topRight + center + mapV(x, yy)) / 4 + displace(step)
              )
            );
          }
        }

        generateCloud(stepHalf);
      };

      // generate empty map
      generateMap();

      // generate cloud
      generateCloud(width);

      // render colormap
      $g.colormap.init(params.colormap, 255, function (cmap) {
        params.colormap = cmap;
      });

      // colorize
      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          color = parseInt(255 * map[x][y], 10);

          if ($g.colormap.data !== null) {
            $g.point.rgba = $g.colormap.get(color, params.rgba);
          } else {
            $g.point.rgba = $g.point.colorize(params.rgba, [
              color,
              color,
              color,
              255,
            ]);
          }

          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

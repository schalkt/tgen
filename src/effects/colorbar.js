module.exports = function (tgen) {
  // colorbar
  tgen.effect(
    "colorbar",
    {
      seed: null,
      blend: tgen.blendFlat(),
      type: "random",
      colormap: "random",
      mirror: true,
      repeat: [1, 4],
    },
    function ($g, params) {
      params.type = $g.randItemByArraySeed(params.type, [
        "vertical",
        "horizontal",
        "radial",
        "diamond",
      ]);

      params.repeat = $g.randByArraySeed(params.repeat);
      if (params.repeat < 1) {
        params.repeat = 1;
      }

      const width = $g.texture.width;
      const height = $g.texture.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
      const maxDiamondDist = centerX + centerY;

      let size =
        params.type == "horizontal"
          ? width
          : params.type == "vertical"
          ? height
          : params.type == "diamond"
          ? Math.ceil(maxDiamondDist * 2)
          : Math.ceil(maxDist * 2);
      let x, y, q, dist;

      // render colormap
      $g.colormap.init(params.colormap, size, function (cmap) {
        params.colormap = cmap;
      });

      if (params.type == "horizontal") {
        const patternWidth = width / params.repeat;
        for (x = 0; x < width; x++) {
          const patternX = x % patternWidth;
          if (params.mirror) {
            q = patternX < patternWidth / 2 ? patternX * 2 : patternWidth * 2 - patternX * 2;
            $g.point.rgba = $g.colormap.get(q);
          } else {
            $g.point.rgba = $g.colormap.get(patternX);
          }

          for (y = 0; y < height; y++) {
            $g.point.set(x, y);
          }
        }
      } else if (params.type == "vertical") {
        const patternHeight = height / params.repeat;
        for (y = 0; y < height; y++) {
          const patternY = y % patternHeight;
          if (params.mirror) {
            q = patternY < patternHeight / 2 ? patternY * 2 : patternHeight * 2 - patternY * 2;
            $g.point.rgba = $g.colormap.get(q);
          } else {
            $g.point.rgba = $g.colormap.get(patternY);
          }

          for (x = 0; x < width; x++) {
            $g.point.set(x, y);
          }
        }
      } else if (params.type == "radial") {
        const patternMaxDist = maxDist / params.repeat;
        for (x = 0; x < width; x++) {
          for (y = 0; y < height; y++) {
            dist = Math.sqrt(
              (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY)
            );
            // Repeat: a távolságot a pattern méretére normalizáljuk
            const patternDist = dist % patternMaxDist;
            if (params.mirror) {
              q = patternDist < patternMaxDist / 2 ? patternDist * 2 : patternMaxDist * 2 - patternDist * 2;
            } else {
              q = patternDist;
            }
            $g.point.rgba = $g.colormap.get(q);
            $g.point.set(x, y);
          }
        }
      } else if (params.type == "diamond") {
        const patternMaxDiamondDist = maxDiamondDist / params.repeat;
        for (x = 0; x < width; x++) {
          for (y = 0; y < height; y++) {
            // Manhattan távolság (L1 norma) - rombusz alakú zónákat ad
            dist = Math.abs(x - centerX) + Math.abs(y - centerY);
            // Repeat: a távolságot a pattern méretére normalizáljuk
            const patternDist = dist % patternMaxDiamondDist;
            if (params.mirror) {
              q = patternDist < patternMaxDiamondDist / 2 ? patternDist * 2 : patternMaxDiamondDist * 2 - patternDist * 2;
            } else {
              q = patternDist;
            }
            $g.point.rgba = $g.colormap.get(q);
            $g.point.set(x, y);
          }
        }
      }

      return params;
    }
  );
};

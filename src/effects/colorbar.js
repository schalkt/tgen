module.exports = function (tgen) {
  // colorbar
  tgen.effect(
    "colorbar",
    {
      seed: null,
      blend: tgen.blendFlat,
      type: "random",
      colormap: "random",
      mirror: true,
    },
    function ($g, params) {

      params.type = $g.randItemByArraySeed(params.type, [
        "vertical",
        "horizontal",
      ]);

      const width = $g.texture.width;
      const height = $g.texture.height;

      let size = params.type == "horizontal" ? width : height;
      let x, y, q;

      // render colormap
      $g.colormap.init(params.colormap, size, function (cmap) {
        params.colormap = cmap;
      });

      if (params.type == "horizontal") {

        for (x = 0; x < width; x++) {
          if (params.mirror) {
            q = x < width / 2 ? x * 2 : width * 2 - x * 2;
            $g.point.rgba = $g.colormap.get(q);
          } else {
            $g.point.rgba = $g.colormap.get(x);
          }

          for (y = 0; y < height; y++) {
            $g.point.set(x, y);
          }
        }

      } else {

        for (y = 0; y < height; y++) {
          if (params.mirror) {
            q = y < height / 2 ? y * 2 : height * 2 - y * 2;
            $g.point.rgba = $g.colormap.get(q);
          } else {
            $g.point.rgba = $g.colormap.get(y);
          }

          for (x = 0; x < width; x++) {
            $g.point.set(x, y);
          }
        }

      }

      return params;
    }
  );
};

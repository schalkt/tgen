module.exports = function (tgen) {
  // colorbar
  tgen.effect(
    "colorbar",
    {
      seed: null,
      type: "random",
      colormap: "random",
      mirror: true,
    },
    function ($g, params) {
      params.type = $g.randItemByArraySeed(params.type, [
        "vertical",
        "horizontal",
      ]);

      var width = $g.texture.width;
      var height = $g.texture.height;

      // render colormap
      var size = params.type == "horizontal" ? width : height;

      $g.colormap.init(params.colormap, size, function (cmap) {
        params.colormap = cmap;
      });

      var x, y, q;

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

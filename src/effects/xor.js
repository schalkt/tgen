(function (tgen) {
  // xor texture
  tgen.effect(
    "xor",
    {
      blend: "",
      rgba: "randomalpha",
      level: [1, 100],
      zoom: [0.1, 77],
    },
    function ($g, params) {
      var width = $g.texture.width;
      var height = $g.texture.height;

      params.zoom = $g.randIntByArraySeed(params.zoom, [1, 10]);

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          var color = (x * params.zoom) ^ (y * params.zoom);
          $g.point.rgba = $g.point.colorize(
            [color, color, color, 255],
            params.rgba,
            params.level
          );
          //$g.point.rgba = [color, color, color, 255];
          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
})(SeamlessTextureGenerator);

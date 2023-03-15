module.exports = function (tgen) {
  // xor texture
  tgen.effect(
    "xor",
    {
      seed: null,
      blend: "random",
      rgba: "randomalpha",
      level: [1, 100],
      zoom: [0.1, 77],
    },
    function ($g, params) {
      const width = $g.texture.width;
      const height = $g.texture.height;

      let x, y, color;

      params.zoom = $g.randIntByArraySeed(params.zoom, [1, 10]);

      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          color = (x * params.zoom) ^ (y * params.zoom);
          $g.point.rgba = $g.point.colorize(
            [color, color, color, 255],
            params.rgba,
            params.level
          );
          $g.point.set(x, y);
        }
      }

      return params;
    }
  );
};

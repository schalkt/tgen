module.exports = function (tgen) {
  // colorize
  tgen.filter(
    "colorize",
    {
      seed: null,
      level: [32, 192],
      rgba: "random",
      colormap: null,
    },
    function ($g, params) {

      params.level = $g.randByArraySeed(params.level);

      $g.colormap.init(params.colormap, 255, function (cmap) {
        params.colormap = cmap;
      });

      var avg, c;

      $g.walk(function (color) {
        
        if ($g.colormap.data) {
          
          avg = (color[0] + color[1] + color[2]) / 3;
          c = $g.colormap.get(avg, params.rgba);
          // preserve aplha
          c[3] = color[3];
          return c;

        } else {

          return $g.point.colorize(color, params.rgba, params.level);

        }

      });

      return params;
    }
  );
};

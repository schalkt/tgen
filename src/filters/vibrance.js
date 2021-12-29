(function (tgen) {
  // vibrance
  tgen.filter(
    "vibrance",
    {
      seed: null,
      adjust: [64, 192],
    },
    function ($g, params) {

      params.adjust = $g.randByArraySeed(params.adjust);
  
      var adjust = params.adjust * -1;

      $g.walk(function (color) {
        var avg = (color[0] + color[1] + color[2]) / 3;
        var max = Math.max(color[0], color[1], color[2]);
        var amt = (((Math.abs(max - avg) * 2) / 255) * adjust) / 100;

        if (color[0] !== max) {
          color[0] += (max - color[0]) * amt;
        }
        if (color[1] !== max) {
          color[1] += (max - color[1]) * amt;
        }
        if (color[2] !== max) {
          color[2] += (max - color[2]) * amt;
        }

        return [color[0], color[1], color[2], color[3]];
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);

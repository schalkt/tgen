(function (tgen) {
  // contrast
  // photoshop test ok with NO legacy mode
  tgen.filter(
    "contrast",
    {
      adjust: 50,
    },
    function ($g, params) {
      var adjust = (100 + params.adjust) / 100;

      $g.walk(function (color) {
        color[0] = ((color[0] / 255 - 0.5) * adjust + 0.5) * 255;
        color[1] = ((color[1] / 255 - 0.5) * adjust + 0.5) * 255;
        color[2] = ((color[2] / 255 - 0.5) * adjust + 0.5) * 255;

        return [
          Math.max(Math.min(color[0], 255), 0),
          Math.max(Math.min(color[1], 255), 0),
          Math.max(Math.min(color[2], 255), 0),
          color[3],
        ];
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);

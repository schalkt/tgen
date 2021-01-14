(function (tgen) {
  // gamma
  // photoshop test ok
  tgen.filter(
    "gamma",
    {
      adjust: 0.5,
    },
    function ($g, params) {
      $g.walk(function (color) {
        color[0] = Math.pow(color[0] / 255, 1 / params.adjust) * 255;
        color[1] = Math.pow(color[1] / 255, 1 / params.adjust) * 255;
        color[2] = Math.pow(color[2] / 255, 1 / params.adjust) * 255;

        return [color[0], color[1], color[2], color[3]];
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);

(function (tgen) {
  // opacity
  tgen.filter(
    "opacity",
    {
      adjust: 128,
    },
    function ($g, params) {
      $g.walk(function (color) {
        color[3] = params.adjust;
        return color;
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);

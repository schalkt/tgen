(function (tgen) {
  // fill a layer
  tgen.effect(
    "fill",
    {
      blend: "",
      rgba: "randomalpha",
    },
    function ($g, params) {
      $g.shape.rect($g, 1, 1, $g.texture.width, $g.texture.height);

      return params;
    }
  );
})(SeamlessTextureGenerator);

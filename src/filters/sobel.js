(function (tgen) {
  // sobel
  tgen.filter(
    "sobel",
    {
      type: 3,
    },
    function ($g, params) {
      $g.do("convolute", {
        store: false,
        transparent: false,
        weights: "sobel" + params.type,
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);

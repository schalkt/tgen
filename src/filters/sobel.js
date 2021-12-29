(function (tgen) {
  // sobel
  tgen.filter(
    "sobel",
    {
      seed: null,
      type: [1, 3],
    },
    function ($g, params) {

      params.type = $g.randByArraySeed(params.type);

      $g.do("convolute", {
        store: false,
        transparent: false,
        weights: "sobel" + params.type,
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);

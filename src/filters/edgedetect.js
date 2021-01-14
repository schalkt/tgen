(function (tgen) {
  // edgedetect
  tgen.filter(
    "edgedetect",
    {
      type: 1,
    },
    function ($g, params) {
      $g.do("convolute", {
        store: false,
        transparent: false,
        weights: "edgedetect" + params.type,
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);

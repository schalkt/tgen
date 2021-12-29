module.exports = function (tgen) {
  // emboss
  tgen.filter(
    "emboss",
    {
      seed: null,
      type: [1, 4],
    },
    function ($g, params) {
      params.type = $g.randByArraySeed(params.type);

      $g.do("convolute", {
        store: false,
        transparent: false,
        weights: "emboss" + params.type,
      });

      return params;
    }
  );
};

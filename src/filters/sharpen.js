module.exports = function (tgen) {
  // sharpen
  tgen.filter(
    "sharpen",
    {
      seed: null,
      type: [1, 2],
    },
    function ($g, params) {
      params.type = $g.randByArraySeed(params.type);

      $g.do("convolute", {
        store: false,
        transparent: false,
        weights: "sharpen" + params.type,
      });

      return params;
    }
  );
};

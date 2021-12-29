module.exports = function (tgen) {
  // edgedetect
  tgen.filter(
    "edgedetect",
    {
      seed: null,
      type: [1, 3],
    },
    function ($g, params) {

      params.type = $g.randByArraySeed(params.type);

      $g.do("convolute", {
        store: false,
        transparent: false,
        weights: "edgedetect" + params.type,
      });

      return params;
    }
  );
};

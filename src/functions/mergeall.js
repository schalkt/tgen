module.exports = function (tgen) {
  // merge all layers
  tgen.function(
    "mergeall",
    {
      blend: "opacity",
      firstcopy: true,
      opacity: null,
    },
    function ($g, params) {
      const length = $g.layers.length;

      for (let i = 0; i <= length; i++) {
        if (i === 0 && params.firstcopy === true) {
          $g.do("copy", {
            layer: 0,
          });
        } else {
          $g.do("merge", {
            blend: params.blend,
            layer: i,
            opacity: params.opacity,
          });
        }
      }

      return params;
    }
  );
};

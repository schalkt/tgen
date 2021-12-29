module.exports = function (tgen) {
  // blur
  tgen.filter("blur", {}, function ($g, params) {
    var divisor = 9;

    $g.do("convolute", {
      store: false,
      transparent: false,
      weights: [
        1 / divisor,
        1 / divisor,
        1 / divisor,
        1 / divisor,
        1 / divisor,
        1 / divisor,
        1 / divisor,
        1 / divisor,
        1 / divisor,
      ],
    });

    return params;
  });
};

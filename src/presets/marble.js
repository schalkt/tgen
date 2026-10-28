module.exports = function (tgen) {
  // white, green, black or gold marble, by the seed
  tgen.preset("marble", {
    width: 256,
    height: 256,

    items: [[0, "marble"]],
  });
};

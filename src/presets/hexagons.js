module.exports = function (tgen) {
  tgen.preset("hexagons", {
    width: 256,
    height: 256,
    items: [
      [0, "fill"],
      [
        0,
        "hexagons",
        {
          count: [2, 50],
          size: [
            [2, 12],
            [10, 22],
          ],
        },
      ],
      [
        0,
        "hexagons",
        {
          count: [1, 8],
          size: [
            [24, 44],
            [28, 56],
          ],
        },
      ]      
    ],
  });
};

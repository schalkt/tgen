module.exports = function (tgen) {
  tgen.preset("stars", {
    width: 256,
    height: 256,
    items: [
      [0, "fill"],
      [
        0,
        "stars",
        {
          count: [2, 72],
          size: [
            [2, 10],
            [6, 20],
          ],
        },
      ],
      [
        0,
        "stars",
        {
          count: [2, 24],
          size: [
            [10, 24],
            [24, 42],
          ],
        },
      ]
    ],
  });
};

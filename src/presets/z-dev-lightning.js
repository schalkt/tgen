module.exports = function (tgen) {
  tgen.preset("z-dev-lightning", {
    width: 256,
    height: 256,

    items: [
      [0, "fill", { rgba: [6, 8, 20, 255] }],
      [
        0,
        "electricity",
        {
          type: "bolt",
          colormap: "pickone",
          count: [1, 3],
          size: [200, 400],
        },
      ],
    ],
  });
};

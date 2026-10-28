module.exports = function (tgen) {
  tgen.preset("z-dev-julia", {
    width: 256,
    height: 256,

    items: [
      [0, "fill", { rgba: [0, 0, 0] }],
      [
        0,
        "julia",
        {
          blend: "opacity",
          rgba: "randomalpha",
          colormap: "random",
          iteration: [10, 200],
          threshold: 1,
          size: [200, 1000],
        },
      ],
    ],
  });
};

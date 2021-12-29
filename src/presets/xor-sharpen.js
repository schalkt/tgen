module.exports = function (tgen) {
  tgen.preset("xor-sharpen", {
    width: 512,
    height: 512,
    normalize: "pingpong",
    items: [
      [0, "fill", { rgba: [0, 0, 0] }],
      [
        0,
        "xor",
        {
          zoom: [1, 2],
        },
      ],
      [
        0,
        "xor",
        {
          zoom: [2, 4],
        },
      ],
      [
        0,
        "xor",
        {
          zoom: [4, 8],
        },
      ],

      [0, "sharpen"],

      [
        0,
        "contrast",
        {
          adjust: 42,
        },
      ],
    ],
  });
};

module.exports = function (tgen) {
  tgen.preset("z-dev", {
    width: 256,
    height: 256,
    normalize: "pingpong",
    items: [
      [
        0,
        "fill",
        {
          seed: 34598,
        },
      ],
      [
        0,
        "dots",
        {
          shape: null,
          blend: "random"
        },
      ],
      [
        0,
        "rot90",
        {
          blend: "random"
        },
      ]
    ],
  });
};

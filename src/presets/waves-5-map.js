module.exports = function (tgen) {
  tgen.preset("waves-5-map", {
    width: 256,
    height: 256,
    items: [
      [0, "waves"],
      [
        0,
        "waves",
        {
          blend: "difference",
        },
      ],
      [
        0,
        "waves",
        {
          blend: "linearburn",
        },
      ],
      [
        0,
        "waves",
        {
          blend: "difference",
        },
      ],
      [
        0,
        "waves",
        {
          blend: "linearburn",
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: ["multiply", "difference"],
        },
      ],
      [
        0,
        "brightness",
        {
          adjust: 10,
          legacy: true,
        },
      ],
      [
        0,
        "vibrance",
        {
          adjust: 10,
        },
      ],
      [0, "map"],
    ],
  });
};

module.exports = function (tgen) {
  tgen.preset("sci-fi-wall", {
    width: 256,
    height: 256,
    items: [
      [0, "waves", {}],
      [
        0,
        "dots",
        {
          blend: ["lighten", "opacity", "multiply"],
          shape: "rect",
          size: [20, 250],
          gridX: [2, 12],
          gridY: [2, 12],
          xsines: [2, 12],
          ysines: [2, 12],
        },
      ],
      [
        0,
        "dots",
        {
          blend: ["lighten", "opacity", "multiply"],
          shape: "rect",
          size: [20, 250],
          gridX: [2, 12],
          gridY: [2, 12],
          xsines: [2, 12],
          ysines: [2, 12],
        },
      ],
      [
        0,
        "sharpen",
        {
          type: 1,
        },
      ],
      [
        0,
        "spheres",
        {
          blend: ["multiply", "darken"],
          dynamic: true,
          opacity: 255,
        },
      ],
    ],
  });
};

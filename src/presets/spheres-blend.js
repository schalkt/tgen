module.exports = function (tgen) {
  tgen.preset("spheres-blend", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "fill",
        {
          blend: "opacity",
          rgba: "random",
        },
      ],
      [
        0,
        "spheres",
        {
          blend: "random",
          origin: "random",
          dynamic: true,
          count: 21,
          size: [10, 60],
        },
      ],
      [
        0,
        "spheres",
        {
          blend: "random",
          origin: "random",
          dynamic: true,
          count: 21,
          size: [10, 60],
        },
      ],
      [
        0,
        "spheres",
        {
          blend: "random",
          origin: "random",
          dynamic: true,
          count: 44,
          size: [10, 44],
        },
      ],
    ],
  });
};

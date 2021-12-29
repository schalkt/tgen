module.exports = function (tgen) {
  tgen.preset("z-dev", {
    width: 64,
    height: 64,
    normalize: "pingpong",
    items: [
      [
        0,
        "spheres",
        {
          seed: 346598,
        },
      ],
      [
        1,
        "spheres",
        {
          seed: 3465981,
        },
      ],
      [
        2,
        "copy",
        {
          layer: 0,
        },
      ],
      [
        2,
        "merge",
        {
          layer: 1,
          blend: "linearburn",
          opacity: 128,
        },
      ],
    ],
  });
};

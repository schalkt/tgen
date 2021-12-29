module.exports = function (tgen) {
  tgen.preset("spheres-map2", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          blend: "lighten",
          count: 21,
        },
      ],
      [
        1,
        "spheres",
        {
          blend: "lighten",
          count: 21,
        },
      ],
      [
        1,
        "merge",
        {
          layer: 0,
          blend: ["overlay", "lighten", "difference"],
        },
      ],
      [
        1,
        "map",
        {
          xamount: [21, 177],
          yamount: [21, 177],
          xchannel: [0, 3],
          ychannel: [0, 3],
          xlayer: [0, 1],
          ylayer: [0, 1],
        },
      ],
    ],
  });
};

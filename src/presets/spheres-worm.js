(function (tgen) {
  tgen.preset("spheres-worm", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          blend: ["lighten", "lineardodge"],
          count: [14, 21],
        },
      ],
      [
        1,
        "spheres",
        {
          blend: ["lighten", "lineardodge"],
          count: [14, 21],
        },
      ],
      [
        2,
        "merge",
        {
          layer: 0,
        },
      ],
      [
        2,
        "merge",
        {
          layer: 1,
          blend: "darken",
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);

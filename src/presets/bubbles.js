(function (tgen) {
  tgen.preset("bubbles", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "circles",
        {
          blend: "opacity",
          rgba: [
            [32, 255],
            [32, 255],
            [32, 255],
            [32, 200],
          ],
          count: [32, 48],
          size: [1, 5],
        },
      ],
      [
        0,
        "circles",
        {
          blend: "opacity",
          rgba: [
            [32, 255],
            [32, 255],
            [32, 255],
            [32, 200],
          ],
          count: [15, 20],
          size: [10, 15],
        },
      ],
      [
        0,
        "circles",
        {
          blend: "opacity",
          rgba: [
            [32, 255],
            [32, 255],
            [32, 255],
            [32, 200],
          ],
          count: [2, 3],
          size: [20, 25],
        },
      ],
      [
        0,
        "spheres",
        {
          blend: "softlight",
          dynamic: true,
        },
      ],
      [
        0,
        "circles",
        {
          blend: "softlight",
          opacity: 128,
        },
      ],
      [
        0,
        "noise",
        {
          blend: "softlight",
          opacity: 32,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);

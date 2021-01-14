(function (tgen) {
  tgen.preset("clouds", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "fill",
        {
          rgba: [0, [50, 150], [200, 255], 1],
        },
      ],
      [
        0,
        "clouds",
        {
          blend: "screen",
          rgba: [255, 255, 255, 1],
          roughness: [2, 5],
        },
      ],
      [
        0,
        "clouds",
        {
          blend: "overlay",
          rgba: [[0, 20], [0, 150], [200, 255], 1],
          roughness: [2, 4],
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);

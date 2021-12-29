(function (tgen) {
  tgen.preset("lines3", {
    width: 512,
    height: 512,
    items: [
      [0, "lines3", { "type": "horizontal", "weight": [1, 2], step: [2, 4, 8, 16, 32, 64] }],
      [0, "lines3", { "type": "horizontal", "weight": [2, 4], step: [4, 8, 16, 32, 64] }],
      [0, "lines3", { "type": "horizontal", "weight": [4, 8], step: [4, 8, 16, 32, 64] }],
    ],
  });
})(SeamlessTextureGenerator);

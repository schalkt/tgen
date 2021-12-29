(function (tgen) {
  tgen.preset("xor", {
    width: 256,
    height: 256,
    normalize: "pingpong",
    items: [
      [
        0,
        "xor",
        {
          zoom: [2, 8],
        },
      ],
      [
        0,
        "xor",
        {
          zoom: [4, 16],
        },
      ],
      [
        0,
        "xor",
        {
          zoom: [8, 32],
        },
      ]
    ],
  });
})(SeamlessTextureGenerator);

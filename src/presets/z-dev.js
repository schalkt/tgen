(function (tgen) {
  tgen.preset("z-dev", {
    width: 512,
    height: 512,
    normalize: "limitless",
    layers: [
      {
        "items": [
          [
            "fill",
            {
              seed: null,
              rgba: [0,0,0],
            },
          ],
          [
            "lines3",
            {
              seed: null,           
            },
          ],
          [
            "lines3",
            {
              seed: null,           
            },
          ]
        ],
      },     
    ],
  });
})(SeamlessTextureGenerator);

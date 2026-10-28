module.exports = function (tgen) {
  // dev: the new plasmas, an electric field on top and a faded rotate
  tgen.preset("z-dev-plasma", {
    width: 256,
    height: 256,

    items: [
      [0, "warpplasma", { rgba: [255, 255, 255, 255] }],
      [
        0,
        "blobplasma",
        {
          blend: "random",
          rgba: "randomalpha"
        },
      ],
      [
        0,
        "colorplasma",
        {
          blend: "random",
          rgba: "randomalpha"
        },
      ],
      [
        0,
        "electricity",
        {
          type: "field",
          blend: "random",
          colormap: "random",
          layers: [1, 10],
          glow: [0.1, 2.5],
        },
      ],     
    ],
  });
};

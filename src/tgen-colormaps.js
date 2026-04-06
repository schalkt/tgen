module.exports = function (tgen) {
  tgen.colormap("blackwhite", function () {
    return [
      { percent: 0, rgba: [0, 0, 0, 255] },
      { percent: 25, rgba: [255, 255, 255, 255] },
      { percent: 50, rgba: [0, 0, 0, 255] },
      { percent: 75, rgba: [255, 255, 255, 255] },
      { percent: 100, rgba: [0, 0, 0, 255] },
    ];
  });

  tgen.colormap("blackwhite2", function () {
    return [
      { percent: 0, rgba: [0, 0, 0, 255] },
      { percent: 100, rgba: [255, 255, 255, 255] },
    ];
  });

  tgen.colormap("grayscale", function () {
    return [
      { percent: 0, rgba: [0, 0, 0, 255] },
      { percent: 100, rgba: [255, 255, 255, 255] },
    ];
  });

  tgen.colormap("elevation", function () {
    return [
      { percent: 0, rgba: [252, 69, 27, 255] },
      { percent: 25, rgba: [245, 203, 39, 255] },
      { percent: 50, rgba: [104, 253, 163, 255] },
      { percent: 75, rgba: [27, 196, 253, 255] },
      { percent: 100, rgba: [88, 18, 252, 255] },
    ];
  });

  tgen.colormap("wiener-challah", function () {
    return [
      { percent: 0, rgba: [66, 53, 66, 255] },
      { percent: 25, rgba: [111, 68, 70, 255] },
      { percent: 50, rgba: [163, 90, 59, 255] },
      { percent: 75, rgba: [237, 155, 43, 255] },
      { percent: 100, rgba: [255, 240, 150, 255] },
    ];
  });

  tgen.colormap("parula", function () {
    return [
      { percent: 0, rgba: [53, 42, 135, 255] },
      { percent: 12.5, rgba: [3, 99, 225, 255] },
      { percent: 25, rgba: [20, 133, 212, 255] },
      { percent: 37.5, rgba: [6, 167, 198, 255] },
      { percent: 50, rgba: [56, 185, 158, 255] },
      { percent: 62.5, rgba: [146, 191, 115, 255] },
      { percent: 75, rgba: [217, 186, 86, 255] },
      { percent: 87.5, rgba: [252, 206, 46, 255] },
      { percent: 100, rgba: [249, 251, 14, 255] },
    ];
  });

  tgen.colormap("dawn", function () {
    return [
      { percent: 0, rgba: [255, 255, 192, 255] },
      { percent: 25, rgba: [255, 255, 128, 255] },
      { percent: 50, rgba: [255, 128, 128, 255] },
      { percent: 75, rgba: [128, 0, 128, 255] },
      { percent: 100, rgba: [0, 0, 128, 255] },
    ];
  });

  tgen.colormap("dusk", function () {
    return [
      { percent: 0, rgba: [255, 255, 255, 255] },
      { percent: 25, rgba: [255, 128, 255, 255] },
      { percent: 50, rgba: [128, 0, 255, 255] },
      { percent: 75, rgba: [0, 0, 128, 255] },
      { percent: 100, rgba: [0, 0, 0, 255] },
    ];
  });

  tgen.colormap("kryptonite", function () {
    return [
      { percent: 0, rgba: [255, 255, 255, 255] },
      { percent: 25, rgba: [255, 255, 128, 255] },
      { percent: 50, rgba: [128, 255, 0, 255] },
      { percent: 75, rgba: [0, 128, 0, 255] },
      { percent: 100, rgba: [0, 0, 0, 255] },
    ];
  });

  tgen.colormap("ice", function () {
    return [
      { percent: 0, rgba: [255, 255, 255, 255] },
      { percent: 25, rgba: [128, 255, 255, 255] },
      { percent: 50, rgba: [0, 128, 255, 255] },
      { percent: 75, rgba: [0, 0, 128, 255] },
      { percent: 100, rgba: [0, 0, 0, 255] },
    ];
  });

  tgen.colormap("fire", function () {
    return [
      { percent: 0, rgba: [255, 255, 255, 255] },
      { percent: 25, rgba: [255, 255, 128, 255] },
      { percent: 50, rgba: [255, 128, 0, 255] },
      { percent: 75, rgba: [128, 0, 0, 255] },
      { percent: 100, rgba: [0, 0, 0, 255] },
    ];
  });

  tgen.colormap("redblue", function () {
    return [
      { percent: 0, rgba: [96, 0, 0, 255] },
      { percent: 25, rgba: [192, 0, 0, 255] },
      { percent: 50, rgba: [255, 255, 255, 255] },
      { percent: 75, rgba: [0, 0, 192, 255] },
      { percent: 100, rgba: [0, 0, 96, 255] },
    ];
  });

  tgen.colormap("seashore", function () {
    return [
      { percent: 0, rgba: [255, 255, 192, 255] },
      { percent: 25, rgba: [255, 255, 128, 255] },
      { percent: 50, rgba: [128, 255, 128, 255] },
      { percent: 75, rgba: [0, 128, 128, 255] },
      { percent: 100, rgba: [0, 0, 128, 255] },
    ];
  });

  tgen.colormap("buda", function () {
    return [
      { percent: 0, rgba: [179, 1, 179, 255] },
      { percent: 11, rgba: [179, 43, 158, 255] },
      { percent: 22, rgba: [185, 72, 146, 255] },
      { percent: 33, rgba: [194, 97, 138, 255] },
      { percent: 44, rgba: [202, 121, 130, 255] },
      { percent: 56, rgba: [209, 145, 123, 255] },
      { percent: 67, rgba: [215, 170, 117, 255] },
      { percent: 78, rgba: [221, 195, 111, 255] },
      { percent: 89, rgba: [229, 223, 104, 255] },
      { percent: 100, rgba: [255, 255, 102, 255] },
    ];
  });

  tgen.colormap("ocean", function () {
    return [
      { percent: 0, rgba: [8, 24, 56, 255] },
      { percent: 25, rgba: [0, 72, 120, 255] },
      { percent: 50, rgba: [0, 140, 160, 255] },
      { percent: 75, rgba: [120, 200, 190, 255] },
      { percent: 100, rgba: [230, 245, 235, 255] },
    ];
  });

  tgen.colormap("forest", function () {
    return [
      { percent: 0, rgba: [12, 28, 18, 255] },
      { percent: 25, rgba: [34, 78, 42, 255] },
      { percent: 50, rgba: [72, 130, 58, 255] },
      { percent: 75, rgba: [140, 190, 96, 255] },
      { percent: 100, rgba: [210, 235, 160, 255] },
    ];
  });

  tgen.colormap("sunset", function () {
    return [
      { percent: 0, rgba: [32, 12, 48, 255] },
      { percent: 25, rgba: [120, 32, 88, 255] },
      { percent: 50, rgba: [220, 72, 58, 255] },
      { percent: 75, rgba: [255, 160, 72, 255] },
      { percent: 100, rgba: [255, 236, 180, 255] },
    ];
  });

  tgen.colormap("lavender", function () {
    return [
      { percent: 0, rgba: [40, 20, 72, 255] },
      { percent: 25, rgba: [88, 56, 140, 255] },
      { percent: 50, rgba: [150, 120, 200, 255] },
      { percent: 75, rgba: [200, 180, 230, 255] },
      { percent: 100, rgba: [245, 238, 252, 255] },
    ];
  });

  tgen.colormap("ember", function () {
    return [
      { percent: 0, rgba: [8, 4, 12, 255] },
      { percent: 20, rgba: [72, 8, 28, 255] },
      { percent: 40, rgba: [180, 32, 20, 255] },
      { percent: 60, rgba: [240, 100, 28, 255] },
      { percent: 80, rgba: [255, 190, 72, 255] },
      { percent: 100, rgba: [255, 252, 210, 255] },
    ];
  });

  tgen.colormap("mint", function () {
    return [
      { percent: 0, rgba: [16, 48, 52, 255] },
      { percent: 25, rgba: [28, 96, 92, 255] },
      { percent: 50, rgba: [64, 168, 148, 255] },
      { percent: 75, rgba: [150, 230, 200, 255] },
      { percent: 100, rgba: [232, 255, 248, 255] },
    ];
  });

  tgen.colormap("aurora", function () {
    return [
      { percent: 0, rgba: [10, 18, 48, 255] },
      { percent: 20, rgba: [24, 72, 96, 255] },
      { percent: 40, rgba: [32, 140, 110, 255] },
      { percent: 60, rgba: [90, 200, 160, 255] },
      { percent: 80, rgba: [140, 120, 220, 255] },
      { percent: 100, rgba: [220, 200, 255, 255] },
    ];
  });

  tgen.colormap("copper", function () {
    return [
      { percent: 0, rgba: [28, 18, 12, 255] },
      { percent: 25, rgba: [92, 52, 32, 255] },
      { percent: 50, rgba: [168, 96, 56, 255] },
      { percent: 75, rgba: [210, 150, 110, 255] },
      { percent: 100, rgba: [255, 220, 190, 255] },
    ];
  });

  tgen.colormap("sepia", function () {
    return [
      { percent: 0, rgba: [32, 22, 14, 255] },
      { percent: 25, rgba: [72, 52, 36, 255] },
      { percent: 50, rgba: [130, 98, 68, 255] },
      { percent: 75, rgba: [190, 160, 120, 255] },
      { percent: 100, rgba: [242, 228, 208, 255] },
    ];
  });

  tgen.colormap("neon", function () {
    return [
      { percent: 0, rgba: [8, 0, 32, 255] },
      { percent: 25, rgba: [64, 0, 120, 255] },
      { percent: 50, rgba: [0, 220, 255, 255] },
      { percent: 75, rgba: [255, 0, 200, 255] },
      { percent: 100, rgba: [255, 255, 120, 255] },
    ];
  });

  tgen.colormap("viridis", function () {
    return [
      { percent: 0, rgba: [68, 1, 84, 255] },
      { percent: 14, rgba: [72, 40, 120, 255] },
      { percent: 28, rgba: [62, 74, 137, 255] },
      { percent: 42, rgba: [38, 130, 142, 255] },
      { percent: 56, rgba: [31, 158, 137, 255] },
      { percent: 70, rgba: [53, 183, 121, 255] },
      { percent: 84, rgba: [109, 205, 89, 255] },
      { percent: 100, rgba: [253, 231, 37, 255] },
    ];
  });

  tgen.colormap("plasma", function () {
    return [
      { percent: 0, rgba: [13, 8, 135, 255] },
      { percent: 16, rgba: [84, 2, 163, 255] },
      { percent: 33, rgba: [139, 10, 165, 255] },
      { percent: 50, rgba: [185, 50, 137, 255] },
      { percent: 66, rgba: [219, 92, 104, 255] },
      { percent: 83, rgba: [244, 136, 73, 255] },
      { percent: 100, rgba: [240, 249, 33, 255] },
    ];
  });

};

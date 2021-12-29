(function (tgen) {

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
})(SeamlessTextureGenerator);

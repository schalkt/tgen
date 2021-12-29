module.exports = function (tgen) {
  // opacity
  tgen.blend("opacity", function ($g, c, i) {
    // opacity always calculated in the engine by alpha channel
    return i;
  });

  // multiply
  // photoshop test ok
  tgen.blend("multiply", function ($g, c, i) {
    i[0] = (c[0] * i[0]) / 255;
    i[1] = (c[1] * i[1]) / 255;
    i[2] = (c[2] * i[2]) / 255;
    return i;
  });

  // linearburn
  // photoshop test ok
  tgen.blend("linearburn", function ($g, c, i) {
    i[0] = c[0] + i[0] - 255;
    i[1] = c[1] + i[1] - 255;
    i[2] = c[2] + i[2] - 255;
    return i;
  });

  // difference
  // photoshop test FALSE
  tgen.blend("difference", function ($g, c, i) {
    i[0] = Math.abs(i[0] - c[0]);
    i[1] = Math.abs(i[1] - c[1]);
    i[2] = Math.abs(i[2] - c[2]);
    return i;
  });

  // difference-invert
  // photoshop test ok
  tgen.blend("difference-invert", function ($g, c, i) {
    i[0] = 255 - Math.abs(i[0] - c[0]);
    i[1] = 255 - Math.abs(i[1] - c[1]);
    i[2] = 255 - Math.abs(i[2] - c[2]);
    return i;
  });

  // screen
  // photoshop test ok
  tgen.blend("screen", function ($g, c, i) {
    i[0] = 255 - ((255 - c[0]) * (255 - i[0])) / 255;
    i[1] = 255 - ((255 - c[1]) * (255 - i[1])) / 255;
    i[2] = 255 - ((255 - c[2]) * (255 - i[2])) / 255;
    return i;
  });

  // overlay
  // photoshop test ok
  tgen.blend("overlay", function ($g, c, i) {
    i[0] =
      c[0] > 128
        ? 255 - (2 * (255 - i[0]) * (255 - c[0])) / 255
        : (c[0] * i[0] * 2) / 255;
    i[1] =
      c[1] > 128
        ? 255 - (2 * (255 - i[1]) * (255 - c[1])) / 255
        : (c[1] * i[1] * 2) / 255;
    i[2] =
      c[2] > 128
        ? 255 - (2 * (255 - i[2]) * (255 - c[2])) / 255
        : (c[2] * i[2] * 2) / 255;
    return i;
  });

  // exclusion
  // photoshop test ok
  tgen.blend("exclusion", function ($g, c, i) {
    i[0] = 128 - (2 * (c[0] - 128) * (i[0] - 128)) / 255;
    i[1] = 128 - (2 * (c[1] - 128) * (i[1] - 128)) / 255;
    i[2] = 128 - (2 * (c[2] - 128) * (i[2] - 128)) / 255;
    return i;
  });

  // darken
  // photoshop test ok
  tgen.blend("darken", function ($g, c, i) {
    i[0] = i[0] < c[0] ? i[0] : c[0];
    i[1] = i[1] < c[1] ? i[1] : c[1];
    i[2] = i[2] < c[2] ? i[2] : c[2];
    return i;
  });

  // lighten
  // photoshop test ok
  tgen.blend("lighten", function ($g, c, i) {
    i[0] = i[0] > c[0] ? i[0] : c[0];
    i[1] = i[1] > c[1] ? i[1] : c[1];
    i[2] = i[2] > c[2] ? i[2] : c[2];
    return i;
  });

  // lineardodge
  // photoshop test ok
  tgen.blend("lineardodge", function ($g, c, i) {
    i[0] = c[0] + i[0];
    i[1] = c[1] + i[1];
    i[2] = c[2] + i[2];
    return i;
  });

  // lineardodge-invert
  // photoshop test ok
  tgen.blend("lineardodge-invert", function ($g, c, i) {
    i[0] = 255 - (i[0] + c[0]);
    i[1] = 255 - (i[1] + c[1]);
    i[2] = 255 - (i[2] + c[2]);
    return i;
  });

  // linearlight
  // photoshop test ok
  tgen.blend("linearlight", function ($g, c, i) {
    i[0] = c[0] + 2 * i[0] - 255;
    i[1] = c[1] + 2 * i[1] - 255;
    i[2] = c[2] + 2 * i[2] - 255;
    return i;
  });

  // linearburn
  // photoshop test ok
  tgen.blend("linearburn", function ($g, c, i) {
    i[0] = c[0] + i[0] - 255;
    i[1] = c[1] + i[1] - 255;
    i[2] = c[2] + i[2] - 255;
    return i;
  });

  // softlight
  // photoshop NOT 100%
  tgen.blend("softlight", function ($g, c, i) {
    i[0] =
      c[0] > 128
        ? 255 - ((255 - c[0]) * (255 - (i[0] - 128))) / 255
        : (c[0] * (i[0] + 128)) / 255;
    i[1] =
      c[1] > 128
        ? 255 - ((255 - c[1]) * (255 - (i[1] - 128))) / 255
        : (c[1] * (i[1] + 128)) / 255;
    i[2] =
      c[2] > 128
        ? 255 - ((255 - c[2]) * (255 - (i[2] - 128))) / 255
        : (c[2] * (i[2] + 128)) / 255;
    return i;
  });

  // subbtract
  // photoshop test ok
  tgen.blend("subbtract", function ($g, c, i) {
    i[0] = Math.max(c[0] - i[0], 0);
    i[1] = Math.max(c[1] - i[1], 0);
    i[2] = Math.max(c[2] - i[2], 0);
    return i;
  });

  // backlight
  tgen.blend("backlight", function ($g, c, i) {
    c[0] = c[0] === 0 ? 0.001 : c[0];
    c[1] = c[1] === 0 ? 0.001 : c[1];
    c[2] = c[2] === 0 ? 0.001 : c[2];

    i[0] = (255 / c[0]) * (255 / i[0]);
    i[1] = (255 / c[1]) * (255 / i[1]);
    i[2] = (255 / c[2]) * (255 / i[2]);

    return i;
  });

  // average
  tgen.blend("average", function ($g, c, i) {
    i[0] = (i[0] + c[0]) / 2;
    i[1] = (i[1] + c[1]) / 2;
    i[2] = (i[2] + c[2]) / 2;

    return i;
  });

  // alphamap
  tgen.blend("alphamap", function ($g, c, i) {
    c[3] = (i[0] + i[1] + i[2]) / 3;

    return c;
  });
};

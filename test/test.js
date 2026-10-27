const assert = require("assert");
const fs = require("fs");
const PNG = require("pngjs").PNG;
const { exit } = require("process");
const tgen = require("./../src/tgen-base-with-presets.js");

const assertFloatEqual = (actual, expected, epsilon = 1e-9) => {
  assert.ok(
    Math.abs(actual - expected) < epsilon,
    `${actual} is not within ${epsilon} of ${expected}`
  );
};

const size = 64; // image width and height for testing, DON'T TOUCH!
const PNGOptions = {
  filterType: 0,
  width: size,
  height: size,
  colorType: 6,
  inputColorType: 6,
  bitDepth: 8,
};

const savePNG = function (generator, name, width, height) {

  const options = {...PNGOptions};

  options.width = width || PNGOptions.width;
  options.height = height || PNGOptions.height;

  const file = new PNG(options);
  file.data = generator.texture.data;

  if (!name) {
    name = 'test';
  }

  file.pack().pipe(fs.createWriteStream("./test/" + name + ".png"));

};

describe("tgen", function () {
  describe("init", function () {
    it("version ok", function () {
      assert.notStrictEqual(tgen.version, undefined);
      assert.notStrictEqual(tgen.version, null);
    });

    it("generator ok", function () {

      const generator = tgen.init();

      assert.notStrictEqual(generator, null);
      assert.notStrictEqual(generator.shape.rect, null);
      assert.notStrictEqual(generator.shape.circle, null);
      assert.notStrictEqual(generator.shape.line, null);
      assert.notStrictEqual(generator.shape.colorLine, null);
      assert.notStrictEqual(generator.shape.sphere, null);
      assert.notStrictEqual(generator.shape.pyramid, null);
    });

    it("presets ok", function () {
      assert.notStrictEqual(tgen.presets.dots, null);
      assert.notStrictEqual(tgen.presets.cells, null);
      assert.notStrictEqual(tgen.presets.clouds, null);
      assert.notStrictEqual(tgen.presets.fire, null);
      assert.notStrictEqual(tgen.presets.xor, null);
    });
  });

  describe("textures", function () {
    it("waves", function () {
      const generator = tgen.init(size, size, "pingpong");

      generator.do("waves", {
        blend: "screen",
        rgba: [255, 128, 64, 1],
        level: 50,
        xsines: 4,
        ysines: 4,
      });

      savePNG(generator, "waves");
      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "pingpong");
      assert.strictEqual(params.items[0][1], "waves");
      assert.strictEqual(params.items[0][2].blend, "screen");
      assert.strictEqual(params.items[0][2].level, 50);
      assert.strictEqual(params.items[0][2].xsines, 4);
      assert.strictEqual(params.items[0][2].ysines, 4);

      assert.strictEqual(generator.texture.data[0], 191);
      assertFloatEqual(generator.texture.data[1], 127.5);
      assertFloatEqual(generator.texture.data[2], 95.5);
      assert.strictEqual(generator.texture.data[3], 255);

      assertFloatEqual(generator.texture.data[4], 203.1501922607422);
      assertFloatEqual(generator.texture.data[5], 139.6501922607422);
      assertFloatEqual(generator.texture.data[6], 107.65019989013672);
      assert.strictEqual(generator.texture.data[7], 255);
    });

    it("clouds", function () {
      const generator = tgen.init(size, size, "pingpong");
      generator.do("clouds", {
        blend: "screen",
        rgba: [32, 64, 128, 1],
        roughness: 2,
        seed: 777,
      });

      savePNG(generator, "clouds");
      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "pingpong");
      assert.strictEqual(params.items[0][1], "clouds");
      assert.strictEqual(params.items[0][2].blend, "screen");
      assert.strictEqual(params.items[0][2].roughness, 2);
      assert.strictEqual(params.items[0][2].seed, 777);

      assert.strictEqual(generator.texture.data[0], 16);
      assert.strictEqual(generator.texture.data[1], 32);
      assert.strictEqual(generator.texture.data[2], 64);
      assert.strictEqual(generator.texture.data[3], 255);

      assert.strictEqual(generator.texture.data[4], 22);
      assert.strictEqual(generator.texture.data[5], 38);
      assert.strictEqual(generator.texture.data[6], 70);
      assert.strictEqual(generator.texture.data[7], 255);
    });

    it("spheres", function () {
      const generator = tgen.init(size, size, "limitless");
      generator.do("spheres", {
        blend: "lighten",
        rgba: [32, 64, 128, 1],
        dynamic: false,
        count: 7,
        size: [42, 77],
        seed: 777,
      });

      savePNG(generator, "spheres");
      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "spheres");
      assert.strictEqual(params.items[0][2].blend, "lighten");
      assert.strictEqual(params.items[0][2].dynamic, false);
      assert.strictEqual(params.items[0][2].count, 7);
      assert.strictEqual(params.items[0][2].size[0], 42);
      assert.strictEqual(params.items[0][2].size[1], 77);
      assert.strictEqual(params.items[0][2].seed, 777);

      assertFloatEqual(generator.texture.data[0], 17.248729705810547);
      assertFloatEqual(generator.texture.data[1], 34.497459411621094);
      assertFloatEqual(generator.texture.data[2], 68.99491882324219);
      assert.strictEqual(generator.texture.data[3], 255);

      assertFloatEqual(generator.texture.data[4], 18.42354965209961);
      assertFloatEqual(generator.texture.data[5], 36.84709930419922);
      assertFloatEqual(generator.texture.data[6], 73.69419860839844);
      assert.strictEqual(generator.texture.data[7], 255);
    });

    it("pyramids", function () {
      const generator = tgen.init(size, size, "limitless");
      generator.do("pyramids", {
        blend: "difference",
        rgba: [32, 255, 128, 1],
        dynamic: false,
        count: 7,
        size: [42, 77],
        seed: 777,
      });

      savePNG(generator, "pyramids");
      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "pyramids");
      assert.strictEqual(params.items[0][2].blend, "difference");
      assert.strictEqual(params.items[0][2].dynamic, false);
      assert.strictEqual(params.items[0][2].count, 7);
      assert.strictEqual(params.items[0][2].size[0], 42);
      assert.strictEqual(params.items[0][2].size[1], 77);
      assert.strictEqual(params.items[0][2].seed, 777);

      assertFloatEqual(generator.texture.data[0], 5.599999904632568);
      assertFloatEqual(generator.texture.data[1], 44.625);
      assertFloatEqual(generator.texture.data[2], 22.399999618530273);
      assert.strictEqual(generator.texture.data[3], 255);

      assertFloatEqual(generator.texture.data[4], 6.400000095367432);
      assert.strictEqual(generator.texture.data[5], 51);
      assertFloatEqual(generator.texture.data[6], 25.600000381469727);
      assert.strictEqual(generator.texture.data[7], 255);
    });

    it("checkerboard", function () {
      const generator = tgen.init(size, size, "limitless");

      generator.do("checkerboard", {
        blend: "lighten",
        rgba: [32, 255, 128, 1],
        even: true,
        seed: 777,
        size: [32, 32],
      });

      savePNG(generator, "checkerboard");
      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "checkerboard");
      assert.strictEqual(params.items[0][2].blend, "lighten");
      assert.strictEqual(params.items[0][2].size[0], 32);
      assert.strictEqual(params.items[0][2].size[1], 32);
      assert.strictEqual(params.items[0][2].seed, 777);

      const pixel1 = generator.texture.get(0, 0);
      const pixel2 = generator.texture.get(0, 2);

      assert.strictEqual(pixel1[0], 32);
      assert.strictEqual(pixel1[1], 255);
      assert.strictEqual(pixel1[2], 128);
      assert.strictEqual(pixel1[3], 255);

      assert.strictEqual(pixel2[0], 0);
      assert.strictEqual(pixel2[1], 0);
      assert.strictEqual(pixel2[2], 0);
      assert.strictEqual(pixel2[3], 255);
    });

    it("sphere-alpha", function () {
      const generator = tgen.init(size, size, "limitless");
      const items = [
        [0, "fill", { rgba: [128, 128, 128, 0.5] }],
        [
          1,
          "spheres",
          {
            blend: "opacity",
            origin: [50, 50],
            rgba: [255, 255, 255, 1],
            dynamic: true,
            count: 1,
            size: 100,
          },
        ],
        [2, "copy", { layer: 1 }],
        [2, "merge", { blend: "alphamap", layer: 1 }],
      ];

      generator.render({ items: items });

      savePNG(generator, "sphere-alpha");
      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "fill");
      assert.strictEqual(params.items[0][2].blend, "opacity");
      assert.strictEqual(params.items[1][1], "spheres");
      assert.strictEqual(params.items[1][2].size, 100);
      assert.strictEqual(params.items[2][1], "copy");
      assert.strictEqual(params.items[2][2].layer, 1);
      assert.strictEqual(params.items[3][1], "merge");
      assert.strictEqual(params.items[3][2].blend, "alphamap");

      const pixel0 = generator.texture.get(0, 0);
      const pixel1 = generator.texture.get(20, 20);
      const pixel2 = generator.texture.get(39, 39);
      const pixel3 = generator.texture.get(32, 56);
      const pixel4 = generator.texture.get(62, 62);

      assert.strictEqual(pixel0[0], 0);
      assert.strictEqual(pixel0[1], 0);
      assert.strictEqual(pixel0[2], 0);
      assert.strictEqual(pixel0[3], 0);

      assertFloatEqual(pixel1[0], 56.250404357910156);
      assertFloatEqual(pixel1[1], 56.250404357910156);
      assertFloatEqual(pixel1[2], 56.250404357910156);
      assertFloatEqual(pixel1[3], 56.250404357910156);

      assertFloatEqual(pixel2[0], 121.63109588623047);
      assertFloatEqual(pixel2[1], 121.63109588623047);
      assertFloatEqual(pixel2[2], 121.63109588623047);
      assertFloatEqual(pixel2[3], 121.63109588623047);

      assertFloatEqual(pixel3[0], 15.9375);
      assertFloatEqual(pixel3[1], 15.9375);
      assertFloatEqual(pixel3[2], 15.9375);
      assertFloatEqual(pixel3[3], 15.9375);

      assert.strictEqual(pixel4[0], 0);
      assert.strictEqual(pixel4[1], 0);
      assert.strictEqual(pixel4[2], 0);
      assert.strictEqual(pixel4[3], 0);
    });

  });


  describe("presets", function () {
    it("dots ok", function () {
      const generator = tgen.init(size, size);

      generator.render({
        preset: {
          name: "dots",
          seed: 4,
        },
      });

      savePNG(generator, "preset-dots");

      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "dots");
      assert.strictEqual(params.items[0][2].blend, "opacity");

      assertFloatEqual(generator.texture.data[0], -17.223899841308594);
      assertFloatEqual(generator.texture.data[1], -129.3643035888672);
      assertFloatEqual(generator.texture.data[2], -101.32923126220703);
      assert.strictEqual(generator.texture.data[3], 2295);

      assertFloatEqual(generator.texture.data[4], -28.270854949951172);
      assertFloatEqual(generator.texture.data[5], -156.5552978515625);
      assertFloatEqual(generator.texture.data[6], -124.48413848876953);
      assert.strictEqual(generator.texture.data[7], 2295);
    });
  });

  describe("blend-colormap safety", function () {
    it("colormap.get returns a copy", function () {
      const generator = tgen.init(size, size);

      generator.colormap.init("seashore", 255);
      const first = generator.colormap.get(128, [0, 0, 0, 200]);
      const before = first.slice();

      first[0] = 1;
      first[1] = 2;
      first[2] = 3;
      first[3] = 4;

      const second = generator.colormap.get(128, [0, 0, 0, 200]);

      assert.notStrictEqual(first, second);
      assert.strictEqual(second[0], before[0]);
      assert.strictEqual(second[1], before[1]);
      assert.strictEqual(second[2], before[2]);
      assert.strictEqual(second[3], 200);
    });

    it("multiply does not mutate stored point.rgba", function () {
      const generator = tgen.init(size, size);

      generator.texture.clear([128, 128, 128, 255]);
      generator.point.blend = "multiply";
      generator.point.rgba = [255, 128, 64, 255];

      const original = generator.point.rgba.slice();

      generator.point.set(0, 0);
      generator.point.set(1, 0);
      generator.point.set(2, 0);

      assert.strictEqual(generator.point.rgba[0], original[0]);
      assert.strictEqual(generator.point.rgba[1], original[1]);
      assert.strictEqual(generator.point.rgba[2], original[2]);
      assert.strictEqual(generator.point.rgba[3], original[3]);

      // Repeated multiply onto mid-gray must stay mid-bright, not collapse
      const pixel = generator.texture.get(2, 0);
      assert.ok(pixel[0] > 60, "R collapsed: " + pixel[0]);
      assert.ok(pixel[1] > 30, "G collapsed: " + pixel[1]);
      assert.ok(pixel[2] > 10, "B collapsed: " + pixel[2]);
    });

    it("clouds colormap multiply does not go near-black", function () {
      // Former z-error-blend regression: blend mutated colormap LUT refs
      const generator = tgen.init(size, size);

      generator.render({
        items: [
          [
            0,
            "clouds",
            {
              colormap: "redblue",
              seed: 32,
              roughness: 4,
              blend: "",
            },
          ],
          [
            1,
            "copy",
            {
              layer: 0,
            },
          ],
          [
            1,
            "clouds",
            {
              colormap: "seashore",
              blend: "multiply",
              seed: 211,
              roughness: 4,
            },
          ],
        ],
      });

      savePNG(generator, "blend-colormap-multiply");

      const data = generator.texture.data;
      let sum = 0;
      const pixels = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }

      const avg = sum / pixels;

      assert.ok(avg > 20, "texture avg too dark (LUT corruption?): " + avg);
      assert.ok(avg < 240, "texture avg unexpectedly flat: " + avg);
      assert.ok(
        Number.isFinite(data[0]) && Number.isFinite(data[1]),
        "non-finite pixel values"
      );
    });
  });

  describe("copy-merge", function () {
    it("copy by layer number", function () {
      const generator = tgen.init(size, size);

      generator.render({
        items: [
          [0, "fill", { rgba: [255, 0, 0, 255] }],
          [1, "fill", { rgba: [0, 0, 255, 255] }],
          [2, "copy", 0],
        ],
      });

      const params = generator.params();

      assert.strictEqual(params.items[2][2].layer, 0);
      assert.strictEqual(generator.texture.data[0], 255);
      assert.strictEqual(generator.texture.data[2], 0);
    });

    it("overlay ok", function () {
      const generator = tgen.init(size, size);

      generator.render({
        items: [
          [
            0,
            "spheres",
            {
              seed: 346598,
            },
          ],
          [
            1,
            "spheres",
            {
              seed: 3465981,
            },
          ],
          [
            2,
            "copy",
            {
              layer: 0,
            },
          ],
          [
            2,
            "merge",
            {
              layer: 1,
              blend: "linearburn",
              opacity: 128,
            },
          ],
        ],
      });

      savePNG(generator, "copy-merge");

      const params = generator.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "spheres");
      assert.strictEqual(params.items[3][2].blend, "linearburn");

      assertFloatEqual(generator.texture.data[0], -11.97750186920166);
      assertFloatEqual(generator.texture.data[1], 23.04226303100586);
      assertFloatEqual(generator.texture.data[2], 15.023548126220703);
      assert.strictEqual(generator.texture.data[3], 255);

      assertFloatEqual(generator.texture.data[4], -5.123913764953613);
      assertFloatEqual(generator.texture.data[5], 33.22109603881836);
      assertFloatEqual(generator.texture.data[6], 19.778152465820312);
      assert.strictEqual(generator.texture.data[7], 255);

      const clamped = generator.texture.export("clamped");

      assert.strictEqual(clamped[0], 0);
      assert.strictEqual(clamped[1], 23);
      assert.strictEqual(clamped[2], 15);
      assert.strictEqual(clamped[3], 255);
    });
  });

  it("test-pattern", function () {
    const sizePattern = 256;

    const generator = tgen.init(sizePattern, sizePattern, "limitless");
    generator.do("test-pattern");

    savePNG(generator, "test-pattern", sizePattern, sizePattern);
    const params = generator.params();

    assert.strictEqual(params.width, sizePattern);
    assert.strictEqual(params.height, sizePattern);
    assert.strictEqual(params.normalize, "limitless");
    assert.strictEqual(params.items[0][1], "brightness");
    assert.strictEqual(params.items[0][2].adjust, 50);
    assert.strictEqual(params.items[1][1], "vibrance");
    assert.strictEqual(params.items[1][2].adjust, 100);
    assert.strictEqual(params.items[2][1], "contrast");
    assert.strictEqual(params.items[2][2].adjust, 20);
    assert.strictEqual(params.items[3][1], "test-pattern");

    const pixel0 = generator.texture.get(0, 0);
    const pixel1 = generator.texture.get(20, 20);
    const pixel2 = generator.texture.get(39, 39);
    const pixel3 = generator.texture.get(32, 56);
    const pixel4 = generator.texture.get(62, 62);
    const pixel5 = generator.texture.get(236, 236);
    const pixel6 = generator.texture.get(19, 109);

    assert.strictEqual(pixel0[0], 255);
    assert.strictEqual(pixel0[1], 255);
    assert.strictEqual(pixel0[2], 255);
    assert.strictEqual(pixel0[3], 255);

    assertFloatEqual(pixel1[0], 214.67494201660156);
    assertFloatEqual(pixel1[1], 120.41922760009766);
    assertFloatEqual(pixel1[2], 96.25494384765625);
    assert.strictEqual(pixel1[3], 255);

    assertFloatEqual(pixel2[0], 215.4040985107422);
    
    assertFloatEqual(pixel2[2], 96.42085266113281);
    assert.strictEqual(pixel2[3], 255);
    

    assert.strictEqual(pixel3[0], 255);
    
    assertFloatEqual(pixel3[2], 24.52901840209961);
    assert.strictEqual(pixel3[3], 255);

    assertFloatEqual(pixel4[0], 214.0687713623047);
    assertFloatEqual(pixel4[1], 119.13373565673828);
    assertFloatEqual(pixel4[2], 98.00473022460938);
    assert.strictEqual(pixel4[3], 255);

    assertFloatEqual(pixel5[0], 228.55682373046875);
    assertFloatEqual(pixel5[1], 112.35067749023438);
    
    assert.strictEqual(pixel5[3], 255);

    assert.strictEqual(pixel6[0], 255);
    assertFloatEqual(pixel6[1], 185.81246948242188);
    assertFloatEqual(pixel6[2], 35.00555419921875);
    assert.strictEqual(pixel6[3], 255);
  });

});

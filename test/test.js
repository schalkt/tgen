var assert = require("assert");
var tgen = require("./../dist/tgen-with-presets");
var fs = require("fs");
var PNG = require("pngjs").PNG;

var size = 64; // image width and height for testing, DON'T TOUCH!
var PNGOptions = {
  filterType: 0,
  width: size,
  height: size,
  colorType: 6,
  inputColorType: 6,
  bitDepth: 8,
};

var savePNG = function (texture, name, width, height) {
  var options = Object.assign({}, PNGOptions);

  options.width = width ? width : PNGOptions.width;
  options.height = height ? height : PNGOptions.height;

  var file = new PNG(options);
  file.data = texture.texture.data;
  file.pack().pipe(fs.createWriteStream("./test/" + name + ".png"));
};

describe("tgen", function () {
  describe("init", function () {
    it("version ok", function () {
      assert.notStrictEqual(tgen.version, null);
    });

    it("generator ok", function () {
      var generator = tgen.init();

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
      var generator = tgen.init(size, size, "pingpong");
      var texture = generator.do("waves", {
        blend: "screen",
        rgba: [255, 128, 64, 1],
        level: 50,
        xsines: 4,
        ysines: 4,
      });

      savePNG(texture, "waves");
      var params = texture.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "pingpong");
      assert.strictEqual(params.items[0][1], "waves");
      assert.strictEqual(params.items[0][2].blend, "screen");
      assert.strictEqual(params.items[0][2].level, 50);
      assert.strictEqual(params.items[0][2].xsines, 4);
      assert.strictEqual(params.items[0][2].ysines, 4);

      assert.strictEqual(texture.texture.data[0], 191);
      assert.strictEqual(texture.texture.data[1], 127.5);
      assert.strictEqual(texture.texture.data[2], 95.5);
      assert.strictEqual(texture.texture.data[3], 255);

      assert.strictEqual(texture.texture.data[4], 203.1501922607422);
      assert.strictEqual(texture.texture.data[5], 139.6501922607422);
      assert.strictEqual(texture.texture.data[6], 107.65019989013672);
      assert.strictEqual(texture.texture.data[7], 255);
    });

    it("clouds", function () {
      var generator = tgen.init(size, size, "pingpong");
      var texture = generator.do("clouds", {
        blend: "screen",
        rgba: [32, 64, 128, 1],
        roughness: 2,
        seed: 777,
      });

      savePNG(texture, "clouds");
      var params = texture.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "pingpong");
      assert.strictEqual(params.items[0][1], "clouds");
      assert.strictEqual(params.items[0][2].blend, "screen");
      assert.strictEqual(params.items[0][2].roughness, 2);
      assert.strictEqual(params.items[0][2].seed, 777);

      assert.strictEqual(texture.texture.data[0], 16);
      assert.strictEqual(texture.texture.data[1], 32);
      assert.strictEqual(texture.texture.data[2], 64);
      assert.strictEqual(texture.texture.data[3], 255);

      assert.strictEqual(texture.texture.data[4], 22);
      assert.strictEqual(texture.texture.data[5], 38);
      assert.strictEqual(texture.texture.data[6], 70);
      assert.strictEqual(texture.texture.data[7], 255);
    });

    it("spheres", function () {
      var generator = tgen.init(size, size, "limitless");
      var texture = generator.do("spheres", {
        blend: "lighten",
        rgba: [32, 64, 128, 1],
        dynamic: false,
        count: 7,
        size: [42, 77],
        seed: 777,
      });

      savePNG(texture, "spheres");
      var params = texture.params();

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

      assert.strictEqual(texture.texture.data[0], 17.248729705810547);
      assert.strictEqual(texture.texture.data[1], 34.497459411621094);
      assert.strictEqual(texture.texture.data[2], 68.99491882324219);
      assert.strictEqual(texture.texture.data[3], 255);

      assert.strictEqual(texture.texture.data[4], 18.42354965209961);
      assert.strictEqual(texture.texture.data[5], 36.84709930419922);
      assert.strictEqual(texture.texture.data[6], 73.69419860839844);
      assert.strictEqual(texture.texture.data[7], 255);
    });

    it("pyramids", function () {
      var generator = tgen.init(size, size, "limitless");
      var texture = generator.do("pyramids", {
        blend: "difference",
        rgba: [32, 255, 128, 1],
        dynamic: false,
        count: 7,
        size: [42, 77],
        seed: 777,
      });

      savePNG(texture, "pyramids");
      var params = texture.params();

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

      assert.strictEqual(texture.texture.data[0], 5.599999904632568);
      assert.strictEqual(texture.texture.data[1], 44.625);
      assert.strictEqual(texture.texture.data[2], 22.399999618530273);
      assert.strictEqual(texture.texture.data[3], 255);

      assert.strictEqual(texture.texture.data[4], 6.400000095367432);
      assert.strictEqual(texture.texture.data[5], 51);
      assert.strictEqual(texture.texture.data[6], 25.600000381469727);
      assert.strictEqual(texture.texture.data[7], 255);
    });

    it("checkerboard", function () {
      var generator = tgen.init(size, size, "limitless");
      var texture = generator.do("checkerboard", {
        blend: "lighten",
        rgba: [32, 255, 128, 1],
        even: true,
        seed: 777,
        size: [32, 32],
      });

      savePNG(texture, "checkerboard");
      var params = texture.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "checkerboard");
      assert.strictEqual(params.items[0][2].blend, "lighten");
      assert.strictEqual(params.items[0][2].size[0], 32);
      assert.strictEqual(params.items[0][2].size[1], 32);
      assert.strictEqual(params.items[0][2].seed, 777);

      var pixel1 = texture.texture.get(0, 0);
      var pixel2 = texture.texture.get(0, 2);

      assert.strictEqual(pixel1[0], 32);
      assert.strictEqual(pixel1[1], 255);
      assert.strictEqual(pixel1[2], 128);
      assert.strictEqual(pixel1[3], 255);

      assert.strictEqual(pixel2[0], 0);
      assert.strictEqual(pixel2[1], 0);
      assert.strictEqual(pixel2[2], 0);
      assert.strictEqual(pixel2[3], 255);
    });

    it("test-pattern", function () {
      var sizePattern = 256;

      var generator = tgen.init(sizePattern, sizePattern, "limitless");
      var texture = generator.do("test-pattern");

      savePNG(texture, "test-pattern", sizePattern, sizePattern);
      var params = texture.params();

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
      assert.strictEqual(params.items[3][2].seed > 0, true);

      var pixel0 = texture.texture.get(0, 0);
      var pixel1 = texture.texture.get(20, 20);
      var pixel2 = texture.texture.get(39, 39);
      var pixel3 = texture.texture.get(32, 56);
      var pixel4 = texture.texture.get(62, 62);
      var pixel5 = texture.texture.get(236, 236);
      var pixel6 = texture.texture.get(19, 109);

      assert.strictEqual(pixel0[0], 255);
      assert.strictEqual(pixel0[1], 255);
      assert.strictEqual(pixel0[2], 255);
      assert.strictEqual(pixel0[3], 255);

      assert.strictEqual(pixel1[0], 214.67494201660156);
      assert.strictEqual(pixel1[1], 120.41922760009766);
      assert.strictEqual(pixel1[2], 96.25494384765625);
      assert.strictEqual(pixel1[3], 255);

      assert.strictEqual(pixel2[0], 215.4040985107422);
      assert.strictEqual(pixel2[1], 120.17605590820312);
      assert.strictEqual(pixel2[2], 96.42085266113281);
      assert.strictEqual(pixel2[3], 255);

      assert.strictEqual(pixel3[0], 255);
      assert.strictEqual(pixel3[1], 204.34658813476562);
      assert.strictEqual(pixel3[2], 24.52901840209961);
      assert.strictEqual(pixel3[3], 255);

      assert.strictEqual(pixel4[0], 214.0687713623047);
      assert.strictEqual(pixel4[1], 119.13373565673828);
      assert.strictEqual(pixel4[2], 98.00473022460938);
      assert.strictEqual(pixel4[3], 255);

      assert.strictEqual(pixel5[0], 228.55682373046875);
      assert.strictEqual(pixel5[1], 112.35067749023438);
      assert.strictEqual(pixel5[2], 116.86672973632812);
      assert.strictEqual(pixel5[3], 255);

      assert.strictEqual(pixel6[0], 255);
      assert.strictEqual(pixel6[1], 185.81246948242188);
      assert.strictEqual(pixel6[2], 35.00555419921875);
      assert.strictEqual(pixel6[3], 255);
    });

    it("sphere-alpha", function () {
      var generator = tgen.init(size, size, "limitless");
      var items = [
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

      var texture = generator.render({ items: items });

      savePNG(texture, "sphere-alpha");
      var params = texture.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "fill");
      assert.strictEqual(params.items[0][2].blend, "");
      assert.strictEqual(params.items[1][1], "spheres");
      assert.strictEqual(params.items[1][2].size, 100);
      assert.strictEqual(params.items[2][1], "copy");
      assert.strictEqual(params.items[2][2].layer, 1);
      assert.strictEqual(params.items[3][1], "merge");
      assert.strictEqual(params.items[3][2].blend, "alphamap");

      var pixel0 = texture.texture.get(0, 0);
      var pixel1 = texture.texture.get(20, 20);
      var pixel2 = texture.texture.get(39, 39);
      var pixel3 = texture.texture.get(32, 56);
      var pixel4 = texture.texture.get(62, 62);

      assert.strictEqual(pixel0[0], 0);
      assert.strictEqual(pixel0[1], 0);
      assert.strictEqual(pixel0[2], 0);
      assert.strictEqual(pixel0[3], 0);

      assert.strictEqual(pixel1[0], 56.250404357910156);
      assert.strictEqual(pixel1[1], 56.250404357910156);
      assert.strictEqual(pixel1[2], 56.250404357910156);
      assert.strictEqual(pixel1[3], 56.250404357910156);

      assert.strictEqual(pixel2[0], 121.63109588623047);
      assert.strictEqual(pixel2[1], 121.63109588623047);
      assert.strictEqual(pixel2[2], 121.63109588623047);
      assert.strictEqual(pixel2[3], 121.63109588623047);

      assert.strictEqual(pixel3[0], 15.9375);
      assert.strictEqual(pixel3[1], 15.9375);
      assert.strictEqual(pixel3[2], 15.9375);
      assert.strictEqual(pixel3[3], 15.9375);

      assert.strictEqual(pixel4[0], 0);
      assert.strictEqual(pixel4[1], 0);
      assert.strictEqual(pixel4[2], 0);
      assert.strictEqual(pixel4[3], 0);
    });
  });

  describe("presets", function () {
    it("dots ok", function () {
      var generator = tgen.init(size, size);

      var texture = generator.render({
        preset: {
          name: "dots",
          seed: 4,
        },
      });

      savePNG(texture, "preset-dots");

      var params = texture.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "dots");
      assert.strictEqual(params.items[0][2].blend, "opacity");

      assert.strictEqual(texture.texture.data[0], 118.41780090332031);
      assert.strictEqual(texture.texture.data[1], 14.728595733642578);
      assert.strictEqual(texture.texture.data[2], 40.65094757080078);
      assert.strictEqual(texture.texture.data[3], 2295);

      assert.strictEqual(texture.texture.data[4], 123.1143798828125);
      assert.strictEqual(texture.texture.data[5], 15.312732696533203);
      assert.strictEqual(texture.texture.data[6], 42.26314926147461);
      assert.strictEqual(texture.texture.data[7], 2295);
    });
  });

  describe("copy-merge", function () {
    it("overlay ok", function () {
      var generator = tgen.init(size, size);

      var texture = generator.render({
        items: [
          [
            0,
            "spheres",
            {
              seed: 9481,
            },
          ],
          [
            1,
            "spheres",
            {
              seed: 3845,
            },
          ],
          [2, "copy", 0],
          [
            2,
            "merge",
            {
              layer: 1,
              blend: "difference",
            },
          ],
        ],
      });

      savePNG(texture, "copy-merge");

      var params = texture.params();

      assert.strictEqual(params.width, size);
      assert.strictEqual(params.height, size);
      assert.strictEqual(params.normalize, "limitless");
      assert.strictEqual(params.items[0][1], "spheres");
      assert.strictEqual(params.items[3][2].blend, "difference");

      assert.strictEqual(texture.texture.data[0], 173.28090000152588);
      assert.strictEqual(texture.texture.data[1], 55.931830406188965);
      assert.strictEqual(texture.texture.data[2], 168.4103558063507);
      assert.strictEqual(texture.texture.data[3], 255);

      assert.strictEqual(texture.texture.data[4], 135.27759742736816);
      assert.strictEqual(texture.texture.data[5], 40.2001428604126);
      assert.strictEqual(texture.texture.data[6], 136.52849769592285);
      assert.strictEqual(texture.texture.data[7], 255);
    });
  });
});

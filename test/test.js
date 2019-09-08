var assert = require('assert');
var tgen = require('./../dist/tgen');
var fs = require('fs');
var PNG = require('pngjs').PNG;

var size = 64; // DON'T TOUCH
var PNGOptions = {
    filterType: 0,
    width: size,
    height: size,
    colorType: 6,
    inputColorType: 6,
    bitDepth: 8,
};

describe('tgen', function () {

    describe('init', function () {

        it('version ok', function () {
            assert.notEqual(tgen.version, null);
        });

        it('generator ok', function () {

            var generator = tgen.init();

            assert.notEqual(generator, null);
            assert.notEqual(generator.shape.rect, null);
            assert.notEqual(generator.shape.circle, null);
            assert.notEqual(generator.shape.line, null);
            assert.notEqual(generator.shape.colorLine, null);
            assert.notEqual(generator.shape.sphere, null);
            assert.notEqual(generator.shape.pyramid, null);

        });

    });

    describe('textures', function () {

        it('waves', function () {

            var generator = tgen.init(size, size, 'pingpong');
            var texture = generator.do('waves', {
                blend: 'screen',
                rgba: [255, 128, 64, 1],
                level: 50,
                xsines: 4,
                ysines: 4
            });

            var params = texture.params();

            assert.equal(params.width, size);
            assert.equal(params.height, size);
            assert.equal(params.normalize, 'pingpong');
            assert.equal(params.items[0][1], 'waves');
            assert.equal(params.items[0][2].blend, 'screen');
            assert.equal(params.items[0][2].level, 50);
            assert.equal(params.items[0][2].xsines, 4);
            assert.equal(params.items[0][2].ysines, 4);

            assert.equal(texture.texture.data[0], 191);
            assert.equal(texture.texture.data[1], 127.5);
            assert.equal(texture.texture.data[2], 95.5);
            assert.equal(texture.texture.data[3], 255);

            assert.equal(texture.texture.data[4], 203.1501922607422);
            assert.equal(texture.texture.data[5], 139.6501922607422);
            assert.equal(texture.texture.data[6], 107.65019989013672);
            assert.equal(texture.texture.data[7], 255);

            var file = new PNG(PNGOptions);
            file.data = texture.texture.data;
            file.pack().pipe(fs.createWriteStream('./test/waves.png'));

        });

        it('clouds', function () {

            var generator = tgen.init(size, size, 'pingpong');
            var texture = generator.do('clouds', {
                blend: 'screen',
                rgba: [32, 64, 128, 1],
                roughness: 2,
                seed: 777
            });

            var params = texture.params();

            assert.equal(params.width, size);
            assert.equal(params.height, size);
            assert.equal(params.normalize, 'pingpong');
            assert.equal(params.items[0][1], 'clouds');
            assert.equal(params.items[0][2].blend, 'screen');
            assert.equal(params.items[0][2].roughness, 2);
            assert.equal(params.items[0][2].seed, 777);

            assert.equal(texture.texture.data[0], 16);
            assert.equal(texture.texture.data[1], 32);
            assert.equal(texture.texture.data[2], 64);
            assert.equal(texture.texture.data[3], 255);

            assert.equal(texture.texture.data[4], 29.5);
            assert.equal(texture.texture.data[5], 45.5);
            assert.equal(texture.texture.data[6], 77.5);
            assert.equal(texture.texture.data[7], 255);

            var file = new PNG(PNGOptions);
            file.data = texture.texture.data;
            file.pack().pipe(fs.createWriteStream('./test/clouds.png'));

        });

        it('spheres', function () {

            var generator = tgen.init(size, size, 'limitless');
            var texture = generator.do('spheres', {
                blend: 'lighten',
                rgba: [32, 64, 128, 1],
                dynamic: false,
                count: 7,
                size: [
                    42,
                    77
                ],
                seed: 777
            });

            var params = texture.params();

            assert.equal(params.width, size);
            assert.equal(params.height, size);
            assert.equal(params.normalize, 'limitless');
            assert.equal(params.items[0][1], 'spheres');
            assert.equal(params.items[0][2].blend, 'lighten');
            assert.equal(params.items[0][2].dynamic, false);
            assert.equal(params.items[0][2].count, 7);
            assert.equal(params.items[0][2].size[0], 42);
            assert.equal(params.items[0][2].size[1], 77);
            assert.equal(params.items[0][2].seed, 777);
        
            assert.equal(texture.texture.data[0], 17.248729705810547);
            assert.equal(texture.texture.data[1], 34.497459411621094);
            assert.equal(texture.texture.data[2], 68.99491882324219);
            assert.equal(texture.texture.data[3], 255);

            assert.equal(texture.texture.data[4], 18.42354965209961);
            assert.equal(texture.texture.data[5], 36.84709930419922);
            assert.equal(texture.texture.data[6], 73.69419860839844);
            assert.equal(texture.texture.data[7], 255);

            var file = new PNG(PNGOptions);
            file.data = texture.texture.data;
            file.pack().pipe(fs.createWriteStream('./test/spheres.png'));

        });

        it('pyramids', function () {

            var generator = tgen.init(size, size, 'limitless');
            var texture = generator.do('pyramids', {
                blend: 'difference',
                rgba: [32, 255, 128, 1],
                dynamic: false,
                count: 7,
                size: [
                    42,
                    77
                ],
                seed: 777
            });

            var params = texture.params();

            assert.equal(params.width, size);
            assert.equal(params.height, size);
            assert.equal(params.normalize, 'limitless');
            assert.equal(params.items[0][1], 'pyramids');
            assert.equal(params.items[0][2].blend, 'difference');
            assert.equal(params.items[0][2].dynamic, false);
            assert.equal(params.items[0][2].count, 7);
            assert.equal(params.items[0][2].size[0], 42);
            assert.equal(params.items[0][2].size[1], 77);
            assert.equal(params.items[0][2].seed, 777);

            assert.equal(texture.texture.data[0], 5.599999904632568);
            assert.equal(texture.texture.data[1], 44.625);
            assert.equal(texture.texture.data[2], 22.399999618530273);
            assert.equal(texture.texture.data[3], 255);

            assert.equal(texture.texture.data[4], 5.915151596069336);
            assert.equal(texture.texture.data[5], 47.1363639831543);
            assert.equal(texture.texture.data[6], 23.660606384277344);
            assert.equal(texture.texture.data[7], 255);

            var file = new PNG(PNGOptions);
            file.data = texture.texture.data;
            file.pack().pipe(fs.createWriteStream('./test/pyramids.png'));

        });


        it('checkerboard', function () {

            var generator = tgen.init(size, size, 'limitless');
            var texture = generator.do('checkerboard', {
                blend: 'lighten',
                rgba: [32, 255, 128, 1],              
                even: true,
                seed: 777,
                size: [
                    32,
                    32
                ],
            });

            var params = texture.params();

            assert.equal(params.width, size);
            assert.equal(params.height, size);
            assert.equal(params.normalize, 'limitless');
            assert.equal(params.items[0][1], 'checkerboard');
            assert.equal(params.items[0][2].blend, 'lighten');            
            assert.equal(params.items[0][2].size[0], 32);
            assert.equal(params.items[0][2].size[1], 32);
            assert.equal(params.items[0][2].seed, 777);
            
            var pixel0 = texture.texture.get(0, 0);
            var pixel2 = texture.texture.get(0, 2);

            assert.equal(pixel0[0], 32);
            assert.equal(pixel0[1], 255);
            assert.equal(pixel0[2], 128);
            assert.equal(pixel0[3], 255);

            assert.equal(pixel2[0], 0);
            assert.equal(pixel2[1], 0);
            assert.equal(pixel2[2], 0);
            assert.equal(pixel2[3], 255);

            var file = new PNG(PNGOptions);
            file.data = texture.texture.data;
            file.pack().pipe(fs.createWriteStream('./test/checkerboard.png'));

        });

    });
});
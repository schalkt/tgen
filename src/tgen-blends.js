(function (fn) {

    var tgen = window[fn];

    // opacity
    tgen.blend('opacity', function ($g, current, input) {

        // opacity always calculated in the engine by alpha channel
        return input;

    });

    // multiply
    // photoshop test ok
    tgen.blend('multiply', function ($g, current, input) {

        input[0] = (current[0] * input[0]) / 255;
        input[1] = (current[1] * input[1]) / 255;
        input[2] = (current[2] * input[2]) / 255;
        return input;

    });

    // linearburn
    // photoshop test ok
    tgen.blend('linearburn', function ($g, current, input) {

        input[0] = current[0] + input[0] - 255;
        input[1] = current[1] + input[1] - 255;
        input[2] = current[2] + input[2] - 255;
        return input;

    });

    // difference
    // photoshop test FALSE
    tgen.blend('difference', function ($g, current, input) {

        input[0] = Math.abs(input[0] - current[0]);
        input[1] = Math.abs(input[1] - current[1]);
        input[2] = Math.abs(input[2] - current[2]);
        return input;

    });

    // difference-invert
    // photoshop test ok 
    tgen.blend('difference-invert', function ($g, current, input) {

        input[0] = 255 - Math.abs(input[0] - current[0]);
        input[1] = 255 - Math.abs(input[1] - current[1]);
        input[2] = 255 - Math.abs(input[2] - current[2]);
        return input;

    });

    // screen
    // photoshop test ok
    tgen.blend('screen', function ($g, current, input) {

        input[0] = 255 - (((255 - current[0]) * (255 - input[0])) / 255);
        input[1] = 255 - (((255 - current[1]) * (255 - input[1])) / 255);
        input[2] = 255 - (((255 - current[2]) * (255 - input[2])) / 255);
        return input;

    });

    // overlay
    // photoshop test ok
    tgen.blend('overlay', function ($g, current, input) {

        input[0] = (current[0] > 128) ? 255 - 2 * (255 - input[0]) * (255 - current[0]) / 255 : (current[0] * input[0] * 2) / 255;
        input[1] = (current[1] > 128) ? 255 - 2 * (255 - input[1]) * (255 - current[1]) / 255 : (current[1] * input[1] * 2) / 255;
        input[2] = (current[2] > 128) ? 255 - 2 * (255 - input[2]) * (255 - current[2]) / 255 : (current[2] * input[2] * 2) / 255;
        return input;

    });

    // exclusion
    // photoshop test ok
    tgen.blend('exclusion', function ($g, current, input) {

        input[0] = 128 - 2 * (current[0] - 128) * (input[0] - 128) / 255;
        input[1] = 128 - 2 * (current[1] - 128) * (input[1] - 128) / 255;
        input[2] = 128 - 2 * (current[2] - 128) * (input[2] - 128) / 255;
        return input;

    });

    // darken
    // photoshop test ok
    tgen.blend('darken', function ($g, current, input) {

        input[0] = (input[0] < current[0]) ? input[0] : current[0];
        input[1] = (input[1] < current[1]) ? input[1] : current[1];
        input[2] = (input[2] < current[2]) ? input[2] : current[2];
        return input;

    });

    // lighten
    // photoshop test ok
    tgen.blend('lighten', function ($g, current, input) {

        input[0] = (input[0] > current[0]) ? input[0] : current[0];
        input[1] = (input[1] > current[1]) ? input[1] : current[1];
        input[2] = (input[2] > current[2]) ? input[2] : current[2];
        return input;

    });

    // lineardodge
    // photoshop test ok
    tgen.blend('lineardodge', function ($g, current, input) {

        input[0] = current[0] + input[0];
        input[1] = current[1] + input[1];
        input[2] = current[2] + input[2];
        return input;

    });

    // lineardodge-invert
    // photoshop test ok
    tgen.blend('lineardodge-invert', function ($g, current, input) {

        input[0] = 255 - (input[0] + current[0]);
        input[1] = 255 - (input[1] + current[1]);
        input[2] = 255 - (input[2] + current[2]);
        return input;

    });

    // linearlight
    // photoshop test ok
    tgen.blend('linearlight', function ($g, current, input) {

        input[0] = current[0] + 2 * input[0] - 255;
        input[1] = current[1] + 2 * input[1] - 255;
        input[2] = current[2] + 2 * input[2] - 255;
        return input;

    });

    // linearburn
    // photoshop test ok
    tgen.blend('linearburn', function ($g, current, input) {

        input[0] = current[0] + input[0] - 255;
        input[1] = current[1] + input[1] - 255;
        input[2] = current[2] + input[2] - 255;
        return input;

    });

    // softlight
    // photoshop NOT 100%
    tgen.blend('softlight', function ($g, current, input) {

        input[0] = (current[0] > 128) ? 255 - ((255 - current[0]) * (255 - (input[0] - 128))) / 255 : (current[0] * (input[0] + 128)) / 255;
        input[1] = (current[1] > 128) ? 255 - ((255 - current[1]) * (255 - (input[1] - 128))) / 255 : (current[1] * (input[1] + 128)) / 255;
        input[2] = (current[2] > 128) ? 255 - ((255 - current[2]) * (255 - (input[2] - 128))) / 255 : (current[2] * (input[2] + 128)) / 255;
        return input;

    });

    // subbtract
    // photoshop test ok
    tgen.blend('subbtract', function ($g, current, input) {

        input[0] = Math.max(current[0] - input[0], 0);
        input[1] = Math.max(current[1] - input[1], 0);
        input[2] = Math.max(current[2] - input[2], 0);
        return input;

    });

    // backlight
    tgen.blend('backlight', function ($g, current, input) {

        input[0] = (255 / current[0]) * (255 / input[0]);
        input[1] = (255 / current[1]) * (255 / input[1]);
        input[2] = (255 / current[2]) * (255 / input[2]);
        return input;

    });

    // average
    tgen.blend('average', function ($g, current, input) {

        input[0] = (input[0] + current[0]) / 2;
        input[1] = (input[1] + current[1]) / 2;
        input[2] = (input[2] + current[2]) / 2;
        return input;

    }); 

})('tgen');
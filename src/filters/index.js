
module.exports = function (tgen) {

    require('./backlight.js')(tgen);
    require('./blur.js')(tgen);
    require('./brightness.js')(tgen);
    require('./channel.js')(tgen);
    require('./colorize.js')(tgen);
    require('./contrast.js')(tgen);
    require('./convolute.js')(tgen);
    require('./edgedetect.js')(tgen);
    require('./emboss.js')(tgen);
    require('./gamma.js')(tgen);
    require('./grayscale.js')(tgen);
    require('./invert.js')(tgen);
    require('./opacity.js')(tgen);
    require('./sharpen.js')(tgen);
    require('./sinecolor.js')(tgen);
    require('./sobel.js')(tgen);
    require('./threshold.js')(tgen);
    require('./vibrance.js')(tgen);

};
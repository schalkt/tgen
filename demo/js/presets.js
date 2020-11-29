$(document).ready(function() {

    // disable localStorage history
    tgen.config.historyLast = 0;

    // initialize the generator
    var generator = tgen.init();

    var addImage = function(key, canvas, selector) {
        var img = '<img src="' + canvas.toDataURL("image/png") + '" />';
        var images = $('<div class="img"><small>' + key + '</small>' + img + '</div>');
        $(selector).append(images);
    };

    for(var name in tgen.presets) {

        var preset = tgen.presets[name];
        preset.width = 128;
        preset.height = 128;
        var texture = generator.render(preset);

        addImage(preset.preset, texture.toCanvas(), '#presets');
    
    }

    $('.hideme').html('');

});
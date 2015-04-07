$(document).ready(function () {

    var texture = tgen();

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/javascript");


    $('.editor').on('click', function () {
        $('#panel').toggleClass('show');
    });

    $('.generate').on('click', function () {
        generate();
    });

    $('#presets').on('change', function (v) {
        paramsToEditor($(this).val());
    });

    $('.preset').each(function () {
        var id = $(this).attr('id');
        var name = $(this).attr('name');
        $('#presets').append($("<option></option>").attr("value", id).text(name));
    });

    var paramsToEditor = function (id) {

        if (id == 'editor') {
            return;
        }
        editor.setValue($('#' + id).text());

    }


    var editorToParams = function () {

        var preset = $('#presets').val();

        if (preset == "random") {
            presets = $('.preset');
            var count = presets.length;
            var index = Math.floor(Math.random() * (count - 1));
            var preset_id = $(presets[index]).attr('id');
            console.log(count, index, preset_id);
            paramsToEditor(preset_id);
        }

        var params = editor.getValue();
        return params.replace(/(var\sparams\s=\s|\s|\r\n|\r|\n)/gm, "");

    }

    var updateHistory = function () {

        var history = texture.history.list();
        $('#history').html('');
        $('#history').append($("<option></option>").attr("value", 0).text(''));

        for (var id in history) {
            var name = history[id].name;
            $('#history').append($("<option></option>").attr("value", id).text(name));
        }

    }

    $('#history').on('change', function () {

        $('#panel').addClass('show');
        $('#presets').val('editor');
        var params = texture.history.get($(this).val());
        editor.setValue(JSON.stringify(params, null, 2));
        generate();

    });


    $('.ace_text-input').keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
            $('#presets').val('editor');
            generate();
        }
    });

    $('.phases, #gallery').on('click', 'img', function () {

        $('#presets').val('editor');
        var params = $(this).attr('params');
        params = JSON.parse(params);
        params = JSON.stringify(params, null, 2);

        var src = $(this).attr('src');
        $('body').css('background-image', 'url(' + src + ')');

        editor.setValue(params);

    });

    var message = function (msg, timeout) {

        if (timeout !== undefined) {
            setTimeout(function () {
                if (msg == '') {
                    $('body').removeClass('msg');
                } else {
                    $('body').addClass('msg');
                }
                $('.message').text(msg);
            }, timeout);
        } else {
            if (msg == '') {
                $('body').removeClass('msg');
            } else {
                $('body').addClass('msg');
            }
            $('.message').text(msg);
        }

    };

    $('.upload, .sure .cancel').on('click', function () {

        $('.sure').toggleClass('show');

    });


    // upload to gallery
    $('.sure .ok').on('click', function () {

        $('body').addClass('uploading');
        $('.sure').removeClass('show');
        message('Uploading...');

        var data = {
            params: texture.history.last(),
            pngdata: texture.toCanvas().toDataURL("image/octet-stream")
        };

        $.ajax({
            type: "POST",
            url: 'http://tgen.storeking.hu/api/texture/upload',
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            success: function (res) {

                $('body').removeClass('uploading');

                if (res.status !== 'success') {

                    switch (res.statusCode) {
                        case 'error.duplicated':
                            message('Duplicated texture, upload skipped');
                            break;

                        default:
                            message(res.statusCode);
                            break;
                    }

                } else {
                    message('Uploading OK');
                }

                message('', 3500);

            },
            false: function () {
                message('Unknown upload error', 3500);
            }
        });


    });


    // show the gallery
    $('.gallery').on('click', function () {

        if ($('body').hasClass('galleryon')) {
            $('body').removeClass('galleryon');
            return;
        }

        $('body').addClass('galleryon');

        if ($('#gallery').hasClass('loaded')) {
            return;
        }

        message('Loading...');

        $.ajax({
            type: "GET",
            url: 'http://tgen.storeking.hu/api/texture/gallery',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            success: function (res) {

                if (res.status !== 'success') {
                    message(res.statusCode, 3500);
                    return;
                }

                message('', 200);
                $('#gallery').addClass('loaded');

                for (var i in res.data) {
                    var item = res.data[i];
                    var img = $('<span class="frame"><img params=\'' + item.params + '\' src="' + item.image + '"></span>');
                    img.appendTo('#gallery');
                }

                //$('#gallery').append('<div class="more">Show more</div>');

            },
            false: function () {
                message('Unknown gallery error', 3500);
            }
        });


    });


    updateHistory();

    var times = [];
    var count = 0;


    var generate = function () {

        if ($('body').hasClass('rendering')) {
            return;
        }

        $('body').addClass('rendering');
        message('Generating...');

        setTimeout(function () {

            texture.params(JSON.parse(editorToParams()));
            texture.stat(function (time) {

                times.push(time.elapsed);
                var sum = 0;

                for (key in times) {
                    sum += times[key];
                }

                $('.rendercount').text(++count);
                $('.rendertime').text(time.elapsed);
                $('.averagetime').text(Math.round((sum / times.length) * 100) / 100);

            });

            texture.getCanvas(function (canvas) {

                $('body').css('background-image', 'url(' + canvas.toDataURL("image/png") + ')');
                $('body').removeClass('rendering');

                updateHistory();

            });

            texture.getPhases(function (phases) {

                $('.phases').html('');

                var params = texture.history.last();

                for (var key in phases) {

                    var img = $('<img>');
                    var container = $('<span>');
                    img.attr('src', phases[key].toDataURL("image/png"));
                    img.attr('params', JSON.stringify(params));
                    img.appendTo(container);
                    container.appendTo('.phases');

                }

                message('');

            });

        }, 10);

        //var canvas = tgen(256).waves().waves({blend: 'difference'}).contrast({"adjust": 50}).toCanvas();
        //$('body').css('background-image', 'url(' + canvas.toDataURL("image/png") + ')');

    };

    var preset_id = $('.preset:first').attr('id');
    $('#presets').val(preset_id);
    paramsToEditor(preset_id);
    generate();


});
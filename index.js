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

    $('.3d').on('click', function () {

        if ($('body').hasClass('test3d')) {

            $('#three').html('');
            $('body').removeClass('test3d');
            test3D.stop();

        } else {
            $('body').addClass('test3d');
            test3D.start(texture.toCanvas());
        }

    });

    $('#presets').on('change', function (v) {
        paramsToEditor($(this).val());
    });

    $('.preset').each(function () {
        var id = $(this).attr('id');
        var title = $(this).attr('title');
        $('#presets').append($("<option></option>").attr("value", id).text(title));
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
        test3D.updateTexture(src);

    });

    var message = function (msg, timeout) {

        if (msg == '') {
            $('body').removeClass('msg');
        } else {
            $('body').addClass('msg');
        }

        $('.message').text(msg);

        if (timeout !== undefined) {
            setTimeout(function () {
                $('body').removeClass('msg');
                $('.message').text('');
            }, timeout);
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
            params: texture.params(),
            pngdata: texture.toCanvas().toDataURL("image/octet-stream")
        };

        $.ajax({
            type: "POST",
            url: 'http://seamless-texture.com/api/texture/upload',
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
            url: 'http://seamless-texture.com/api/texture/gallery',
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

        var to = setTimeout(function () {

            try {

                texture.render(JSON.parse(editorToParams()));
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

                    var params = texture.params();

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


            } catch (e) {

                clearTimeout(to);
                $('body').removeClass('rendering');
                message('Syntax error in params! ' + e.message, 9000);

            }

        }, 50);

        //var canvas = tgen(256).waves().waves({blend: 'difference'}).contrast({"adjust": 50}).toCanvas();
        //$('body').css('background-image', 'url(' + canvas.toDataURL("image/png") + ')');

    };


    var camera, scene, renderer, mesh1, mesh2, aframeid;
    var test3D = {

        start: function (canvas) {

            this.init(canvas);
            this.animate();

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);

            }

            window.addEventListener('resize', onWindowResize, false);

        },

        stop: function () {

            camera = null;
            scene = null;
            renderer = null;
            mesh1 = null;

            window.cancelAnimationFrame(aframeid);

        },

        animate: function () {

            aframeid = requestAnimationFrame(test3D.animate);

            mesh1.rotation.x += 0.005;
            mesh1.rotation.y += 0.009;
            mesh2.rotation.x += 0.007;
            mesh2.rotation.y += 0.010;

            renderer.render(scene, camera);

        },

        updateTexture: function (src) {


        },

        init: function (canvas) {

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            var element = document.getElementById('three');
            element.appendChild(renderer.domElement);

            scene = new THREE.Scene();

            // ------------------------- environment

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 100;

            scene.fog = new THREE.Fog(0x000000, 1, 300);


            // ------------------------- objects

            var geometry1 = new THREE.SphereGeometry(150, 150, 64);
            var texture1 = new THREE.Texture(canvas);
            texture1.anisotropy = renderer.getMaxAnisotropy();
            texture1.wrapS = THREE.RepeatWrapping;
            texture1.wrapT = THREE.RepeatWrapping;
            texture1.repeat.set(7, 7);
            texture1.needsUpdate = true;
            var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
            material1.transparent = false;

            mesh1 = new THREE.Mesh(geometry1, material1);
            mesh1.receiveShadow = true;
            scene.add(mesh1);

            var geometry2 = new THREE.SphereGeometry(40, 40, 64);
            var texture2 = new THREE.Texture(canvas);
            texture2.anisotropy = renderer.getMaxAnisotropy();
            texture2.wrapS = THREE.RepeatWrapping;
            texture2.wrapT = THREE.RepeatWrapping;
            texture2.repeat.set(4, 4);
            texture2.needsUpdate = true;
            var material2 = new THREE.MeshBasicMaterial({ map: texture2, side: THREE.DoubleSide });
            material2.transparent = false;

            mesh2 = new THREE.Mesh(geometry2, material2);
            mesh2.receiveShadow = true;
            scene.add(mesh2);

        }

    }

    var preset_id = $('.preset:first').attr('id');
    $('#presets').val(preset_id);
    paramsToEditor(preset_id);
    generate();


});

var test3D, texture, editor;

$(document).ready(function () {

    texture = tgen();

    editor = ace.edit("editor");
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

        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function () {
            test3D.updateCanvas(image);
        };
        image.src = src;


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

                texture.getCanvas(function (texture_canvas) {

                    $('body').css('background-image', 'url(' + texture_canvas.toDataURL("image/png") + ')');
                    $('body').removeClass('rendering');

                    updateHistory();
                    test3D.updateCanvas(texture_canvas);

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

    test3D = {

        camera: null,
        scene: null,
        renderer: null,
        canvas: null,
        mesh1: null,
        mesh2: null,
        texture1: null,
        texture2: null,
        animid: null,

        start: function () {

            this.canvas = texture.toCanvas();
            this.init();
            this.animate();

            function onWindowResize() {

                test3D.camera.aspect = window.innerWidth / window.innerHeight;
                test3D.camera.updateProjectionMatrix();
                test3D.renderer.setSize(window.innerWidth, window.innerHeight);

            }

            window.addEventListener('resize', onWindowResize, false);

        },

        stop: function () {

            //window.cancelAnimationFrame(test3D.animid);

            clearTimeout(test3D.animid);

            test3D.camera = null;
            test3D.scene = null;
            test3D.renderer = null;
            test3D.mesh1 = null;
            test3D.mesh2 = null;
            test3D.aframeid = null;

        },

        animate: function () {

            //test3D.animid = requestAnimationFrame(test3D.animate);

            test3D.animid = setTimeout(function () {
                test3D.animate();
            }, 1000 / 30);

            test3D.mesh1.rotation.x += 0.005;
            test3D.mesh1.rotation.y += 0.009;
            test3D.mesh2.rotation.x += 0.007;
            test3D.mesh2.rotation.y += 0.010;
            test3D.renderer.render(test3D.scene, test3D.camera);

        },

        updateCanvas: function (canvas) {

            if (this.canvas == null) {
                return;
            }

            var destCtx = this.canvas.getContext('2d');
            destCtx.drawImage(canvas, 0, 0);

            this.texture1.needsUpdate = true;
            this.texture2.needsUpdate = true;

        },


        init: function () {

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMapEnabled = false;

            var element = document.getElementById('three');
            element.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();

            // ------------------------- environment

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            this.camera.position.z = 100;
            this.camera.lookAt(new THREE.Vector3(-30, 0, 0));

            this.scene.fog = new THREE.Fog(0x000000, 1, 240);

            var light_ambient = new THREE.AmbientLight(0x404040);
            this.scene.add(light_ambient);

            var light_point = new THREE.PointLight(0xffffff, 1.2, 1000);
            light_point.position.set(100, 100, 100);
            this.scene.add(light_point);

            // ------------------------- objects

            this.texture1 = new THREE.Texture(this.canvas);
            this.texture1.anisotropy = this.renderer.getMaxAnisotropy();
            this.texture1.wrapS = THREE.RepeatWrapping;
            this.texture1.wrapT = THREE.RepeatWrapping;
            this.texture1.repeat.set(11, 11);
            var material1 = new THREE.MeshBasicMaterial({ map: this.texture1, side: THREE.DoubleSide });

            var geometry1 = new THREE.SphereGeometry(150, 150, 64);
            this.mesh1 = new THREE.Mesh(geometry1, material1);
            this.scene.add(this.mesh1);
            this.texture1.needsUpdate = true;

            this.texture2 = new THREE.Texture(this.canvas);
            this.texture2.anisotropy = this.renderer.getMaxAnisotropy();
            this.texture2.wrapS = THREE.RepeatWrapping;
            this.texture2.wrapT = THREE.RepeatWrapping;
            this.texture2.repeat.set(7, 7);

            var material2 = new THREE.MeshPhongMaterial({
                map: this.texture2,
                //side: THREE.DoubleSide,
                ambient: 0x000000,
                color: 0xffffff,
                specular: 0xf1f1f1,
                shininess: 12,
                bumpMap: this.texture2,
                bumpScale: 0.41,
                metal: false
            });

            var geometry2 = new THREE.SphereGeometry(40, 40, 64);
            this.mesh2 = new THREE.Mesh(geometry2, material2);
            this.scene.add(this.mesh2);
            this.texture2.needsUpdate = true;

//            var light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
//            light.position.set(140, 140, 140);
//            light.target.position.set(0, 0, 0);
//
//            light.castShadow = true;
//            light.shadowCameraNear = 1;
//            light.shadowCameraFar = 140;
//            light.shadowCameraFov = 75;
//            light.shadowCameraVisible = true;
//            light.shadowBias = 0.0001;
//            light.shadowDarkness = 0.5;
//            light.shadowMapWidth = 1024;
//            light.shadowMapHeight = 1024;
//            scene.add(light);

        }

    }

    var preset_id = $('.preset:first').attr('id');
    $('#presets').val(preset_id);
    paramsToEditor(preset_id);
    generate();


});

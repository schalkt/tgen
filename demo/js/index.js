let test3D,
  texture,
  editor,
  presets = [];
const urlparams = {};
let hash;
let q = document.URL.split("?")[1];

if (q != undefined) {
  q = q.split("&");
  for (let i = 0; i < q.length; i++) {
    hash = q[i].split("=");
    urlparams[hash[0]] = hash[1];
  }
}

$(document).ready(function () {
  texture = tgen.init();

  for (const name in tgen.presets) {
    presets.push(name);
    $("#presets").append($("<option></option>").attr("value", name).text(name));
  }

  $(".tgen-version").html("v" + tgen.version);

  editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.$blockScrolling = Infinity;
  editor.getSession().setMode("ace/mode/javascript");

  const applyEditorOpacity = function () {
    const pct = Number($("#editor-opacity").val());
    const alpha = (Number.isFinite(pct) ? pct : 85) / 100;
    $("#panel").css("--panel-alpha", String(alpha));
  };

  $("#editor-opacity").on("input change", applyEditorOpacity);
  applyEditorOpacity();

  const syncToggleLeds = function () {
    $(".editor").toggleClass("is-on", $("#panel").hasClass("show"));
    $(".3d").toggleClass("is-on", $("body").hasClass("test3d"));
  };

  $(".editor").on("click", function () {
    $("#panel").toggleClass("show");
    syncToggleLeds();
  });

  $(".generate").on("click", function () {
    generate();
  });

  const randomizeSeedsInParams = function (value) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        randomizeSeedsInParams(value[i]);
      }
      return value;
    }

    if (!value || typeof value !== "object") {
      return value;
    }

    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        continue;
      }

      if (key === "seed") {
        // Match tgen's resolved seed range (positive int)
        value[key] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
      } else if (value[key] && typeof value[key] === "object") {
        randomizeSeedsInParams(value[key]);
      }
    }

    return value;
  };

  const randomChannel = function () {
    return Math.floor(Math.random() * 256);
  };

  const randomizeRgbaValue = function (rgba) {
    if (rgba === "random" || rgba === undefined || rgba === null) {
      return [randomChannel(), randomChannel(), randomChannel(), 255];
    }

    if (rgba === "randomalpha") {
      return [
        randomChannel(),
        randomChannel(),
        randomChannel(),
        128 + Math.floor(Math.random() * 128),
      ];
    }

    if (!Array.isArray(rgba) || rgba.length < 3) {
      return rgba;
    }

    const next = rgba.slice();
    next[0] = randomChannel();
    next[1] = randomChannel();
    next[2] = randomChannel();
    // Keep alpha as-is when present
    if (next[3] === undefined || next[3] === null) {
      next[3] = 255;
    }
    return next;
  };

  const randomizeColorsInParams = function (value) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        randomizeColorsInParams(value[i]);
      }
      return value;
    }

    if (!value || typeof value !== "object") {
      return value;
    }

    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        continue;
      }

      if (key === "rgba") {
        value[key] = randomizeRgbaValue(value[key]);
      } else if (
        key === "colormap" &&
        typeof value[key] === "string" &&
        tgen.colormaps &&
        Object.keys(tgen.colormaps).length
      ) {
        const names = Object.keys(tgen.colormaps);
        value[key] = names[Math.floor(Math.random() * names.length)];
      } else if (value[key] && typeof value[key] === "object") {
        randomizeColorsInParams(value[key]);
      }
    }

    return value;
  };

  const readActiveParams = function () {
    let params = null;

    // Gallery/history loads go into editor with presets=editor (no regenerate).
    // Prefer that config; otherwise use last rendered texture params.
    if ($("#presets").val() === "editor") {
      const raw = editorToParams();
      if (raw) {
        params = JSON.parse(raw);
      }
    }

    if (!params || !params.items) {
      params = getRenderedParams();
    }

    if (!params || !params.items) {
      const raw = editorToParams();
      if (raw) {
        params = JSON.parse(raw);
      }
    }

    return params;
  };

  const applyRandomizedParams = function (mutateFn) {
    let params = null;

    try {
      params = readActiveParams();
    } catch (e) {
      message("Cannot read texture params", 2500);
      console.error(e);
      return;
    }

    if (!params || !params.items) {
      message("Generate a texture first", 2500);
      return;
    }

    params = JSON.parse(JSON.stringify(params));
    mutateFn(params);

    $("#presets").val("editor");
    editor.setValue(JSON.stringify(params, null, 2));

    const beautify = ace.require("ace/ext/beautify");
    if (beautify) {
      beautify.beautify(editor.session);
    }

    generate();
  };

  $(".random-seed").on("click", function () {
    applyRandomizedParams(randomizeSeedsInParams);
  });

  $(".random-colors").on("click", function () {
    applyRandomizedParams(randomizeColorsInParams);
  });

  $(document).on("click", ".download", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const canvas = getRenderedCanvas();
    if (!canvas) {
      message("Generate a texture first", 2500);
      return;
    }

    try {
      const link = document.createElement("a");
      link.download = "tgen-" + Date.now() + ".png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      message("Download failed", 2500);
      console.error(err);
    }
  });

  $(".3d").on("click", function () {
    if ($("body").hasClass("test3d")) {
      $("#three").html("");
      $("body").removeClass("test3d");
      test3D.stop();
    } else {
      test3D.fps = Number($("#preview3d-fps").val()) || 30;
      $("body").addClass("test3d");
      test3D.start();
    }

    syncToggleLeds();
  });

  $(".changescene").on("click", function () {
    if (!test3D || !test3D.renderer) {
      return;
    }

    test3D.sceneNumber = test3D.sceneNumber == 1 ? 2 : 1;
    $("#mat-mapping").val(test3D.sceneMapping[test3D.sceneNumber]);
    test3D.syncOrbitControls();
    test3D.syncPostprocessingTarget();

    // Pause alatt is azonnal váltson a megjelenített scene
    if (test3D.paused) {
      test3D.updateActiveReflection();
      test3D.renderOnce();
    }
  });

  $(".pause3d").on("click", function () {
    if (!$("body").hasClass("test3d")) {
      return;
    }

    if (test3D.paused) {
      test3D.resume();
    } else {
      test3D.pause();
    }
  });

  $(".reset3d").on("click", function () {
    if (!$("body").hasClass("test3d") || !test3D) {
      return;
    }

    $("#preview3d-fps").val(30);
    $("#env-preset").val("default");
    $("#fx-bloom, #fx-dof").prop("checked", false);
    test3D.sceneMapping = Object.assign({}, test3D.projectionDefaults);
    applyMaterialPreset("glossy");

    const textureCanvas = test3D.canvas;
    test3D.stop();
    test3D.sceneNumber = 2;
    test3D.fps = 30;
    test3D.envPreset = "default";
    test3D.start(textureCanvas || undefined);
    applyMaterialSettings();
    test3D.syncPostFxFromUi();
  });

  $("#fx-bloom, #fx-dof").on("change", function () {
    if (!test3D || !test3D.post) {
      return;
    }
    test3D.syncPostFxFromUi();
    test3D.renderOnce();
  });

  $("#env-preset").on("change", function () {
    if (!test3D || !test3D.renderer) {
      return;
    }

    test3D.applyEnvironmentPreset($(this).val());
  });

  $("#preview3d-fps").on("change input", function () {
    if (!test3D) {
      return;
    }

    test3D.fps = Number($(this).val());
    test3D.resetFpsMeter();

    // Pause alatt is azonnal érvényesüljön a következő play-hez
    if (test3D.paused) {
      test3D.lastFrameTime = 0;
      test3D.prevRenderTime = 0;
    }
  });

  const updateMatValueLabels = function () {
    $(".mat-value").each(function () {
      const inputId = $(this).attr("data-for");
      const input = $("#" + inputId);
      if (!input.length) {
        return;
      }

      const value = Number(input.val());
      if (input.attr("step") && String(input.attr("step")).indexOf(".") !== -1) {
        $(this).text(value.toFixed(2));
      } else {
        $(this).text(String(value));
      }
    });
  };

  const materialPresets = {
    default: {
      shininess: 88,
      bumpscale: 0.12,
      reflectivity: 0.95,
      specular: 255,
      repeat: 1,
      metal: false,
    },
    matte: {
      shininess: 4,
      bumpscale: 0.25,
      reflectivity: 0.12,
      specular: 35,
      repeat: 1,
      metal: false,
    },
    glossy: {
      shininess: 12,
      bumpscale: 1.77,
      reflectivity: 0.25,
      specular: 241,
      repeat: 1,
      metal: false,
    },
    metal: {
      shininess: 72,
      bumpscale: 0.35,
      reflectivity: 1,
      specular: 255,
      repeat: 1,
      metal: true,
    },
  };

  let applyingMaterialPreset = false;

  const applyMaterialPreset = function (presetId) {
    const preset = materialPresets[presetId] || materialPresets.default;
    const id = materialPresets[presetId] ? presetId : "default";

    applyingMaterialPreset = true;
    $("#mat-preset").val(id);
    $("#mat-shininess").val(preset.shininess);
    $("#mat-bumpscale").val(preset.bumpscale);
    $("#mat-reflectivity").val(preset.reflectivity);
    $("#mat-specular").val(preset.specular);
    $("#mat-repeat").val(preset.repeat);
    $("#mat-metal").prop("checked", !!preset.metal);
    applyingMaterialPreset = false;

    applyMaterialSettings();
  };

  const applyMaterialSettings = function () {
    if (!test3D || !test3D.editableMaterials) {
      return;
    }

    const shininess = Number($("#mat-shininess").val());
    const bumpScale = Number($("#mat-bumpscale").val());
    const reflectivity = Number($("#mat-reflectivity").val());
    const specular = Number($("#mat-specular").val());
    const repeat = Number($("#mat-repeat").val());
    const metal = $("#mat-metal").is(":checked");
    const roughness = Math.max(
      0.04,
      1 - shininess / 100 - (specular / 255) * 0.25
    );
    const metalness = metal ? 1 : 0;
    const envMapIntensity = reflectivity * (0.5 + (specular / 255) * 1.5);
    const phongReflectivity = metal
      ? Math.max(reflectivity, 0.85)
      : reflectivity;
    const phongShininess = metal ? Math.max(shininess, 60) : shininess;

    updateMatValueLabels();

    for (let i = 0; i < test3D.editableMaterials.length; i++) {
      const material = test3D.editableMaterials[i];
      if (!material) {
        continue;
      }

      if (material.bumpScale !== undefined) {
        material.bumpScale = bumpScale;
      }

      // Reflective sphere/cube use Phong (fake env reflections)
      if (material.isMeshPhongMaterial) {
        material.shininess = phongShininess;
        material.reflectivity = phongReflectivity;
        if (material.specular && material.specular.setRGB) {
          material.specular.setRGB(
            specular / 255,
            specular / 255,
            specular / 255
          );
        }
      }

      // Floor / other PBR materials
      if (material.isMeshStandardMaterial) {
        material.roughness = roughness;
        material.metalness = metalness;
        if (material.envMapIntensity !== undefined) {
          material.envMapIntensity = envMapIntensity;
        }
      }

      material.needsUpdate = true;
    }

    // big objects (sky sphere, ceiling, floor) repeat more than the near ones
    const textures = [
      [test3D.texture1, test3D.largeRepeat],
      [test3D.texture2, 1],
      [test3D.texture3, 1],
      [test3D.texture4, test3D.largeRepeat],
      [test3D.bump1, test3D.largeRepeat],
      [test3D.bump2, 1],
      [test3D.bump3, 1],
      [test3D.bump4, test3D.largeRepeat],
    ];

    for (let t = 0; t < textures.length; t++) {
      const texture = textures[t][0];
      if (!texture) {
        continue;
      }
      texture.repeat.set(repeat * textures[t][1], repeat * textures[t][1]);
      texture.needsUpdate = true;
    }

    test3D.applyProjection(repeat);

    // paused: the mirror (CubeCamera) must be re-rendered too, so it shows
    // the new repeat / mapping, not the old one
    if (test3D.paused && typeof test3D.renderOnce === "function") {
      test3D.updateActiveReflection();
      test3D.renderOnce();
    }
  };

  // projection is per scene and not part of the material presets
  $("#mat-mapping").on("change", function () {
    test3D.sceneMapping[test3D.sceneNumber] = $(this).val();
    applyMaterialSettings();
  });

  $("#mat-preset").on("change", function () {
    const presetId = $(this).val();
    if (presetId === "custom") {
      return;
    }
    applyMaterialPreset(presetId);
  });

  $(".preview3d-materials").on(
    "input change",
    "input[type='range'], input[type='checkbox']",
    function () {
      if (!applyingMaterialPreset) {
        $("#mat-preset").val("custom");
      }
      applyMaterialSettings();
    }
  );

  const getMaterialExportPayload = function () {
    const shininess = Number($("#mat-shininess").val());
    const bumpScale = Number($("#mat-bumpscale").val());
    const reflectivity = Number($("#mat-reflectivity").val());
    const specular = Number($("#mat-specular").val());
    const repeat = Number($("#mat-repeat").val());
    const metal = $("#mat-metal").is(":checked");
    const roughness = Math.max(
      0.04,
      1 - shininess / 100 - (specular / 255) * 0.25
    );
    const metalness = metal ? 1 : 0;
    const envMapIntensity = reflectivity * (0.5 + (specular / 255) * 1.5);
    const phongReflectivity = metal
      ? Math.max(reflectivity, 0.85)
      : reflectivity;
    const phongShininess = metal ? Math.max(shininess, 60) : shininess;
    const specularNorm = specular / 255;

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      ui: {
        preset: $("#mat-preset").val() || "custom",
        envPreset: $("#env-preset").val() || "default",
        shininess: shininess,
        bumpScale: bumpScale,
        reflectivity: reflectivity,
        specular: specular,
        repeat: repeat,
        metal: metal,
        mapping: $("#mat-mapping").val() || "uv",
      },
      texture: {
        wrapS: "RepeatWrapping",
        wrapT: "RepeatWrapping",
        repeat: [repeat, repeat],
        colorSpace: "SRGBColorSpace",
        bumpColorSpace: "NoColorSpace",
      },
      MeshPhongMaterial: {
        color: "#ffffff",
        specular: [
          Number(specularNorm.toFixed(4)),
          Number(specularNorm.toFixed(4)),
          Number(specularNorm.toFixed(4)),
        ],
        shininess: phongShininess,
        bumpScale: bumpScale,
        reflectivity: phongReflectivity,
        combine: "MixOperation",
        notes: "Use map + bumpMap from your texture; envMap optional (CubeCamera).",
      },
      MeshStandardMaterial: {
        color: "#ffffff",
        metalness: metalness,
        roughness: Number(roughness.toFixed(4)),
        bumpScale: bumpScale,
        envMapIntensity: Number(envMapIntensity.toFixed(4)),
        notes: "Use map + bumpMap from your texture; envMap optional.",
      },
    };
  };

  $(".export-material").on("click", function () {
    const payload = getMaterialExportPayload();
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    link.href = url;
    link.download = "tgen-three-material-" + stamp + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).catch(function () {});
    }

    message("Material settings exported", 2000);
  });

  const syncTextureSize = function (size) {
    const value = String(size);
    if ($("#texture-size option[value='" + value + "']").length) {
      $("#texture-size").val(value);
    }
  };

  const applyTextureSize = function (params) {
    const size = Number($("#texture-size").val());
    params.width = size;
    params.height = size;
    return params;
  };

  $("#texture-size").on("change", function () {
    try {
      let params = getRenderedParams();

      if (!params || !params.items || !params.items.length) {
        message("Generate a texture first", 2500);
        return;
      }

      params = applyTextureSize(params);
      $("#presets").val("editor");
      editor.setValue(JSON.stringify(params, null, 2));
      generate();
    } catch (e) {
      message("Cannot apply size: " + e.message, 3500);
      console.error(e);
    }
  });

  $("#presets").on("change", function (v) {
    const preset = $(this).val();
    paramsToEditor(preset);

    if (history.pushState) {
      const newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?preset=" +
        preset;
      window.history.pushState({ path: newurl }, "", newurl);
    }

    generate();
  });

  // $('.preset').each(function() {
  //     var id = $(this).attr('id');
  //     var title = $(this).attr('title');
  //     presets.push(id);
  //     $('#presets').append($("<option></option>").attr("value", id).text(title));
  // });

  const paramsToEditor = function (id) {
    if (id == "editor") {
      return;
    }

    if (!tgen.presets[id]) {
      return;
    }

    const preset = tgen.presets[id];
    editor.setValue(JSON.stringify(preset));

    const beautify = ace.require("ace/ext/beautify");
    beautify.beautify(editor.session);
  };

  const editorToParams = function () {
    const preset = $("#presets").val();

    if (preset == "random") {
      presets = Object.keys(tgen.presets);
      count = presets.length;
      const index = Math.floor(Math.random() * (count - 1));
      paramsToEditor(presets[index]);
    }

    let params = editor.getValue();

    if (!params) {
      return null;
    }

    return params.replace(/(var\sparams\s=\s|\s|\r\n|\r|\n)/gm, "");
  };

  // var updateHistory = function () {
  //   var history = texture.history.list();
  //   $("#history").html("");
  //   $("#history").append($("<option></option>").attr("value", 0).text(""));

  //   for (var id in history) {
  //     var name = history[id].name;
  //     $("#history").append($("<option></option>").attr("value", id).text(name));
  //   }
  // };

  // $("#history").on("change", function () {
  //   $("#panel").addClass("show");
  //   $("#presets").val("editor");
  //   var params = texture.history.get($(this).val());
  //   editor.setValue(JSON.stringify(params, null, 2));
  //   generate();
  // });

  $(".ace_text-input").keydown(function (e) {
    if (e.ctrlKey && e.keyCode == 13) {
      $("#presets").val("editor");
      generate();
    }
  });

  const closeGallery = function () {
    $("body").removeClass("galleryon");
    $("#gallery").attr("aria-hidden", "true");
  };

  const openGallery = function () {
    closeHistory();
    closePreview();
    $("body").addClass("galleryon");
    $("#gallery").attr("aria-hidden", "false");

    if (!$("#gallery").hasClass("loaded")) {
      loadGallery(offset, limit);
    }
  };

  const HISTORY_STORAGE_KEY = "tgen-demo-history";
  const HISTORY_LIMIT_KEY = "tgen-demo-history-limit";
  const HISTORY_LIMIT_DEFAULT = 10;
  const HISTORY_LIMIT_MAX = 100;
  const sessionHistory = [];
  let historyLimit = HISTORY_LIMIT_DEFAULT;

  const clampHistoryLimit = function (value) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n)) {
      return HISTORY_LIMIT_DEFAULT;
    }
    return Math.max(1, Math.min(HISTORY_LIMIT_MAX, n));
  };

  const historyThumbDataUrl = function (canvas) {
    const size = 72;
    const thumb = document.createElement("canvas");
    thumb.width = size;
    thumb.height = size;
    const ctx = thumb.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(canvas, 0, 0, size, size);
      try {
        return thumb.toDataURL("image/jpeg", 0.72);
      } catch (e) {
        // fall through
      }
    }
    return canvas.toDataURL("image/png");
  };

  const trimHistoryToLimit = function () {
    if (sessionHistory.length > historyLimit) {
      sessionHistory.length = historyLimit;
    }
    for (let i = 0; i < sessionHistory.length; i++) {
      sessionHistory[i].id = sessionHistory.length - i;
    }
  };

  const saveHistoryToStorage = function () {
    try {
      localStorage.setItem(HISTORY_LIMIT_KEY, String(historyLimit));
      localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(
          sessionHistory.map(function (item) {
            return {
              params: item.params,
              paramsKey: item.paramsKey,
              thumb: item.thumb,
              elapsed: item.elapsed,
              label: item.label,
            };
          })
        )
      );
    } catch (e) {
      console.warn("History save failed", e);
      // Quota: drop oldest half and retry once
      if (sessionHistory.length > 2) {
        sessionHistory.length = Math.max(1, Math.floor(sessionHistory.length / 2));
        trimHistoryToLimit();
        try {
          localStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(
              sessionHistory.map(function (item) {
                return {
                  params: item.params,
                  paramsKey: item.paramsKey,
                  thumb: item.thumb,
                  elapsed: item.elapsed,
                  label: item.label,
                };
              })
            )
          );
        } catch (e2) {
          console.warn("History save retry failed", e2);
        }
      }
    }
  };

  const loadHistoryFromStorage = function () {
    try {
      historyLimit = clampHistoryLimit(localStorage.getItem(HISTORY_LIMIT_KEY));
      $("#history-limit").val(historyLimit);

      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return;
      }

      sessionHistory.length = 0;
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item || !item.params) {
          continue;
        }
        sessionHistory.push({
          id: 0,
          params: item.params,
          paramsKey: item.paramsKey || JSON.stringify(item.params),
          thumb: item.thumb || "",
          elapsed: item.elapsed || 0,
          label: item.label || "",
        });
      }

      trimHistoryToLimit();
    } catch (e) {
      console.warn("History load failed", e);
      sessionHistory.length = 0;
    }
  };

  const closeHistory = function () {
    $("body").removeClass("historyon");
    $("#history").attr("aria-hidden", "true");
  };

  const renderHistory = function () {
    const list = $(".history-list");
    list.empty();
    $(".history-count").text(sessionHistory.length);
    $(".history-empty").toggleClass("show", sessionHistory.length === 0);

    for (let i = 0; i < sessionHistory.length; i++) {
      const item = sessionHistory[i];
      const row = $(
        '<button type="button" class="history-item">' +
          '<img alt="" />' +
          '<span class="history-item-meta">' +
          '<span class="history-item-title"></span>' +
          '<span class="history-item-sub"></span>' +
          "</span>" +
          "</button>"
      );
      row.attr("data-index", i);
      row.find("img").attr("src", item.thumb);
      row.find(".history-item-title").text("#" + item.id + " · " + item.elapsed + " ms");
      row.find(".history-item-sub").text(item.label);
      list.append(row);
    }
  };

  const addHistoryItem = function (params, canvas, elapsed) {
    const width = params && params.width ? params.width : "?";
    const height = params && params.height ? params.height : "?";
    const layers =
      params && params.items && params.items.length ? params.items.length : 0;
    const time = new Date();
    const stamp =
      String(time.getHours()).padStart(2, "0") +
      ":" +
      String(time.getMinutes()).padStart(2, "0") +
      ":" +
      String(time.getSeconds()).padStart(2, "0");
    const paramsKey = JSON.stringify(params);
    const thumb = historyThumbDataUrl(canvas);
    const existingIndex = sessionHistory.findIndex(function (item) {
      return item.paramsKey === paramsKey;
    });

    if (existingIndex !== -1) {
      const existing = sessionHistory.splice(existingIndex, 1)[0];
      existing.thumb = thumb;
      existing.elapsed = elapsed;
      existing.label =
        width + "×" + height + " · " + layers + " layers · " + stamp;
      sessionHistory.unshift(existing);
    } else {
      sessionHistory.unshift({
        id: sessionHistory.length + 1,
        params: params,
        paramsKey: paramsKey,
        thumb: thumb,
        elapsed: elapsed,
        label: width + "×" + height + " · " + layers + " layers · " + stamp,
      });
    }

    trimHistoryToLimit();
    saveHistoryToStorage();
    renderHistory();
  };

  const openHistory = function () {
    closeGallery();
    closePreview();
    $("#history-limit").val(historyLimit);
    renderHistory();
    $("body").addClass("historyon");
    $("#history").attr("aria-hidden", "false");
  };

  $("#history-limit").on("change", function () {
    historyLimit = clampHistoryLimit($(this).val());
    $("#history-limit").val(historyLimit);
    trimHistoryToLimit();
    saveHistoryToStorage();
    renderHistory();
  });

  loadHistoryFromStorage();
  renderHistory();

  const setPreview = function (dataUrl) {
    const thumb = $(".preview-thumb");
    const image = $(".preview-thumb-image");

    image.attr("src", dataUrl).prop("hidden", false);
    $(".preview-lightbox-image").attr("src", dataUrl).prop("hidden", false);
    thumb.addClass("has-image").prop("disabled", false);
    $(".preview-download").prop("disabled", false);
  };

  const closePreview = function () {
    $("body").removeClass("previewon");
    $("#preview-lightbox").attr("aria-hidden", "true");
  };

  const openPreview = function () {
    if (!$(".preview-thumb").hasClass("has-image")) {
      return;
    }

    closeGallery();
    closeHistory();
    $("body").addClass("previewon");
    $("#preview-lightbox").attr("aria-hidden", "false");
  };

  $(".preview-thumb").on("click", function () {
    openPreview();
  });

  $(".preview-lightbox-close, .preview-lightbox-backdrop").on("click", function () {
    closePreview();
  });

  const applyImageSourceTo3D = function (src) {
    if (!$("body").hasClass("test3d") || !test3D || !test3D.canvas || !test3D.renderer) {
      return;
    }

    // Always fetch a fresh blob — cached <img> responses without CORS
    // break the 2nd+ gallery pick when drawn into the WebGL canvas.
    fetch(src, { mode: "cors", credentials: "omit", cache: "reload" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Gallery image fetch failed");
        }
        return response.blob();
      })
      .then(function (blob) {
        if (typeof createImageBitmap === "function") {
          return createImageBitmap(blob).then(function (bitmap) {
            test3D.updateCanvas(bitmap);
            if (bitmap && typeof bitmap.close === "function") {
              bitmap.close();
            }
          });
        }

        return new Promise(function (resolve, reject) {
          const objectUrl = URL.createObjectURL(blob);
          const localImage = new Image();
          localImage.onload = function () {
            try {
              test3D.updateCanvas(localImage);
              resolve();
            } catch (err) {
              reject(err);
            } finally {
              URL.revokeObjectURL(objectUrl);
            }
          };
          localImage.onerror = function () {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Blob image load failed"));
          };
          localImage.src = objectUrl;
        });
      })
      .catch(function () {
        message("Could not apply gallery texture to 3D", 2500);
      });
  };

  $("#gallery").on("click", "img", function () {
    $("#presets").val("editor");
    let params = $(this).attr("params");
    params = JSON.parse(params);

    if (params && params.width) {
      syncTextureSize(params.width);
    }

    const src = $(this).attr("src");
    $("body").css("background-image", "url(" + src + ")");
    setPreview(src);

    editor.setValue(JSON.stringify(params, null, 2));
    closeGallery();
    applyImageSourceTo3D(src);
  });

  const message = function (msg, timeout) {
    if (msg == "") {
      $("body").removeClass("msg");
    } else {
      $("body").addClass("msg");
    }

    $(".message").text(msg);

    if (timeout !== undefined) {
      setTimeout(function () {
        $("body").removeClass("msg");
        $(".message").text("");
      }, timeout);
    }
  };

  $(".upload, .sure .cancel").on("click", function () {
    $(".sure").toggleClass("show");
  });

  // upload to gallery
  $(".sure .ok").on("click", function () {
    $("body").addClass("uploading");
    $(".sure").removeClass("show");
    message("Uploading...");

    editor = JSON.parse(editorToParams());
    const renderedParams = getRenderedParams();
    const renderedCanvas = getRenderedCanvas();
    if (!renderedParams || !renderedCanvas) {
      $("body").removeClass("uploading");
      message("Generate a texture first", 2500);
      return;
    }
    const data = {
      id: editor.id ? editor.id : null,
      params: renderedParams,
      pngdata: renderedCanvas.toDataURL("image/octet-stream"),
    };

    $.ajax({
      type: "POST",
      url: "https://texture-generator.com/api/texture/upload",
      dataType: "json",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      success: function (res) {
        $("body").removeClass("uploading");

        if (res.status !== "success") {
          if (res.statusCode === "error.duplicated") {
            message("Duplicated texture, upload skipped");
          } else {
            message(res.statusCode);
          }
        } else {
          message("Uploading OK");
        }

        message("", 3500);
      },
      false: function () {
        message("Unknown upload error", 3500);
      },
    });
  });

  let offset = 0;
  const limit = 50;

  const loadGallery = function (offset, limit) {
    message("Loading...");

    $.ajax({
      type: "GET",
      url: "https://texture-generator.com/api/texture/gallery",
      data: {
        offset: offset,
        limit: limit,
      },
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      success: function (res) {
        if (res.status !== "success") {
          message(res.statusCode, 3500);
          return;
        }

        message("", 200);
        $("#gallery").addClass("loaded");

        for (let i in res.data) {
          const item = res.data[i];
          const img = $(
            '<span class="frame"><img params=\'' +
              item.params +
              "' src=\"" +
              item.image +
              '"><span class="text">' +
              item.id +
              "</span></span>"
          );
          img.appendTo("#gallery .images");
        }
      },
      false: function () {
        message("Unknown gallery error", 3500);
      },
    });
  };

  $("#loadmore").on("click", function () {
    offset = offset + limit;
    loadGallery(offset, limit);
  });

  $(".gallery").on("click", function () {
    if ($("body").hasClass("galleryon")) {
      closeGallery();
      return;
    }

    openGallery();
  });

  $(".gallery-close, .gallery-backdrop").on("click", function () {
    closeGallery();
  });

  $(".history").on("click", function () {
    if ($("body").hasClass("historyon")) {
      closeHistory();
      return;
    }

    openHistory();
  });

  $(".history-close, .history-backdrop").on("click", function () {
    closeHistory();
  });

  $(".history-list").on("click", ".history-item", function () {
    const index = Number($(this).attr("data-index"));
    const item = sessionHistory[index];

    if (!item) {
      return;
    }

    $("#presets").val("editor");
    $("#panel").addClass("show");
    syncToggleLeds();
    editor.setValue(JSON.stringify(item.params, null, 2));

    if (item.params && item.params.width) {
      syncTextureSize(item.params.width);
    }

    closeHistory();
    generate();
  });

  $(document).on("keydown", function (e) {
    if (e.key !== "Escape") {
      return;
    }

    if ($("body").hasClass("galleryon")) {
      closeGallery();
    }

    if ($("body").hasClass("historyon")) {
      closeHistory();
    }

    if ($("body").hasClass("previewon")) {
      closePreview();
    }
  });

  //updateHistory();

  let lastElapsed = 0;
  let lastRenderedParams = null;
  let lastRenderedCanvas = null;
  let renderRequestId = 0;
  let renderWorker = null;

  const resolveTgenWorkerUrl = function () {
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src || "";
      if (src.indexOf("tgen-with-presets") !== -1) {
        return src.replace(/tgen-with-presets[^/?#]*/, "tgen-worker.min.js");
      }
    }
    return "/generator/dist/tgen-worker.min.js";
  };

  const floatBufferToCanvas = function (data, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const image = context.createImageData(width, height);
    const out = image.data;
    const length = Math.min(out.length, data.length);
    for (let i = 0; i < length; i++) {
      out[i] = data[i];
    }
    context.putImageData(image, 0, 0);
    return canvas;
  };

  const getRenderedParams = function () {
    if (lastRenderedParams) {
      return lastRenderedParams;
    }
    if (texture && typeof texture.params === "function") {
      try {
        return texture.params();
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const getRenderedCanvas = function () {
    if (lastRenderedCanvas) {
      return lastRenderedCanvas;
    }
    if (texture && typeof texture.toCanvas === "function") {
      try {
        return texture.toCanvas();
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const getRenderWorker = function () {
    // false = known unavailable (file:// / SecurityError); skip retries
    if (renderWorker === false) {
      return null;
    }
    if (renderWorker) {
      return renderWorker;
    }
    if (typeof Worker === "undefined") {
      renderWorker = false;
      return null;
    }
    // Browsers block Worker scripts when page origin is null (file://)
    if (window.location.protocol === "file:") {
      renderWorker = false;
      return null;
    }
    try {
      renderWorker = new Worker(resolveTgenWorkerUrl());
      return renderWorker;
    } catch (e) {
      renderWorker = false;
      return null;
    }
  };

  const finishGenerate = function (params, canvas, elapsed) {
    lastElapsed = elapsed;
    lastRenderedParams = params;
    lastRenderedCanvas = canvas;

    const dataUrl = canvas.toDataURL("image/png");
    $("body").css("background-image", "url(" + dataUrl + ")");
    $("body").removeClass("rendering");
    setPreview(dataUrl);
    addHistoryItem(params, canvas, elapsed);
    if (test3D && typeof test3D.updateCanvas === "function") {
      test3D.updateCanvas(canvas);
    }
    message("");
  };

  const generateSync = function (params) {
    texture.render(params, function (event, data) {
      console.log(event, data);
    });

    texture.stat(function (time) {
      lastElapsed = time.elapsed;
    });

    texture.getCanvas(function (texture_canvas) {
      finishGenerate(texture.params(), texture_canvas, lastElapsed);
    });
  };

  const generate = function () {
    if ($("body").hasClass("rendering")) {
      return;
    }

    $("body").addClass("rendering");
    message("Generating...");

    let params;
    try {
      params = JSON.parse(editorToParams());
      params = applyTextureSize(params);
      params.debug = true;
    } catch (e) {
      $("body").removeClass("rendering");
      message("Syntax error in params! " + e.message, 9000);
      console.error(e.stack);
      return;
    }

    const worker = getRenderWorker();
    if (!worker) {
      setTimeout(function () {
        try {
          generateSync(params);
        } catch (e) {
          $("body").removeClass("rendering");
          message("Syntax error in params! " + e.message, 9000);
          console.error(e.stack);
        }
      }, 50);
      return;
    }

    const id = ++renderRequestId;
    const onMessage = function (event) {
      const msg = event.data || {};
      if (msg.id !== id) {
        return;
      }

      worker.removeEventListener("message", onMessage);

      if (msg.type === "error") {
        $("body").removeClass("rendering");
        message("Generate failed: " + msg.message, 9000);
        console.error(msg.message, msg.stack);
        return;
      }

      try {
        const canvas = floatBufferToCanvas(msg.data, msg.width, msg.height);
        finishGenerate(msg.params, canvas, msg.elapsed);
      } catch (e) {
        $("body").removeClass("rendering");
        message("Generate failed: " + e.message, 9000);
        console.error(e);
      }
    };

    worker.addEventListener("message", onMessage);
    worker.postMessage({ type: "render", id: id, params: params });
  };

  test3D = {
    renderer: null,
    canvas: null,
    animid: null,
    starttime: null,
    lastFrameTime: 0,
    prevRenderTime: 0,
    fpsMeterFrames: 0,
    fpsMeterLast: 0,
    time: null,
    sceneNumber: 2,
    fps: 30,
    envPreset: "default",
    paused: false,
    pauseStartedAt: 0,
    pausedDuration: 0,
    orbiting: false,
    orbitLastX: 0,
    orbitLastY: 0,
    orbitTarget: null,

    texture1: null,
    texture2: null,
    texture3: null,
    texture4: null,
    bump1: null,
    bump2: null,
    bump3: null,
    bump4: null,
    // repeat of the big objects (sky sphere, ceiling, floor) to the near ones
    largeRepeat: 5,
    editableMaterials: [],
    projectionMaterials: [],
    // texture projection per scene (1: spheres, 2: floor + box)
    projectionDefaults: { 1: "triplanar", 2: "uv" },
    sceneMapping: { 1: "triplanar", 2: "uv" },
    post: null,

    start: function (canvas) {
      if (canvas !== undefined) {
        this.canvas = canvas;
      } else {
        this.canvas = getRenderedCanvas();
      }

      this.starttime = new Date().getTime();
      this.lastFrameTime = 0;
      this.prevRenderTime = 0;
      this.paused = false;
      this.pauseStartedAt = 0;
      this.pausedDuration = 0;
      this.orbiting = false;
      this.editableMaterials = [];
      this.projectionMaterials = [];
      this.resetFpsMeter();
      this.syncPauseButton();
      this.init();
      this.applyEnvironmentPreset(this.envPreset || $("#env-preset").val() || "default");
      $("#mat-mapping").val(this.sceneMapping[this.sceneNumber]);
      applyMaterialSettings();
      this.setupOrbitControls();
      this.setupPostprocessing();
      this.syncPostFxFromUi();
      this.animate();

      function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        test3D.part1.camera.aspect = width / height;
        test3D.part1.camera.updateProjectionMatrix();

        test3D.part2.camera.aspect = width / height;
        test3D.part2.camera.updateProjectionMatrix();

        test3D.renderer.setSize(width, height);

        if (test3D.post && test3D.post.composer) {
          test3D.post.composer.setSize(width, height);
          if (test3D.post.bloomPass) {
            test3D.post.bloomPass.setSize(width, height);
          }
          if (test3D.post.bokehPass) {
            test3D.post.bokehPass.setSize(width, height);
          }
        }

        if (test3D.part1.controls) {
          test3D.part1.controls.update();
        }
        if (test3D.part2.controls) {
          test3D.part2.controls.update();
        }
      }

      window.addEventListener("resize", onWindowResize, false);
    },

    stop: function () {
      window.cancelAnimationFrame(test3D.animid);

      if (test3D.part1.controls) {
        test3D.part1.controls.dispose();
        test3D.part1.controls = null;
      }
      if (test3D.part2.controls) {
        test3D.part2.controls.dispose();
        test3D.part2.controls = null;
      }

      if (test3D.post) {
        if (test3D.post.composer && test3D.post.composer.dispose) {
          test3D.post.composer.dispose();
        }
        test3D.post = null;
      }

      test3D.part1.reset();
      test3D.part2.reset();

      test3D.animid = null;
      test3D.lastFrameTime = 0;
      test3D.prevRenderTime = 0;
      test3D.paused = false;
      test3D.pauseStartedAt = 0;
      test3D.pausedDuration = 0;
      test3D.orbiting = false;
      $("body").removeClass("paused3d");
      $("#three").removeClass("is-dragging");
      test3D.resetFpsMeter();
      test3D.syncPauseButton();

      if (test3D.renderer) {
        const canvas = test3D.renderer.domElement;
        test3D.renderer.dispose();
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }

      test3D.renderer = null;
      test3D.texture1 = null;
      test3D.texture2 = null;
      test3D.texture3 = null;
      test3D.texture4 = null;
      test3D.bump1 = null;
      test3D.bump2 = null;
      test3D.bump3 = null;
      test3D.bump4 = null;
      test3D.editableMaterials = [];
      test3D.projectionMaterials = [];
    },

    setupPostprocessing: function () {
      if (
        typeof EffectComposer === "undefined" ||
        typeof RenderPass === "undefined" ||
        !this.renderer
      ) {
        this.post = null;
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const scene = this.part2.scene;
      const camera = this.part2.camera;

      const composer = new EffectComposer(this.renderer);
      const renderPass = new RenderPass(scene, camera);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.55,
        0.4,
        0.82
      );
      bloomPass.enabled = false;

      // focus = view-space distance to subject; keep aperture low so cube/sphere stay sharp
      const bokehPass = new BokehPass(scene, camera, {
        focus: 100,
        aperture: 0.00005,
        maxblur: 0.008,
      });
      bokehPass.enabled = false;

      const outputPass = new OutputPass();

      composer.addPass(renderPass);
      composer.addPass(bloomPass);
      composer.addPass(bokehPass);
      composer.addPass(outputPass);
      composer.setSize(width, height);

      this.post = {
        composer: composer,
        renderPass: renderPass,
        bloomPass: bloomPass,
        bokehPass: bokehPass,
        outputPass: outputPass,
      };
    },

    syncPostFxFromUi: function () {
      if (!this.post) {
        return;
      }

      this.post.bloomPass.enabled = $("#fx-bloom").is(":checked");
      this.post.bokehPass.enabled = $("#fx-dof").is(":checked");
    },

    hasPostFxEnabled: function () {
      if (!this.post) {
        return false;
      }
      return this.post.bloomPass.enabled || this.post.bokehPass.enabled;
    },

    syncPostprocessingTarget: function () {
      if (!this.post) {
        return;
      }

      const scene = this.getActiveScene();
      const camera = this.getActiveCamera();
      if (!scene || !camera) {
        return;
      }

      this.post.renderPass.scene = scene;
      this.post.renderPass.camera = camera;

      this.post.bokehPass.scene = scene;
      this.post.bokehPass.camera = camera;

      // BokehShader: factor = focus + viewZ (viewZ <= 0). Focus the subject mesh.
      camera.updateMatrixWorld(true);
      const subject = this.getOrbitTarget();
      const viewPos = subject.clone().applyMatrix4(camera.matrixWorldInverse);
      const focus = Math.max(camera.near + 0.1, -viewPos.z);
      const uniforms = this.post.bokehPass.uniforms;
      if (uniforms) {
        if (uniforms.focus) {
          uniforms.focus.value = focus;
        }
        if (uniforms.nearClip) {
          uniforms.nearClip.value = camera.near;
        }
        if (uniforms.farClip) {
          uniforms.farClip.value = camera.far;
        }
        if (uniforms.aspect) {
          uniforms.aspect.value = camera.aspect;
        }
      }
    },

    renderScene: function () {
      if (!this.renderer) {
        return;
      }

      this.syncPostprocessingTarget();

      if (this.post && this.post.composer && this.hasPostFxEnabled()) {
        this.post.composer.render();
        return;
      }

      const scene = this.getActiveScene();
      const camera = this.getActiveCamera();
      if (scene && camera) {
        this.renderer.render(scene, camera);
      }
    },

    createCubeCamera: function (near, far, resolution) {
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(resolution, {
        format: THREE.RGBAFormat,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });
      cubeRenderTarget.texture.colorSpace = THREE.SRGBColorSpace;
      cubeRenderTarget.texture.mapping = THREE.CubeReflectionMapping;
      return new THREE.CubeCamera(near, far, cubeRenderTarget);
    },

    updateReflection: function (mesh, cubeCamera, scene) {
      if (!mesh || !cubeCamera || !test3D.renderer || !scene) {
        return;
      }

      const material = mesh.material;
      const previousEnvMap = material && material.envMap ? material.envMap : null;

      // Avoid self-reflection feedback while sampling the surroundings
      mesh.visible = false;
      if (material && previousEnvMap) {
        material.envMap = null;
      }

      cubeCamera.position.copy(mesh.position);
      cubeCamera.update(test3D.renderer, scene);

      if (material && previousEnvMap) {
        material.envMap = previousEnvMap;
        material.needsUpdate = true;
      }
      mesh.visible = true;
    },

    environmentPresets: {
      // Strongly differentiated lighting setups (color + position + intensity)
      default: {
        sky: 0xffffff,
        fog: 0x000000,
        fogFar: 320,
        animateFill: true,
        ambient: { color: 0xffffff, intensity: 0.4 },
        key: { color: 0xffffff, intensity: 2.4, position: [80, 120, 60] },
        fill: { color: 0xffffff, intensity: 1.6, position: [100, 100, 100] },
        rim: { color: 0xffffff, intensity: 0, position: [-120, 40, -80] },
        spot: { color: 0xffffff, intensity: 3.2 },
      },
      dual: {
        sky: 0xffe8d4,
        fog: 0x0a0810,
        fogFar: 280,
        animateFill: false,
        ambient: { color: 0x1a1520, intensity: 0.08 },
        key: { color: 0xffc48a, intensity: 4.5, position: [140, 90, 30] },
        fill: { color: 0x6a9cff, intensity: 4.2, position: [-130, 50, 70] },
        rim: { color: 0xffffff, intensity: 0, position: [0, 80, -120] },
        spot: { color: 0xffd0a0, intensity: 2.8 },
      },
      single: {
        sky: 0xd0d0d0,
        fog: 0x000000,
        fogFar: 240,
        animateFill: false,
        ambient: { color: 0x000000, intensity: 0.01 },
        key: { color: 0xffffff, intensity: 7.5, position: [30, 160, 10] },
        fill: { color: 0xffffff, intensity: 0, position: [0, 0, 0] },
        rim: { color: 0xffffff, intensity: 0, position: [0, 0, 0] },
        spot: { color: 0xffffff, intensity: 8.0 },
      },
      soft: {
        sky: 0xc8dcff,
        fog: 0x101820,
        fogFar: 380,
        animateFill: false,
        ambient: { color: 0xb0c8ff, intensity: 1.6 },
        key: { color: 0xfff2e0, intensity: 0.55, position: [40, 100, 50] },
        fill: { color: 0xffe8d8, intensity: 0.45, position: [-50, 40, 40] },
        rim: { color: 0xd8e8ff, intensity: 0.9, position: [-90, 25, -70] },
        spot: { color: 0xfff0e8, intensity: 0.7 },
      },
      dramatic: {
        sky: 0xff9060,
        fog: 0x050010,
        fogFar: 220,
        animateFill: false,
        ambient: { color: 0x120018, intensity: 0.03 },
        key: { color: 0xff8844, intensity: 6.0, position: [110, 35, 25] },
        fill: { color: 0xffffff, intensity: 0, position: [0, 0, 0] },
        rim: { color: 0x3355ff, intensity: 5.0, position: [-160, 40, -30] },
        spot: { color: 0xffaa66, intensity: 5.5 },
      },
    },

    applyLightConfig: function (light, config) {
      if (!light || !config) {
        return;
      }

      const intensity =
        typeof config.intensity === "number" ? config.intensity : 0;
      light.intensity = intensity;
      light.visible = intensity > 0.001;

      if (config.color !== undefined && light.color) {
        light.color.setHex(config.color);
      }

      if (config.position && light.position) {
        light.position.set(
          config.position[0],
          config.position[1],
          config.position[2]
        );
      }
    },

    applyEnvironmentPreset: function (presetId) {
      const preset =
        test3D.environmentPresets[presetId] ||
        test3D.environmentPresets.default;
      test3D.envPreset = test3D.environmentPresets[presetId]
        ? presetId
        : "default";
      $("#env-preset").val(test3D.envPreset);
      test3D.animateFill = preset.animateFill !== false;

      const parts = [test3D.part1, test3D.part2];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part || !part.lights) {
          continue;
        }

        const lights = part.lights;
        test3D.applyLightConfig(lights.ambient, preset.ambient);
        test3D.applyLightConfig(lights.key, preset.key);
        test3D.applyLightConfig(lights.fill, preset.fill);
        test3D.applyLightConfig(lights.rim, preset.rim);
        test3D.applyLightConfig(lights.spot, preset.spot);

        // Sky / backdrop tint (MeshBasic sky is otherwise light-invariant)
        if (part.mesh1 && part.mesh1.material && part.mesh1.material.color) {
          part.mesh1.material.color.setHex(
            preset.sky !== undefined ? preset.sky : 0xffffff
          );
        }
        if (part.mesh3 && part.mesh3.material && part.mesh3.material.color) {
          // scene2 ceiling plane uses texture1 as basic material
          part.mesh3.material.color.setHex(
            preset.sky !== undefined ? preset.sky : 0xffffff
          );
        }

        if (part.scene && part.scene.fog) {
          part.scene.fog.color.setHex(
            preset.fog !== undefined ? preset.fog : 0x000000
          );
          if (preset.fogFar) {
            part.scene.fog.far = preset.fogFar;
          }
        }
      }

      if (test3D.paused) {
        test3D.updateActiveReflection();
        test3D.renderOnce();
      }
    },

    setupCanvasTexture: function (canvas, repeat, forBump) {
      const texture = new THREE.CanvasTexture(canvas);
      // Color maps need sRGB; bump/height data must stay linear
      texture.colorSpace = forBump ? THREE.NoColorSpace : THREE.SRGBColorSpace;
      texture.anisotropy = test3D.renderer.capabilities.getMaxAnisotropy();
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeat, repeat);
      texture.needsUpdate = true;
      return texture;
    },

    projectionModes: { uv: 0, triplanar: 1, box: 2 },

    // Texture projection for map + bumpMap: UV (default), triplanar (three
    // planar projections blended by the normal) or box (dominant axis only).
    // Mode and scale are uniforms, so switching needs no shader recompile.
    // size: object size in world units, one repeat covers size / repeat
    // scene: scene number, its mode comes from test3D.sceneMapping
    // large: big object, repeats test3D.largeRepeat times more
    setupProjection: function (material, size, scene, large) {
      const projection = {
        size: size,
        scene: scene,
        factor: large ? test3D.largeRepeat : 1,
        uniforms: {
          tgenProjMode: { value: 0 },
          tgenProjScale: { value: 1 },
        },
      };

      material.userData.tgenProjection = projection;
      test3D.projectionMaterials.push(material);

      material.onBeforeCompile = function (shader) {
        const mapSample = "texture2D( map, vMapUv )";
        const bumpBody = "vec2 dHdxy_fwd() {";
        const mapChunk = THREE.ShaderChunk.map_fragment;
        const bumpChunk = THREE.ShaderChunk.bumpmap_pars_fragment;

        // three.js chunks changed: keep the default UV mapping
        if (mapChunk.indexOf(mapSample) < 0 || bumpChunk.indexOf(bumpBody) < 0) {
          console.warn("Texture projection: unsupported three.js shader chunks");
          return;
        }

        shader.uniforms.tgenProjMode = projection.uniforms.tgenProjMode;
        shader.uniforms.tgenProjScale = projection.uniforms.tgenProjScale;

        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            "#include <common>\nvarying vec3 vTgenPos;\nvarying vec3 vTgenNormal;"
          )
          .replace(
            "#include <begin_vertex>",
            "#include <begin_vertex>\nvTgenPos = position;\nvTgenNormal = normal;"
          );

        shader.fragmentShader = shader.fragmentShader
          .replace(
            "#include <common>",
            [
              "#include <common>",
              "uniform float tgenProjMode;",
              "uniform float tgenProjScale;",
              "varying vec3 vTgenPos;",
              "varying vec3 vTgenNormal;",
              "vec4 tgenProject( sampler2D tex ) {",
              "  vec3 w = abs( normalize( vTgenNormal ) );",
              "  if ( tgenProjMode > 1.5 ) {",
              "    w = step( vec3( max( w.x, max( w.y, w.z ) ) ), w );",
              "  } else {",
              "    w = pow( w, vec3( 4.0 ) );",
              "  }",
              "  w /= ( w.x + w.y + w.z );",
              "  vec3 p = vTgenPos * tgenProjScale;",
              "  return texture2D( tex, p.zy ) * w.x + texture2D( tex, p.xz ) * w.y + texture2D( tex, p.xy ) * w.z;",
              "}",
            ].join("\n")
          )
          .replace(
            "#include <map_fragment>",
            mapChunk.replace(
              mapSample,
              "( tgenProjMode > 0.5 ? tgenProject( map ) : " + mapSample + " )"
            )
          )
          .replace(
            "#include <bumpmap_pars_fragment>",
            bumpChunk.replace(
              bumpBody,
              bumpBody +
                "\n  if ( tgenProjMode > 0.5 ) {" +
                "\n    float tgenH = bumpScale * tgenProject( bumpMap ).x;" +
                "\n    return vec2( dFdx( tgenH ), dFdy( tgenH ) );" +
                "\n  }"
            )
          );
      };
    },

    applyProjection: function (repeat) {
      for (let i = 0; i < test3D.projectionMaterials.length; i++) {
        const material = test3D.projectionMaterials[i];
        const projection = material && material.userData.tgenProjection;
        if (!projection) {
          continue;
        }

        const mode = test3D.sceneMapping[projection.scene];
        projection.uniforms.tgenProjMode.value =
          test3D.projectionModes[mode] !== undefined
            ? test3D.projectionModes[mode]
            : 0;
        projection.uniforms.tgenProjScale.value =
          (repeat * projection.factor) / projection.size;
      }
    },

    syncPauseButton: function () {
      $(".pause3d")
        .toggleClass("is-paused", !!test3D.paused)
        .text(test3D.paused ? "Play" : "Pause");
    },

    getActiveCamera: function () {
      return test3D.sceneNumber == 1
        ? test3D.part1.camera
        : test3D.part2.camera;
    },

    getActiveScene: function () {
      return test3D.sceneNumber == 1 ? test3D.part1.scene : test3D.part2.scene;
    },

    // re-render the CubeCamera of the visible mirror object (sphere / box)
    updateActiveReflection: function () {
      if (test3D.sceneNumber == 1 && test3D.part1.mirrorSphereCamera) {
        test3D.updateReflection(
          test3D.part1.mesh2,
          test3D.part1.mirrorSphereCamera,
          test3D.part1.scene
        );
      } else if (test3D.sceneNumber == 2 && test3D.part2.mirrorSphereCamera) {
        test3D.updateReflection(
          test3D.part2.mesh5,
          test3D.part2.mirrorSphereCamera,
          test3D.part2.scene
        );
      }
    },

    getOrbitTarget: function () {
      if (test3D.sceneNumber == 1 && test3D.part1.mesh2) {
        return test3D.part1.mesh2.position.clone();
      }

      if (test3D.sceneNumber == 2 && test3D.part2.mesh5) {
        return test3D.part2.mesh5.position.clone();
      }

      return new THREE.Vector3(0, 0, 0);
    },

    getActiveControls: function () {
      return test3D.sceneNumber == 1
        ? test3D.part1.controls
        : test3D.part2.controls;
    },

    createOrbitControls: function (camera, domElement) {
      const controls = new OrbitControls(camera, domElement);
      controls.enabled = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      controls.minDistance = 15;
      controls.maxDistance = 400;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
      return controls;
    },

    setupOrbitControls: function () {
      if (typeof OrbitControls === "undefined" || !this.renderer) {
        return;
      }

      const dom = this.renderer.domElement;
      dom.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });

      // Capture: pause before OrbitControls sees the event, so rotate works
      // on the same left-click. Do not auto-resume on mouseup.
      dom.addEventListener(
        "pointerdown",
        function (e) {
          if (e.button !== 0) {
            return;
          }
          if (!test3D.paused) {
            test3D.pause();
          }
        },
        true
      );

      this.part1.controls = this.createOrbitControls(this.part1.camera, dom);
      this.part2.controls = this.createOrbitControls(this.part2.camera, dom);
      this.syncOrbitControls();
    },

    syncOrbitControls: function () {
      if (test3D.part1.controls) {
        test3D.part1.controls.enabled = false;
      }
      if (test3D.part2.controls) {
        test3D.part2.controls.enabled = false;
      }

      if (!test3D.paused) {
        return;
      }

      const controls = test3D.getActiveControls();
      const camera = test3D.getActiveCamera();
      if (!controls || !camera) {
        return;
      }

      // Animation cameras lookAt(subject), so target = subject keeps the
      // paused view identical — no spherical snap / roll rewrite jump.
      const subject = test3D.getOrbitTarget();
      const savedPosition = camera.position.clone();

      controls.target.copy(subject);
      controls.enabled = true;
      controls.update();

      // Re-assert pose in case update() nudged internals
      camera.position.copy(savedPosition);
      camera.up.set(0, 1, 0);
      camera.lookAt(controls.target);
      controls.update();
    },

    renderOnce: function () {
      test3D.renderScene();
    },

    animatePaused: function () {
      if (!test3D.paused) {
        return;
      }

      test3D.animid = requestAnimationFrame(function () {
        test3D.animatePaused();
      });

      if (test3D._suspendPausedRender) {
        return;
      }

      const controls = test3D.getActiveControls();
      if (controls && controls.enabled) {
        controls.update();
      }

      test3D.renderOnce();
    },

    pause: function () {
      if (test3D.paused) {
        return;
      }

      test3D.paused = true;
      test3D.pauseStartedAt = new Date().getTime();
      test3D.orbitTarget = test3D.getOrbitTarget();
      window.cancelAnimationFrame(test3D.animid);
      test3D.animid = null;
      $("body").addClass("paused3d");
      test3D.syncPauseButton();
      test3D.syncOrbitControls();
      test3D.animatePaused();
    },

    resume: function () {
      if (!test3D.paused || !test3D.renderer) {
        return;
      }

      if (test3D.pauseStartedAt) {
        test3D.pausedDuration += new Date().getTime() - test3D.pauseStartedAt;
        test3D.pauseStartedAt = 0;
      }

      test3D.paused = false;
      test3D.orbiting = false;
      test3D.syncOrbitControls();
      $("body").removeClass("paused3d");
      $("#three").removeClass("is-dragging");
      test3D.syncPauseButton();

      // Keep delta continuous from the pause point (no jump)
      const now = performance.now();
      test3D.prevRenderTime = now;
      test3D.lastFrameTime = now;
      window.cancelAnimationFrame(test3D.animid);
      test3D.animid = null;
      test3D.animate();
    },

    resetFpsMeter: function () {
      test3D.fpsMeterFrames = 0;
      test3D.fpsMeterLast = performance.now();

      if (Number(test3D.fps) === 0) {
        $(".fps-actual").prop("hidden", false).text("— fps");
      } else {
        $(".fps-actual").prop("hidden", true).text("");
      }
    },

    init: function () {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      const element = document.getElementById("three");
      element.appendChild(this.renderer.domElement);

      const initialRepeat = Number($("#mat-repeat").val()) || 1;

      const largeRepeat = initialRepeat * this.largeRepeat;

      this.texture1 = this.setupCanvasTexture(this.canvas, largeRepeat, false);
      this.texture2 = this.setupCanvasTexture(this.canvas, initialRepeat, false);
      this.texture3 = this.setupCanvasTexture(this.canvas, initialRepeat, false);
      this.texture4 = this.setupCanvasTexture(this.canvas, largeRepeat, false);
      this.bump1 = this.setupCanvasTexture(this.canvas, largeRepeat, true);
      this.bump2 = this.setupCanvasTexture(this.canvas, initialRepeat, true);
      this.bump3 = this.setupCanvasTexture(this.canvas, initialRepeat, true);
      this.bump4 = this.setupCanvasTexture(this.canvas, largeRepeat, true);

      this.part1.init();
      this.part2.init();
    },

    animate: function (now) {
      if (test3D.paused) {
        return;
      }

      test3D.animid = requestAnimationFrame(function (t) {
        test3D.animate(t);
      });

      const timestamp = now || performance.now();
      const fps = Number(test3D.fps) || 0;

      // Skip frames to match the selected FPS; 0 = Max (every RAF tick)
      if (fps > 0) {
        const frameInterval = 1000 / fps;
        if (timestamp - test3D.lastFrameTime < frameInterval) {
          return;
        }
        test3D.lastFrameTime =
          timestamp - ((timestamp - test3D.lastFrameTime) % frameInterval);
      } else {
        test3D.fpsMeterFrames++;
        const elapsed = timestamp - test3D.fpsMeterLast;
        if (elapsed >= 500) {
          const actualFps = Math.round((test3D.fpsMeterFrames * 1000) / elapsed);
          $(".fps-actual").text(actualFps + " fps");
          test3D.fpsMeterFrames = 0;
          test3D.fpsMeterLast = timestamp;
        }
      }

      const deltaSeconds = test3D.prevRenderTime
        ? Math.min((timestamp - test3D.prevRenderTime) / 1000, 0.1)
        : 1 / 30;
      test3D.prevRenderTime = timestamp;

      const time =
        new Date().getTime() - this.starttime - (this.pausedDuration || 0);

      if (test3D.sceneNumber == 1) {
        test3D.part1.animate(time, deltaSeconds);
      } else {
        test3D.part2.animate(time, deltaSeconds);
      }

      test3D.renderScene();
    },

    updateCanvas: function (source) {
      if (!this.canvas || !this.renderer || !this.texture1) {
        return;
      }

      const srcWidth =
        source.width || source.videoWidth || source.naturalWidth || 0;
      const srcHeight =
        source.height || source.videoHeight || source.naturalHeight || 0;

      if (!srcWidth || !srcHeight) {
        return;
      }

      // Keep GPU canvas size fixed — resizing it triggers
      // GL_INVALID_VALUE (glCopySubTextureCHROMIUM) in Chromium.
      const width = this.canvas.width;
      const height = this.canvas.height;

      // Avoid racing with the paused OrbitControls render loop
      this._suspendPausedRender = true;

      try {
        const destCtx = this.canvas.getContext("2d", {
          willReadFrequently: true,
        });
        destCtx.clearRect(0, 0, width, height);
        destCtx.drawImage(source, 0, 0, width, height);

        const textures = [
          this.texture1,
          this.texture2,
          this.texture3,
          this.texture4,
          this.bump1,
          this.bump2,
          this.bump3,
          this.bump4,
        ];

        for (let i = 0; i < textures.length; i++) {
          const texture = textures[i];
          if (!texture) {
            continue;
          }
          texture.needsUpdate = true;
        }

        // Refresh reflections + frame while paused so new textures are visible
        if (this.paused) {
          this.updateActiveReflection();

          this.renderOnce();
        }
      } finally {
        this._suspendPausedRender = false;
      }
    },

    part1: {
      scene: null,
      camera: null,
      mesh1: null,
      mesh2: null,
      mesh3: null,
      lights: null,
      controls: null,
      shadowLight: null,
      mirrorSphereCamera: null,

      animate: function (time, delta) {
        // scene 1 — rotation scaled to original ~30 FPS feel
        this.mesh2.rotation.x += 0.011 * 30 * delta;
        this.mesh2.rotation.y += 0.01 * 30 * delta;

        this.camera.position.x = 15 - Math.sin(time / 1500) * 30;
        this.camera.position.y = 15 - Math.cos(time / 1500) * 30;
        this.camera.position.z = 110 + Math.cos(time / 1500) * 15;
        // lookAt keeps pause→OrbitControls seamless (no euler roll conflict)
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(this.mesh2.position);

        test3D.updateReflection(this.mesh2, this.mirrorSphereCamera, this.scene);
      },

      reset: function () {
        this.camera = null;
        this.scene = null;
        this.mesh1 = null;
        this.mesh2 = null;
        this.mesh3 = null;
        this.lights = null;
        this.controls = null;
        this.shadowLight = null;
        this.mirrorSphereCamera = null;
      },

      init: function () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        this.camera.position.z = 100;
        this.camera.lookAt(new THREE.Vector3(-30, 0, 0));

        this.scene.fog = new THREE.Fog(0x000000, 1, 300);

        this.lights = {
          ambient: new THREE.AmbientLight(0xffffff, 0.55),
          key: new THREE.DirectionalLight(0xffffff, 2.1),
          fill: new THREE.PointLight(0xffffff, 2.2, 0, 0),
          rim: new THREE.PointLight(0xffffff, 0, 0, 0),
          spot: null,
        };
        this.lights.key.position.set(80, 120, 60);
        this.lights.fill.position.set(100, 100, 100);
        this.lights.rim.position.set(-120, 40, -80);
        this.scene.add(this.lights.ambient);
        this.scene.add(this.lights.key);
        this.scene.add(this.lights.fill);
        this.scene.add(this.lights.rim);

        this.mirrorSphereCamera = test3D.createCubeCamera(0.1, 1000, 256);
        this.scene.add(this.mirrorSphereCamera);

        const material1 = new THREE.MeshBasicMaterial({
          map: test3D.texture1,
          side: THREE.BackSide,
          depthWrite: false,
        });

        const geometry1 = new THREE.SphereGeometry(150, 64, 32);
        this.mesh1 = new THREE.Mesh(geometry1, material1);
        this.mesh1.castShadow = false;
        this.mesh1.receiveShadow = true;
        this.scene.add(this.mesh1);
        test3D.setupProjection(material1, Math.PI * 150, 1, true);

        // Phong + CubeCamera envMap = classic fake local reflections
        const material2 = new THREE.MeshPhongMaterial({
          map: test3D.texture2,
          color: 0xffffff,
          specular: 0xf1f1f1,
          shininess: 12,
          bumpMap: test3D.bump2,
          bumpScale: 0.41,
          reflectivity: 0.25,
          envMap: this.mirrorSphereCamera.renderTarget.texture,
          combine: THREE.MixOperation,
        });

        const geometry2 = new THREE.SphereGeometry(40, 40, 32);
        this.mesh2 = new THREE.Mesh(geometry2, material2);
        this.mesh2.castShadow = true;
        this.mesh2.receiveShadow = false;
        this.scene.add(this.mesh2);
        test3D.editableMaterials.push(material2);
        // half circumference: one repeat ~ one UV tile vertically
        test3D.setupProjection(material2, Math.PI * 40, 1);
      },
    },

    part2: {
      scene: null,
      camera: null,
      mesh1: null,
      mesh2: null,
      mesh3: null,
      mesh4: null,
      mesh5: null,
      light1: null,
      lights: null,
      controls: null,
      shadowLight: null,
      mirrorSphereCamera: null,

      animate: function (time, delta) {
        // scene 2 — rotation scaled to original ~30 FPS feel
        this.camera.position.x = Math.sin(time / 1500) * 25;
        this.camera.position.y = Math.cos(time / 1500) * 25;
        this.camera.position.z = Math.cos(time / 1500) * 125;

        this.mesh5.rotation.x += 0.027 * 30 * delta;
        this.mesh5.rotation.y += 0.023 * 30 * delta;
        this.mesh5.rotation.z += 0.02 * 30 * delta;
        this.mesh5.position.z = this.camera.position.z - 100;

        // lookAt keeps pause→OrbitControls seamless
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(this.mesh5.position);

        if (test3D.animateFill && this.lights && this.lights.fill && this.lights.fill.visible) {
          this.lights.fill.position.x = 100 + Math.sin(time / 1500) * 25;
          this.lights.fill.position.y = 100 + Math.cos(time / 1500) * 25;
          this.lights.fill.position.z = -50 + Math.cos(time / 1500) * 125;
        }

        test3D.updateReflection(this.mesh5, this.mirrorSphereCamera, this.scene);
      },

      reset: function () {
        this.camera = null;
        this.scene = null;
        this.mesh1 = null;
        this.mesh2 = null;
        this.mesh3 = null;
        this.mesh4 = null;
        this.mesh5 = null;
        this.light1 = null;
        this.lights = null;
        this.controls = null;
        this.shadowLight = null;
        this.mirrorSphereCamera = null;
      },

      init: function () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        this.camera.position.x = -50;
        this.camera.position.z = 100;
        this.camera.lookAt(new THREE.Vector3(-50, 0, 0));

        this.scene.fog = new THREE.Fog(0x000000, 1, 340);

        this.lights = {
          ambient: new THREE.AmbientLight(0xffffff, 0.55),
          key: new THREE.DirectionalLight(0xffffff, 2.1),
          fill: new THREE.PointLight(0xffffff, 2.2, 0, 0),
          rim: new THREE.PointLight(0xffffff, 0, 0, 0),
          spot: null,
        };
        this.lights.key.position.set(60, 100, 40);
        this.lights.fill.position.set(50, 50, -150);
        this.lights.rim.position.set(-90, 30, 80);
        this.scene.add(this.lights.ambient);
        this.scene.add(this.lights.key);
        this.scene.add(this.lights.fill);
        this.scene.add(this.lights.rim);
        this.light1 = this.lights.fill;

        const material1 = new THREE.MeshBasicMaterial({
          map: test3D.texture1,
        });

        const geometry1 = new THREE.PlaneGeometry(1000, 1000, 8);
        this.mesh3 = new THREE.Mesh(geometry1, material1);
        this.mesh3.position.y = 50;
        this.mesh3.rotation.x = Math.PI / 2;
        this.mesh3.castShadow = false;
        this.mesh3.receiveShadow = true;
        this.scene.add(this.mesh3);

        // own textures: the floor repeats more than the sphere of scene 1
        const material2 = new THREE.MeshStandardMaterial({
          map: test3D.texture4,
          color: 0xffffff,
          metalness: 0,
          roughness: 0.55,
          bumpMap: test3D.bump4,
          bumpScale: 0.41,
        });

        const geometry2 = new THREE.PlaneGeometry(1000, 1000, 8);
        this.mesh4 = new THREE.Mesh(geometry2, material2);
        this.mesh4.position.y = -50;
        this.mesh4.rotation.x = -Math.PI / 2;
        this.mesh4.castShadow = false;
        this.mesh4.receiveShadow = true;
        this.scene.add(this.mesh4);
        test3D.editableMaterials.push(material2);
        test3D.setupProjection(material2, 1000, 2, true);

        this.mirrorSphereCamera = test3D.createCubeCamera(0.1, 1500, 256);
        this.scene.add(this.mirrorSphereCamera);

        // Phong + CubeCamera envMap = classic fake local reflections
        const material3 = new THREE.MeshPhongMaterial({
          map: test3D.texture3,
          color: 0xffffff,
          specular: 0xf1f1f1,
          shininess: 12,
          bumpMap: test3D.bump3,
          bumpScale: 0.5,
          reflectivity: 0.25,
          envMap: this.mirrorSphereCamera.renderTarget.texture,
          combine: THREE.MixOperation,
        });

        const geometry3 = new THREE.BoxGeometry(50, 50, 50);
        this.mesh5 = new THREE.Mesh(geometry3, material3);
        this.mesh5.position.y = 0;
        this.mesh5.castShadow = true;
        this.mesh5.receiveShadow = false;
        this.scene.add(this.mesh5);
        test3D.editableMaterials.push(material3);
        test3D.setupProjection(material3, 50, 2);

        const light = new THREE.SpotLight(0xffffff, 3.5, 0, Math.PI / 2, 0.4, 0);
        light.position.set(100, 80, 100);
        light.target.position.set(0, 0, -50);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 1000;
        light.shadow.camera.fov = 120;
        light.shadow.bias = -0.0001;
        this.scene.add(light);
        this.scene.add(light.target);
        this.lights.spot = light;
        this.shadowLight = light;
      },
    },
  };

  let preset_id = "waves-cool";

  if (urlparams.preset) {
    if (presets.indexOf(urlparams.preset) >= 0) {
      preset_id = urlparams.preset;
    }
  }

  $("#presets").val(preset_id);
  paramsToEditor(preset_id);
  generate();

  if (urlparams["3d"]) {
    $(".3d").trigger("click");
  }

  syncToggleLeds();
});

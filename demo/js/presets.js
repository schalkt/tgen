$(document).ready(function () {
  // disable localStorage history
  tgen.config.historyLast = 0;

  // initialize the generator
  const generator = tgen.init();

  const addImage = function (key, canvas, selector) {
    const img = '<img src="' + canvas.toDataURL("image/png") + '" />';
    const images = $(
      '<div class="img"><small>' + key + "</small>" + img + "</div>"
    );
    $(selector).append(images);
  };

  let seed = 7742101;

  for (const name in tgen.presets) {
    const preset = tgen.presets[name];
    preset.width = 128;
    preset.height = 128;

    // set seeds
    for (const index in preset.items) {
      const layer = preset.items[index];

      seed++;

      if (layer[2]) {
        preset.items[index][2].seed = seed;
      } else {
        preset.items[index][2] = {
          seed: seed,
        };
      }
    }

    const texture = generator.render(preset);

    console.log(preset);

    addImage(preset.preset, texture.toCanvas(), "#presets");
  }

  $(".hideme").html("");
});

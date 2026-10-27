$(document).ready(function () {
  // disable localStorage history
  tgen.config.historyLast = 0;

  // initialize the generator
  const generator = tgen.init(128, 128);

  const addImage = function (key, canvas, selector) {
    const img = '<img src="' + canvas.toDataURL("image/png") + '" />';
    const images = $(
      '<div class="img"><small>' + key + "</small>" + img + "</div>"
    );
    $(selector).append(images);
  };

  // render a preset and clamp it to 0-255, so the blends work on the
  // same values that are visible on img A and img B
  const renderPreset = function (name, seed) {
    generator.render({ preset: { name: name, seed: seed } });

    return generator.texture.data.map(function (value) {
      return Math.max(0, Math.min(255, value));
    });
  };

  // img A: warm, embossed surface - img B: blue clouds with dark and light parts
  const imgA = renderPreset("dunes-magic", 19850121);
  const imgB = renderPreset("clouds", 2024);

  addImage("img A", generator.toCanvas(imgA), "#imgAB");
  addImage("img B", generator.toCanvas(imgB), "#imgAB");

  // merge img B onto img A with every blend
  for (let key in tgen.blends) {
    if (key !== "opacity") {
      generator.layers = [imgA, imgB];
      generator.texture.data = imgA.slice();
      generator.do("merge", { layer: 1, blend: key });
      addImage(key, generator.toCanvas(), "#blends");
    }
  }

  $(".hideme").html("");
});

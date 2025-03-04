$(document).ready(function () {
  // disable localStorage history
  tgen.config.historyLast = 0;

  // initialize the generator
  const generator = tgen.init(128, 128);
  let texture, key;

  let params = {
    items: [
      [
        0,
        "spheres",
        {
          seed: 353524,
        },
      ],
      [
        1,
        "spheres",
        {
          seed: 789786,
        },
      ],
      [2, "copy", 0],
      [
        2,
        "merge",
        {
          layer: 1,
          blend: "opacity",
        },
      ],
    ],
  };

  const addImage = function (key, canvas, selector) {
    const img = '<img src="' + canvas.toDataURL("image/png") + '" />';
    const images = $(
      '<div class="img"><small>' + key + "</small>" + img + "</div>"
    );
    $(selector).append(images);
  };

  texture = generator.render(params);
  addImage("img A", texture.toCanvas(texture.layers[0]), "#imgAB");
  addImage("img B", texture.toCanvas(texture.layers[1]), "#imgAB");

  params = texture.params();

  for (key in tgen.blends) {
    if (key !== "opacity") {
      params.items[3][2].blend = key;
      texture = generator.render(params);
      addImage(key, texture.toCanvas(), "#blends");
    }
  }

  $(".hideme").html("");
});

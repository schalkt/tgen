$(document).ready(function () {
  // disable localStorage history
  tgen.config.historyLast = 0;

  // initialize the generator
  const generator = tgen.init(128, 128);
  let texture, key, filterName;

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
        0,
        "spheres",
        {
          seed: 789786,
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
  addImage("original", texture.toCanvas(texture.layers[0]), "#imgA");

  params = texture.params();
  params.items.push([0, "filterName"]);

  for (key in tgen.filters) {
    filterName = tgen.filters[key];
    params.items[2][1] = filterName;
    texture = generator.render(params);
    addImage(filterName, texture.toCanvas(), "#filters");
  }

  $(".hideme").html("");
});

$(document).ready(function () {
  // disable localStorage history
  tgen.config.historyLast = 0;

  // initialize the generator
  const generator = tgen.init(128, 128);

  let params = {
    items: [
      [0, "clouds", { 
        colormap: "ice",
        blend: "lighten",
        rgba: [255, 255, 255, 255],
        seed: 467,        
      }],    
    ],
  };

  const addImage = function (key, canvas, selector) {
    const img = '<img src="' + canvas.toDataURL("image/png") + '" />';
    const images = $(
      '<div class="img"><small>' + key + "</small>" + img + "</div>"
    );
    $(selector).append(images);
  };

  let i;

  const texture = generator.render(params);
  console.log(texture.params());

  for (const name in tgen.colormaps) {
    params.items[0][2].colormap = name;
    const texture = generator.render(params);
    addImage(name, texture.toCanvas(), "#colormaps");
  }

  $(".hideme").html("");

});

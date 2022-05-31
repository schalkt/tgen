$(document).ready(function () {
  // disable localStorage history
  tgen.config.historyLast = 0;

  // initialize the generator
  var generator = tgen.init(128, 128);

  var params = {
    debug: true,
    items: [
      [
        0,
        "spheres",
        {
          seed: 3554,
        },
      ],
      [
        0,
        "waves",
        {
          seed: 1358,
          blend: "lineardodge",
        },
      ],
      [
        0,
        "spheres",
        {
          seed: 789786,
          blend: "lineardodge",
        },
      ],
      [
        1,
        "spheres",
        {
          seed: 1639,
        },
      ],
      [
        1,
        "waves",
        {
          seed: 1757,
          blend: "lineardodge",
        },
      ],
      [
        1,
        "spheres",
        {
          seed: 1892,
          blend: "lineardodge",
        },
      ],
      [2, 
        "copy", {
          layer: 0,
        }
      ],
      [
        2,
        "merge",
        {
          layer: 1,
          blend: "difference",
        },
      ],
    ],
  };

  var addImage = function (key, canvas, selector) {
    var img = '<img src="' + canvas.toDataURL("image/png") + '" />';
    var images = $(
      '<div class="img"><small>' + key + "</small>" + img + "</div>"
    );
    $(selector).append(images);
  };

  var texture = generator.render(params);
  addImage("img A", texture.toCanvas(texture.layers[0]), "#imgAB");
  addImage("img B", texture.toCanvas(texture.layers[1]), "#imgAB");  

  params = texture.params();

  var normalizes = [
    ["clamped", "int 8bit"],
    ["limitless", "float 32bit"],
    ["pingpong", "int 8bit"],
    ["compress", "int 8bit"],
  ];

  for (var key in normalizes) {
    params.normalize = normalizes[key][0];
    texture = generator.render(params);
    console.log(texture);
    addImage(
      normalizes[key][0] + " " + normalizes[key][1],
      texture.toCanvas(),
      "#normalize"
    );    
  }

  $(".hideme").html("");
});

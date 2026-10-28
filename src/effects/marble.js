module.exports = function (tgen) {
  // marble: base with soft patches, broad faint bands, fine and main veins
  // drawn with the electricity field, blur and grain; light veins on a dark
  // base use screen, dark veins on a light base use multiply
  const palettes = {
    // carrara, brownish grey veins
    white: {
      light: false,
      base: [
        [232, 238],
        [230, 235],
        [226, 230],
        255,
      ],
      patches: [
        [205, 200, 195, 255],
        [255, 255, 255, 255],
      ],
      bands: [200, 195, 188, 60],
      fine: [170, 165, 160, 110],
      veins: [
        [130, 150],
        [110, 125],
        [90, 100],
        210,
      ],
    },

    // verde, light veins on dark green
    green: {
      light: true,
      base: [
        [20, 35],
        [55, 80],
        [40, 55],
        255,
      ],
      patches: [
        [10, 40, 28, 255],
        [60, 115, 85, 255],
      ],
      bands: [60, 110, 80, 60],
      fine: [140, 190, 160, 90],
      veins: [
        [200, 230],
        [225, 245],
        [205, 230],
        220,
      ],
    },

    // nero, white veins on black
    black: {
      light: true,
      base: [18, 18, 20, 255],
      patches: [
        [6, 6, 8, 255],
        [42, 42, 46, 255],
      ],
      bands: [70, 70, 75, 50],
      fine: [120, 120, 125, 90],
      veins: [
        [222, 232],
        [222, 232],
        [220, 230],
        230,
      ],
    },

    // port laurent, gold veins on black
    gold: {
      light: true,
      base: [
        [20, 26],
        [16, 20],
        [12, 14],
        255,
      ],
      patches: [
        [8, 6, 4, 255],
        [48, 38, 26, 255],
      ],
      bands: [90, 65, 30, 50],
      fine: [150, 115, 60, 90],
      veins: [
        [205, 225],
        [160, 180],
        [70, 90],
        230,
      ],
    },
  };

  tgen.effect(
    "marble",
    {
      seed: null,
      palette: ["white", "green", "black", "gold"], // picks one
      veins: [1, 3], // main vein layers
      fine: [1, 3], // fine vein layers
      warp: [1.1, 1.7], // twist of the main veins
      thickness: [0.004, 0.01], // of the main veins
    },
    function ($g, params) {
      params.palette = $g.randItemSeed(params.palette);
      params.veins = $g.randByArraySeed(params.veins);
      params.fine = $g.randByArraySeed(params.fine);
      params.warp = $g.randByArraySeed(params.warp, true);
      params.thickness = $g.randByArraySeed(params.thickness, true);

      const colors = palettes[params.palette] || palettes.white;
      const veinBlend = colors.light ? "screen" : "multiply";

      const steps = [
        ["fill", { rgba: colors.base }],
        // soft patches
        [
          "clouds",
          {
            blend: colors.light ? "opacity" : "multiply",
            rgba: [255, 255, 255, colors.light ? 200 : 255],
            roughness: [2, 6],
            colormap: [
              { percent: 0, rgba: colors.patches[0] },
              { percent: 100, rgba: colors.patches[1] },
            ],
          },
        ],
        // broad faint bands
        [
          "electricity",
          {
            type: "field",
            blend: veinBlend,
            rgba: colors.bands,
            core: 0,
            glow: [0.3, 0.6],
            scale: [1, 2],
            layers: 1,
            octaves: 2,
            warp: [0.5, 1],
            thickness: [0.03, 0.06],
          },
        ],
        // fine veins
        [
          "electricity",
          {
            type: "field",
            blend: veinBlend,
            rgba: colors.fine,
            core: 0,
            glow: [0.05, 0.15],
            scale: [3, 6],
            layers: params.fine,
            octaves: 3,
            warp: [0.6, 1.4],
            thickness: [0.003, 0.008],
          },
        ],
        // main veins
        [
          "electricity",
          {
            type: "field",
            blend: veinBlend,
            rgba: colors.veins,
            core: 0,
            glow: [0.3, 0.5],
            scale: [1, 2],
            layers: params.veins,
            octaves: 4,
            warp: params.warp,
            thickness: params.thickness,
          },
        ],
        ["blur", {}],
        // grain
        [
          "noise",
          {
            mode: "monochrome",
            blend: colors.light ? "screen" : "multiply",
            opacity: 10,
          },
        ],
      ];

      // the seeds first: every step reseeds the generator
      const seeds = steps.map(function () {
        return $g.randIntSeed(1, 2147483647);
      });

      // deep copy, the steps write the resolved values back
      steps.forEach(function (step, i) {
        $g.do(
          step[0],
          Object.assign(JSON.parse(JSON.stringify(step[1])), {
            seed: seeds[i],
            store: false,
          })
        );
      });

      return params;
    }
  );
};

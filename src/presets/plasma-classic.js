module.exports = function (tgen) {
  // the classic colorful "render plasma" (the other plasma-* presets use
  // subplasma)
  tgen.preset("plasma-classic", {
    width: 256,
    height: 256,

    items: [[0, "colorplasma"]],
  });
};

/**
 * tgen.js - the seamless texture generator
 *
 * https://github.com/schalkt/tgen/
 * https://texture-generator.com/
 *
 * @copyright 2015-2022 Tamas Schalk
 * @version 1.4.18
 * @license MIT
 *
 */

const SeamlessTextureGenerator = {
  version : "1.4.18",
  defaults: {},
  effects: {},
  prepare: {},
  filters: [],
  presets: {},
  functions: [],
  blends: {},
  shapes: {},
  colormaps: {},
  config: {},

  blendFlat: function () {
    return ["lighten", "screen", "opacity"];
  },

  blendSafe: function () {
    return [
      "average",
      "lighten",
      "linearburn",
      "linearlight",
      "difference",
      "difference-invert",
      "screen",
      "lineardodge",
      "lineardodge-invert",
      "opacity",
      "exclusion",
    ];
  },

  randomRGBA: function () {
    return [
      [0, 255],
      [0, 255],
      [0, 255],
      [64, 255],
    ];
  },

  effect: function (name, defaults, func, prepare) {
    this.defaults[name] = defaults;
    this.effects[name] = func;
    this.prepare[name] = prepare;
  },

  function: function (name, defaults, func) {
    this.functions.push(name);
    this.defaults[name] = defaults;
    this.effects[name] = func;
  },

  filter: function (name, defaults, func) {
    this.filters.push(name);
    this.defaults[name] = defaults;
    this.effects[name] = func;
  },

  preset: function (name, params) {
    params.name = name;
    this.presets[name] = params;
  },

  event: function (when, name, func) {
    if (this.events[when] == undefined) {
      return;
    }

    this.events[when][name] = func;
  },

  blend: function (name, func) {
    this.blends[name] = func;
  },

  shape: function (name, func) {
    this.shapes[name] = func;
  },

  colormap: function (name, func) {
    this.colormaps[name] = func;
  },

  init: function (width, height, normalize) {
    return this.getGenerator(width, height, normalize);
  },
};

require("./tgen-blends")(SeamlessTextureGenerator);
require("./tgen-colormaps")(SeamlessTextureGenerator);
require("./tgen-generator")(SeamlessTextureGenerator);
require("./functions/index")(SeamlessTextureGenerator);
require("./shapes/index")(SeamlessTextureGenerator);
require("./effects/index")(SeamlessTextureGenerator);
require("./filters/index")(SeamlessTextureGenerator);
require("./tgen-tests")(SeamlessTextureGenerator);

module.exports = SeamlessTextureGenerator;

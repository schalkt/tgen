/**
 * tgen.js - the seamless texture generator
 * 
 * https://github.com/schalkt/tgen/
 * https://texture-generator.com/
 *
 * @copyright 2015-2022 Tamas Schalk
 * @version 1.4.1
 * @license MIT
 * 
 */

var SeamlessTextureGenerator = {

  version : "1.4.1",
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

  blendFlat: [
    "lighten",
    "screen",
    "opacity"
  ],

  blendSafe: [
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
  ],

  randomRGBA: [
    [0, 255],
    [0, 255],
    [0, 255],
    [64, 255],
  ],

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

require('./tgen-blends')(SeamlessTextureGenerator);
require('./tgen-shapes')(SeamlessTextureGenerator);
require('./tgen-colormaps')(SeamlessTextureGenerator);
require('./tgen-functions')(SeamlessTextureGenerator);
require('./tgen-generator')(SeamlessTextureGenerator);
require('./effects/index')(SeamlessTextureGenerator);
require('./filters/index')(SeamlessTextureGenerator);
require('./presets/index')(SeamlessTextureGenerator);


//require('./tgen-tests');

window.tgen = SeamlessTextureGenerator;
module.exports = SeamlessTextureGenerator;



// if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
//   module.exports = SeamlessTextureGenerator;
// } else {
//   if (typeof define === "function" && define.amd) {
//     define([], function () {
//       return SeamlessTextureGenerator;
//     });
//   } else {
//     window.tgen = SeamlessTextureGenerator;
//   }
// }



import tgen from 'seamless-texture-generator';

console.log(tgen.version);
console.log('Presets', Object.keys(tgen.presets));
console.log('Blends', Object.keys(tgen.blends));
console.log('Colormaps', Object.keys(tgen.colormaps));
console.log('Effects', Object.keys(tgen.effects));
console.log('Filters', tgen.filters);

const generator = tgen.init(4, 4);

generator.do("waves", {
  blend: "screen",
  rgba: [255, 128, 64, 1],
  level: 50,
  xsines: 4,
  ysines: 4,
});

console.log('Generated 4x4 texture data', generator.texture.data);

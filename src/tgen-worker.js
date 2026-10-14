/**
 * tgen render worker — offloads texture.render() from the UI thread.
 * Expects a bundled build (webpack entry: tgen-worker.min.js).
 */

const tgen = require("./tgen-base-with-presets.js");

self.onmessage = function (event) {
  const message = event.data || {};

  if (message.type !== "render") {
    return;
  }

  const requestId = message.id;
  const started = Date.now();

  try {
    const generator = tgen.init();
    generator.render(message.params);

    const params = generator.params();
    const layer = generator.layers[generator.layers.length - 1];
    const width = params.width;
    const height = params.height;
    const elapsed = (Date.now() - started) / 1000;

    // Transfer a plain copy so ImageData can be built on the main thread
    const buffer = layer instanceof Float32Array ? layer.slice() : Float32Array.from(layer);

    self.postMessage(
      {
        type: "done",
        id: requestId,
        params: params,
        width: width,
        height: height,
        elapsed: elapsed,
        data: buffer,
      },
      [buffer.buffer]
    );
  } catch (error) {
    self.postMessage({
      type: "error",
      id: requestId,
      message: error && error.message ? error.message : String(error),
      stack: error && error.stack ? error.stack : undefined,
    });
  }
};

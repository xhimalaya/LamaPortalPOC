let snowGrid = null;
let width = 0;
let height = 0;

let worker = null;

export function initSnowWorker() {
  if (!worker) {
    worker = new Worker(new URL("./snowWorker.js", import.meta.url));
  }
}

export function buildSnowGrid(map) {
  if (!worker) return;

  const canvas = map.getViewport().querySelector("canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  width = canvas.width;
  height = canvas.height;

  const imageData = ctx.getImageData(0, 0, width, height).data;

  worker.postMessage({
    imageData,
    width,
    height
  });
}

export function onSnowGridReady(callback) {
  if (!worker) return;

  worker.onmessage = (e) => {
    snowGrid = new Uint8Array(e.data.grid);
    console.log("[SNOW GRID READY - WORKER]");
    callback && callback();
  };
}

export function isSnowPixel(map, coord) {
  if (!snowGrid) return false;

  const pixel = map.getPixelFromCoordinate(coord);
  if (!pixel) return false;

  const x = pixel[0] | 0;
  const y = pixel[1] | 0;

  if (x < 0 || y < 0 || x >= width || y >= height) return false;

  return snowGrid[y * width + x] === 1;
}
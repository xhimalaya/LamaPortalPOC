// frontend/MapView/utils/snowCheck.js

export function checkSnowAtCoordinate(coord, map) {
  try {
    const pixel = map.getPixelFromCoordinate(coord);
    if (!pixel) {
      console.warn("[SNOW-CHECK] No pixel for coord:", coord);
      return false;
    }
    const canvas = map.getViewport().querySelector("canvas");
    if (!canvas) {
      console.warn("[SNOW-CHECK] Canvas not found");
      return false;
    }
    const ctx = canvas.getContext("2d");
    const size = 3;
    const half = 1;
    const imageData = ctx.getImageData(
      pixel[0] - half,
      pixel[1] - half,
      size,
      size
    ).data;

    let totalR = 0, totalG = 0, totalB = 0, count = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      totalR += imageData[i];
      totalG += imageData[i + 1];
      totalB += imageData[i + 2];
      count++;
    }

    const r = totalR / count;
    const g = totalG / count;
    const b = totalB / count;

    console.log("[SNOW PIXEL AVG]", { r, g, b });
    const isSnow = g > 140 && b > 140;

    return isSnow;

  } catch (err) {
    console.error("[SNOW-CHECK ERROR]", err);
    return false;
  }
}
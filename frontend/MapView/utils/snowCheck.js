// frontend/MapView/utils/snowCheck.js

export function checkSnowAtCoordinate(coord, map) {
  try {
    const pixel = map.getPixelFromCoordinate(coord);
    if (!pixel) return false;

    const canvas = map.getViewport().querySelector("canvas");
    if (!canvas) return false;

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

    // TARGET COLORS (RIDAM snow palette)
    const snowColors = [
      [79, 205, 255],   // #4FCDFF
      [132, 190, 205],  // #84BECD
      [172, 180, 169]   // #ACB4A9
    ];

    const tolerance = 20;

    const isSnow = snowColors.some(([sr, sg, sb]) => {
      return (
        Math.abs(r - sr) < tolerance &&
        Math.abs(g - sg) < tolerance &&
        Math.abs(b - sb) < tolerance
      );
    });

    console.log("[SNOW CHECK]", { r, g, b, isSnow });

    return isSnow;

  } catch (err) {
    console.error("[SNOW-CHECK ERROR]", err);
    return false;
  }
}
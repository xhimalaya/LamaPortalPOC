self.onmessage = function (e) {
  const { imageData, width, height } = e.data;

  const grid = new Uint8Array(width * height);

  const snowColors = [
    [79, 205, 255],
    [132, 190, 205],
    [172, 180, 169]
  ];

  const tolerance = 35;

  for (let i = 0, p = 0; i < imageData.length; i += 4, p++) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    let isSnow = 0;

    for (let c = 0; c < snowColors.length; c++) {
      const sc = snowColors[c];

      if (
        Math.abs(r - sc[0]) < tolerance &&
        Math.abs(g - sc[1]) < tolerance &&
        Math.abs(b - sc[2]) < tolerance
      ) {
        isSnow = 1;
        break;
      }
    }
    grid[p] = isSnow;
  }
  self.postMessage({ grid }, [grid.buffer]);
};
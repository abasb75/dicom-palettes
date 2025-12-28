import fs from 'fs';
import path from 'path';

const palettes = [
  {
    ColorSpace: 'RGB',
    Name: 'Isodose',
    NanColor: [1, 0, 0],
    RGBPoints: [
      0, 0, 1, 0,
      0.1, 0.5, 1, 0,
      0.2, 1, 1, 0,
      0.3, 1, 0.66, 0,
      0.4, 1, 0.33, 0,
      0.5, 1, 0, 0,
    ],
    description: 'Isodose',
  },
  {
    ColorSpace: 'RGB',
    Name: 'hsv',
    RGBPoints: [
      -1, 1, 0, 0,
      -0.666666, 1, 0, 1,
      -0.333333, 0, 0, 1,
      0, 0, 1, 1,
      0.33333, 0, 1, 0,
      0.66666, 1, 1, 0,
      1, 1, 0, 0,
    ],
    description: 'HSV',
  },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function buildLUT(rgbPoints, size = 256, valueMin, valueMax) {
  const points = [];
  for (let i = 0; i < rgbPoints.length; i += 4) {
    points.push({
      value: rgbPoints[i],
      r: rgbPoints[i + 1],
      g: rgbPoints[i + 2],
      b: rgbPoints[i + 3],
    });
  }

  const red = new Array(size);
  const green = new Array(size);
  const blue = new Array(size);

  for (let i = 0; i < size; i++) {
    const normalizedPos = i / (size - 1); // 0 تا 1
    const actualValue = valueMin + normalizedPos * (valueMax - valueMin);

    let segmentIndex = 0;
    while (
      segmentIndex < points.length - 1 &&
      actualValue > points[segmentIndex + 1].value
    ) {
      segmentIndex++;
    }

    const p0 = points[segmentIndex];
    const p1 = points[segmentIndex + 1];

    const denominator = p1.value - p0.value;
    const t = denominator === 0 ? 0 : (actualValue - p0.value) / denominator;

    red[i] = Math.round(lerp(p0.r, p1.r, t) * 255);
    green[i] = Math.round(lerp(p0.g, p1.g, t) * 255);
    blue[i] = Math.round(lerp(p0.b, p1.b, t) * 255);
  }

  return { red, green, blue };
}

const output = {};

palettes.forEach(palette => {
  const firstVal = palette.RGBPoints[0];
  const lastVal = palette.RGBPoints[palette.RGBPoints.length - 4];
  output[palette.Name] = buildLUT(palette.RGBPoints, 256, firstVal, lastVal);
});

const outputPath = path.join(process.cwd(), 'palettes.json');

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));


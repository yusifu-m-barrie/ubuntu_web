import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const input = path.join(process.cwd(), "public/images/nuevo-logo-ubuntu-2-3_enano.jpg");
const output = path.join(process.cwd(), "public/images/nuevo-logo-ubuntu.png");

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const pixels = Uint8Array.from(data);

function index(x, y) {
  return (y * width + x) * channels;
}

function isBackground(i) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (r + g + b) / 3;
  return lum > 198 && max - min < 40;
}

const visited = new Uint8Array(width * height);
const stack = [];

function push(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  if (!isBackground(index(x, y))) return;
  visited[p] = 1;
  stack.push(p);
}

for (let x = 0; x < width; x += 1) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y += 1) {
  push(0, y);
  push(width - 1, y);
}

while (stack.length) {
  const p = stack.pop();
  const x = p % width;
  const y = (p / width) | 0;
  pixels[p * channels + 3] = 0;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
  push(x + 1, y + 1);
  push(x - 1, y + 1);
  push(x + 1, y - 1);
  push(x - 1, y - 1);
}

for (let p = 0; p < width * height; p += 1) {
  const i = p * channels;
  if (pixels[i + 3] === 0) continue;
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (r + g + b) / 3;
  if (max - min > 36) continue;
  if (lum < 185) continue;
  const t = Math.min(1, Math.max(0, (lum - 185) / 45));
  pixels[i + 3] = Math.round(pixels[i + 3] * (1 - t));
}

await sharp(Buffer.from(pixels), { raw: { width, height, channels } })
  .trim()
  .png({ compressionLevel: 9 })
  .toFile(output);

const stats = fs.statSync(output);
console.log(`Wrote ${output} (${stats.size} bytes)`);

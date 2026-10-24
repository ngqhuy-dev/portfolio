// Static export writes generated OG images without an extension, so static hosts serve them as
// application/octet-stream and some crawlers reject them. Adds ".png" and rewrites every reference.
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.resolve(process.argv[2] ?? 'out');
const IMAGE_FILE = /^(?:opengraph|twitter)-image(?:-[a-z0-9]+)?$/;
const IMAGE_REFERENCE = /((?:opengraph|twitter)-image(?:-[a-z0-9]+)?)(?=\?|")/g;
const TEXT_FILE = /\.(?:html|txt)$/;

const entries = await readdir(OUT_DIR, { withFileTypes: true, recursive: true });
const files = entries.filter((entry) => entry.isFile());

let renamed = 0;
for (const entry of files.filter(({ name }) => IMAGE_FILE.test(name))) {
  const file = path.join(entry.parentPath, entry.name);
  await rename(file, `${file}.png`);
  renamed += 1;
}

for (const entry of files.filter(({ name }) => TEXT_FILE.test(name))) {
  const file = path.join(entry.parentPath, entry.name);
  const content = await readFile(file, 'utf8');
  const updated = content.replace(IMAGE_REFERENCE, '$1.png');
  if (updated !== content) await writeFile(file, updated);
}

console.log(`OG images: renamed ${renamed} file(s) to .png`);

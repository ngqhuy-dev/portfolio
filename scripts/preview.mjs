// Serves out/ under the same sub-path and clean URLs as GitHub Pages, so the production build can be checked locally.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { createGzip } from 'node:zlib';

const OUT_DIR = path.resolve('out');
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/portfolio';
const PORT = Number(process.env.PORT ?? 8080);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

async function isFile(file) {
  const info = await stat(file).catch(() => null);
  return Boolean(info?.isFile());
}

// Mirrors GitHub Pages: files win, "/dir/" serves dir/index.html, "/dir" redirects to "/dir/".
async function resolve(urlPath) {
  const target = path.join(OUT_DIR, decodeURIComponent(urlPath));
  if (target !== OUT_DIR && !target.startsWith(`${OUT_DIR}${path.sep}`)) return null;
  if (!urlPath.endsWith('/') && (await isFile(target))) return { file: target };
  if (await isFile(path.join(target, 'index.html'))) {
    return urlPath.endsWith('/') ? { file: path.join(target, 'index.html') } : { redirect: true };
  }
  return null;
}

const COMPRESSIBLE = /^(?:text\/|application\/(?:json|xml|manifest))/;

// GitHub Pages gzips text responses; without it Lighthouse overstates transfer cost.
function send(req, res, status, file) {
  const type = MIME_TYPES[path.extname(file)] ?? 'application/octet-stream';
  const gzip = COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
  res.writeHead(status, {
    'Content-Type': type,
    ...(gzip && { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' }),
  });
  if (gzip) pipeline(createReadStream(file), createGzip(), res, () => {});
  else createReadStream(file).pipe(res);
}

http
  .createServer(async (req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    if (BASE_PATH && pathname === '/') {
      res.writeHead(302, { Location: `${BASE_PATH}/` }).end();
      return;
    }
    const inBase = !BASE_PATH || pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`);
    const match = inBase ? await resolve(pathname.slice(BASE_PATH.length) || '/') : null;
    if (match?.redirect) res.writeHead(301, { Location: `${pathname}/` }).end();
    else if (match?.file) send(req, res, 200, match.file);
    else send(req, res, 404, path.join(OUT_DIR, '404.html'));
  })
  .listen(PORT, () => console.log(`Preview: http://localhost:${PORT}${BASE_PATH}/`));

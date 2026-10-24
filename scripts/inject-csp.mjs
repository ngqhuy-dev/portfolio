// Adds a per-page CSP <meta> to the static export. Next.js inlines bootstrap scripts, so each page gets
// the SHA-256 hashes of its own inline scripts instead of a blanket 'unsafe-inline'.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT_DIR = path.resolve(process.argv[2] ?? 'out');
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const NON_JS_TYPE = /\stype=["']?(?!text\/javascript|module|application\/javascript)[^"'\s>]+/i;
const CSP_META = /<meta http-equiv="Content-Security-Policy"[^>]*>/i;

const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com';
const DEFAULT_PLAUSIBLE_SRC = 'https://plausible.io/js/script.js';

function originOf(url) {
  return url ? new URL(url).origin : '';
}

// Third-party origins follow the same env vars the app reads, so disabled features stay blocked.
function thirdPartyOrigins(env) {
  const contact = originOf(env.NEXT_PUBLIC_CONTACT_ENDPOINT);
  const analytics = env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
    ? originOf(env.NEXT_PUBLIC_PLAUSIBLE_SRC || DEFAULT_PLAUSIBLE_SRC)
    : '';
  const captcha = contact && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? TURNSTILE_ORIGIN : '';
  return { contact, analytics, captcha };
}

function directive(name, ...sources) {
  return [name, ...sources.filter(Boolean)].join(' ');
}

export function buildPolicy(scriptHashes, env = process.env) {
  const { contact, analytics, captcha } = thirdPartyOrigins(env);
  return [
    "default-src 'self'",
    directive('script-src', "'self'", ...scriptHashes, analytics, captcha),
    // React renders per-project accent colors as inline style attributes.
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    directive('connect-src', "'self'", contact, analytics, captcha),
    directive('frame-src', captcha || "'none'"),
    directive('form-action', "'self'", contact),
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export function hashInlineScripts(html) {
  const hashes = new Set();
  for (const [, attributes, body] of html.matchAll(INLINE_SCRIPT)) {
    if (NON_JS_TYPE.test(attributes) || body.length === 0) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
  return [...hashes];
}

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

async function injectCsp(file) {
  const html = (await readFile(file, 'utf8')).replace(CSP_META, '');
  const hashes = hashInlineScripts(html);
  const meta = `<meta http-equiv="Content-Security-Policy" content="${buildPolicy(hashes)}"/>`;
  const charset = html.match(/<meta charset="utf-8"\s*\/?>/i);
  if (!charset) throw new Error(`${file}: <meta charset> not found, cannot place CSP`);

  const insertAt = charset.index + charset[0].length;
  await writeFile(file, html.slice(0, insertAt) + meta + html.slice(insertAt));
  return hashes.length;
}

async function main() {
  const files = await findHtmlFiles(OUT_DIR);
  if (files.length === 0)
    throw new Error(`No HTML files found in ${OUT_DIR}. Run "next build" first.`);

  for (const file of files) {
    const count = await injectCsp(file);
    console.log(`CSP: ${path.relative(OUT_DIR, file)} (${count} inline script hashes)`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();

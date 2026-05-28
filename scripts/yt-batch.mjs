// Batch YouTube Shorts uploader. Reads a manifest with videos +
// metadata + a startDate; uploads each, scheduled one day apart.
//
// Usage:
//   nix develop --command node scripts/yt-batch.mjs \
//     --manifest recordings/shorts-mode/upload-queue.json
//   add --dry-run to print the schedule without uploading.
//
// Per-video keys: file (required), title (required), tags (array),
//   description (optional, overrides manifest default),
//   publishAt (optional ISO string, overrides the auto-generated slot).

import { readFileSync, existsSync, writeFileSync, mkdirSync, createReadStream } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { google } from 'googleapis';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const SECRETS = resolve(REPO, 'secrets');
const CLIENT_PATH = resolve(SECRETS, 'yt-client.json');
const TOKEN_PATH = resolve(SECRETS, 'yt-token.json');
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/youtube'];

const argv = (() => {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = process.argv[i + 1];
      if (next && !next.startsWith('--')) { a[key] = next; i++; } else { a[key] = true; }
    }
  }
  return a;
})();

function fail(msg) { console.error(`[yt-batch] ${msg}`); process.exit(1); }

const MANIFEST = argv.manifest && resolve(argv.manifest);
if (!MANIFEST || !existsSync(MANIFEST)) fail('--manifest <queue.json> required');
const DRY = !!argv['dry-run'];
const CATEGORY_ID = argv.category || '20';

const queue = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
const baseStart = new Date(queue.startDate);
if (isNaN(baseStart.getTime())) fail(`invalid startDate: ${queue.startDate}`);
const defaultDescription = queue.description || '';

// Compute schedule first; print it; then upload if not dry-run.
const plan = queue.videos.map((v, i) => {
  const publishAt = v.publishAt
    ? new Date(v.publishAt)
    : new Date(baseStart.getTime() + i * 24 * 60 * 60 * 1000);
  return { ...v, publishAt };
});

console.log('[yt-batch] schedule:');
for (const v of plan) {
  console.log(`  ${v.publishAt.toISOString()}  ${v.title}`);
  console.log(`                            file: ${v.file}`);
}
if (DRY) { console.log('[yt-batch] --dry-run: not uploading'); process.exit(0); }

// --- OAuth (re-use cached token) -------------------------------------------
if (!existsSync(CLIENT_PATH)) fail(`OAuth client missing: ${CLIENT_PATH}`);
const creds = JSON.parse(readFileSync(CLIENT_PATH, 'utf-8'));
const { client_id, client_secret } = creds.installed || creds.web;
const oauth2 = new google.auth.OAuth2(client_id, client_secret, 'http://127.0.0.1:9876');

if (existsSync(TOKEN_PATH)) {
  oauth2.setCredentials(JSON.parse(readFileSync(TOKEN_PATH, 'utf-8')));
} else {
  // Same one-time consent flow as yt-upload.mjs (kept here so this script
  // is usable standalone). Subsequent runs hit the cached token.
  const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
  console.log('[yt-batch] Open this URL and grant access:\n', authUrl);
  const code = await new Promise((res, rej) => {
    const server = http.createServer((req, r) => {
      const c = new URL(req.url, 'http://127.0.0.1:9876').searchParams.get('code');
      r.end('You can close this tab.');
      if (c) { server.close(); res(c); }
    });
    server.listen(9876);
    setTimeout(() => { server.close(); rej(new Error('OAuth timed out')); }, 300000);
  });
  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);
  mkdirSync(SECRETS, { recursive: true });
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}
const youtube = google.youtube({ version: 'v3', auth: oauth2 });

// --- Upload each item ------------------------------------------------------
for (const v of plan) {
  const file = resolve(REPO, v.file);
  if (!existsSync(file)) { console.error(`[yt-batch] SKIP (missing): ${v.file}`); continue; }
  const description = v.description || defaultDescription;
  const tags = v.tags || [];
  const status = {
    selfDeclaredMadeForKids: false,
    privacyStatus: 'private',           // required so publishAt can flip it public
    publishAt: v.publishAt.toISOString(),
  };
  console.log(`[yt-batch] uploading "${v.title}" → scheduled ${status.publishAt}`);
  try {
    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: { title: v.title, description, tags, categoryId: CATEGORY_ID },
        status,
      },
      media: { body: createReadStream(file) },
    });
    console.log(`[yt-batch]   ✓ https://youtube.com/shorts/${res.data.id}`);
  } catch (e) {
    console.error(`[yt-batch]   ✗ ${e.message}`);
  }
}
console.log('[yt-batch] done.');

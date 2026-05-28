// Scheduled YouTube Shorts uploader.
//
// Uploads a video with metadata and an optional future publish time so a
// batch of Shorts can be queued once and released automatically — no daily
// manual publishing.
//
// ── One-time setup (only you can do this; Google requires a human) ──
// 1. Go to https://console.cloud.google.com, create a project.
// 2. APIs & Services → Library → enable "YouTube Data API v3".
// 3. APIs & Services → Credentials → Create Credentials → OAuth client ID
//    → Application type "Desktop app". Download the JSON.
// 4. Save it as  secrets/yt-client.json  in this repo (gitignored).
// 5. First run opens a browser for consent; the refresh token is cached to
//    secrets/yt-token.json so subsequent runs are non-interactive.
//
// ── Usage ──
//   node scripts/yt-upload.mjs \
//     --file recordings/shorts-mode/moai-10s-v4.mp4 \
//     --title "I asked an AI to build the Easter Island heads" \
//     --description-file desc.txt \
//     --tags "shorts,ai,minecraft,moai,history" \
//     --publish-at 2026-05-28T16:00:00Z \
//     --thumbnail recordings/thumbs/moai-thumb.png
//
// Without --publish-at the video is uploaded as private (draft). With it,
// the video is scheduled to go public at that UTC time.
//
// Requires the `googleapis` package. It is not in the bundled server deps;
// run via:  nix develop --command npx googleapis ... (or add to package.json
// and refresh npmDepsHash). See DEMO.md "Scheduled uploads".

import { readFileSync, existsSync, writeFileSync, mkdirSync, createReadStream } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { google } from 'googleapis';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const SECRETS = resolve(REPO, 'secrets');
const CLIENT_PATH = resolve(SECRETS, 'yt-client.json');
const TOKEN_PATH = resolve(SECRETS, 'yt-token.json');
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/youtube'];

// --- Args -------------------------------------------------------------------
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

function fail(msg) { console.error(`[yt] ${msg}`); process.exit(1); }

const FILE = argv.file && resolve(argv.file);
if (!FILE || !existsSync(FILE)) fail('--file <video.mp4> required and must exist');
const TITLE = argv.title || fail('--title required');
const DESCRIPTION = argv['description-file'] && existsSync(argv['description-file'])
  ? readFileSync(argv['description-file'], 'utf-8')
  : (argv.description || '');
const TAGS = (argv.tags || '').split(',').map(s => s.trim()).filter(Boolean);
const PUBLISH_AT = argv['publish-at'] || null;     // ISO 8601 UTC, e.g. 2026-05-28T16:00:00Z
const THUMBNAIL = argv.thumbnail && resolve(argv.thumbnail);
const CATEGORY_ID = argv.category || '20';          // 20 = Gaming

if (!existsSync(CLIENT_PATH)) fail(`OAuth client missing: ${CLIENT_PATH} (see header for setup)`);

// --- OAuth ------------------------------------------------------------------
async function authorize() {
  const creds = JSON.parse(readFileSync(CLIENT_PATH, 'utf-8'));
  const { client_id, client_secret } = creds.installed || creds.web;
  // Desktop-app OAuth uses a loopback redirect. Force the explicit port
  // we listen on; the GCP OAuth client must allow http://127.0.0.1:9876.
  const redirectUri = 'http://127.0.0.1:9876';
  const oauth2 = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  if (existsSync(TOKEN_PATH)) {
    oauth2.setCredentials(JSON.parse(readFileSync(TOKEN_PATH, 'utf-8')));
    return oauth2;
  }

  // Interactive consent: open the URL, capture the code on the loopback.
  const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
  console.log('[yt] Open this URL in a browser and grant access:\n', authUrl);
  const port = 9876;
  const code = await new Promise((res, rej) => {
    const server = http.createServer((req, r) => {
      const u = new URL(req.url, redirectUri);
      const c = u.searchParams.get('code');
      r.end('You can close this tab and return to the terminal.');
      if (c) { server.close(); res(c); }
    });
    server.listen(port);
    setTimeout(() => { server.close(); rej(new Error('OAuth timed out')); }, 300000);
  });
  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);
  mkdirSync(SECRETS, { recursive: true });
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log(`[yt] token cached → ${TOKEN_PATH}`);
  return oauth2;
}

// --- Upload -----------------------------------------------------------------
const auth = await authorize();
const youtube = google.youtube({ version: 'v3', auth });

const status = { selfDeclaredMadeForKids: false };
if (PUBLISH_AT) {
  status.privacyStatus = 'private';      // required so publishAt can flip it public
  status.publishAt = new Date(PUBLISH_AT).toISOString();
} else {
  status.privacyStatus = argv.privacy || 'private';
}

console.log(`[yt] uploading "${TITLE}"${PUBLISH_AT ? ` (scheduled ${status.publishAt})` : ` (${status.privacyStatus})`}`);
const res = await youtube.videos.insert({
  part: ['snippet', 'status'],
  requestBody: {
    snippet: { title: TITLE, description: DESCRIPTION, tags: TAGS, categoryId: CATEGORY_ID },
    status,
  },
  media: { body: createReadStream(FILE) },
});
const videoId = res.data.id;
console.log(`[yt] uploaded: https://youtube.com/shorts/${videoId}`);

if (THUMBNAIL && existsSync(THUMBNAIL)) {
  await youtube.thumbnails.set({ videoId, media: { body: createReadStream(THUMBNAIL) } });
  console.log('[yt] thumbnail set');
}

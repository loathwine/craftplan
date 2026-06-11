// Print stats for recent uploads to the authenticated channel.
//
// Usage:
//   nix develop --command node scripts/yt-stats.mjs              # last 15 videos
//   nix develop --command node scripts/yt-stats.mjs --count 30
//   nix develop --command node scripts/yt-stats.mjs --json       # JSON instead of table
//
// Uses the cached OAuth token at secrets/yt-token.json (the one yt-batch.mjs
// already authorized). Basic stats only — viewCount, likeCount, commentCount —
// the YouTube *Data* API. For retention / avg view %, you'd need the YouTube
// *Analytics* API which requires a separate scope (yt-analytics.readonly) and
// a re-consent flow.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { google } from 'googleapis';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const SECRETS = resolve(REPO, 'secrets');
const CLIENT_PATH = resolve(SECRETS, 'yt-client.json');
const TOKEN_PATH  = resolve(SECRETS, 'yt-token.json');

const argv = (() => {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const k = arg.slice(2), n = process.argv[i + 1];
      if (n && !n.startsWith('--')) { a[k] = n; i++; } else { a[k] = true; }
    }
  }
  return a;
})();

const COUNT = parseInt(argv.count || '15');
const JSON_OUT = !!argv.json;

if (!existsSync(CLIENT_PATH)) { console.error(`OAuth client missing: ${CLIENT_PATH}`); process.exit(1); }

// Request the same superset as yt-upload/yt-batch: the token file is shared,
// and a readonly-scoped reauth here silently breaks uploads later (happened
// 2026-06-10 — the Jun 7 stats reauth downgraded the token and the week-3
// batch failed with "insufficient authentication scopes").
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/youtube',
                'https://www.googleapis.com/auth/youtube.readonly'];

const creds = JSON.parse(readFileSync(CLIENT_PATH, 'utf-8'));
const { client_id, client_secret } = creds.installed || creds.web;
const oauth2 = new google.auth.OAuth2(client_id, client_secret, 'http://127.0.0.1:9876');

async function runConsentFlow() {
  const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
  console.log('[yt-stats] Open this URL and grant access:\n', authUrl);
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
  const dir = dirname(TOKEN_PATH);
  mkdirSync(dir, { recursive: true });
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

if (existsSync(TOKEN_PATH)) {
  oauth2.setCredentials(JSON.parse(readFileSync(TOKEN_PATH, 'utf-8')));
} else {
  await runConsentFlow();
}
const youtube = google.youtube({ version: 'v3', auth: oauth2 });

async function callWithReauth(fn) {
  try { return await fn(); }
  catch (e) {
    const msg = (e?.message || '') + ' ' + (e?.response?.data?.error || '');
    if (msg.includes('invalid_grant') || e?.code === 400 || e?.code === 401) {
      console.error('[yt-stats] cached token rejected, re-running OAuth consent');
      await runConsentFlow();
      return await fn();
    }
    throw e;
  }
}

// channels.list mine=true → uploads playlist id
const me = await callWithReauth(() => youtube.channels.list({ part: ['contentDetails', 'snippet'], mine: true }));
const channel = me.data.items[0];
const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
const channelTitle = channel.snippet.title;

// Walk the uploads playlist to get the last COUNT video IDs
const ids = [];
let pageToken;
while (ids.length < COUNT) {
  const r = await youtube.playlistItems.list({
    part: ['contentDetails'],
    playlistId: uploadsPlaylistId,
    maxResults: Math.min(50, COUNT - ids.length),
    pageToken,
  });
  ids.push(...r.data.items.map(i => i.contentDetails.videoId));
  pageToken = r.data.nextPageToken;
  if (!pageToken) break;
}

// Batch videos.list (50 ids at a time) for snippet + statistics + status
const rows = [];
for (let i = 0; i < ids.length; i += 50) {
  const r = await youtube.videos.list({
    part: ['snippet', 'statistics', 'status'],
    id: ids.slice(i, i + 50),
  });
  for (const v of r.data.items) {
    rows.push({
      id: v.id,
      title: v.snippet.title,
      publishedAt: v.snippet.publishedAt,
      privacyStatus: v.status.privacyStatus,
      publishAt: v.status.publishAt || null,
      views: parseInt(v.statistics.viewCount || '0'),
      likes: parseInt(v.statistics.likeCount || '0'),
      comments: parseInt(v.statistics.commentCount || '0'),
    });
  }
}

if (JSON_OUT) {
  console.log(JSON.stringify({ channel: channelTitle, rows }, null, 2));
  process.exit(0);
}

// Table — sort newest first by publishedAt
rows.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
console.log(`\nChannel: ${channelTitle}\n`);
console.log('  published (UTC)    privacy   views  likes  cmts  title');
console.log('  ─────────────────  ────────  ─────  ─────  ────  ─────');
for (const r of rows) {
  const dt = r.publishedAt.slice(0, 16).replace('T', ' ');
  const privacy = r.privacyStatus === 'private' && r.publishAt
    ? `sched`
    : r.privacyStatus.padEnd(8);
  const title = r.title.length > 60 ? r.title.slice(0, 57) + '...' : r.title;
  console.log(`  ${dt}  ${privacy.padEnd(8)} ${String(r.views).padStart(6)} ${String(r.likes).padStart(6)} ${String(r.comments).padStart(5)}  ${title}`);
}
console.log('');

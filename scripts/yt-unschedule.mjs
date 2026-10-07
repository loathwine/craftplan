// Unschedule videos: set them to plain private (drops publishAt) while keeping
// them on the channel. videos.update(part=status) replaces the whole status
// object, so every field we care about is re-sent.
//   node scripts/yt-unschedule.mjs [--dry-run] <videoId> [<videoId> ...]
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const SECRETS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'secrets');
const DRY = process.argv.includes('--dry-run');
const ids = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!ids.length) { console.error('usage: yt-unschedule.mjs [--dry-run] <videoId>...'); process.exit(1); }

const creds = JSON.parse(readFileSync(resolve(SECRETS, 'yt-client.json'), 'utf-8'));
const { client_id, client_secret } = creds.installed || creds.web;
const oauth2 = new google.auth.OAuth2(client_id, client_secret);
oauth2.setCredentials(JSON.parse(readFileSync(resolve(SECRETS, 'yt-token.json'), 'utf-8')));
const youtube = google.youtube({ version: 'v3', auth: oauth2 });

const show = async () => {
  const r = await youtube.videos.list({ part: ['status', 'snippet'], id: ids });
  for (const v of r.data.items) console.log(`  ${v.id} ${v.status.privacyStatus} ${v.status.publishAt || '-'} ${v.snippet.title.slice(0, 50)}`);
};
await show();
if (DRY) process.exit(0);
for (const id of ids) {
  await youtube.videos.update({ part: ['status'], requestBody: { id, status: {
    privacyStatus: 'private', embeddable: true, publicStatsViewable: true, license: 'youtube', selfDeclaredMadeForKids: false,
  } } });
  console.log(`  unscheduled ${id}`);
}
await show();

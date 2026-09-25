// Fix the In-The-Morning batch start date: it was uploaded starting 08-30 but
// should start 08-29 (today). 16 videos already uploaded (batman..pegasus) —
// shift each publishAt back 1 day via videos.update (non-destructive). Then
// write a sub-manifest for the remaining 15 (unicorn..volcano) to upload.
// NOTE: videos.update replaces the whole status part — any field omitted resets
// to default (embeddable/publicStatsViewable -> false), so always send them.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SECRETS = resolve(REPO, 'secrets');
const oauth2 = new google.auth.OAuth2(
  ...(() => { const c = JSON.parse(readFileSync(resolve(SECRETS, 'yt-client.json'), 'utf8')); const { client_id, client_secret } = c.installed || c.web; return [client_id, client_secret, `http://127.0.0.1:${process.env.YT_OAUTH_PORT || 9877}`]; })());
oauth2.setCredentials(JSON.parse(readFileSync(resolve(SECRETS, 'yt-token.json'), 'utf8')));
const youtube = google.youtube({ version: 'v3', auth: oauth2 });

const MANIFEST = resolve(REPO, 'recordings/shorts-mode/upload-queue-morning.json');
const q = JSON.parse(readFileSync(MANIFEST, 'utf8'));

// 1) shift ALL publishAt back one day (fixes both the 16 done + the 15 to-do)
const shift = (iso) => new Date(new Date(iso).getTime() - 86400000).toISOString();
q.startDate = shift(q.startDate);
for (const v of q.videos) v.publishAt = shift(v.publishAt);
writeFileSync(MANIFEST, JSON.stringify(q, null, 2));
console.log(`manifest shifted -1 day: now ${q.videos[0].publishAt.slice(0,10)} .. ${q.videos[30].publishAt.slice(0,10)}`);

// 2) the 16 already-uploaded IDs, in publish order (batman..pegasus)
const DONE = ['Xbn36bXcMcs','QWHdAcb6Hto','IFbth_GZ1e8','f8xeCFkHd4g','L6-un9lFbeM','wMZZzqxA8OY','_U0gl_D_0Ps','QSEKqtHj70o','y1JoXh65weI','sO4CuTAul_M','lfpp2wE9pYM','3S1icVaCmto','yQTBR_yG-W4','USZEbCLq3Ok','UlgR905ruIU','FMyhX31_thc'];
for (let i = 0; i < DONE.length; i++) {
  const publishAt = q.videos[i].publishAt;
  try {
    await youtube.videos.update({
      part: ['status'],
      requestBody: { id: DONE[i], status: { privacyStatus: 'private', publishAt, selfDeclaredMadeForKids: false, embeddable: true, publicStatsViewable: true, license: 'youtube' } },
    });
    console.log(`  ✓ ${DONE[i]}  ${q.videos[i].file.split('/').pop().replace('-4x-grid-10s-morning.mp4','').padEnd(14)} -> ${publishAt}`);
  } catch (e) { console.error(`  ✗ ${DONE[i]}: ${e.message}`); }
}

// 3) sub-manifest for the remaining 15 (unicorn..volcano)
const rest = { ...q, videos: q.videos.slice(DONE.length) };
const REST = resolve(REPO, 'recordings/shorts-mode/upload-queue-morning-rest.json');
writeFileSync(REST, JSON.stringify(rest, null, 2));
console.log(`\nsub-manifest (${rest.videos.length} remaining): ${rest.videos[0].file.split('/').pop()} @ ${rest.videos[0].publishAt.slice(0,10)} .. ${rest.videos[rest.videos.length-1].publishAt.slice(0,10)} -> ${REST}`);

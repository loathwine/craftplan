// Mux the user's Halloween Suno song across the 14 Halloween-season grids in
// REVERSE order (oldest upload = song's last 10s, newest = first 10s), then
// emit the yt-batch manifest. Daily 17:00Z from 10-23; haunted-house and
// jack-o-lantern-n (held n6 grids) land on 10-30 / 10-31.
//   nix develop .#record --command node marathon/halloween-batch.mjs --song "recordings/audio/<song>.wav" [--name "<Song title>"]
import { writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };
if (!arg('song')) { console.error('usage: halloween-batch.mjs --song <file> [--name "Song title"]'); process.exit(1); }
const SONG = resolve(REPO, arg('song'));
const SONG_NAME = arg('name') || basename(SONG, extname(SONG));
const CLIP = 10;
const START_DATE = '2026-10-23T17:00:00Z';
const VIEWER = 'https://loathwine.github.io/craftplan/models.html?subject=';

// Publish order (day 1 first). grid = which render generation holds the clip.
// prompt = exactly what the models saw (marathon/halloween-grids.sh, refresh55.sh).
const SUBJECTS = [
  { key: 'witch-cauldron',    grid: 'n7', emoji: '🧪', short: 'witch',             prompt: 'a witch brewing a glowing potion in her cauldron', tags: ['witch','potion','halloween'],          htag: 'witch' },
  { key: 'scarecrow',         grid: 'n7', emoji: '🌾', short: 'scarecrow',         prompt: 'a creepy scarecrow in a pumpkin patch',            tags: ['scarecrow','pumpkin','halloween'],     htag: 'halloween' },
  { key: 'ghost-ship',        grid: 'n7', emoji: '👻', short: 'ghost ship',        prompt: 'a ghost pirate ship',                              tags: ['ghostship','pirates','halloween'],     htag: 'pirates' },
  { key: 'mummy',             grid: 'n7', emoji: '🧟', short: 'mummy',             prompt: 'a mummy bursting out of its sarcophagus',          tags: ['mummy','egypt','halloween'],           htag: 'mummy' },
  { key: 'frankenstein',      grid: 'n7', emoji: '⚡', short: 'Frankenstein',      prompt: "Frankenstein's monster coming to life in the lab", tags: ['frankenstein','monster','halloween'],  htag: 'frankenstein' },
  { key: 'graveyard-zombie',  grid: 'n7', emoji: '🧟', short: 'zombie',            prompt: 'a zombie rising from a graveyard',                 tags: ['zombie','graveyard','halloween'],      htag: 'zombie' },
  { key: 'headless-horseman', grid: 'n7', emoji: '🎃', short: 'Headless Horseman', prompt: 'the Headless Horseman holding a flaming pumpkin',  tags: ['headlesshorseman','sleepyhollow','halloween'], htag: 'halloween' },
  { key: 'haunted-house',     grid: 'n6', emoji: '🏚️', short: 'haunted house',     prompt: 'a haunted house on Halloween night',               tags: ['hauntedhouse','haunted','halloween'],  htag: 'halloween' },
  { key: 'jack-o-lantern-n',  grid: 'n6', emoji: '🎃', short: "jack-o'-lantern",   prompt: "a glowing jack-o'-lantern",                        tags: ['jackolantern','pumpkin','halloween'],  htag: 'halloween' },
  { key: 'sugar-skull',       grid: 'n7', emoji: '💀', short: 'sugar skull',       prompt: 'a Day of the Dead sugar skull',                    tags: ['dayofthedead','diadelosmuertos','sugarskull'], htag: 'dayofthedead' },
  { key: 'grim-reaper',       grid: 'n7', emoji: '💀', short: 'Grim Reaper',       prompt: 'the Grim Reaper with his scythe',                  tags: ['grimreaper','death','spooky'],         htag: 'spooky' },
  { key: 'dracula-castle',    grid: 'n7', emoji: '🦇', short: "Dracula's castle",  prompt: "Dracula's castle on a cliff",                      tags: ['dracula','vampire','castle'],          htag: 'dracula' },
  { key: 'witch-broom',       grid: 'n7', emoji: '🧹', short: 'witch',             prompt: 'a witch flying on a broomstick',                   tags: ['witch','broomstick','spooky'],         htag: 'witch' },
  { key: 'bonfire-night',     grid: 'n7', emoji: '🎆', short: 'bonfire',           prompt: 'a Bonfire Night bonfire with fireworks',           tags: ['bonfirenight','fireworks','guyfawkes'], htag: 'fireworks' },
];

// Full title if it fits YouTube's 100 chars; else drop the emoji; else the
// compact "v" form. The quoted prompt is always kept verbatim.
const titleFor = (s) => [
  `Haiku 5.5 vs Sonnet 5.5 vs Opus 5.5 vs Fable 5.1: "${s.prompt}" ${s.emoji}`,
  `Haiku 5.5 vs Sonnet 5.5 vs Opus 5.5 vs Fable 5.1: "${s.prompt}"`,
  `Haiku 5.5 v Sonnet 5.5 v Opus 5.5 v Fable 5.1: "${s.prompt}"`,
].find(t => [...t].length <= 100);

const BASE_TAGS = ['shorts','ai','claude','anthropic','minecraft','benchmark','aibenchmark','haiku','sonnet','opus','fable',
  'haiku 5.5','sonnet 5.5','opus 5.5','fable 5.1','voxel'];
const descFor = (s) => `Same prompt, byte for byte — "${s.prompt}" — given to the 4 newest Claude models: Haiku 5.5, Sonnet 5.5 and Opus 5.5 at "high" thinking effort, Fable 5.1 at "low". Who builds the best ${s.short}?

Built in a voxel sandbox where Claude (the AI) is a player. Type "@Claude build X" in chat and it writes the build code itself — no mods, no prefabs.

Music: "${SONG_NAME}" (original, made with Suno).
Explore all 4 builds in 3D: ${VIEWER}${s.key}
Full 2-minute demo: https://youtu.be/GDJijs-ZlSk
Code: https://github.com/loathwine/craftplan`;

if (!existsSync(SONG)) { console.error('missing song:', SONG); process.exit(1); }
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', SONG], { encoding: 'utf8' });
const SONG_LEN = parseFloat(probe.stdout);
if (!(SONG_LEN >= SUBJECTS.length * CLIP)) { console.error(`song is ${SONG_LEN}s, need >= ${SUBJECTS.length * CLIP}s`); process.exit(1); }

const videos = [];
let failed = 0;
SUBJECTS.forEach((s, i) => {
  const silent = resolve(SH, `${s.key}-${s.grid}-grid-10s.mp4`);
  const out = resolve(SH, `${s.key}-${s.grid}-grid-10s-halloween.mp4`);
  const start = Math.max(0, +(SONG_LEN - (i + 1) * CLIP).toFixed(2));
  const publishAt = new Date(new Date(START_DATE).getTime() + i * 86400000).toISOString().replace('.000Z', 'Z');
  const title = titleFor(s);
  if (!title) { console.error(`  TITLE TOO LONG: ${s.key}`); failed++; return; }
  if (!existsSync(silent)) { console.error(`  MISSING silent master: ${s.key} (${basename(silent)})`); failed++; return; }
  const r = spawnSync('node', ['scripts/mux-audio.mjs', '--video', silent, '--music', SONG, '--start', String(start), '--out', out],
    { cwd: REPO, encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`  MUX FAILED: ${s.key}\n${(r.stderr||'')+(r.stdout||'')}`.slice(0,300)); failed++; return; }
  console.log(`  ${String(i+1).padStart(2)}. ${publishAt.slice(0,10)}  ${s.key.padEnd(18)} music ${String(start).padStart(6)}s  (${[...title].length} ch)`);
  videos.push({
    file: `recordings/shorts-mode/${basename(out)}`,
    title,
    publishAt,
    tags: [...BASE_TAGS, ...s.tags],
    hashtags: ['shorts','minecraft','ai','claude','halloween', s.htag].filter((h, j, a) => a.indexOf(h) === j),
    description: descFor(s),
  });
});

const manifest = {
  '// note': `"${SONG_NAME}" (user's Suno song) split into 10s windows in REVERSE: oldest upload = song end, newest = song start. Song ${SONG_LEN}s -> ${SUBJECTS.length} shorts, daily from ${START_DATE}.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, 'upload-queue-halloween.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${SUBJECTS.length} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

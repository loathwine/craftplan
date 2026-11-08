// Mux the user's Suno song "Clockwork Mind" across the 14 Steampunk n8 grids in
// REVERSE order (oldest upload = later song window, newest = earlier), then emit
// the yt-batch manifest. Daily 17:00Z from 11-08. (ornithopter = dropped spare.)
//   nix develop .#record --command node marathon/steampunk-batch.mjs --song "recordings/audio/Clockwork Mind.wav" --first 13
import { writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };
if (!arg('song')) { console.error('usage: steampunk-batch.mjs --song <file> [--name "Song title"]'); process.exit(1); }
const SONG = resolve(REPO, arg('song'));
const SONG_NAME = arg('name') || basename(SONG, extname(SONG));
const CLIP = 10;
const START_DATE = '2026-11-08T17:00:00Z';
const VIEWER = 'https://loathwine.github.io/craftplan/models.html?subject=';

// Publish order (day 1 first). grid = which render generation holds the clip.
// prompt = exactly what the models saw (marathon/steampunk-grids.sh).
const SUBJECTS = [
  { key: 'airship',          grid: 'n8', emoji: '🎈', short: 'airship',          prompt: 'a steampunk airship',                                  tags: ['airship','zeppelin','steampunk'],      htag: 'airship' },
  { key: 'clockwork-dragon', grid: 'n8', emoji: '🐉', short: 'dragon',           prompt: 'a clockwork dragon made of brass gears',               tags: ['dragon','clockwork','steampunk'],      htag: 'dragon' },
  { key: 'tesla-tower',      grid: 'n8', emoji: '⚡', short: 'Tesla tower',      prompt: 'a steampunk Tesla coil tower crackling with lightning', tags: ['tesla','teslacoil','steampunk'],       htag: 'tesla' },
  { key: 'automaton',        grid: 'n8', emoji: '🤖', short: 'robot',            prompt: 'a steampunk automaton robot',                          tags: ['robot','automaton','steampunk'],       htag: 'robot' },
  { key: 'clock-tower',      grid: 'n8', emoji: '🕰️', short: 'clock tower',      prompt: 'a steampunk clock tower',                              tags: ['clocktower','clock','steampunk'],      htag: 'clocktower' },
  { key: 'mech-owl',         grid: 'n8', emoji: '🦉', short: 'owl',              prompt: 'a giant mechanical owl',                               tags: ['owl','mechanical','steampunk'],        htag: 'owl' },
  { key: 'steam-factory',    grid: 'n8', emoji: '🏭', short: 'factory',          prompt: 'a Victorian factory with smoking chimneys',            tags: ['factory','victorian','steampunk'],     htag: 'victorian' },
  { key: 'clockwork-spider', grid: 'n8', emoji: '🕷️', short: 'spider',           prompt: 'a giant clockwork spider',                             tags: ['spider','clockwork','steampunk'],      htag: 'spider' },
  { key: 'orrery',           grid: 'n8', emoji: '🪐', short: 'orrery',           prompt: 'a giant brass orrery of the solar system',             tags: ['orrery','solarsystem','steampunk'],    htag: 'space' },
  { key: 'steam-walker',     grid: 'n8', emoji: '⚙️', short: 'walker',           prompt: 'a steam-powered walking machine',                      tags: ['mech','walker','steampunk'],           htag: 'mech' },
  { key: 'pocket-watch',     grid: 'n8', emoji: '⏱️', short: 'pocket watch',     prompt: 'a giant open pocket watch with ticking gears',         tags: ['pocketwatch','clockwork','steampunk'], htag: 'clockwork' },
  { key: 'gyrocopter',       grid: 'n8', emoji: '🚁', short: 'gyrocopter',       prompt: 'a steampunk gyrocopter',                               tags: ['gyrocopter','helicopter','steampunk'], htag: 'helicopter' },
  { key: 'flying-city',      grid: 'n8', emoji: '☁️', short: 'flying city',      prompt: 'a steampunk flying city',                              tags: ['flyingcity','skycity','steampunk'],    htag: 'fantasy' },
  { key: 'time-machine',     grid: 'n8', emoji: '⏳', short: 'time machine',     prompt: "H.G. Wells' time machine",                             tags: ['timemachine','hgwells','steampunk'],   htag: 'timetravel' },
];

// Prompt first: only ~40 chars show in the Shorts feed. Versions live in the
// description + tags.
const titleFor = (s) => [`"${s.prompt}" ${s.emoji} Haiku vs Sonnet vs Opus vs Fable`].find(t => [...t].length <= 100);

const BASE_TAGS = ['shorts','ai','claude','anthropic','minecraft','benchmark','aibenchmark','haiku','sonnet','opus','fable',
  'haiku 5.5','sonnet 5.5','opus 5.5','fable 5.1','voxel'];
const descFor = (s) => `Same prompt, byte for byte — "${s.prompt}" — given to the 4 newest Claude models: Haiku 5.5, Sonnet 5.5 and Opus 5.5 at "high" thinking effort, Fable 5.1 at "low". Who builds the best ${s.short}?

Built in a voxel sandbox where Claude (the AI) is a player. Type "@Claude build X" in chat and it writes the build code itself — no mods, no prefabs.

Explore all 4 builds in 3D: ${VIEWER}${s.key}
Full 2-minute demo: https://youtu.be/GDJijs-ZlSk
Code: https://github.com/loathwine/craftplan`;

if (!existsSync(SONG)) { console.error('missing song:', SONG); process.exit(1); }
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', SONG], { encoding: 'utf8' });
const SONG_LEN = parseFloat(probe.stdout);
const FIRST = arg('first') !== undefined ? +arg('first') : SONG_LEN - SUBJECTS.length * CLIP;
if (!(FIRST >= 0 && FIRST + SUBJECTS.length * CLIP <= SONG_LEN)) { console.error(`song is ${SONG_LEN}s; windows from ${FIRST}s don't fit`); process.exit(1); }

const videos = [];
let failed = 0;
SUBJECTS.forEach((s, i) => {
  const silent = resolve(SH, `${s.key}-${s.grid}-grid-10s.mp4`);
  const out = resolve(SH, `${s.key}-${s.grid}-grid-10s-steampunk.mp4`);
  const start = +(FIRST + (SUBJECTS.length - 1 - i) * CLIP).toFixed(2);
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
    hashtags: ['shorts','minecraft','ai','claude','steampunk', s.htag].filter((h, j, a) => a.indexOf(h) === j),
    description: descFor(s),
  });
});

const manifest = {
  '// note': `"${SONG_NAME}" (user's Suno song) split into 10s windows in REVERSE: oldest upload = song end, newest = song start. Song ${SONG_LEN}s, windows ${FIRST}..${FIRST + SUBJECTS.length * CLIP}s -> ${SUBJECTS.length} shorts, daily from ${START_DATE}.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, 'upload-queue-steampunk.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${SUBJECTS.length} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

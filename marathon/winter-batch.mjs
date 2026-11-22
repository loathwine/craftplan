// Mux the user's Suno song "First Frost" across the 21 Winter n9 grids in
// REVERSE order (oldest upload = later song window, newest = earlier), then emit
// the yt-batch manifest for days --from..--to (1-based). Daily 17:00Z from 11-22;
// day 1 went out late (11-22 21:00Z) because the song arrived after the slot.
// Song windows are fixed over all 21 days, so later batches (--from 16) line up.
//   nix develop .#record --command node marathon/winter-batch.mjs --song "recordings/audio/First Frost.wav" --from 1 --to 15
import { writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };
if (!arg('song')) { console.error('usage: winter-batch.mjs --song <file> [--name "Song title"]'); process.exit(1); }
const SONG = resolve(REPO, arg('song'));
const SONG_NAME = arg('name') || basename(SONG, extname(SONG));
const CLIP = 10;
const START_DATE = '2026-11-22T17:00:00Z';
const DAY1_OVERRIDE = '2026-11-22T21:00:00Z';   // missed the 17:00 slot
const VIEWER = 'https://loathwine.github.io/craftplan/models.html?subject=';

// Publish order (day 1 first). grid = which render generation holds the clip.
// prompt = exactly what the models saw (marathon/winter-grids.sh).
const SUBJECTS = [
  { key: 'ice-dragon',      grid: 'n9', emoji: '🐉', short: 'ice dragon',     prompt: 'an ice dragon',                          tags: ['icedragon','dragon','winter'],        htag: 'dragon' },
  { key: 'howling-wolf',    grid: 'n9', emoji: '🐺', short: 'wolf',           prompt: 'a wolf howling at the moon',             tags: ['wolf','howling','moon'],              htag: 'wolf' },
  { key: 'stave-church',    grid: 'n9', emoji: '⛪', short: 'stave church',   prompt: 'a Norwegian stave church in the snow',   tags: ['stavechurch','norway','viking'],      htag: 'norway' },
  { key: 'frost-giant',     grid: 'n9', emoji: '🪓', short: 'frost giant',    prompt: 'a frost giant wielding an ice axe',      tags: ['frostgiant','giant','norse'],         htag: 'giant' },
  { key: 'emperor-penguin', grid: 'n9', emoji: '🐧', short: 'penguin',        prompt: 'an emperor penguin',                     tags: ['penguin','emperorpenguin','antarctica'], htag: 'penguin' },
  { key: 'snowplow-train',  grid: 'n9', emoji: '🚂', short: 'train',          prompt: 'a steam train with a snowplow',          tags: ['train','steamtrain','snowplow'],      htag: 'train' },
  { key: 'jack-frost',      grid: 'n9', emoji: '🥶', short: 'Jack Frost',     prompt: 'Jack Frost',                             tags: ['jackfrost','frost','winter'],         htag: 'jackfrost' },
  { key: 'frozen-ship',     grid: 'n9', emoji: '⚓', short: 'ship',           prompt: 'a ship trapped in Arctic pack ice',      tags: ['ship','arctic','shipwreck'],          htag: 'ship' },
  { key: 'reindeer',        grid: 'n9', emoji: '🦌', short: 'reindeer',       prompt: 'a reindeer with giant antlers',          tags: ['reindeer','antlers','christmas'],     htag: 'reindeer' },
  { key: 'monastery',       grid: 'n9', emoji: '🏔️', short: 'monastery',      prompt: 'a Tibetan monastery on a snowy peak',    tags: ['monastery','tibet','himalaya'],       htag: 'tibet' },
  { key: 'viking-winter',   grid: 'n9', emoji: '⚔️', short: 'Viking',         prompt: 'a Viking warrior in a snowstorm',        tags: ['viking','warrior','norse'],           htag: 'viking' },
  { key: 'ski-jumper',      grid: 'n9', emoji: '🎿', short: 'ski jumper',     prompt: 'a ski jumper flying off a ski jump',     tags: ['skijump','skiing','wintersports'],    htag: 'skiing' },
  { key: 'moose',           grid: 'n9', emoji: '🫎', short: 'moose',          prompt: 'a moose',                                tags: ['moose','elk','wildlife'],             htag: 'moose' },
  { key: 'st-basils',       grid: 'n9', emoji: '❄️', short: 'cathedral',      prompt: "St. Basil's Cathedral in the snow",      tags: ['stbasils','moscow','cathedral'],      htag: 'architecture' },
  { key: 'frost-phoenix',   grid: 'n9', emoji: '🔥', short: 'phoenix',        prompt: 'a frost phoenix',                        tags: ['phoenix','frostphoenix','mythical'],  htag: 'phoenix' },
  // extension 12-07..12-12 (generated 11-22)
  { key: 'icebreaker',      grid: 'n9', emoji: '🚢', short: 'icebreaker',     prompt: 'a red icebreaker ship smashing through sea ice', tags: ['icebreaker','ship','arctic'], htag: 'ship' },
  { key: 'aurora-cabin',    grid: 'n9', emoji: '🌌', short: 'cabin',          prompt: 'a log cabin under the northern lights',  tags: ['aurora','northernlights','cabin'],    htag: 'aurora' },
  { key: 'hockey-player',   grid: 'n9', emoji: '🏒', short: 'hockey player',  prompt: 'an ice hockey player taking a slapshot', tags: ['hockey','icehockey','nhl'],           htag: 'hockey' },
  { key: 'woolly-rhino',    grid: 'n9', emoji: '🦏', short: 'woolly rhino',   prompt: 'a woolly rhinoceros',                    tags: ['woollyrhino','iceage','prehistoric'], htag: 'iceage' },
  { key: 'snow-monkey',     grid: 'n9', emoji: '🐒', short: 'snow monkey',    prompt: 'a Japanese snow monkey in a hot spring', tags: ['snowmonkey','japan','onsen'],         htag: 'japan' },
  { key: 'snowmobile',      grid: 'n9', emoji: '🛷', short: 'snowmobile',     prompt: 'a snowmobile jumping over a snowdrift',  tags: ['snowmobile','jump','wintersports'],   htag: 'snowmobile' },
];
const FROM = +(arg('from') || 1), TO = +(arg('to') || SUBJECTS.length);

// Prompt first: only ~40 chars show in the Shorts feed. Versions live in the
// description + tags.
const titleFor = (s) => [`"${s.prompt}" ${s.emoji} Haiku vs Sonnet vs Opus vs Fable`].find(t => [...t].length <= 100);

const BASE_TAGS = ['shorts','ai','claude','anthropic','minecraft','benchmark','aibenchmark','haiku','sonnet','opus','fable',
  'haiku 5.5','sonnet 5.5','opus 5.5','fable 5.2','voxel','winter'];
const descFor = (s) => `Same prompt, byte for byte — "${s.prompt}" — given to the 4 newest Claude models: Haiku 5.5, Sonnet 5.5, Opus 5.5 and the brand-new Fable 5.2, all at "high" thinking effort. Who builds the best ${s.short}?

Built in a voxel sandbox where Claude (the AI) is a player. Type "@Claude build X" in chat and it writes the build code itself — no mods, no prefabs.

Explore all 4 builds in 3D: ${VIEWER}${s.key}
Full 2-minute demo: https://youtu.be/GDJijs-ZlSk
Code: https://github.com/loathwine/craftplan`;

if (!existsSync(SONG)) { console.error('missing song:', SONG); process.exit(1); }
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', SONG], { encoding: 'utf8' });
const SONG_LEN = parseFloat(probe.stdout);
// Hand-picked 10s windows (ascending). "First Frost" is 222s with a quiet intro
// (0-10s ~-26dB), a quiet bridge (160-180s, down to -31dB) and a fade at 218s,
// so the windows skip those; 185 overlaps its neighbours by 5s, and the 160
// window (start of the bridge) gets a gain boost. Reverse order: day 1 = last.
const WINDOWS = [[10,1.3],[20],[30],[40],[50],[60],[70],[80],[90],[100],[110],[120],[130],[140],[150],[160,2.2],[180],[185],[190],[200],[208]];
if (WINDOWS.length !== SUBJECTS.length) { console.error(`${WINDOWS.length} windows for ${SUBJECTS.length} subjects`); process.exit(1); }
if (WINDOWS.at(-1)[0] + CLIP > SONG_LEN) { console.error(`song is ${SONG_LEN}s; last window doesn't fit`); process.exit(1); }

const videos = [];
let failed = 0;
SUBJECTS.forEach((s, i) => {
  if (i + 1 < FROM || i + 1 > TO) return;
  const silent = resolve(SH, `${s.key}-${s.grid}-grid-10s.mp4`);
  const out = resolve(SH, `${s.key}-${s.grid}-grid-10s-winter.mp4`);
  const [start, gain = 1] = WINDOWS[SUBJECTS.length - 1 - i];
  const publishAt = i === 0 ? DAY1_OVERRIDE : new Date(new Date(START_DATE).getTime() + i * 86400000).toISOString().replace('.000Z', 'Z');
  const title = titleFor(s);
  if (!title) { console.error(`  TITLE TOO LONG: ${s.key}`); failed++; return; }
  if (!existsSync(silent)) { console.error(`  MISSING silent master: ${s.key} (${basename(silent)})`); failed++; return; }
  const r = spawnSync('node', ['scripts/mux-audio.mjs', '--video', silent, '--music', SONG, '--start', String(start), '--volume', String(gain), '--out', out],
    { cwd: REPO, encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`  MUX FAILED: ${s.key}\n${(r.stderr||'')+(r.stdout||'')}`.slice(0,300)); failed++; return; }
  console.log(`  ${String(i+1).padStart(2)}. ${publishAt.slice(0,10)}  ${s.key.padEnd(18)} music ${String(start).padStart(4)}s${gain !== 1 ? ` x${gain}` : '    '}  (${[...title].length} ch)`);
  videos.push({
    file: `recordings/shorts-mode/${basename(out)}`,
    title,
    publishAt,
    tags: [...BASE_TAGS, ...s.tags],
    hashtags: ['shorts','minecraft','ai','claude','winter', s.htag].filter((h, j, a) => a.indexOf(h) === j),
    description: descFor(s),
  });
});

const manifest = {
  '// note': `"${SONG_NAME}" (user's Suno song) split into hand-picked 10s windows in REVERSE: oldest upload = song end, newest = song start. Song ${SONG_LEN}s, windows ${WINDOWS.map(w => w[0]).join(',')} -> ${SUBJECTS.length} shorts, daily from ${START_DATE}. This manifest = days ${FROM}..${TO}.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, FROM === 1 ? 'upload-queue-winter.json' : `upload-queue-winter-${FROM}-${TO}.json`);
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${TO - FROM + 1} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

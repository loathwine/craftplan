// Mux the "Love Fast" song across 13 benchmark grids in REVERSE order (oldest
// upload = last 10s of the song, newest = first 10s) so a viewer scrolling the
// channel newest->oldest hears the whole song in order. Then emit the yt-batch
// manifest. Run under `nix develop .#record` (needs ffmpeg via mux-audio.mjs).
//
//   nix develop .#record --command node marathon/lovefast-batch.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const SONG = resolve(REPO, 'recordings/audio/Love Fast - Ryan Stasik, Kanika Moore.mp3');
const SONG_LEN = 129.6;
const CLIP = 10;
const START_DATE = '2026-07-12T17:00:00Z';   // day 1 (oldest of batch) = 17:00 UTC slot
const VIEWER = 'https://loathwine.github.io/craftplan/models.html?subject=';

const queue = JSON.parse(readFileSync(resolve(REPO, 'marathon/queue.json'), 'utf8'));
const promptOf = (k) => (queue.subjects.find(s => s.key === k) || {}).prompt || k;

// Order = publish order (day 1 first = oldest = song END). Day i gets song
// window ending at SONG_LEN - i*CLIP, i.e. start = SONG_LEN-(i+1)*CLIP (>=0).
const SUBJECTS = [
  { key: 'king-kong',   emoji: '🦍', short: 'King Kong',   tags: ['kingkong','gorilla','monster'],        htag: 'kingkong' },
  { key: 'shark',       emoji: '🦈', short: 'great white',  tags: ['shark','greatwhite','ocean'],          htag: 'shark' },
  { key: 'terminator',  emoji: '🤖', short: 'Terminator',   tags: ['terminator','robot','scifi'],          htag: 'terminator' },
  { key: 'creeper',     emoji: '🟩', short: 'creeper',      tags: ['creeper','minecraftmob'],              htag: 'creeper' },
  { key: 'kraken',      emoji: '🦑', short: 'kraken',       tags: ['kraken','seamonster','tentacles'],     htag: 'kraken' },
  { key: 'octopus',     emoji: '🐙', short: 'octopus',      tags: ['octopus','seacreature'],               htag: 'octopus' },
  { key: 'godzilla',    emoji: '🦖', short: 'Godzilla',     tags: ['godzilla','kaiju','monster'],          htag: 'godzilla' },
  { key: 'hydra',       emoji: '🐉', short: 'hydra',        tags: ['hydra','dragon','mythology'],          htag: 'hydra' },
  { key: 'cerberus',    emoji: '🔥', short: 'Cerberus',     tags: ['cerberus','mythology','hound'],        htag: 'cerberus' },
  { key: 'minotaur',    emoji: '🐂', short: 'minotaur',     tags: ['minotaur','mythology'],                htag: 'minotaur' },
  { key: 'spider-man',  emoji: '🕷️', short: 'Spider-Man',  tags: ['spiderman','marvel','superhero'],      htag: 'spiderman' },
  { key: 'sea-serpent', emoji: '🐍', short: 'sea serpent',  tags: ['seaserpent','seamonster'],             htag: 'seaserpent' },
  { key: 'werewolf',    emoji: '🌕', short: 'werewolf',     tags: ['werewolf','monster','fullmoon'],       htag: 'werewolf' },
];

const BASE_TAGS = ['shorts','ai','claude','anthropic','minecraft','benchmark','aibenchmark','haiku','sonnet','opus','voxel'];
const descFor = (s) => {
  const p = promptOf(s.key);
  return `Same prompt, byte for byte — "${p}" — given to 4 Claude models: Haiku 4.5, Sonnet 5, Opus 4.8 and Fable 5, all at "high" thinking effort. Who builds the best ${s.short}?

Built in a voxel sandbox where Claude (the AI) is a player. Type "@Claude build X" in chat and it writes the build code itself — no mods, no prefabs.

Explore all 4 builds in 3D: ${VIEWER}${s.key}
Full 2-minute demo: https://youtu.be/GDJijs-ZlSk
Code: https://github.com/loathwine/craftplan`;
};

if (!existsSync(SONG)) { console.error('missing song:', SONG); process.exit(1); }
const videos = [];
let failed = 0;
SUBJECTS.forEach((s, i) => {
  const silent = resolve(SH, `${s.key}-4x-grid-10s.mp4`);
  const out = resolve(SH, `${s.key}-4x-grid-10s-lovefast.mp4`);
  const start = Math.max(0, +(SONG_LEN - (i + 1) * CLIP).toFixed(2));
  const publishAt = new Date(new Date(START_DATE).getTime() + i * 86400000).toISOString().replace('.000Z', 'Z');
  if (!existsSync(silent)) { console.error(`  MISSING silent master: ${s.key}`); failed++; return; }
  const r = spawnSync('node', ['scripts/mux-audio.mjs', '--video', silent, '--music', SONG, '--start', String(start), '--out', out],
    { cwd: REPO, encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`  MUX FAILED: ${s.key}\n${(r.stderr||'')+(r.stdout||'')}`.slice(0,300)); failed++; return; }
  console.log(`  ${String(i+1).padStart(2)}. ${publishAt.slice(0,10)}  ${s.key.padEnd(13)} music ${String(start).padStart(6)}s–${(start+CLIP).toFixed(1)}s`);
  videos.push({
    file: `recordings/shorts-mode/${s.key}-4x-grid-10s-lovefast.mp4`,
    title: `AI benchmark: "${promptOf(s.key)}" — 4 Claude models ${s.emoji}`,
    publishAt,
    tags: [...BASE_TAGS, ...s.tags],
    hashtags: ['shorts','minecraft','ai','benchmark','claude', s.htag],
    description: descFor(s),
  });
});

const manifest = {
  '// note': `Love Fast (Ryan Stasik, Kanika Moore; YT Audio Library, no attribution) split into 10s windows in REVERSE: oldest upload = song end, newest = song start, so newest->oldest scroll plays the whole song. Song ${SONG_LEN}s -> ${SUBJECTS.length} shorts.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, 'upload-queue-lovefast.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${SUBJECTS.length} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

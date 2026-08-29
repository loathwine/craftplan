// Mux "In The Morning" across 31 benchmark grids in REVERSE order (oldest upload
// = song's last 10s, newest = first 10s) then emit the yt-batch manifest.
// Run under `nix develop .#record`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const SONG = resolve(REPO, 'recordings/audio/In The Morning - Blue Beat Review.mp3');
const SONG_LEN = 307.91;
const CLIP = 10;
const START_DATE = '2026-08-30T17:00:00Z';
const VIEWER = 'https://loathwine.github.io/craftplan/models.html?subject=';

// Publish order (day 1 first = oldest = song END). start = SONG_LEN-(i+1)*CLIP.
const SUBJECTS = [
  { key: 'batman',        prompt: 'Batman',                    emoji: '🦇', short: 'Batman',            tags: ['batman','dc','superhero'],          htag: 'batman' },
  { key: 'shrek',         prompt: 'Shrek',                     emoji: '🟢', short: 'Shrek',             tags: ['shrek','dreamworks','ogre'],        htag: 'shrek' },
  { key: 'sonic',         prompt: 'Sonic the Hedgehog',        emoji: '🔵', short: 'Sonic',             tags: ['sonic','sega','hedgehog'],          htag: 'sonic' },
  { key: 'kirby',         prompt: 'Kirby',                     emoji: '🌸', short: 'Kirby',             tags: ['kirby','nintendo'],                 htag: 'kirby' },
  { key: 'minion',        prompt: 'a Minion',                  emoji: '🟡', short: 'Minion',            tags: ['minion','despicableme'],            htag: 'minion' },
  { key: 'optimus-prime', prompt: 'Optimus Prime',             emoji: '🤖', short: 'Optimus Prime',     tags: ['optimusprime','transformers'],      htag: 'optimusprime' },
  { key: 'stormtrooper',  prompt: 'a Stormtrooper',            emoji: '⚪', short: 'Stormtrooper',      tags: ['stormtrooper','starwars'],          htag: 'stormtrooper' },
  { key: 'pacman',        prompt: 'Pac-Man chased by a ghost', emoji: '👾', short: 'Pac-Man',           tags: ['pacman','arcade','retro'],          htag: 'pacman' },
  { key: 'grogu',         prompt: 'Grogu (Baby Yoda)',         emoji: '👶', short: 'Grogu',             tags: ['grogu','babyyoda','mandalorian'],   htag: 'babyyoda' },
  { key: 'wall-e',        prompt: 'Wall-E',                    emoji: '🗑️', short: 'Wall-E',            tags: ['walle','pixar','robot'],            htag: 'walle' },
  { key: 'trex',          prompt: 'a T-Rex',                   emoji: '🦖', short: 'T-Rex',             tags: ['trex','dinosaur','jurassic'],       htag: 'trex' },
  { key: 'ender-dragon',  prompt: 'the Ender Dragon',          emoji: '🐉', short: 'Ender Dragon',      tags: ['enderdragon','minecraft'],          htag: 'enderdragon' },
  { key: 'xenomorph',     prompt: 'the Alien xenomorph',       emoji: '👽', short: 'xenomorph',         tags: ['xenomorph','alien','scifi'],        htag: 'xenomorph' },
  { key: 'yeti',          prompt: 'a yeti',                    emoji: '❄️', short: 'yeti',              tags: ['yeti','bigfoot','snow'],            htag: 'yeti' },
  { key: 'griffin',       prompt: 'a griffin',                 emoji: '🦅', short: 'griffin',           tags: ['griffin','mythology'],              htag: 'griffin' },
  { key: 'pegasus',       prompt: 'Pegasus',                   emoji: '🐎', short: 'Pegasus',           tags: ['pegasus','mythology','greek'],      htag: 'pegasus' },
  { key: 'unicorn',       prompt: 'a unicorn',                 emoji: '🦄', short: 'unicorn',           tags: ['unicorn','mythology','fantasy'],    htag: 'unicorn' },
  { key: 'giant-spider',  prompt: 'a giant spider',            emoji: '🕷️', short: 'giant spider',      tags: ['giantspider','arachnid'],           htag: 'giantspider' },
  { key: 'cyclops',       prompt: 'a cyclops',                 emoji: '👁️', short: 'cyclops',           tags: ['cyclops','mythology','greek'],      htag: 'cyclops' },
  { key: 'troll',         prompt: 'a troll under a bridge',    emoji: '🧌', short: 'troll',             tags: ['troll','mythology','bridge'],       htag: 'troll' },
  { key: 'golem',         prompt: 'a stone golem',             emoji: '🪨', short: 'stone golem',       tags: ['golem','mythology','stone'],        htag: 'golem' },
  { key: 'gorilla',       prompt: 'a silverback gorilla',      emoji: '🦍', short: 'gorilla',           tags: ['gorilla','silverback','ape'],       htag: 'gorilla' },
  { key: 'elephant',      prompt: 'an African elephant',       emoji: '🐘', short: 'elephant',          tags: ['elephant','africa','animal'],       htag: 'elephant' },
  { key: 'mammoth',       prompt: 'a woolly mammoth',          emoji: '🦣', short: 'mammoth',           tags: ['mammoth','iceage','prehistoric'],   htag: 'mammoth' },
  { key: 'big-ben',       prompt: 'Big Ben',                   emoji: '🕰️', short: 'Big Ben',           tags: ['bigben','london','landmark'],       htag: 'bigben' },
  { key: 'lighthouse',    prompt: 'a lighthouse on a cliff',   emoji: '💡', short: 'lighthouse',        tags: ['lighthouse','coast','landmark'],    htag: 'lighthouse' },
  { key: 'sphinx-giza',   prompt: 'the Great Sphinx of Giza',  emoji: '🐪', short: 'Great Sphinx',      tags: ['sphinx','egypt','giza'],            htag: 'sphinx' },
  { key: 'sydney-opera',  prompt: 'the Sydney Opera House',    emoji: '🎭', short: 'Sydney Opera House', tags: ['sydneyoperahouse','australia','landmark'], htag: 'sydneyoperahouse' },
  { key: 'pirate-ship',   prompt: 'a pirate ship',             emoji: '🏴‍☠️', short: 'pirate ship',    tags: ['pirateship','pirates','ship'],      htag: 'pirateship' },
  { key: 'fighter-jet',   prompt: 'a fighter jet',             emoji: '✈️', short: 'fighter jet',       tags: ['fighterjet','military','aviation'], htag: 'fighterjet' },
  { key: 'volcano',       prompt: 'an erupting volcano',       emoji: '🌋', short: 'volcano',           tags: ['volcano','eruption','lava'],        htag: 'volcano' },
];

const BASE_TAGS = ['shorts','ai','claude','anthropic','minecraft','benchmark','aibenchmark','haiku','sonnet','opus','voxel'];
const descFor = (s) => `Same prompt, byte for byte — "${s.prompt}" — given to 4 Claude models: Haiku 4.5, Sonnet 5, Opus 4.8 and Fable 5, all at "high" thinking effort. Who builds the best ${s.short}?

Built in a voxel sandbox where Claude (the AI) is a player. Type "@Claude build X" in chat and it writes the build code itself — no mods, no prefabs.

Explore all 4 builds in 3D: ${VIEWER}${s.key}
Full 2-minute demo: https://youtu.be/GDJijs-ZlSk
Code: https://github.com/loathwine/craftplan`;

if (!existsSync(SONG)) { console.error('missing song:', SONG); process.exit(1); }
const videos = [];
let failed = 0;
SUBJECTS.forEach((s, i) => {
  const silent = resolve(SH, `${s.key}-4x-grid-10s.mp4`);
  const out = resolve(SH, `${s.key}-4x-grid-10s-morning.mp4`);
  const start = Math.max(0, +(SONG_LEN - (i + 1) * CLIP).toFixed(2));
  const publishAt = new Date(new Date(START_DATE).getTime() + i * 86400000).toISOString().replace('.000Z', 'Z');
  if (!existsSync(silent)) { console.error(`  MISSING silent master: ${s.key}`); failed++; return; }
  const r = spawnSync('node', ['scripts/mux-audio.mjs', '--video', silent, '--music', SONG, '--start', String(start), '--out', out],
    { cwd: REPO, encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`  MUX FAILED: ${s.key}\n${(r.stderr||'')+(r.stdout||'')}`.slice(0,300)); failed++; return; }
  console.log(`  ${String(i+1).padStart(2)}. ${publishAt.slice(0,10)}  ${s.key.padEnd(14)} music ${String(start).padStart(6)}s`);
  videos.push({
    file: `recordings/shorts-mode/${s.key}-4x-grid-10s-morning.mp4`,
    title: `AI benchmark: "${s.prompt}" — 4 Claude models ${s.emoji}`,
    publishAt,
    tags: [...BASE_TAGS, ...s.tags],
    hashtags: ['shorts','minecraft','ai','benchmark','claude', s.htag],
    description: descFor(s),
  });
});

const manifest = {
  '// note': `In The Morning (Blue Beat Review; YT Audio Library, no attribution) split into 10s windows in REVERSE: oldest upload = song end, newest = song start. Song ${SONG_LEN}s -> ${SUBJECTS.length} shorts, daily from ${START_DATE}.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, 'upload-queue-morning.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${SUBJECTS.length} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

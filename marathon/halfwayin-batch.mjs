// Mux "Halfway In" across 16 benchmark grids in REVERSE order (oldest upload
// = song's last 10s, newest = first 10s) then emit the yt-batch manifest.
// Run under `nix develop .#record`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const SONG = resolve(REPO, 'recordings/audio/Halfway In - Anno Domini Beats.mp3');
const SONG_LEN = 154.1;
const CLIP = 10;
const START_DATE = '2026-09-29T17:00:00Z';
const VIEWER = 'https://loathwine.github.io/craftplan/models.html?subject=';

// Publish order (day 1 first = oldest = song END). start = SONG_LEN-(i+1)*CLIP.
// prompt is filled from marathon/queue.json (exactly what the models saw).
const queue = JSON.parse(readFileSync(resolve(REPO, 'marathon/queue.json'), 'utf8'));
const SUBJECTS = [
  { key: 'alien-cow',        emoji: '🛸', short: 'UFO abduction',  tags: ['ufo','alien','cow'],                htag: 'ufo' },
  { key: 'knight-vs-dragon', emoji: '⚔️', short: 'dragon fight',   tags: ['knight','dragon','medieval'],       htag: 'dragon' },
  { key: 'locomotive',       emoji: '🚂', short: 'locomotive',     tags: ['locomotive','steamtrain','train'],  htag: 'train' },
  { key: 'loch-ness',        emoji: '🦕', short: 'Nessie',         tags: ['lochness','nessie','cryptid'],      htag: 'lochness' },
  { key: 'wizard-tower',     emoji: '🧙', short: "wizard's tower", tags: ['wizard','tower','fantasy'],         htag: 'wizard' },
  { key: 'scorpion',         emoji: '🦂', short: 'scorpion',       tags: ['scorpion','giantscorpion'],         htag: 'scorpion' },
  { key: 'trex-jeep',        emoji: '🦖', short: 'T-Rex chase',    tags: ['trex','jurassicpark','dinosaur'],   htag: 'jurassicpark' },
  { key: 'pagoda',           emoji: '🏯', short: 'pagoda',         tags: ['pagoda','japan','temple'],          htag: 'japan' },
  { key: 'helicopter',       emoji: '🚁', short: 'helicopter',     tags: ['helicopter','military','aviation'], htag: 'helicopter' },
  { key: 'cobra',            emoji: '🐍', short: 'king cobra',     tags: ['kingcobra','snake','cobra'],        htag: 'cobra' },
  { key: 'neuschwanstein',   emoji: '🏰', short: 'Neuschwanstein', tags: ['neuschwanstein','castle','germany'],htag: 'castle' },
  { key: 'treasure-chest',   emoji: '💰', short: 'treasure chest', tags: ['treasure','gold','pirate'],         htag: 'treasure' },
  { key: 'viking-longship',  emoji: '⛵', short: 'Viking longship',tags: ['viking','longship','norse'],        htag: 'viking' },
  { key: 'eagle',            emoji: '🦅', short: 'bald eagle',     tags: ['baldeagle','eagle','bird'],         htag: 'eagle' },
  { key: 'moai',             emoji: '🗿', short: 'Moai',           tags: ['moai','easterisland','statues'],    htag: 'moai' },
  { key: 'mjolnir',          emoji: '🔨', short: 'Mjölnir',        tags: ['mjolnir','thor','marvel'],          htag: 'thor' },
].map(s => ({ ...s, prompt: queue.subjects.find(x => x.key === s.key).prompt }));

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
  const out = resolve(SH, `${s.key}-4x-grid-10s-halfway.mp4`);
  const start = Math.max(0, +(SONG_LEN - (i + 1) * CLIP).toFixed(2));
  const publishAt = new Date(new Date(START_DATE).getTime() + i * 86400000).toISOString().replace('.000Z', 'Z');
  if (!existsSync(silent)) { console.error(`  MISSING silent master: ${s.key}`); failed++; return; }
  const r = spawnSync('node', ['scripts/mux-audio.mjs', '--video', silent, '--music', SONG, '--start', String(start), '--out', out],
    { cwd: REPO, encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`  MUX FAILED: ${s.key}\n${(r.stderr||'')+(r.stdout||'')}`.slice(0,300)); failed++; return; }
  console.log(`  ${String(i+1).padStart(2)}. ${publishAt.slice(0,10)}  ${s.key.padEnd(14)} music ${String(start).padStart(6)}s`);
  videos.push({
    file: `recordings/shorts-mode/${s.key}-4x-grid-10s-halfway.mp4`,
    title: `AI benchmark: "${s.prompt}" — 4 Claude models ${s.emoji}`,
    publishAt,
    tags: [...BASE_TAGS, ...s.tags],
    hashtags: ['shorts','minecraft','ai','benchmark','claude', s.htag],
    description: descFor(s),
  });
});

const manifest = {
  '// note': `Halfway In (Anno Domini Beats; YT Audio Library, no attribution) split into 10s windows in REVERSE: oldest upload = song end, newest = song start. Song ${SONG_LEN}s -> ${SUBJECTS.length} shorts, daily from ${START_DATE}.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, 'upload-queue-halfway.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${SUBJECTS.length} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

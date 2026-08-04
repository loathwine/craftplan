// Mux "No One Here Gets In Alive" across the 24 benchmark grids in REVERSE order
// (oldest upload = song's last 10s, newest = first 10s) so scrolling the channel
// newest->oldest hears the whole song in order. Then emit the yt-batch manifest.
// Run under `nix develop .#record`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const SONG = resolve(REPO, 'recordings/audio/No One Here Gets In Alive - National Sweetheart.mp3');
const SONG_LEN = 238.36;
const CLIP = 10;
const START_DATE = '2026-08-05T17:00:00Z';   // day 1 (oldest of batch)
const VIEWER = 'https://loathwine.github.io/craftplan/models.html?subject=';

// Publish order (day 1 first = oldest = song END). Day i start = SONG_LEN-(i+1)*CLIP.
const SUBJECTS = [
  { key: 'darth-vader',     prompt: 'Darth Vader',                        emoji: '🌑', short: 'Darth Vader',        tags: ['darthvader','starwars','sith'],        htag: 'darthvader' },
  { key: 'iron-man',        prompt: 'Iron Man',                           emoji: '🔴', short: 'Iron Man',           tags: ['ironman','marvel','avengers'],         htag: 'ironman' },
  { key: 'statue-liberty',  prompt: 'the Statue of Liberty',              emoji: '🗽', short: 'Statue of Liberty',  tags: ['statueofliberty','newyork','landmark'],htag: 'statueofliberty' },
  { key: 'hulk',            prompt: 'the Incredible Hulk',                emoji: '💚', short: 'Hulk',               tags: ['hulk','marvel','avengers'],            htag: 'hulk' },
  { key: 'taj-mahal',       prompt: 'the Taj Mahal',                      emoji: '🕌', short: 'Taj Mahal',          tags: ['tajmahal','india','landmark'],         htag: 'tajmahal' },
  { key: 'thanos',          prompt: 'Thanos',                             emoji: '🟣', short: 'Thanos',             tags: ['thanos','marvel','avengers'],          htag: 'thanos' },
  { key: 'space-shuttle',   prompt: 'the Space Shuttle on its launchpad', emoji: '🚀', short: 'Space Shuttle',      tags: ['spaceshuttle','nasa','rocket'],        htag: 'spaceshuttle' },
  { key: 'mario',           prompt: 'Super Mario',                        emoji: '🍄', short: 'Mario',              tags: ['mario','nintendo','supermario'],       htag: 'supermario' },
  { key: 'christ-redeemer', prompt: 'Christ the Redeemer',                emoji: '✝️', short: 'Christ the Redeemer',tags: ['christtheredeemer','brazil','landmark'],htag: 'christtheredeemer' },
  { key: 'pikachu',         prompt: 'Pikachu',                            emoji: '⚡', short: 'Pikachu',            tags: ['pikachu','pokemon','nintendo'],        htag: 'pikachu' },
  { key: 'stonehenge',      prompt: 'Stonehenge',                         emoji: '🪨', short: 'Stonehenge',         tags: ['stonehenge','england','landmark'],     htag: 'stonehenge' },
  { key: 'deadpool',        prompt: 'Deadpool',                           emoji: '❤️', short: 'Deadpool',           tags: ['deadpool','marvel','antihero'],        htag: 'deadpool' },
  { key: 'yoda',            prompt: 'Yoda',                               emoji: '🟢', short: 'Yoda',               tags: ['yoda','starwars','jedi'],              htag: 'yoda' },
  { key: 'superman',        prompt: 'Superman',                           emoji: '🦸', short: 'Superman',           tags: ['superman','dc','superhero'],           htag: 'superman' },
  { key: 'mount-rushmore',  prompt: 'Mount Rushmore',                     emoji: '🗿', short: 'Mount Rushmore',     tags: ['mountrushmore','usa','landmark'],      htag: 'mountrushmore' },
  { key: 'r2d2',            prompt: 'R2-D2',                              emoji: '🤖', short: 'R2-D2',              tags: ['r2d2','starwars','droid'],             htag: 'r2d2' },
  { key: 'x-wing',          prompt: 'an X-wing starfighter',              emoji: '🛸', short: 'X-wing',             tags: ['xwing','starwars','starfighter'],      htag: 'xwing' },
  { key: 'venom',           prompt: 'Venom',                              emoji: '🕸️', short: 'Venom',              tags: ['venom','marvel','symbiote'],           htag: 'venom' },
  { key: 'golden-gate',     prompt: 'the Golden Gate Bridge',             emoji: '🌉', short: 'Golden Gate Bridge', tags: ['goldengate','sanfrancisco','bridge'],  htag: 'goldengate' },
  { key: 'groot',           prompt: 'Groot',                              emoji: '🌳', short: 'Groot',              tags: ['groot','marvel','guardiansofthegalaxy'],htag: 'groot' },
  { key: 'excalibur',       prompt: 'Excalibur in the stone',             emoji: '⚔️', short: 'Excalibur',          tags: ['excalibur','kingarthur','sword'],      htag: 'excalibur' },
  { key: 'spongebob',       prompt: 'SpongeBob SquarePants',              emoji: '🟨', short: 'SpongeBob',          tags: ['spongebob','nickelodeon','cartoon'],   htag: 'spongebob' },
  { key: 'phoenix',         prompt: 'a phoenix rising from flames',       emoji: '🔥', short: 'phoenix',            tags: ['phoenix','mythology','firebird'],      htag: 'phoenix' },
  { key: 'cthulhu',         prompt: 'Cthulhu',                            emoji: '🐙', short: 'Cthulhu',            tags: ['cthulhu','lovecraft','eldritch'],      htag: 'cthulhu' },
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
  const out = resolve(SH, `${s.key}-4x-grid-10s-noone.mp4`);
  const start = Math.max(0, +(SONG_LEN - (i + 1) * CLIP).toFixed(2));
  const publishAt = new Date(new Date(START_DATE).getTime() + i * 86400000).toISOString().replace('.000Z', 'Z');
  if (!existsSync(silent)) { console.error(`  MISSING silent master: ${s.key}`); failed++; return; }
  const r = spawnSync('node', ['scripts/mux-audio.mjs', '--video', silent, '--music', SONG, '--start', String(start), '--out', out],
    { cwd: REPO, encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`  MUX FAILED: ${s.key}\n${(r.stderr||'')+(r.stdout||'')}`.slice(0,300)); failed++; return; }
  console.log(`  ${String(i+1).padStart(2)}. ${publishAt.slice(0,10)}  ${s.key.padEnd(15)} music ${String(start).padStart(6)}s`);
  videos.push({
    file: `recordings/shorts-mode/${s.key}-4x-grid-10s-noone.mp4`,
    title: `AI benchmark: "${s.prompt}" — 4 Claude models ${s.emoji}`,
    publishAt,
    tags: [...BASE_TAGS, ...s.tags],
    hashtags: ['shorts','minecraft','ai','benchmark','claude', s.htag],
    description: descFor(s),
  });
});

const manifest = {
  '// note': `No One Here Gets In Alive (National Sweetheart; YT Audio Library, no attribution) split into 10s windows in REVERSE: oldest upload = song end, newest = song start. Song ${SONG_LEN}s -> ${SUBJECTS.length} shorts, daily from ${START_DATE}.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, 'upload-queue-noone.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${SUBJECTS.length} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

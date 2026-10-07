// Mux "Bots in the Lobby 2" (user's Suno song) across 15 latest-lineup grids in
// REVERSE order (oldest upload = song's last 10s, newest = first 10s), then
// emit the yt-batch manifest. Replaces the remaining Halfway In slots.
// haunted-house + jack-o-lantern-n are held back for Halloween.
// Run under `nix develop .#record`.
import { writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SH = resolve(REPO, 'recordings/shorts-mode');
const SONG = resolve(REPO, 'recordings/audio/Bots in the Lobby 2.wav');
const SONG_LEN = 154.8;
const CLIP = 10;
const START_DATE = '2026-10-08T17:00:00Z';

// Publish order (day 1 first = oldest = song END). start = SONG_LEN-(i+1)*CLIP.
// prompt = exactly what the models saw (marathon/night-grids.sh, night2-grids.sh).
const SUBJECTS = [
  { key: 'zeus',            emoji: '⚡', short: 'Zeus',            prompt: 'Zeus throwing a lightning bolt',              tags: ['zeus','greekmythology','lightning'],   htag: 'zeus' },
  { key: 'dragon-fire',     emoji: '🐉', short: 'fire-breathing dragon', prompt: 'a dragon breathing fire',           tags: ['dragon','firebreathing','fantasy'],   htag: 'dragon' },
  { key: 'rocket-launch',   emoji: '🚀', short: 'rocket launch',   prompt: 'a rocket launching into space',               tags: ['rocket','space','launch'],            htag: 'space' },
  { key: 'lava-golem',      emoji: '🌋', short: 'lava golem',      prompt: 'a lava golem',                                tags: ['golem','lava','fantasy'],             htag: 'lava' },
  { key: 'ghost-rider',     emoji: '🔥', short: 'Ghost Rider',     prompt: 'Ghost Rider on his flaming motorcycle',       tags: ['ghostrider','marvel','motorcycle'],   htag: 'ghostrider' },
  { key: 'thor',            emoji: '🔨', short: 'Thor',            prompt: 'Thor summoning lightning',                    tags: ['thor','marvel','lightning'],          htag: 'thor' },
  { key: 'viking-funeral',  emoji: '⛵', short: 'Viking funeral',  prompt: 'a burning Viking funeral ship',               tags: ['viking','longship','norse'],          htag: 'viking' },
  { key: 'cyber-samurai',   emoji: '⚔️', short: 'cyber samurai',   prompt: 'a cyberpunk samurai with a neon katana',      tags: ['cyberpunk','samurai','neon'],         htag: 'cyberpunk' },
  { key: 'dragon-hoard',    emoji: '💰', short: 'dragon hoard',    prompt: 'a dragon sleeping on a pile of gold',         tags: ['dragon','treasure','smaug'],          htag: 'dragon' },
  { key: 'eye-of-sauron',   emoji: '👁️', short: 'Eye of Sauron',   prompt: 'the Eye of Sauron on the tower of Barad-dur', tags: ['sauron','lotr','lordoftherings'],     htag: 'lotr' },
  { key: 'bowser',          emoji: '🐢', short: 'Bowser',          prompt: 'Bowser',                                      tags: ['bowser','mario','nintendo'],          htag: 'mario' },
  { key: 'forge',           emoji: '⚒️', short: 'forge',           prompt: "a blacksmith's forge",                        tags: ['blacksmith','forge','medieval'],      htag: 'medieval' },
  { key: 'lighthouse-n',    emoji: '🌩️', short: 'stormy lighthouse', prompt: 'a lighthouse on a stormy night',           tags: ['lighthouse','storm','ocean'],         htag: 'lighthouse' },
  { key: 'wizard-fireball', emoji: '🧙', short: 'wizard',          prompt: 'a wizard casting a fireball',                 tags: ['wizard','fireball','magic'],          htag: 'wizard' },
  { key: 'jungle-temple',   emoji: '🌴', short: 'jungle temple',   prompt: 'a jungle temple with a waterfall',            tags: ['temple','jungle','waterfall'],        htag: 'temple' },
];

const BASE_TAGS = ['shorts','ai','claude','anthropic','minecraft','benchmark','aibenchmark','haiku','sonnet','opus','fable',
  'haiku 5.5','sonnet 5.5','opus 5.5','fable 5.1','voxel'];
const descFor = (s) => `Same prompt, byte for byte — "${s.prompt}" — given to the 4 newest Claude models: Haiku 5.5, Sonnet 5.5 and Opus 5.5 at "high" thinking effort, Fable 5.1 at "low". Who builds the best ${s.short}?

Built in a voxel sandbox where Claude (the AI) is a player. Type "@Claude build X" in chat and it writes the build code itself — no mods, no prefabs.

Music: "Bots in the Lobby" (original, made with Suno).
Full 2-minute demo: https://youtu.be/GDJijs-ZlSk
Code: https://github.com/loathwine/craftplan`;

if (!existsSync(SONG)) { console.error('missing song:', SONG); process.exit(1); }
const videos = [];
let failed = 0;
SUBJECTS.forEach((s, i) => {
  const silent = resolve(SH, `${s.key}-n6-grid-10s.mp4`);
  const out = resolve(SH, `${s.key}-n6-grid-10s-bots.mp4`);
  const start = Math.max(0, +(SONG_LEN - (i + 1) * CLIP).toFixed(2));
  const publishAt = new Date(new Date(START_DATE).getTime() + i * 86400000).toISOString().replace('.000Z', 'Z');
  const title = `Haiku 5.5 vs Sonnet 5.5 vs Opus 5.5 vs Fable 5.1: "${s.prompt}" ${s.emoji}`;
  if (title.length > 100) { console.error(`  TITLE TOO LONG (${title.length}): ${s.key}`); failed++; return; }
  if (!existsSync(silent)) { console.error(`  MISSING silent master: ${s.key}`); failed++; return; }
  const r = spawnSync('node', ['scripts/mux-audio.mjs', '--video', silent, '--music', SONG, '--start', String(start), '--out', out],
    { cwd: REPO, encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`  MUX FAILED: ${s.key}\n${(r.stderr||'')+(r.stdout||'')}`.slice(0,300)); failed++; return; }
  console.log(`  ${String(i+1).padStart(2)}. ${publishAt.slice(0,10)}  ${s.key.padEnd(16)} music ${String(start).padStart(6)}s  (${title.length} ch)`);
  videos.push({
    file: `recordings/shorts-mode/${s.key}-n6-grid-10s-bots.mp4`,
    title,
    publishAt,
    tags: [...BASE_TAGS, ...s.tags],
    hashtags: ['shorts','minecraft','ai','claude','benchmark', s.htag],
    description: descFor(s),
  });
});

const manifest = {
  '// note': `Bots in the Lobby 2 (user's Suno song, Pro plan) split into 10s windows in REVERSE: oldest upload = song end, newest = song start. Song ${SONG_LEN}s -> ${SUBJECTS.length} shorts, daily from ${START_DATE}. Replaces Halfway In slots 10-08..10-14.`,
  startDate: START_DATE,
  videos,
};
const outPath = resolve(SH, 'upload-queue-latest55.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`\n${videos.length}/${SUBJECTS.length} muxed. Manifest -> ${outPath}${failed ? `  (${failed} FAILED)` : ''}`);

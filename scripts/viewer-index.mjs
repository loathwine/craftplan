// Build public/data/plans/viewer-index.json for the public model viewer
// (public/models.html). One entry per 4-model grid subject; per model we store
// the base plan file, the QA-approved rotation angle (applied client-side via
// the same REMAP the QA tool used), and the solid block count.
//
// Two generations of grids:
//   - "4x" grids (Haiku 4.5 / Sonnet 5 / Opus 4.8 / Fable 5, daylight). Frozen:
//     their entries are carried over from the existing viewer-index.json as-is
//     (only the video link is refreshed).
//   - latest-lineup moonlight grids (Haiku 5.5 / Sonnet 5.5 / Opus 5.5 /
//     Fable 5.1): discovered from the plans dir as <k>-haiku55.json +
//     <k>-sonnet55.json + <k>-opus.json + <k>-fable.json. They carry their own
//     `labels` and `night: true`, and are listed first (newest).
//
// Committed + self-contained so the viewer works on static hosting (GitHub
// Pages) with no server / no qa-decisions.json present at runtime.
//
//   nix develop --command node scripts/viewer-index.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PLANS = resolve(ROOT, 'public/data/plans');
const INDEX = resolve(PLANS, 'viewer-index.json');

let decisions = {};
try { decisions = JSON.parse(readFileSync(resolve(ROOT, 'qa-decisions.json'), 'utf8')).decisions || {}; } catch {}

const MODELS = ['haiku', 'sonnet', 'opus', 'fable'];
const LABELS = { haiku: 'Haiku 4.5', sonnet: 'Sonnet 5', opus: 'Opus 4.8', fable: 'Fable 5' };
const LATEST = {
  suffix: { haiku: 'haiku55', sonnet: 'sonnet55', opus: 'opus', fable: 'fable' },
  labels: { haiku: 'Haiku 5.5', sonnet: 'Sonnet 5.5', opus: 'Opus 5.5', fable: 'Fable 5.1' },
};

// Published/scheduled YouTube Short per subject (viewer "▶ Video" link).
// Love Fast reverse-order batch scheduled 2026-07-12..07-24, plus the 3 earlier
// public benchmark shorts. Keep updating as more subjects are uploaded.
const VIDEO_IDS = {
  'king-kong': 'rSesRxBUyQM', 'shark': 's7_UoDFiSu4', 'terminator': 'Pl-rN-ffwnU',
  'creeper': 'YjnD_gx_t_c', 'kraken': 'lBjh3FVmWfo', 'octopus': 'wefOleHZAXQ',
  'godzilla': 'RsuhUE9SktE', 'hydra': 'iDqROE2p2NE', 'cerberus': 'oK05NltBLDE',
  'minotaur': 'x0va-m6y5UI', 'spider-man': 'pzhf90P1do4', 'sea-serpent': 'xKrHgbGxhtk',
  'werewolf': 'zIZL8YEFcfQ',
  'dragon': 'ph3JhHrDHzc', 'giant': 'YqHWKi6e8UE', 'pokeball': 'umbjOokH0us',
  // No One Here Gets In Alive batch (scheduled 2026-08-05..08-28)
  'darth-vader': 'mxVuQSI_DSs', 'iron-man': 'HNBxbYUvX-g', 'statue-liberty': 'NJ6QbJiuxvI',
  'hulk': 'OjWh7zRmH_Y', 'taj-mahal': '2PRthFC0HLg', 'thanos': 'b2dnKiGls4Y',
  'space-shuttle': 'prO8MHZ1-Aw', 'mario': 'iXtHYsFJoHI', 'christ-redeemer': 'fYhdEXiP5vQ',
  'pikachu': 'bKICSo2_XJ8', 'stonehenge': 'ikfvFKsg6RI', 'deadpool': 'bicO_ew4zaA',
  'yoda': 'zIy9aDuUsQc', 'superman': 'ZAgH-sMTqFQ', 'mount-rushmore': 'LKRawuLkV1o',
  'r2d2': '7m6IIcnx77Q', 'x-wing': 'qduYwrj-GG0', 'venom': 'DCDLzX6GhqY',
  'golden-gate': 'zY-JMrafJ-Q', 'groot': 'Pc1I3PxcSUw', 'excalibur': 'BMyTnzkHSvc',
  'spongebob': '3Lq1eFZesPQ', 'phoenix': 'E7kVk32kv_U', 'cthulhu': 'NEtU5uwQDwE',
  // In The Morning batch (scheduled 2026-08-29..09-28)
  'batman': 'Xbn36bXcMcs', 'shrek': 'QWHdAcb6Hto', 'sonic': 'IFbth_GZ1e8',
  'kirby': 'f8xeCFkHd4g', 'minion': 'L6-un9lFbeM', 'optimus-prime': 'wMZZzqxA8OY',
  'stormtrooper': '_U0gl_D_0Ps', 'pacman': 'QSEKqtHj70o', 'grogu': 'y1JoXh65weI',
  'wall-e': 'sO4CuTAul_M', 'trex': 'lfpp2wE9pYM', 'ender-dragon': '3S1icVaCmto',
  'xenomorph': 'yQTBR_yG-W4', 'yeti': 'USZEbCLq3Ok', 'griffin': 'UlgR905ruIU',
  'pegasus': 'FMyhX31_thc', 'unicorn': '9BGWhlFZRY4', 'giant-spider': 'D5PKSIG4qME',
  'cyclops': 'sPPQZD0dMnA', 'troll': 'Tyk61S_gIqQ', 'golem': '2e1Ao336LD0',
  'gorilla': 'isK9tFBDPds', 'elephant': 'T4fPGn--XLQ', 'mammoth': '3_QEc97NbxI',
  'big-ben': '-SXyY91y9S0', 'lighthouse': 'pCNXHzSKALA', 'sphinx-giza': 'adHRFFgT1FY',
  'sydney-opera': 'XWqWL8UIHU8', 'pirate-ship': 'obwGnwMXQ0s', 'fighter-jet': 'rsQzV41mhX4',
  'volcano': 'dmMJMLdnyTs',
  // Halfway In batch (scheduled 2026-09-29..10-14)
  'alien-cow': 'GDDsWAaXAWU', 'knight-vs-dragon': '7mb-neZnW5Y', 'locomotive': 'K0xjXuaHfKE',
  'loch-ness': 'IQt437gaQZ8', 'wizard-tower': 'oUW_IXrHxLM', 'scorpion': '2uOshsPGdSs',
  'trex-jeep': 'U5uDGx4j6Qc', 'pagoda': 'XA-x0_8HiB4', 'helicopter': 'wmwyj3TOCTo',
  'cobra': 'cRf42iukEhg', 'neuschwanstein': 'UoaVQVcKjXc', 'treasure-chest': 'AlY05sJMdzc',
  'viking-longship': 'RnYH-cMMqFo', 'eagle': 'oFNeBtvi86g', 'moai': 'P_uruVsEdQY',
  'mjolnir': 'kXAVZKtzXs0',
  // Latest lineup: Pikachu one-off (2026-10-07) + Bots in the Lobby (2026-10-08..10-22)
  'pikachu-n': 'pWXK3Qrxi3I',
  'zeus': '24reZHaVd7s', 'dragon-fire': 'nGI7vDHEuxo', 'rocket-launch': 'oLrb8Yzbo7k',
  'lava-golem': '3kYQ2nQvMUE', 'ghost-rider': 'ulDfJpau27A', 'thor': 'IMwO2_wU1Uc',
  'viking-funeral': 'NUu-3qdVnvM', 'cyber-samurai': 'WIjc3K9Xg2s', 'dragon-hoard': 'tI5DCM9F_Vw',
  'eye-of-sauron': 'TO0bgxUaTWc', 'bowser': 'dchLTPfL-tI', 'forge': 'LY-Oz4Ez8HI',
  'lighthouse-n': 'P4HJ_B3lkBY', 'wizard-fireball': 'F76K55E7ICI', 'jungle-temple': '9J_6ZcuSYfU',
  // Halloween run (Ghosts in the Machine, 2026-10-23..11-05)
  'witch-cauldron': 'Jx6jxV3g-KE', 'scarecrow': '_HIiMGuD8EQ', 'ghost-ship': 'EGyURmnbIcM',
  'mummy': '50eOaseFnYM', 'frankenstein': 'ssN3qPpUnq4', 'graveyard-zombie': 'Cp0UGLa6Dvo',
  'headless-horseman': 'U8tenuxIIIc', 'haunted-house': 'cWbMu1WnG2g', 'jack-o-lantern-n': 'O7VumNX3q-c',
  'sugar-skull': 'N-H-t_AhTTo', 'grim-reaper': '48Kv9LeiM6Y', 'dracula-castle': 'd6JNm8NtY7A',
  'witch-broom': 'AuI5rTdULgA', 'bonfire-night': 'nQjQ8CTLBXQ',
};

const titleFor = (key) => {
  for (const f of [`${key}.prompt.txt`, `${key}-4x.prompt.txt`]) {
    try {
      const m = readFileSync(resolve(ROOT, 'prompts', f), 'utf8').match(/Design:\s*"([^"]+)"/);
      if (m) return m[1];
    } catch {}
  }
  return key;
};
const solids = (file) => {
  try { return JSON.parse(readFileSync(resolve(PLANS, file), 'utf8')).plan.filter(b => b.block !== 0).length; }
  catch { return 0; }
};
const ytFor = (key) => VIDEO_IDS[key] ? { youtube: `https://youtube.com/shorts/${VIDEO_IDS[key]}` } : {};

// Latest-lineup grids, discovered from the plans dir (newest plan first).
const files = new Set(readdirSync(PLANS));
const latest = [...files]
  .filter(f => f.endsWith('-haiku55.json'))
  .map(f => f.slice(0, -'-haiku55.json'.length))
  .filter(k => MODELS.every(m => files.has(`${k}-${LATEST.suffix[m]}.json`)));
const mtime = (k) => { try { return JSON.parse(readFileSync(resolve(PLANS, `${k}-haiku55.json`), 'utf8')).createdAt || ''; } catch { return ''; } };
latest.sort((a, b) => mtime(b).localeCompare(mtime(a)) || a.localeCompare(b));

const fresh = latest.map(key => {
  const models = {};
  for (const m of MODELS) {
    const file = `${key}-${LATEST.suffix[m]}.json`;
    const d = decisions[`${key}/${m}`];
    models[m] = { file, blocks: solids(file), rot: d && d.status === 'rotate' ? (d.rotationDeg || 0) : 0 };
  }
  return { key, title: titleFor(key), ...ytFor(key), labels: LATEST.labels, night: true, models };
});

// Frozen 4x grids from the existing index.
const prev = JSON.parse(readFileSync(INDEX, 'utf8'));
const freshKeys = new Set(latest);
const frozen = prev.subjects
  .filter(s => !freshKeys.has(s.key) && !s.night)
  .map(({ youtube, ...s }) => ({ ...s, ...ytFor(s.key) }));

const subjects = [...fresh, ...frozen];
const out = {
  generatedAt: new Date().toISOString(),
  models: MODELS,
  modelLabels: LABELS,
  count: subjects.length,
  subjects,
};
writeFileSync(INDEX, JSON.stringify(out, null, 2));
console.log(`viewer-index.json: ${fresh.length} latest-lineup + ${frozen.length} 4x subjects (${subjects.filter(s => s.youtube).length} with video links)`);

// Build public/data/plans/viewer-index.json for the public model viewer
// (public/models.html). One entry per 4-model grid subject; per model we store
// the base plan file, the QA-approved rotation angle (applied client-side via
// the same REMAP the QA tool used), and the solid block count.
//
// Committed + self-contained so the viewer works on static hosting (GitHub
// Pages) with no server / no qa-decisions.json present at runtime.
//
//   nix develop --command node scripts/viewer-index.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PLANS = resolve(ROOT, 'public/data/plans');

const qaIndex = JSON.parse(readFileSync(resolve(PLANS, 'qa-index.json'), 'utf8'));
let decisions = {};
try { decisions = JSON.parse(readFileSync(resolve(ROOT, 'qa-decisions.json'), 'utf8')).decisions || {}; } catch {}

const MODELS = ['haiku', 'sonnet', 'opus', 'fable'];
const LABELS = { haiku: 'Haiku 4.5', sonnet: 'Sonnet 5', opus: 'Opus 4.8', fable: 'Fable 5' };

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
};

const titleFor = (key) => {
  try {
    const t = readFileSync(resolve(ROOT, `prompts/${key}-4x.prompt.txt`), 'utf8');
    const m = t.match(/Design:\s*"([^"]+)"/);
    if (m) return m[1];
  } catch {}
  return key;
};
const solids = (file) => {
  try { return JSON.parse(readFileSync(resolve(PLANS, file), 'utf8')).plan.filter(b => b.block !== 0).length; }
  catch { return 0; }
};

const subjects = [];
for (const s of qaIndex.subjects) {
  if (!MODELS.every(m => s.models?.[m]?.file)) continue; // grid subjects only
  const models = {};
  for (const m of MODELS) {
    const file = s.models[m].file;
    const d = decisions[`${s.key}/${m}`];
    const rot = d && d.status === 'rotate' ? (d.rotationDeg || 0) : 0;
    models[m] = { file, blocks: solids(file), rot };
  }
  const yt = VIDEO_IDS[s.key];
  subjects.push({ key: s.key, title: titleFor(s.key), ...(yt ? { youtube: `https://youtube.com/shorts/${yt}` } : {}), models });
}

const out = {
  generatedAt: new Date().toISOString(),
  models: MODELS,
  modelLabels: LABELS,
  count: subjects.length,
  subjects,
};
writeFileSync(resolve(PLANS, 'viewer-index.json'), JSON.stringify(out, null, 2));
const rotN = subjects.reduce((a, s) => a + MODELS.filter(m => s.models[m].rot).length, 0);
console.log(`viewer-index.json: ${subjects.length} subjects, ${subjects.length * 4} builds, ${rotN} with QA rotation`);

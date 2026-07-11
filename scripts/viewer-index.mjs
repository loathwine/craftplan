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

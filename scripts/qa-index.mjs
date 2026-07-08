// Scan public/data/plans and emit qa-index.json for the QA inspector (qa.html).
// Groups <subject>-4x-<model>[-rot180].json into subjects; lists standalone
// single-build plans separately. Re-run whenever plans are added.
//
//   nix develop --command node scripts/qa-index.mjs

import { readdirSync, writeFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANS = resolve(__dirname, '..', 'public/data/plans');

const files = readdirSync(PLANS).filter(f => f.endsWith('.json') && f !== 'qa-index.json');
const GRID = /^(.*)-4x-(haiku|sonnet|opus|fable)(-rot180)?\.json$/;

const subjects = new Map(); // key -> { models: {model: {file, rot180}} }
const standalone = [];

for (const f of files) {
  const m = f.match(GRID);
  if (m) {
    const [, key, model, rot] = m;
    if (!subjects.has(key)) subjects.set(key, { key, models: {} });
    const s = subjects.get(key);
    s.models[model] = s.models[model] || { model };
    if (rot) s.models[model].rot180 = f;
    else s.models[model].file = f;
  } else {
    standalone.push({ key: f.replace(/\.json$/, ''), file: f });
  }
}

const out = {
  generatedAt: new Date().toISOString(),
  models: ['haiku', 'sonnet', 'opus', 'fable'],
  subjects: [...subjects.values()].sort((a, b) => a.key.localeCompare(b.key)),
  standalone: standalone.sort((a, b) => a.key.localeCompare(b.key)),
};
writeFileSync(resolve(PLANS, 'qa-index.json'), JSON.stringify(out, null, 2));
console.log(`[qa-index] ${out.subjects.length} grid subjects, ${out.standalone.length} standalone -> qa-index.json`);

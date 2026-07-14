// Final Fable burn: flip all remaining blocked_no_fable -> queued AND append a
// batch of new iconic subjects, so the fable loop can consume the remaining
// weekly Fable budget completely before it's sunset.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE = resolve(REPO, 'marathon/queue.json');

// New iconic subjects to add (varied: monsters, characters, landmarks, vehicles/objects).
const NEW = [
  ['cthulhu', 'Cthulhu'],
  ['loch-ness', 'the Loch Ness Monster'],
  ['chimera', 'a chimera'],
  ['basilisk', 'a basilisk'],
  ['wendigo', 'a wendigo'],
  ['superman', 'Superman'],
  ['groot', 'Groot'],
  ['wall-e', 'Wall-E'],
  ['venom', 'Venom'],
  ['deadpool', 'Deadpool'],
  ['christ-redeemer', 'Christ the Redeemer'],
  ['mount-rushmore', 'Mount Rushmore'],
  ['neuschwanstein', 'Neuschwanstein Castle'],
  ['x-wing', 'an X-wing starfighter'],
  ['infinity-gauntlet', 'the Infinity Gauntlet'],
];

const q = JSON.parse(readFileSync(QUEUE, 'utf8'));
const byKey = new Map(q.subjects.map(s => [s.key, s]));

let flipped = 0;
for (const s of q.subjects) if (s.status === 'blocked_no_fable') { s.status = 'queued'; delete s.attempts; flipped++; }

let added = 0;
for (const [key, prompt] of NEW) {
  if (byKey.has(key)) { console.log(`  skip (exists): ${key} [${byKey.get(key).status}]`); continue; }
  q.subjects.push({ key, prompt, status: 'queued' });
  added++;
}

writeFileSync(QUEUE, JSON.stringify(q, null, 2));
const c = {}; for (const s of q.subjects) c[s.status] = (c[s.status] || 0) + 1;
console.log(`flipped ${flipped} blocked->queued, added ${added} new subjects`);
console.log('status counts:', JSON.stringify(c));
console.log('queued:', q.subjects.filter(s => s.status === 'queued').map(s => s.key).join(', '));

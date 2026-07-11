// One-shot: flip the chosen 20 subjects from blocked_no_fable -> queued so the
// fable marathon (batch.mjs) will pick them up. Reports status counts.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE = resolve(REPO, 'marathon/queue.json');

const PICK = [
  'gorilla', 'elephant', 'eagle', 'cobra', 'mammoth',
  'statue-liberty', 'big-ben', 'taj-mahal', 'sphinx-giza', 'sydney-opera',
  'lighthouse', 'wizard-tower', 'pagoda', 'locomotive', 'fighter-jet',
  'space-shuttle', 'volcano', 'excalibur', 'treasure-chest', 'knight-vs-dragon',
];

const q = JSON.parse(readFileSync(QUEUE, 'utf8'));
const byKey = new Map(q.subjects.map(s => [s.key, s]));
const missing = PICK.filter(k => !byKey.has(k));
if (missing.length) { console.error('MISSING KEYS:', missing.join(', ')); process.exit(1); }

let flipped = 0, already = 0;
for (const k of PICK) {
  const s = byKey.get(k);
  if (s.status === 'blocked_no_fable') { s.status = 'queued'; delete s.attempts; flipped++; }
  else { already++; console.log(`  note: ${k} was already status=${s.status}`); }
}
writeFileSync(QUEUE, JSON.stringify(q, null, 2));

const counts = {};
for (const s of q.subjects) counts[s.status] = (counts[s.status] || 0) + 1;
console.log(`flipped ${flipped} -> queued (already non-blocked: ${already})`);
console.log('status counts:', JSON.stringify(counts));
console.log('queued now:', q.subjects.filter(s => s.status === 'queued').map(s => s.key).join(', '));

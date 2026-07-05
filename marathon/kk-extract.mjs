// Extract build code from a claude stream-json .jsonl capture.
// Prefer the terminal result line; fall back to concatenated assistant text
// content blocks (salvages a run that produced code but was killed before
// emitting the result envelope).
import { readFileSync } from 'node:fs';
const lines = readFileSync(process.argv[2], 'utf8').split('\n');
let result = '', assistant = '';
for (const l of lines) {
  if (!l.trim()) continue;
  let j; try { j = JSON.parse(l); } catch { continue; }
  if (j.type === 'result' && typeof j.result === 'string') result = j.result;
  if (j.type === 'assistant' && j.message?.content) {
    for (const b of j.message.content) if (b.type === 'text' && b.text) assistant += b.text;
  }
}
process.stdout.write(result.length > assistant.length ? result : assistant);

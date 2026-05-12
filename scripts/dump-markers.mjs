// Dump the manuscript's audio markers to JSON without a full render.
// Useful when only the timeline changed (e.g. you tweaked a music cue or
// added/removed a shot) and you want fresh markers for an existing MP4.
//
// Usage: nix develop --command node scripts/dump-markers.mjs <out.json>

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');

const { MANUSCRIPT } = await import(`${REPO}/public/js/manuscript.mjs`);

const out = resolve(process.argv[2] || `${REPO}/recordings/latest.markers.json`);
const markers = [];
let t = 0;
for (const s of MANUSCRIPT.shots) {
  markers.push({ t: +t.toFixed(3), kind: 'shot', id: s.id });
  if (s.audio) markers.push({ t: +t.toFixed(3), kind: 'audio', ...s.audio });
  t += s.duration;
}
for (const m of MANUSCRIPT.audioMarkers || []) markers.push({ kind: 'audio', ...m });
markers.sort((a, b) => a.t - b.t);

const payload = {
  duration: +t.toFixed(3),
  fps: MANUSCRIPT.fps,
  width: MANUSCRIPT.width,
  height: MANUSCRIPT.height,
  markers,
};
writeFileSync(out, JSON.stringify(payload, null, 2));
console.log(`Wrote ${markers.length} markers to ${out} (duration ${payload.duration}s)`);

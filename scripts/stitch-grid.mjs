// Compose N labelled clips into a vertical Shorts grid (2×2 for 4 clips,
// 1×2 stacked for 2). Each cell keeps 9:16 so the composed 1080×1920 frame
// is pixel-exact. Labels are drawn per-cell in a top band; an optional
// header line is drawn across the whole frame.
//
//   node scripts/stitch-grid.mjs \
//     --clip "HAIKU|recordings/a.mp4" --clip "SONNET|recordings/b.mp4" \
//     --clip "OPUS|recordings/c.mp4"  --clip "FABLE|recordings/d.mp4" \
//     --duration 10 --header "same prompt, 4 AI models" \
//     --out recordings/shorts-mode/compare-4x.mp4
//
// Cells are assigned reading order: top-left, top-right, bottom-left,
// bottom-right.

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const argv = (() => {
  const a = { clip: [] };
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const k = arg.slice(2), n = process.argv[i + 1];
      const v = n && !n.startsWith('--') ? (i++, n) : true;
      if (k === 'clip') a.clip.push(v); else a[k] = v;
    }
  }
  return a;
})();

const CLIPS = argv.clip.map(s => {
  const [label, file] = s.split('|');
  if (!label || !file) { console.error(`bad --clip "${s}" (want "LABEL|file.mp4")`); process.exit(1); }
  return { label, file: resolve(file) };
});
if (CLIPS.length !== 2 && CLIPS.length !== 4) { console.error('need exactly 2 or 4 --clip args'); process.exit(1); }
const DURATION = parseFloat(argv.duration || '10');
const OUT = resolve(argv.out || 'grid.mp4');
const HEADER = argv.header || '';
const W = 1080, H = 1920;
const [cw, ch] = CLIPS.length === 4 ? [W / 2, H / 2] : [W, H / 2];

const inputs = CLIPS.flatMap(c => ['-t', String(DURATION), '-i', c.file]);
const labelFs = CLIPS.length === 4 ? 56 : 64;
const cells = CLIPS.map((c, i) =>
  `[${i}:v]scale=${cw}:${ch}:force_original_aspect_ratio=increase,crop=${cw}:${ch},` +
  `drawtext=text='${c.label.replace(/'/g, '')}':fontsize=${labelFs}:fontcolor=white:` +
  `borderw=5:bordercolor=black:x=(w-text_w)/2:y=36[c${i}]`).join(';');
const layout = CLIPS.length === 4
  ? `0_0|${cw}_0|0_${ch}|${cw}_${ch}`
  : `0_0|0_${ch}`;
let graph = `${cells};${CLIPS.map((_, i) => `[c${i}]`).join('')}xstack=inputs=${CLIPS.length}:layout=${layout}[grid]`;
// Thin separator lines so the quadrants read as a deliberate grid.
graph += `;[grid]drawbox=x=0:y=${ch - 2}:w=${W}:h=4:color=black@0.85:t=fill` +
  (CLIPS.length === 4 ? `,drawbox=x=${cw - 2}:y=0:w=4:h=${H}:color=black@0.85:t=fill` : '') + `[sep]`;
graph += HEADER
  ? `;[sep]drawtext=text='${HEADER.replace(/'/g, '')}':fontsize=54:fontcolor=yellow:borderw=5:bordercolor=black:x=(w-text_w)/2:y=${H / 2 - 34}[v]`
  : `;[sep]null[v]`;

const args = [
  '-y', '-hide_banner', '-loglevel', 'warning',
  ...inputs,
  '-filter_complex', graph,
  '-map', '[v]', '-an',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  OUT,
];
console.log(`[stitch-grid] ${CLIPS.length} cells @ ${cw}x${ch} → ${OUT}`);
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
process.exit(r.status ?? 1);

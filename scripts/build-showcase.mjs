// Assemble a multi-clip showcase video from a list of segments.
// Each segment specifies an input file, optional start/duration, and a
// top-of-frame label that fades on/off. ffmpeg does the rest in one
// filter_complex pass.
//
// Usage:
//   node scripts/build-showcase.mjs --out path.mp4 \
//     --height 1280 \
//     --clip "BEFORE / v7|path1.mp4|0|6" \
//     --clip "AFTER / new look|path2.mp4|0|6" \
//     ...
//
// Each --clip is "label|file|start|duration".
// The output is portrait if input clips are portrait; we just stack the
// label as a top band per-segment then concat.

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const argv = (() => {
  const a = { clip: [] };
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const k = arg.slice(2), n = process.argv[i + 1];
      if (k === 'clip') { a.clip.push(n); i++; }
      else if (n && !n.startsWith('--')) { a[k] = n; i++; }
      else a[k] = true;
    }
  }
  return a;
})();

const WIDTH  = parseInt(argv.width  || '720');
const HEIGHT = parseInt(argv.height || '1280');
const FONT   = argv.font || '/nix/store/b5gf37jp4y3965bp6x9wanzqchkkvbvs-dejavu-fonts-2.37/share/fonts/truetype/DejaVuSans-Bold.ttf';
const OUT    = resolve(argv.out);

const clips = argv.clip.map((spec) => {
  const [label, file, start, dur] = spec.split('|');
  return { label, file: resolve(file), start: parseFloat(start || '0'), dur: parseFloat(dur || '6') };
});
if (!clips.length) { console.error('At least one --clip required'); process.exit(1); }

const inputs = clips.flatMap((c) => ['-ss', String(c.start), '-t', String(c.dur), '-i', c.file]);

const labelEsc = (s) => s.replace(/:/g, '\\:').replace(/'/g, "\\'");

// Default fit mode is "contain" (letterbox): the whole source frame is
// preserved with black bars where aspects differ. concat=v=1 demands
// uniform dimensions across segments, so we scale-then-pad each clip
// to exactly WIDTH×HEIGHT.
const filterParts = clips.map((c, i) => {
  const lbl = labelEsc(c.label);
  return `[${i}:v]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,` +
    `pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,` +
    `drawbox=y=0:x=0:w=iw:h=170:color=black@0.65:t=fill,` +
    `drawtext=fontfile='${FONT}':text='${lbl}':fontsize=46:fontcolor=white:borderw=4:bordercolor=black:x=(w-text_w)/2:y=50,` +
    `format=yuv420p[v${i}]`;
});

const concatInputs = clips.map((_, i) => `[v${i}]`).join('');
const filter = filterParts.join(';') + `;${concatInputs}concat=n=${clips.length}:v=1:a=0[out]`;

const args = [
  '-y', '-hide_banner', '-loglevel', 'warning',
  ...inputs,
  '-filter_complex', filter,
  '-map', '[out]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  OUT,
];
console.log(`ffmpeg → ${OUT} (${clips.length} clips)`);
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
process.exit(r.status);

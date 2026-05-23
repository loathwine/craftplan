// Stitch a before/after side-by-side video. Takes the v7 master and a
// freshly-rendered shot, lines them up time-wise, and produces an mp4
// labelled BEFORE / AFTER.
//
//   node scripts/stitch-compare.mjs --before v7.mp4 --before-start 31 \
//     --after dragon-new.mp4 --duration 11 --out compare-dragon.mp4

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const argv = (() => {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const k = arg.slice(2), n = process.argv[i + 1];
      if (n && !n.startsWith('--')) { a[k] = n; i++; } else { a[k] = true; }
    }
  }
  return a;
})();

const BEFORE       = resolve(argv.before);
const BEFORE_START = parseFloat(argv['before-start'] || '0');
const AFTER        = resolve(argv.after);
const AFTER_START  = parseFloat(argv['after-start'] || '0');
const DURATION     = parseFloat(argv.duration || '10');
const OUT          = resolve(argv.out);
const HEIGHT       = parseInt(argv.height || '720');

// Single ffmpeg invocation. Each input scaled to the same height; labels
// drawn into a top-left band; hstack joins them.
const args = [
  '-y', '-hide_banner', '-loglevel', 'warning',
  '-ss', String(BEFORE_START), '-t', String(DURATION), '-i', BEFORE,
  '-ss', String(AFTER_START),  '-t', String(DURATION), '-i', AFTER,
  '-filter_complex',
  `[0:v]scale=-2:${HEIGHT},drawtext=text='BEFORE (v7)':fontsize=42:fontcolor=yellow:borderw=4:bordercolor=black:x=20:y=20[a];` +
  `[1:v]scale=-2:${HEIGHT},drawtext=text='AFTER (shorts-mode)':fontsize=42:fontcolor=yellow:borderw=4:bordercolor=black:x=20:y=20[b];` +
  `[a][b]hstack=inputs=2,format=yuv420p`,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
  '-movflags', '+faststart',
  OUT,
];
console.log('ffmpeg', args.slice(args.indexOf('-filter_complex'), args.indexOf('-filter_complex') + 2).join(' '));
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
process.exit(r.status);

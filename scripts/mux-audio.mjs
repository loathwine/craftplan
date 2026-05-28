// Mux a music track onto a silent video for Shorts.
//
//   nix develop .#record --command node scripts/mux-audio.mjs \
//     --video recordings/shorts-mode/pyramid-10s.mp4 \
//     --music recordings/audio/demon-jvna.mp3 \
//     --start 15 \
//     --out recordings/shorts-mode/pyramid-10s-music.mp4
//
// --start <s>     Offset into the music track where the clip starts. Default 0.
// --fade-out <s>  Audio fade-out length at the end. Default 0.3.
// --volume <gain> Audio gain multiplier (1.0 = unchanged). Default 1.0.
//
// Video is copied through (no re-encode). Audio is sliced from the source
// track at --start, trimmed to the video's duration, and AAC-encoded.

import { spawnSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
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

function fail(msg) { console.error(`[mux] ${msg}`); process.exit(1); }

const VIDEO = argv.video && resolve(argv.video);
const MUSIC = argv.music && resolve(argv.music);
const OUT   = argv.out   && resolve(argv.out);
if (!VIDEO || !existsSync(VIDEO)) fail('--video required');
if (!MUSIC || !existsSync(MUSIC)) fail('--music required');
if (!OUT) fail('--out required');

const START   = parseFloat(argv.start ?? '0');
const FADEOUT = parseFloat(argv['fade-out'] ?? '0.3');
const VOLUME  = parseFloat(argv.volume ?? '1.0');

// Probe video duration so we can fade out cleanly
const probe = spawnSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1', VIDEO,
], { encoding: 'utf-8' });
const duration = parseFloat(probe.stdout.trim());
if (!isFinite(duration)) fail('could not probe video duration');

const fadeStart = Math.max(0, duration - FADEOUT);
const afilter = `volume=${VOLUME},afade=t=out:st=${fadeStart}:d=${FADEOUT}`;

console.log(`[mux] ${argv.video.split('/').pop()} (${duration.toFixed(2)}s) + ${argv.music.split('/').pop()} @ ${START}s`);

const args = [
  '-y', '-hide_banner', '-loglevel', 'warning',
  '-i', VIDEO,
  '-ss', String(START), '-i', MUSIC,
  '-t', String(duration),
  '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy',
  '-c:a', 'aac', '-b:a', '192k',
  '-af', afilter,
  '-shortest',
  '-movflags', '+faststart',
  OUT,
];
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
process.exit(r.status);

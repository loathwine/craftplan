// Top-level demo manuscript. Composes the skit + montage modules into a
// global timeline. Each shot's start = sum of previous durations.

import { SKIT_AVATARS, SKIT_SETUP, SKIT_SHOTS } from './skit.mjs';
import { MONTAGE_SETUP, MONTAGE_SHOTS } from './montage.mjs';

// Avatars used in any shot. Build shots default Claude here if missing.
const AVATARS = {
  ...SKIT_AVATARS,
  // Background bots that populate the outro: each a different colour so the
  // pull-back reveals "more agents working".
  Bot_NW: { bodyColor: 0xef4444, headColor: 0xffcc88, hat: { shape: 'box',  color: 0x991b1b } },
  Bot_NE: { bodyColor: 0xa855f7, headColor: 0xffcc88, hat: { shape: 'cone', color: 0x4c1d95 } },
  Bot_SW: { bodyColor: 0x06b6d4, headColor: 0xffcc88, hat: { shape: 'cyl',  color: 0x0e7490 } },
  Bot_SE: { bodyColor: 0xeab308, headColor: 0xffcc88, hat: { shape: 'cone', color: 0xa16207 } },
};

// Compute the timestamp at which the montage begins (= sum of skit durations)
const SKIT_END = SKIT_SHOTS.reduce((acc, s) => acc + s.duration, 0);

export const MANUSCRIPT = {
  fps: 30,
  width: 1280,
  height: 720,
  avatars: AVATARS,
  setup: [...SKIT_SETUP, ...MONTAGE_SETUP],
  shots: [...SKIT_SHOTS, ...MONTAGE_SHOTS],
  // Post-production cues: drop your music/SFX file aligned to these times.
  audioMarkers: [
    { t: 0,        kind: 'music', section: 'intro',  note: 'soft ambient, mildly comedic strings' },
    { t: SKIT_END - 1.0, kind: 'sfx',   id: 'whoosh', note: 'rising whoosh before the drop' },
    { t: SKIT_END, kind: 'music', section: 'drop',   note: 'techno drop — montage begins' },
    // Outro = last shot. Recorder also emits a shot marker for it; this is
    // an extra music cue.
    { t: SKIT_END + 89, kind: 'music', section: 'outro', note: 'orchestral swell / fade' },
  ],
};

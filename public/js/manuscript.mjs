// Top-level demo manuscript. Composes the skit + montage modules into a
// global timeline. Each shot's start = sum of previous durations.

import { SKIT_AVATARS, SKIT_SETUP, SKIT_SHOTS } from './skit.mjs';
import { MONTAGE_SETUP, MONTAGE_SHOTS } from './montage.mjs';

// Avatars used in any shot. Build shots default Claude here if missing.
const AVATARS = {
  ...SKIT_AVATARS,
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

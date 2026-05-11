// Build montage: 9 LLM-cached structures placed in a 3x3 grid so each
// orbit camera frames its build alone, then an outro pull-back to reveal
// them all.

// 3x3 grid: 70 block spacing (room for orbit radius 35 without bleed).
const ROW_A_Z = 105, ROW_B_Z = 170, ROW_C_Z = 235;
const COL_W_X = 60,  COL_M_X = 130, COL_E_X = 200;

// Origins
const O_DRAGON    = [COL_W_X, 19, ROW_A_Z];
const O_VOLCANO   = [COL_M_X, 19, ROW_A_Z];
const O_HOGWARTS  = [COL_E_X, 19, ROW_A_Z];
const O_PIRATE    = [COL_W_X, 19, ROW_B_Z];
const O_OCTOPUS   = [COL_M_X, 19, ROW_B_Z];
const O_COLOSSEUM = [COL_E_X, 19, ROW_B_Z];
const O_ROCINANTE = [COL_W_X, 19, ROW_C_Z];
const O_KURAMA    = [COL_M_X, 19, ROW_C_Z];
const O_PAGODA    = [COL_E_X, 19, ROW_C_Z];

function buildShot({ id, plan, origin, prompt, duration = 11, radius = 35, height = 14, startA = 0.4, endA = 2.6, rotateY = 0, fade = 0 }) {
  const center = [origin[0], origin[1] + 16, origin[2]];
  return {
    id,
    duration,
    fade,
    camera: { type: 'orbit', center, radius, height, startAngle: startA, endAngle: endA },
    overlay: { html: prompt, t0: 0.3, t1: duration - 1.2, fadeIn: 0.3, fadeOut: 0.8 },
    // Identity is established in the skit; nameplates only pull focus from
    // the build itself during the montage.
    hideTags: true,
    build: {
      plan, origin, bot: 'Claude', rotateY,
      startT: 0.8,
      endT: duration - 1.5,
      botRadius: 8, botHeight: 4,
    },
  };
}

export const MONTAGE_SETUP = [
  // Big terrain-aware clear over all build sites + a bit of margin.
  { type: 'clearAboveGround', min: [25, 85], max: [230, 256], topY: 60 },
];

export const MONTAGE_SHOTS = [
  // First montage shot fades in from black to mirror the skit-amazed fade-out.
  // This sells the "music drop" beat.
  Object.assign(buildShot({
    id: 'dragon',
    plan: 'dragon-tower',
    origin: O_DRAGON,
    prompt: '@Claude build a dragon coiled around a tower',
    duration: 11, radius: 38, height: 14,
  }), { fadeIn: 0.6 }),
  buildShot({
    id: 'volcano',
    plan: 'volcano',
    origin: O_VOLCANO,
    prompt: '@Claude build an erupting volcano',
    duration: 10, radius: 38, height: 16,
  }),
  buildShot({
    id: 'hogwarts',
    plan: 'hogwarts',
    origin: O_HOGWARTS,
    prompt: '@Claude build Hogwarts castle',
    duration: 11, radius: 42, height: 16,
  }),
  buildShot({
    id: 'pirate',
    plan: 'pirate-ship',
    origin: O_PIRATE,
    prompt: '@Claude build a pirate ship with three masts',
    duration: 10, radius: 32, height: 14,
  }),
  buildShot({
    id: 'octopus',
    plan: 'octopus',
    origin: O_OCTOPUS,
    prompt: '@Claude build a giant octopus rising from the ground',
    duration: 10, radius: 34, height: 14,
  }),
  buildShot({
    id: 'colosseum',
    plan: 'colosseum',
    origin: O_COLOSSEUM,
    prompt: '@Claude build a Roman colosseum',
    duration: 10, radius: 36, height: 10,
  }),
  buildShot({
    id: 'rocinante',
    plan: 'rocinante',
    origin: O_ROCINANTE,
    prompt: '@Claude build a sci-fi spaceship',
    duration: 9, radius: 28, height: 14,
  }),
  buildShot({
    id: 'kurama',
    plan: 'naruto-kurama',
    origin: O_KURAMA,
    prompt: '@Claude build Kurama the nine-tailed fox',
    duration: 10, radius: 35, height: 12,
    // Start the camera south so the fox's face (drawn pointing +Z) is toward us.
    startA: Math.PI * 0.5, endA: Math.PI * 1.5,
  }),
  // Last montage build fades out so the outro can fade in for a clean reveal.
  Object.assign(buildShot({
    id: 'pagoda',
    plan: 'glass-pagoda',
    origin: O_PAGODA,
    prompt: '@Claude build a Japanese pagoda',
    duration: 9, radius: 30, height: 14,
  }), { fadeOut: 0.6 }),
  // Outro pull-back: high arc with all 9 builds in frame.
  {
    id: 'outro',
    duration: 9,
    fadeIn: 0.8, fadeOut: 1.2,
    camera: {
      type: 'dolly',
      from: [-30, 50, 170],        // start low on the west
      to:   [-50, 180, 100],       // end high, pulling back northwest
      lookFrom: [130, 30, 170],
      lookTo:   [130, 35, 170],
    },
    title: { html: 'CraftPlan', t0: 1.0, t1: 7.0, fadeIn: 0.6, fadeOut: 0.8 },
    overlay: { html: 'AI-designed worlds · built in real time', t0: 1.8, t1: 7.5, fadeIn: 0.6, fadeOut: 1.0 },
  },
];

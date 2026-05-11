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
  // Outro: Edvin on a brick throne in the middle of the grid, surrounded
  // by working bots; camera dollies from a close-on-throne shot out to a
  // high wide aerial revealing everything.
  {
    id: 'outro',
    duration: 11,
    fadeIn: 0.8, fadeOut: 1.4,
    camera: {
      type: 'dolly',
      from: [130, 25, 162],       // close, south of the throne
      to:   [-10, 140, 30],        // far NW, high — full aerial of the 3x3
      lookFrom: [130, 23, 137],   // throne head height
      lookTo:   [130, 35, 170],   // sweep gaze toward the centre of builds
    },
    title: { html: 'CraftPlan', t0: 5.5, t1: 9.5, fadeIn: 0.6, fadeOut: 0.8 },
    overlay: { html: 'AI-designed worlds · built in real time', t0: 6.2, t1: 10.0, fadeIn: 0.6, fadeOut: 1.0 },
    // Throne placement: a small brick chair at the center of the grid.
    events: (() => {
      const TX = 130, TY = 19, TZ = 137;
      const ops = [];
      const BRICK = 10, OAK = 4, GLASS = 11, STONE = 3, GRASS = 1;
      // 3x3 stone platform, 2 high
      for (let dy = 0; dy < 2; dy++)
        for (let dx = -1; dx <= 1; dx++)
          for (let dz = -1; dz <= 1; dz++)
            ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ + dz, block: STONE });
      // Brick seat one above platform
      for (let dx = -1; dx <= 1; dx++) ops.push({ t: 0.05, x: TX + dx, y: TY + 2, z: TZ, block: BRICK });
      // Brick back wall (3 wide, 3 tall) one z behind
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = 2; dy <= 4; dy++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ - 1, block: BRICK });
      // Side armrests (oak log)
      for (let dy = 2; dy <= 3; dy++) {
        ops.push({ t: 0.05, x: TX - 2, y: TY + dy, z: TZ, block: OAK });
        ops.push({ t: 0.05, x: TX + 2, y: TY + dy, z: TZ, block: OAK });
      }
      // Glass cap on the back (decorative)
      for (let dx = -1; dx <= 1; dx++) ops.push({ t: 0.05, x: TX + dx, y: TY + 5, z: TZ - 1, block: GLASS });
      // Carpet leading up: planks block at front of throne
      for (let dz = 1; dz <= 4; dz++) ops.push({ t: 0.05, x: TX, y: TY + 2, z: TZ + dz, block: BRICK });
      return ops;
    })(),
    avatars: {
      Edvin: {
        pos: [130, 22, 137],            // perched on the throne
        look: [130, 22, 200],            // looking south, toward the start-of-dolly camera
        expression: 'smug',
        showTag: false,
        still: true,                    // no idle bob — he sits regal
      },
      // A few background bots "working" — visible as tiny figures at distance.
      Bot_NW: { pos: [108, 21, 108], look: [99, 21, 99], expression: 'focused', showTag: false },
      Bot_NE: { pos: [178, 21, 108], look: [200, 21, 99], expression: 'focused', showTag: false },
      Bot_SW: { pos: [68,  21, 178], look: [60, 21, 200], expression: 'focused', showTag: false },
      Bot_SE: { pos: [208, 21, 178], look: [200, 21, 200], expression: 'focused', showTag: false },
    },
  },
];

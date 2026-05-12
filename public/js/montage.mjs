// Build montage: 12 LLM-cached structures in a 4x3 grid plus an outro
// pull-back. Each orbit camera frames its build alone, then the outro
// dollies from close on the throne out to a high aerial showing them all.

// 4x3 grid: x at 60-block spacing, z at 65-block spacing.
const COL_X = [40, 100, 160, 220];
const ROW_Z = [105, 170, 235];

const O = (cx, rz) => [COL_X[cx], 19, ROW_Z[rz]];

// Build slot mapping. The grid is read row-by-row in display order so a
// camera that flies west-to-east would naturally trace it.
const O_DRAGON    = O(0, 0);  // NW
const O_VOLCANO   = O(1, 0);
const O_HOGWARTS  = O(2, 0);
const O_STONEHENG = O(3, 0);  // NE
const O_PIRATE    = O(0, 1);
const O_OCTOPUS   = O(1, 1);
const O_COLOSSEUM = O(2, 1);
const O_PYRAMID   = O(3, 1);
const O_ROCINANTE = O(0, 2);
const O_KURAMA    = O(1, 2);
const O_PAGODA    = O(2, 2);
const O_EIFFEL    = O(3, 2);  // SE

function buildShot({ id, plan, origin, prompt, duration = 9, radius = 30, height = 14, startA = 0.4, endA = 2.4, rotateY = 0, fadeIn, fadeInColor, fadeOut, fadeOutColor }) {
  const center = [origin[0], origin[1] + 14, origin[2]];
  const shot = {
    id,
    duration,
    camera: { type: 'orbit', center, radius, height, startAngle: startA, endAngle: endA },
    overlay: { html: prompt, t0: 0.3, t1: duration - 1.0, fadeIn: 0.3, fadeOut: 0.8 },
    hideTags: true,
    build: {
      plan, origin, bot: 'Claude', rotateY,
      startT: 0.6,
      endT: duration - 1.0,
      botRadius: 8, botHeight: 4,
    },
  };
  if (fadeIn !== undefined) shot.fadeIn = fadeIn;
  if (fadeInColor !== undefined) shot.fadeInColor = fadeInColor;
  if (fadeOut !== undefined) shot.fadeOut = fadeOut;
  if (fadeOutColor !== undefined) shot.fadeOutColor = fadeOutColor;
  return shot;
}

export const MONTAGE_SETUP = [
  // Cover the entire 4x3 grid + a bit of margin so trees never bleed in.
  { type: 'clearAboveGround', min: [10, 85], max: [255, 260], topY: 60 },
  // Clear the throne site north of Row A — much taller now so the throne
  // can tower above the sculptures.
  { type: 'clearAboveGround', min: [115, 30], max: [145, 75], topY: 95 },
];

export const MONTAGE_SHOTS = [
  // Music drop: dragon opens out of white.
  buildShot({
    id: 'dragon', plan: 'dragon-tower', origin: O_DRAGON,
    prompt: '@Claude build a dragon coiled around a tower',
    duration: 11, radius: 34, height: 16,
    fadeIn: 0.5, fadeInColor: '#fff',
  }),
  buildShot({
    id: 'hogwarts', plan: 'hogwarts', origin: O_HOGWARTS,
    prompt: '@Claude build Hogwarts castle',
    duration: 10, radius: 38, height: 16,
  }),
  buildShot({
    id: 'pirate', plan: 'pirate-ship', origin: O_PIRATE,
    prompt: '@Claude build a pirate ship with three masts',
    duration: 9, radius: 28, height: 14,
  }),
  buildShot({
    id: 'kurama', plan: 'naruto-kurama', origin: O_KURAMA,
    prompt: '@Claude build Kurama the nine-tailed fox',
    duration: 10, radius: 38, height: 14,
    // Tight arc on the south side only — Kurama's face is at +Z so we keep
    // the camera in front of it the whole time, never circling round back.
    startA: Math.PI * 0.35, endA: Math.PI * 0.75,
  }),
  buildShot({
    id: 'octopus', plan: 'octopus', origin: O_OCTOPUS,
    prompt: '@Claude build a giant octopus rising from the ground',
    duration: 10, radius: 40, height: 16,
    startA: Math.PI * 0.4, endA: Math.PI * 1.6,  // start south to see eyes
  }),
  buildShot({
    id: 'colosseum', plan: 'colosseum', origin: O_COLOSSEUM,
    prompt: '@Claude build a Roman colosseum',
    duration: 9, radius: 32, height: 10,
  }),
  buildShot({
    id: 'stonehenge', plan: 'stonehenge', origin: O_STONEHENG,
    prompt: '@Claude build Stonehenge',
    duration: 8, radius: 22, height: 10,
  }),
  buildShot({
    id: 'volcano', plan: 'volcano', origin: O_VOLCANO,
    prompt: '@Claude build an erupting volcano',
    duration: 9, radius: 34, height: 14,
  }),
  buildShot({
    id: 'pyramid', plan: 'pyramid', origin: O_PYRAMID,
    prompt: '@Claude build the Great Pyramid of Giza',
    duration: 9, radius: 38, height: 12,
  }),
  buildShot({
    id: 'eiffel', plan: 'eiffel-tower', origin: O_EIFFEL,
    prompt: '@Claude build the Eiffel Tower',
    duration: 9, radius: 28, height: 16,
  }),
  buildShot({
    id: 'rocinante', plan: 'rocinante', origin: O_ROCINANTE,
    prompt: '@Claude build a sci-fi spaceship',
    duration: 9, radius: 26, height: 14,
  }),
  buildShot({
    id: 'pagoda', plan: 'glass-pagoda', origin: O_PAGODA,
    prompt: '@Claude build a Japanese pagoda',
    duration: 9, radius: 28, height: 14,
    fadeOut: 0.6,
  }),
  // Outro: Steve on a monumental throne atop a tall stone plinth, towering
  // above every sculpture. Camera dollies from eye-level on Steve up into a
  // sweeping aerial that pulls back through the entire grid.
  {
    id: 'outro',
    duration: 13,
    fadeIn: 0.8, fadeOut: 1.6,
    camera: {
      type: 'dolly',
      from: [130, 54, 80],     // eye-level with Steve atop his plinth
      to:   [130, 210, 255],   // way south + very high — full aerial
      lookFrom: [130, 52, 50], // Steve's face
      lookTo:   [130, 35, 160],// centre of all builds
    },
    title: { html: 'CraftPlan', t0: 6.0, t1: 11.5, fadeIn: 0.6, fadeOut: 0.8 },
    events: (() => {
      // Massive throne at (TX, _, TZ) north of Row A. Plinth 11x11x30 raises
      // the seat to ~y=51 — above every sculpture top.
      const TX = 130, TY = 19, TZ = 50;
      const ops = [];
      const BRICK = 10, OAK = 4, GLASS = 11, STONE = 3, COBBLE = 8;
      // Plinth: 11x11 footprint, 30 high (y=TY..TY+29).
      for (let dy = 0; dy < 30; dy++)
        for (let dx = -5; dx <= 5; dx++)
          for (let dz = -5; dz <= 5; dz++)
            ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ + dz, block: STONE });
      // Cobble crown around the top of the plinth (frame)
      for (let dx = -5; dx <= 5; dx++) for (let dz = -5; dz <= 5; dz++) {
        if (dx === -5 || dx === 5 || dz === -5 || dz === 5)
          ops.push({ t: 0.05, x: TX + dx, y: TY + 30, z: TZ + dz, block: COBBLE });
      }
      // Brick throne base on the plinth (7x5 at y=TY+30)
      for (let dx = -3; dx <= 3; dx++)
        for (let dz = -2; dz <= 2; dz++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + 31, z: TZ + dz, block: BRICK });
      // Brick seat (3 wide x 2 deep) above the base
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 0; dz++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + 32, z: TZ + dz, block: BRICK });
      // Towering brick back wall (11 wide x 22 high) at the north edge
      for (let dx = -5; dx <= 5; dx++)
        for (let dy = 32; dy <= 53; dy++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ - 3, block: BRICK });
      // Higher centre of the back wall (3 wide x 5 extra high)
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = 54; dy <= 58; dy++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ - 3, block: BRICK });
      // Oak armrests
      for (let dy = 32; dy <= 33; dy++) {
        ops.push({ t: 0.05, x: TX - 2, y: TY + dy, z: TZ - 1, block: OAK });
        ops.push({ t: 0.05, x: TX + 2, y: TY + dy, z: TZ - 1, block: OAK });
      }
      // Glass spires along the top edges of the back wall
      for (let dx of [-5, -3, 3, 5]) {
        for (let dy = 54; dy <= 57; dy++) ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ - 3, block: GLASS });
      }
      // Centre crown spire above the back wall (3 tall extra)
      for (let dy = 59; dy <= 62; dy++) ops.push({ t: 0.05, x: TX, y: TY + dy, z: TZ - 3, block: GLASS });
      // Decorative bands of cobble down the front of the plinth (so the
      // structure isn't just a solid block when viewed close)
      for (let dy = 5; dy <= 25; dy += 5) {
        for (let dx = -5; dx <= 5; dx++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ + 5, block: COBBLE });
      }
      return ops;
    })(),
    avatars: {
      // Steve sits on top of the plinth facing south toward the sculptures.
      Steve:  { pos: [130, 51, 50], look: [130, 51, 200], expression: 'happy', showTag: false, still: true },
      // Background bots scattered around the grid as tiny working figures.
      Bot_NW: { pos: [70,  21, 135], look: [40, 21, 105], expression: 'focused', showTag: false },
      Bot_NE: { pos: [250, 21, 135], look: [220, 21, 105], expression: 'focused', showTag: false },
      Bot_SW: { pos: [70,  21, 200], look: [40, 21, 235], expression: 'focused', showTag: false },
      Bot_SE: { pos: [250, 21, 200], look: [220, 21, 235], expression: 'focused', showTag: false },
    },
  },
];

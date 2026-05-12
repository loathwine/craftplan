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
  // Clear the throne site north of Row A.
  { type: 'clearAboveGround', min: [110, 30], max: [150, 80], topY: 40 },
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
  // Outro: Steve on an epic throne in the north, looking south over all the
  // sculptures. Camera dollies from a close two-shot up and back to a wide
  // aerial that reveals the throne foregrounded against the entire grid.
  {
    id: 'outro',
    duration: 12,
    fadeIn: 0.8, fadeOut: 1.4,
    camera: {
      type: 'dolly',
      from: [130, 23, 65],     // south of throne, eye-level, close
      to:   [130, 150, 250],   // way south, high — full aerial with throne in distance
      lookFrom: [130, 22, 50], // throne head
      lookTo:   [130, 35, 150],// centre of all builds
    },
    title: { html: 'CraftPlan', t0: 5.5, t1: 10.5, fadeIn: 0.6, fadeOut: 0.8 },
    events: (() => {
      // Throne placed at (TX, _, TZ) north of Row A, facing +Z (south).
      const TX = 130, TY = 19, TZ = 50;
      const ops = [];
      const BRICK = 10, OAK = 4, GLASS = 11, STONE = 3;
      // 7x5 stone base (2 high) — wide regal platform
      for (let dy = 0; dy < 2; dy++)
        for (let dx = -3; dx <= 3; dx++)
          for (let dz = -2; dz <= 2; dz++)
            ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ + dz, block: STONE });
      // Brick seat (3 wide, 2 deep) on top of platform near the back
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 0; dz++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + 2, z: TZ + dz, block: BRICK });
      // Tall brick back wall (7 wide x 4 high) at the north edge (z = TZ-2)
      for (let dx = -3; dx <= 3; dx++)
        for (let dy = 2; dy <= 5; dy++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ - 2, block: BRICK });
      // Higher back wall in the centre (3 wide x 2 extra high)
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = 6; dy <= 7; dy++)
          ops.push({ t: 0.05, x: TX + dx, y: TY + dy, z: TZ - 2, block: BRICK });
      // Oak armrests on both sides of the seat
      for (let dy = 2; dy <= 3; dy++) {
        ops.push({ t: 0.05, x: TX - 2, y: TY + dy, z: TZ - 1, block: OAK });
        ops.push({ t: 0.05, x: TX + 2, y: TY + dy, z: TZ - 1, block: OAK });
      }
      // Glass spires on the corners + centre of the back wall
      for (let dy = 6; dy <= 8; dy++) {
        ops.push({ t: 0.05, x: TX - 3, y: TY + dy, z: TZ - 2, block: GLASS });
        ops.push({ t: 0.05, x: TX + 3, y: TY + dy, z: TZ - 2, block: GLASS });
      }
      ops.push({ t: 0.05, x: TX, y: TY + 8, z: TZ - 2, block: GLASS });
      ops.push({ t: 0.05, x: TX, y: TY + 9, z: TZ - 2, block: GLASS });
      // Brick "stairs" leading up from the south
      for (let dx = -2; dx <= 2; dx++) {
        ops.push({ t: 0.05, x: TX + dx, y: TY,     z: TZ + 3, block: BRICK });
        ops.push({ t: 0.05, x: TX + dx, y: TY + 1, z: TZ + 3, block: BRICK });
        ops.push({ t: 0.05, x: TX + dx, y: TY,     z: TZ + 4, block: BRICK });
      }
      return ops;
    })(),
    avatars: {
      // Steve sits enthroned facing south toward the sculptures (and camera).
      Steve:  { pos: [130, 21, 49], look: [130, 21, 200], expression: 'happy', showTag: false, still: true },
      // Background bots tucked between rows so they read at the wide angle.
      Bot_NW: { pos: [70,  21, 135], look: [40, 21, 105], expression: 'focused', showTag: false },
      Bot_NE: { pos: [250, 21, 135], look: [220, 21, 105], expression: 'focused', showTag: false },
      Bot_SW: { pos: [70,  21, 200], look: [40, 21, 235], expression: 'focused', showTag: false },
      Bot_SE: { pos: [250, 21, 200], look: [220, 21, 235], expression: 'focused', showTag: false },
    },
  },
];

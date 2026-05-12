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
// Kurama plan extends z=±22 from origin. At z=235 (default row C) the
// face clipped past the world's z=255 edge. Move this fox alone north
// to z=215 so the entire build stays inside the world.
const O_KURAMA    = [100, 19, 215];
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
  // Throne + two flanking knight statues sit north of Row A.
  { type: 'clearAboveGround', min: [95, 30], max: [165, 75], topY: 95 },
];

// -- Outro side-builds: helpers that emit timed block events -----------------
// Each helper places blocks linearly across [startT, startT+duration] so the
// matching bot reads as "actively building" during the pull-back.

function spiralStaircase(cx, cy, cz, { startT, duration = 9, height = 25, radius = 4 } = {}) {
  const STONE = 3, COBBLE = 8;
  const ops = [];
  for (let i = 0; i < height; i++) ops.push({ x: cx, y: cy + i, z: cz, block: COBBLE });
  for (let i = 0; i < height; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = cx + Math.round(radius * Math.cos(a));
    const z = cz + Math.round(radius * Math.sin(a));
    ops.push({ x, y: cy + i, z, block: STONE });
  }
  const N = ops.length;
  return ops.map((op, i) => ({ ...op, t: startT + (i / N) * duration }));
}

function bigTreeWithVines(cx, cy, cz, { startT, duration = 9, trunkH = 12, canopyR = 5, vineDrop = 6 } = {}) {
  const OAK = 4, LEAVES = 5;
  const ops = [];
  for (let i = 0; i < trunkH; i++) ops.push({ x: cx, y: cy + i, z: cz, block: OAK });
  for (let dx = -canopyR; dx <= canopyR; dx++) {
    for (let dy = -1; dy <= canopyR; dy++) {
      for (let dz = -canopyR; dz <= canopyR; dz++) {
        const d = Math.sqrt(dx*dx + dy*dy*1.4 + dz*dz);
        if (d > canopyR + 0.5 || d < canopyR - 1.5) continue;
        if (dx === 0 && dy < 0 && dz === 0) continue;
        ops.push({ x: cx + dx, y: cy + trunkH + dy, z: cz + dz, block: LEAVES });
      }
    }
  }
  for (let i = 0; i < vineDrop; i++) {
    for (const [vx, vz] of [[-canopyR + 1, 0], [canopyR - 1, 0], [0, -canopyR + 1], [0, canopyR - 1]]) {
      ops.push({ x: cx + vx, y: cy + trunkH - 1 - i, z: cz + vz, block: LEAVES });
    }
  }
  const N = ops.length;
  return ops.map((op, i) => ({ ...op, t: startT + (i / N) * duration }));
}

function sauronEye(cx, cy, cz, { startT, duration = 9, towerH = 22 } = {}) {
  const BRICK = 10, COBBLE = 8, STONE = 3;
  const ops = [];
  // Cobble tower base (3x3, towerH tall)
  for (let dy = 0; dy < towerH; dy++)
    for (let dx = -1; dx <= 1; dx++)
      for (let dz = -1; dz <= 1; dz++)
        ops.push({ x: cx + dx, y: cy + dy, z: cz + dz, block: COBBLE });
  // Eye in the horizontal plane at top of tower — "looking up"
  const eyeY = cy + towerH;
  // Iris (brick fill, ellipse roughly 9x5)
  for (let dx = -4; dx <= 4; dx++)
    for (let dz = -2; dz <= 2; dz++) {
      const d = (dx*dx) / 16 + (dz*dz) / 4;
      if (d <= 0.95) ops.push({ x: cx + dx, y: eyeY, z: cz + dz, block: BRICK });
    }
  // Outer ring (cobble)
  for (let dx = -5; dx <= 5; dx++)
    for (let dz = -3; dz <= 3; dz++) {
      const d = (dx*dx) / 25 + (dz*dz) / 9;
      if (d > 0.72 && d <= 1.05) ops.push({ x: cx + dx, y: eyeY, z: cz + dz, block: COBBLE });
    }
  // Vertical pupil (stone slit)
  for (let dz = -2; dz <= 2; dz++) ops.push({ x: cx, y: eyeY, z: cz + dz, block: STONE });
  // A bit raised pupil center
  ops.push({ x: cx, y: eyeY + 1, z: cz, block: STONE });
  const N = ops.length;
  return ops.map((op, i) => ({ ...op, t: startT + (i / N) * duration }));
}

// Place a cached plan as throwaway outro events at t (instant placement).
function placeCachedSync(plan, origin, t = 0.05, rotateY = 0) {
  const rotN = Math.round(rotateY / (Math.PI / 2)) & 3;
  const rot = ([x, z]) => {
    switch (rotN) {
      case 1: return [-z, x];
      case 2: return [-x, -z];
      case 3: return [z, -x];
      default: return [x, z];
    }
  };
  return plan.map(b => {
    const [rx, rz] = rot([b.x, b.z]);
    return { t, x: origin[0] + rx, y: origin[1] + b.y, z: origin[2] + rz, block: b.block };
  });
}

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
    duration: 10, radius: 30, height: 14,
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
  // Outro: extreme close-up on Steve's happy face, two giant knight statues
  // flank the throne, three bots actively build new wonders during the
  // pull-back. Camera dollies from his face all the way up to a wide aerial.
  {
    id: 'outro',
    duration: 14,
    fadeIn: 0.8, fadeOut: 1.6,
    camera: {
      type: 'dolly',
      from: [130, 52, 51.6],   // EXTREME close-up on Steve's face
      to:   [130, 210, 255],   // far south + very high — full aerial
      lookFrom: [130, 52, 50], // Steve's eyes
      lookTo:   [130, 35, 160],// centre of all builds
    },
    title: { html: 'CraftPlan', t0: 7.0, t1: 12.5, fadeIn: 0.6, fadeOut: 0.8 },
    // Knight statues flanking the throne, placed instantly at outro start.
    placements: [
      { slug: 'knight-statue', origin: [108, 19, 50] }, // left knight (west)
      { slug: 'knight-statue', origin: [152, 19, 50] }, // right knight (east)
    ],
    events: (() => {
      // Throne + bot-built side structures.
      const TX = 130, TY = 19, TZ = 50;
      let ops = [];
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
      // Active background bot builds during the pull-back — three wonders
      // grow in the distance: a tree with vines, a spiral staircase, the
      // Eye of Sauron looking up from atop a cobble tower.
      ops = ops.concat(bigTreeWithVines(70, 19, 135, { startT: 0.5, duration: 9 }));
      ops = ops.concat(spiralStaircase(250, 19, 135, { startT: 0.5, duration: 9, height: 22, radius: 4 }));
      ops = ops.concat(sauronEye(70, 19, 200, { startT: 0.5, duration: 9, towerH: 22 }));
      return ops;
    })(),
    avatars: {
      // Steve sits on top of the plinth facing south toward the sculptures.
      Steve:  { pos: [130, 51, 50], look: [130, 51, 200], expression: 'happy', showTag: false, still: true },
      // Three bots stand at their construction sites, building actively.
      // Position is offset south of the build so the bot is in front of it
      // from the camera's perspective.
      Bot_NW: { pos: [70,  20, 142], look: [70, 25, 135], expression: 'focused', showTag: false }, // tree builder
      Bot_NE: { pos: [250, 20, 142], look: [250, 25, 135], expression: 'focused', showTag: false }, // spiral builder
      Bot_SW: { pos: [70,  20, 210], look: [70, 30, 200], expression: 'focused', showTag: false }, // Sauron eye builder
      // Fourth bot mid-grid as an extra "everywhere there are bots" cue.
      Bot_SE: { pos: [250, 20, 210], look: [220, 21, 235], expression: 'focused', showTag: false },
    },
  },
];

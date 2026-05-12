// Intro skit: comedic vignette where the human player fails to build a house,
// looks at Claude, asks for help, and Claude effortlessly builds a great one.

const SKIT_X = 60, SKIT_Y = 19, SKIT_Z = 60;
const PLAYER_POS = [SKIT_X - 3, SKIT_Y, SKIT_Z];
const CLAUDE_POS = [SKIT_X + 5, SKIT_Y, SKIT_Z];
const UGLY_AT    = [SKIT_X, SKIT_Y, SKIT_Z];
const NICE_AT    = [SKIT_X + 1, SKIT_Y, SKIT_Z + 8];

export const SKIT_AVATARS = {
  Steve: {
    bodyColor: 0x3b82f6,
    headColor: 0xf5d8b5,
    expression: 'neutral',
    hat: { shape: 'box', color: 0xf59e0b },
  },
  Claude: {
    bodyColor: 0x10b981,
    headColor: 0xffcc88,
    expression: 'neutral',
    hat: { shape: 'cone', color: 0x6b46c1 },
  },
};

export const SKIT_SETUP = [
  { type: 'clearAboveGround', min: [SKIT_X - 18, SKIT_Z - 12], max: [SKIT_X + 18, SKIT_Z + 20], topY: 35 },
];

// Hand-authored "failed house attempt" — recognisable but clearly bad:
// four corner pillars planted out of square, two partial walls, one floating
// roof slab, a glass window with no wall around it, a brick where stone
// should be.
const uglyEvents = (delay = 0) => {
  const [ox, oy, oz] = UGLY_AT;
  return [
    // four corner pillars (would-be foundations) — but two are off-grid
    { t: delay + 0.2,  x: ox,     y: oy,     z: oz,     block: 7 },
    { t: delay + 0.5,  x: ox + 3, y: oy,     z: oz,     block: 7 },
    { t: delay + 0.8,  x: ox + 0, y: oy,     z: oz + 3, block: 7 },
    { t: delay + 1.1,  x: ox + 4, y: oy,     z: oz + 3, block: 7 },   // one block off in x — out of square
    // raise the pillars (mostly)
    { t: delay + 1.4,  x: ox,     y: oy + 1, z: oz,     block: 7 },
    { t: delay + 1.7,  x: ox + 3, y: oy + 1, z: oz,     block: 7 },
    { t: delay + 2.0,  x: ox + 0, y: oy + 1, z: oz + 3, block: 7 },
    // forgot the fourth pillar second tier
    // partial wall between front-left and front-right pillars
    { t: delay + 2.3,  x: ox + 1, y: oy,     z: oz,     block: 7 },
    { t: delay + 2.6,  x: ox + 2, y: oy,     z: oz,     block: 3 },   // wrong material — stone in the middle
    // floating block above
    { t: delay + 2.9,  x: ox + 2, y: oy + 3, z: oz + 2, block: 10 },
    // a glass window placed where there's no wall
    { t: delay + 3.2,  x: ox + 1, y: oy + 2, z: oz + 1, block: 11 },
    // tries to add a roof piece, lands offset
    { t: delay + 3.6,  x: ox - 1, y: oy + 2, z: oz + 1, block: 10 },
    // gives up and just adds a leaf block on top of one pillar
    { t: delay + 4.0,  x: ox,     y: oy + 2, z: oz,     block: 5 },
  ];
};

// Claude's nice cottage — placed densely.
const niceEvents = (delay = 0, duration = 3.0) => {
  const ops = [];
  const [ox, oy, oz] = NICE_AT;
  const STONE = 3, PLANKS = 7, OAK = 4, BRICK = 10, GLASS = 11;
  for (let dx = 0; dx < 5; dx++) for (let dz = 0; dz < 5; dz++) ops.push({ x: ox + dx, y: oy, z: oz + dz, block: STONE });
  for (let dy = 1; dy <= 3; dy++) {
    for (let i = 0; i < 5; i++) {
      ops.push({ x: ox + i, y: oy + dy, z: oz + 0, block: PLANKS });
      ops.push({ x: ox + i, y: oy + dy, z: oz + 4, block: PLANKS });
      ops.push({ x: ox + 0, y: oy + dy, z: oz + i, block: PLANKS });
      ops.push({ x: ox + 4, y: oy + dy, z: oz + i, block: PLANKS });
    }
  }
  ops.push({ x: ox + 2, y: oy + 2, z: oz + 0, block: GLASS });
  ops.push({ x: ox + 2, y: oy + 2, z: oz + 4, block: GLASS });
  ops.push({ x: ox + 0, y: oy + 2, z: oz + 2, block: GLASS });
  ops.push({ x: ox + 2, y: oy + 1, z: oz + 4, block: 0 });
  ops.push({ x: ox + 2, y: oy + 2, z: oz + 4, block: 0 });
  for (let dx = -1; dx <= 5; dx++) for (let dz = -1; dz <= 5; dz++) ops.push({ x: ox + dx, y: oy + 4, z: oz + dz, block: BRICK });
  for (let dx = 0; dx <= 4; dx++) for (let dz = 1; dz <= 3; dz++) ops.push({ x: ox + dx, y: oy + 5, z: oz + dz, block: BRICK });
  for (let dx = 1; dx <= 3; dx++) ops.push({ x: ox + dx, y: oy + 6, z: oz + 2, block: BRICK });
  ops.push({ x: ox + 4, y: oy + 5, z: oz + 0, block: STONE });
  ops.push({ x: ox + 4, y: oy + 6, z: oz + 0, block: STONE });
  ops.push({ x: ox + 1, y: oy + 1, z: oz + 4, block: OAK });
  ops.push({ x: ox + 3, y: oy + 1, z: oz + 4, block: OAK });
  ops.push({ x: ox + 1, y: oy + 2, z: oz + 4, block: OAK });
  ops.push({ x: ox + 3, y: oy + 2, z: oz + 4, block: OAK });
  ops.push({ x: ox + 1, y: oy + 3, z: oz + 4, block: OAK });
  ops.push({ x: ox + 2, y: oy + 3, z: oz + 4, block: OAK });
  ops.push({ x: ox + 3, y: oy + 3, z: oz + 4, block: OAK });
  const N = ops.length;
  return ops.map((op, i) => ({ ...op, t: delay + (i / N) * duration }));
};

const lookAtPlayer = [PLAYER_POS[0], PLAYER_POS[1] + 1.5, PLAYER_POS[2]];
const lookAtClaude = [CLAUDE_POS[0], CLAUDE_POS[1] + 1.5, CLAUDE_POS[2]];
const lookAtUgly   = [UGLY_AT[0] + 1, UGLY_AT[1] + 1, UGLY_AT[2] + 1];
const lookAtNice   = [NICE_AT[0] + 2, NICE_AT[1] + 2, NICE_AT[2] + 2];

export const SKIT_SHOTS = [
  // 1. Wide establishing two-shot: both characters in frame
  {
    id: 'skit-establish',
    duration: 3.0,
    fadeIn: 0.6,
    camera: { type: 'dolly',
      from: [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 7, PLAYER_POS[2] + 14],
      to:   [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 3.5, PLAYER_POS[2] + 8],
      lookFrom: [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 1.5, PLAYER_POS[2]],
      lookTo:   [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 1.5, PLAYER_POS[2]] },
    overlay: { html: 'A long time ago in a voxel world…', t0: 0.4, t1: 2.6, fadeIn: 0.4, fadeOut: 0.6 },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'sad' },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'happy' },
    },
  },
  // 2. Claude waves: "Hi!" (happy)
  {
    id: 'skit-hi-claude',
    duration: 1.8,
    camera: { type: 'still',
      pos: [CLAUDE_POS[0] + 0.3, CLAUDE_POS[1] + 2.0, CLAUDE_POS[2] + 2.3],
      look: [CLAUDE_POS[0], CLAUDE_POS[1] + 1.6, CLAUDE_POS[2]] },
    dialog: { speaker: 'Claude', text: 'Hi!', t0: 0.2, t1: 1.6, fadeIn: 0.2, fadeOut: 0.3 },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'sad' },
      Claude: { pos: CLAUDE_POS, lookAtCamera: true, expression: 'happy' },
    },
  },
  // 3. Steve mutters: "...hey." (sad)
  {
    id: 'skit-hi-steve',
    duration: 2.0,
    camera: { type: 'still',
      pos: [PLAYER_POS[0] - 0.5, PLAYER_POS[1] + 2.0, PLAYER_POS[2] + 2.3],
      look: [PLAYER_POS[0], PLAYER_POS[1] + 1.6, PLAYER_POS[2]] },
    dialog: { speaker: 'Steve', text: '…hey.', t0: 0.3, t1: 1.8, fadeIn: 0.2, fadeOut: 0.3 },
    avatars: {
      Steve:  { pos: PLAYER_POS, lookAtCamera: true, expression: 'sad' },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral' },
    },
  },
  // 4. Steve turns to his half-built mess — orbits and places more bad blocks
  {
    id: 'skit-building',
    duration: 5.0,
    camera: { type: 'orbit',
      center: [SKIT_X + 0.5, SKIT_Y + 1.5, SKIT_Z + 0.5], radius: 6.5, height: 3,
      startAngle: 1.2, endAngle: 2.3 },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtUgly, expression: 'focused', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
    events: uglyEvents(0.3),
  },
  // 5. Despair close-up — face the camera, sad
  {
    id: 'skit-despair',
    duration: 2.0,
    camera: { type: 'still',
      pos: [PLAYER_POS[0] - 1.0, PLAYER_POS[1] + 1.9, PLAYER_POS[2] + 1.3],
      look: [PLAYER_POS[0], PLAYER_POS[1] + 1.7, PLAYER_POS[2]] },
    avatars: {
      Steve:  { pos: PLAYER_POS, lookAtCamera: true, expression: 'sad', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
  },
  // 6. Steve turns and looks hopefully at Claude
  {
    id: 'skit-look-at-claude',
    duration: 2.4,
    camera: { type: 'dolly',
      from: [PLAYER_POS[0] - 2.5, PLAYER_POS[1] + 2.4, PLAYER_POS[2] - 1.0],
      to:   [PLAYER_POS[0] - 0.8, PLAYER_POS[1] + 2.4, PLAYER_POS[2] - 1.2],
      lookFrom: lookAtClaude, lookTo: lookAtClaude },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'thinking', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
  },
  // 7. Two-shot silence: both characters in frame, both still
  {
    id: 'skit-silence',
    duration: 2.0,
    camera: { type: 'still',
      pos: [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 2.4, PLAYER_POS[2] + 7],
      look: [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 1.5, PLAYER_POS[2]] },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'thinking', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
  },
  // 8. Steve asks
  {
    id: 'skit-ask',
    duration: 3.2,
    camera: { type: 'still',
      pos: [PLAYER_POS[0] - 0.5, PLAYER_POS[1] + 2.0, PLAYER_POS[2] + 2.5],
      look: [PLAYER_POS[0], PLAYER_POS[1] + 1.6, PLAYER_POS[2]] },
    dialog: { speaker: 'Steve', text: 'Could you… could you build a house for me?', t0: 0.3, t1: 3.0, fadeIn: 0.3, fadeOut: 0.4 },
    avatars: {
      Steve:  { pos: PLAYER_POS, lookAtCamera: true, expression: 'thinking', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
  },
  // 9. Pause: Claude's face, slow transition to a smirk
  {
    id: 'skit-pause',
    duration: 1.8,
    camera: { type: 'still',
      pos: [CLAUDE_POS[0] + 0.6, CLAUDE_POS[1] + 2.2, CLAUDE_POS[2] + 2.4],
      look: [CLAUDE_POS[0], CLAUDE_POS[1] + 1.6, CLAUDE_POS[2]] },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'thinking', showTag: false },
      Claude: { pos: CLAUDE_POS, lookAtCamera: true, expression: 'neutral', showTag: false,
                expressionAt: [{ t: 0.0, expression: 'neutral' }, { t: 1.0, expression: 'smug' }] },
    },
  },
  // 10. Claude agrees
  {
    id: 'skit-agree',
    duration: 1.8,
    camera: { type: 'still',
      pos: [CLAUDE_POS[0] + 0.6, CLAUDE_POS[1] + 2.2, CLAUDE_POS[2] + 2.4],
      look: [CLAUDE_POS[0], CLAUDE_POS[1] + 1.6, CLAUDE_POS[2]] },
    dialog: { speaker: 'Claude', text: '…of course.', t0: 0.2, t1: 1.6, fadeIn: 0.2, fadeOut: 0.3 },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'surprised', showTag: false },
      Claude: { pos: CLAUDE_POS, lookAtCamera: true, expression: 'happy', showTag: false },
    },
  },
  // 11. Claude builds the nice cottage — orbit around it
  {
    id: 'skit-build-nice',
    duration: 3.8,
    camera: { type: 'orbit',
      center: [NICE_AT[0] + 2, NICE_AT[1] + 3, NICE_AT[2] + 2], radius: 10, height: 5,
      startAngle: 0.6, endAngle: 2.6 },
    avatars: {
      Steve:  { pos: PLAYER_POS, look: lookAtNice, expression: 'surprised', showTag: false },
      Claude: { pos: [NICE_AT[0] - 4, NICE_AT[1], NICE_AT[2] + 1], look: lookAtNice, expression: 'focused', showTag: false },
    },
    events: niceEvents(0.2, 3.2),
  },
  // 12. Steve's amazed close-up — fades to WHITE for the music drop
  {
    id: 'skit-amazed',
    duration: 2.0,
    fadeOut: 0.4, fadeOutColor: '#fff',
    camera: { type: 'still',
      pos: [PLAYER_POS[0] - 0.6, PLAYER_POS[1] + 1.9, PLAYER_POS[2] + 1.0],
      look: [PLAYER_POS[0], PLAYER_POS[1] + 1.7, PLAYER_POS[2]] },
    avatars: {
      Steve: { pos: PLAYER_POS, lookAtCamera: true, expression: 'happy', showTag: false },
    },
  },
];

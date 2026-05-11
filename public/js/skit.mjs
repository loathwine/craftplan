// Intro skit: comedic vignette where the human player fails to build a house,
// looks at Claude, asks for help, and Claude effortlessly builds a great one.

const SKIT_X = 60, SKIT_Y = 19, SKIT_Z = 60; // skit playground center
const PLAYER_POS = [SKIT_X - 3, SKIT_Y, SKIT_Z];
const CLAUDE_POS = [SKIT_X + 5, SKIT_Y, SKIT_Z];
const UGLY_AT    = [SKIT_X, SKIT_Y, SKIT_Z];
const NICE_AT    = [SKIT_X + 1, SKIT_Y, SKIT_Z + 8];

export const SKIT_AVATARS = {
  Edvin: {
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

// Hand-authored "ugly house" placements: misaligned, mismatched, floaters.
const uglyEvents = (delay = 0) => [
  { t: delay + 0.3, x: UGLY_AT[0] + 0, y: UGLY_AT[1], z: UGLY_AT[2] + 0, block: 7 },
  { t: delay + 0.8, x: UGLY_AT[0] + 1, y: UGLY_AT[1], z: UGLY_AT[2] + 0, block: 7 },
  { t: delay + 1.3, x: UGLY_AT[0] + 0, y: UGLY_AT[1], z: UGLY_AT[2] + 1, block: 7 },
  { t: delay + 1.8, x: UGLY_AT[0] + 2, y: UGLY_AT[1], z: UGLY_AT[2] + 1, block: 3 },
  { t: delay + 2.3, x: UGLY_AT[0] + 0, y: UGLY_AT[1] + 1, z: UGLY_AT[2] + 0, block: 3 },
  { t: delay + 2.8, x: UGLY_AT[0] + 0, y: UGLY_AT[1] + 1, z: UGLY_AT[2] + 1, block: 7 },
  { t: delay + 3.3, x: UGLY_AT[0] + 2, y: UGLY_AT[1] + 2, z: UGLY_AT[2] + 0, block: 10 },
  { t: delay + 3.8, x: UGLY_AT[0] - 1, y: UGLY_AT[1] + 1, z: UGLY_AT[2] + 2, block: 11 },
  { t: delay + 4.3, x: UGLY_AT[0] + 1, y: UGLY_AT[1] + 3, z: UGLY_AT[2] + 1, block: 5 },
];

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
  // 1. Establishing wide
  {
    id: 'skit-establish',
    duration: 3.5,
    fade: 0.5,
    camera: { type: 'dolly',
      from: [SKIT_X - 14, SKIT_Y + 10, SKIT_Z + 16],
      to:   [SKIT_X - 8,  SKIT_Y + 7,  SKIT_Z + 10],
      lookFrom: lookAtPlayer, lookTo: lookAtPlayer },
    title: { html: 'A long time ago in a voxel world…', t0: 0.4, t1: 3.0, fadeIn: 0.4, fadeOut: 0.6 },
    avatars: {
      Edvin: { pos: PLAYER_POS, look: [PLAYER_POS[0] + 1, PLAYER_POS[1] + 1, PLAYER_POS[2]], expression: 'neutral', showTag: false },
    },
  },
  // 2. Player builds awkwardly (orbiting medium shot)
  {
    id: 'skit-building',
    duration: 5.5,
    camera: { type: 'orbit',
      center: [SKIT_X + 0.5, SKIT_Y + 1.5, SKIT_Z + 0.5], radius: 6.5, height: 3,
      startAngle: 1.2, endAngle: 2.3 },
    avatars: {
      Edvin: { pos: PLAYER_POS, look: lookAtUgly, expression: 'focused', showTag: false },
    },
    events: uglyEvents(0.3),
  },
  // 3. Ugly result + dejected player — orbit so we see all sides of the mess
  {
    id: 'skit-result',
    duration: 3.5,
    camera: { type: 'orbit',
      center: [UGLY_AT[0] + 0.5, UGLY_AT[1] + 1.5, UGLY_AT[2] + 0.5], radius: 7, height: 4,
      startAngle: 2.0, endAngle: 4.2 },
    avatars: {
      Edvin: { pos: PLAYER_POS, look: lookAtUgly, expression: 'sad', showTag: false },
    },
  },
  // 4. Despair close-up — face the camera
  {
    id: 'skit-despair',
    duration: 2.0,
    camera: { type: 'still', pos: [PLAYER_POS[0] - 1.0, PLAYER_POS[1] + 1.9, PLAYER_POS[2] + 1.3], look: [PLAYER_POS[0], PLAYER_POS[1] + 1.7, PLAYER_POS[2]] },
    avatars: {
      Edvin: { pos: PLAYER_POS, lookAtCamera: true, expression: 'sad', showTag: false },
    },
  },
  // 5. Player notices Claude — slow pan, Edvin's gaze turns
  {
    id: 'skit-notice',
    duration: 2.6,
    camera: { type: 'dolly',
      from: [PLAYER_POS[0] - 2.5, PLAYER_POS[1] + 2.4, PLAYER_POS[2] - 1.0],
      to:   [PLAYER_POS[0] - 0.8, PLAYER_POS[1] + 2.4, PLAYER_POS[2] - 1.2],
      lookFrom: lookAtClaude, lookTo: lookAtClaude },
    avatars: {
      Edvin:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'surprised', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
  },
  // 6. Two-shot from the south (profiles facing each other)
  {
    id: 'skit-silence',
    duration: 2.3,
    camera: { type: 'still', pos: [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 2.4, PLAYER_POS[2] + 7], look: [(PLAYER_POS[0] + CLAUDE_POS[0]) / 2, PLAYER_POS[1] + 1.5, PLAYER_POS[2]] },
    avatars: {
      Edvin:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'thinking', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
  },
  // 7. Player asking — straight-on medium shot of Edvin facing camera
  {
    id: 'skit-ask',
    duration: 3.2,
    camera: { type: 'still',
      pos: [PLAYER_POS[0] - 0.5, PLAYER_POS[1] + 2.0, PLAYER_POS[2] + 2.5],
      look: [PLAYER_POS[0], PLAYER_POS[1] + 1.6, PLAYER_POS[2]] },
    dialog: { speaker: 'Edvin', text: 'Could you… could you build a house for me?', t0: 0.3, t1: 3.0, fadeIn: 0.3, fadeOut: 0.4 },
    avatars: {
      Edvin:  { pos: PLAYER_POS, lookAtCamera: true, expression: 'thinking', showTag: false },
      Claude: { pos: CLAUDE_POS, look: lookAtPlayer, expression: 'neutral', showTag: false },
    },
  },
  // 8. Pause: Claude's face, slow transition to a smirk (camera pulled back
  //          so the head isn't filling the frame)
  {
    id: 'skit-pause',
    duration: 1.8,
    camera: { type: 'still',
      pos: [CLAUDE_POS[0] + 0.6, CLAUDE_POS[1] + 2.2, CLAUDE_POS[2] + 2.4],
      look: [CLAUDE_POS[0], CLAUDE_POS[1] + 1.6, CLAUDE_POS[2]] },
    avatars: {
      Edvin:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'thinking', showTag: false },
      Claude: { pos: CLAUDE_POS, lookAtCamera: true, expression: 'neutral',
                expressionAt: [{ t: 0.0, expression: 'neutral' }, { t: 1.0, expression: 'smug' }],
                showTag: false },
    },
  },
  // 9. Agreement
  {
    id: 'skit-agree',
    duration: 1.8,
    camera: { type: 'still',
      pos: [CLAUDE_POS[0] + 0.6, CLAUDE_POS[1] + 2.2, CLAUDE_POS[2] + 2.4],
      look: [CLAUDE_POS[0], CLAUDE_POS[1] + 1.6, CLAUDE_POS[2]] },
    dialog: { speaker: 'Claude', text: '…of course.', t0: 0.2, t1: 1.6, fadeIn: 0.2, fadeOut: 0.3 },
    avatars: {
      Edvin:  { pos: PLAYER_POS, look: lookAtClaude, expression: 'surprised', showTag: false },
      Claude: { pos: CLAUDE_POS, lookAtCamera: true, expression: 'happy', showTag: false },
    },
  },
  // 10. Claude builds rapidly — orbit around the new cottage
  {
    id: 'skit-build-nice',
    duration: 3.5,
    camera: { type: 'orbit',
      center: [NICE_AT[0] + 2, NICE_AT[1] + 3, NICE_AT[2] + 2], radius: 10, height: 5,
      startAngle: 0.6, endAngle: 2.6 },
    avatars: {
      Edvin:  { pos: PLAYER_POS, look: lookAtNice, expression: 'surprised', showTag: false },
      Claude: { pos: [NICE_AT[0] - 4, NICE_AT[1], NICE_AT[2] + 1], look: lookAtNice, expression: 'focused', showTag: false },
    },
    events: niceEvents(0.2, 3.0),
  },
  // 11. Player face: amazement — close-up that fades to black for the drop
  {
    id: 'skit-amazed',
    duration: 2.0,
    fadeOut: 0.8,
    camera: { type: 'still', pos: [PLAYER_POS[0] - 0.6, PLAYER_POS[1] + 1.9, PLAYER_POS[2] + 1.0], look: [PLAYER_POS[0], PLAYER_POS[1] + 1.7, PLAYER_POS[2]] },
    avatars: {
      Edvin: { pos: PLAYER_POS, lookAtCamera: true, expression: 'happy', showTag: false },
    },
  },
];

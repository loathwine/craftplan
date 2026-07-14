// cthulhu-4x-fable — prompt:
// Cthulhu...

// Cthulhu — crouched on a stone mound, octopus head facing NORTH (-Z),
// face tentacles hanging, membranous wings spread high behind.

// ---- clear the build footprint (trees/stumps) ----
cube(-16, 0, -9, 16, 32, 14, AIR);
cube(-22, 12, 6, 22, 33, 13, AIR);

// ---- R'lyeh mound base ----
disk(0, 0, 6, 9, COBBLE);
disk(0, 1, 6, 8, STONE);
disk(0, 2, 6, 7, COBBLE);
disk(0, 3, 6, 6, STONE);
disk(0, 4, 6, 5, COBBLE);
disk(0, 5, 7, 4, STONE);
// slime patches on the mound
block(-5, 1, 0, LEAVES); block(-6, 1, 1, LEAVES); block(4, 1, -1, LEAVES);
block(6, 2, 3, LEAVES); block(-7, 1, 8, LEAVES); block(5, 1, 12, LEAVES);
block(2, 5, 4, LEAVES); block(-3, 5, 5, LEAVES);
// scattered rubble
block(-10, 0, -2, COBBLE); block(-11, 0, 0, STONE); block(9, 0, 12, COBBLE);
block(10, 0, 4, STONE); block(-9, 0, 13, STONE); block(8, 0, -4, COBBLE);

// ---- torso (green, hunched forward) ----
sphere(0, 8, 8, 3, LEAVES);      // hips
sphere(0, 11, 7, 3.5, LEAVES);   // belly
sphere(0, 14, 6, 4, LEAVES);     // chest
sphere(-5, 15, 6, 2, LEAVES);    // shoulders
sphere(5, 15, 6, 2, LEAVES);
// darker chest plates
cube(-2, 10, 3, 2, 12, 3, GRASS);
cube(-2, 13, 2, 2, 14, 2, GRASS);
// spine ridge down the back
line(0, 18, 9, 0, 9, 11, GRASS);
line(0, 17, 10, 0, 12, 11, GRASS);

// ---- head (bulbous octopus skull) ----
sphere(0, 21, 5, 4, LEAVES);     // skull
sphere(0, 24, 7, 3, LEAVES);     // bulb rising back
sphere(0, 19, 3, 3, LEAVES);     // face
sphere(-3, 22, 6, 2, LEAVES);    // side lobes
sphere(3, 22, 6, 2, LEAVES);
// brow ridge
cube(-3, 22, 0, 3, 22, 1, GRASS);
// glowing red eyes on the north face
cube(-3, 20, 1, -2, 21, 1, BRICK);
cube(2, 20, 1, 3, 21, 1, BRICK);
block(-3, 20, 0, BRICK); block(2, 20, 0, BRICK);

// ---- face tentacles, hanging and curling forward ----
const tx = [-4, -2, 0, 2, 4];
for (const x of tx) {
  const sway = x === 0 ? 0 : Math.sign(x);
  line(x, 17, 1, x + sway, 13, -2, LEAVES);
  line(x, 16, 0, x + sway, 13, -2, LEAVES);
  line(x + sway, 13, -2, x + sway, 9, -3, LEAVES);
  block(x + sway, 8, -4, LEAVES);
  block(x + sway, 8, -5, LEAVES);
  block(x + sway, 9, -5, LEAVES); // tip curls up
}
// two long outer tentacles reaching the ground
for (const s of [-1, 1]) {
  line(s * 5, 17, 1, s * 5, 10, -2, LEAVES);
  line(s * 5, 10, -2, s * 5, 3, -4, LEAVES);
  line(s * 5, 2, -4, s * 5, 1, -7, LEAVES);
  block(s * 5, 2, -8, LEAVES); // tip flicks up
}

// ---- wings: oak-log bones, gray membrane, scalloped trailing edge ----
for (const s of [-1, 1]) {
  for (let i = 0; i <= 16; i++) {
    const x = s * (4 + i);
    const top = 15 + Math.round(i * 0.95);
    const drop = 7 + Math.round(2 * Math.sin(i * 1.1));
    const bot = Math.max(top - drop, 9);
    cube(x, bot, 10, x, top, 10, STONE);
  }
  line(s * 4, 15, 9, s * 20, 31, 10, OAK_LOG);
  line(s * 4, 16, 9, s * 20, 32, 10, OAK_LOG);
  line(s * 20, 31, 10, s * 22, 26, 10, OAK_LOG); // wing-tip claw
  line(s * 4, 14, 10, s * 14, 22, 10, OAK_LOG);  // finger bones
  line(s * 4, 13, 10, s * 12, 17, 10, OAK_LOG);
}

// ---- limbs (2x2-thick lines) ----
function limb(x1, y1, z1, x2, y2, z2, id) {
  line(x1, y1, z1, x2, y2, z2, id);
  line(x1 + 1, y1, z1, x2 + 1, y2, z2, id);
  line(x1, y1 + 1, z1, x2, y2 + 1, z2, id);
  line(x1 + 1, y1 + 1, z1, x2 + 1, y2 + 1, z2, id);
}
for (const s of [-1, 1]) {
  const o = s === 1 ? 0 : -1; // keep 2-thick limbs symmetric
  // legs: crouched, knees raised in front
  limb(s * 3 + o, 8, 8, s * 7 + o, 11, 1, LEAVES);   // thigh
  sphere(s * 7, 12, 1, 2, LEAVES);                    // knee
  limb(s * 7 + o, 4, 0, s * 7 + o, 11, 1, LEAVES);    // calf
  cube(s * 6 - 1, 1, -3, s * 6 + 1, 2, 1, LEAVES);    // foot
  for (let c = -1; c <= 1; c++) {
    line(s * 6 + c, 1, -4, s * 6 + c, 0, -6, SNOW);   // toe claws
  }
  // arms: braced on the ground ahead
  limb(s * 5 + o, 14, 6, s * 10 + o, 9, 4, LEAVES);   // upper arm
  limb(s * 10 + o, 3, 0, s * 10 + o, 9, 4, LEAVES);   // forearm
  cube(s * 11 - 1, 0, -3, s * 11 + 1, 1, 0, LEAVES);  // hand
  for (let c = -1; c <= 1; c++) {
    line(s * 11 + c, 0, -4, s * 11 + c, 0, -6, SNOW); // finger claws
  }
}

// ---- ruined R'lyeh pillars flanking the front ----
// left pillar, tall and broken
cube(-15, 0, -7, -13, 6, -5, COBBLE);
block(-15, 7, -7, COBBLE); block(-13, 7, -5, STONE);
block(-15, 3, -8, LEAVES); block(-14, 5, -8, LEAVES); // moss on north face
cube(-16, 0, -8, -12, 0, -4, STONE); // plinth
// right pillar, shorter, with fallen column lying beside it
cube(14, 0, -4, 16, 4, -2, COBBLE);
block(14, 5, -4, STONE);
block(15, 2, -5, LEAVES); block(14, 4, -5, LEAVES);
cube(12, 0, -9, 18, 1, -8, COBBLE); // toppled column
block(11, 0, -9, STONE); block(19, 0, -8, STONE);
// lava-golem-sonnet-fb2 — feedback pass 2
function crack(x1,y1,z1,x2,y2,z2){ line(x1,y1,z1,x2,y2,z2, LAVA); }
function band(x1,y,z1,x2,z2,id){ cube(x1,y,z1,x2,y,z2,id); }

// molten ground pool the golem stands in
disk(0, -1, 0, 8, STONE);
disk(0, -1, 0, 7, COBBLE);
disk(0, -1, 0, 3, LAVA);
hollowCylinder(0, -1, 0, 8, 1, COBBLE);
for (let i = 0; i < 10; i++) {
  const a = i / 10 * Math.PI * 2;
  const ex = Math.round(Math.cos(a) * 6);
  const ez = Math.round(Math.sin(a) * 6);
  crack(0, -1, 0, ex, -1, ez);
}

// ===== LEGS (clear gap between them so silhouette reads as two legs) =====
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -7 : 4, x2 = s < 0 ? -4 : 7;
  cube(x1, -2, -3, x2, -1, 3, BRICK);              // boot / foot, wider footprint
  cube(x1, 0, -2, x2, 8, 2, STONE);                // shin/thigh column
  band(x1, 3, -2, x2, 2, COBBLE);                  // knee plate
  band(x1, 6, -2, x2, 2, COBBLE);                  // thigh plate
  crack(x1, -1, -2, x1, 8, -2);
  crack(x2, 0, -2, x2, 7, -2);
  block(s < 0 ? x1 : x2, -1, -3, GLOWSTONE);       // ankle light
}

// ===== HIP / WAIST =====
cube(-8, 8, -2, 8, 10, 2, STONE);
band(-8, 8, -2, 8, 2, BRICK);                      // belt row
line(-8, 8, -2, 8, 8, -2, IRON);
block(-8, 9, -2, GOLD); block(8, 9, -2, GOLD); block(0, 9, -2, GOLD);

// ===== TORSO =====
cube(-9, 10, -2, 9, 17, 2, STONE);
for (let y = 11; y <= 17; y += 2) band(-9, y, 2, 9, 2, BRICK);   // back plating texture
crack(-9, 17, -2, -5, 10, 1);
crack(9, 17, -2, 5, 10, 1);
crack(-9, 10, 1, -3, 13, -2);
crack(9, 10, 1, 3, 13, -2);

// chest molten core (recessed window on the front face)
hollowCube(-3, 12, -2, 3, 16, -2, COBBLE);
cube(-2, 13, -2, 2, 15, -2, LAVA);
block(-3, 14, -2, GLOWSTONE); block(3, 14, -2, GLOWSTONE);

// ===== SHOULDERS =====
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -13 : 10, x2 = s < 0 ? -10 : 13;
  cube(x1, 15, -3, x2, 18, 2, COBBLE);
  band(x1, 15, -3, x2, 2, STONE);
  block(s < 0 ? x1 : x2, 17, -3, GOLD);
  crack(x1, 18, -3, x1, 15, 1);
}

// ===== ARMS (upper arm hangs, forearm bends forward toward camera) =====
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -13 : 10, x2 = s < 0 ? -10 : 13;
  cube(x1, 9, -2, x2, 15, 2, STONE);               // upper arm
  cube(x1, 3, -6, x2, 9, -2, STONE);               // forearm reaching forward
  band(x1, 5, -6, x2, -2, COBBLE);
  crack(x1, 14, -2, x1, 4, -5);
  crack(x2, 13, 1, x2, 5, -4);

  cube(x1 - 1, -1, -7, x2 + 1, 3, -3, COBBLE);      // fist
  band(x1 - 1, -1, -7, x2 + 1, -3, STONE);
  const kx = s < 0 ? x1 : x2;
  crack(kx, -1, -7, kx, 3, -6);
  block(s < 0 ? -11 : 11, 0, -7, LAVA);
}

// ===== HEAD =====
cube(-4, 18, -3, 4, 20, 1, STONE);                 // jaw
crack(-3, 19, -3, 3, 19, -3);                      // molten mouth crack
cube(-4, 21, -3, 4, 23, 1, STONE);                 // face
cube(-5, 24, -3, 5, 25, 1, COBBLE);                // brow / crown band
crack(-4, 22, -3, -4, 18, 1);
crack(4, 22, -3, 4, 18, 1);

block(-3, 22, -4, NEON_RED); block(3, 22, -4, NEON_RED);      // eyes poking forward
block(-3, 22, -3, GLOWSTONE); block(3, 22, -3, GLOWSTONE);
block(-3, 23, -4, NEON_RED); block(3, 23, -4, NEON_RED);      // taller eye slit

// horns — asymmetric: left tall & intact, right shorter & cracked/broken
line(-3, 25, -2, -3, 30, -3, STONE);
block(-3, 30, -3, FIRE);
line(3, 25, -2, 3, 28, -2, STONE);
crack(3, 26, -2, 3, 28, -2);
block(3, 28, -2, FIRE);
block(3, 29, -2, FIRE);

// crown embers along brow
block(-2, 26, -3, FIRE);
block(2, 26, -3, FIRE);

// asymmetric extra scarring for detail/interest
const seedCracks = [
  [-7, 12, 2, -5, 14, -1], [7, 12, 2, 5, 14, -1],
  [-9, 6, 0, -6, 3, 2],    [9, 5, 0, 6, 2, 2],
  [-2, 10, -2, -2, 8, 1],  [2, 9, -2, 2, 7, 1],
  [-11, 16, -3, -9, 12, 0],[11, 17, -3, 9, 13, 0]
];
for (const c of seedCracks) crack(c[0], c[1], c[2], c[3], c[4], c[5]);
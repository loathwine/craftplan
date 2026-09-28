// lava-golem-sonnet-fb1 — feedback pass 1
function crack(x1,y1,z1,x2,y2,z2){ line(x1,y1,z1,x2,y2,z2, LAVA); }

// ---- Base: cracked molten ground (kept restrained so it doesn't blow out the body above) ----
disk(0, -1, 1, 7, STONE);
disk(0, -1, 1, 6, COBBLE);
disk(0, -1, 1, 3, LAVA);
hollowCylinder(0, -1, 1, 7, 1, OBSIDIAN);
for (let i = 0; i < 8; i++) {
  const a = i / 8 * Math.PI * 2;
  const ex = Math.round(Math.cos(a) * 5);
  const ez = 1 + Math.round(Math.sin(a) * 5);
  crack(0, -1, 1, ex, -1, ez);
}
block(-6, 0, -3, FIRE);
block(6, 0, -3, FIRE);
block(-7, 0, 5, FIRE);
block(7, 0, 5, FIRE);

// ---- Legs ----
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -6 : 3, x2 = s < 0 ? -3 : 6;
  cube(x1, 0, -2, x2, 7, 3, OBSIDIAN);
  cube(x1, 0, -3, x2, 1, 3, STONE);              // foot
  for (let y = 2; y <= 6; y += 2) cube(x1, y, -2, x2, y, -2, STONE); // shin plating
  crack(x1, 1, -2, x1, 7, -1);
  crack(x2, 2, -2, x2, 6, -1);
  block(x1, 0, -3, GLOWSTONE);
  block(x2, 0, -3, GLOWSTONE);
}

// ---- Waist ----
cube(-7, 7, -2, 7, 8, 3, OBSIDIAN);
line(-7, 7, -2, 7, 7, -2, IRON);                // riveted belt
block(-7, 7, -2, GOLD); block(7, 7, -2, GOLD); block(0, 7, -2, GOLD);
crack(-7, 8, -2, -3, 9, -1);
crack(7, 8, -2, 3, 9, -1);

// ---- Torso ----
cube(-7, 8, -2, 7, 10, 3, OBSIDIAN);
cube(-8, 10, -2, 8, 12, 3, OBSIDIAN);           // chest bulge (broad shoulders base)
cube(-7, 13, -2, 7, 15, 3, OBSIDIAN);
for (let y = 9; y <= 15; y += 2) cube(-8, y, 3, 8, y, 3, STONE); // back plating
hollowCube(-2, 10, -2, 2, 14, -2, STONE);       // chest frame
cube(-1, 11, -2, 1, 13, -2, LAVA);              // molten heart core (front glow window)
crack(-2, 14, -2, -8, 9, 1);
crack(2, 14, -2, 8, 9, 1);
crack(-2, 10, -2, -6, 13, 2);
crack(2, 10, -2, 6, 13, 2);

// ---- Shoulder pads (flare wider than torso to read clearly) ----
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -11 : 9, x2 = s < 0 ? -9 : 11;
  cube(x1, 15, -2, x2, 17, 3, OBSIDIAN);
  cube(x1, 17, -2, x2, 17, 3, STONE);
  block(x1, 16, -2, GOLD);
  block(x2, 16, -2, GOLD);
  crack(x1, 17, -2, x1, 15, 1);
}

// ---- Arms (gap at x=-8/8 left as open air so arms read as separate from torso) ----
for (const s of [-1, 1]) {
  const ax1 = s < 0 ? -11 : 9, ax2 = s < 0 ? -9 : 11;
  cube(ax1, 11, -1, ax2, 17, 3, OBSIDIAN);       // upper arm
  cube(ax1, 4, 0, ax2, 11, 3, OBSIDIAN);         // forearm, slightly forward
  for (let y = 5; y <= 16; y += 3) cube(ax1, y, 3, ax2, y, 3, STONE);
  crack(ax1, 16, -1, ax1, 5, 1);
  crack(ax2, 15, 3, ax2, 6, 2);

  const fx1 = s < 0 ? -13 : 9, fx2 = s < 0 ? -9 : 13;
  cube(fx1, 0, -1, fx2, 4, 3, OBSIDIAN);         // big blocky fist
  cube(fx1, 4, -1, fx2, 4, 3, STONE);            // knuckle row
  const kx = s < 0 ? fx1 + 1 : fx1 + 3;
  crack(kx, 0, -1, kx, 4, -1);
  block(s < 0 ? -11 : 11, 1, -1, LAVA);
  block(s < 0 ? -11 : 11, 3, 1, LAVA);
}

// ---- Head ----
cube(-4, 17, -2, 4, 22, 3, OBSIDIAN);
cube(-4, 17, -2, 4, 17, 3, STONE);              // jaw
cube(-4, 21, -2, 4, 22, 3, STONE);              // brow / crown band
crack(-3, 18, -2, 3, 18, -2);                   // molten mouth crack
block(-3, 20, -3, NEON_RED); block(3, 20, -3, NEON_RED);   // glowing eyes, poking forward
block(-3, 20, -2, GLOWSTONE); block(3, 20, -2, GLOWSTONE); // eye socket glow
crack(-4, 19, -2, -4, 17, 1);
crack(4, 19, -2, 4, 17, 1);

// ---- Horns ----
for (const s of [-1, 1]) {
  const hx = s * 4;
  line(hx, 22, -2, hx + s * 1, 25, -3, COBBLE);
  block(hx + s * 1, 25, -3, FIRE);
}
block(0, 23, -1, FIRE);

// ---- extra magma vein detail across the body for texture/asymmetry ----
const seedCracks = [
  [-6, 9, -2, -4, 10, 0], [6, 9, -2, 4, 10, 0],
  [-7, 12, 0, -5, 13, 2], [7, 12, 0, 5, 13, 2],
  [-9, 13, 0, -9, 11, 2], [9, 13, 0, 9, 11, 2],
  [-3, 3, -2, -3, 1, 1], [3, 4, -2, 3, 2, 1]
];
for (const c of seedCracks) crack(c[0], c[1], c[2], c[3], c[4], c[5]);
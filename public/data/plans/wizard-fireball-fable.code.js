// wizard-fireball-fable — prompt:
// a wizard casting a fireball...

// --- clear the two trees crowding the site ---
cube(-3, 0, -12, 10, 7, 3, AIR);
cube(-8, 1, -20, 8, 4, -12, AIR);

// --- ground: scorched stone circle with glowing rune ring ---
disk(0, -1, 0, 11, COBBLE);
disk(0, -1, 0, 7, STONE);
for (let a = 0; a < 360; a += 15) {
  const r = 9, x = Math.round(r * Math.cos(a * Math.PI / 180)), z = Math.round(r * Math.sin(a * Math.PI / 180));
  block(x, 0, z, a % 45 === 0 ? GLOWSTONE : PURPLE);
}
for (let a = 0; a < 360; a += 30) {
  const x = Math.round(5 * Math.cos(a * Math.PI / 180)), z = Math.round(5 * Math.sin(a * Math.PI / 180));
  block(x, -1, z, OBSIDIAN);
}
// scorch marks toward the fireball
for (let z = -6; z >= -12; z--) for (let x = 2; x <= 6; x++) if (Math.random() < 0.6) block(x, -1, z, BLACK);

// --- robe: flared cone body ---
const robeR = [6, 6, 5, 5, 5, 4, 4, 4, 4, 4, 4, 3, 3];
for (let y = 0; y < robeR.length; y++) disk(0, y, 1, robeR[y], PURPLE);
// hem trim + vertical gold stripes
disk(0, 0, 1, 6, MAGENTA);
for (let y = 1; y < 12; y++) { block(0, y, 1 - robeR[y], GOLD); block(-robeR[y], y, 1, GOLD); block(robeR[y], y, 1, GOLD); }
// belt
disk(0, 6, 1, 4, BROWN); block(0, 6, -3, GOLD); block(1, 6, -3, GOLD); block(-1, 6, -3, GOLD);
// shoulders
disk(0, 12, 1, 4, PURPLE); disk(0, 13, 1, 3, PURPLE);
// flowing cloak behind (+Z)
for (let y = 0; y < 13; y++) { const w = 4 - Math.floor(y / 4); cube(-w, y, 4 + Math.floor((12 - y) / 3), w, y, 5 + Math.floor((12 - y) / 3), BLUE); }
cube(-3, 0, 7, 3, 0, 9, BLUE); cube(-2, 0, 10, 1, 0, 11, BLUE);

// --- head ---
sphere(0, 16, 1, 3, SAND);
// eyes glowing (front = -Z)
block(-1, 17, -2, NEON_BLUE); block(1, 17, -2, NEON_BLUE);
block(-1, 18, -2, BLACK); block(1, 18, -2, BLACK); // brows
block(0, 16, -2, SAND); block(0, 15, -2, WHITE);
// beard: long white cascading down chest
for (let y = 15; y >= 6; y--) { const w = y > 12 ? 2 : Math.max(0, 2 - Math.floor((13 - y) / 3)); cube(-w, y, -3, w, y, -2 - (y > 12 ? 1 : 0), WHITE); }
cube(-1, 15, -3, 1, 14, -3, LIGHT_GRAY);
// moustache
line(-2, 15, -3, 2, 15, -3, LIGHT_GRAY);
// ears
block(-4, 16, 1, SAND); block(4, 16, 1, SAND);

// --- hat: wide brim + tall bent cone ---
disk(0, 19, 1, 7, PURPLE); disk(0, 19, 1, 7, PURPLE);
for (let a = 0; a < 360; a += 20) block(Math.round(7 * Math.cos(a * Math.PI / 180)), 19, 1 + Math.round(7 * Math.sin(a * Math.PI / 180)), GOLD);
disk(0, 20, 1, 4, PURPLE);
const hatH = 11;
for (let i = 0; i < hatH; i++) {
  const r = Math.max(0, 4 - Math.floor(i / 2.5));
  const bend = Math.floor(i * i / 24); // tip droops toward east (+X) and south
  disk(bend, 21 + i, 1 + Math.floor(bend / 2), r, PURPLE);
}
block(5, 32, 3, PURPLE); block(6, 32, 4, PURPLE); block(7, 31, 4, GOLD);
// hat band + stars + moon
disk(0, 20, 1, 4, GOLD); disk(0, 20, 1, 3, PURPLE);
block(-3, 23, -1, YELLOW); block(2, 25, -2, YELLOW); block(0, 27, -1, YELLOW); block(3, 22, -1, YELLOW);
block(-2, 26, 0, YELLOW); block(-1, 25, -1, YELLOW); block(-1, 24, -1, YELLOW);

// --- right arm (east) thrust NORTH, hand open toward fireball ---
for (let z = 0; z >= -7; z--) {
  const y = 12 + Math.floor(-z / 7); // slight rise
  cube(3, y, z, 5, y + 1, z, PURPLE);
}
cube(4, 13, -8, 5, 14, -8, SAND); // hand
block(3, 14, -9, SAND); block(6, 14, -9, SAND); block(4, 15, -9, SAND); block(5, 15, -9, SAND); // fingers spread
// sleeve cuff
cube(3, 12, -6, 6, 15, -6, MAGENTA); cube(3, 12, -6, 6, 15, -6, MAGENTA);
block(2, 12, -6, GOLD); block(7, 13, -6, GOLD);

// --- FIREBALL leaving the hand ---
const fx = 5, fy = 15, fz = -15;
sphere(fx, fy, fz, 4, ORANGE);
sphere(fx, fy, fz, 3, LAVA);
hollowSphere(fx, fy, fz, 5, AIR);
for (let a = 0; a < 360; a += 30) for (let b = -60; b <= 60; b += 60) {
  const ca = a * Math.PI / 180, cb = b * Math.PI / 180;
  block(fx + Math.round(4.6 * Math.cos(ca) * Math.cos(cb)), fy + Math.round(4.6 * Math.sin(cb)), fz + Math.round(4.6 * Math.sin(ca) * Math.cos(cb)), (a + b) % 60 === 0 ? YELLOW : RED);
}
// flames licking around the ball
for (let i = 0; i < 14; i++) {
  const a = i * 0.9, r = 5.5;
  block(fx + Math.round(r * Math.cos(a)), fy + 2 + (i % 3), fz + Math.round(r * Math.sin(a)), FIRE);
}
block(fx, fy + 5, fz, FIRE); block(fx - 1, fy + 5, fz + 1, FIRE); block(fx + 1, fy + 5, fz - 1, FIRE);
// trail from hand to ball: embers, sparks, glow
for (let i = 1; i <= 5; i++) {
  const z = -9 - i, y = 14 + Math.floor(i / 5);
  block(fx - 1 + (i % 2), y, z, i < 3 ? YELLOW : ORANGE);
  block(fx + (i % 2), y + 1, z, i % 2 ? RED : FIRE);
  block(fx - 1, y - 1 + (i % 2), z, ELECTRIC);
}
block(4, 15, -10, FIRE); block(5, 13, -10, FIRE); block(6, 14, -11, ELECTRIC);
// ground glow beneath the fireball
disk(fx, -1, fz, 3, ORANGE); disk(fx, -1, fz, 1, LAVA);

// --- left arm (west) holding staff ---
cube(-6, 8, 0, -4, 12, 2, PURPLE);
cube(-7, 8, -1, -5, 9, 1, SAND); // hand gripping staff
cube(-7, 12, -1, -3, 13, 2, MAGENTA); // cuff
// staff
line(-6, 0, 0, -6, 19, 0, OAK_LOG);
block(-6, 20, 0, BROWN); block(-7, 21, 0, BROWN); block(-5, 21, 0, BROWN); block(-6, 21, -1, BROWN); block(-6, 21, 1, BROWN);
sphere(-6, 22, 0, 1, NEON_BLUE);
block(-6, 24, 0, ELECTRIC); block(-7, 23, -1, ELECTRIC); block(-5, 22, -2, ELECTRIC);
block(-6, 0, 0, IRON);

// --- burning dead tree hit by an earlier bolt (north-east) ---
line(14, -1, -12, 14, 6, -12, OAK_LOG);
line(14, 6, -12, 12, 9, -13, OAK_LOG); line(14, 6, -12, 16, 9, -11, OAK_LOG); line(14, 7, -12, 15, 10, -13, OAK_LOG);
block(12, 10, -13, FIRE); block(16, 10, -11, FIRE); block(15, 11, -13, FIRE); block(14, 8, -12, FIRE);
disk(14, -1, -12, 3, BLACK); block(13, 0, -11, LAVA); block(15, 0, -12, ORANGE);
sphere(14, 3, -12, 1, ORANGE);

// --- ruined stone arch behind the wizard (south) for depth ---
cube(-10, 0, 12, -8, 9, 14, STONE); cube(8, 0, 12, 10, 8, 14, STONE);
cube(-10, 10, 12, -4, 10, 14, COBBLE); cube(3, 9, 12, 10, 9, 14, COBBLE);
block(-3, 10, 13, COBBLE); block(2, 9, 13, COBBLE);
line(-9, 0, 15, -9, 5, 15, COBBLE); line(9, 0, 15, 9, 4, 15, COBBLE);
// rubble
block(-6, 0, 10, COBBLE); block(5, 0, 11, STONE); block(6, 0, 10, COBBLE); block(-7, 0, 11, STONE); block(-7, 1, 11, COBBLE);
// two standing stones flanking, with faint runes
cube(-16, 0, -4, -15, 6, -3, STONE); block(-16, 7, -4, STONE);
cube(15, 0, 4, 16, 5, 5, STONE); block(15, 6, 5, STONE);
block(-15, 3, -5, NEON_BLUE); block(-16, 4, -5, NEON_BLUE); block(15, 2, 3, NEON_BLUE); block(16, 3, 3, NEON_BLUE);

// --- magical floating motes around the wizard ---
[[-4, 20, -3], [3, 24, 3], [-8, 15, -2], [8, 18, 2], [-3, 28, 4], [9, 22, -3], [-9, 24, 2]].forEach(p => block(p[0], p[1], p[2], p[1] % 2 ? GLOWSTONE : NEON_BLUE));
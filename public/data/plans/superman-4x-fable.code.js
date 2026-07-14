// superman-4x-fable — prompt:
// Superman...

const B = 2; // hover height — Superman floats above his liftoff crater

// ---------- site clearing (AIR is free) ----------
cube(-10, 0, -9, 10, 12, 9, AIR);      // figure volume (clears tree canopies)
cube(-17, 0, 0, -9, 10, 9, AIR);       // cape drift zone
cube(-8, 0, -16, 8, 10, -9, AIR);      // camera corridor to the north
cube(4, 0, -22, 12, 9, -17, AIR);
cube(-22, 0, 16, 22, 9, 22, AIR);      // skyline strip to the south

// ---------- liftoff crater ----------
disk(0, 0, 0, 7, AIR);
disk(0, -1, 0, 6, AIR);
disk(0, -2, 0, 4, AIR);
disk(0, -3, 0, 5, DIRT);
for (let i = 0; i < 48; i++) {
  const a = i * Math.PI / 24;
  const r = 7.6 + (i % 3) * 0.7;
  const x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r);
  block(x, 0, z, COBBLE);
  if (i % 3 === 0) block(x, 1, z, STONE);
  if (i % 5 === 0) block(Math.round(Math.cos(a) * (r + 1.3)), 0, Math.round(Math.sin(a) * (r + 1.3)), STONE);
}
// radiating cracks
for (let k = 0; k < 6; k++) {
  const a = k * Math.PI / 3 + 0.4;
  line(Math.round(Math.cos(a) * 8), -1, Math.round(Math.sin(a) * 8),
       Math.round(Math.cos(a) * 13), -1, Math.round(Math.sin(a) * 13), COBBLE);
}
// floating debris sucked up by the launch
for (let i = 0; i < 12; i++) {
  const a = i * Math.PI / 6 + 0.26;
  const r = 4.5 + (i % 3);
  block(Math.round(Math.cos(a) * r), 1 + (i % 4), Math.round(Math.sin(a) * r), i % 2 ? COBBLE : STONE);
}
// kryptonite crystals glowing in the crater floor
cube(-1, -2, -1, 1, -2, 1, LEAVES);
block(0, -1, 0, LEAVES);
line(0, -2, 0, 2, 2, 1, LEAVES);
line(1, -2, -1, -1, 1, -2, LEAVES);
line(-2, -2, 1, -3, 1, 2, LEAVES);

// ---------- Superman (faces north / -Z) ----------
// red boots + toes
cube(-4, B, -2, -1, B + 4, 1, BRICK);
cube(1, B, -2, 4, B + 4, 1, BRICK);
cube(-4, B, -3, -1, B + 1, -3, BRICK);
cube(1, B, -3, 4, B + 1, -3, BRICK);
// blue legs
cube(-3, B + 5, -2, -1, B + 12, 1, GLASS);
cube(1, B + 5, -2, 3, B + 12, 1, GLASS);
cube(0, B + 11, -2, 0, B + 12, 1, GLASS);
// red trunks + yellow belt
cube(-3, B + 13, -2, 3, B + 14, 1, BRICK);
cube(-3, B + 15, -2, 3, B + 15, 1, SAND);
block(0, B + 15, -2, BRICK); // buckle
// tapered torso
const hws = [3, 4, 4, 5, 5, 5, 6, 6];
for (let i = 0; i < 8; i++) {
  const y = B + 16 + i, hw = hws[i];
  cube(-hw, y, -2, hw, y, 1, GLASS);
}
// S-shield: yellow diamond, red border, red S-stroke (flush on chest front)
function sh(x, y, id) { block(x, B + y, -2, id); }
sh(-3, 21, BRICK); sh(-2, 21, SAND); sh(-1, 21, SAND); sh(0, 21, SAND); sh(1, 21, BRICK); sh(2, 21, BRICK); sh(3, 21, BRICK);
sh(-3, 20, BRICK); sh(-2, 20, SAND); sh(-1, 20, SAND); sh(0, 20, BRICK); sh(1, 20, SAND); sh(2, 20, SAND); sh(3, 20, BRICK);
sh(-2, 19, BRICK); sh(-1, 19, BRICK); sh(0, 19, SAND); sh(1, 19, SAND); sh(2, 19, BRICK);
sh(-1, 18, BRICK); sh(0, 18, SAND); sh(1, 18, BRICK);
sh(0, 17, BRICK);
// deltoids
sphere(-6, B + 23, 0, 2, GLASS);
sphere(6, B + 24, 0, 2, GLASS);
// right arm clenched at his side
cube(-7, B + 17, -1, -6, B + 22, 0, GLASS);
cube(-7, B + 15, -2, -6, B + 16, -1, PLANKS);
// left arm punched straight up — up, up and away
cube(5, B + 24, -1, 6, B + 29, 0, GLASS);
cube(5, B + 30, -1, 6, B + 31, 0, PLANKS);
// neck + head
cube(-1, B + 24, -1, 1, B + 24, 0, PLANKS);
cube(-2, B + 25, -2, 2, B + 30, 1, PLANKS);
// black hair + spit curl
cube(-2, B + 30, -2, 2, B + 30, 1, STONE);
cube(-1, B + 31, -1, 1, B + 31, 1, STONE);
cube(-2, B + 26, 1, 2, B + 30, 1, STONE);
block(-2, B + 29, -1, STONE); block(-2, B + 29, 0, STONE);
block(2, B + 29, -1, STONE); block(2, B + 29, 0, STONE);
block(0, B + 29, -3, STONE);
// face: blue eyes, jaw shadow
block(-1, B + 28, -2, ICE);
block(1, B + 28, -2, ICE);
block(0, B + 26, -2, STONE);

// ---------- cape: billowing back and to his right ----------
cube(-4, B + 24, 1, 4, B + 24, 2, BRICK); // collar
for (let t = 0; t <= 24; t++) {
  const y = B + 23 - t;
  const hw = Math.min(12, 6 + Math.floor(t * 0.3));
  const drift = Math.floor(t * 0.18);
  const zb = 2 + Math.floor(t * 0.12);
  for (let x = -hw - drift; x <= hw - drift; x++) {
    if (y <= 3 && ((x * 7 + t * 3) % 5 === 0)) continue; // ragged wind-torn hem
    const z = zb + Math.round(Math.sin(x * 0.7 + t * 0.45));
    block(x, y, z, BRICK);
    if (t > 4 && ((x + t) % 2 === 0)) block(x, y, z + 1, BRICK);
  }
}

// ---------- clouds ----------
function puff(cx, cy, cz, r) {
  disk(cx, cy, cz, r, SNOW);
  disk(cx + 1, cy + 1, cz, r - 1, SNOW);
}
puff(-15, 20, 8, 3);
puff(13, 23, 10, 3);
puff(-19, 13, -8, 2);
puff(18, 15, 2, 2);

// ---------- Metropolis skyline behind him ----------
function tower(cx, hw, h, mat) {
  cube(cx - hw, -1, 18, cx + hw, h, 20, mat);
  for (let y = 1; y <= h - 2; y += 2)
    for (let x = cx - hw + 1; x <= cx + hw - 1; x += 2)
      block(x, y, 18, ((x + y) % 4 === 0) ? GLASS : SAND); // lit windows
}
tower(-18, 2, 13, STONE);
tower(-10, 1, 19, COBBLE);
tower(-2, 2, 9, STONE);
tower(7, 2, 16, COBBLE);
tower(15, 2, 11, STONE);
cube(-10, 20, 19, -10, 24, 19, STONE); // antenna
block(-10, 25, 19, BRICK);             // beacon
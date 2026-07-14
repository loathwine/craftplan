// groot-4x-opus — prompt:
// Groot...

const meta = null; // (ignored by sandbox)

// ===== helpers =====
function hsh(x, y, z) {
  let n = (x * 374761393 + y * 668265263 + z * 2246822519) | 0;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) % 1000 / 1000;
}
function barkBlk(x, y, z, moss) {
  const r = hsh(x, y, z);
  if (r < moss) block(x, y, z, LEAVES);          // mossy patch
  else if (r < moss + 0.20) block(x, y, z, PLANKS); // pale bark streak
  else block(x, y, z, OAK_LOG);                  // dark bark
}
function barkFill(x1, y1, z1, x2, y2, z2, moss) {
  moss = moss || 0.05;
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++) barkBlk(x, y, z, moss);
}
function branch(x1, y1, z1, x2, y2, z2, r, moss) {
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cx = Math.round(x1 + dx * t), cy = Math.round(y1 + dy * t), cz = Math.round(z1 + dz * t);
    for (let ox = -r; ox <= r; ox++)
      for (let oy = -r; oy <= r; oy++)
        for (let oz = -r; oz <= r; oz++)
          if (ox * ox + oy * oy + oz * oz <= r * r + 1) barkBlk(cx + ox, cy + oy, cz + oz, moss);
  }
}
function leafBall(cx, cy, cz, r) {
  for (let x = -r; x <= r; x++)
    for (let y = -r; y <= r; y++)
      for (let z = -r; z <= r; z++) {
        const d = x * x + y * y + z * z;
        if (d <= r * r + r && hsh(cx + x, cy + y, cz + z) > 0.14)
          block(cx + x, cy + y, cz + z, LEAVES);
      }
}

// ===== clear the forest inside Groot's silhouette (leave surrounding trees as backdrop) =====
cube(-12, 1, -5, 12, 32, 6, AIR);

// ================= BIG GROOT =================

// --- roots / feet spreading on the ground ---
const rootEnds = [[-6,0,-3],[-5,0,3],[-2,0,-4],[-4,0,4],[6,0,-3],[5,0,3],[2,0,-4],[4,0,4]];
for (const e of rootEnds) branch(e[0] > 0 ? 3 : -3, 1, 0, e[0], e[1], e[2], 0, 0.04);
barkFill(-4, 0, -1, -2, 1, 1, 0.03);
barkFill(2, 0, -1, 4, 1, 1, 0.03);

// --- legs ---
barkFill(-4, 1, -1, -2, 8, 1, 0.05);   // left leg
barkFill(2, 1, -1, 4, 8, 1, 0.05);     // right leg
// knee moss
leafBall(-3, 6, -1, 1);
leafBall(3, 5, 2, 1);

// --- torso (waist -> broad chest) ---
barkFill(-3, 8, -2, 3, 10, 2, 0.06);          // waist
barkFill(-3, 10, -2, 3, 13, 2, 0.06);         // lower torso / belly
barkFill(-4, 13, -2, 4, 17, 2, 0.06);         // chest, broadening
barkFill(-2, 11, -3, 2, 16, -3, 0.04);        // front chest bulge (catches light)
// shoulders
barkFill(-5, 16, -2, 5, 18, 1, 0.06);
// neck
barkFill(-1, 17, -1, 1, 19, 1, 0.03);

// --- arms ---
// right arm raised high (+X, toward the light)
branch(4, 17, 0, 6, 19, -1, 1, 0.06);
branch(6, 19, -1, 8, 22, -1, 1, 0.06);
branch(8, 22, -1, 8, 26, -2, 1, 0.06);
branch(8, 26, -2, 8, 29, -2, 0, 0.06);
// raised hand twigs + foliage
branch(8, 29, -2, 6, 31, -2, 0, 0.05);
branch(8, 29, -2, 10, 31, -1, 0, 0.05);
branch(8, 29, -2, 9, 32, -3, 0, 0.05);
leafBall(8, 31, -2, 2);
// left arm hanging down (-X)
branch(-4, 17, 0, -6, 16, -1, 1, 0.06);
branch(-6, 16, -1, -8, 13, -1, 1, 0.06);
branch(-8, 13, -1, -8, 9, -2, 1, 0.06);
// left hand fingers/twigs
branch(-8, 9, -2, -10, 10, -2, 0, 0.04);
branch(-8, 9, -2, -9, 6, -2, 0, 0.04);
branch(-8, 9, -2, -7, 6, -3, 0, 0.04);

// --- head ---
barkFill(-2, 19, -2, 2, 25, 2, 0.05);
// brow ridge (heavy, expressive) on the front
barkFill(-2, 23, -3, 2, 24, -3, 0.02);
barkFill(-2, 24, -2, 2, 25, -2, 0.02);

// eyes (big friendly cartoon eyes) — white sclera + dark pupil, protruding front
function eye(ex) {
  block(ex, 22, -3, SNOW); block(ex, 23, -3, SNOW);
  block(ex + (ex < 0 ? 1 : -1), 22, -3, SNOW);
  block(ex + (ex < 0 ? 1 : -1), 23, -3, SNOW);
  block(ex, 22, -4, STONE); // pupil, popping forward
}
eye(-2); // left eye
eye(2);  // right eye

// nose bump
barkBlk(0, 21, -3, 0.0);
barkBlk(0, 20, -3, 0.0);

// grinning mouth (dark line curving up at the corners)
block(-1, 20, -3, STONE); block(0, 20, -3, STONE); block(1, 20, -3, STONE);
block(-2, 21, -3, STONE); block(2, 21, -3, STONE);

// --- head branches / mossy hair ---
const hair = [
  [0, 25, 0, -3, 29, -1],
  [0, 25, 0, 3, 30, -1],
  [1, 25, 1, 3, 28, 2],
  [-1, 25, 1, -3, 28, 1],
  [0, 25, 0, 0, 31, 0],
  [0, 25, -1, -1, 30, -2],
  [0, 25, -1, 2, 29, -2],
];
for (const h of hair) {
  branch(h[0], h[1], h[2], h[3], h[4], h[5], 0, 0.08);
  leafBall(h[3], h[4], h[5], 2);
}
// extra shoulder moss
leafBall(-4, 18, -1, 1);
leafBall(4, 18, -1, 1);

// ================= BABY GROOT (foreground, +X side, catching light) =================
const bx = 10, bz = -2; // origin of baby
// feet + legs
barkFill(bx - 1, 0, bz, bx - 1, 3, bz, 0.04);
barkFill(bx + 1, 0, bz, bx + 1, 3, bz, 0.04);
// body
barkFill(bx - 1, 3, bz - 1, bx + 1, 5, bz + 1, 0.06);
// little arms
branch(bx - 1, 5, bz, bx - 3, 6, bz - 1, 0, 0.05);
branch(bx + 1, 5, bz, bx + 3, 6, bz, 0, 0.05);
// big head
barkFill(bx - 1, 5, bz - 1, bx + 1, 8, bz + 1, 0.04);
// huge baby eyes
block(bx - 1, 6, bz - 2, SNOW); block(bx - 1, 7, bz - 2, SNOW);
block(bx + 1, 6, bz - 2, SNOW); block(bx + 1, 7, bz - 2, SNOW);
block(bx - 1, 6, bz - 2, STONE); block(bx + 1, 6, bz - 2, STONE);
// sprout on top
branch(bx, 8, bz, bx, 10, bz, 0, 0.1);
branch(bx, 9, bz, bx - 1, 10, bz - 1, 0, 0.1);
branch(bx, 9, bz, bx + 1, 10, bz + 1, 0, 0.1);
leafBall(bx, 10, bz, 1);

// ================= GROUND DRESSING (foreground detail) =================
// a couple of small red mushrooms
function mushroom(mx, mz) {
  block(mx, 1, mz, PLANKS);
  block(mx - 1, 2, mz, BRICK); block(mx + 1, 2, mz, BRICK);
  block(mx, 2, mz - 1, BRICK); block(mx, 2, mz + 1, BRICK);
  block(mx, 2, mz, BRICK);
}
mushroom(-9, 3);
mushroom(6, 4);
mushroom(-6, -3);
// scattered moss tufts on the ground
for (const t of [[-7,4],[7,-1],[-10,0],[5,3],[-3,4],[9,3]]) block(t[0], 1, t[1], LEAVES);
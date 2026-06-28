// master-sword — prompt:
// The Master Sword from Zelda, standing embedded in its stone pedestal in a forest clearing. SHAPE IS KEY: one GIANT sword standing point-down, blade sunk into a stone pedestal, blade pointing up to the...

// ===== THE MASTER SWORD IN ITS PEDESTAL =====
// A giant glowing blade rising from a tiered stone pedestal in a forest
// clearing, ringed by oak trees and ancient cobble ruins.

const PI = Math.PI, cos = Math.cos, sin = Math.sin, R = Math.round, abs = Math.abs;

// ---------- helpers ----------
function tier(y, r) {                              // stone step with a cobble rim
  disk(0, y, 0, r, COBBLE);
  disk(0, y, 0, r - 1, STONE);
}
function tree(tx, tz, h, cr) {
  if (abs(tx) > 21 || abs(tz) > 21) return;
  cube(tx, -1, tz, tx, h, tz, OAK_LOG);            // trunk
  block(tx + 1, h - 1, tz, OAK_LOG);               // stubby branches
  block(tx - 1, h - 2, tz, OAK_LOG);
  sphere(tx, h + 1, tz, cr, LEAVES);               // canopy
  sphere(tx + 1, h, tz + 1, cr - 1, LEAVES);       // offset blobs (natural shape)
  sphere(tx - 1, h, tz - 1, cr - 1, LEAVES);
}
function pillar(px, pz, h, tk) {                   // ruined cobble column
  cube(px - tk, -1, pz - tk, px + tk, h, pz + tk, COBBLE);
  block(px + tk, h, pz + tk, AIR);                 // knock a corner off
  if (h > 3) block(px - tk, h, pz - tk, AIR);
  if ((px + pz) % 2 === 0) block(px, h + 1, pz, LEAVES); // moss
}

// ---------- 1. carve the clearing out of the existing forest ----------
cylinder(0, 1, 0, 11, 9, AIR);

// ---------- 2. tiered stone pedestal with steps ----------
cylinder(0, -2, 0, 8, 2, STONE);                   // buried foundation
tier(0, 8);
tier(1, 7);
tier(2, 6);
tier(3, 5);                                        // top platform, surface y=3
// glowing slot where the blade pierces the stone
cube(-1, 3, 0, 1, 3, 0, GLASS);
cube(0, 3, -1, 0, 3, 1, GLASS);
// faint glowing runes set into the platform
for (let i = 0; i < 8; i++) {
  const a = i / 8 * PI * 2;
  block(R(cos(a) * 4), 3, R(sin(a) * 4), GLASS);
}

// ---------- 3. the giant sword ----------
// 3a. blade: tip sunk at y=2, broad glowing blade rising to the guard at y=23
const bTip = 2, bTop = 23;
for (let y = bTip; y <= bTop; y++) {
  const t = (y - bTip) / (bTop - bTip);            // 0 tip -> 1 guard
  let hw = (t < 0.35) ? R(t / 0.35 * 2) : 2;       // taper to a point in lower third
  if (t > 0.9) hw = 3;                             // slight flare at the shoulders
  const ht = (t < 0.2) ? 0 : 1;                    // thin near the point
  cube(-hw, y, -ht, hw, y, ht, SNOW);              // glowing blade body
  block(0, y, -ht, GLASS);                         // blue fuller line on both faces
  block(0, y, ht, GLASS);
}

// 3b. crossguard: wide golden guard, down-swept wings, up-flicked tips, central gem
const gy = 24;
cube(-7, gy, -1, 7, gy + 1, 1, SAND);              // main bar
cube(-7, gy - 1, -1, -5, gy - 1, 1, SAND);         // wings sweep down toward the blade
cube(5, gy - 1, -1, 7, gy - 1, 1, SAND);
cube(-7, gy - 2, 0, -6, gy - 2, 0, SAND);
cube(6, gy - 2, 0, 7, gy - 2, 0, SAND);
block(-7, gy - 3, 0, BRICK);                       // lower wing points
block(7, gy - 3, 0, BRICK);
block(8, gy, 0, SAND); block(-8, gy, 0, SAND);     // up-flicked wingtips
block(8, gy + 1, 0, BRICK); block(-8, gy + 1, 0, BRICK);
cube(-7, gy, 0, -7, gy + 1, 0, BRICK);             // red accents on the wings
cube(7, gy, 0, 7, gy + 1, 0, BRICK);
block(0, gy, 0, GLASS);                            // central guard gem
block(0, gy + 2, 0, BRICK);                        // crest above the guard

// 3c. grip: ornate wrapped handle, alternating red/gold bands
cube(-1, 25, -1, 1, 25, 1, BRICK);                 // collar joining guard to grip
for (let y = 26; y <= 29; y++) {
  cube(-1, y, -1, 1, y, 1, (y % 2 === 0) ? BRICK : SAND);
}

// 3d. pommel: rounded gold cap crowned with a glowing gem
sphere(0, 31, 0, 2, SAND);
block(0, 31, -2, GLASS); block(0, 31, 2, GLASS);   // gem facets
block(-2, 31, 0, GLASS); block(2, 31, 0, GLASS);
block(0, 33, 0, GLASS);                            // glowing apex against the sky

// ---------- 4. ancient cobble ruins ----------
// broken low ring wall at the clearing edge
for (let i = 0; i < 56; i++) {
  const a = i / 56 * PI * 2;
  const wx = R(cos(a) * 11), wz = R(sin(a) * 11);
  if (i % 9 < 2) continue;                          // gaps in the ruined wall
  const h = 1 + (i * 7) % 3;
  cube(wx, 0, wz, wx, h, wz, COBBLE);
  if (i % 6 === 0) block(wx, h + 1, wz, LEAVES);     // moss
}
// standing broken pillars
pillar(-9, -6, 6, 1);
pillar(8, -7, 5, 1);
pillar(-10, 4, 7, 1);
pillar(9, 6, 4, 1);
// gateway arch
pillar(10, -2, 6, 0);
pillar(10, 2, 6, 0);
cube(10, 6, -2, 10, 7, 2, COBBLE);
block(10, 8, 0, LEAVES);
// toppled column lying in the grass
cube(-9, 1, 4, -5, 1, 4, COBBLE);
block(-9, 2, 4, COBBLE);
cube(-10, 1, 3, -10, 2, 5, COBBLE);                 // broken stump it fell from
// scattered rubble
[[6,-9],[-6,-8],[9,3],[-3,10],[4,-10],[-11,-2],[7,9],[2,11]].forEach(([rx, rz]) => {
  block(rx, 1, rz, COBBLE);
  if ((rx + rz) % 2 === 0) block(rx, 2, rz, COBBLE);
});

// ---------- 5. forest ring (oak trees) ----------
const NT = 16;
for (let i = 0; i < NT; i++) {
  const a = i / NT * PI * 2 + 0.4;
  const r = 13 + (i % 3) * 2;                        // 13 / 15 / 17
  tree(R(cos(a) * r), R(sin(a) * r), 5 + (i % 4), (i % 4 === 0) ? 4 : 3);
}
// a couple of big ancient trees for depth
tree(-17, -12, 9, 4);
tree(16, 13, 9, 4);

// ---------- 6. low grass + leaf ring framing the clearing ----------
for (let i = 0; i < 30; i++) {
  const a = i / 30 * PI * 2;
  const r = 9 + (i % 3) * 0.6;
  const bx = R(cos(a) * r), bz = R(sin(a) * r);
  block(bx, 0, bz, GRASS);
  if (i % 2 === 0) sphere(bx, 1, bz, 1, LEAVES);     // small bushes
}
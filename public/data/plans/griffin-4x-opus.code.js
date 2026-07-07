// griffin-4x-opus — prompt:
// a griffin...

const GRIFFIN = 1; // (unused marker; real output below)

// ---- helpers ----------------------------------------------------
function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -rx; x <= rx; x++)
    for (let y = -ry; y <= ry; y++)
      for (let z = -rz; z <= rz; z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d <= 1.02) block(Math.round(cx+x), Math.round(cy+y), Math.round(cz+z), id);
      }
}
function shell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -rx; x <= rx; x++)
    for (let y = -ry; y <= ry; y++)
      for (let z = -rz; z <= rz; z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d <= 1.02 && d >= 0.55) block(Math.round(cx+x), Math.round(cy+y), Math.round(cz+z), id);
      }
}

// ---- clear intruding trees around the statue (not the whole site) ----
cube(-9, 0, -10, 9, 25, 15, AIR);

// ================================================================
// GRIFFIN  —  eagle front (head + wings + talons) facing NORTH (-Z),
// lion hindquarters + tail running back toward +Z (south).
// ================================================================

// ---- rocky pedestal ----
disk(0, -2, 6, 8, STONE);
disk(0, -1, 6, 7, COBBLE);
ell(0, 0, 6, 7, 1, 6, STONE);
block(-5,-1,2,COBBLE); block(6,-1,10,COBBLE); block(-4,-1,12,COBBLE); block(5,0,0,COBBLE);

// ---- LION HINDQUARTERS (tan/gold) ----
// big rounded rump toward the back (+Z)
ell(0, 8, 9, 5, 4, 5, SAND);
// mid torso
ell(0, 8, 4, 4, 4, 4, SAND);
// chest / eagle breast, higher & lifted at front
ell(0, 9, -1, 4, 4, 3, SNOW);      // white feathered breast
ell(0, 7, -1, 3, 2, 3, SAND);      // underside gold

// subtle fur/feather dappling on body
for (let z = 2; z <= 13; z++) {
  const w = z < 6 ? 3 : 4;
  if (z % 2 === 0) { block(-w, 9, z, PLANKS); block(w, 9, z, PLANKS); }
  if (z % 3 === 0) block(0, 11, z, PLANKS);
}

// ---- HIND LEGS (lion, powerful, folded) ----
function hindLeg(dir) {
  const hx = dir * 4;
  // haunch
  ell(hx, 7, 10, 3, 3, 3, SAND);
  // upper leg
  cube(hx - 1, 3, 9, hx + 1, 6, 11, PLANKS);
  // lower leg / paw
  cube(hx - 1, 0, 10, hx + 1, 3, 12, SAND);
  // paw + toes
  cube(hx - 1, 0, 9, hx + 1, 0, 13, PLANKS);
  block(hx - 1, 0, 13, SNOW); block(hx, 0, 13, SNOW); block(hx + 1, 0, 13, SNOW); // claws
}
hindLeg(-1); hindLeg(1);

// ---- FRONT LEGS (eagle talons, lighter) ----
function frontLeg(dir) {
  const fx = dir * 3;
  // feathered thigh
  ell(fx, 7, -1, 2, 3, 2, SNOW);
  // scaled shank
  cube(fx - 1, 2, -2, fx + 1, 6, 0, SAND);
  cube(fx - 1, 0, -2, fx, 2, -1, PLANKS);
  // talon foot spreading forward (-Z)
  block(fx, 0, -3, SAND); block(fx, 0, -4, SAND);
  // three front talons + one back
  block(fx - 1, 0, -4, STONE); block(fx, 0, -5, STONE); block(fx + 1, 0, -4, STONE);
  block(fx, 0, -2, STONE);
}
frontLeg(-1); frontLeg(1);

// ---- NECK (rises up & forward toward the head) ----
for (let i = 0; i <= 6; i++) {
  const ny = 10 + i;
  const nz = -1 - Math.round(i * 0.7);
  const r = 3 - Math.round(i * 0.25);
  ell(0, ny, nz, r, r, r, SNOW);
  if (i % 2 === 0) { block(-r, ny, nz, PLANKS); block(r, ny, nz, PLANKS); } // ruffled feathers
}

// ---- EAGLE HEAD (white) facing NORTH ----
const HX = 0, HY = 17, HZ = -6;
ell(HX, HY, HZ, 3, 3, 3, SNOW);
// brow ridge
cube(HX - 2, HY + 2, HZ - 2, HX + 2, HY + 2, HZ - 1, SNOW);

// crest feathers on top-back of head
block(HX, HY + 4, HZ + 1, SNOW); block(HX, HY + 4, HZ + 2, PLANKS);
block(HX - 1, HY + 3, HZ + 2, SNOW); block(HX + 1, HY + 3, HZ + 2, SNOW);

// eyes (facing north, angled slightly east for light) — gold ring + dark pupil
block(HX - 2, HY + 1, HZ - 3, SAND); block(HX - 2, HY + 1, HZ - 3, SAND);
block(HX - 2, HY + 1, HZ - 2, STONE);
block(HX + 2, HY + 1, HZ - 3, SAND);
block(HX + 2, HY + 1, HZ - 2, STONE);
// gold eyebrow feathers
block(HX - 2, HY + 2, HZ - 2, SAND); block(HX + 2, HY + 2, HZ - 2, SAND);

// ---- BEAK (golden, hooked, pointing NORTH -Z) ----
cube(HX - 1, HY, HZ - 4, HX + 1, HY + 1, HZ - 4, SAND);
cube(HX - 1, HY, HZ - 5, HX, HY + 1, HZ - 5, SAND);
block(HX, HY, HZ - 6, SAND);
block(HX, HY - 1, HZ - 5, SAND);   // hooked lower tip
block(HX, HY - 1, HZ - 4, PLANKS); // lower mandible
block(HX, HY + 2, HZ - 4, SAND);   // cere
// nostril accents
block(HX - 1, HY + 1, HZ - 4, PLANKS); block(HX + 1, HY + 1, HZ - 4, PLANKS);

// ---- WINGS (great spread wings, layered feathers) ----
function wing(dir) {
  const sx = dir * 4, sy = 12, sz = 2;   // shoulder
  const N = 13;
  for (let i = 0; i <= N; i++) {
    const ax = sx + dir * i;                 // sweep outward
    const ay = sy + Math.round(i * 0.55);    // arch upward
    const az = sz + Math.round(i * 0.25);    // sweep slightly back
    // leading-edge bone (armature)
    block(ax, ay, az, OAK_LOG);
    block(ax, ay, az - 1, OAK_LOG);
    // covert shoulder mass (golden) near body
    if (i < 5) { block(ax, ay + 1, az, SAND); block(ax, ay - 1, az, SAND); }
    // trailing primary feathers hang down & back
    const fl = 3 + Math.round(i * 0.9);
    for (let f = 1; f <= fl; f++) {
      const fy = ay - f;
      const fz = az + Math.round(f * 0.35);   // feathers trail toward +Z
      let id;
      if (f <= 2) id = SAND;                    // golden coverts
      else if (f >= fl - 1) id = PLANKS;        // pale feather tips
      else id = OAK_LOG;                        // brown flight feathers
      block(ax, fy, fz, id);
      // give the sheet a little thickness / texture
      if (i % 2 === 0 && f < fl) block(ax, fy, fz - 1, id);
      if (f % 3 === 0) block(ax, fy, fz + 1, PLANKS);
    }
  }
  // rounded shoulder joint
  ell(sx, sy, sz, 2, 2, 2, SAND);
}
wing(-1); wing(1);

// ---- LION TAIL (curls up & back at the rear +Z) ----
let tx = 0, ty = 9, tz = 13;
const tailPts = [[0,9,13],[0,10,15],[1,11,16],[2,13,17],[2,15,17],[1,16,16]];
for (let i = 0; i < tailPts.length - 1; i++) {
  const a = tailPts[i], b = tailPts[i + 1];
  line(a[0], a[1], a[2], b[0], b[1], b[2], PLANKS);
}
// tail tuft
ell(1, 17, 16, 2, 2, 2, OAK_LOG);
block(1, 18, 15, LEAVES); block(0, 18, 16, LEAVES); block(2, 18, 16, LEAVES);

// ---- final feather accents on breast ----
for (let y = 6; y <= 11; y++) {
  if (y % 2 === 0) { block(-2, y, -3, PLANKS); block(2, y, -3, PLANKS); }
  block(0, y, -4, SNOW);
}
// king-kong-4x-opus — prompt:
// King Kong...

const meta_ignore = null; // (no meta needed; this is sandbox build code)

const FUR = OAK_LOG;      // dark brown gorilla fur
const SHADE = DIRT;       // darker fur shading
const SKIN = STONE;       // gray face / muzzle / hands
const SILVER = COBBLE;    // silverback patch
const BUILD = STONE;      // art-deco tower
const WIN = GLASS;        // windows

// ---------- helpers ----------
function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -rx; x <= rx; x++)
    for (let y = -ry; y <= ry; y++)
      for (let z = -rz; z <= rz; z++) {
        if ((x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz) <= 1.02)
          block(cx + x, cy + y, cz + z, id);
      }
}
// capsule: spheres marched along a segment
function limb(x1, y1, z1, x2, y2, z2, r, id) {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x2-x1), Math.abs(y2-y1), Math.abs(z2-z1))) * 2);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    sphere(Math.round(x1 + (x2-x1)*t), Math.round(y1 + (y2-y1)*t), Math.round(z1 + (z2-z1)*t), r, id);
  }
}
function shellBox(x1, y1, z1, x2, y2, z2, id) {
  cube(x1, y1, z1, x2, y1, z2, id);
  cube(x1, y2, z1, x2, y2, z2, id);
  cube(x1, y1, z1, x1, y2, z2, id);
  cube(x2, y1, z1, x2, y2, z2, id);
  cube(x1, y1, z1, x2, y2, z1, id);
  cube(x1, y1, z2, x2, y2, z2, id);
}

// =========================================================
// ART-DECO TOWER (Empire State stand-in) — Kong stands atop
// =========================================================
// base tier
shellBox(-8, -8, -6, 8, -3, 6, BUILD);
// vertical pilasters + window strips
for (let x = -7; x <= 7; x += 2) {
  line(x, -8, -6, x, -3, -6, x % 4 === 0 ? BUILD : WIN);
  line(x, -8, 6, x, -3, 6, x % 4 === 0 ? BUILD : WIN);
}
for (let z = -5; z <= 5; z += 2) {
  line(-8, -8, z, -8, -3, z, z % 4 === 0 ? BUILD : WIN);
  line(8, -8, z, 8, -3, z, z % 4 === 0 ? BUILD : WIN);
}
// setback tier 2
shellBox(-6, -3, -5, 6, -1, 5, BUILD);
for (let x = -5; x <= 5; x += 2) { block(x, -2, -5, WIN); block(x, -2, 5, WIN); }
// setback tier 3 + top platform
shellBox(-5, -1, -4, 5, 0, 4, BUILD);
cube(-6, 1, -5, 6, 1, 5, SILVER);   // roof platform Kong stands on
cube(-5, 0, -4, 5, 0, 4, BUILD);
// corner spires (art-deco crown)
for (const [sx, sz] of [[-5,-4],[5,-4],[-5,4],[5,4]]) {
  line(sx, 1, sz, sx, 4, sz, BUILD);
  block(sx, 5, sz, WIN);
}
// central antenna mast behind Kong
line(0, 1, 4, 0, 7, 4, SKIN);
block(0, 8, 4, WIN);

// =========================================================
// KONG  (center x=0, front faces -Z)
// =========================================================
// ---- legs (thick, planted) ----
limb(-3, 2, -1, -3.5, 7, -2, 3, FUR);
limb(-3.5, 7, -2, -3, 12, 0, 3, FUR);
limb( 3, 2, -1,  3.5, 7, -2, 3, FUR);
limb( 3.5, 7, -2,  3, 12, 0, 3, FUR);
// feet
ellipsoid(-4, 2, -3, 3, 1, 4, SKIN);
ellipsoid( 4, 2, -3, 3, 1, 4, SKIN);
// toes
for (let i = -1; i <= 1; i++) { block(-4+i*2, 2, -6, SKIN); block(4+i*2, 2, -6, SKIN); }

// ---- pelvis / hips ----
ellipsoid(0, 12, 0, 5, 3, 4, FUR);

// ---- torso: barrel chest, broad at shoulders ----
ellipsoid(0, 17, 0, 6, 5, 4, FUR);
ellipsoid(0, 20, 0, 7, 3, 4, FUR);   // massive upper chest / traps
// belly shading
ellipsoid(0, 14, -3, 4, 2, 2, SHADE);
// silverback patch (signature gray back)
ellipsoid(0, 19, 4, 5, 4, 1, SILVER);

// ---- shoulders ----
sphere(-7, 20, 0, 4, FUR);
sphere( 7, 20, 0, 4, FUR);

// ---- RIGHT arm raised high, swatting ----
limb(7, 21, 0, 10, 26, -2, 3, FUR);      // upper arm
limb(10, 26, -2, 11, 31, -5, 3, FUR);    // forearm
sphere(11, 32, -6, 3, SKIN);             // fist
// knuckles
for (let i = -1; i <= 1; i++) block(11+i, 34, -7, SKIN);

// ---- LEFT arm down, knuckle-resting / reaching forward ----
limb(-7, 20, 0, -10, 14, -3, 3, FUR);    // upper arm
limb(-10, 14, -3, -8, 9, -6, 3, FUR);    // forearm down-forward
sphere(-8, 8, -7, 3, SKIN);              // knuckle-fist on ledge
for (let i = -1; i <= 1; i++) block(-8+i, 8, -9, SKIN);

// ---- neck ----
ellipsoid(0, 22, -1, 3, 2, 3, FUR);

// ---- head ----
ellipsoid(0, 25, -1, 4, 4, 4, FUR);
// sagittal crest (dome ridge on top)
ellipsoid(0, 29, -1, 2, 2, 2, FUR);
// heavy brow ridge
cube(-3, 26, -5, 3, 27, -4, FUR);
// face / muzzle (gray skin)
ellipsoid(0, 24, -4, 3, 3, 2, SKIN);
ellipsoid(0, 22, -5, 2, 2, 2, SKIN);   // protruding muzzle
// deep-set angry eyes
block(-2, 26, -5, BRICK);
block( 2, 26, -5, BRICK);
block(-2, 26, -6, BRICK);
block( 2, 26, -6, BRICK);
// nostrils
block(-1, 22, -7, SHADE);
block( 1, 22, -7, SHADE);
// bared teeth (roaring)
line(-2, 21, -6, 2, 21, -6, SNOW);
block(0, 20, -6, AIR); // open mouth gap
// ears
block(-4, 25, -1, SKIN);
block( 4, 25, -1, SKIN);

// ---- fur texture: scattered shading clumps ----
const clumps = [
  [-5,15,-3],[5,16,-2],[-6,18,1],[6,18,2],[-4,10,-2],[4,11,-2],
  [-8,19,-1],[8,19,0],[-2,17,-4],[3,13,-3],[-3,22,2],[3,22,2]
];
for (const [x,y,z] of clumps) sphere(x, y, z, 1, SHADE);

// =========================================================
// BIPLANES buzzing Kong
// =========================================================
function biplane(cx, cy, cz) {
  cube(cx-3, cy, cz, cx+3, cy, cz, SKIN);          // fuselage
  cube(cx-1, cy+1, cz-3, cx+1, cy+1, cz+3, PLANKS); // top wing
  cube(cx-1, cy-1, cz-3, cx+1, cy-1, cz+3, PLANKS); // bottom wing
  block(cx, cy, cz-2, OAK_LOG);                     // struts
  block(cx, cy, cz+2, OAK_LOG);
  block(cx-3, cy+1, cz, SKIN);                      // tail fin
  block(cx-3, cy, cz-1, SKIN);                      // tail plane
  block(cx-3, cy, cz+1, SKIN);
  block(cx+2, cy+1, cz, WIN);                       // cockpit
  block(cx+4, cy, cz, COBBLE);                      // prop hub
  block(cx+3, cy+1, cz, COBBLE);
  block(cx+3, cy-1, cz, COBBLE);
}
biplane(16, 29, -9);   // the one Kong is swatting at
biplane(-14, 24, 9);
biplane(13, 15, 13);

// =========================================================
// wispy clouds for depth (thin SNOW)
// =========================================================
function cloud(cx, cy, cz, r) {
  disk(cx, cy, cz, r, SNOW);
  disk(cx + r, cy, cz + 1, Math.max(1, r-1), SNOW);
  disk(cx - r, cy, cz - 1, Math.max(1, r-1), SNOW);
}
cloud(-18, 31, -14, 3);
cloud(19, 26, 16, 3);
cloud(-20, 22, 18, 2);
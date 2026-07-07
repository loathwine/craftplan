// yeti-4x-opus — prompt:
// a yeti...

const meta = null; // (ignored – this is a plain build script)

// ==== A YETI ====================================================
// Faces NORTH (-Z). Body depth runs back toward +Z.
// Palette: SNOW = shaggy white fur, ICE = cold highlights / claws /
// brow, STONE = dark eyes + roaring mouth cavity, GLASS = icy nose.

// ---- helpers ---------------------------------------------------
function ellip(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -rx; x <= rx; x++)
    for (let y = -ry; y <= ry; y++)
      for (let z = -rz; z <= rz; z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d <= 1.0) block(cx + x, cy + y, cz + z, id);
      }
}
function tuft(x, y, z, id) {           // shaggy fur clump
  block(x, y, z, id);
  block(x, y + 1, z, id);
  if ((x + z) % 2 === 0) block(x + 1, y, z, id);
  else block(x, y, z + 1, id);
}

// ---- snowy ground / foreground --------------------------------
disk(0, 0, 0, 12, SNOW);
disk(0, -1, 0, 9, SNOW);
// packed footprints in the snow behind (background hint)
cube(-9, -1, 8, -6, -1, 11, ICE);
cube(6, -1, 9, 9, -1, 12, ICE);
// a couple of ice crystals flanking (background/foreground sep.)
for (const [sx, sz, h] of [[-14, 4, 6], [15, 6, 7], [-12, 12, 4], [13, 13, 5]]) {
  for (let i = 0; i < h; i++) {
    const r = Math.max(0, 1 - Math.floor(i / 3));
    cube(sx - r, i, sz - r, sx + r, i, sz + r, ICE);
  }
  block(sx, h, sz, ICE);
}
// scattered rocks at the feet (foreground)
sphere(-10, 0, -6, 2, STONE);
sphere(11, 0, -4, 2, STONE);
sphere(3, 0, -9, 1, STONE);

// ---- LEGS (y 0-8) ---------------------------------------------
function leg(sx) {
  cube(sx - 2, 0, -2, sx + 2, 8, 3, SNOW);   // thick thigh/shin
  ellip(sx, 8, 1, 3, 3, 3, SNOW);            // knee/hip round
  // foot pushing forward (-Z)
  cube(sx - 3, 0, -6, sx + 3, 2, -1, SNOW);
  ellip(sx, 1, -5, 3, 1, 2, SNOW);
  // toe claws
  for (let t = -2; t <= 2; t += 2) block(sx + t, 0, -6, ICE);
}
leg(-5);
leg(5);
// inner-leg fur fill
cube(-3, 0, -1, 3, 6, 2, SNOW);

// ---- TORSO (y 6-20) big shaggy barrel --------------------------
ellip(0, 13, 1, 8, 7, 6, SNOW);   // belly/chest mass
ellip(0, 18, 1, 8, 3, 5, SNOW);   // upper chest / shoulder band
cube(-6, 7, -2, 6, 14, 4, SNOW);  // fill lower gap to legs
// chest fur streaks (ICE, catches light, angled toward +X/east)
for (let y = 9; y <= 17; y += 2) {
  block(-1, y, -6, ICE);
  block(2, y - 1, -6, ICE);
}
// belly shading dimple
ellip(0, 11, -6, 3, 3, 1, ICE);

// ---- ARMS (y 3-19) long, ape-like ------------------------------
function arm(sx) {                 // sx = ±1 (side)
  const X = sx * 9;
  ellip(X, 18, 1, 3, 3, 3, SNOW);              // shoulder
  cube(X - 2 - (sx > 0 ? 0 : 1), 4, -1,
       X + 2 - (sx > 0 ? 1 : 0), 18, 3, SNOW); // arm column
  ellip(X, 4, 1, 3, 3, 3, SNOW);               // big fist
  // knuckle claws pointing forward/down
  for (let t = -2; t <= 2; t += 2) {
    block(X + t, 2, -2, ICE);
    block(X + t, 1, -2, ICE);
  }
  // shaggy fur hanging off the arm
  for (let y = 7; y <= 16; y += 3) tuft(X + sx * 3, y, -1, SNOW);
}
arm(-1);
arm(1);

// ---- HEAD (y 19-29) --------------------------------------------
ellip(0, 24, 1, 5, 5, 5, SNOW);   // skull
ellip(0, 21, -1, 4, 3, 3, SNOW);  // heavy jaw/muzzle jutting forward
cube(-4, 19, -2, 4, 22, 2, SNOW); // neck/jaw connect to torso

// brow ridge (ICE) — heavy, shadows the eyes
cube(-4, 26, -6, 4, 27, -4, ICE);
cube(-5, 25, -5, 5, 26, -4, ICE);

// eye sockets carved dark, glowing ice-blue eyes
for (const ex of [-2, 2]) {
  cube(ex - 1, 24, -6, ex + 1, 25, -4, AIR);  // socket
  block(ex, 25, -5, STONE);                   // dark
  block(ex, 24, -5, GLASS);                   // icy eye
  block(ex, 24, -6, GLASS);
}
// nose
block(0, 24, -6, GLASS);
ellip(0, 23, -5, 1, 1, 1, SNOW);

// ---- ROARING MOUTH ---------------------------------------------
cube(-3, 20, -7, 3, 22, -3, AIR);          // carve open maw
cube(-3, 20, -3, 3, 22, -3, STONE);        // dark throat back wall
cube(-3, 20, -3, -3, 22, -4, STONE);       // side walls
cube(3, 20, -3, 3, 22, -4, STONE);
// upper teeth
for (let x = -3; x <= 3; x += 1) block(x, 22, -5, SNOW);
// lower teeth
for (let x = -3; x <= 3; x += 1) block(x, 20, -5, SNOW);
// fangs at the corners
block(-3, 21, -6, SNOW); block(-3, 22, -6, SNOW);
block(3, 21, -6, SNOW);  block(3, 22, -6, SNOW);
block(-2, 20, -6, SNOW); block(2, 20, -6, SNOW);

// ---- SHAGGY HEAD / SHOULDER FUR --------------------------------
const headTufts = [
  [-4, 28, 0], [-2, 29, 1], [0, 29, 2], [2, 29, 0], [4, 28, 1],
  [-5, 27, 3], [5, 27, 2], [-3, 28, 4], [3, 28, 4], [0, 30, 1],
];
for (const [x, y, z] of headTufts) tuft(x, y, z, SNOW);
// icy frost on a few tips
block(0, 31, 1, ICE);
block(-4, 29, 0, ICE);
block(4, 29, 1, ICE);

// shoulder / back shag
const backTufts = [
  [-8, 20, 4], [8, 20, 4], [-6, 21, 5], [6, 21, 5],
  [-3, 20, 6], [3, 20, 6], [0, 19, 6], [-9, 17, 4], [9, 17, 4],
];
for (const [x, y, z] of backTufts) tuft(x, y, z, SNOW);

// cheek fur framing the face
for (const cx of [-5, 5]) { tuft(cx, 22, -3, SNOW); tuft(cx, 23, -2, SNOW); }
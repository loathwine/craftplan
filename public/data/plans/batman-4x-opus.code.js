// batman-4x-opus — prompt:
// Batman...

// ===== BATMAN — The Dark Knight on a rooftop, silhouetted against a full moon =====
const BODY = STONE;   // dark grey suit
const CAPE = COBBLE;  // cape (distinct grey)
const GOLD = SAND;    // utility belt + emblem ring
const EYE  = SNOW;    // white cowl lenses + moon

// ---- clear intruding foliage in the figure's volume (AIR is free) ----
cube(-12, 0, -6, 12, 33, 3, AIR);

// ---- ROOFTOP LEDGE he stands on ----
cube(-11, -2, -6, 11, -1, 3, COBBLE);
// a couple of ledge blocks / vent for texture
cube(-11, 0, -6, -9, 1, -4, COBBLE);
cube(9, 0, -6, 11, 1, -4, COBBLE);

// ---- FULL MOON backdrop ----
(function () {
  const cx = 0, cy = 27, r = 6, z = -5;
  for (let yy = -r; yy <= r; yy++)
    for (let xx = -r; xx <= r; xx++)
      if (xx * xx + yy * yy <= r * r) block(cx + xx, cy + yy, z, EYE);
  // a few crater specks (dark)
  block(-2, 29, z, BODY); block(2, 25, z, BODY); block(-3, 24, z, BODY);
})();

// ---- CAPE: wide bat-wing drape with scalloped points ----
(function () {
  const zB = -3, zF = -2;
  for (let x = -11; x <= 11; x++) {
    let top = 21;
    if (Math.abs(x) >= 9) top = 17;
    else if (Math.abs(x) >= 6) top = 19;
    else if (Math.abs(x) <= 3) top = 23;           // rise behind neck
    const d = Math.abs(((x + 220) % 4) - 2);       // 0..2, point every 4
    const bottom = Math.round(d * 3);              // spiky bat scallops
    cube(x, bottom, zB, x, top, zF, CAPE);
  }
})();
// cape wrapping over the shoulders toward the front
cube(-9, 17, -1, -6, 21, 2, CAPE);
cube(6, 17, -1, 9, 21, 2, CAPE);

// ================= FIGURE =================

// ---- LEGS ----
cube(-4, 0, -1, -2, 10, 2, BODY);
cube(2, 0, -1, 4, 10, 2, BODY);
// bat boots (wider + forward toe fin)
cube(-5, 0, -2, -1, 3, 2, BODY);
cube(1, 0, -2, 5, 3, 2, BODY);
cube(-4, 0, 3, -2, 1, 3, BODY);
cube(2, 0, 3, 4, 1, 3, BODY);
// knee accents
cube(-4, 6, 3, -3, 7, 3, BODY);
cube(3, 6, 3, 4, 7, 3, BODY);

// ---- PELVIS + UTILITY BELT ----
cube(-4, 10, -1, 4, 12, 2, BODY);
cube(-5, 11, -2, 5, 12, 2, GOLD);          // belt band
block(0, 11, 3, GOLD); block(0, 12, 3, GOLD); // buckle
// pouches
cube(-5, 10, -2, -4, 11, -2, GOLD);
cube(4, 10, -2, 5, 11, -2, GOLD);
block(-3, 11, 3, GOLD); block(3, 11, 3, GOLD);

// ---- TORSO (V-taper: narrow waist -> broad chest) ----
const seg = [[12, 13, 3], [14, 15, 4], [16, 17, 5], [18, 20, 7]];
for (const s of seg) cube(-s[2], s[0], -1, s[2], s[1], 2, BODY);
// pectorals (protruding, above emblem)
cube(-5, 18, 3, -2, 19, 3, BODY);
cube(2, 18, 3, 5, 19, 3, BODY);
// trapezius toward neck
cube(-3, 20, -1, 3, 21, 2, BODY);

// ---- CHEST BAT EMBLEM (front face z=2, y14..17) ----
cube(-3, 14, 2, 3, 17, 2, GOLD);              // gold oval
block(-4, 15, 2, GOLD); block(-4, 16, 2, GOLD);
block(4, 15, 2, GOLD); block(4, 16, 2, GOLD);
// dark bat over the gold
cube(-1, 14, 2, 1, 17, 2, BODY);              // body
line(0, 17, 2, -4, 17, 2, BODY);             // upper wings
line(0, 17, 2, 4, 17, 2, BODY);
block(-3, 16, 2, BODY); block(3, 16, 2, BODY);
block(-2, 15, 2, BODY); block(2, 15, 2, BODY);
line(-1, 14, 2, -3, 14, 2, BODY);            // lower wing points
line(1, 14, 2, 3, 14, 2, BODY);

// ---- ARMS (muscular, hanging at sides) ----
cube(-9, 8, -1, -7, 20, 2, BODY);   // left arm
cube(7, 8, -1, 9, 20, 2, BODY);     // right arm
// shoulder caps
cube(-9, 19, -1, -6, 21, 2, BODY);
cube(6, 19, -1, 9, 21, 2, BODY);
// gauntlet fin blades (outer forearm)
for (let i = 0; i < 3; i++) {
  cube(-11, 9 + i, -1, -10, 9 + i, 0, BODY);
  cube(10, 9 + i, -1, 11, 9 + i, 0, BODY);
}
// fists / gloves
cube(-9, 6, -1, -7, 8, 2, BODY);
cube(7, 6, -1, 9, 8, 2, BODY);

// ---- NECK ----
cube(-2, 20, -1, 2, 21, 2, BODY);

// ---- HEAD / COWL ----
cube(-3, 21, -2, 3, 27, 2, BODY);
cube(-2, 21, 3, 2, 22, 3, BODY);              // jaw / chin forward
cube(-3, 25, 3, 3, 26, 3, BODY);              // angry brow ridge
// white lenses (slanted, menacing)
block(-2, 24, 2, EYE); block(-1, 23, 2, EYE);
block(2, 24, 2, EYE); block(1, 23, 2, EYE);
// grim mouth line
block(-1, 21, 3, AIR); block(0, 21, 3, AIR); block(1, 21, 3, AIR);

// ---- BAT EARS (tall, leaning outward, silhouetted on the moon) ----
cube(-3, 27, -1, -2, 29, 2, BODY);
cube(-4, 30, 0, -3, 31, 1, BODY);
block(-4, 32, 0, BODY);
cube(2, 27, -1, 3, 29, 2, BODY);
cube(3, 30, 0, 4, 31, 1, BODY);
block(4, 32, 0, BODY);
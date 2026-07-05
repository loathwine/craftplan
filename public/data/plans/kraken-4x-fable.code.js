// kraken-4x-fable — recovered: prose preamble stripped
// --- extracted code ---

// KRAKEN — massive cephalopod erupting from a lagoon, 9 serpentine tentacles,
// two raised high; one crushing a wrecked sailing ship. BRICK flesh, OAK_LOG
// warts/brows, SNOW foam + suckers, GLASS sea.

const TAU = Math.PI * 2;
function cl(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ---- clear vegetation over the lagoon (AIR is free) ----
for (let y = 1; y <= 9; y++) disk(0, y, 1, 16, AIR);
cube(14, 1, -14, 19, 9, -6, AIR); // tree over the shipwreck bow

// ---- sea surface ----
disk(0, 0, 1, 15, GLASS);

// ---- foam ring around the emerging body ----
for (let i = 0; i < 36; i++) {
  const a = (i / 36) * TAU;
  block(Math.round(Math.cos(a) * 6.5), 0, Math.round(Math.sin(a) * 6.5 + 1), SNOW);
}
// scattered wave crests
const crests = [0.5, 1.4, 2.6, 3.5, 4.4, 5.6];
for (const a of crests) {
  const x = Math.cos(a) * 12, z = Math.sin(a) * 12 + 1;
  line(Math.round(x - Math.sin(a) * 2), 0, Math.round(z + Math.cos(a) * 2),
       Math.round(x + Math.sin(a) * 2), 0, Math.round(z - Math.cos(a) * 2), SNOW);
}

// ---- mantle (tall bulbous body, tip flopping back) ----
disk(0, 1, 1, 5, BRICK);            // skirt where tentacles root
sphere(0, 4, 1, 4, BRICK);
sphere(0, 8, 1, 5, BRICK);
sphere(0, 12, 1, 5, BRICK);
sphere(0, 15, 1, 4, BRICK);
sphere(0, 18, 1, 3, BRICK);
sphere(0, 20, 1, 2, BRICK);
sphere(0, 22, 2, 2, BRICK);         // tip curls backward
sphere(0, 24, 3, 1, BRICK);
block(0, 25, 4, BRICK);

// warts / mottling on the mantle surface
sphere(4, 8, 5, 1, OAK_LOG);
sphere(-5, 9, 3, 1, OAK_LOG);
sphere(5, 12, 2, 1, OAK_LOG);
sphere(-5, 13, 1, 1, OAK_LOG);
sphere(0, 15, 5, 1, OAK_LOG);
sphere(3, 17, 3, 1, OAK_LOG);
sphere(-4, 16, 2, 1, OAK_LOG);

// ---- head bulge, eyes, brows, beak (front faces -Z) ----
sphere(0, 6, -3, 4, BRICK);
cube(1, 5, -5, 5, 9, -5, BRICK);    // eye sockets
cube(-5, 5, -5, -1, 9, -5, BRICK);
cube(2, 6, -6, 4, 8, -6, SNOW);     // right eye
block(3, 7, -7, STONE);
cube(-4, 6, -6, -2, 8, -6, SNOW);   // left eye
block(-3, 7, -7, STONE);
line(0, 11, -5, 5, 9, -5, OAK_LOG); // angry V brows
line(-5, 9, -5, 0, 11, -5, OAK_LOG);
cube(-1, 3, -6, 1, 4, -6, STONE);   // beak
block(0, 3, -7, STONE);
block(0, 2, -6, STONE);

// ---- tentacles: root at mantle, dive under, resurface, tip rises ----
function tent(ang, len, tipY, wig, phase, fat) {
  const steps = 22;
  let py = null;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ang + wig * Math.sin(t * 3.2 + phase);
    const d = 4 + t * len;
    const lift = t > 0.55 ? Math.pow((t - 0.55) / 0.45, 2) * tipY : 0;
    const y = Math.round(2 - 2.6 * Math.sin(Math.min(t * 1.8, 1) * Math.PI) + lift);
    const x = cl(Math.round(Math.cos(a) * d), -21, 21);
    const z = cl(Math.round(Math.sin(a) * d + 1), -21, 21);
    const r = t < (fat ? 0.5 : 0.35) ? 2 : 1;
    sphere(x, cl(y, -3, 32), z, r, BRICK);
    if (i % 3 === 1 && t > 0.2) block(x, cl(y, -3, 32) + r, z, SNOW); // suckers
    if (py !== null && ((py <= 0) !== (y <= 0))) {                   // splash foam
      block(x + 2, 0, z, SNOW); block(x - 2, 0, z, SNOW);
      block(x, 0, z + 2, SNOW); block(x, 0, z - 2, SNOW);
      block(x + 1, 0, z + 1, SNOW); block(x - 1, 0, z - 1, SNOW);
    }
    py = y;
  }
}
tent(-0.72, 11, 2, 0.10, 0.0, true);   // reaches the ship
tent(-1.35, 12, 14, 0.15, 1.3, true);  // front, raised high
tent(-1.95, 12, 12, 0.18, 2.1, true);  // front, raised high
tent(-2.55, 13, 6, 0.12, 0.7, false);
tent(3.05, 14, 4, 0.15, 2.8, false);
tent(2.35, 12, 9, 0.20, 1.0, false);
tent(1.60, 13, 5, 0.14, 3.5, false);   // sprawls onto the far shore
tent(0.85, 12, 8, 0.17, 1.9, false);
tent(0.10, 14, 5, 0.12, 2.5, false);

// ---- wrecked sailing ship, half aground ----
cube(9, -1, -12, 15, 0, -8, PLANKS);     // hull + deck
cube(9, 1, -12, 15, 2, -12, PLANKS);     // port wall
cube(9, 1, -8, 15, 2, -8, PLANKS);       // starboard wall
cube(9, 1, -11, 9, 2, -9, PLANKS);       // stern
cube(16, 0, -11, 16, 1, -9, PLANKS);     // bow
block(17, 1, -10, OAK_LOG);              // bowsprit
cube(10, 1, -11, 15, 2, -9, AIR);        // open deck
disk(15, 0, -10, 3, GLASS);              // water lapping the bow
line(12, 1, -10, 12, 7, -10, OAK_LOG);   // mast
line(12, 7, -10, 15, 4, -11, OAK_LOG);   // snapped spar
line(12, 6, -12, 12, 6, -8, OAK_LOG);    // yard
cube(12, 3, -12, 12, 6, -8, SNOW);       // sail
block(12, 4, -9, AIR);                   // torn holes
block(12, 3, -11, AIR);
block(12, 5, -8, AIR);

// tentacle draped over the hull, crushing it
sphere(11, 3, -9, 1, BRICK);
sphere(12, 2, -10, 1, BRICK);
sphere(13, 1, -10, 1, BRICK);
block(14, 1, -10, BRICK);
block(14, 0, -11, BRICK);
block(10, 0, -7, SNOW);                  // impact splashes
block(16, 0, -8, SNOW);
block(8, 0, -10, SNOW);

// ---- shore rocks for depth ----
sphere(-16, 0, -9, 2, STONE);
sphere(-15, 2, -8, 1, COBBLE);
sphere(15, 0, 11, 2, STONE);
sphere(16, 1, 12, 1, COBBLE);

// --- raw stdout ---
/*
Marathon kraken prompt — outputting the build code only, as the pipeline expects.

// KRAKEN — massive cephalopod erupting from a lagoon, 9 serpentine tentacles,
// two raised high; one crushing a wrecked sailing ship. BRICK flesh, OAK_LOG
// warts/brows, SNOW foam + suckers, GLASS sea.

const TAU = Math.PI * 2;
function cl(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ---- clear vegetation over the lagoon (AIR is free) ----
for (let y = 1; y <= 9; y++) disk(0, y, 1, 16, AIR);
cube(14, 1, -14, 19, 9, -6, AIR); // tree over the shipwreck bow

// ---- sea surface ----
disk(0, 0, 1, 15, GLASS);

// ---- foam ring around the emerging body ----
for (let i = 0; i < 36; i++) {
  const a = (i / 36) * TAU;
  block(Math.round(Math.cos(a) * 6.5), 0, Math.round(Math.sin(a) * 6.5 + 1), SNOW);
}
// scattered wave crests
const crests = [0.5, 1.4, 2.6, 3.5, 4.4, 5.6];
for (const a of crests) {
  const x = Math.cos(a) * 12, z = Math.sin(a) * 12 + 1;
  line(Math.round(x - Math.sin(a) * 2), 0, Math.round(z + Math.cos(a) * 2),
       Math.round(x + Math.sin(a) * 2), 0, Math.round(z - Math.cos(a) * 2), SNOW);
}

// ---- mantle (tall bulbous body, tip flopping back) ----
disk(0, 1, 1, 5, BRICK);            // skirt where tentacles root
sphere(0, 4, 1, 4, BRICK);
sphere(0, 8, 1, 5, BRICK);
sphere(0, 12, 1, 5, BRICK);
sphere(0, 15, 1, 4, BRICK);
sphere(0, 18, 1, 3, BRICK);
sphere(0, 20, 1, 2, BRICK);
sphere(0, 22, 2, 2, BRICK);         // tip curls backward
sphere(0, 24, 3, 1, BRICK);
block(0, 25, 4, BRICK);

// warts / mottling on the mantle surface
sphere(4, 8, 5, 1, OAK_LOG);
sphere(-5, 9, 3, 1, OAK_LOG);
sphere(5, 12, 2, 1, OAK_LOG);
sphere(-5, 13, 1, 1, OAK_LOG);
sphere(0, 15, 5, 1, OAK_LOG);
sphere(3, 17, 3, 1, OAK_LOG);
sphere(-4, 16, 2, 1, OAK_LOG);

// ---- head bulge, eyes, brows, beak (front faces -Z) ----
sphere(0, 6, -3, 4, BRICK);
cube(1, 5, -5, 5, 9, -5, BRICK);    // eye sockets
cube(-5, 5, -5, -1, 9, -5, BRICK);
cube(2, 6, -6, 4, 8, -6, SNOW);     // right eye
block(3, 7, -7, STONE);
cube(-4, 6, -6, -2, 8, -6, SNOW);   // left eye
block(-3, 7, -7, STONE);
line(0, 11, -5, 5, 9, -5, OAK_LOG); // angry V brows
line(-5, 9, -5, 0, 11, -5, OAK_LOG);
cube(-1, 3, -6, 1, 4, -6, STONE);   // beak
block(0, 3, -7, STONE);
block(0, 2, -6, STONE);

// ---- tentacles: root at mantle, dive under, resurface, tip rises ----
function tent(ang, len, tipY, wig, phase, fat) {
  const steps = 22;
  let py = null;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ang + wig * Math.sin(t * 3.2 + phase);
    const d = 4 + t * len;
    const lift = t > 0.55 ? Math.pow((t - 0.55) / 0.45, 2) * tipY : 0;
    const y = Math.round(2 - 2.6 * Math.sin(Math.min(t * 1.8, 1) * Math.PI) + lift);
    const x = cl(Math.round(Math.cos(a) * d), -21, 21);
    const z = cl(Math.round(Math.sin(a) * d + 1), -21, 21);
    const r = t < (fat ? 0.5 : 0.35) ? 2 : 1;
    sphere(x, cl(y, -3, 32), z, r, BRICK);
    if (i % 3 === 1 && t > 0.2) block(x, cl(y, -3, 32) + r, z, SNOW); // suckers
    if (py !== null && ((py <= 0) !== (y <= 0))) {                   // splash foam
      block(x + 2, 0, z, SNOW); block(x - 2, 0, z, SNOW);
      block(x, 0, z + 2, SNOW); block(x, 0, z - 2, SNOW);
      block(x + 1, 0, z + 1, SNOW); block(x - 1, 0, z - 1, SNOW);
    }
    py = y;
  }
}
tent(-0.72, 11, 2, 0.10, 0.0, true);   // reaches the ship
tent(-1.35, 12, 14, 0.15, 1.3, true);  // front, raised high
tent(-1.95, 12, 12, 0.18, 2.1, true);  // front, raised high
tent(-2.55, 13, 6, 0.12, 0.7, false);
tent(3.05, 14, 4, 0.15, 2.8, false);
tent(2.35, 12, 9, 0.20, 1.0, false);
tent(1.60, 13, 5, 0.14, 3.5, false);   // sprawls onto the far shore
tent(0.85, 12, 8, 0.17, 1.9, false);
tent(0.10, 14, 5, 0.12, 2.5, false);

// ---- wrecked sailing ship, half aground ----
cube(9, -1, -12, 15, 0, -8, PLANKS);     // hull + deck
cube(9, 1, -12, 15, 2, -12, PLANKS);     // port wall
cube(9, 1, -8, 15, 2, -8, PLANKS);       // starboard wall
cube(9, 1, -11, 9, 2, -9, PLANKS);       // stern
cube(16, 0, -11, 16, 1, -9, PLANKS);     // bow
block(17, 1, -10, OAK_LOG);              // bowsprit
cube(10, 1, -11, 15, 2, -9, AIR);        // open deck
disk(15, 0, -10, 3, GLASS);              // water lapping the bow
line(12, 1, -10, 12, 7, -10, OAK_LOG);   // mast
line(12, 7, -10, 15, 4, -11, OAK_LOG);   // snapped spar
line(12, 6, -12, 12, 6, -8, OAK_LOG);    // yard
cube(12, 3, -12, 12, 6, -8, SNOW);       // sail
block(12, 4, -9, AIR);                   // torn holes
block(12, 3, -11, AIR);
block(12, 5, -8, AIR);

// tentacle draped over the hull, crushing it
sphere(11, 3, -9, 1, BRICK);
sphere(12, 2, -10, 1, BRICK);
sphere(13, 1, -10, 1, BRICK);
block(14, 1, -10, BRICK);
block(14, 0, -11, BRICK);
block(10, 0, -7, SNOW);                  // impact splashes
block(16, 0, -8, SNOW);
block(8, 0, -10, SNOW);

// ---- shore rocks for depth ----
sphere(-16, 0, -9, 2, STONE);
sphere(-15, 2, -8, 1, COBBLE);
sphere(15, 0, 11, 2, STONE);
sphere(16, 1, 12, 1, COBBLE);
*/

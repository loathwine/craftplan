// x-wing-4x-fable — prompt:
// an X-wing starfighter...

// X-WING STARFIGHTER — Red Five, S-foils locked in attack position
// Nose toward -Z (camera/north), engines +Z. Centerline y=15.
// TIE fighter pursuer behind-above (SE), laser fire both ways, ground crater.

const CL = 15; // fuselage centerline height

// ---------- FUSELAGE ----------
// rear engine housing block
cube(-2, 13, 4, 2, 17, 14, SNOW);
// mid / cockpit section
cube(-2, 13, -2, 2, 16, 3, SNOW);
// forward fuselage
cube(-2, 13, -9, 2, 15, -3, SNOW);
cube(-1, 16, -9, 1, 16, -3, SNOW); // top ridge
// long tapering nose
cube(-1, 13, -15, 1, 15, -10, SNOW);
cube(-1, 13, -12, 1, 15, -11, BRICK); // red squadron stripe
cube(-1, 14, -19, 1, 15, -16, SNOW);
cube(0, 14, -21, 0, 15, -20, SNOW);
block(0, 14, -22, STONE); // sensor tip

// cockpit canopy
cube(-1, 17, -2, 1, 17, 1, GLASS);
cube(-1, 17, 2, 1, 17, 2, STONE);          // rear frame
cube(-1, 16, -4, 1, 16, -3, GLASS);        // windshield slope
cube(2, 16, -2, 2, 16, 1, GLASS);          // side glazing
cube(-2, 16, -2, -2, 16, 1, GLASS);

// astromech droid (R2 unit) behind canopy
sphere(0, 18, 5, 1, ICE);
block(0, 18, 5, ICE);

// dorsal spine + antenna
line(0, 17, 6, 0, 17, 14, COBBLE);
block(0, 18, 13, STONE);
block(0, 19, 13, STONE);

// side vents on rear housing
for (let z = 5; z <= 13; z += 2) {
  cube(2, 14, z, 2, 16, z, STONE);
  cube(-2, 14, z, -2, 16, z, STONE);
}

// underbelly pods (gear housings)
cube(-1, 12, -2, 1, 12, 3, COBBLE);
cube(-1, 12, 8, 1, 12, 12, COBBLE);
// torpedo tubes under nose
block(1, 13, -10, COBBLE);
block(-1, 13, -10, COBBLE);

// ---------- WINGS (4, X configuration) ----------
// span x=3..20 each side, chord z=6..13, opening 0.3 blocks per step
const tips = []; // {x, y} of the 4 wing tips
for (const sx of [1, -1]) {
  for (const sy of [1, -1]) {
    let tipY = CL;
    for (let i = 0; i <= 17; i++) {
      const x = (3 + i) * sx;
      const off = Math.round(1 + i * 0.3);
      const y = CL + sy * off;
      tipY = y;
      const id = (i === 5 || i === 6 || i === 12 || i === 13) ? BRICK : SNOW;
      cube(x, y, 6, x, y, 13, id);
      block(x, y, 6, STONE); // gray leading edge
      if (i <= 8) cube(x, y - sy, 7, x, y - sy, 12, SNOW); // thicker inboard
    }
    tips.push({ x: 20 * sx, y: tipY, sy: sy, sx: sx });
    // S-foil hinge machinery at root
    cube(3 * sx, 14, 8, 3 * sx, 16, 11, COBBLE);
  }
}

// wing tip caps (red)
for (const t of tips) cube(t.x, t.y - 1, 6, t.x, t.y + 1, 13, BRICK);

// ---------- ENGINES (4, at wing roots) ----------
function engine(cx, cy) {
  for (let z = 5; z <= 15; z++) {
    const id = z === 5 ? COBBLE : (z === 15 ? BRICK : SNOW);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        block(cx + dx, cy + dy, z, id);
  }
  line(cx, cy + 1, 6, cx, cy + 1, 14, STONE); // top stripe
  block(cx, cy, 4, STONE);                    // intake core
  line(cx, cy, 16, cx, cy, 18, ICE);          // exhaust glow
  block(cx, cy, 19, GLASS);
}
engine(5, 17); engine(-5, 17);
engine(5, 13); engine(-5, 13);

// ---------- LASER CANNONS (wingtips, x=±21) ----------
for (const t of tips) {
  const cx = 21 * t.sx;
  line(cx, t.y, -6, cx, t.y, 13, STONE);
  block(cx, t.y, -7, BRICK);   // emitter tip
  block(cx, t.y, 13, COBBLE);  // rear capacitor
}

// ---------- RED LASER BOLTS (converging fire toward -Z) ----------
for (const s of [1, -1]) {
  // upper pair
  line(20 * s, 21, -10, 18 * s, 21, -14, BRICK);
  line(17 * s, 20, -18, 15 * s, 20, -22, BRICK);
  // lower pair
  line(20 * s, 9, -10, 18 * s, 10, -14, BRICK);
  line(17 * s, 10, -18, 15 * s, 11, -22, BRICK);
}

// ---------- TIE FIGHTER PURSUER (behind, high, east) ----------
const tx = 12, ty = 26, tz = 17;
sphere(tx, ty, tz, 2, STONE);
block(tx, ty, tz - 2, GLASS); // cockpit window
// pylons
line(tx - 4, ty, tz, tx - 2, ty, tz, COBBLE);
line(tx + 2, ty, tz, tx + 4, ty, tz, COBBLE);
// solar panels with cobble frames
for (const px of [tx - 4, tx + 4]) {
  cube(px, 21, 14, px, 30, 20, STONE);
  cube(px, 21, 14, px, 30, 14, COBBLE);
  cube(px, 21, 20, px, 30, 20, COBBLE);
  cube(px, 30, 14, px, 30, 20, COBBLE);
  cube(px, 21, 14, px, 21, 20, COBBLE);
}
// green return fire — near misses past the hull
line(11, 24, 14, 10, 23, 10, LEAVES);
line(13, 25, 13, 12, 24, 9, LEAVES);
line(9, 22, 6, 8, 21, 2, LEAVES);

// ---------- GROUND: crater from a stray TIE bolt ----------
sphere(-11, -2, -3, 3, AIR); // carve the bowl
for (let a = 0; a < 16; a++) {
  const rx = -11 + Math.round(3.5 * Math.cos(a * Math.PI / 8));
  const rz = -3 + Math.round(3.5 * Math.sin(a * Math.PI / 8));
  block(rx, 0, rz, COBBLE); // raised rim
}
disk(-11, -4, -3, 1, BRICK); // glowing embers in the pit
block(-11, -5, -3, BRICK);
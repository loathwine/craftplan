// zeus-sonnet — prompt:
// Zeus throwing a lightning bolt...

// ===== Zeus Throwing a Lightning Bolt =====
// Facing north (-Z). Statue center X=0, sagittal center Z=2.

function taper(yStart, yEnd, cz, rStart, rEnd, id) {
  const n = yEnd - yStart;
  for (let y = yStart; y <= yEnd; y++) {
    const t = n === 0 ? 0 : (y - yStart) / n;
    const r = Math.max(1, Math.round(rStart + (rEnd - rStart) * t));
    cylinder(0, y, cz, r, 1, id);
  }
}

function thick(x1, y1, z1, x2, y2, z2, id, t) {
  t = t || 1;
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const x = Math.round(x1 + (x2 - x1) * f);
    const y = Math.round(y1 + (y2 - y1) * f);
    const z = Math.round(z1 + (z2 - z1) * f);
    cube(x - t, y - t, z - t, x + t, y + t, z + t, id);
  }
}

// ---------- Clear canopy/leaf clutter above build footprint ----------
cube(-11, 1, -8, 12, 28, 12, AIR);

// ---------- Plinth (stepped circular platform) ----------
cylinder(0, -2, 2, 7, 2, STONE);        // drum, y=-2..-1
cylinder(0, 0, 2, 6, 1, MARBLE);        // slab, y=0
hollowCylinder(0, 0, 2, 6, 1, GOLD);    // gold trim ring
cylinder(0, 1, 2, 5, 1, MARBLE);        // step, y=1
hollowCylinder(0, 1, 2, 5, 1, LIGHT_GRAY);

// ---------- Flanking Greek columns ----------
function column(cx, cz) {
  cylinder(cx, 0, cz, 2, 1, MARBLE);          // base
  hollowCylinder(cx, 1, cz, 1, 9, MARBLE);    // shaft (hollow shell, cheap + looks fluted)
  cylinder(cx, 1, cz, 1, 9, LIGHT_GRAY);      // fill core lightly for solidity read
  cylinder(cx, 10, cz, 2, 1, MARBLE);         // capital
  cylinder(cx, 11, cz, 2, 1, GOLD);           // gold crown
}
column(-9, 2);
column(9, 2);

// ---------- Feet / sandals ----------
cube(-3, 2, 1, -1, 2, 3, BROWN);
cube(1, 2, 1, 3, 2, 3, BROWN);
line(-3, 2, 3, -1, 2, 3, GOLD);
line(1, 2, 3, 3, 2, 3, GOLD);
line(-2, 2, 0, -2, 2, 3, GOLD);
line(2, 2, 0, 2, 2, 3, GOLD);

// ---------- Robe (tapered toga, waist to feet) ----------
taper(3, 10, 2, 4, 2, WHITE);
// hem trim
hollowCylinder(0, 3, 2, 4, 1, GOLD);
// fold shading (vertical accent lines for drapery)
for (let a = 0; a < 8; a++) {
  const ang = (a / 8) * Math.PI * 2;
  const dx = Math.round(Math.cos(ang) * 3);
  const dz = 2 + Math.round(Math.sin(ang) * 3);
  line(dx, 4, dz, Math.round(dx * 0.6), 9, 2 + Math.round((dz - 2) * 0.6), LIGHT_GRAY);
}

// waist sash
hollowCylinder(0, 10, 2, 2, 1, PURPLE);
hollowCylinder(0, 10, 2, 2, 1, GOLD); // gold buckle overlay at front only would need custom; leave ring gold-purple blend look
block(0, 10, 0, GOLD);

// ---------- Torso (bare chest, muscular) ----------
taper(11, 15, 2, 2, 3, BROWN);
// ab/pec shading lines
line(-1, 12, 0, -1, 14, 0, BROWN);
line(1, 12, 0, 1, 14, 0, BROWN);
line(-2, 13, 1, 2, 13, 1, LIGHT_GRAY);

// draped sash over left shoulder to hip
thick(-2, 15, 1, -3, 11, 2, PURPLE, 1);
line(-2, 15, 1, -3, 11, 2, GOLD);

// ---------- Neck & shoulders ----------
cylinder(0, 16, 2, 1, 1, BROWN);
cylinder(0, 17, 2, 3, 1, BROWN);

// ---------- Left arm (bent, resting, holding cloak) ----------
thick(-3, 17, 2, -4, 14, 1, BROWN, 1);
thick(-4, 14, 1, -3, 11, 2, BROWN, 1);
cube(-4, 10, 1, -3, 11, 3, BROWN); // hand

// ---------- Right arm (raised, throwing pose) ----------
thick(3, 17, 2, 5, 19, 0, BROWN, 1);
thick(5, 19, 0, 7, 22, -3, BROWN, 1);
cube(6, 22, -4, 8, 23, -2, BROWN); // fist gripping bolt

// ---------- Head ----------
// beard (front-lower face mass)
sphere(0, 18, 0, 2, WHITE);
cube(-2, 16, -1, 2, 18, 1, WHITE);
// head
sphere(0, 19, 1, 2, BROWN);
// hair (back/top)
sphere(0, 20, 2, 2, GRAY);
cube(-2, 19, 2, 2, 21, 3, GRAY);
// eyes
block(-1, 19, -1, NEON_BLUE);
block(1, 19, -1, NEON_BLUE);
// brow
line(-2, 20, -1, 2, 20, -1, GRAY);
// laurel wreath
hollowCylinder(0, 21, 1, 2, 1, GOLD);
sphere(0, 22, 1, 1, GOLD);

// ---------- Storm cloud swirling around raised hand ----------
sphere(8, 23, -4, 2, LIGHT_GRAY);
sphere(6, 24, -6, 2, WHITE);
sphere(10, 22, -6, 1, LIGHT_GRAY);
sphere(9, 25, -3, 1, WHITE);

// ---------- Lightning bolt (zigzag, hand -> sky) ----------
line(7, 23, -3, 9, 25, -5, IRON);
line(9, 25, -5, 7, 27, -6, IRON);
line(7, 27, -6, 10, 29, -8, IRON);
line(8, 24, -4, 10, 26, -6, NEON_BLUE);
line(10, 26, -6, 8, 28, -7, NEON_BLUE);
// crackle bursts (sparse, per instructions)
block(9, 25, -5, ELECTRIC);
block(7, 27, -6, ELECTRIC);
block(10, 29, -8, ELECTRIC);
block(9, 28, -7, ELECTRIC);

// ---------- Eagle companion at Zeus's feet ----------
cube(-7, 2, 3, -6, 3, 5, GRAY);       // body
cube(-7, 4, 4, -6, 4, 4, GRAY);       // head
block(-8, 4, 4, GOLD);                // beak
cube(-8, 3, 3, -7, 3, 6, IRON);       // left wing (flat, spread)
cube(-6, 3, 3, -5, 3, 6, IRON);       // right wing
block(-7, 4, 3, NEON_BLUE);           // eye glint
block(-6, 4, 3, NEON_BLUE);

// ---------- Ground scorch mark (a prior strike) ----------
disk(10, 0, 9, 2, OBSIDIAN);
hollowCylinder(10, 0, 9, 2, 1, BLACK);
block(10, 1, 9, ELECTRIC);
block(9, 1, 8, ELECTRIC);
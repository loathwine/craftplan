// trebuchet-4x-opus — prompt:
// a medieval trebuchet...

const _ = "medieval trebuchet";

// ---------- helpers ----------
function beamXY(px, py, pz, angDeg, tStart, tEnd, id, rPerp, rZ) {
  // straight beam in the X-Y plane (fixed-ish Z), thick cross-section
  const rad = angDeg * Math.PI / 180;
  const ux = Math.cos(rad), uy = Math.sin(rad);
  const nx = -uy, ny = ux; // perpendicular in XY
  for (let t = tStart; t <= tEnd; t += 0.5) {
    const cx = px + ux * t, cy = py + uy * t;
    // iron band every ~5 units
    const band = (Math.round(t) % 5 === 0 && t > tStart + 1 && t < tEnd - 1);
    const mat = band ? COBBLE : id;
    for (let a = -rPerp; a <= rPerp; a++) {
      for (let z = -rZ; z <= rZ; z++) {
        block(Math.round(cx + nx * a), Math.round(cy + ny * a), pz + z, mat);
      }
    }
  }
}

function legBeam(x1, y1, x2, y2, z, id, depth) {
  for (let dz = 0; dz < depth; dz++) {
    line(x1, y1, z + dz, x2, y2, z + dz, id);
    line(x1 + 1, y1, z + dz, x2 + 1, y2, z + dz, id);
    line(x1, y1 + 1, z + dz, x2, y2 + 1, z + dz, id);
  }
}

function wheel(cx, cy, z0, z1, r, rim, hub) {
  for (let a = 0; a < 360; a += 6) {
    const rad = a * Math.PI / 180;
    for (let zz = z0; zz <= z1; zz++) {
      block(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r), zz, rim);
      block(Math.round(cx + Math.cos(rad) * (r - 1)), Math.round(cy + Math.sin(rad) * (r - 1)), zz, rim);
    }
  }
  for (let a = 0; a < 360; a += 45) {
    const rad = a * Math.PI / 180;
    line(cx, cy, z0, Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r), z0, OAK_LOG);
  }
  cube(cx - 1, cy - 1, z0, cx + 1, cy + 1, z1, hub);
}

// ---------- clear vegetation in footprint ----------
cube(-11, 1, -6, 15, 31, 7, AIR);

// ---------- foundation & base cart ----------
cube(-9, -3, -4, 9, -1, 4, DIRT);           // buried footing
cube(-9, 0, -4, 9, 0, 4, PLANKS);           // deck
// deck plank seams
for (let x = -8; x <= 8; x += 3) cube(x, 0, -4, x, 0, 4, OAK_LOG);
// perimeter rails (oak)
cube(-9, 1, -4, 9, 1, -4, OAK_LOG);
cube(-9, 1, 4, 9, 1, 4, OAK_LOG);
cube(-9, 1, -4, -9, 1, 4, OAK_LOG);
cube(9, 1, -4, 9, 1, 4, OAK_LOG);
// corner posts
[[-9, -4], [9, -4], [-9, 4], [9, 4]].forEach(([x, z]) => cube(x, 0, z, x, 2, z, OAK_LOG));

// wheels (4)
wheel(-6, 1, -5, -4, 2, OAK_LOG, COBBLE);
wheel(6, 1, -5, -4, 2, OAK_LOG, COBBLE);
wheel(-6, 1, 4, 5, 2, OAK_LOG, COBBLE);
wheel(6, 1, 4, 5, 2, OAK_LOG, COBBLE);

// ---------- A-frame supports (front z=-4..-3, back z=3..4) ----------
function aFrame(z) {
  legBeam(-6, 1, 0, 13, z, OAK_LOG, 2);   // left leg
  legBeam(6, 1, 0, 13, z, OAK_LOG, 2);    // right leg
  // horizontal ties
  cube(-4, 5, z, 4, 5, z + 1, OAK_LOG);
  cube(-2, 9, z, 2, 9, z + 1, OAK_LOG);
  // diagonal cross-braces
  line(-4, 5, z, 2, 9, z, PLANKS);
  line(4, 5, z, -2, 9, z, PLANKS);
  line(-6, 1, z, -4, 5, z, PLANKS);
  line(6, 1, z, 4, 5, z, PLANKS);
}
aFrame(-4);
aFrame(3);

// axle beam connecting both frames + pivot bearing
cube(-1, 12, -4, 1, 13, 4, OAK_LOG);
cube(-2, 12, -1, 2, 14, 1, COBBLE);   // pivot hub

// ---------- throwing arm (pivots at 0,13) ----------
// long arm up toward +X (east, lit), short arm down toward -X
beamXY(0, 13, 0, 52, -6, 17, OAK_LOG, 1, 1);
// reinforced sling cup at long tip
const lx = Math.round(Math.cos(52 * Math.PI / 180) * 17);
const ly = 13 + Math.round(Math.sin(52 * Math.PI / 180) * 17);
cube(lx - 1, ly - 1, -1, lx + 1, ly + 1, 1, COBBLE);

// ---------- counterweight box hanging on short end ----------
const sx = Math.round(Math.cos(52 * Math.PI / 180) * -6);   // ~ -4
const sy = 13 + Math.round(Math.sin(52 * Math.PI / 180) * -6); // ~ 8
// suspension links
line(sx, sy, -1, -4, 7, -1, COBBLE);
line(sx, sy, 1, -4, 7, 1, COBBLE);
line(sx, sy, 0, -4, 7, 0, OAK_LOG);
// crate: stone-filled timber box
cube(-6, 3, -2, -2, 7, 2, STONE);
hollowCube(-6, 3, -2, -2, 7, 2, OAK_LOG);
// iron banding
cube(-6, 4, -2, -2, 4, 2, COBBLE);
cube(-6, 6, -2, -2, 6, 2, COBBLE);

// ---------- sling + launched boulder ----------
line(lx, ly, 0, 13, 27, 0, COBBLE);
line(lx, ly, -1, 13, 27, -1, COBBLE);
line(lx, ly, 1, 13, 27, 1, COBBLE);
sphere(13, 28, 0, 2, STONE);

// ---------- winch to cock the arm (front) ----------
cube(6, 2, -3, 6, 3, 3, OAK_LOG);       // drum axle
cube(5, 2, -2, 7, 4, 2, OAK_LOG);       // drum body
cube(4, 3, 3, 6, 4, 3, COBBLE);         // crank handle
line(6, 4, 0, 2, 9, 0, COBBLE);         // haul rope up to arm tie

// ---------- ammunition stockpile (foreground, +X) ----------
sphere(12, 1, 5, 1, STONE);
sphere(14, 1, 5, 1, STONE);
sphere(13, 2, 6, 1, STONE);
sphere(11, 1, 6, 1, COBBLE);
// ammo crate
cube(9, 1, 5, 11, 3, 7, OAK_LOG);
cube(9, 3, 5, 11, 3, 7, AIR);
sphere(10, 2, 6, 1, STONE);

// ---------- flag poles on cart corners ----------
[[-8, -4], [8, -4]].forEach(([x, z]) => {
  cube(x, 2, z, x, 9, z, OAK_LOG);
  cube(x, 7, z, x, 9, z + 3, BRICK);   // hanging banner
  block(x, 6, z + 3, BRICK);
});

// ---------- ruined target wall (background, east) ----------
cube(18, 1, -3, 19, 9, 6, COBBLE);
// brick courses
cube(18, 3, -3, 19, 3, 6, BRICK);
cube(18, 6, -3, 19, 6, 6, BRICK);
// jagged broken top
cube(18, 8, -3, 19, 9, 1, AIR);
cube(18, 7, 4, 19, 9, 6, AIR);
block(18, 9, 5, COBBLE);
// breach hole where a shot punched through
sphere(18, 4, 2, 2, AIR);
// rubble at the base of the wall
sphere(16, 1, 1, 1, COBBLE);
sphere(17, 1, 4, 1, STONE);
block(16, 1, -2, COBBLE);

// ---------- foreground groundwork / debris ----------
cube(-10, 0, -6, -8, 0, -4, GRASS);
sphere(-9, 1, -6, 1, LEAVES);   // bush
block(-7, 1, -6, OAK_LOG);      // stump
sphere(-7, 2, -6, 1, LEAVES);
line(3, 0, 6, 6, 0, 6, OAK_LOG); // dropped timber
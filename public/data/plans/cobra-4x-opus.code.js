// cobra-4x-opus — prompt:
// a king cobra ready to strike...

const HX = 2; // upper-body / head lean east for light

// ---------- helpers ----------
function renderSpine(pts) {
  let dist = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2]);
    const steps = Math.max(1, Math.ceil(d * 1.6));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = a[0] + (b[0]-a[0]) * t;
      const y = a[1] + (b[1]-a[1]) * t;
      const z = a[2] + (b[2]-a[2]) * t;
      const r = a[3] + (b[3]-a[3]) * t;
      const dd = dist + d * t;
      const band = Math.floor(dd / 5) % 2 === 0;
      sphere(Math.round(x), Math.round(y), Math.round(z), Math.round(r), band ? LEAVES : SAND);
    }
    dist += d;
  }
}

// ---------- ground: sandy den ----------
disk(0, -1, 7, 12, SAND);
disk(0, 0, 7, 11, SAND);
disk(0, 0, 7, 6, SAND);
// background boulders (south, depth)
sphere(-9, 2, 15, 3, STONE);
sphere(10, 3, 16, 3, COBBLE);
sphere(4, 2, 17, 2, STONE);
// mid + foreground rocks
sphere(-8, 1, 4, 2, COBBLE);
sphere(9, 1, 8, 2, STONE);
sphere(-6, 0, 11, 1, STONE);
sphere(7, 0, -3, 1, COBBLE);
sphere(-7, 0, -5, 1, STONE);
// dry grass tufts
block(-10, 1, 9, LEAVES); block(11, 1, 5, LEAVES);
block(-5, 1, 14, LEAVES); block(8, 1, -6, LEAVES);

// ---------- body spine: coil on ground -> reared column ----------
const spine = [];
const ccx = 0, ccz = 8;
const N1 = 96;
const turns = 2.15;
for (let i = 0; i <= N1; i++) {
  const t = i / N1;
  const ang = t * turns * 2 * Math.PI + Math.PI * 0.4;
  const rad = 10 - t * 6.7;              // outer tail -> inner
  const x = ccx + Math.cos(ang) * rad;
  const z = ccz + Math.sin(ang) * rad;
  const y = 1 + t * 2;                    // coil mounds up toward center
  const r = 1.2 + t * 1.4;                // thin tail tip -> thick body
  spine.push([x, y, z, r]);
}
// rise + neck bending north, leaning east
const rise = [
  [ccx,        3,   ccz,      2.6],
  [ccx + 0.4,  6,   7.4,      2.5],
  [ccx + 0.9,  9,   6.8,      2.4],
  [HX - 0.5,   12,  5.8,      2.3],
  [HX,         15,  4.2,      2.1],
  [HX,         17.5, 1.8,     1.9],
  [HX,         19,  -1,       1.7],
];
renderSpine(spine.concat(rise));

// ---------- flared hood (fans out behind the head, faces north) ----------
const hcx = HX, hcy = 13, hcz = 4, rx = 9, ry = 6, thick = 3;
for (let x = -rx; x <= rx; x++) {
  for (let y = -ry; y <= ry; y++) {
    const e = (x*x)/(rx*rx) + (y*y)/(ry*ry);
    if (e <= 1) {
      for (let z = 0; z < thick; z++) block(hcx + x, hcy + y, hcz + z, LEAVES);
    }
  }
}
// hood back rim (darker edge for definition)
for (let x = -rx; x <= rx; x++) {
  for (let y = -ry; y <= ry; y++) {
    const e = (x*x)/(rx*rx) + (y*y)/(ry*ry);
    if (e <= 1 && e > 0.78) block(hcx + x, hcy + y, hcz + thick - 1, OAK_LOG);
  }
}
// front-face spectacle markings (two eyespots)
const eyes = [[hcx - 5, 15], [hcx + 5, 15]];
for (let x = hcx - rx; x <= hcx + rx; x++) {
  for (let y = hcy - ry; y <= hcy + ry; y++) {
    const e = ((x-hcx)*(x-hcx))/(rx*rx) + ((y-hcy)*(y-hcy))/(ry*ry);
    if (e > 1) continue;
    for (const [ex, ey] of eyes) {
      const dd = Math.hypot(x - ex, y - ey);
      if (dd < 1.4) block(x, y, hcz, STONE);        // dark pupil
      else if (dd >= 2.0 && dd <= 3.2) block(x, y, hcz, SNOW); // pale ring
    }
  }
}
// linking band under the eyespots (spectacle bridge)
line(hcx - 5, 11, hcz, hcx + 5, 11, hcz, SNOW);
line(hcx - 6, 12, hcz, hcx - 4, 10, hcz, SNOW);
line(hcx + 6, 12, hcz, hcx + 4, 10, hcz, SNOW);

// ---------- neck bridge (head to hood) ----------
cube(HX - 2, 17, -1, HX + 2, 20, 4, LEAVES);

// ---------- head (jaws agape, ready to strike) ----------
const hx = HX;
// skull
cube(hx - 3, 19, -4, hx + 3, 22, 1, LEAVES);
sphere(hx, 21, -1, 3, LEAVES);
// upper jaw / snout, angled slightly down toward viewer
cube(hx - 2, 19, -7, hx + 2, 21, -4, LEAVES);
cube(hx - 1, 19, -9, hx + 1, 20, -7, LEAVES);
// lower jaw dropped open + forward
cube(hx - 2, 15, -6, hx + 2, 16, -3, LEAVES);
cube(hx - 1, 14, -9, hx + 1, 15, -6, LEAVES);
// red mouth interior
cube(hx - 2, 17, -5, hx + 2, 18, -3, BRICK);  // roof
cube(hx - 1, 16, -8, hx + 1, 16, -5, BRICK);  // floor / throat
cube(hx - 2, 17, -3, hx + 2, 18, -3, BRICK);
// fangs
block(hx - 1, 18, -7, SNOW); block(hx - 1, 17, -7, SNOW);
block(hx + 1, 18, -7, SNOW); block(hx + 1, 17, -7, SNOW);
// eyes (menacing, facing north)
block(hx - 2, 21, -5, SNOW); block(hx + 2, 21, -5, SNOW);
block(hx - 2, 21, -6, STONE); block(hx + 2, 21, -6, STONE);
// heavy brow ridge
cube(hx - 3, 22, -5, hx - 1, 22, -4, OAK_LOG);
cube(hx + 1, 22, -5, hx + 3, 22, -4, OAK_LOG);

// ---------- forked tongue flicking out ----------
line(hx, 15, -9, hx, 14, -12, BRICK);
line(hx, 14, -12, hx - 2, 14, -14, BRICK);
line(hx, 14, -12, hx + 2, 14, -14, BRICK);
block(hx - 3, 14, -15, BRICK);
block(hx + 3, 14, -15, BRICK);
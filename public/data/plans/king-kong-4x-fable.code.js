// king-kong-4x-fable — prompt:
// King Kong...

// King Kong — roaring atop a rocky crag, right fist raised at circling biplanes.
// A crushed brick tower and a downed, burning plane sit in the jungle below.
// Fur = OAK_LOG flecked with DIRT; bare skin (face/chest/hands/feet) = STONE.

const seen = new Set();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (seen.has(k)) return;
  seen.add(k);
  block(x, y, z, id);
}
function h(x, y, z) {
  let n = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
  n = (n ^ (n >> 13)) >>> 0;
  return n % 100;
}
const fur = (x, y, z) => (h(x, y, z) < 20 ? DIRT : OAK_LOG);
const rock = (x, y, z) => (h(x, y, z) < 35 ? COBBLE : STONE);

function blob(cx, cy, cz, rx, ry, rz, idfn) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.05)
          put(x, y, z, typeof idfn === 'function' ? idfn(x, y, z) : idfn);
      }
}
function limb(x1, y1, z1, x2, y2, z2, r, idfn) {
  const n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 2);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    blob(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r, r, r, idfn);
  }
}

// ---- carve jungle canopy out of the build volume (AIR first, solids after) ----
cube(-8, 4, -5, 8, 10, 7, AIR);          // torso/leg zone
cube(-14, 3, 0, -8, 10, 8, AIR);         // planted left arm zone
cube(14, 0, -21, 21, 13, -14, AIR);      // tower site
cube(-21, 1, -13, -12, 6, -4, AIR);      // crash site

// ---- rocky crag Kong stands on (irregular stacked disks) ----
const crag = [[0, 7.6], [1, 6.6], [2, 5.6], [3, 4.6]];
for (const [y, r] of crag)
  for (let x = -9; x <= 9; x++)
    for (let z = -9; z <= 9; z++) {
      const rr = r + (h(x, 0, z) % 3) * 0.4 - 0.4;
      if (x * x + z * z <= rr * rr) put(x, y, z, rock(x, y, z));
    }
blob(4.5, 3, 2, 3, 0.8, 3.4, rock);      // pad under right foot
blob(-4.5, 3, 2, 3, 0.8, 3.4, rock);     // pad under left foot
blob(-11.5, 1, 4.5, 3.2, 2.6, 3.2, rock); // boulder under planted fist
blob(8, 1, 6, 2.5, 2, 2.5, rock);        // loose boulders
blob(-6, 0.5, -7, 2, 1.5, 2, rock);

// ---- face details FIRST so the skull/muzzle fill around them ----
for (let x = -2; x <= 2; x++) put(x, 28, 4, DIRT);            // heavy brow
put(-2, 27, 4, STONE); put(-1, 27, 4, SNOW); put(0, 27, 4, STONE);
put(1, 27, 4, SNOW); put(2, 27, 4, STONE);                     // eyes
for (let x = -2; x <= 2; x++) put(x, 26, 4, STONE);            // upper face
put(-1, 26, 5, DIRT); put(1, 26, 5, DIRT);                     // nostrils
put(-1, 25, 6, SNOW); put(0, 25, 6, SNOW); put(1, 25, 6, SNOW); // upper teeth
put(-1, 24, 6, BRICK); put(0, 24, 6, BRICK); put(1, 24, 6, BRICK); // roaring mouth
put(-2, 24, 6, STONE); put(2, 24, 6, STONE);
for (let x = -2; x <= 2; x++) put(x, 23, 5, (x === -1 || x === 1) ? SNOW : STONE); // lower jaw + fangs
// chest scars (before torso fill)
put(1, 19, 4, BRICK); put(2, 18, 4, BRICK); put(3, 17, 4, BRICK);
// toes (before feet fill)
for (const sx of [-1, 1]) { put(sx * 4, 4, 4, STONE); put(sx * 5, 4, 4, STONE); put(sx * 6, 4, 4, STONE); }

// ---- feet + legs ----
blob(4.5, 5, 2, 2.6, 1.4, 3.2, fur);
blob(-4.5, 5, 2, 2.6, 1.4, 3.2, fur);
limb(3.5, 12, 0.5, 4.5, 6, 1, 2.3, fur);
limb(-3.5, 12, 0.5, -4.5, 6, 1, 2.3, fur);
blob(3.8, 10.5, 0.5, 2.8, 2.6, 2.6, fur);   // thighs
blob(-3.8, 10.5, 0.5, 2.8, 2.6, 2.6, fur);

// ---- torso: stacked ellipse slices, STONE pec plate on the front ----
const layers = [
  [11, 4.0, 3.0, 0.5], [12, 4.2, 3.2, 0.5], [13, 4.6, 3.4, 0.6],
  [14, 5.0, 3.6, 0.7], [15, 5.4, 3.9, 0.7], [16, 5.8, 4.1, 0.6],
  [17, 6.3, 4.3, 0.4], [18, 6.8, 4.5, 0.2], [19, 7.3, 4.6, 0.0],
  [20, 7.8, 4.6, -0.2], [21, 7.8, 4.4, -0.3], [22, 7.2, 4.0, -0.3],
  [23, 5.8, 3.5, -0.2], [24, 3.2, 3.0, 0.5],
];
for (const [y, rx, rz, cz] of layers)
  for (let x = Math.floor(-rx); x <= Math.ceil(rx); x++)
    for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
      const dx = x / rx, dz = (z - cz) / rz;
      if (dx * dx + dz * dz > 1.05) continue;
      const pec = y >= 15 && y <= 20 && Math.abs(x) <= 4 && z >= cz + rz - 1.5;
      put(x, y, z, pec ? STONE : fur(x, y, z));
    }

// ---- shoulders + arms ----
blob(7, 21.5, 0, 2.9, 2.9, 2.9, fur);
blob(-7, 21.5, 0, 2.9, 2.9, 2.9, fur);
// right arm raised, fist punching the sky
limb(7, 21.5, 0, 10, 26, -1, 2.2, fur);
limb(10, 26, -1, 11.5, 29.5, -2, 2.0, fur);
blob(11.8, 31, -2, 2.3, 2.2, 2.3, STONE);
// left arm planted knuckles-down on the boulder
limb(-7, 21.5, 0, -9.5, 14, 1.5, 2.3, fur);
limb(-9.5, 14, 1.5, -11, 7, 3.5, 2.1, fur);
blob(-11.3, 5.5, 4, 2.4, 2.2, 2.6, STONE);

// ---- head ----
blob(0, 24.8, 4.5, 2.6, 1.7, 2.1, STONE);   // muzzle
blob(0, 27, 1, 3.3, 3.4, 3.1, fur);         // skull
blob(0, 30.7, 0.6, 1.6, 1.5, 2.3, fur);     // sagittal crest
put(-4, 27, 1, DIRT); put(4, 27, 1, DIRT);  // ear nubs

// ---- crushed brick tower he tore through ----
for (let x = 15; x <= 20; x++)
  for (let z = -20; z <= -15; z++) {
    const edge = x === 15 || x === 20 || z === -20 || z === -15;
    if (!edge) continue;
    const H = 5 + (h(x, 0, z) % 7);          // jagged, ripped-open top
    for (let y = 0; y <= H; y++) {
      const win = y >= 1 && y % 3 !== 0 &&
        ((x === 15 || x === 20) ? Math.abs(z) % 2 === 1 : x % 2 === 1);
      put(x, y, z, win ? GLASS : BRICK);
    }
  }
// rubble spilling off the tower
put(13, 0, -16, BRICK); put(14, 0, -14, BRICK); put(21, 0, -13, BRICK);
put(13, 0, -19, BRICK); put(12, 0, -17, COBBLE); put(21, 0, -21, BRICK);

// ---- biplanes ----
function biplane(cx, cy, cz, dx, dz, wrecked) {
  const px = -dz, pz = dx;
  for (let i = -3; i <= 3; i++) put(cx + i * dx, cy, cz + i * dz, PLANKS);
  put(cx + 4 * dx, cy, cz + 4 * dz, STONE);            // engine + prop cross
  put(cx + 4 * dx, cy + 1, cz + 4 * dz, STONE);
  put(cx + 4 * dx, cy - 1, cz + 4 * dz, STONE);
  put(cx + 4 * dx + px, cy, cz + 4 * dz + pz, STONE);
  put(cx + 4 * dx - px, cy, cz + 4 * dz - pz, STONE);
  for (let w = -4; w <= 4; w++) {
    if (wrecked && w > 1) continue;                    // snapped wing
    put(cx + dx + w * px, cy, cz + dz + w * pz, SNOW);
    put(cx + dx + w * px, cy + 2, cz + dz + w * pz, SNOW);
  }
  put(cx + dx + 3 * px, cy + 1, cz + dz + 3 * pz, PLANKS); // wing struts
  put(cx + dx - 3 * px, cy + 1, cz + dz - 3 * pz, PLANKS);
  for (let w = -1; w <= 1; w++) put(cx - 3 * dx + w * px, cy, cz - 3 * dz + w * pz, SNOW);
  put(cx - 3 * dx, cy + 1, cz - 3 * dz, SNOW);         // tail fin
}
biplane(16, 26, 3, -1, 0, false);    // diving at the raised fist
biplane(-9, 29, 13, 0, -1, false);   // strafing the face
biplane(-17, 2, -9, 1, 0, true);     // downed in the jungle
put(-13, 1, -9, BRICK); put(-13, 2, -9, BRICK); put(-12, 1, -9, BRICK); // fire at the nose
put(-13, 3, -8, BRICK);
put(-14, 1, -5, PLANKS); put(-12, 1, -6, PLANKS); put(-11, 1, -4, SNOW); // scattered debris
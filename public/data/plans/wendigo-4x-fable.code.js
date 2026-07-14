// wendigo-4x-fable — prompt:
// a wendigo...

const seen = new Set();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  const k = x + ',' + y + ',' + z;
  if (seen.has(k)) return;
  seen.add(k);
  block(x, y, z, id);
}
function blob(cx, cy, cz, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++)
    for (let dy = -R; dy <= R; dy++)
      for (let dz = -R; dz <= R; dz++)
        if (dx * dx + dy * dy + dz * dz <= r * r + 0.5)
          put(cx + dx, cy + dy, cz + dz, id);
}
function limb(x1, y1, z1, x2, y2, z2, r, id) {
  const n = Math.max(1, Math.round(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1))));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    blob(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t), Math.round(z1 + (z2 - z1) * t), r, id);
  }
}
function esec(y, cz, rx, rz, id) {
  for (let x = Math.floor(-rx); x <= Math.ceil(rx); x++)
    for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
      const dx = x / rx, dz = (z - cz) / rz;
      if (dx * dx + dz * dz <= 1.05) put(x, y, z, id);
    }
}
function ribRing(y, cz, rx, rz) {
  for (let x = Math.floor(-rx); x <= Math.ceil(rx); x++)
    for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
      const dx = x / rx, dz = (z - cz) / rz;
      const d = dx * dx + dz * dz;
      if (d <= 1.05 && d >= 0.55 && z <= cz) block(x, y, z, SNOW);
    }
}

// ---- clear tree canopy in the creature's footprint ----
cube(-9, 1, -12, 9, 8, 8, AIR);

// ---- snowy clearing ----
disk(0, 0, -2, 10, SNOW);
disk(-8, 0, -8, 4, SNOW);
disk(8, 0, -6, 4, SNOW);
disk(-9, 0, 5, 4, SNOW);
disk(7, 0, 7, 4, SNOW);
disk(0, 0, -12, 4, SNOW);

// ---- gaunt torso: stacked ellipse sections (hips y12 -> shoulders y20) ----
const SEC = [
  [12, 4.0, 3.4, 2.5, COBBLE],
  [13, 4.0, 3.1, 2.3, STONE],
  [14, 3.2, 2.4, 1.9, STONE],
  [15, 2.6, 2.2, 1.8, STONE],
  [16, 2.0, 2.6, 2.0, STONE],
  [17, 1.4, 3.0, 2.1, STONE],
  [18, 0.8, 3.2, 2.2, STONE],
  [19, 0.3, 3.3, 2.2, STONE],
  [20, 0.0, 2.8, 1.9, COBBLE]
];
for (const [y, cz, rx, rz, id] of SEC) esec(y, cz, rx, rz, id);
// exposed ribs on the chest front
ribRing(16, 2.0, 2.6, 2.0);
ribRing(18, 0.8, 3.2, 2.2);
// vertebrae bumps down the back
for (const [y, cz, rx, rz] of SEC) block(0, y, Math.round(cz + rz), SNOW);
// sunken belly shadow
block(-1, 14, 2, COBBLE); block(0, 14, 2, COBBLE); block(1, 14, 2, COBBLE); block(0, 15, 1, COBBLE);

// ---- digitigrade legs ----
limb(-2, 13, 4, -4, 8, 1, 1.6, STONE);
limb(-4, 8, 1, -4, 4, 5, 1.1, STONE);
limb(-4, 4, 5, -4, 1, 2, 1.0, STONE);
cube(-5, 0, 0, -3, 1, 2, STONE);
block(-5, 0, -1, COBBLE); block(-4, 0, -1, COBBLE); block(-3, 0, -1, COBBLE);
limb(2, 13, 4, 4, 8, 3, 1.6, STONE);
limb(4, 8, 3, 4, 4, 7, 1.1, STONE);
limb(4, 4, 7, 4, 1, 4, 1.0, STONE);
cube(3, 0, 2, 5, 1, 4, STONE);
block(3, 0, 1, COBBLE); block(4, 0, 1, COBBLE); block(5, 0, 1, COBBLE);

// ---- shoulders, hunched back hump, neck ----
limb(-4, 19, 0, 4, 19, 0, 1.6, STONE);
blob(0, 20, 2, 2.2, COBBLE);
block(0, 23, 2, COBBLE);
limb(0, 20, 1, 0, 23, -3, 1.2, STONE);
block(0, 22, 1, SNOW); block(0, 23, -1, SNOW);

// ---- left arm: elongated, claws raking the snow ----
limb(-4, 19, 0, -6, 13, -1, 1.3, STONE);
blob(-6, 13, -1, 1.4, COBBLE);
limb(-6, 13, -1, -7, 6, -3, 1.1, STONE);
blob(-7, 6, -3, 1.0, COBBLE);
line(-7, 5, -3, -9, 0, -6, SNOW);
line(-7, 5, -3, -7, 0, -7, SNOW);
line(-7, 5, -3, -5, 0, -6, SNOW);
block(-9, 0, -6, BRICK); block(-7, 0, -7, BRICK); block(-5, 0, -6, BRICK);
block(-8, 0, -8, BRICK); block(-6, 0, -8, BRICK);

// ---- right arm: raised with spread bone claws ----
limb(4, 19, 0, 8, 22, -1, 1.3, STONE);
block(8, 23, -1, SNOW);
limb(8, 22, -1, 11, 25, -3, 1.1, STONE);
blob(11, 26, -3, 1.1, STONE);
line(11, 26, -3, 13, 29, -5, SNOW);
line(11, 26, -3, 12, 30, -3, SNOW);
line(11, 26, -3, 13, 28, -1, SNOW);

// ---- skull head ----
cube(-2, 23, -7, 2, 28, -2, SNOW);
block(-2, 23, -7, AIR); block(2, 23, -7, AIR); block(-2, 23, -2, AIR); block(2, 23, -2, AIR);
block(-2, 28, -7, AIR); block(2, 28, -7, AIR); block(-2, 28, -2, AIR); block(2, 28, -2, AIR);
// sunken cheeks
cube(-2, 24, -6, -2, 25, -5, COBBLE);
cube(2, 24, -6, 2, 25, -5, COBBLE);
// under-eye hollows + glowing red eyes + shadowed brow
cube(-2, 25, -7, -1, 25, -7, COBBLE);
cube(1, 25, -7, 2, 25, -7, COBBLE);
cube(-2, 26, -7, -1, 26, -7, BRICK);
cube(1, 26, -7, 2, 26, -7, BRICK);
cube(-2, 27, -7, -1, 27, -7, AIR);
cube(1, 27, -7, 2, 27, -7, AIR);
cube(-2, 27, -6, -1, 27, -6, COBBLE);
cube(1, 27, -6, 2, 27, -6, COBBLE);
// muzzle with gaping bloody maw
cube(-1, 23, -11, 1, 25, -8, SNOW);
block(-1, 24, -11, AIR); block(1, 24, -11, AIR);
cube(-1, 22, -10, 1, 22, -8, BRICK);
cube(-1, 22, -7, -1, 22, -4, SNOW);
cube(1, 22, -7, 1, 22, -4, SNOW);
cube(0, 22, -7, 0, 22, -4, BRICK);
block(-1, 22, -11, SNOW); block(1, 22, -11, SNOW);
cube(-1, 21, -11, 1, 21, -8, SNOW);
// blood drips from the jaw
block(0, 20, -10, BRICK); block(-1, 19, -9, BRICK); block(1, 20, -9, BRICK);

// ---- antlers ----
for (const s of [-1, 1]) {
  limb(2 * s, 28, -4, 5 * s, 30, -4, 1, OAK_LOG);
  limb(5 * s, 30, -4, 9 * s, 31, -2, 1, OAK_LOG);
  line(3 * s, 29, -4, 3 * s, 33, -6, OAK_LOG);
  line(5 * s, 30, -4, 6 * s, 33, -5, OAK_LOG);
  line(7 * s, 31, -3, 8 * s, 33, -4, OAK_LOG);
  line(9 * s, 31, -2, 10 * s, 33, -3, OAK_LOG);
  line(2 * s, 28, -6, 4 * s, 30, -8, OAK_LOG);
}

// ---- frost breath drifting from the maw ----
block(0, 21, -12, SNOW); block(-1, 21, -13, ICE); block(1, 20, -13, SNOW); block(0, 20, -14, ICE);

// ---- dead trees flanking ----
line(-13, -1, -3, -13, 9, -3, OAK_LOG);
line(-13, 9, -3, -15, 12, -2, OAK_LOG);
line(-13, 7, -3, -16, 10, -2, OAK_LOG);
line(-13, 5, -3, -10, 8, -4, OAK_LOG);
line(13, -1, 6, 13, 8, 6, OAK_LOG);
line(13, 8, 6, 15, 11, 7, OAK_LOG);
line(13, 6, 6, 16, 9, 4, OAK_LOG);
line(13, 4, 6, 11, 7, 8, OAK_LOG);
line(-5, -1, 12, -5, 9, 12, OAK_LOG);
line(-5, 9, 12, -3, 13, 13, OAK_LOG);
line(-5, 6, 12, -8, 9, 11, OAK_LOG);

// ---- boulders half-buried in snow ----
blob(-11, 0, -2, 1.4, COBBLE);
blob(10, 0, -9, 1.2, STONE);
blob(8, 0, 4, 1.2, COBBLE);

// ---- ice shards ----
cube(-11, 0, -9, -11, 2, -9, ICE);
cube(9, 0, 2, 9, 1, 2, ICE);
cube(7, -1, -12, 7, 2, -12, ICE);

// ---- ravaged carcass: blood pool, rib arches, skull ----
disk(5, 0, -8, 2, BRICK);
for (const z of [-9, -8, -7]) {
  block(4, 1, z, SNOW); block(6, 1, z, SNOW); block(5, 2, z, SNOW);
}
block(7, 0, -10, SNOW);
block(8, 0, -11, OAK_LOG);
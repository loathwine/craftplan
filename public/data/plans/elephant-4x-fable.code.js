// elephant-4x-fable — prompt:
// an African elephant...

const STONE_ = STONE, COB = COBBLE;

function skin(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return (n - Math.floor(n)) < 0.14 ? COB : STONE_;
}

function ellip(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1)
          block(x, y, z, id === undefined ? skin(x, y, z) : id);
      }
}

// --- clear trees/leaves from the build envelope (foliage tops out at y=8) ---
cube(-11, 0, -16, 7, 9, 14, AIR);   // adult elephant footprint
cube(8, 0, -7, 19, 8, 9, AIR);      // baby elephant footprint
cube(-15, 0, -9, -12, 7, -3, AIR);  // termite mound spot

// ================= ADULT AFRICAN ELEPHANT (facing north / -Z) =================

// Body: barrel + high shoulder + high hindquarters (African saddle-back profile)
ellip(0, 12, 4, 6.2, 5.4, 7.6);
ellip(0, 15, 0, 4.4, 3.4, 3.8);     // shoulder hump
ellip(0, 13.5, 9, 4.6, 3.6, 3.4);   // hindquarters

// Head + domed skull
ellip(0, 13, -5.5, 3.6, 3.7, 3.9);
ellip(0, 15.5, -6, 2.2, 1.8, 2.2);

// Legs — left front mid-stride (forward), right rear trailing
const legs = [
  { xs: [-5, -4], zs: [-2, -1] },
  { xs: [4, 5],   zs: [-1, 0] },
  { xs: [-5, -4], zs: [8, 9] },
  { xs: [4, 5],   zs: [9, 10] },
];
for (const L of legs) {
  for (let x = L.xs[0]; x <= L.xs[1]; x++)
    for (let z = L.zs[0]; z <= L.zs[1]; z++)
      for (let y = -1; y <= 9; y++) block(x, y, z, skin(x, y, z));
  // white toenails on the north face of each foot
  block(L.xs[0], 0, L.zs[0] - 1, SNOW);
  block(L.xs[1], 0, L.zs[0] - 1, SNOW);
}
// shoulder / thigh bulges fusing legs into the body
ellip(-4.5, 10.5, -0.5, 2, 2.8, 2.3);
ellip(4.5, 10.5, -0.5, 2, 2.8, 2.3);
ellip(-4.5, 10, 8.8, 2.2, 2.8, 2.5);
ellip(4.5, 10, 8.8, 2.2, 2.8, 2.5);

// Huge African ears: flared 1-block fans sweeping out, back and down
for (const s of [-1, 1]) {
  for (let i = 0; i <= 7; i++) {
    const x = s * (3 + i);
    const ry = 6 - 0.6 * i, rz = 3.8 - 0.38 * i;
    const cy = 13 - 0.55 * i, cz = -4 + 0.55 * i;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dy * dy + dz * dz <= 1) block(x, y, z, skin(x, y, z));
      }
  }
}

// Trunk: 3-wide at the base tapering to 1, curving down and forward,
// ringed with cobble wrinkles, tip curled up
for (let i = 0; i <= 9; i++) {
  const y = 11 - i;
  const zc = Math.round(-8.5 - 0.45 * i);
  const w = i < 3 ? 1 : 0;
  const d = i < 5 ? 1 : 0;
  cube(-w, y, zc - d, w, y, zc, i % 3 === 0 ? COB : STONE_);
}
block(0, 2, -14, STONE_);
block(0, 3, -14, COB);

// Ivory tusks curving forward and up from beside the trunk
for (const s of [-1, 1]) {
  line(s * 2, 10, -8, s * 2, 8, -11, SNOW);
  line(s * 2, 8, -11, s * 2, 9, -13, SNOW);
  block(s * 2, 10, -9, SNOW);
}

// Eyes
block(-2, 14, -9, OAK_LOG);
block(2, 14, -9, OAK_LOG);

// Tail with dark tuft
line(0, 14, 11, 0, 9, 13, STONE_);
block(0, 8, 13, OAK_LOG);
block(0, 7, 13, OAK_LOG);

// Cattle egret riding on the shoulder hump
cube(2, 18, 0, 2, 18, 1, SNOW);
block(2, 19, 0, SNOW);
block(2, 19, -1, BRICK);

// ================= BABY ELEPHANT (east side, also facing north) =================

ellip(14.5, 5.5, 3, 3, 2.6, 4);      // body
ellip(14.5, 6.5, -2, 2.3, 2.2, 2.2); // head

// legs
for (const x of [13, 16])
  for (const z of [1, 6])
    for (let y = -1; y <= 4; y++) block(x, y, z, skin(x, y, z));

// small ears
for (const s of [-1, 1]) {
  for (let i = 0; i <= 1; i++) {
    const x = s > 0 ? 17 + i : 12 - i;
    const ry = 2.2 - 0.7 * i, rz = 1.5 - 0.4 * i;
    const cy = 6.5 - 0.4 * i, cz = -1.6 + 0.4 * i;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dy * dy + dz * dz <= 1) block(x, y, z, skin(x, y, z));
      }
  }
}

// little trunk reaching down to the grass (no tusks — it's a calf)
for (let i = 0; i <= 5; i++) {
  const y = 5 - i;
  const z = Math.round(-4.3 - 0.35 * i);
  cube(14, y, z, 15, y, z, i % 2 ? STONE_ : COB);
}

// eyes + tail
block(13, 7, -4, OAK_LOG);
block(16, 7, -4, OAK_LOG);
line(15, 6, 6, 15, 4, 8, STONE_);
block(15, 3, 8, OAK_LOG);

// ================= SAVANNA DRESSING =================

// termite mound west of the adult
disk(-13, 0, -6, 3, DIRT);
cylinder(-13, 0, -6, 2, 3, DIRT);
cylinder(-13, 3, -6, 1, 2, DIRT);
block(-13, 5, -6, DIRT);
block(-13, 6, -6, SAND);

// dusty wallow patches worn into the grass
disk(7, -1, -8, 3, SAND);
disk(-8, -1, -4, 2, SAND);
disk(12, -1, -3, 2, SAND);
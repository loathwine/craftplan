// stonehenge-4x-fable — prompt:
// Stonehenge...

// Stonehenge — ruined sarsen circle, trilithon horseshoe, earthwork ring, heel stone.
// Front (intact NE face + entrance avenue) faces NORTH (-Z) toward the camera.

function frac(n){ return n - Math.floor(n); }
function rnd(x, y, z){ return frac(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453); }
function mstone(x, y, z){ return rnd(x, y, z) < 0.28 ? COBBLE : STONE; }
function put(x, y, z){
  const bx = Math.round(x), bz = Math.round(z);
  block(bx, y, bz, mstone(bx, y, bz));
}
// vertical wall slab between two float endpoints, inclusive y range
function slabW(x1, z1, x2, z2, y1, y2){
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1)) * 2));
  for (let y = y1; y <= y2; y++)
    for (let s = 0; s <= steps; s++){
      const t = s / steps;
      put(x1 + (x2 - x1) * t, y, z1 + (z2 - z1) * t);
    }
}

// ---- clear trees / brush over the monument field (AIR is free) ----
for (let y = 0; y <= 10; y++) disk(0, y, 0, 21, AIR);

// ---- uniform grass plain ----
disk(0, -1, 0, 21, GRASS);

// ---- earthwork: outer ditch + inner bank, entrance gap to the north ----
for (let x = -21; x <= 21; x++)
  for (let z = -21; z <= 21; z++){
    const d = Math.sqrt(x * x + z * z);
    const entrance = (z <= -15 && x >= -2 && x <= 6);
    if (entrance) continue;
    if (d >= 19.6 && d <= 21.0){           // ditch: dug-out dirt ring
      block(x, -1, z, AIR);
      block(x, -2, z, DIRT);
    } else if (d >= 17.6 && d <= 19.2){    // bank: low grass mound
      block(x, 0, z, GRASS);
      if (d >= 18.0 && d <= 18.9 && rnd(x, 9, z) < 0.4) block(x, 1, z, GRASS);
    }
  }

// ---- the Avenue: worn dirt path running north from the entrance ----
for (let z = -21; z <= -12; z++)
  for (let x = -1; x <= 3; x++)
    if (rnd(x, 5, z) < 0.72) block(x, -1, z, DIRT);

// ---- sarsen circle: 24 uprights r=13, intact toward camera, ruined at back ----
const R = 13, N = 24;
const standing = [], stub = [];
function fallenSarsen(a){ // toppled stone lying inward on the grass
  const x = Math.sin(a) * R, z = -Math.cos(a) * R;
  const ix = -Math.sin(a) * 3.5, iz = Math.cos(a) * 3.5;
  const tx = Math.cos(a), tz = Math.sin(a);
  for (const o of [0, 1])
    slabW(x + tx * o, z + tz * o, x + tx * o + ix, z + tz * o + iz, 0, 0);
}
for (let i = 0; i < N; i++){
  const a = i / N * Math.PI * 2;
  const x = Math.sin(a) * R, z = -Math.cos(a) * R;
  const r = rnd(i, 7, i * 3);
  let st = true, sb = false;
  if (z > 4){                               // southern arc is ruined
    if (r < 0.30) st = false;
    else if (r < 0.55){ st = false; fallenSarsen(a); }
    else if (r < 0.78) sb = true;           // broken stub
  }
  standing.push(st); stub.push(sb);
  if (st){
    const tx = Math.cos(a) * 0.9, tz = Math.sin(a) * 0.9;
    const h = sb ? 1 + Math.floor(r * 2.5) : 4;
    slabW(x - tx, z - tz, x + tx, z + tz, 0, h);
  }
}
// lintel ring over surviving adjacent pairs
for (let i = 0; i < N; i++){
  const j = (i + 1) % N;
  if (!standing[i] || !standing[j] || stub[i] || stub[j]) continue;
  const zmid = -Math.cos((i + 0.5) / N * Math.PI * 2) * R;
  if (zmid > 4 && rnd(i, 55, j) < 0.5) continue;
  for (let t = 0; t <= 1.001; t += 0.04){
    const a = (i + t) / N * Math.PI * 2;
    put(Math.sin(a) * R, 5, -Math.cos(a) * R);
  }
}

// ---- inner trilithon horseshoe, opening toward the camera (north) ----
function trilithon(adeg, r, h){
  const a = adeg * Math.PI / 180;
  const cx = Math.sin(a) * r, cz = -Math.cos(a) * r;
  const tx = Math.cos(a), tz = Math.sin(a);       // tangent
  const nx = Math.sin(a), nz = -Math.cos(a);      // outward
  for (const s of [-1, 1]){
    const ux = cx + tx * 1.7 * s, uz = cz + tz * 1.7 * s;
    for (const dpt of [0, 0.9])
      slabW(ux - tx * 0.8 + nx * dpt, uz - tz * 0.8 + nz * dpt,
            ux + tx * 0.8 + nx * dpt, uz + tz * 0.8 + nz * dpt, 0, h - 1);
  }
  for (const dpt of [0, 0.9])
    slabW(cx - tx * 2.6 + nx * dpt, cz - tz * 2.6 + nz * dpt,
          cx + tx * 2.6 + nx * dpt, cz + tz * 2.6 + nz * dpt, h, h);
}
trilithon(105, 7.5, 6);
trilithon(142, 7.5, 7);
trilithon(180, 7.5, 8);   // great trilithon at the back, framing the center
trilithon(218, 7.5, 7);
trilithon(255, 7.5, 6);

// ---- bluestone ring (r=10) and inner bluestone horseshoe (r=5.5) ----
for (let i = 0; i < 18; i++){
  const a = (i + 0.5) / 18 * Math.PI * 2;
  const bx = Math.round(Math.sin(a) * 10), bz = Math.round(-Math.cos(a) * 10);
  if (bz < -8.5) continue;                  // keep the entrance sightline open
  if (rnd(i, 2, i) < 0.25) continue;
  const h = 1 + Math.floor(rnd(i, 3, i) * 2);
  for (let y = 0; y <= h; y++) block(bx, y, bz, rnd(bx, y, bz) < 0.55 ? COBBLE : STONE);
}
for (let i = 0; i < 8; i++){
  const a = (112 + i * 19.5) * Math.PI / 180;
  const bx = Math.round(Math.sin(a) * 5.5), bz = Math.round(-Math.cos(a) * 5.5);
  const h = rnd(i, 4, i) < 0.5 ? 1 : 2;
  for (let y = 0; y <= h; y++) block(bx, y, bz, rnd(bx, y, bz + 40) < 0.55 ? COBBLE : STONE);
}

// ---- altar stone (lying slab at center) ----
cube(-2, 0, 0, 1, 0, 1, STONE);
block(-2, 0, 0, COBBLE); block(1, 0, 1, COBBLE);

// ---- slaughter stone (fallen slab in the entrance) ----
cube(-1, 0, -16, 0, 0, -13, STONE);
block(0, 0, -16, COBBLE); block(-1, 0, -13, COBBLE);

// ---- heel stone: tapered leaning monolith out on the avenue ----
for (let y = 0; y <= 1; y++) for (let x = 2; x <= 4; x++) for (let z = -20; z <= -19; z++)
  block(x, y, z, mstone(x, y, z));
for (let y = 2; y <= 3; y++) for (let x = 2; x <= 3; x++) for (let z = -20; z <= -19; z++)
  block(x, y, z, mstone(x, y, z));
block(2, 4, -19, STONE); block(3, 4, -19, COBBLE);
block(3, 5, -19, STONE);

// ---- station stones on the bank line (NW / SE) ----
for (const adeg of [125, 305]){
  const a = adeg * Math.PI / 180;
  const sx = Math.round(Math.sin(a) * 17), sz = Math.round(-Math.cos(a) * 17);
  for (let y = 0; y <= 2; y++) block(sx, y, sz, mstone(sx, y, sz));
}

// ---- fallen lintels + scattered field rocks for age and asymmetry ----
cube(-4, 0, 8, -2, 0, 9, STONE); block(-4, 0, 9, COBBLE);
cube(5, 0, 6, 7, 0, 7, COBBLE); block(6, 0, 6, STONE);
cube(9, 0, -2, 10, 0, 0, STONE); block(9, 1, -1, COBBLE);
for (let i = 0; i < 14; i++){
  const a = rnd(i, 11, 3) * Math.PI * 2;
  const rr = 14.5 + rnd(i, 13, 5) * 5.5;
  const sx = Math.round(Math.sin(a) * rr), sz = Math.round(-Math.cos(a) * rr);
  if (sz < -12 && sx > -4 && sx < 7) continue;   // keep the avenue clear
  block(sx, 0, sz, COBBLE);
}
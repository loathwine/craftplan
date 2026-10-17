// dracula-castle-sonnet55 — prompt:
// Dracula's castle on a cliff...

const done = new Set();
let used = 0;
const CAP = 3900;

function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = ((x + 22) * 50 + (y + 8)) * 50 + (z + 22);
  if (id === AIR) {
    if (done.has(k)) { done.delete(k); used--; }
    block(x, y, z, AIR);
    return;
  }
  if (!done.has(k)) {
    if (used >= CAP) return;
    done.add(k);
    used++;
  }
  block(x, y, z, id);
}

function hh(a, b) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function ring(cx, cz, y, r, fn) {
  const R = Math.ceil(r + 1);
  for (let dx = -R; dx <= R; dx++) {
    for (let dz = -R; dz <= R; dz++) {
      const d = Math.hypot(dx, dz);
      if (d <= r + 0.5 && d > r - 0.5) {
        const id = fn(dx, dz);
        if (id !== null) put(cx + dx, y, cz + dz, id);
      }
    }
  }
}

function rectRing(x1, z1, x2, z2, y, fn) {
  for (let x = x1; x <= x2; x++) {
    for (let z = z1; z <= z2; z++) {
      if (x === x1 || x === x2 || z === z1 || z === z2) put(x, y, z, fn(x, z, y));
    }
  }
}

function wallId(x, z, y) {
  return hh(x * 2.3 + y, z * 1.9 + y * 0.7) > 0.8 ? GRAY : STONE;
}

function tower(cx, cz, r, y1, y2, o) {
  for (let y = y1; y < y2; y++) {
    const rel = y - y1;
    ring(cx, cz, y, r, (dx, dz) => {
      if (o.win && rel % o.every === o.off) {
        if (dx === 0 && dz < 0) return o.win;
        if (o.side && dz === 0 && Math.abs(dx) >= Math.round(r)) return GLOWSTONE;
      }
      return hh(dx * 3 + y, dz * 2 + cx) > 0.75 ? GRAY : STONE;
    });
  }
  ring(cx, cz, y2, r + 1, () => BLACK);
  if (o.flat) {
    ring(cx, cz, y2 + 1, r + 1, (dx, dz) => ((dx + dz) & 1) === 0 ? null : BLACK);
    return;
  }
  for (let k = 0; k < o.roofH; k++) {
    const y = y2 + 1 + k;
    const rr = (r + 0.6) * (1 - k / o.roofH);
    const id = (k % 3 === 2) ? o.acc : o.roof;
    if (rr < 1) put(cx, y, cz, id);
    else ring(cx, cz, y, rr, () => id);
  }
  if (o.finial) put(cx, y2 + o.roofH + 1, cz, o.finial);
}

// ---------- clear stray trees over the plateau ----------
for (let x = -14; x <= 14; x++) {
  for (let z = -11; z <= 8; z++) put(x, 8, z, AIR);
}

// ---------- the cliff ----------
function zf(x, y) {
  const t = y + 2;
  let z = -13 + Math.floor(t * 0.45) + Math.floor(x * x / 110);
  if (Math.abs(x) > 2) {
    z += Math.floor((hh(x, 7) * 0.6 + hh(x, Math.floor(y / 3)) * 0.4) * 2) - 1;
  }
  return z;
}
function xr(side, y, z) {
  const t = y + 2;
  return 15 - Math.floor(t * 0.35) - (hh(z + side * 50, 11 + Math.floor(y / 3)) > 0.6 ? 1 : 0);
}
function inside(x, y, z) {
  if (z > 5 || z < zf(x, y)) return false;
  return x >= -xr(0, y, z) && x <= xr(1, y, z);
}
function cliffId(x, y, z) {
  const r = hh(x * 1.7 + y * 0.3, z * 0.9 + y);
  if (y < 0 && r < 0.15) return DIRT;
  if (y % 3 === 0 && r > 0.5) return GRAY;
  if (r < 0.25) return GRAY;
  if (r > 0.82) return COBBLE;
  return STONE;
}
for (let y = -2; y <= 7; y++) {
  for (let x = -16; x <= 16; x++) {
    for (let z = -17; z <= 6; z++) {
      if (!inside(x, y, z)) continue;
      if (y === 7) {
        const edge = !inside(x - 1, y, z) || !inside(x + 1, y, z) || !inside(x, y, z - 1) || !inside(x, y, z + 1);
        if (edge) put(x, y, z, hh(x, z) > 0.4 ? GRASS : COBBLE);
        else put(x, y, z, hh(x * 1.3, z * 1.1) > 0.55 ? GRAY : STONE);
      } else {
        const shell = !inside(x - 1, y, z) || !inside(x + 1, y, z) || !inside(x, y, z - 1) ||
                      !inside(x, y, z - 2) || !inside(x, y, z + 1);
        if (shell) put(x, y, z, cliffId(x, y, z));
      }
    }
  }
}

// ---------- ramp up to the gate ----------
for (let k = 0; k <= 8; k++) {
  const y = -1 + k, z = -17 + k;
  for (let x = -1; x <= 1; x++) {
    if (x === 0) {
      put(x, y, z, LIGHT_GRAY);
      put(x, y - 1, z, GRAY);
    } else {
      for (let yy = -1; yy <= y; yy++) put(x, yy, z, yy === y ? COBBLE : GRAY);
    }
  }
}
for (const k of [1, 3, 5, 7]) {
  for (const sx of [-2, 2]) {
    put(sx, -1 + k + 1, -17 + k, OBSIDIAN);
    put(sx, -1 + k + 2, -17 + k, OBSIDIAN);
    if (k === 3 || k === 7) put(sx, -1 + k + 3, -17 + k, FIRE);
  }
}

// ---------- front curtain wall + gate ----------
const TW = [[-9, -7, 3], [9, -7, 3], [-9, 4, 2], [9, 4, 2]];
function inTower(x, z) {
  for (const [tx, tz, r] of TW) if (Math.hypot(x - tx, z - tz) <= r - 0.5) return true;
  return false;
}
for (let x = -9; x <= 9; x++) {
  for (let y = 8; y <= 13; y++) {
    if (inTower(x, -7)) continue;
    const gate = (Math.abs(x) <= 2 && y <= 11) || (Math.abs(x) <= 1 && y === 12);
    if (gate) continue;
    put(x, y, -7, wallId(x, -7, y));
  }
  if ((x & 1) === 0 && !inTower(x, -7)) put(x, 14, -7, STONE);
}
for (let y = 8; y <= 12; y++) { put(-3, y, -7, OBSIDIAN); put(3, y, -7, OBSIDIAN); }
for (let x = -3; x <= 3; x++) put(x, 13, -7, OBSIDIAN);
put(-2, 12, -7, OBSIDIAN); put(2, 12, -7, OBSIDIAN);
for (const x of [-2, 0, 2]) for (let y = 9; y <= 11; y++) put(x, y, -7, IRON);
for (let x = -2; x <= 2; x++) { put(x, 10, -7, IRON); for (let y = 8; y <= 11; y++) put(x, y, -5, BLACK); }
put(-1, 11, -6, GLOWSTONE); put(1, 11, -6, GLOWSTONE);
for (const sx of [-4, 4]) { put(sx, 8, -8, OBSIDIAN); put(sx, 9, -8, OBSIDIAN); put(sx, 10, -8, FIRE); }
for (const sx of [-6, 6]) {
  for (let y = 9; y <= 12; y++) put(sx, y, -8, RED);
  put(sx, 8, -8, BLACK);
  put(sx, 13, -8, GOLD);
}

// ---------- front towers ----------
tower(-9, -7, 3, 8, 20, { win: GLOWSTONE, every: 5, off: 3, side: true, roofH: 7, roof: BLACK, acc: PURPLE, finial: IRON });
tower(9, -7, 3, 8, 17, { win: GLOWSTONE, every: 5, off: 2, side: true, flat: true });
put(9, 18, -7, FIRE); put(8, 18, -6, FIRE);

// ---------- keep ----------
for (let y = 8; y <= 18; y++) rectRing(-5, -3, 5, 3, y, wallId);
rectRing(-5, -3, 5, 3, 19, (x, z) => ((x + z) & 1) === 0 ? STONE : null);
for (let x = -1; x <= 1; x++) for (let y = 8; y <= 10; y++) put(x, y, -3, BROWN);
for (let x = -2; x <= 2; x++) put(x, 11, -3, OBSIDIAN);
put(-2, 8, -3, OBSIDIAN); put(2, 8, -3, OBSIDIAN);
put(-2, 9, -3, OBSIDIAN); put(2, 9, -3, OBSIDIAN);
put(-2, 10, -3, OBSIDIAN); put(2, 10, -3, OBSIDIAN);
put(1, 9, -3, GOLD);
for (const x of [-3, 3]) for (let y = 12; y <= 14; y++) put(x, y, -3, GLOWSTONE);
for (const x of [-4, 0, 4]) { put(x, 16, -3, GLOWSTONE); put(x, 17, -3, GLOWSTONE); }
for (const sx of [-5, 5]) {
  for (const y of [12, 13, 16, 17]) put(sx, y, 0, GLOWSTONE);
}

// central great tower (Dracula's spire)
tower(0, 0, 3, 19, 26, { win: NEON_RED, every: 4, off: 2, side: false, roofH: 6, roof: PURPLE, acc: BLACK, finial: IRON });
// keep turrets
tower(-4, -3, 1.2, 19, 23, { roofH: 4, roof: RED, acc: BLACK });
tower(4, -3, 1.2, 19, 23, { roofH: 4, roof: RED, acc: BLACK });

// ---------- back towers ----------
tower(-9, 4, 2, 8, 15, { win: GLOWSTONE, every: 4, off: 2, side: false, roofH: 5, roof: BLACK, acc: PURPLE });
tower(9, 4, 2, 8, 12, { win: GLOWSTONE, every: 4, off: 2, side: false, roofH: 4, roof: PURPLE, acc: BLACK });

// ---------- details ----------
// waterfall + pool
for (let y = -1; y <= 6; y++) put(8, y, zf(8, y) - 1, WATER);
for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
  if (Math.hypot(dx, dz) <= 2.2) put(8 + dx, -1, zf(8, -1) - 2 + dz, WATER);
}
// rock spires at the foot of the cliff
const spires = [[-17, -14, 8], [-13, -16, 5], [16, -13, 7], [19, -9, 5]];
for (const [sx, sz, h] of spires) {
  for (let k = 0; k < h; k++) {
    const r = 1.4 * (1 - k / h) + 0.1;
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
      if (Math.hypot(dx, dz) <= r) put(sx + dx, -1 + k, sz + dz, hh(dx + k, dz + sx) > 0.6 ? GRAY : STONE);
    }
  }
}
// crescent moon behind the castle
for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) {
  if (Math.hypot(dx, dy) <= 3.6 && Math.hypot(dx - 1.6, dy - 0.8) > 3.1) put(12 + dx, 27 + dy, 20, GLOWSTONE);
}
// bats
const bats = [[-14, 29, -4], [-10, 31, 6], [14, 23, 8], [11, 28, 14], [5, 31, 12],
              [-4, 28, 16], [-17, 22, -12], [16, 20, -10]];
for (const [bx, by, bz] of bats) {
  put(bx - 2, by, bz, BLACK); put(bx - 1, by + 1, bz, BLACK); put(bx, by, bz, BLACK);
  put(bx + 1, by + 1, bz, BLACK); put(bx + 2, by, bz, BLACK); put(bx, by + 1, bz, BLACK);
}
// lightning
put(-13, 29, 2, ELECTRIC); put(14, 31, 0, ELECTRIC); put(-4, 32, 10, ELECTRIC);

// ---------- side walls and back wall ----------
for (let z = -6; z <= 3; z++) {
  for (const sx of [-9, 9]) {
    if (inTower(sx, z)) continue;
    for (let y = 8; y <= 11; y++) put(sx, y, z, wallId(sx, z, y));
    if ((z & 1) === 0) put(sx, 12, z, STONE);
  }
}
for (let x = -8; x <= 8; x++) {
  if (inTower(x, 4)) continue;
  for (let y = 8; y <= 11; y++) put(x, y, 4, wallId(x, 4, y));
  if ((x & 1) === 0) put(x, 12, 4, STONE);
}
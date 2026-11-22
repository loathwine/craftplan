// frost-phoenix-haiku55 — prompt:
// a frost phoenix...

const hash = (a, b, c) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const pickOf = (p) => (typeof p === 'function' ? p : () => p);

function ell(cx, cy, cz, rx, ry, rz, p) {
  const pick = pickOf(p);
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) block(x, y, z, pick(x, y, z));
      }
}

function ballAt(px, py, pz, r, p) {
  const pick = pickOf(p);
  const R = Math.ceil(r);
  const cx = Math.round(px), cy = Math.round(py), cz = Math.round(pz);
  for (let x = cx - R; x <= cx + R; x++)
    for (let y = cy - R; y <= cy + R; y++)
      for (let z = cz - R; z <= cz + R; z++) {
        const d = (x - px) * (x - px) + (y - py) * (y - py) + (z - pz) * (z - pz);
        if (d <= r * r + 0.01) block(x, y, z, pick(x, y, z));
      }
}

// 1. Clear a small local footprint of trees and raised grass (AIR is free)
for (let x = -9; x <= 9; x++)
  for (let z = -9; z <= 9; z++)
    if (x * x + z * z <= 81) cube(x, 0, z, x, 13, z, AIR);

// 2. Frozen crag the phoenix perches on (centered at x=0, z=1)
const cragCol = (x, y, z) => {
  const r = hash(x, y, z + 3);
  if (y >= 9) return r < 0.6 ? SNOW : ICE;
  if (y >= 5) return r < 0.25 ? ICE : (r < 0.6 ? STONE : COBBLE);
  return r < 0.15 ? ICE : (r < 0.6 ? STONE : COBBLE);
};
for (let y = -2; y <= 10; y++) {
  const R0 = y <= 0 ? 7.5 : 7.5 - 0.5 * y;
  for (let x = -9; x <= 9; x++)
    for (let z = -8; z <= 10; z++) {
      const dx = x, dz = z - 1;
      const d = Math.sqrt(dx * dx + dz * dz);
      const n = hash(x, y, z) - 0.5;
      if (d <= R0 + n * 1.6) block(x, y, z, cragCol(x, y, z));
    }
}

// 3. Ice spires ringing the crag base
function spire(sx, sz, h, r0) {
  for (let y = 0; y <= h; y++) {
    const rr = r0 * (1 - y / (h + 1));
    const R = Math.ceil(rr);
    for (let x = sx - R; x <= sx + R; x++)
      for (let z = sz - R; z <= sz + R; z++)
        if ((x - sx) * (x - sx) + (z - sz) * (z - sz) <= rr * rr + 0.5)
          block(x, y, z, y >= h - 1 ? SNOW : ICE);
  }
}
spire(-7, -3, 7, 1.8);
spire(7, -4, 6, 1.6);
spire(-8, 4, 5, 1.5);
spire(8, 5, 8, 1.9);
spire(-5, -7, 9, 1.6);
spire(5, -8, 6, 1.5);

// 4. Body, neck, head
ell(0, 14.5, 1, 3.4, 3.8, 4.6, (x, y, z) => {
  const q = hash(x, y, z);
  return q < 0.2 ? ICE : (q < 0.3 ? LIGHT_BLUE : WHITE);
});
ell(0, 18.6, -2.6, 1.9, 2.3, 1.9, (x, y, z) => (hash(x, y, z) < 0.25 ? ICE : SNOW));
ell(0, 21.6, -4.6, 2.4, 2.3, 2.4, (x, y, z) => (hash(x, y, z) < 0.85 ? WHITE : ICE));

// Face: glowing eyes, gold hooked beak, frost breath
block(-1, 22, -7, NEON_BLUE);
block(1, 22, -7, NEON_BLUE);
cube(0, 20, -7, 0, 20, -9, GOLD);
block(0, 21, -7, GOLD);
block(0, 21, -11, STEAM);
block(-1, 22, -12, STEAM);

// 5. Crest sweeping back from the head
for (let k = 0; k < 9; k++) {
  const y = Math.round(23 + k * 0.9);
  const z = Math.round(-3 + k * 1.0);
  const id = k < 4 ? CYAN : (k < 7 ? LIGHT_BLUE : ICE);
  block(0, y, z, id);
  if (k < 6) { block(-1, y, z, id); block(1, y, z, id); }
  if (k < 3) { block(-2, y, z, id); block(2, y, z, id); }
}

// 6. Talons clutching the crag
cube(-1, 11, -1, 1, 11, -1, IRON);

// 7. Wings spread wide and raised, feathers graded from snow at the leading edge to blue at the tips
function wing(s) {
  for (let i = 0; i <= 16; i++) {
    const x = s * (2 + i);
    const u = i / 16;
    const yTop = 18.5 + 10 * Math.pow(u, 1.2);
    const yBot = 14.5 + 5 * u + (i % 3 === 0 ? 1 : 0);
    const yb = Math.round(yBot), yt = Math.round(yTop);
    for (let y = yb; y <= yt; y++) {
      const t = (y - yBot) / Math.max(1, yTop - yBot);
      for (let z = -1; z <= 1; z++) {
        const r = hash(x, y, z + s * 7);
        let id;
        if (t > 0.75) id = r < 0.6 ? SNOW : WHITE;
        else if (t > 0.4) id = r < 0.5 ? ICE : LIGHT_BLUE;
        else id = (u > 0.55 && r < 0.6) ? BLUE : (r < 0.5 ? CYAN : LIGHT_BLUE);
        block(x, y, z, id);
      }
    }
  }
}
wing(-1);
wing(1);

// 8. Tail: a fan of nine long feathers rising behind the body
function tail() {
  const base = [0, 14.5, 4];
  for (let k = 0; k < 9; k++) {
    const a = -0.8 + k * 0.2;
    const tip = [Math.sin(a) * 10, 15 + 9 * Math.cos(a), 15];
    for (let s = 0; s <= 12; s++) {
      const t = s / 12;
      const px = base[0] + (tip[0] - base[0]) * t;
      const py = base[1] + (tip[1] - base[1]) * t;
      const pz = base[2] + (tip[2] - base[2]) * t;
      const r = t < 0.5 ? 1.0 : 0.75;
      ballAt(px, py, pz, r, (x, y, z) => {
        const q = hash(x, y, z + k);
        if (t < 0.35) return q < 0.5 ? SNOW : ICE;
        if (t < 0.7) return q < 0.5 ? LIGHT_BLUE : CYAN;
        return q < 0.6 ? CYAN : BLUE;
      });
    }
  }
}
tail();
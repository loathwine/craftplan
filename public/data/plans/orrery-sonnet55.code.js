// orrery-sonnet55 — prompt:
// a giant brass orrery of the solar system...

const M = new Map();
const put = (x, y, z, id) => {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
};
const D = Math.PI / 180;
const ringH = (cx, cy, cz, r, id) => {
  const n = Math.ceil(2 * Math.PI * r * 2);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    put(cx + r * Math.cos(t), cy, cz + r * Math.sin(t), id);
  }
};
const fillDisk = (cx, cy, cz, r, id) => {
  for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++)
    if (x * x + z * z <= r * r + 0.5) put(cx + x, cy, cz + z, id);
};
const ball = (cx, cy, cz, r, idFn) => {
  for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) for (let dz = -r; dz <= r; dz++) {
    if (dx * dx + dy * dy + dz * dz <= r * r + 0.5) {
      const id = typeof idFn === 'function' ? idFn(dx, dy, dz) : idFn;
      put(cx + dx, cy + dy, cz + dz, id);
    }
  }
};
const lineB = (x1, y1, z1, x2, y2, z2, id) => {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id);
  }
};
const ringXY = (cx, cy, cz, r, id) => {
  const n = Math.ceil(2 * Math.PI * r * 2);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    put(cx + r * Math.cos(t), cy + r * Math.sin(t), cz, id);
  }
};
const ringYZ = (cx, cy, cz, r, id) => {
  const n = Math.ceil(2 * Math.PI * r * 2);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    put(cx, cy + r * Math.sin(t), cz + r * Math.cos(t), id);
  }
};
const gear = (cx, cy, cz, r, n, id, id2) => {
  ringH(cx, cy, cz, r, id);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    put(cx + (r + 1) * Math.cos(t), cy, cz + (r + 1) * Math.sin(t), id2);
  }
};

// clear trees from the footprint
cylinder(0, 0, 0, 22, 9, AIR);

// ===== BASE =====
for (let y = -1; y <= 1; y++) ringH(0, y, 0, 21, COPPER);
ringH(0, 2, 0, 21, GOLD);
ringH(0, 0, 0, 19, OBSIDIAN);
ringH(0, 1, 0, 19, COPPER);
const zod = [RED, ORANGE, YELLOW, LIME, GREEN, CYAN, LIGHT_BLUE, BLUE, PURPLE, MAGENTA, PINK, WHITE];
for (let i = 0; i < 12; i++) {
  const t = (i * 30 + 15) * D;
  put(19 * Math.cos(t), 2, 19 * Math.sin(t), zod[i]);
}
for (let i = 0; i < 12; i++) {
  const t = (i * 30 + 15) * D;
  put(21 * Math.cos(t), 3, 21 * Math.sin(t), GLOWSTONE);
}
ringH(0, 0, 0, 7, OBSIDIAN);
ringH(0, 0, 0, 12, GOLD);
ringH(0, 0, 0, 17, OBSIDIAN);
for (let k = 0; k < 8; k++) {
  const t = k * 45 * D;
  lineB(5 * Math.cos(t), 0, 5 * Math.sin(t), 18 * Math.cos(t), 0, 18 * Math.sin(t), GOLD);
}
// gears
gear(0, 1, 0, 6, 30, GOLD, COPPER);
gear(0, 1, 0, 10, 26, COPPER, GOLD);
gear(0, 1, 0, 15, 36, GOLD, COPPER);

// pedestal
for (let y = 0; y <= 2; y++) fillDisk(0, y, 0, 4, COPPER);
ringH(0, 0, 0, 5, OBSIDIAN);
ringH(0, 1, 0, 5, OBSIDIAN);
fillDisk(0, 3, 0, 3, GOLD);
for (let y = 4; y <= 10; y++) fillDisk(0, y, 0, 1, COPPER);
ringH(0, 6, 0, 2, GOLD);
ringH(0, 9, 0, 2, GOLD);
// crank handle on the front
lineB(0, 2, -5, 0, 2, -9, GOLD);
lineB(0, 3, -9, 0, 5, -9, IRON);
ball(0, 6, -9, 1, RED);

// corner pillars with steam vents
for (let k = 0; k < 4; k++) {
  const t = (45 + k * 90) * D;
  const px = Math.round(16 * Math.cos(t)), pz = Math.round(16 * Math.sin(t));
  fillDisk(px, 1, pz, 2, GOLD);
  fillDisk(px, 2, pz, 2, GOLD);
  for (let y = 3; y <= 8; y++) fillDisk(px, y, pz, 1, COPPER);
  fillDisk(px, 9, pz, 2, GOLD);
  fillDisk(px, 10, pz, 1, IRON);
  put(px, 12, pz, STEAM);
}

// ===== SUN =====
ball(0, 14, 0, 3, GLOWSTONE);
ringXY(0, 14, 0, 4, GOLD);
ringYZ(0, 14, 0, 4, COPPER);

// ===== ORBITS =====
const planets = [
  { r: 5, a: 320, pr: 1, c: GRAY },
  { r: 7, a: 230, pr: 1, c: YELLOW },
  { r: 9, a: 285, pr: 2, c: BLUE, earth: true },
  { r: 11, a: 205, pr: 1, c: RED },
  { r: 14, a: 250, pr: 3, c: ORANGE, jup: true },
  { r: 16, a: 335, pr: 2, c: SAND, sat: true },
  { r: 18, a: 305, pr: 2, c: CYAN },
  { r: 20, a: 245, pr: 2, c: BLUE },
];
for (const p of planets) ringH(0, 14, 0, p.r, GOLD);
// spokes
for (let k = 0; k < 4; k++) {
  const t = k * 90 * D;
  lineB(4 * Math.cos(t), 14, 4 * Math.sin(t), 20 * Math.cos(t), 14, 20 * Math.sin(t), COPPER);
}
// asteroid belt
for (let i = 0; i < 46; i++) {
  const t = (i * 137.5 + 13) * D;
  const rr = 12.4 + ((i * 7) % 5) * 0.2;
  const yy = 14 + (i % 3 === 0 ? 1 : (i % 5 === 0 ? -1 : 0));
  put(rr * Math.cos(t), yy, rr * Math.sin(t), i % 2 ? LIGHT_GRAY : BROWN);
}

// planets and their supports
for (const p of planets) {
  const t = p.a * D;
  const px = Math.round(p.r * Math.cos(t)), pz = Math.round(p.r * Math.sin(t));
  lineB(px, 1, pz, px, 14 - p.pr - 1, pz, COPPER);
  ball(px, 1, pz, 1, GOLD);
  lineB(px, 6, pz, px, 6, pz, GOLD);
  if (p.jup) {
    ball(px, 14, pz, 3, (dx, dy, dz) => {
      if (dy === 0) return BROWN;
      if (Math.abs(dy) === 1) return SAND;
      return ORANGE;
    });
    put(px + 1, 13, pz - 2, RED); put(px + 2, 13, pz - 2, RED);
  } else if (p.earth) {
    ball(px, 14, pz, 2, (dx, dy, dz) => {
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 >= 3 && ((dx * 3 + dy * 5 + dz * 7) % 4 + 4) % 4 === 0) return GREEN;
      if (dy === 2) return WHITE;
      return BLUE;
    });
    // moon on a small arm
    put(px + 2, 14, pz, IRON);
    put(px + 3, 15, pz - 1, IRON);
    put(px + 4, 15, pz - 2, MARBLE);
    put(px + 4, 16, pz - 2, MARBLE);
    put(px + 5, 15, pz - 2, MARBLE);
  } else {
    ball(px, 14, pz, p.pr, p.c);
  }
  if (p.sat) {
    for (let i = 0; i < 160; i++) {
      const tt = (i / 160) * 2 * Math.PI;
      for (const rr of [4, 5]) {
        const dx = rr * Math.cos(tt), dz = rr * Math.sin(tt);
        put(px + dx, 14 + dx * 0.25, pz + dz, rr === 4 ? GOLD : COPPER);
      }
    }
  }
}

// ===== GREAT MERIDIAN BACKDROP =====
const MC = 17, MR = 15, MZ = 20;
for (let i = 0; i < 200; i++) {
  const t = (i / 200) * 2 * Math.PI;
  const x = MR * Math.cos(t), y = MC + MR * Math.sin(t);
  if (y >= 2) {
    put(x, y, MZ, GOLD);
    put(x, y, MZ + 1, COPPER);
  }
}
lineB(-MR, MC, MZ + 1, MR, MC, MZ + 1, GOLD);
lineB(0, 3, MZ + 1, 0, MC + MR - 1, MZ + 1, GOLD);
ball(0, MC, MZ, 2, GOLD);
ball(0, MC, MZ - 1, 1, GLOWSTONE);
for (let i = 0; i < 12; i++) {
  const t = (i * 30) * D;
  const x = 13 * Math.cos(t), y = MC + 13 * Math.sin(t);
  if (y >= 3) put(x, y, MZ, i % 3 === 0 ? RED : LIGHT_BLUE);
}
// support feet for the meridian
lineB(-3, 2, MZ, -6, 4, MZ, COPPER);
lineB(3, 2, MZ, 6, 4, MZ, COPPER);

// flush
let count = 0;
for (const v of M.values()) {
  if (count >= 3990) break;
  block(v[0], v[1], v[2], v[3]);
  count++;
}
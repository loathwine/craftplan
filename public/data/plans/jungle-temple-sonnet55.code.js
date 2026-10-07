// jungle-temple-sonnet55 — prompt:
// a jungle temple with a waterfall...

let N = 0;
const H = (x, y, z) => { const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return n - Math.floor(n); };
const put = (x, y, z, id) => {
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  if (id === AIR) { block(x, y, z, AIR); return; }
  if (N >= 3950) return;
  N++; block(x, y, z, id);
};
const box = (x1, y1, z1, x2, y2, z2, f) => {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++)
    put(x, y, z, typeof f === 'function' ? f(x, y, z) : f);
};
const ruin = (x, y, z) => { const r = H(x, y, z); return r < .42 ? STONE : r < .68 ? COBBLE : r < .84 ? LIGHT_GRAY : r < .95 ? GREEN : LIME; };
const stepMat = (x, y, z) => H(x, y, z) < .5 ? LIGHT_GRAY : STONE;
const cm = (x, y, z) => {
  const r = H(x, y, z);
  if (y % 7 === 3) return r < .5 ? GRAY : COBBLE;
  return r < .38 ? STONE : r < .62 ? COBBLE : r < .78 ? GRAY : r < .88 ? DIRT : r < .95 ? GREEN : LIME;
};

// ---- clear trees from key areas (free) ----
box(-15, 2, -13, 3, 14, 5, AIR);
box(2, 0, -1, 13, 7, 9, AIR);
box(3, 0, -22, 11, 5, -2, AIR);
box(-9, 0, -17, 4, 4, -13, AIR);

// ---- pyramid temple ----
for (let x = -14; x <= 2; x++) for (let z = -12; z <= 4; z++)
  if (x === -14 || x === 2 || z === -12 || z === 4) put(x, -1, z, COBBLE);
box(-14, 0, -12, 2, 1, 4, ruin);
box(-12, 2, -10, 0, 3, 2, ruin);
box(-10, 4, -8, -2, 5, 0, ruin);

// gold frieze + lamps on tier faces
for (let x = -12; x <= 0; x++) if ((x + 12) % 3 === 0 && (x < -8 || x > -4)) put(x, 3, -10, GOLD);
put(-13, 1, -12, GLOWSTONE); put(1, 1, -12, GLOWSTONE);
put(-11, 2, -10, GLOWSTONE); put(-1, 2, -10, GLOWSTONE);

// moss overgrowth on ledges
for (let x = -14; x <= 2; x++) for (let z = -12; z <= 4; z++) {
  const inT2 = x >= -12 && x <= 0 && z >= -10 && z <= 2;
  if (!inT2 && H(x, 9, z) < .2) put(x, 2, z, H(x, 1, z) < .5 ? LEAVES : LIME);
}
for (let x = -12; x <= 0; x++) for (let z = -10; z <= 2; z++) {
  const inT3 = x >= -10 && x <= -2 && z >= -8 && z <= 0;
  if (!inT3 && H(x, 8, z) < .22) put(x, 4, z, H(x, 2, z) < .5 ? LEAVES : LIME);
}
for (let x = -10; x <= -2; x++) for (let z = -8; z <= 0; z++) {
  const inS = x >= -9 && x <= -3 && z >= -7 && z <= -1;
  if (!inS && H(x, 7, z) < .3) put(x, 6, z, LEAVES);
}

// corner nubs
[[-14, -12], [2, -12], [-14, 4], [2, 4]].forEach(([x, z]) => {
  put(x, 2, z, COBBLE); put(x, 3, z, LIGHT_GRAY); put(x, 4, z, GOLD);
});

// stairs
box(-8, 0, -13, -4, 0, -13, stepMat);
box(-8, 1, -12, -4, 1, -12, stepMat);
box(-8, 2, -11, -4, 2, -11, stepMat);
box(-8, 3, -10, -4, 3, -10, stepMat);
box(-8, 4, -9, -4, 4, -9, stepMat);
box(-8, 5, -8, -4, 5, -8, stepMat);
// balustrades
[-9, -3].forEach(x => {
  box(x, 0, -13, x, 1, -13, COBBLE);
  put(x, 2, -12, COBBLE);
  box(x, 2, -11, x, 3, -11, COBBLE);
  put(x, 4, -10, COBBLE);
  box(x, 4, -9, x, 5, -9, COBBLE);
});

// shrine walls
for (let y = 6; y <= 9; y++) {
  for (let x = -9; x <= -3; x++) { put(x, y, -7, ruin(x, y, -7)); put(x, y, -1, ruin(x, y, -1)); }
  for (let z = -6; z <= -2; z++) { put(-9, y, z, ruin(-9, y, z)); put(-3, y, z, ruin(-3, y, z)); }
}
box(-7, 6, -7, -5, 8, -7, AIR);
for (let x = -9; x <= -3; x++) put(x, 9, -7, GOLD);
put(-8, 7, -7, GLOWSTONE); put(-4, 7, -7, GLOWSTONE);
put(-9, 8, -4, AIR); put(-3, 8, -4, AIR);
// portico columns
[-10, -8, -4, -2].forEach(x => {
  for (let y = 6; y <= 9; y++) put(x, y, -8, y === 9 ? GOLD : LIGHT_GRAY);
});
// altar
box(-7, 6, -3, -5, 6, -3, OBSIDIAN);
put(-6, 7, -3, GOLD); put(-6, 8, -3, GLOWSTONE);
// roof
box(-10, 10, -8, -2, 10, 0, ruin);
box(-9, 11, -7, -3, 11, -1, ruin);
box(-8, 12, -6, -4, 12, -2, STONE);
box(-7, 13, -5, -5, 13, -3, COBBLE);
put(-6, 14, -4, GOLD); put(-6, 15, -4, GOLD);
[[-10, -8], [-2, -8], [-10, 0], [-2, 0]].forEach(([x, z]) => put(x, 10, z, GOLD));

// braziers
const brazier = (x, y, z, n) => {
  for (let i = 0; i < n; i++) put(x, y + i, z, i % 2 ? COBBLE : LIGHT_GRAY);
  put(x, y + n, z, COPPER); put(x, y + n + 1, z, FIRE);
};
brazier(-13, 2, -11, 2); brazier(1, 2, -11, 2);
brazier(-11, 4, -10, 2); brazier(-1, 4, -10, 2);
brazier(-9, 0, -14, 3); brazier(-3, 0, -14, 3);

// ---- cliff ----
const prof = [[-11, 8], [-7, 11], [-3, 15], [0, 19], [3, 22], [7, 25], [11, 28], [14, 25], [17, 14]];
const ch = x => {
  for (let i = 0; i < prof.length - 1; i++) {
    const a = prof[i], b = prof[i + 1];
    if (x >= a[0] && x <= b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  }
  return 8;
};
const tops = {};
for (let x = -11; x <= 17; x++) {
  let top = Math.min(29, Math.round(ch(x) + (H(x, 2, 3) - .5) * 3));
  if (x === 2) top = 24;
  if (x >= 3 && x <= 6) top = 22;
  if (x === 7) top = Math.max(top, 25);
  tops[x] = top;
  for (let z = 9; z <= 10; z++) for (let y = -1; y <= top; y++)
    put(x, y, z, (y === top && !(x >= 3 && x <= 6)) ? GRASS : cm(x, y, z));
}
// basin + waterfall
box(3, 23, 9, 6, 23, 10, WATER);
box(2, 23, 11, 7, 24, 11, STONE);
box(3, -1, 8, 6, 23, 8, WATER);
// foreground ledges
[-2, -1, 0, 1, 2, 12, 13, 14, 15, 16].forEach(x => {
  const ht = 2 + Math.floor(H(x, 4, 4) * 5);
  for (let z = 7; z <= 8; z++) for (let y = -1; y <= ht; y++) put(x, y, z, ruin(x, y, z));
});

// ---- pool ----
for (let x = 1; x <= 13; x++) for (let z = -1; z <= 8; z++) {
  const e = Math.pow((x - 7.5) / 4.8, 2) + Math.pow((z - 3.8) / 4.7, 2);
  if (e <= 1 || (x >= 3 && x <= 6 && z >= 5)) put(x, -1, z, WATER);
  else if (e <= 1.45 && x > 2 && H(x, 5, z) < .5) {
    put(x, -1, z, ruin(x, -1, z));
    if (H(x, 6, z) < .25) put(x, 0, z, ruin(x, 0, z));
  }
}
for (let x = 3; x <= 6; x++) { put(x, -1, 7, SNOW); if (H(x, 3, 3) < .6) put(x, -1, 6, SNOW); }

// ---- river ----
for (let z = -1; z >= -22; z--) {
  const cx = Math.round(7.5 + 2.5 * Math.sin(z * 0.22));
  for (let dx = -1; dx <= 1; dx++) put(cx + dx, -1, z, WATER);
  if (H(z, 2, 2) < .25) put(H(z, 3, 3) < .5 ? cx - 2 : cx + 2, 0, z, ruin(cx, 0, z));
  if (H(z, 7, 7) < .3) put(cx + 2, 0, z, LIME);
}

// ---- path + rope bridge ----
box(-8, 0, -14, -4, 0, -14, stepMat);
box(-8, 0, -16, 4, 0, -15, stepMat);
box(5, 0, -17, 11, 0, -15, PLANKS);
for (let x = 5; x <= 11; x++) { put(x, 1, -17, OAK_LOG); put(x, 1, -15, OAK_LOG); }
[5, 11].forEach(x => { put(x, 2, -17, OAK_LOG); put(x, 2, -15, OAK_LOG); });

// ---- jungle trees ----
const tree = (x, z, y0, h, r, vines) => {
  for (let y = y0; y <= y0 + h; y++) put(x, y, z, OAK_LOG);
  if (y0 === 0) { put(x + 1, 0, z, OAK_LOG); put(x - 1, 0, z, OAK_LOG); put(x, 0, z + 1, OAK_LOG); put(x, 0, z - 1, OAK_LOG); }
  const cy = y0 + h;
  const lay = (y, rr) => {
    for (let dx = -rr; dx <= rr; dx++) for (let dz = -rr; dz <= rr; dz++) {
      if (dx * dx + dz * dz > rr * rr + 1) continue;
      if (H(x + dx, y, z + dz) < .2) continue;
      put(x + dx, y, z + dz, H(dx, y, dz) < .3 ? LIME : LEAVES);
    }
  };
  lay(cy - 1, r - 1); lay(cy, r); lay(cy + 1, r - 2);
  for (let i = 0; i < vines; i++) {
    const a = i * 1.9 + x;
    const vx = x + Math.round(Math.cos(a) * (r - 1)), vz = z + Math.round(Math.sin(a) * (r - 1));
    const l = 2 + Math.floor(H(vx, 1, vz) * 4);
    for (let k = 1; k <= l; k++) put(vx, cy - 1 - k, vz, k % 2 ? GREEN : LEAVES);
  }
};
tree(-18, -6, 0, 15, 4, 3);
tree(13, -9, 0, 13, 3, 3);
tree(-17, 7, 0, 18, 4, 3);
tree(-1, 9, tops[-1] + 1, 4, 3, 0);
tree(11, 9, Math.min(30, tops[11] + 1), 2, 3, 0);

// ---- vines & finishing touches ----
for (let z = -7; z <= -1; z++) {
  [-10, -2].forEach(x => {
    if (H(x, 3, z) < .55) {
      const l = 1 + Math.floor(H(z, 3, x) * 4);
      for (let k = 0; k < l; k++) put(x, 9 - k, z, k % 2 ? LIME : LEAVES);
    }
  });
}
[-9, -3].forEach(x => { for (let k = 0; k < 3; k++) put(x, 8 - k, -9, k % 2 ? LIME : LEAVES); });
for (let x = -11; x <= 17; x++) {
  if (x >= 3 && x <= 6) continue;
  if (H(x, 5, 5) < .45) {
    const len = 3 + Math.floor(H(x, 6, 6) * 7);
    for (let k = 1; k <= len; k++) put(x, tops[x] - k, 8, k % 3 ? LEAVES : LIME);
  }
  if (H(x, 8, 8) < .35) put(x, tops[x] + 1, 9, LEAVES);
}
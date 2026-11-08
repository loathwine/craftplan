// flying-city-haiku55 — prompt:
// a steampunk flying city...

// ===== Steampunk flying city =====
const hash = (a, b, c) => {
  let h = Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const pickOf = (x, z, salt, a, b) => (hash(x, z, salt) < 0.5 ? a : b);

// Paint the ring rIn < d <= rOut around (cx, cz) at height y.
// pal: block id, or (dx, dz, d) => id | null (null = leave alone)
function annulus(cx, y, cz, rIn, rOut, pal) {
  const R = Math.ceil(rOut);
  for (let dx = -R; dx <= R; dx++) {
    for (let dz = -R; dz <= R; dz++) {
      const d = Math.hypot(dx, dz);
      if (d <= rIn || d > rOut + 1e-9) continue;
      const id = typeof pal === 'function' ? pal(dx, dz, d) : pal;
      if (id !== null && id !== undefined) block(cx + dx, y, cz + dz, id);
    }
  }
}

// ---- 1. Floating island rock (inverted cone underside) ----
const ROCK = [[12, 10], [11, 8.5], [10, 7], [9, 5], [8, 3], [7, 1.5]];
for (const [y, r] of ROCK) {
  annulus(0, y, 0, -1, r, (x, z) =>
    y >= 10 ? pickOf(x, z + y, 1, STONE, COBBLE) : pickOf(x, z + y, 2, GRAY, COBBLE));
}

// ---- 2. Tether chains down to the ground ----
for (const [cx, cz] of [[9, 0], [-9, 0], [0, 9], [0, -9]]) {
  for (let y = 0; y <= 11; y++) block(cx, y, cz, y % 2 === 0 ? IRON : GRAY);
}

// ---- 3. Deck, copper rim, railing ----
annulus(0, 13, 0, -1, 10.3, (x, z) => (z % 3 === 0 ? BROWN : PLANKS));
annulus(0, 13, 0, 10.3, 11.3, COPPER);
annulus(0, 14, 0, 10.3, 11.3, (x, z) => (Math.abs(x + z) % 2 === 0 ? IRON : null));
for (const [x, z] of [[11, 0], [-11, 0], [0, 11], [0, -11]]) block(x, 14, z, GLOWSTONE);

// Walkway ring + rails around central tower
annulus(0, 18, 0, 4.0, 6.0, PLANKS);
annulus(0, 19, 0, 5.6, 6.0, (x, z) => (Math.abs(x + z) % 2 === 0 ? IRON : null));

// ---- 4. Central tower (y 14..33) ----
const WIN = [[4, 0], [-4, 0], [0, 4], [0, -4]];
for (let y = 14; y <= 26; y++) {
  annulus(0, y, 0, 2.5, 4.0, y === 19 || y === 23 ? COPPER : BRICK);
}
for (const y of [16, 17, 20, 21]) for (const [x, z] of WIN) block(x, y, z, GLASS);
annulus(0, 18, 0, -1, 2.5, PLANKS);
annulus(0, 22, 0, -1, 2.5, PLANKS);
annulus(0, 27, 0, -1, 4.3, COPPER);
annulus(0, 28, 0, -1, 2.2, COPPER);
annulus(0, 29, 0, -1, 2.2, GOLD);
annulus(0, 30, 0, -1, 2.2, COPPER);
annulus(0, 31, 0, -1, 1.2, IRON);
block(0, 32, 0, IRON);
block(0, 33, 0, ELECTRIC);
block(1, 33, 0, ELECTRIC);

// Clock face on the north (front) side
for (let dx = -2; dx <= 2; dx++) {
  for (let dy = -2; dy <= 2; dy++) {
    const d = Math.hypot(dx, dy);
    if (d <= 2.3) block(dx, 22 + dy, -5, d <= 1.5 ? WHITE : IRON);
  }
}
block(0, 22, -5, GOLD);
block(0, 23, -5, BLACK);
block(0, 24, -5, BLACK);
block(1, 22, -5, BLACK);
block(2, 22, -5, BLACK);

// Doorway carved into the front wall
block(0, 14, -4, AIR);
block(0, 15, -4, AIR);

// ---- 5. Brass gear on the east flank ----
for (let dy = -3; dy <= 3; dy++) {
  for (let dz = -3; dz <= 3; dz++) {
    const d = Math.hypot(dy, dz);
    const ang = Math.atan2(dz, dy);
    const tooth = Math.floor((ang + Math.PI) / (Math.PI / 4)) % 2 === 0;
    if (d <= 0.9) block(5, 23 + dy, dz, GOLD);
    else if (d <= 1.9) block(5, 23 + dy, dz, IRON);
    else if (d <= 2.7 && tooth) block(5, 23 + dy, dz, IRON);
  }
}

// ---- 6. Boilers, smokestacks, steam ----
for (const sx of [-3, 3]) {
  cube(sx - 2, 14, 4, sx + 2, 15, 6, COPPER);
  for (let y = 14; y <= 20; y++) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dz === 0) continue;
        block(sx + dx, y, 5 + dz, y === 18 ? GOLD : IRON);
      }
    }
  }
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) block(sx + dx, 21, 5 + dz, IRON);
  block(sx, 22, 5, STEAM);
  block(sx, 24, 5, STEAM);
}

// ---- 7. Four side towers with sky bridges ----
const TOWERS = [[-7, -5], [7, -5], [-7, 6], [7, 6]];
for (const [tx, tz] of TOWERS) {
  for (let y = 14; y <= 23; y++) annulus(tx, y, tz, 1.0, 2.2, y % 4 === 2 ? COPPER : BRICK);
  annulus(tx, 18, tz, -1, 1.2, PLANKS);
  for (const y of [16, 20]) {
    block(tx + 2, y, tz, GLASS);
    block(tx - 2, y, tz, GLASS);
  }
  annulus(tx, 24, tz, -1, 2.3, COPPER);
  annulus(tx, 25, tz, -1, 1.2, BRICK);
  block(tx, 25, tz, GLOWSTONE);
  block(tx, 26, tz, GOLD);
}
for (const [tx, tz] of TOWERS) {
  const L = Math.hypot(tx, tz);
  const ux = tx / L, uz = tz / L;
  for (let t = 5.5; t <= L - 1.0; t += 0.5) {
    block(Math.round(ux * t), 18, Math.round(uz * t), PLANKS);
  }
}

// ---- 8. Deck cannon and crates (foreground) ----
block(3, 14, -8, IRON);
block(3, 15, -8, IRON);
block(3, 15, -9, IRON);
block(3, 15, -10, BLACK);
block(-6, 14, -8, PLANKS);
block(-6, 15, -8, PLANKS);
block(-5, 14, -8, BROWN);

// ---- 9. Airship moored above the west side ----
const BX = -13, BY = 27, BZ = 12, HA = 8, HB = 4, HC = 4;
for (let x = -21; x <= -5; x++) {
  for (let y = 23; y <= 31; y++) {
    for (let z = 8; z <= 16; z++) {
      const f = ((x - BX) / HA) ** 2 + ((y - BY) / HB) ** 2 + ((z - BZ) / HC) ** 2;
      if (f >= 0.7 && f <= 1.12) block(x, y, z, Math.abs(x) % 4 === 0 ? GOLD : COPPER);
    }
  }
}
// Gondola
cube(-15, 19, 10, -11, 19, 14, PLANKS);
cube(-15, 22, 10, -11, 22, 14, IRON);
for (let y = 20; y <= 21; y++) {
  for (let x = -15; x <= -11; x++) {
    for (let z = 10; z <= 14; z++) {
      const edge = x === -15 || x === -11 || z === 10 || z === 14;
      if (!edge) continue;
      const mid = (x === -13 && (z === 10 || z === 14)) || (z === 12 && (x === -15 || x === -11));
      block(x, y, z, mid ? GLASS : PLANKS);
    }
  }
}
for (const [x, z] of [[-15, 10], [-11, 10], [-15, 14], [-11, 14]]) block(x, 23, z, IRON);
// Tail fins
cube(-4, 27, 12, -4, 31, 12, IRON);
cube(-4, 27, 10, -4, 27, 14, IRON);
// Nose propeller
for (let t = -2; t <= 2; t++) {
  block(-22, 27, 12 + t, IRON);
  block(-22, 27 + t, 12, IRON);
}
block(-22, 27, 12, GOLD);

// ---- 10. Background floating islets (south, far side) ----
function islet(cx, cy, cz, r) {
  for (let dy = -r; dy <= 1; dy++) {
    const rr = dy === 1 ? r - 1 : dy === 0 ? r : r * (1 - (-dy) / (r + 1.5));
    const R = Math.ceil(rr + 0.3);
    for (let dx = -R; dx <= R; dx++) {
      for (let dz = -R; dz <= R; dz++) {
        if (Math.hypot(dx, dz) > rr + 0.3) continue;
        const id = dy === 1 ? GRASS : dy === 0 ? DIRT : pickOf(cx + dx, cz + dz + dy, 9, STONE, COBBLE);
        block(cx + dx, cy + dy, cz + dz, id);
      }
    }
  }
  for (let y = 2; y <= 4; y++) block(cx, cy + y, cz, OAK_LOG);
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (dx * dx + dy * dy + dz * dz > 5) continue;
        if (dx === 0 && dz === 0 && dy <= 0) continue;
        block(cx + dx, cy + 4 + dy, cz + dz, LEAVES);
      }
    }
  }
}
islet(16, 20, 17, 3);
islet(-18, 21, 19, 3);
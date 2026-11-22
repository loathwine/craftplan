// st-basils-haiku55 — prompt:
// St. Basil's Cathedral in the snow...

// St. Basil's Cathedral in the snow. Front faces north (-Z).
const BUDGET = 3900;
const M = new Map();   // "x,y,z" -> block id (last write wins)
let solids = 0;        // unique non-AIR cells, guarded against the budget

function put(x, y, z, id) {
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  const old = M.has(k) ? M.get(k) : undefined;
  if (id === AIR) {
    if (old !== undefined && old !== AIR) solids--;
    M.set(k, AIR);
    return;
  }
  if (old === undefined || old === AIR) {
    if (solids >= BUDGET) return;
    solids++;
  }
  M.set(k, id);
}

// f is either a constant id or a function (x, y, z) -> id | null (null = skip)
function fill(x1, y1, z1, x2, y2, z2, f) {
  for (let y = y1; y <= y2; y++)
    for (let x = x1; x <= x2; x++)
      for (let z = z1; z <= z2; z++) {
        const id = typeof f === 'function' ? f(x, y, z) : f;
        if (id !== null && id !== undefined) put(x, y, z, id);
      }
}

// Filled round slice centred on (cx, cz) at height y. f(dx, dz) -> id | null
function layer(cx, y, cz, r, f) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++)
    for (let dz = -R; dz <= R; dz++)
      if (dx * dx + dz * dz <= r * r + 0.01) {
        const id = f(dx, dz);
        if (id !== null && id !== undefined) put(cx + dx, y, cz + dz, id);
      }
}

// 8 angular sectors, used for spiral stripes on domes and spire
function sector(dx, dz) {
  const a = Math.atan2(dz, dx);
  return Math.floor((a + Math.PI) / (Math.PI / 4)) % 8;
}

// ---- 1. Clear trees and hills over the footprint (AIR is free) ----
fill(-10, 1, -8, 10, 7, 8, AIR);

// ---- 2. Site: stone rim, snow courtyard, snowy ground ring ----
fill(-10, 0, -8, 10, 0, 8, (x, y, z) =>
  (x === -10 || x === 10 || z === -8 || z === 8) ? STONE : SNOW);
fill(-13, -1, -11, 13, -1, 11, (x, y, z) =>
  (Math.abs(x) <= 10 && Math.abs(z) <= 8) ? null : SNOW);

// Cobbled approach from the north, trees cleared
fill(-1, -1, -13, 1, -1, -9, COBBLE);
fill(-1, 0, -13, 1, 3, -9, AIR);

// ---- 3. Central tower with tent spire ----
fill(-3, 1, -3, 3, 14, 3, (x, y, z) => {
  if (!(x === -3 || x === 3 || z === -3 || z === 3)) return null;
  if (y <= 2) return BRICK;
  if (y === 4 || y === 5 || y === 10) return RED;
  if (y === 14) return GOLD;
  return MARBLE;
});
// tall windows on each face, two of them lit
for (let y = 7; y <= 9; y++) {
  put(0, y, -3, AIR); put(0, y, 3, AIR);
  put(-3, y, 0, AIR); put(3, y, 0, AIR);
}
put(0, 8, -3, GLOWSTONE);
put(0, 8, 3, GLOWSTONE);

// gold-edged snowy roof of the tower
fill(-3, 15, -3, 3, 15, 3, (x, y, z) =>
  (Math.abs(x) === 3 || Math.abs(z) === 3) ? GOLD : SNOW);

// tent spire: spiralled green and gold, tapering to a point
for (let y = 16; y <= 28; y++) {
  const r = 3.0 * (1 - (y - 16) / 13.5);
  layer(0, y, 0, r, (dx, dz) => ((sector(dx, dz) + y) % 3 === 0 ? GOLD : GREEN));
}
put(0, 29, 0, GOLD);
put(0, 30, 0, GOLD);
put(0, 31, 0, IRON);

// ---- 4. Chapels with onion domes ----
function chapel(cx, cz, Hb, body, trim, d1, d2, door) {
  const x1 = cx - 2, x2 = cx + 2, z1 = cz - 2, z2 = cz + 2;

  // body walls (edges only), trim bands at base and just below the roof
  fill(x1, 1, z1, x2, Hb, z2, (x, y, z) => {
    if (!(x === x1 || x === x2 || z === z1 || z === z2)) return null;
    return (y === 1 || y === Hb - 1) ? trim : body;
  });

  // two-high windows at the centre of each face
  for (const y of [3, 4]) {
    put(cx, y, z1, AIR);
    put(cx, y, z2, AIR);
    put(x1, y, cz, AIR);
    put(x2, y, cz, AIR);
  }
  if (door) {
    put(cx, 1, z1, AIR);
    put(cx, 2, z1, AIR);
  }

  // roof slab: trim edge, snow-capped interior
  fill(x1, Hb + 1, z1, x2, Hb + 1, z2, (x, y, z) =>
    (x === x1 || x === x2 || z === z1 || z === z2) ? trim : SNOW);

  // drum
  fill(cx - 1, Hb + 2, cz - 1, cx + 1, Hb + 3, cz + 1, trim);

  // onion dome: bulge, taper, spiralled stripes, gold tip
  const radii = [1.6, 2.2, 2.5, 2.2, 1.6, 1.0, 0.5];
  radii.forEach((r, k) => {
    layer(cx, Hb + 4 + k, cz, r, (dx, dz) => {
      if (k === 6) return GOLD;
      return ((sector(dx, dz) + k) % 2 === 0) ? d1 : d2;
    });
  });
  put(cx, Hb + 11, cz, IRON);
}

// corners
chapel(-7, -5, 9, WHITE, RED, GREEN, YELLOW, false);
chapel(7, -5, 9, WHITE, BLUE, ORANGE, WHITE, false);
chapel(-7, 5, 9, WHITE, PURPLE, BLUE, LIME, false);
chapel(7, 5, 9, WHITE, GREEN, PURPLE, YELLOW, false);
// sides and rear
chapel(0, -6, 12, MARBLE, RED, BLUE, GOLD, true);   // tallest, the entrance
chapel(0, 6, 8, WHITE, ORANGE, RED, PINK, false);
chapel(-8, 0, 7, WHITE, BLUE, MAGENTA, GREEN, false);
chapel(8, 0, 7, WHITE, PURPLE, YELLOW, CYAN, false);

// ---- 5. Snow-laden conifers for foreground and background depth ----
function pine(cx, cz, h) {
  for (let y = 0; y < h; y++) put(cx, y, cz, OAK_LOG);
  const radii = [2.2, 1.8, 1.4, 0.9];
  radii.forEach((r, k) => {
    layer(cx, h + k, cz, r, (dx, dz) =>
      (Math.abs(dx + dz + k) % 3 === 0) ? SNOW : LEAVES);
  });
  put(cx, h + radii.length, cz, SNOW);
}
pine(-15, -2, 4);
pine(15, -2, 4);
pine(-16, 8, 3);
pine(16, 8, 3);
pine(-9, 15, 3);
pine(10, 16, 4);
pine(-14, -12, 3);
pine(13, -13, 3);

// ---- 6. Emit: solids first so a truncated run keeps the structure ----
function emit(k, id) {
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], id);
}
for (const [k, id] of M) if (id !== AIR) emit(k, id);
for (const [k, id] of M) if (id === AIR) emit(k, id);
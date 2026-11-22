// aurora-cabin-haiku55 — prompt:
// a log cabin under the northern lights...

// ===== Log cabin under the northern lights =====
// Origin: player's feet. Cabin front (door) faces north (-Z). Aurora sits south (+Z), behind the cabin.

// ---------- helpers ----------
function hash(a, b, c) {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

// Stepped pine tree: trunk, tiered leaf disks shrinking upward, snow tip
function pine(cx, cz, base, h) {
  line(cx, base, cz, cx, base + h, cz, OAK_LOG);
  for (let y = base + 2; y <= base + h; y++) {
    const t = (y - (base + 2)) / Math.max(1, h - 2);
    const r = Math.round(3.2 * (1 - t));
    if (r <= 0) block(cx, y, cz, LEAVES);
    else disk(cx, y, cz, r, LEAVES);
  }
  block(cx, base + h + 1, cz, SNOW);
}

// Wavy aurora curtain: vertical columns, 2 blocks thick, colour bands by height
function curtain(z, phase) {
  for (let x = -22; x <= 22; x++) {
    const bottom = Math.round(16 + 2.5 * Math.sin(x * 0.22 + phase));
    const top = Math.min(32, Math.round(27 + 4 * Math.sin(x * 0.17 + phase * 1.7) + 2 * Math.sin(x * 0.5 + phase)));
    for (let y = bottom; y <= top; y++) {
      for (let dz = 0; dz < 2; dz++) {
        const h = hash(x, y, z + dz + phase);
        if (h > 0.82) continue; // ragged, shimmering edges
        const band = (y - bottom) / Math.max(1, top - bottom);
        let id = band < 0.35 ? LIME : band < 0.7 ? CYAN : PURPLE;
        if (h < 0.1) id = LIGHT_BLUE;
        block(x, y, z + dz, id);
      }
    }
  }
}

// ---------- 1. clear the site (AIR is free) ----------
cube(-7, 1, -8, 7, 10, 6, AIR);

// ---------- 2. foundation and floor ----------
cube(-5, -2, -3, 5, -1, 4, COBBLE);
cube(-5, 0, -3, 5, 0, 4, PLANKS);
cube(-2, 0, -2, 1, 0, -1, RED); // rug

// ---------- 3. log walls (y 1..4) ----------
cube(-5, 1, -3, 5, 4, -3, OAK_LOG); // front (north)
cube(-5, 1, 4, 5, 4, 4, OAK_LOG);   // back (south)
cube(-5, 1, -3, -5, 4, 4, OAK_LOG); // west
cube(5, 1, -3, 5, 4, 4, OAK_LOG);   // east

// Protruding log ends at the corners, alternating courses
for (const y of [1, 3]) {
  block(-6, y, -3, OAK_LOG);
  block(6, y, 4, OAK_LOG);
}
for (const y of [2, 4]) {
  block(6, y, -3, OAK_LOG);
  block(-6, y, 4, OAK_LOG);
}

// ---------- 4. door, windows, sills ----------
cube(-1, 1, -3, 0, 2, -3, AIR);       // door opening
cube(-4, 2, -3, -3, 3, -3, GLASS);    // front windows
cube(2, 2, -3, 3, 3, -3, GLASS);
cube(-5, 2, 0, -5, 3, 1, GLASS);      // side windows
cube(5, 2, 0, 5, 3, 1, GLASS);
cube(0, 2, 4, 1, 3, 4, GLASS);        // back window
cube(-4, 1, -4, -3, 1, -4, PLANKS);   // window sills
cube(2, 1, -4, 3, 1, -4, PLANKS);

// ---------- 5. porch with lanterns ----------
cube(-2, -2, -6, 2, -1, -4, COBBLE);  // porch footing
cube(-2, 0, -6, 2, 0, -4, PLANKS);    // porch deck
block(-2, 1, -6, OAK_LOG);
block(2, 1, -6, OAK_LOG);
block(-2, 2, -6, GLOWSTONE);
block(2, 2, -6, GLOWSTONE);
line(-2, 3, -6, 2, 3, -6, OAK_LOG);   // beam
cube(-3, 4, -7, 3, 4, -4, COBBLE);    // porch roof

// ---------- 6. stepped gable roof (ridge along Z) with snowy eaves ----------
for (let k = 0; k <= 5; k++) {
  const a = -(6 - k);
  const b = 6 - k;
  const y = 5 + k;
  for (let z = -4; z <= 5; z++) {
    line(a, y, z, b, y, z, (z + k) % 2 === 0 ? GRAY : COBBLE);
  }
  cube(a, y + 1, -4, a, y + 1, 5, SNOW);
  cube(b, y + 1, -4, b, y + 1, 5, SNOW);
}
line(0, 11, -4, 0, 11, 5, SNOW); // ridge snow

// ---------- 7. fireplace and chimney ----------
cube(-4, 1, 3, -2, 4, 3, COBBLE);     // fireplace mass
block(-3, 1, 3, FIRE);                // hearth fire
block(-3, 2, 3, AIR);                 // firebox opening
cube(-4, 0, 1, -2, 0, 2, COBBLE);     // hearth stone
cube(-4, 5, 2, -2, 11, 3, BRICK);     // chimney shaft
cube(-4, 12, 2, -2, 12, 3, COBBLE);   // chimney cap
block(-3, 13, 2, STEAM);              // smoke plume

// ---------- 8. interior furniture ----------
// bed (head against back wall)
cube(3, 1, 1, 4, 1, 3, PLANKS);
cube(3, 2, 1, 4, 2, 2, WHITE);
cube(3, 2, 3, 4, 2, 3, RED);
// table, stool, candle
cube(-2, 2, 0, -1, 2, 0, PLANKS);
block(-2, 1, 0, OAK_LOG);
block(-1, 1, 0, OAK_LOG);
block(0, 1, 0, OAK_LOG);
block(-2, 3, 0, YELLOW);
// chest
block(-4, 1, -1, BROWN);
// ceiling lamps
block(-4, 4, -2, GLOWSTONE);
block(3, 4, -2, GLOWSTONE);

// ---------- 9. outside details ----------
cube(7, 0, -2, 9, 0, -2, OAK_LOG);    // woodpile
cube(7, 1, -2, 8, 1, -2, OAK_LOG);
cube(-1, 0, -14, 1, 0, -7, COBBLE);   // stone path toward the viewer
block(-2, 1, -9, OAK_LOG);            // path lanterns
block(-2, 2, -9, GLOWSTONE);
block(2, 1, -9, OAK_LOG);
block(2, 2, -9, GLOWSTONE);

// ---------- 10. pine trees framing the cabin ----------
pine(-12, -3, 0, 7);
pine(-9, 5, 0, 6);
pine(-15, 2, 0, 8);
pine(10, -6, 0, 7);
pine(13, 3, 0, 8);
pine(11, 9, 0, 6);
pine(-6, -9, 0, 6);
pine(16, -10, 0, 7);
pine(-17, -9, 0, 6);
pine(-4, 11, 0, 7);
pine(5, 12, 0, 6);
pine(-20, 8, 0, 8);
pine(19, 6, 0, 7);

// ---------- 11. northern lights (behind the cabin, +Z) ----------
curtain(14, 0.0);
curtain(18, 2.1);

// stars
for (let x = -20; x <= 20; x++) {
  for (let y = 27; y <= 32; y++) {
    if (hash(x, y, 7) > 0.96) block(x, y, 21, WHITE);
  }
}
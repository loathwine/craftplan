// submarine-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Submarine — bow (nose) points north, -Z, toward camera =====
const HULL = COBBLE;
const STRIPE = BRICK;
const TOWER = STONE;
const DECK = PLANKS;
const WINDOW = GLASS;
const METAL = STONE;

const cx = 0, cy = 6;

function radiusAt(z) {
  if (z <= -15) return 0;
  if (z < -8) {
    const t = (z + 15) / 7;
    return 0.6 + t * 3.4;
  }
  if (z <= 10) return 4;
  if (z < 16) {
    const t = (z - 10) / 6;
    return 4 - t * 2.5;
  }
  if (z <= 19) return 1.5;
  if (z <= 21) return 0.8;
  return 0;
}

// ---- Hull (horizontal cylinder shell built slice-by-slice along Z) ----
for (let z = -15; z <= 21; z++) {
  const r = radiusAt(z);
  if (r <= 0) continue;
  const solid = r < 2.2;
  const rInner = r - 1.4;
  const span = Math.ceil(r);
  for (let dx = -span; dx <= span; dx++) {
    for (let dy = -span; dy <= span; dy++) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r + 0.3) continue;
      if (!solid && dist < rInner) continue;
      let id = HULL;
      if (dy <= -r * 0.3 && dy >= -r * 0.65) id = STRIPE; // waterline stripe
      block(cx + dx, cy + dy, z, id);
    }
  }
}

// ---- Portholes along mid-hull, both sides ----
for (let z = -6; z <= 9; z += 3) {
  block(cx + 4, cy, z, WINDOW);
  block(cx - 4, cy, z, WINDOW);
  block(cx + 4, cy + 1, z, WINDOW);
  block(cx - 4, cy + 1, z, WINDOW);
}

// ---- Deck walkway strip along hull top ----
cube(cx - 1, cy + 4, -8, cx + 1, cy + 4, 10, DECK);

// ---- Conning tower (sail) ----
const towerCz = 1, towerR = 2.2, towerH = 7;
const towerBaseY = cy + 4;
for (let dy = 0; dy < towerH; dy++) {
  const y = towerBaseY + dy;
  for (let dx = -3; dx <= 3; dx++) {
    for (let dz = -3; dz <= 3; dz++) {
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > towerR + 0.3) continue;
      if (dy > 0 && dy < towerH - 1 && dist < towerR - 1.3) continue;
      block(cx + dx, y, towerCz + dz, TOWER);
    }
  }
}
// open hatch on tower roof
block(cx, towerBaseY + towerH - 1, towerCz, AIR);
// tower windows front + sides
block(cx, towerBaseY + 3, towerCz - 2, WINDOW);
block(cx + 2, towerBaseY + 3, towerCz, WINDOW);
block(cx - 2, towerBaseY + 3, towerCz, WINDOW);

// periscopes
line(cx - 1, towerBaseY + towerH, towerCz - 1, cx - 1, towerBaseY + towerH + 3, towerCz - 1, OAK_LOG);
line(cx + 1, towerBaseY + towerH, towerCz + 1, cx + 1, towerBaseY + towerH + 3, towerCz + 1, OAK_LOG);
block(cx - 1, towerBaseY + towerH + 3, towerCz - 1, WINDOW);
block(cx + 1, towerBaseY + towerH + 3, towerCz + 1, WINDOW);

// ---- Forward deck gun ----
cube(cx - 1, cy + 5, -4, cx + 1, cy + 5, -3, METAL); // mount base
cylinder(cx, cy + 6, -3, 1, 2, METAL);               // pivot
line(cx, cy + 7, -3, cx, cy + 7, -9, OAK_LOG);        // barrel toward bow

// ---- Bow diving planes ----
cube(-7, cy - 1, -7, -5, cy + 1, -6, HULL);
cube(5, cy - 1, -7, 7, cy + 1, -6, HULL);

// ---- Stern planes / rudder (cross) ----
cube(-4, cy - 1, 16, -2, cy + 1, 17, HULL);
cube(2, cy - 1, 16, 4, cy + 1, 17, HULL);
cube(cx - 1, cy + 2, 16, cx + 1, cy + 5, 17, HULL);
cube(cx - 1, cy - 5, 16, cx + 1, cy - 2, 17, HULL);

// ---- Propeller ----
cube(cx - 1, cy + 1, 21, cx + 1, cy + 3, 21, OAK_LOG);
cube(cx - 1, cy - 3, 21, cx + 1, cy - 1, 21, OAK_LOG);
cube(cx + 1, cy - 1, 21, cx + 3, cy + 1, 21, OAK_LOG);
cube(cx - 3, cy - 1, 21, cx - 1, cy + 1, 21, OAK_LOG);
block(cx, cy, 22, METAL);

// ---- Sea surface around the hull ----
for (let z = -16; z <= 21; z++) {
  const r = radiusAt(z);
  for (let x = -10; x <= 10; x++) {
    if (Math.abs(x - cx) <= r + 0.5) continue;
    block(x, 2, z, GLASS);
  }
}
```

// pokeball-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== Giant Poké Ball scene: 1 giant + 2 scattered minis for scale/depth =====

function clearCanopy(cx, cz, radius, topY) {
  cylinder(cx, 1, cz, radius, topY, AIR);
}

function foundation(cx, cy, cz, r) {
  disk(cx, cy, cz, r + 1, DIRT);
}

function buildPokeball(cx, cy, cz, r, addShine) {
  const bandHalf = Math.max(1, Math.round(r * 0.14));
  for (let y = cy - r; y <= cy + r; y++) {
    const dy = y - cy;
    const inside = r * r - dy * dy;
    if (inside < 0) continue;
    const rad = Math.floor(Math.sqrt(inside) + 0.5);
    if (rad < 0) continue;
    let color;
    if (dy > bandHalf) color = BRICK;      // red top hemisphere
    else if (dy < -bandHalf) color = SNOW; // white bottom hemisphere
    else color = COBBLE;                   // dark equator band
    disk(cx, y, cz, rad, color);
  }

  // front button, mounted on the band, facing north (-Z) toward camera
  const ringR = Math.max(1, Math.round(r * 0.3));
  disk(cx, cy, cz - r - 1, ringR, COBBLE);
  if (ringR > 1) disk(cx, cy, cz - r - 1, ringR - 1, SNOW);
  block(cx, cy, cz - r - 2, GLASS); // tiny shine dot

  // small hinge studs either side of the button
  if (r >= 6) {
    block(cx - Math.round(r * 0.55), cy, cz - r, COBBLE);
    block(cx + Math.round(r * 0.55), cy, cz - r, COBBLE);
  }

  // gloss highlight on the red hemisphere, offset NE toward the light
  if (addShine) {
    const hy = cy + Math.round(r * 0.55);
    const dy2 = hy - cy;
    const hrad = Math.floor(Math.sqrt(Math.max(0, r * r - dy2 * dy2)) + 0.5);
    const hx = cx + Math.round(hrad * 0.45);
    const hz = cz - Math.round(hrad * 0.45);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (Math.abs(dx) + Math.abs(dz) <= 1) block(hx + dx, hy, hz + dz, SNOW);
      }
    }
  }
}

// --- Giant hero Poké ball, front-and-center, facing the camera (-Z) ---
const CX = 0, CY = 10, CZ = 0, R = 9;
clearCanopy(CX, CZ, R + 3, 22);
foundation(CX, CY - R - 1, CZ, R);
buildPokeball(CX, CY, CZ, R, true);

// --- Mid-size companion ball, front-right foreground ---
const M1X = 14, M1R = 4, M1Y = M1R, M1Z = 10;
clearCanopy(M1X, M1Z, M1R + 2, M1Y + M1R + 2);
foundation(M1X, M1Y - M1R - 1, M1Z, M1R);
buildPokeball(M1X, M1Y, M1Z, M1R, false);

// --- Small ball, front-left foreground, deepest/closest for parallax ---
const M2X = -13, M2R = 3, M2Y = M2R, M2Z = 14;
clearCanopy(M2X, M2Z, M2R + 2, M2Y + M2R + 2);
foundation(M2X, M2Y - M2R - 1, M2Z, M2R);
buildPokeball(M2X, M2Y, M2Z, M2R, false);
```

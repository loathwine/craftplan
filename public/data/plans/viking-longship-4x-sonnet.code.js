// viking-longship-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ---- clear building volume (targeted to ship footprint only) ----
cube(-11, -1, -23, 11, 21, 19, AIR);

// ---- keel / ballast strip ----
line(0, -2, -21, 0, -2, 16, COBBLE);
line(0, -2, -21, 0, -1, -21, OAK_LOG);

// ---- hull parameters ----
const zBow = -19, zStern = 15;
const zMid = -2, halfLen = (zStern - zBow) / 2;
const maxHalf = 4.5;

function hullHalfWidth(z) {
  const t = (z - zMid) / halfLen;
  const s = 1 - t * t;
  return s > 0 ? maxHalf * Math.sqrt(s) : 0;
}

let benchIdx = 0;
for (let z = zBow; z <= zStern; z++) {
  const hw = hullHalfWidth(z);
  const wallX = Math.round(hw);

  if (wallX <= 0) {
    // near the tips: just a narrow spine, handled by figurehead/tail sections
    block(0, -1, z, PLANKS);
    continue;
  }

  const bw = Math.max(0, wallX - 1);

  // solid bottom (below waterline)
  cube(-bw, -1, z, bw, -1, z, PLANKS);
  // deck floor
  cube(-bw, 0, z, bw, 0, z, PLANKS);

  // bulwark side walls (hollow interior)
  if (wallX >= 1) {
    block(-wallX, 1, z, PLANKS);
    block(wallX, 1, z, PLANKS);
    block(-wallX, 2, z, PLANKS);
    block(wallX, 2, z, PLANKS);
    // gunwale rim
    block(-wallX, 3, z, OAK_LOG);
    block(wallX, 3, z, OAK_LOG);
  }

  // rowing thwarts + oars + shields every 3 blocks along midship
  if (wallX >= 2 && z % 3 === 0) {
    benchIdx++;
    line(-wallX, 1, z, wallX, 1, z, OAK_LOG); // thwart beam

    // oars, dipping toward the water
    line(wallX, 1, z, wallX + 4, 1, z, OAK_LOG);
    line(-wallX, 1, z, -wallX - 4, 1, z, OAK_LOG);
    block(wallX + 4, 0, z, PLANKS);
    block(-wallX - 4, 0, z, PLANKS);
  }

  if (wallX >= 3 && z % 4 === 1) {
    const shieldId = (Math.floor(z / 4) % 2 === 0) ? STONE : BRICK;
    cube(wallX + 1, 2, z, wallX + 1, 3, z, shieldId);
    cube(-wallX - 1, 2, z, -wallX - 1, 3, z, shieldId);
  }
}

// ---- treasure chest amidships ----
cube(-1, 1, -4, 1, 2, -3, OAK_LOG);
line(-1, 2, -3, 1, 2, -3, COBBLE);
line(-1, 2, -4, 1, 2, -4, COBBLE);

// ---- mast, yard, striped sail ----
cylinder(0, 3, -2, 1, 15, OAK_LOG);
line(-6, 14, -2, 6, 14, -2, OAK_LOG);
for (let y = 5; y <= 13; y++) {
  const stripe = (y % 2 === 0) ? SNOW : BRICK;
  cube(-6, y, -3, 6, y, -1, stripe);
}
line(-6, 13, -2, -6, 5, -2, OAK_LOG); // sail edge ropes
line(6, 13, -2, 6, 5, -2, OAK_LOG);

// ---- dragon-head figurehead (bow, faces north toward camera) ----
line(0, -1, -19, 0, 2, -19, OAK_LOG);
line(0, 2, -19, 0, 5, -20, OAK_LOG);
line(0, 5, -20, 0, 8, -20, OAK_LOG);
line(0, 8, -20, 0, 10, -19, OAK_LOG);

cube(-1, 9, -21, 1, 11, -19, STONE);       // head block
cube(-1, 9, -22, 1, 10, -21, STONE);       // snout / jaw
line(-1, 9, -22, 1, 9, -22, SNOW);         // teeth
block(-1, 11, -20, GLASS);                 // eyes
block(1, 11, -20, GLASS);
line(0, 12, -19, 0, 14, -18, OAK_LOG);     // curling horn
line(0, 14, -18, -1, 15, -18, OAK_LOG);
line(0, 14, -18, 1, 15, -18, OAK_LOG);

// ---- stern tail (aft) ----
line(0, -1, 15, 0, 2, 16, OAK_LOG);
line(0, 2, 16, 0, 4, 17, OAK_LOG);
cube(-1, 4, 17, 1, 5, 17, PLANKS); // fan tail
cube(-1, 5, 17, 1, 5, 17, PLANKS);

// steering oar, starboard aft
line(4, 1, 12, 7, 1, 13, OAK_LOG);
line(7, 1, 13, 7, -1, 14, OAK_LOG);
cube(6, -1, 14, 8, -1, 15, PLANKS);
```

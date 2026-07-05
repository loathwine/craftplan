// pokeball-4x-fable — prompt:
// a giant Poké Ball...

const CX = 0, CY = 11, CZ = 0, R = 14;
const R2 = R * R;

function inside(dx, dy, dz) { return dx*dx + dy*dy + dz*dz <= R2; }
function h(a, b, c) {
  const s = Math.sin(a * 127.1 + b * 311.7 + (c || 0) * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

// Clear vegetation around the impact site (AIR is free)
cylinder(0, 1, 0, 18, 13, AIR);

// Shallow impact depression
for (let x = -14; x <= 14; x++) for (let z = -14; z <= 14; z++) {
  const dd = Math.sqrt(x*x + z*z);
  if (dd <= 13.5) block(x, 0, z, AIR);
  if (dd <= 11.5) block(x, -1, z, AIR);
}

// Giant Poke Ball shell — red top, black band, white bottom, button facing -Z
for (let dx = -R; dx <= R; dx++) {
  for (let dy = -R; dy <= R; dy++) {
    for (let dz = -R; dz <= R; dz++) {
      if (!inside(dx, dy, dz)) continue;
      if (inside(dx+1,dy,dz) && inside(dx-1,dy,dz) &&
          inside(dx,dy+1,dz) && inside(dx,dy-1,dz) &&
          inside(dx,dy,dz+1) && inside(dx,dy,dz-1)) continue; // interior stays hollow
      let id;
      const bd = Math.sqrt(dx*dx + dy*dy + (dz + R)*(dz + R)); // distance to button axis point
      if (bd <= 3.0) id = SNOW;            // button face
      else if (bd <= 4.8) id = STONE;      // button ring
      else if (Math.abs(dy) <= 1) id = STONE; // black equator band
      else if (dy > 1) {
        id = BRICK;                        // red dome
        if (dy >= 6 && dy <= 10 && dx <= -3 && dx >= -9 && dz <= -3 && dz >= -9) id = SNOW; // anime gleam
      } else id = SNOW;                    // white base
      block(CX + dx, CY + dy, CZ + dz, id);
    }
  }
}

// Protruding button plate hugging the curved -Z face
for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) {
  const rr = a*a + b*b;
  if (rr > 17) continue;
  const zs = Math.round(Math.sqrt(R2 - rr));
  block(CX + a, CY + b, CZ - zs - 1, rr <= 6 ? SNOW : STONE);
  if (rr <= 2) block(CX + a, CY + b, CZ - zs - 2, SNOW); // center bump
}

// Thrown-up dirt rim around the crater
for (let x = -19; x <= 19; x++) for (let z = -19; z <= 19; z++) {
  const dd = Math.sqrt(x*x + z*z);
  if (dd < 14.2 || dd > 18) continue;
  const v = h(x, z);
  if (v > 0.45) {
    block(x, 0, z, DIRT);
    if (v > 0.75) block(x, 1, z, dd < 16 ? COBBLE : DIRT);
    if (v > 0.92) block(x, 2, z, COBBLE);
  }
}

// Churned earth inside the bowl gap
for (let x = -13; x <= 13; x++) for (let z = -13; z <= 13; z++) {
  const dd = Math.sqrt(x*x + z*z);
  if (dd < 9.5 || dd > 13) continue;
  const v = h(x, z, 7);
  if (v > 0.82) block(x, -1, z, v > 0.91 ? COBBLE : DIRT);
}

// Scattered debris rocks flung outward
function rock(x, z) {
  block(x, 0, z, COBBLE);
  block(x + 1, 0, z, STONE);
  block(x, 0, z + 1, STONE);
  block(x, 1, z, COBBLE);
}
rock(19, 6); rock(-17, 10); rock(-13, -15); rock(9, -18);
rock(20, -8); rock(-19, -4); rock(6, 19); rock(-7, 18);

// Energy sparks still crackling around the band
block(17, 12, -3, ICE); block(-16, 13, 4, ICE); block(11, 14, 13, GLASS);
block(-12, 10, -13, ICE); block(16, 14, 7, GLASS); block(-18, 11, -5, ICE);
block(3, 13, -17, ICE); block(-4, 15, 16, GLASS); block(18, 9, 2, ICE);
block(-15, 8, -10, ICE);

// A regular-sized Poke Ball dropped nearby, half buried — scale reference
const mx = 17, my = 0, mz = 13;
for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) for (let dz = -3; dz <= 3; dz++) {
  if (Math.sqrt(dx*dx + dy*dy + dz*dz) > 3.3) continue;
  let id = dy >= 1 ? BRICK : (dy <= -1 ? SNOW : STONE);
  if (dy === 0 && dx === 0 && dz === -3) id = SNOW; // tiny button
  block(mx + dx, my + dy, mz + dz, id);
}
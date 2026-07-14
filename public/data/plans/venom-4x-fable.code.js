// venom-4x-fable — prompt:
// Venom...

const R = (x, y, z) => {
  let h = x * 374761393 + y * 668265263 + z * 1274126177;
  h = (h ^ (h >> 13)) * 1103515245;
  return ((h >> 16) & 255) / 255;
};
const skin = (x, y, z) => block(x, y, z, R(x, y, z) < 0.3 ? COBBLE : STONE);

function blob(cx, cy, cz, rx, ry, rz) {
  for (let x = Math.round(cx - rx); x <= Math.round(cx + rx); x++)
    for (let y = Math.round(cy - ry); y <= Math.round(cy + ry); y++)
      for (let z = Math.round(cz - rz); z <= Math.round(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.02) skin(x, y, z);
      }
}
const ball = (cx, cy, cz, r) => blob(cx, cy, cz, r, r, r);

// clear trees/terrain bumps from the stage
cube(-16, 0, -12, 16, 12, 10, AIR);

// symbiote pool the body rises from
disk(0, -2, 3, 7, STONE);
disk(0, -1, 3, 6, STONE);
disk(0, 0, 3, 4, COBBLE);

// torso — hulking, hunched forward
blob(0, 2.5, 5.5, 5.5, 3.5, 4);      // pelvis emerging from pool
blob(0, 9, 4.5, 7, 6, 4.5);          // massive chest
blob(0, 13, 7.5, 4.5, 2.5, 2.5);     // hunched trap hump behind head
blob(0, 15, 4.5, 2.8, 2, 2.8);       // neck

// arms — gorilla stance, fists planted forward
for (const s of [1, -1]) {
  ball(s * 9, 13, 4, 3.4);                                   // shoulder
  for (let i = 0; i <= 2; i++) {                              // upper arm
    const t = i / 2;
    ball(s * (9 + 2 * t), 12 - 5.5 * t, 3.5 - 2.5 * t, 2.5);
  }
  for (let i = 0; i <= 2; i++) {                              // forearm
    const t = i / 2;
    ball(s * 11, 5 - 3 * t, -1 - 3 * t, 2.2);
  }
  ball(s * 11, 1, -5, 2.7);                                   // fist on ground
  // white claws raking forward
  block(s * 9, 2, -8, SNOW);
  block(s * 11, 2, -8, SNOW);
  block(s * 13, 2, -8, SNOW);
}

// head — thrust forward, facing north
blob(0, 21, 4.5, 4.8, 5.2, 4.4);     // skull
blob(0, 13.5, 2, 4, 2.5, 4.5);       // dropped-open lower jaw

// carve the gaping maw
cube(-3, 16, 0, 3, 19, 4, AIR);
cube(-3, 16, 5, 3, 19, 5, BRICK);    // red throat back wall
cube(-3, 15, 0, 3, 15, 4, BRICK);    // red mouth floor on jaw

// teeth — jagged white fangs
for (const tx of [-3, -1, 1, 3]) block(tx, 19, 0, SNOW);   // upper row
for (const tx of [-3, 1, 3]) block(tx, 18, 0, SNOW);       // long upper fangs
for (const tx of [-3, -2, 2, 3]) block(tx, 16, -1, SNOW);  // lower row
block(-3, 17, -1, SNOW);                                    // lower fang tips
block(3, 17, -1, SNOW);

// long red tongue lolling out and down, curling at the tip
const tongue = [
  [0, 15, -1], [0, 15, -2], [0, 14, -3], [0, 13, -4], [1, 12, -4],
  [1, 11, -5], [0, 10, -6], [-1, 9, -6], [-1, 8, -7], [0, 7, -7], [0, 6, -8]
];
for (const [tx, ty, tz] of tongue) {
  block(tx, ty, tz, BRICK);
  block(tx + 1, ty, tz, BRICK);
}
block(0, 6, -9, BRICK);
block(0, 7, -9, BRICK); // upturned tip

// huge slanted white eyes on the skull's north face
const eyeCells = [
  [1, 20], [1, 21], [2, 21], [1, 22], [2, 22], [3, 22],
  [2, 23], [3, 23], [4, 23], [3, 24], [4, 24]
];
for (const s of [1, -1])
  for (const [ex, ey] of eyeCells) {
    const zf = 4.5 - 4.4 * Math.sqrt(Math.max(0.03, 1 - (ex / 4.8) ** 2 - ((ey - 21) / 5.2) ** 2));
    block(s * ex, ey, Math.max(0, Math.round(zf)), SNOW);
  }

// white spider emblem wrapped onto the chest
const chestZ = (x, y) =>
  Math.round(4.5 - 4.5 * Math.sqrt(Math.max(0.02, 1 - (x / 7) ** 2 - ((y - 9) / 6) ** 2)));
const emblem = (x, y) => block(Math.round(x), Math.round(y), chestZ(x, y), SNOW);
for (let y = 3; y <= 13; y++) emblem(0, y);              // spider body
for (let y = 4; y <= 6; y++) { emblem(-1, y); emblem(1, y); } // abdomen bulge
const legs = [[12, 6, 14], [10, 7, 10], [8, 6, 4], [6, 4, 2]];
for (const s of [1, -1])
  for (const [y0, xe, ye] of legs) {
    const n = Math.max(Math.abs(xe), Math.abs(ye - y0));
    for (let i = 0; i <= n; i++) emblem(s * xe * i / n, y0 + (ye - y0) * i / n);
  }

// writhing symbiote tendrils around the body
const tendrils = [
  [-14, 4, 10, 0], [-12, 6, 8, 2], [14, -3, 11, 1], [12, 7, 9, 4],
  [-7, -8, 5, 3], [8, -7, 5, 5], [-5, 12, 13, 2.5], [6, 13, 14, 0.8]
];
for (const [bx, bz, h, ph] of tendrils)
  for (let t = 0; t <= h; t++) {
    const px = bx + Math.round(1.8 * Math.sin(t * 0.7 + ph));
    const pz = bz + Math.round(1.4 * Math.cos(t * 0.55 + ph));
    skin(px, t - 1, pz);
    if (t < 3) skin(px + 1, t - 1, pz);
  }

// small goo splats at tendril roots
disk(-13, -1, 6, 2, STONE);
disk(13, -1, 2, 2, STONE);
disk(-6, -1, 13, 2, STONE);
disk(7, -1, 13, 2, STONE);
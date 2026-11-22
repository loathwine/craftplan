// emperor-penguin-haiku55 — prompt:
// an emperor penguin...

// Emperor penguin on an ice floe, a fluffy chick at its feet, and an iceberg behind.
// Front = north (-Z). Origin = feet on the ground.

// Ellipsoid filler: pick(x, y, z) returns a block id, or null to skip the voxel.
function ellipsoid(cx, cy, cz, rx, ry, rz, pick) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz > 1) continue;
        const id = pick(x, y, z);
        if (id !== null && id !== undefined) block(x, y, z, id);
      }
}

// 1) Clear the penguin spot (old tree and bushes) and the iceberg spot
cube(-9, 0, -8, 9, 22, 8, AIR);
cube(-11, 0, 9, 11, 12, 19, AIR);

// 2) Ice floe: ICE underside, SNOW top, flush with the ground
cube(-9, -2, -8, 9, -2, 8, ICE);
cube(-9, -1, -8, 9, -1, 8, SNOW);

// 3) Background iceberg: half-ellipsoid with a snow cap
ellipsoid(0, 0, 13.5, 10, 9, 5, (x, y, z) => {
  if (y < 0) return null;
  return y >= 7 ? SNOW : ICE;
});

// 4) Penguin body: egg-shaped, white front, black back and sides
ellipsoid(0, 7.5, 0, 4.5, 6.5, 4, (x, y, z) => {
  if (y < 1) return null;
  if (z >= 1 || Math.abs(x) >= 3) return BLACK;
  if (y >= 9 && y <= 12 && Math.abs(x) <= 1 && z <= -2) return YELLOW; // breast tint
  return WHITE;
});

// 5) Head: black, with yellow ear patches on the sides
ellipsoid(0, 14.5, -0.5, 3, 3, 3, (x, y, z) =>
  (Math.abs(x) >= 2 && y >= 13 && y <= 14 && z >= -2 && z <= -1) ? YELLOW : BLACK
);

// Eyes: white so the face reads from the camera
block(-1, 14, -3, WHITE);
block(1, 14, -3, WHITE);

// Beak: orange base, yellow middle, dark tip
cube(0, 13, -4, 0, 14, -4, ORANGE);
block(0, 13, -5, ORANGE);
block(0, 13, -6, YELLOW);
block(0, 13, -7, BLACK);

// Feet: orange, under the body
cube(-2, 0, -1, -1, 0, 0, ORANGE);
cube(1, 0, -1, 2, 0, 0, ORANGE);

// Flippers hang along the sides
cube(5, 5, -1, 5, 10, 1, BLACK);
cube(5, 4, 0, 5, 4, 0, BLACK);
cube(-5, 5, -1, -5, 10, 1, BLACK);
cube(-5, 4, 0, -5, 4, 0, BLACK);

// Short tail tuft at the back
cube(-1, 1, 4, 1, 1, 4, BLACK);

// 6) Chick at the front-right: fluffy gray down, orange beak, black eyes
ellipsoid(5, 2, -5, 2, 2, 2, (x, y, z) => {
  if (z === -7 && x === 5 && y === 2) return ORANGE; // beak
  return GRAY;
});
block(4, 3, -6, BLACK);
block(6, 3, -6, BLACK);

// 7) Snow drifts and ice shards on the floe for foreground detail
[[-7, -6], [-5, -7], [-6, 4], [-3, 7], [0, 7], [7, 6], [8, -1], [-8, 2], [-4, -5], [2, 5]]
  .forEach(([x, z]) => block(x, 0, z, SNOW));
cube(-8, 0, -5, -8, 2, -5, ICE);
cube(8, 0, 1, 8, 1, 1, ICE);
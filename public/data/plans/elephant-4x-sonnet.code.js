// elephant-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// African elephant, facing north (-Z) toward camera
const SKIN = STONE;
const SKIN_DARK = COBBLE;
const IVORY = SNOW;
const HAIR = OAK_LOG;

function ellipseDiskX(xStart, xEnd, cy, cz, rY, rZ, id) {
  for (let x = xStart; x <= xEnd; x++) {
    for (let y = Math.floor(cy - rY); y <= Math.ceil(cy + rY); y++) {
      for (let z = Math.floor(cz - rZ); z <= Math.ceil(cz + rZ); z++) {
        const dy = (y - cy) / rY, dz = (z - cz) / rZ;
        if (dy * dy + dz * dz <= 1) block(x, y, z, id);
      }
    }
  }
}

// trampled dirt patch under the animal
disk(0, 0, 3, 9, DIRT);

// legs (front pair near head, rear pair near tail)
cylinder(-3, 0, -4, 1.5, 6, SKIN);
cylinder(3, 0, -4, 1.5, 6, SKIN);
cylinder(-3, 0, 8, 1.5, 6, SKIN);
cylinder(3, 0, 8, 1.5, 6, SKIN);

// knee wrinkle rings
hollowCylinder(-3, 2, -4, 1.5, 1, SKIN_DARK);
hollowCylinder(3, 2, -4, 1.5, 1, SKIN_DARK);
hollowCylinder(-3, 5, -4, 1.5, 1, SKIN_DARK);
hollowCylinder(3, 5, -4, 1.5, 1, SKIN_DARK);
hollowCylinder(-3, 2, 8, 1.5, 1, SKIN_DARK);
hollowCylinder(3, 2, 8, 1.5, 1, SKIN_DARK);
hollowCylinder(-3, 5, 8, 1.5, 1, SKIN_DARK);
hollowCylinder(3, 5, 8, 1.5, 1, SKIN_DARK);

// toenails, front feet only (facing the viewer)
for (const dx of [-4, -3, -2]) block(dx, 0, -6, IVORY);
for (const dx of [2, 3, 4]) block(dx, 0, -6, IVORY);

// body - chain of overlapping spheres forms an elongated barrel torso
const bodyCenters = [-1, 2, 5, 8];
for (const cz of bodyCenters) sphere(0, 10, cz, 5, SKIN);

// shoulder hump + rear hip bulge for silhouette variety
sphere(0, 13, -2, 3, SKIN);
sphere(0, 12, 8, 4, SKIN);

// belly wrinkle band
hollowCylinder(0, 6, 3, 5, 1, SKIN_DARK);

// head
sphere(0, 11, -8, 4, SKIN);
sphere(0, 8, -9, 3, SKIN); // lower jaw / mouth bulge

// ears, flat oval flaps in the Y-Z plane, flush against the head
ellipseDiskX(4, 5, 11, -8, 5, 4, SKIN);
ellipseDiskX(-5, -4, 11, -8, 5, 4, SKIN);
// ear rim shading
ellipseDiskX(4, 4, 11, -8, 5, 4, SKIN_DARK);
ellipseDiskX(-4, -4, 11, -8, 5, 4, SKIN_DARK);

// eyes
block(-2, 12, -12, SKIN_DARK);
block(2, 12, -12, SKIN_DARK);

// trunk - tapering, gently curling column hanging from the head
const trunk = [
  [0, 8, -11, 2],
  [0, 7, -11, 2],
  [0, 6, -10, 2],
  [0, 5, -10, 2],
  [0, 4, -9, 2],
  [0, 3, -9, 1],
  [0, 2, -8, 1],
  [0, 1, -8, 1],
];
for (const [x, y, z, r] of trunk) sphere(x, y, z, r, SKIN);

// tusks - curved ivory, either side of the trunk base
line(1, 8, -11, 2, 6, -12, IVORY);
line(2, 6, -12, 3, 5, -12, IVORY);
line(3, 5, -12, 3, 5, -11, IVORY);
line(-1, 8, -11, -2, 6, -12, IVORY);
line(-2, 6, -12, -3, 5, -12, IVORY);
line(-3, 5, -12, -3, 5, -11, IVORY);

// tail - thin rope hanging from the rear, dark hair tuft at the tip
line(0, 9, 13, 0, 5, 15, SKIN);
sphere(0, 4, 15, 1, HAIR);
```

// grizzly-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// Grizzly bear standing on hind legs, facing north (-Z) toward camera.

const FUR = OAK_LOG;   // brown body fur
const DARK = DIRT;     // shading: pads, nose bridge, ear inner, brows
const CLAW = STONE;    // claws, eyes, nose tip
const BLAZE = SNOW;    // pale chest patch

// ---------- Hind legs (standing) ----------
// Left leg
cube(-3, 0, -1, -1, 3, 2, FUR);
cube(-3, 4, -1, -1, 7, 2, FUR);
// Right leg
cube(1, 0, -1, 3, 3, 2, FUR);
cube(1, 4, -1, 3, 7, 2, FUR);

// paw pads + toe claws (front of feet)
cube(-3, 0, -2, -1, 0, -1, DARK);
cube(1, 0, -2, 3, 0, -1, DARK);
block(-3, 0, -2, CLAW); block(-2, 0, -2, CLAW); block(-1, 0, -2, CLAW);
block(1, 0, -2, CLAW); block(2, 0, -2, CLAW); block(3, 0, -2, CLAW);

// ---------- Pelvis / hips ----------
cube(-4, 8, -2, 4, 10, 3, FUR);

// tail nub (back)
cube(-1, 9, 4, 1, 10, 4, FUR);

// ---------- Belly / lower chest ----------
cube(-5, 11, -3, 5, 13, 3, FUR);

// ---------- Upper chest / shoulders ----------
cube(-6, 14, -3, 6, 16, 3, FUR);

// signature grizzly shoulder hump (back, between shoulders)
cube(-4, 16, 1, 4, 18, 3, FUR);
sphere(0, 17, 2, 3, FUR);

// pale chest blaze
cube(-2, 12, -3, 2, 14, -3, BLAZE);

// ---------- Arms (hanging forward, reaching toward viewer) ----------
// Left arm
cube(-7, 13, -3, -6, 16, -1, FUR);
cube(-7, 9, -4, -6, 12, -2, FUR);
cube(-8, 7, -5, -6, 8, -3, FUR);
block(-8, 7, -6, CLAW); block(-7, 7, -6, CLAW); block(-6, 7, -6, CLAW);
// Right arm
cube(6, 13, -3, 7, 16, -1, FUR);
cube(6, 9, -4, 7, 12, -2, FUR);
cube(6, 7, -5, 8, 8, -3, FUR);
block(6, 7, -6, CLAW); block(7, 7, -6, CLAW); block(8, 7, -6, CLAW);

// ---------- Neck ----------
cube(-2, 17, -3, 2, 18, -1, FUR);

// ---------- Head ----------
sphere(0, 20, -3, 3, FUR);
cube(-3, 18, -5, 3, 20, -1, FUR);   // jaw/muzzle base, fills sphere underside

// snout
cube(-2, 18, -7, 2, 19, -4, FUR);
cube(-1, 18, -8, 1, 19, -7, DARK);  // nose bridge
block(0, 19, -9, CLAW);             // nose tip
line(-1, 17, -8, 1, 17, -7, AIR);   // mouth line carve
cube(-1, 16, -7, 1, 16, -6, DARK);  // lower lip shadow

// eyes + brow ridges
block(-2, 20, -5, CLAW);
block(2, 20, -5, CLAW);
cube(-3, 21, -4, -2, 21, -4, DARK);
cube(2, 21, -4, 3, 21, -4, DARK);

// ears
cube(-3, 19, -2, -2, 22, -1, FUR);
cube(2, 19, -2, 3, 22, -1, FUR);
cube(-3, 21, -2, -2, 21, -1, DARK);
cube(2, 21, -2, 3, 21, -1, DARK);

// fur texture flecks on chest/shoulders for a shaggy silhouette
block(-5, 15, -3, DARK); block(5, 15, -3, DARK);
block(-4, 12, -3, DARK); block(4, 12, -3, DARK);
block(0, 9, -2, DARK); block(0, 5, -1, DARK);
```

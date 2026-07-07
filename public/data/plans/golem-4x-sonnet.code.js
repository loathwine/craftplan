// golem-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
That's fine to leave — it's just a scratch temp file. Here's the final build code.

```js
// Stone Golem: monumental statue, mid-swing pose, chest/face toward -Z (north / camera)
function pr(x, y, z) {
  const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return v - Math.floor(v);
}

// ---------- LEGS ----------
cube(-6, 0, -3, -1, 1, 2, STONE);   // left foot
cube(1, 0, -3, 6, 1, 2, STONE);     // right foot
cube(-5, 1, -2, -2, 8, 1, STONE);   // left leg
cube(2, 1, -2, 5, 8, 1, STONE);     // right leg
cube(-5, 4, -3, -2, 6, -3, COBBLE); // left kneecap plate (protrudes north)
cube(2, 4, -3, 5, 6, -3, COBBLE);   // right kneecap plate

// ---------- HIP / WAIST ----------
cube(-6, 8, -3, 6, 10, 2, STONE);
cube(-6, 8, -4, 6, 8, -4, COBBLE);  // belt band

// ---------- TORSO ----------
cube(-6, 10, -3, 6, 14, 2, STONE);          // lower torso
cube(-8, 14, -4, 8, 18, 3, STONE);          // upper torso / wide shoulders

// chest crack emblem (jagged vertical fault line on front face)
block(0, 14, -4, COBBLE); block(1, 15, -4, COBBLE); block(0, 16, -4, COBBLE);
block(-1, 17, -4, COBBLE); block(0, 18, -4, COBBLE);

// ---------- NECK / HEAD ----------
cube(-2, 18, -2, 2, 19, 1, STONE);
cube(-2, 19, -2, 2, 23, 1, STONE);          // head
cube(-2, 22, -3, 2, 22, -3, STONE);         // brow ridge, protruding north
block(-1, 21, -2, BRICK);                   // left eye (glowing red)
block(1, 21, -2, BRICK);                    // right eye
block(-1, 20, -2, COBBLE); block(0, 20, -2, COBBLE); block(1, 20, -2, COBBLE); // mouth line

// ---------- LEFT ARM (resting at side) ----------
cube(-11, 13, -3, -9, 18, 2, STONE);        // shoulder
hollowCube(-11, 18, -3, -9, 18, 2, COBBLE); // shoulder trim
cube(-12, 8, -3, -10, 13, 1, STONE);        // upper arm
cube(-13, 3, -3, -10, 8, 1, STONE);         // forearm
cube(-14, 0, -4, -10, 3, 2, STONE);         // fist

// ---------- RIGHT ARM (raised, mid-swing) ----------
cube(9, 13, -3, 11, 18, 2, STONE);          // shoulder
hollowCube(9, 18, -3, 11, 18, 2, COBBLE);   // shoulder trim
cube(9, 16, -3, 12, 21, 1, STONE);          // upper arm raised
cube(9, 18, -4, 13, 21, -2, STONE);         // elbow joint (fills the bend)
cube(9, 19, -6, 13, 24, -3, STONE);         // forearm reaching forward/up
cube(8, 22, -8, 14, 27, -4, STONE);         // raised fist, high silhouette

// ---------- SURFACE CRACK / WEATHER SPECKLE (recolors solid surfaces only) ----------
for (let x = -5; x <= -2; x++) for (let y = 1; y <= 8; y++) for (let z = -2; z <= 1; z++)
  if (pr(x, y, z) > 0.94) block(x, y, z, COBBLE);
for (let x = 2; x <= 5; x++) for (let y = 1; y <= 8; y++) for (let z = -2; z <= 1; z++)
  if (pr(x, y, z) > 0.94) block(x, y, z, COBBLE);
for (let x = -6; x <= 6; x++) for (let y = 8; y <= 14; y++) for (let z = -3; z <= 2; z++)
  if (pr(x, y, z) > 0.95) block(x, y, z, COBBLE);
for (let x = -8; x <= 8; x++) for (let y = 14; y <= 18; y++) for (let z = -4; z <= 3; z++)
  if (pr(x, y, z) > 0.95) block(x, y, z, COBBLE);

// ---------- MOSS ----------
for (let x = -2; x <= 2; x++) for (let z = -2; z <= 1; z++)
  if (pr(x, 23, z) > 0.45) block(x, 23, z, LEAVES);        // head cap
for (let x = -8; x <= 8; x++) for (let z = -4; z <= 3; z++)
  if (pr(x, 18, z) > 0.7) block(x, 18, z, LEAVES);         // shoulder cap
for (let y = 1; y <= 5; y++) {
  if (pr(-4, y, 1) > 0.35) block(-4, y, 1, LEAVES);        // back of left leg
  if (pr(3, y, 1) > 0.35) block(3, y, 1, LEAVES);          // back of right leg
}
for (let x = -6; x <= 6; x++)
  if (pr(x, 1, 2) > 0.65) block(x, 1, 2, LEAVES);          // moss on feet tops

// ---------- GROUND RUBBLE (broken boulders scattered around the base) ----------
sphere(-17, 0, -2, 2, COBBLE);
sphere(17, 0, -3, 2, COBBLE);
sphere(-15, 0, 6, 1, COBBLE);
sphere(15, 0, 7, 1, COBBLE);
sphere(0, 0, 8, 2, STONE);
sphere(-9, 0, 7, 1, COBBLE);
sphere(9, 0, 6, 1, STONE);
```

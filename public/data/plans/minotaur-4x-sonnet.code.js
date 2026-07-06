// minotaur-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
I'll compose the build directly as the final answer.```javascript
function tube(x1, y1, z1, x2, y2, z2, r, id, steps) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    const z = Math.round(z1 + (z2 - z1) * t);
    sphere(x, y, z, r, id);
  }
}

// ===== ARENA PLATFORM =====
disk(0, -1, 0, 6, COBBLE);
hollowCylinder(0, -1, 0, 7, 1, STONE);
hollowCylinder(0, -1, 0, 5, 1, BRICK); // occult rune ring

// scattered rubble
const rubble = [
  [-6, -1, 4], [5, -1, -5], [-4, -1, -5], [6, -1, 3], [-7, -1, -2],
  [3, -1, 6], [-2, -1, 6], [7, -1, 0], [-6, -1, -3], [4, -1, 5]
];
for (const [rx, ry, rz] of rubble) cube(rx, ry, rz, rx + 1, ry, rz + 1, COBBLE);

// small skull/bone piles
cube(-4, 0, 5, -3, 0, 5, SNOW);
block(-3, 1, 5, SNOW);
cube(5, 0, -4, 6, 0, -4, SNOW);
block(5, 1, -4, SNOW);

// ===== LEGS =====
// hooves
cylinder(-3, 0, 0, 1.4, 1, STONE);
cylinder(3, 0, 0, 1.4, 1, STONE);
// shins
cylinder(-3, 1, 0, 1.3, 4, OAK_LOG);
cylinder(3, 1, 0, 1.3, 4, OAK_LOG);
// ankle bracers
cube(-4, 3, -2, -2, 3, 2, COBBLE);
cube(2, 3, -2, 4, 3, 2, COBBLE);
// thighs
cylinder(-3, 5, 0, 1.7, 4, OAK_LOG);
cylinder(3, 5, 0, 1.7, 4, OAK_LOG);

// ===== PELVIS / LOINCLOTH =====
cube(-4, 9, -3, 4, 10, 3, OAK_LOG);
cube(-4, 9, -3, 4, 9, 3, BRICK);

// ===== TORSO =====
cube(-4, 11, -3, 4, 13, 3, OAK_LOG); // waist
cube(-5, 14, -3, 5, 18, 3, OAK_LOG); // chest

// ab/pec definition (front face z=-3)
block(0, 11, -3, COBBLE);
block(0, 12, -3, COBBLE);
block(0, 13, -3, COBBLE);
cube(-3, 14, -3, -1, 15, -3, PLANKS);
cube(1, 14, -3, 3, 15, -3, PLANKS);
cube(-4, 16, -3, -1, 17, -3, PLANKS);
cube(1, 16, -3, 4, 17, -3, PLANKS);

// crossed leather straps
line(-5, 18, -3, 0, 12, -3, BRICK);
line(5, 18, -3, 0, 12, -3, BRICK);

// ===== NECK / HEAD =====
cube(-2, 19, -2, 2, 20, 2, OAK_LOG);
cube(-3, 21, -3, 3, 24, 3, OAK_LOG);

// muzzle
cube(-2, 21, -5, 2, 22, -3, SAND);
block(-1, 22, -5, STONE);
block(1, 22, -5, STONE);
// nose ring
line(-1, 20, -5, 1, 20, -5, STONE);
block(-1, 21, -5, STONE);
block(1, 21, -5, STONE);

// eyes
block(-2, 23, -3, BRICK);
block(2, 23, -3, BRICK);

// ears
cube(-4, 22, -1, -4, 23, 1, OAK_LOG);
cube(4, 22, -1, 4, 23, 1, OAK_LOG);

// ===== HORNS =====
tube(-3, 24, -1, -5, 26, 0, 1, STONE, 4);
tube(-5, 26, 0, -7, 28, 1, 1, STONE, 4);
block(-8, 29, 2, STONE);
tube(3, 24, -1, 5, 26, 0, 1, STONE, 4);
tube(5, 26, 0, 7, 28, 1, 1, STONE, 4);
block(8, 29, 2, STONE);

// ===== TAIL =====
tube(0, 10, 3, 2, 11, 5, 0.8, OAK_LOG, 4);
tube(2, 11, 5, 3, 10, 7, 0.7, OAK_LOG, 4);
sphere(3, 10, 8, 1, COBBLE);

// ===== LEFT ARM (resting) =====
sphere(-6, 18, 0, 1.5, OAK_LOG);
tube(-6, 18, 0, -7, 15, 1, 1.2, OAK_LOG, 5);
tube(-7, 15, 1, -6, 12, 1, 1.1, OAK_LOG, 5);
sphere(-6, 12, 1, 1.2, OAK_LOG);
cube(-8, 15, 0, -6, 15, 2, COBBLE); // upper-arm band
cube(-7, 12, 0, -5, 12, 2, COBBLE); // wrist band

// ===== RIGHT ARM (raised, holding axe) =====
sphere(6, 18, 0, 1.5, OAK_LOG);
tube(6, 18, 0, 8, 21, -1, 1.2, OAK_LOG, 5);
tube(8, 21, -1, 7, 25, -2, 1.1, OAK_LOG, 5);
sphere(7, 25, -2, 1.3, OAK_LOG);
cube(8, 21, -2, 10, 21, 0, COBBLE); // upper-arm band

// broken chain dangling from wrist
block(7, 24, -2, STONE);
block(7, 23, -2, COBBLE);
block(7, 22, -2, STONE);

// ===== AXE (labrys) =====
tube(7, 25, -2, 7, 31, -2, 0.6, OAK_LOG, 8); // handle
// left blade wing
block(6, 31, -2, STONE);
cube(5, 30, -2, 5, 32, -2, STONE);
cube(3, 29, -2, 4, 33, -2, STONE);
cube(2, 30, -2, 2, 32, -2, STONE);
block(1, 31, -2, STONE);
cube(3, 29, -1, 4, 33, -1, STONE);
// right blade wing
block(8, 31, -2, STONE);
cube(9, 30, -2, 9, 32, -2, STONE);
cube(10, 29, -2, 11, 33, -2, STONE);
cube(12, 30, -2, 12, 32, -2, STONE);
block(13, 31, -2, STONE);
cube(10, 29, -1, 11, 33, -1, STONE);

// ===== RUINED PILLARS (background flavor) =====
cylinder(-14, -1, -8, 1.5, 7, COBBLE);
block(-15, 6, -8, COBBLE);
block(-13, 5, -7, COBBLE);
cube(-16, -1, -9, -12, 0, -7, COBBLE); // rubble base
cube(-15, -1, -9, -14, 0, -8, LEAVES); // moss

cylinder(14, -1, -8, 1.5, 5, COBBLE);
block(15, 4, -7, COBBLE);
cube(12, -1, -9, 16, 0, -7, COBBLE);
cube(14, -1, -9, 15, 0, -8, LEAVES);

// broken labyrinth wall fragments
cube(-11, 0, -14, -7, 5, -13, COBBLE);
cube(-2, 0, -14, 2, 4, -13, COBBLE);
cube(7, 0, -14, 11, 6, -13, COBBLE);
cube(-10, 3, -13, -8, 4, -13, LEAVES);
cube(8, 4, -13, 10, 5, -13, LEAVES);
```

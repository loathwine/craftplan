// venom-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== VENOM =====
// Crater / ground scar
disk(0, -1, 0, 11, DIRT);
disk(0, -1, 0, 8, COBBLE);
disk(0, -1, 0, 4, STONE);
cube(-13, -1, -13, -11, -1, -11, COBBLE);
cube(11, -1, -12, 13, -1, -10, COBBLE);
cube(-14, -1, 9, -12, -1, 11, COBBLE);
cube(12, -1, 9, 14, -1, 11, COBBLE);
cube(-10, -1, -10, -9, 1, -9, COBBLE);
cube(9, -1, -10, 10, 2, -9, COBBLE);
cube(-12, -1, 8, -11, 1, 9, COBBLE);
cube(10, -1, 8, 11, 1, 9, COBBLE);

// ===== LEGS =====
// Left leg
cube(-5, 0, -4, -1, 0, 1, STONE);
block(-5, 0, -4, COBBLE); block(-3, 0, -4, COBBLE); block(-1, 0, -4, COBBLE);
cube(-4, 1, -3, -2, 1, 0, STONE);
cube(-4, 2, -3, -2, 6, 0, STONE);
cube(-4, 6, -3, -2, 6, 0, COBBLE);
cube(-5, 7, -4, -1, 9, 1, STONE);
// Right leg
cube(1, 0, -4, 5, 0, 1, STONE);
block(1, 0, -4, COBBLE); block(3, 0, -4, COBBLE); block(5, 0, -4, COBBLE);
cube(2, 1, -2, 4, 1, 0, STONE);
cube(2, 2, -3, 4, 6, 0, STONE);
cube(2, 6, -3, 4, 6, 0, COBBLE);
cube(1, 7, -4, 5, 9, 1, STONE);

// ===== HIPS / WAIST =====
cube(-6, 10, -4, 6, 12, 3, STONE);
cube(-5, 12, -4, 5, 14, 3, STONE);
cube(-4, 13, -4, 4, 13, -4, COBBLE);
cube(-3, 14, -4, 3, 14, -4, COBBLE);

// ===== CHEST / TORSO =====
cube(-7, 14, -5, 7, 19, 3, STONE);
cube(-6, 17, -5, -2, 17, -5, COBBLE);
cube(2, 17, -5, 6, 17, -5, COBBLE);
line(0, 14, -5, 0, 19, -5, COBBLE);
cube(-7, 19, -4, 7, 19, 2, COBBLE);

// Symbiote goo drips off torso bottom
line(-6, 10, -4, -6, 8, -4, STONE);
line(-3, 10, -5, -3, 7, -5, STONE);
line(3, 10, -5, 3, 6, -5, STONE);
line(6, 10, -4, 6, 9, -4, STONE);

// ===== SPIDER EMBLEM (chest, front face z=-5) =====
cube(-1, 16, -5, 1, 17, -5, SNOW);
block(0, 18, -5, SNOW); block(0, 15, -5, SNOW);
line(-1, 17, -5, -4, 19, -5, SNOW);
line(-1, 17, -5, -4, 15, -5, SNOW);
line(-1, 16, -5, -3, 17, -5, SNOW);
line(1, 17, -5, 4, 19, -5, SNOW);
line(1, 17, -5, 4, 15, -5, SNOW);
line(1, 16, -5, 3, 17, -5, SNOW);
line(0, 15, -5, -2, 12, -5, SNOW);
line(0, 15, -5, 2, 12, -5, SNOW);

// ===== SHOULDERS =====
sphere(-9, 19, -2, 3, STONE);
sphere(9, 19, -2, 3, STONE);
cube(-10, 18, -3, -8, 18, -1, COBBLE);
cube(8, 18, -3, 10, 18, -1, COBBLE);

// ===== ARMS (long, hanging past knees) =====
// Left arm
cube(-12, 15, -4, -9, 19, -1, STONE);
cube(-13, 9, -6, -9, 15, -3, STONE);
cube(-13, 4, -7, -10, 9, -4, STONE);
block(-13, 3, -6, STONE); block(-12, 2, -6, STONE); block(-11, 3, -6, STONE); block(-10, 2, -6, STONE);
// Right arm
cube(9, 15, -4, 12, 19, -1, STONE);
cube(9, 9, -6, 13, 15, -3, STONE);
cube(10, 4, -7, 13, 9, -4, STONE);
block(13, 3, -6, STONE); block(12, 2, -6, STONE); block(11, 3, -6, STONE); block(10, 2, -6, STONE);

// ===== NECK =====
cube(-2, 19, -3, 2, 20, -1, STONE);

// ===== HEAD =====
cube(-5, 21, -3, 5, 26, 3, STONE);
sphere(0, 27, 0, 4, STONE);
sphere(-5, 23, 0, 2, STONE);
sphere(5, 23, 0, 2, STONE);

// Jaw jutting forward
cube(-4, 18, -7, 4, 21, -2, STONE);
cube(-4, 18, -7, 4, 21, -6, STONE);
// Mouth cavity
cube(-3, 19, -7, 3, 20, -3, AIR);
// Jagged teeth (interlocking rows)
for (let x = -3; x <= 3; x++) {
  if ((x + 3) % 2 === 0) {
    block(x, 21, -7, SNOW);
    block(x, 20, -7, SNOW);
  } else {
    block(x, 19, -7, SNOW);
    block(x, 18, -7, SNOW);
  }
}
// Tongue
line(0, 19, -6, 0, 13, -3, BRICK);
cube(-1, 11, -4, 1, 13, -2, BRICK);
cube(-1, 11, -4, 1, 11, -2, BRICK);

// Eyes (slanted iconic white shapes)
cube(-5, 25, -3, -3, 25, -3, SNOW);
cube(-5, 24, -3, -2, 24, -3, SNOW);
cube(-4, 23, -3, -1, 23, -3, SNOW);
cube(3, 25, -3, 5, 25, -3, SNOW);
cube(2, 24, -3, 5, 24, -3, SNOW);
cube(1, 23, -3, 4, 23, -3, SNOW);

// Cranium ridges
line(-3, 27, 0, -5, 24, -1, COBBLE);
line(3, 27, 0, 5, 24, -1, COBBLE);
line(0, 30, 0, 0, 27, 0, COBBLE);

// ===== SYMBIOTE TENDRILS =====
function tendrilSeg(pts, id) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    line(a[0], a[1], a[2], b[0], b[1], b[2], id);
    cube(Math.min(a[0], b[0]) - 1, a[1], Math.min(a[2], b[2]) - 1,
         Math.max(a[0], b[0]) + 1, a[1], Math.max(a[2], b[2]) + 1, id);
  }
}
tendrilSeg([[-9, 20, -2], [-13, 24, -4], [-15, 28, -6], [-13, 31, -8]], STONE);
tendrilSeg([[9, 20, -2], [13, 24, -4], [15, 28, -6], [13, 31, -8]], STONE);
tendrilSeg([[-3, 19, 3], [-6, 24, 6], [-4, 28, 9], [0, 31, 10]], STONE);
tendrilSeg([[3, 19, 3], [6, 24, 6], [4, 28, 9], [0, 31, 10]], STONE);
tendrilSeg([[0, 27, 1], [2, 30, 5], [-1, 32, 8]], STONE);
sphere(-13, 31, -8, 1, STONE);
sphere(13, 31, -8, 1, STONE);
sphere(0, 31, 10, 1, STONE);
sphere(-1, 32, 8, 1, STONE);

// Ground goo blobs / rubble scattered near feet
sphere(-8, -1, -6, 2, STONE);
sphere(8, -1, -6, 2, STONE);
sphere(0, -1, 6, 2, COBBLE);
cube(-11, -1, -3, -9, 0, -1, COBBLE);
cube(9, -1, -3, 11, 0, -1, COBBLE);

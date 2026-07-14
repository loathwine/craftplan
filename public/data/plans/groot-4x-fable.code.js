// groot-4x-fable — prompt:
// Groot...

function h(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function barkAt(x, y, z) {
  const r = h(x, y, z);
  return r < 0.62 ? OAK_LOG : (r < 0.80 ? DIRT : PLANKS);
}
function barkBox(x1, y1, z1, x2, y2, z2) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++)
        block(x, y, z, barkAt(x, y, z));
}
function limb(x1, y1, z1, x2, y2, z2, r) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 2 + 1;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cx = Math.round(x1 + (x2 - x1) * t);
    const cy = Math.round(y1 + (y2 - y1) * t);
    const cz = Math.round(z1 + (z2 - z1) * t);
    for (let dx = -2; dx <= 2; dx++)
      for (let dy = -2; dy <= 2; dy++)
        for (let dz = -2; dz <= 2; dz++)
          if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) <= r)
            block(cx + dx, cy + dy, cz + dz, barkAt(cx + dx, cy + dy, cz + dz));
  }
}

// ---- clear vegetation from the build footprint (leaves tree stumps at ground level) ----
cube(-13, 1, -8, 13, 11, 13, AIR);

// ---- feet + root system (front toward -Z) ----
barkBox(-4, 0, 2, -2, 1, 6);   // left foot (west)
barkBox(2, 0, 2, 4, 1, 6);     // right foot (east)
// toes reaching north
line(-4, 0, 2, -5, 0, 0, OAK_LOG);
line(-3, 0, 2, -3, 0, -1, OAK_LOG);
line(-2, 0, 2, -1, 0, 0, OAK_LOG);
line(2, 0, 2, 1, 0, 0, OAK_LOG);
line(3, 0, 2, 3, 0, -1, OAK_LOG);
line(4, 0, 2, 5, 0, 0, OAK_LOG);
// ground roots radiating out
line(-3, 0, 2, -7, 0, -3, OAK_LOG);
line(3, 0, 2, 7, 0, -3, OAK_LOG);
line(-4, 0, 5, -9, 0, 7, OAK_LOG);
line(4, 0, 5, 9, 0, 7, OAK_LOG);
line(-3, 0, 6, -5, 0, 11, OAK_LOG);
line(3, 0, 6, 5, 0, 11, OAK_LOG);
// buttress roots flaring off the calves
limb(-3, 4, 6, -6, 0, 9, 1);
limb(3, 4, 6, 6, 0, 9, 1);
limb(-4, 3, 5, -7, 0, 4, 1);
limb(4, 3, 5, 7, 0, 4, 1);

// ---- legs ----
barkBox(-4, 0, 4, -2, 12, 6);
barkBox(2, 0, 4, 4, 12, 6);
sphere(-3, 7, 5, 2, OAK_LOG);  // knee bulges
sphere(3, 7, 5, 2, OAK_LOG);

// ---- hips + torso (tapering wider toward the chest) ----
barkBox(-4, 12, 3, 4, 13, 6);
barkBox(-4, 14, 3, 4, 16, 6);
barkBox(-5, 17, 3, 5, 19, 6);
barkBox(-6, 20, 2, 6, 23, 6);

// bark seam grooves on the front
cube(-1, 14, 3, -1, 19, 3, DIRT);
cube(2, 14, 3, 2, 17, 3, DIRT);
cube(-2, 20, 2, -2, 23, 2, DIRT);
cube(1, 20, 2, 1, 22, 2, DIRT);

// ---- shoulders ----
sphere(-7, 22, 4, 2, OAK_LOG);
sphere(7, 22, 4, 2, OAK_LOG);

// ---- right arm (west): hanging, long, past the knees ----
limb(-7, 22, 4, -9, 15, 5, 2);
limb(-9, 15, 5, -8, 7, 3, 2);
sphere(-8, 6, 3, 1, OAK_LOG);
line(-9, 5, 3, -9, 3, 3, OAK_LOG);
line(-8, 5, 2, -8, 3, 2, OAK_LOG);
line(-7, 5, 3, -7, 3, 3, OAK_LOG);

// ---- left arm (east): raised, palm out front holding a sapling ----
limb(7, 22, 4, 11, 18, 6, 2);
limb(11, 18, 6, 8, 15, 0, 2);
barkBox(7, 14, -1, 9, 14, 1);   // palm
block(7, 14, -2, OAK_LOG);      // fingers
block(8, 14, -2, OAK_LOG);
block(9, 14, -2, OAK_LOG);
block(8, 14, -3, OAK_LOG);
block(6, 14, 0, OAK_LOG);       // thumb
// the sapling — "we are Groot"
block(8, 15, -1, OAK_LOG);
block(8, 16, -1, OAK_LOG);
sphere(8, 17, -1, 1, LEAVES);

// ---- neck + head (face on -Z toward camera) ----
barkBox(-1, 24, 3, 1, 24, 5);
barkBox(-2, 25, 2, 2, 25, 6);   // jaw
barkBox(-3, 26, 1, 3, 29, 6);   // mid head, face plane at z=1
barkBox(-2, 30, 2, 2, 30, 6);   // dome
barkBox(-1, 31, 3, 1, 31, 5);   // crown

// face: deep dark eye sockets
cube(-2, 27, 1, -2, 28, 2, AIR);
cube(2, 27, 1, 2, 28, 2, AIR);
cube(-2, 27, 3, -2, 28, 3, DIRT);
cube(2, 27, 3, 2, 28, 3, DIRT);
// heavy brow overhanging the eyes
line(-3, 29, 0, -1, 29, 0, OAK_LOG);
line(1, 29, 0, 3, 29, 0, OAK_LOG);
// nose bridge
block(0, 27, 0, OAK_LOG);
block(0, 26, 0, OAK_LOG);
// gentle mouth, recessed under the jaw line
cube(-1, 25, 2, 1, 25, 2, AIR);
cube(-1, 25, 3, 1, 25, 3, DIRT);

// ---- crown twigs sprouting off the head ----
block(0, 32, 4, OAK_LOG); block(0, 33, 4, LEAVES);
block(-2, 31, 3, OAK_LOG); block(-3, 32, 3, OAK_LOG); block(-3, 33, 3, LEAVES);
block(2, 31, 4, OAK_LOG); block(3, 32, 4, OAK_LOG); block(3, 33, 5, LEAVES);
block(-1, 32, 5, OAK_LOG); block(-2, 33, 6, LEAVES);
block(1, 32, 2, OAK_LOG); block(2, 33, 1, LEAVES);

// ---- moss patches (asymmetric) ----
cube(-8, 23, 3, -6, 23, 5, LEAVES);   // right shoulder cap
block(-7, 24, 4, LEAVES);
cube(4, 20, 2, 5, 21, 2, LEAVES);     // chest patch
cube(-5, 17, 3, -4, 18, 3, LEAVES);   // ribs patch
cube(3, 27, 4, 3, 28, 5, LEAVES);     // head, east cheek side
cube(1, 30, 5, 2, 30, 6, LEAVES);     // back of the dome
cube(-4, 3, 4, -4, 5, 5, LEAVES);     // left shin, west face
cube(2, 1, 4, 3, 2, 4, LEAVES);       // right ankle
// hanging vines off the elbows
line(-10, 13, 5, -10, 9, 5, LEAVES);
line(12, 17, 6, 12, 13, 6, LEAVES);

// ---- baby Groot dancing at big Groot's feet (front-west) ----
block(-8, 0, -4, OAK_LOG);
block(-8, 1, -4, OAK_LOG);
block(-8, 2, -4, OAK_LOG);
block(-8, 3, -4, PLANKS);   // head
block(-8, 4, -4, LEAVES);   // twig tuft
block(-9, 2, -4, OAK_LOG);  // arms thrown up
block(-10, 3, -4, OAK_LOG);
block(-10, 4, -4, LEAVES);
block(-7, 2, -4, OAK_LOG);
block(-6, 3, -4, OAK_LOG);
block(-6, 4, -4, LEAVES);

// ---- forest-floor set dressing ----
// fallen mossy log, front-east foreground
barkBox(6, 0, -5, 12, 1, -4);
cube(6, 0, -5, 6, 1, -4, PLANKS);    // cut ends
cube(12, 0, -5, 12, 1, -4, PLANKS);
cube(8, 2, -5, 10, 2, -4, LEAVES);
// mushrooms
block(-11, 1, 3, PLANKS);
disk(-11, 2, 3, 1, BRICK);
block(-11, 3, 3, SNOW);
block(13, 1, -2, PLANKS);
disk(13, 2, -2, 1, BRICK);
block(13, 3, -2, SNOW);
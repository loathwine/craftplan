// pacman-4x-opus — prompt:
// Pac-Man chased by a ghost...

cube(-17, 1, 0, -1, 16, 16, AIR);
cube(3, 1, 0, 18, 16, 16, AIR);
cube(-22, 6, 6, -15, 10, 10, AIR);

// ---------- PAC-MAN (yellow), fleeing west, mouth open toward -X ----------
const px = -9, py = 8, pz = 8, PR = 7;
const halfMouth = 36 * Math.PI / 180;
for (let x = -PR; x <= PR; x++) {
  for (let y = -PR; y <= PR; y++) {
    for (let z = -PR; z <= PR; z++) {
      if (x*x + y*y + z*z <= PR*PR) {
        // carve wedge mouth opening toward -X (in the X-Y plane)
        const ang = Math.atan2(y, x);
        const d = Math.abs(Math.abs(ang) - Math.PI);
        if (d < halfMouth) continue; // leave mouth open
        block(px + x, py + y, pz + z, SAND);
      }
    }
  }
}
// Pac-Man eye: dark cluster on upper-front, offset away from the mouth
cube(px + 1, py + 4, pz - 5, px + 2, py + 5, pz - 3, STONE);

// ---------- GHOST (red Blinky), chasing from the east ----------
const gx = 11, gz = 8, GR = 6, baseY = 2, shoulderY = 9;
// body cylinder with scalloped (wavy) skirt at the bottom
for (let x = -GR; x <= GR; x++) {
  for (let z = -GR; z <= GR; z++) {
    if (x*x + z*z <= GR*GR) {
      for (let y = baseY; y <= shoulderY; y++) {
        const phase = (((x + GR) % 4) + 4) % 4;      // teeth pattern along X
        if (phase >= 2 && (y - baseY) < 2) continue; // carve the wavy notches
        block(gx + x, y, gz + z, BRICK);
      }
    }
  }
}
// domed head (upper hemisphere)
for (let x = -GR; x <= GR; x++) {
  for (let y = 0; y <= GR; y++) {
    for (let z = -GR; z <= GR; z++) {
      if (x*x + y*y + z*z <= GR*GR) {
        block(gx + x, shoulderY + y, gz + z, BRICK);
      }
    }
  }
}
// Ghost eyes on the front face, pupils cut toward Pac-Man (-X)
function ghostEye(ex) {
  cube(gx + ex - 1, 10, 2, gx + ex + 1, 12, 3, SNOW); // white of the eye
  cube(gx + ex - 1, 10, 1, gx + ex,     11, 2, GLASS); // blue pupil, looking west
}
ghostEye(-3);
ghostEye(3);

// ---------- PELLET TRAIL (being devoured to the west) ----------
sphere(-22, 8, 8, 1, SNOW);           // power pellet
block(-19, 8, 8, SNOW);
block(-17, 8, 8, SNOW);
block(-15, 8, 8, SNOW);

// ---------- GROUND SHADOWS ----------
disk(px, 0, pz, 6, STONE);
disk(gx, 0, gz, 6, STONE);
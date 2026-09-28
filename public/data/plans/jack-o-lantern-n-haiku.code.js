// jack-o-lantern-n-haiku — prompt:
// a glowing jack-o'-lantern...

// Glowing Jack-o'-Lantern

// Main pumpkin body - large orange sphere
sphere(0, 5, 0, 7, ORANGE);

// Add pumpkin ridges (vertical ribs for texture)
for (let i = 0; i < 6; i++) {
  const angle = Math.PI * 2 * i / 6;
  const x = Math.round(Math.cos(angle) * 6.5);
  const z = Math.round(Math.sin(angle) * 6.5);
  line(x, 1, z, x, 11, z, ORANGE);
}

// Darken bottom/sides for shading
cube(-7, 2, -3, -5, 8, 3, BROWN);
cube(5, 2, -3, 7, 8, 3, BROWN);

// LEFT EYE - triangular carved opening
cube(-5, 7, -2, -2, 10, 1, AIR);
// Glowing left eye (warm glow)
sphere(-3.5, 8, -0.5, 1, GLOWSTONE);
sphere(-3.5, 8, -0.5, 0.5, LAVA);

// RIGHT EYE - matching right eye
cube(2, 7, -2, 5, 10, 1, AIR);
// Glowing right eye
sphere(3.5, 8, -0.5, 1, GLOWSTONE);
sphere(3.5, 8, -0.5, 0.5, LAVA);

// NOSE - small diamond-shaped hole
cube(-1, 6, -2, 1, 7, 1, AIR);
sphere(0, 6, -0.5, 0.6, GLOWSTONE);

// MOUTH - large menacing grin
cube(-4, 1, -2, 4, 5, 1, AIR);
// Mouth glow (bright orange/red interior)
sphere(0, 3, -0.5, 2.5, LAVA);
sphere(-2, 2, -0.5, 1.2, LAVA);
sphere(2, 2, -0.5, 1.2, LAVA);

// Stem with leaves on top
cylinder(0, 13, 0, 1, 2, BROWN);
sphere(0, 15, 0, 1.5, LEAVES);
block(-1, 14, 1, LEAVES);
block(1, 14, 1, LEAVES);
block(0, 14, -1, LEAVES);

// Add curved brow details
line(-5, 10, -1, -2, 11, -1, ORANGE);
line(2, 10, -1, 5, 11, -1, ORANGE);
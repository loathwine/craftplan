// jack-o-lantern-4x-haiku — prompt:
// a jack-o'-lantern...

// Jack-o'-lantern

// Pumpkin body - layered spheres
sphere(0, 5, 0, 5, 10); // BRICK main
sphere(0, 8, 0, 3, 10); // BRICK top bulge
sphere(0, 2, 0, 4, 10); // BRICK bottom bulge

// Eyes - carved out
sphere(-2.5, 7, -4.5, 1.2, 0); // AIR left
sphere(2.5, 7, -4.5, 1.2, 0); // AIR right

// Eyebrows for expression
cube(-3.5, 8.2, -4, -1.5, 8.8, -3, 10); // BRICK left
cube(1.5, 8.2, -4, 3.5, 8.8, -3, 10); // BRICK right

// Nose - carved triangle
cube(-0.7, 3.5, -5, 0.7, 2, -3.5, 0); // AIR

// Mouth - wide grinning smile
cube(-4, 1, -5, 4, 3.5, -3, 0); // AIR

// Teeth - jagged line
for (let x = -3; x <= 3; x += 1.2) {
  block(x, 1.2, -4.2, 10); // BRICK
}

// Pumpkin grooves - vertical ridges
for (let r = 0; r < 12; r++) {
  const angle = (r / 12) * 6.28;
  const gx = Math.cos(angle) * 4.5;
  const gz = Math.sin(angle) * 4.5;
  line(gx, 1, gz, gx, 9, gz, 8); // COBBLE grooves
}

// Stem
cylinder(0, 10.5, 0, 0.9, 3.5, 4); // OAK_LOG

// Large leaves
cube(0.5, 10, -2, 2.5, 12.5, 0.5, 5); // LEAVES right
cube(-2.5, 10, -2, -0.5, 12.5, 0.5, 5); // LEAVES left
cube(-1, 10.5, 1.5, 1.5, 11.5, 3, 5); // LEAVES front

// Decorative curly leaves
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * 6.28;
  const lx = Math.cos(a) * 1.8;
  const lz = Math.sin(a) * 1.8;
  cube(lx - 0.4, 10.5 + (i % 3) * 0.3, lz - 0.4, lx + 0.8, 12.5, lz + 0.6, 5);
}

// Base ring
cube(-4.5, 0.2, -4.5, 4.5, 1, 4.5, 8); // COBBLE
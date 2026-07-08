// xenomorph-4x-haiku — prompt:
// the Alien xenomorph...

// Xenomorph alien - sleek, biomechanical hunter

// HEAD & CRANIUM
sphere(0, 5, -2.5, 1.9, STONE);
cube(-1.3, 3.8, -4.2, 1.3, 9, -0.8, STONE);
cube(-0.9, 7.5, -4.8, 0.9, 10, 0.2, STONE);

// Jaw complex - open mouth with ridges
cube(-1.1, 2.2, -2.8, 1.1, 4, 0.5, COBBLE);
cube(-0.9, 1.8, -2, 0.9, 2.8, 1.5, STONE);

// Upper teeth line
for (let i = 0; i < 5; i++) {
  const x = -1.2 + i * 0.5;
  block(x, 4, -2.2, GLASS);
  block(x, 3.8, -1.5, GLASS);
}

// Lower teeth line
for (let i = 0; i < 5; i++) {
  const x = -1.2 + i * 0.5;
  block(x, 2.2, -2.2, GLASS);
  block(x, 2.4, -1.5, GLASS);
}

// Face plate detail
cube(-1.8, 3.5, -2, -1.2, 5.5, -0.8, COBBLE);
cube(1.2, 3.5, -2, 1.8, 5.5, -0.8, COBBLE);

// Neck column
cylinder(0, 2.8, -0.5, 1.15, 1.8, STONE);

// SHOULDERS & TORSO
cube(-2.5, 1.2, -1.2, 2.5, 3.8, 3, STONE);

// Pectoral ridge plating
cube(-2, 1.2, 0.5, -0.8, 2.5, 1.8, COBBLE);
cube(0.8, 1.2, 0.5, 2, 2.5, 1.8, COBBLE);

// Mid-torso segments
cube(-1.9, 0, 1.2, 1.9, 1.2, 2.8, STONE);
cube(-1.6, -0.2, 1.5, 1.6, 0.5, 2.2, COBBLE);

// Lower abdomen
cube(-1.9, -1.2, 1.5, 1.9, 0, 2.8, STONE);

// LEFT ARM - muscular, reaching
cube(-3.8, 1, -0.8, -2.5, 2.8, 1.5, STONE);
cube(-5.2, 0.2, -0.2, -3.8, 1.8, 1.2, STONE);
cube(-6.5, -0.8, 0.2, -5.2, 0.8, 0.8, COBBLE);

// RIGHT ARM - muscular, reaching
cube(2.5, 1, -0.8, 3.8, 2.8, 1.5, STONE);
cube(3.8, 0.2, -0.2, 5.2, 1.8, 1.2, STONE);
cube(5.2, -0.8, 0.2, 6.5, 0.8, 0.8, COBBLE);

// HIP structure
cube(-2, -1.2, 1.8, 2, 0.5, 3.2, STONE);

// LEFT LEG - powerful stance
cube(-1.8, -1.2, 1.8, -0.8, -3.5, 3.2, STONE);
cube(-1.8, -3.5, 2.2, -0.8, -6.5, 3, STONE);
cube(-1.6, -6.5, 2.5, -1, -7.8, 2.8, COBBLE);

// RIGHT LEG - powerful stance
cube(0.8, -1.2, 1.8, 1.8, -3.5, 3.2, STONE);
cube(0.8, -3.5, 2.2, 1.8, -6.5, 3, STONE);
cube(1, -6.5, 2.5, 1.6, -7.8, 2.8, COBBLE);

// TAIL - long, undulating menace
for (let i = 0; i < 12; i++) {
  const z = 3.2 + i * 0.9;
  const sway = Math.sin(i * 0.38) * 1.3;
  const dip = -0.8 - i * 0.38 - Math.cos(i * 0.28) * 0.6;
  const rad = 0.75 - i * 0.045;
  
  cylinder(sway, dip, z, rad, 1.1, STONE);
  
  if (i % 2 === 0) {
    block(sway, dip + rad + 0.5, z, COBBLE);
  }
}

// DORSAL SPINES along back - iconic ridges
for (let i = 0; i < 9; i++) {
  const z = -1.2 + i * 0.95;
  const y = 6 - i * 0.35;
  
  block(-0.3, y, z, COBBLE);
  block(0.3, y, z, COBBLE);
  
  if (i > 2) {
    block(-0.3, y - 0.6, z, COBBLE);
    block(0.3, y - 0.6, z, COBBLE);
  }
}

// EYE SOCKETS - dark, soulless
block(-0.6, 5.2, -3.2, AIR);
block(0.6, 5.2, -3.2, AIR);

// Eye ridge scowl
cube(-1.5, 5.3, -3.5, 1.5, 6.5, -2.5, COBBLE);

// Nostril slits
block(-0.35, 4.2, -4, AIR);
block(0.35, 4.2, -4, AIR);

// Mouth interior darkness
cube(-0.8, 2.5, -1.5, 0.8, 3.5, 0.5, AIR);

// Biomechanical texture striations - chest
cube(-1.8, 2.2, 0.8, 1.8, 3.2, 1.5, COBBLE);

// Claw texture on hands
cube(-6.8, -0.5, -0.2, -6.2, 0.5, 0.5, COBBLE);
cube(6.2, -0.5, -0.2, 6.8, 0.5, 0.5, COBBLE);

// Additional spinal detail - lower back
cube(-1.2, -0.5, 1.8, 1.2, 0.3, 2.5, COBBLE);

// Leg muscle striations
cube(-1.6, -2.5, 2.5, -1, -3.8, 2.8, COBBLE);
cube(1, -2.5, 2.5, 1.6, -3.8, 2.8, COBBLE);
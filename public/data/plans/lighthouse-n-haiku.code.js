// lighthouse-n-haiku — prompt:
// a lighthouse on a stormy night...

// Lighthouse on a stormy night

// Foundation - circular stone base with rubble
cylinder(0, -1, 0, 7, 2, COBBLE);
cube(-7, -2, -7, 7, -1, 7, STONE);

// Main tower - brick walls with stone banding
cylinder(0, 1, 0, 6, 2, BRICK);
cylinder(0, 3, 0, 5.5, 3, BRICK);
cylinder(0, 6, 0, 5, 3, BRICK);
cylinder(0, 9, 0, 4.5, 3, BRICK);
cylinder(0, 12, 0, 4, 3, BRICK);
cylinder(0, 15, 0, 3.5, 4, BRICK);
cylinder(0, 19, 0, 3, 4, BRICK);

// Stone accent bands every 3 blocks
for (let y = 3; y < 23; y += 3) {
  hollowCylinder(0, y, 0, Math.max(2.8, 5.5 - y / 4), 1, STONE);
}

// Lantern room chamber at top
cylinder(0, 23, 0, 2.8, 2, BRICK);
hollowCylinder(0, 23, 0, 2.8, 2, GLASS);

// Beacon lighthouse - glowing center
sphere(0, 25, 0, 1.2, GLOWSTONE);

// Metal gallery/railing around lantern
for (let i = 0; i < 12; i++) {
  let angle = (i / 12) * Math.PI * 2;
  let x = Math.round(Math.cos(angle) * 3.3);
  let z = Math.round(Math.sin(angle) * 3.3);
  block(x, 23, z, IRON);
}

// Tower windows for light escape
for (let y = 7; y < 21; y += 4) {
  block(5, y, 0, AIR);
  block(-5, y, 0, AIR);
  block(0, y, 5, AIR);
}

// Weathered copper details on tower
for (let i = 0; i < 20; i++) {
  let y = 4 + Math.floor(Math.random() * 17);
  let ang = Math.random() * Math.PI * 2;
  let r = 4 + Math.random() * 1.5;
  let x = Math.round(Math.cos(ang) * r);
  let z = Math.round(Math.sin(ang) * r);
  block(x, y, z, COPPER);
}

// Spiral stairs inside tower
for (let y = 2; y < 22; y += 1.5) {
  let ang = (y / 22) * Math.PI * 3;
  let x = Math.round(Math.cos(ang) * 2);
  let z = Math.round(Math.sin(ang) * 2);
  block(x, Math.round(y), z, STONE);
}

// Interior lantern room void
for (let x = -2; x <= 2; x++) {
  for (let z = -2; z <= 2; z++) {
    block(x, 24, z, AIR);
  }
}

// Rocky eastern shore - jagged cliffs
cube(7, -2, -9, 11, 5, -5, STONE);
cube(9, -2, -3, 13, 3, 3, COBBLE);
sphere(9, 4, -7, 2.5, COBBLE);
sphere(11, 2, 0, 2.5, STONE);

// Rocky western shore
cube(-11, -2, -8, -7, 4, -2, COBBLE);
cube(-10, -2, 3, -6, 3, 9, STONE);
sphere(-9, 3, -5, 2, STONE);
sphere(-8, 2, 6, 2.5, COBBLE);

// Northern cliff face
cube(-5, -2, -11, 5, 3, -8, STONE);
sphere(2, 2, -9, 2, COBBLE);

// Rough ground texture - scattered boulders
for (let i = 0; i < 25; i++) {
  let x = Math.floor(Math.random() * 22) - 11;
  let y = 0 + Math.floor(Math.random() * 2);
  let z = Math.floor(Math.random() * 18) - 9;
  
  if (Math.sqrt(x*x + z*z) > 7) {
    block(x, y, z, Math.random() > 0.5 ? COBBLE : STONE);
  }
}

// Dark stormy water - turbulent seas around rocks
cube(-12, -1, -10, -8, 0, -8, WATER);
cube(8, -1, -10, 12, 0, -8, WATER);
cube(-12, -1, 8, -8, 0, 12, WATER);
cube(8, -1, 8, 12, 0, 12, WATER);

// Storm lightning effects - electric bolts in sky
block(9, 18, -8, ELECTRIC);
block(-9, 16, 8, ELECTRIC);
block(10, 14, 9, ELECTRIC);
block(-8, 20, -9, ELECTRIC);
block(11, 12, -7, ELECTRIC);

// Dark storm clouds backdrop - obsidian formation
cube(-7, 27, 16, 7, 32, 22, OBSIDIAN);
cube(-10, 24, 18, 10, 29, 24, OBSIDIAN);

// Distant fire effect for drama (small controlled FIRE)
block(12, 4, 10, FIRE);

// Additional tower detail - cracks/weathering
for (let i = 0; i < 30; i++) {
  let y = 5 + Math.floor(Math.random() * 15);
  let ang = Math.random() * Math.PI * 2;
  let dist = 4.5 + Math.random() * 0.8;
  let x = Math.round(Math.cos(ang) * dist);
  let z = Math.round(Math.sin(ang) * dist);
  
  if (Math.random() > 0.75) {
    block(x, y, z, GRAY);
  }
}

// Walkway foundation to lighthouse
cube(-1, -1, -7, 1, -1, -1, COBBLE);
cube(-2, -1, -3, 2, -1, -1, STONE);
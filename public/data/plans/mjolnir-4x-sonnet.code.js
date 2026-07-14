// mjolnir-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== MJÖLNIR — Thor's Hammer =====
// Front face (rune bands, lightning, carvings) faces NORTH / -Z toward camera.

// -- stone dais the hammer stands on --
disk(0, -1, 0, 7, BRICK);
disk(0, -1, 0, 6, STONE);

// scattered impact rubble / cracked debris around the dais
const rubble = [
  [8,0,-3],[-8,0,2],[7,0,5],[-7,0,-4],[6,0,7],[-6,0,-7],
  [9,0,1],[-9,0,-1],[5,0,-8],[-5,0,8],[8,0,6],[-8,0,-6]
];
for (const [x,y,z] of rubble) {
  block(x, y, z, Math.random() > 0.5 ? STONE : COBBLE);
}
// a few floating debris chunks kicked up by the impact
block(10, 3, -2, STONE);
block(-11, 4, 1, COBBLE);
block(9, 6, 4, STONE);
block(-9, 5, -5, STONE);
block(11, 2, 3, COBBLE);

// -- handle (haft) --
// wrist-strap loop hanging off the bottom end
hollowCylinder(0, -3, 0, 2, 1, COBBLE);
cube(-1, -2, -1, 1, -2, 1, OAK_LOG);

// core haft, 3x3, y0..11
cube(-1, 0, -1, 1, 11, 1, OAK_LOG);

// leather-wrapped grip bands (bulge wider than the core)
cube(-2, 2, -2, 2, 3, 2, PLANKS);
cube(-2, 7, -2, 2, 8, 2, PLANKS);

// metal collar bridging haft to head
cube(-3, 11, -3, 3, 11, 3, COBBLE);

// -- head: tapered hourglass profile, y12..20 --
const profile = [
  { y: 12, hx: 4, hz: 3, block: COBBLE }, // bottom cap (chamfer)
  { y: 13, hx: 6, hz: 4, block: COBBLE }, // bottom flange (metal band, widest)
  { y: 14, hx: 5, hz: 3, block: BRICK  }, // shoulder (leather wrap)
  { y: 15, hx: 4, hz: 3, block: STONE  },
  { y: 16, hx: 3, hz: 2, block: STONE  }, // waist (narrowest, rune band)
  { y: 17, hx: 4, hz: 3, block: STONE  },
  { y: 18, hx: 5, hz: 3, block: BRICK  }, // shoulder (leather wrap)
  { y: 19, hx: 6, hz: 4, block: COBBLE }, // top flange (metal band, widest)
  { y: 20, hx: 4, hz: 3, block: SNOW   }, // frosted top cap
];
for (const layer of profile) {
  cube(-layer.hx, layer.y, -layer.hz, layer.hx, layer.y, layer.hz, layer.block);
}

// engraved rune-like grooves on the north face of the metal bands
for (const yy of [13, 19]) {
  block(-4, yy, -4, AIR);
  block(-2, yy, -4, AIR);
  block(0, yy, -4, AIR);
  block(2, yy, -4, AIR);
  block(4, yy, -4, AIR);
}
// diagonal rune slash on the waist
block(-1, 15, -3, AIR);
block(0, 16, -2, AIR);
block(1, 17, -3, AIR);

// crackling energy aura ring around the waist
hollowCylinder(0, 16, 0, 4, 1, GLASS);

// -- lightning bolts flanking the head --
line(-9, 21, -2, -7, 18, -3, ICE);
line(-7, 18, -3, -10, 15, -2, ICE);
line(-10, 15, -2, -8, 12, -3, ICE);

line(9, 21, -2, 7, 18, -3, ICE);
line(7, 18, -3, 10, 15, -2, ICE);
line(10, 15, -2, 8, 12, -3, ICE);

// stray sparks near the head
block(-6, 20, -1, SNOW);
block(6, 13, -2, SNOW);
block(-5, 12, 2, SNOW);
block(5, 20, 1, SNOW);
block(0, 22, -2, ICE);

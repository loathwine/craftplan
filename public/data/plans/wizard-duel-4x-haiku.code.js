// wizard-duel-4x-haiku — prompt:
// two wizards dueling with magic...

const x1 = -12, x2 = 12, cy = 0, z = 0;

// WIZARD 1 - LEFT (facing right/east towards wizard 2)
// Base platform
cube(x1-2, cy-2, z-2, x1+2, cy-1, z+2, STONE);
cube(x1-2, cy-1, z-2, x1+2, cy-1, z+2, GRASS);

// Legs
cube(x1-1, cy, z-1, x1+1, cy+5, z+1, PLANKS);

// Robe layer (outer)
cube(x1-3, cy+3, z-3, x1+3, cy+11, z+3, PLANKS);

// Body (inner)
cube(x1-2, cy+5, z-2, x1+2, cy+10, z+2, BRICK);

// Left arm (resting back)
cube(x1-5, cy+6, z-1, x1-3, cy+9, z+1, PLANKS);
block(x1-6, cy+7, z, STONE);

// Right arm (casting forward towards opponent)
cube(x1+3, cy+6, z-1, x1+5, cy+9, z+1, PLANKS);
block(x1+6, cy+7, z, STONE);

// Neck
block(x1, cy+10, z, BRICK);

// Head
cube(x1-1, cy+11, z-1, x1+1, cy+13, z+1, BRICK);

// Wizard hat (tall pointed cone)
cube(x1-2, cy+13, z-2, x1+2, cy+13, z+2, COBBLE);
cube(x1-1, cy+14, z-1, x1+1, cy+14, z+1, COBBLE);
block(x1, cy+15, z, COBBLE);

// Staff with glowing orb
line(x1-6, cy+7, z, x1-8, cy+15, z, OAK_LOG);
cube(x1-9, cy+15, z-1, x1-7, cy+16, z+1, OAK_LOG);
sphere(x1-8, cy+17, z, 1, GLASS);

// WIZARD 2 - RIGHT (facing left/west towards wizard 1)
// Base platform
cube(x2-2, cy-2, z-2, x2+2, cy-1, z+2, STONE);
cube(x2-2, cy-1, z-2, x2+2, cy-1, z+2, GRASS);

// Legs
cube(x2-1, cy, z-1, x2+1, cy+5, z+1, PLANKS);

// Robe layer
cube(x2-3, cy+3, z-3, x2+3, cy+11, z+3, PLANKS);

// Body
cube(x2-2, cy+5, z-2, x2+2, cy+10, z+2, BRICK);

// Right arm (resting)
cube(x2+3, cy+6, z-1, x2+5, cy+9, z+1, PLANKS);
block(x2+6, cy+7, z, STONE);

// Left arm (casting)
cube(x2-5, cy+6, z-1, x2-3, cy+9, z+1, PLANKS);
block(x2-6, cy+7, z, STONE);

// Neck
block(x2, cy+10, z, BRICK);

// Head
cube(x2-1, cy+11, z-1, x2+1, cy+13, z+1, BRICK);

// Hat
cube(x2-2, cy+13, z-2, x2+2, cy+13, z+2, COBBLE);
cube(x2-1, cy+14, z-1, x2+1, cy+14, z+1, COBBLE);
block(x2, cy+15, z, COBBLE);

// Staff
line(x2+6, cy+7, z, x2+8, cy+15, z, OAK_LOG);
cube(x2+7, cy+15, z-1, x2+9, cy+16, z+1, OAK_LOG);
sphere(x2+8, cy+17, z, 1, GLASS);

// RED SPELL BOLT (low arc from left wizard)
const redPath = [
  [-10,10], [-9,10], [-8,9], [-7,8], [-6,7], [-5,8], [-4,9], [-3,10], [-2,10],
  [-1,9], [0,8], [1,9], [2,10], [3,10], [4,9], [5,8], [6,7], [7,8], [8,9], [9,10], [10,10]
];
for (let i = 0; i < redPath.length; i++) {
  const [x, y] = redPath[i];
  block(x, y, 0, BRICK);
  if (i % 2 === 0) {
    block(x, y, -1, BRICK);
    block(x, y, 1, BRICK);
  }
}

// BLUE SPELL BOLT (high arc from right wizard)
const bluePath = [
  [-10,5], [-9,5], [-8,6], [-7,7], [-6,8], [-5,9], [-4,9], [-3,8], [-2,7],
  [-1,6], [0,5], [1,6], [2,7], [3,8], [4,9], [5,9], [6,8], [7,7], [8,6], [9,5], [10,5]
];
for (let i = 0; i < bluePath.length; i++) {
  const [x, y] = bluePath[i];
  block(x, y, 0, GLASS);
  if (i % 2 === 0) {
    block(x, y, -1, GLASS);
    block(x, y, 1, GLASS);
  }
}

// MAGICAL COLLISION ZONE (center impact)
sphere(0, 7, 0, 3, AIR);
for (let x = -3; x <= 3; x++) {
  for (let y = 5; y <= 10; y++) {
    for (let z = -3; z <= 3; z++) {
      if ((x*x + (y-7)*(y-7) + z*z) < 11 && (x+y+z) % 2 === 0) {
        block(x, y, z, (x+z) % 3 === 0 ? BRICK : GLASS);
      }
    }
  }
}

// MAGICAL AURAS (glow rings around each wizard)
cube(x1-4, cy+7, z-4, x1-3, cy+9, z+4, GLASS);
cube(x1+3, cy+7, z-4, x1+4, cy+9, z+4, GLASS);
cube(x1-3, cy+7, z-4, x1+3, cy+8, z-3, GLASS);
cube(x1-3, cy+7, z+3, x1+3, cy+8, z+4, GLASS);

cube(x2-4, cy+7, z-4, x2-3, cy+9, z+4, GLASS);
cube(x2+3, cy+7, z-4, x2+4, cy+9, z+4, GLASS);
cube(x2-3, cy+7, z-4, x2+3, cy+8, z-3, GLASS);
cube(x2-3, cy+7, z+3, x2+3, cy+8, z+4, GLASS);

// GROUND SHOCKWAVE from spell impact
cube(-8, -2, -1, -4, -1, 1, BRICK);
cube(-3, -2, -2, 3, -1, 2, GLASS);
cube(4, -2, -1, 8, -1, 1, BRICK);

// SECONDARY MAGICAL SPIRALS around impact
for (let i = 1; i <= 5; i++) {
  block(-i, 11+i, 0, GLASS);
  block(i, 11+i, 0, GLASS);
  if (i % 2 === 0) {
    block(0, 12+i, i, BRICK);
    block(0, 12+i, -i, BRICK);
  }
}

// Robe details - folds and asymmetry
cube(x1-2, cy+6, z+2, x1-1, cy+9, z+3, PLANKS);
cube(x1+1, cy+6, z-3, x1+2, cy+9, z-2, PLANKS);

cube(x2-2, cy+6, z-3, x2-1, cy+9, z-2, PLANKS);
cube(x2+1, cy+6, z+2, x2+2, cy+9, z+3, PLANKS);
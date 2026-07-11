// knight-vs-dragon-4x-haiku — prompt:
// a knight fighting a dragon...

function createKnight(bx, by, bz) {
  // Battle platform
  cube(bx-4, by-2, bz-4, bx+4, by-1, bz+4, STONE);
  cube(bx-3, by-1, bz-3, bx+3, by, bz+3, COBBLE);
  
  // Legs - split stance
  cube(bx-1, by, bz-1, bx-1, by+3, bz+1, STONE);
  cube(bx+1, by, bz-1, bx+1, by+3, bz+1, STONE);
  cube(bx-1, by, bz-1, bx+1, by+1, bz+1, COBBLE);
  
  // Lower torso
  cube(bx-1, by+3, bz-1, bx+1, by+5, bz+1, STONE);
  
  // Upper torso - broad shoulders
  cube(bx-2, by+5, bz-1, bx+2, by+8, bz+1, STONE);
  
  // Chest plate armor - red
  cube(bx-1, by+5, bz+2, bx+1, by+7, bz+2, BRICK);
  cube(bx-1, by+5, bz+2, bx+1, by+5, bz+2, BRICK);
  
  // Left shoulder pauldron
  cube(bx-2, by+7, bz-1, bx-1, by+9, bz+1, STONE);
  cube(bx-3, by+7, bz, bx-2, by+8, bz, COBBLE);
  
  // Right shoulder pauldron
  cube(bx+1, by+7, bz-1, bx+2, by+9, bz+1, STONE);
  cube(bx+2, by+7, bz, bx+3, by+8, bz, COBBLE);
  
  // Neck guard
  cube(bx, by+8, bz-1, bx, by+9, bz+1, STONE);
  
  // Head - squared helmet
  cube(bx-1, by+9, bz-1, bx+1, by+11, bz+1, STONE);
  
  // Helmet with crest
  cube(bx-1, by+11, bz-1, bx+1, by+12, bz+1, COBBLE);
  line(bx, by+12, bz-1, bx, by+14, bz-2, COBBLE);
  cube(bx-1, by+13, bz-2, bx+1, by+14, bz-1, STONE);
  
  // Left arm down
  cube(bx-2, by+6, bz-1, bx-1, by+9, bz+1, STONE);
  cube(bx-3, by+5, bz-1, bx-2, by+7, bz+1, STONE);
  cube(bx-4, by+4, bz-1, bx-3, by+6, bz+1, COBBLE);
  
  // Left gauntlet
  cube(bx-4, by+4, bz-1, bx-3, by+5, bz+1, COBBLE);
  
  // Right arm raised with sword
  cube(bx+1, by+6, bz-1, bx+2, by+9, bz+1, STONE);
  cube(bx+2, by+5, bz-1, bx+3, by+7, bz+1, STONE);
  cube(bx+3, by+4, bz-1, bx+4, by+6, bz+1, COBBLE);
  
  // Sword - long blade
  cube(bx+3, by+7, bz-1, bx+5, by+12, bz+1, STONE);
  cube(bx+5, by+10, bz-1, bx+6, bz+11, bz+1, STONE);
  
  // Sword crossguard
  cube(bx+2, by+6, bz-2, bx+4, by+7, bz+2, STONE);
  
  // Sword pommel
  cube(bx+3, by+4, bz, bx+4, by+5, bz, COBBLE);
  
  // Shield on back
  cube(bx-3, by+6, bz+2, bx-2, by+10, bz+3, BRICK);
  
  // Shield details
  cube(bx-3, by+7, bz+3, bx-2, by+9, bz+3, COBBLE);
  
  // Cape - flowing
  cube(bx-1, by+7, bz+2, bx+1, by+11, bz+4, BRICK);
  cube(bx-2, by+8, bz+3, bx+2, by+10, bz+4, BRICK);
  
  // Base armor trim
  cube(bx-2, by+4, bz-2, bx+2, by+5, bz+2, COBBLE);
}

function createDragon(dx, dy, dz) {
  // Rear leg left
  cube(dx-2, dy, dz+3, dx-1, dy+2, dz+5, STONE);
  
  // Rear leg right
  cube(dx+1, dy, dz+3, dx+2, dy+2, dz+5, STONE);
  
  // Rear body mass
  sphere(dx, dy+3, dz+2, 4, BRICK);
  
  // Main body - central mass
  cube(dx-3, dy+2, dz-1, dx+3, dy+5, dz+2, BRICK);
  
  // Belly scales
  cube(dx-2, dy+2, dz, dx+2, dy+3, dz+1, COBBLE);
  
  // Front leg left
  cube(dx-2, dy, dz-3, dx-1, dy+2, dz-1, STONE);
  
  // Front leg right
  cube(dx+1, dy, dz-3, dx+2, dy+2, dz-1, STONE);
  
  // Neck - muscular upward curve
  cube(dx-1, dy+5, dz-4, dx+1, dy+8, dz-1, BRICK);
  
  // Head - large and angular
  cube(dx-2, dy+8, dz-7, dx+2, dy+11, dz-3, BRICK);
  
  // Upper snout
  cube(dx-2, dy+9, dz-8, dx-1, dy+10, dz-6, COBBLE);
  cube(dx+1, dy+9, dz-8, dx+2, dy+10, dz-6, COBBLE);
  
  // Lower jaw
  cube(dx-2, dy+8, dz-8, dx+2, dy+9, dz-6, COBBLE);
  
  // Left horn - long and curved
  line(dx-1, dy+11, dz-6, dx-3, dy+14, dz-7, STONE);
  line(dx-3, dy+14, dz-7, dx-4, dy+15, dz-5, STONE);
  
  // Right horn - long and curved
  line(dx+1, dy+11, dz-6, dx+3, dy+14, dz-7, STONE);
  line(dx+3, dy+14, dz-7, dx+4, dy+15, dz-5, STONE);
  
  // Left eye - glowing
  block(dx-1, dy+9, dz-7, GLASS);
  
  // Right eye - glowing
  block(dx+1, dy+9, dz-7, GLASS);
  
  // Left wing - large membrane
  cube(dx-5, dy+2, dz-2, dx-3, dy+7, dz+2, LEAVES);
  cube(dx-6, dy+3, dz-1, dx-5, dy+6, dz+1, LEAVES);
  cube(dx-7, dy+4, dz, dx-6, dy+5, dz, LEAVES);
  
  // Left wing details - bones
  line(dx-5, dy+7, dz-2, dx-6, dy+8, dz-2, STONE);
  line(dx-5, dy+7, dz+2, dx-6, dy+8, dz+2, STONE);
  
  // Right wing - large membrane
  cube(dx+3, dy+2, dz-2, dx+5, dy+7, dz+2, LEAVES);
  cube(dx+5, dy+3, dz-1, dx+6, dy+6, dz+1, LEAVES);
  cube(dx+6, dy+4, dz, dx+7, dy+5, dz, LEAVES);
  
  // Right wing details - bones
  line(dx+5, dy+7, dz-2, dx+6, dy+8, dz-2, STONE);
  line(dx+5, dy+7, dz+2, dx+6, dy+8, dz+2, STONE);
  
  // Tail - powerful and long
  line(dx, dy+2, dz+4, dx, dy+2, dz+9, BRICK);
  cube(dx-1, dy+1, dz+9, dx+1, dy+3, dz+11, BRICK);
  
  // Tail spike
  block(dx, dy+4, dz+9, STONE);
  block(dx, dy+4, dz+11, STONE);
  
  // Back spikes along spine
  block(dx, dy+5, dz, STONE);
  block(dx, dy+5, dz+1, STONE);
  block(dx, dy+5, dz+2, STONE);
  block(dx, dy+6, dz-2, STONE);
  
  // Mouth interior - dark
  cube(dx-1, dy+9, dz-7, dx+1, dy+9, dz-6, AIR);
  
  // Chest plating
  cube(dx-1, dy+4, dz-3, dx+1, dy+6, dz-2, COBBLE);
  
  // Front claw details
  block(dx-2, dy, dz-3, COBBLE);
  block(dx+2, dy, dz-3, COBBLE);
  block(dx-2, dy, dz+5, COBBLE);
  block(dx+2, dy, dz+5, COBBLE);
}

createKnight(-8, -1, -3);
createDragon(8, -1, 1);
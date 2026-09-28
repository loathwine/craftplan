// forge-haiku — sandbox error: WOOD is not defined
// --- extracted code ---
// Blacksmith's Forge

// Ground preparation and foundation
cube(-16, -2, -18, 8, -1, 8, STONE);
cube(-16, 0, -18, 8, 0, 8, COBBLE);

// Main structure - robust brick building
cube(-16, 0, -18, 8, 7, -18, BRICK);    // Back wall (north)
cube(-16, 0, -18, -16, 7, 8, BRICK);    // Left wall
cube(8, 0, -18, 8, 7, 8, BRICK);        // Right wall
cube(-16, 7, -18, 8, 7, 8, WOOD);       // Roof

// Roof beams for detail
cube(-14, 8, -14, 6, 8, 4, WOOD);
cube(-10, 8, -16, 2, 8, -12, WOOD);

// Tall brick chimney - rises from back wall
cube(-8, 7, -18, -4, 16, -18, BRICK);
hollowCube(-8, 7, -18, -4, 16, -18, AIR);

// ===== MAIN FORGE/FURNACE (center-back) =====
// Stone foundation for forge
cube(-10, 0, -14, 0, 1, -6, STONE);

// Brick forge chamber
cube(-10, 1, -14, 0, 5, -6, BRICK);
// Forge interior - working chamber
cube(-9, 2, -13, -1, 4, -7, AIR);

// Heat source with LAVA and FIRE
cube(-6, 1, -11, -4, 2, -9, LAVA);
block(-5, 2, -10, FIRE);
block(-5, 3, -10, FIRE);
block(-4, 2, -10, FIRE);
block(-4, 3, -10, FIRE);
block(-3, 2, -9, FIRE);

// Forge opening facing front
cube(-10, 2, -14, -8, 3, -14, AIR);

// ===== ANVIL - Central Work Surface =====
// Iron anvil platform
cube(-14, 0, -4, -8, 1, 2, IRON);
cube(-14, 1, -4, -8, 2, 2, IRON);

// Characteristic anvil horn
block(-14, 2, -2, IRON);
block(-14, 3, -2, IRON);
block(-14, 4, -2, IRON);

// ===== WORK BENCHES =====
// Primary wooden workspace
cube(-4, 1, 0, 4, 1, 6, PLANKS);
cube(-4, 2, 0, 4, 2, 4, PLANKS);  // Shelf

// Secondary work area
cube(-10, 1, 2, -6, 1, 6, PLANKS);

// ===== TOOL RACKS & STORAGE =====
// Left wall vertical rack
cube(-16, 1, -8, -16, 6, 0, OAK_LOG);
// Hanging tools
for(let y = 2; y < 5; y++) {
  block(-15, y, -6, IRON);
  block(-15, y, -4, IRON);
  block(-15, y, -2, IRON);
}

// Right wall shelving
cube(6, 1, 2, 6, 6, 6, PLANKS);
for(let y = 2; y <= 5; y++) {
  block(5, y, 4, IRON);
}

// ===== BELLOWS MECHANISM =====
// Side-mounted air pump for forge
cube(-16, 0, -12, -12, 3, -8, WOOD);
cube(-16, 3, -12, -12, 4, -8, PLANKS);

// ===== METAL STORAGE =====
// Gold ingots
cube(4, 0, -12, 8, 2, -8, GOLD);

// Copper
cube(4, 0, -6, 8, 2, -2, COPPER);

// ===== COAL/FUEL STORAGE =====
cube(-10, 0, 6, -4, 2, 8, COBBLE);

// ===== WINDOWS =====
block(-16, 3, -8, GLASS);
block(-16, 3, 0, GLASS);
block(-16, 3, 4, GLASS);
block(8, 3, -10, GLASS);
block(8, 3, 2, GLASS);

// ===== DECORATIVE DISPLAY =====
// Finished metalwork display
cube(4, 1, 4, 6, 3, 6, IRON);
block(5, 3, 5, GLOWSTONE);

// Weapon rack
cube(-2, 1, -18, 2, 3, -18, IRON);

// Quenching barrel - water for cooling
cylinder(-8, 0, -2, 1, 1, COBBLE);
block(-8, 1, -2, WATER);

// Additional fire pit for ambiance
cylinder(-4, 0, 4, 1, 1, COBBLE);
block(-4, 1, 4, LAVA);
block(-4, 2, 4, FIRE);

// Entrance threshold
cube(-4, 0, -18, 2, 0, -18, COBBLE);

// Decorative anvil blocks on shelves
block(5, 2, 4, IRON);
block(5, 4, 4, IRON);
block(5, 6, 4, IRON);

// Small furnace for metals
cube(0, 0, 6, 2, 2, 8, BRICK);
hollowCube(0, 1, 6, 2, 1, 8, AIR);
block(1, 2, 7, LAVA);

// --- raw stdout ---
/*
```javascript
// Blacksmith's Forge

// Ground preparation and foundation
cube(-16, -2, -18, 8, -1, 8, STONE);
cube(-16, 0, -18, 8, 0, 8, COBBLE);

// Main structure - robust brick building
cube(-16, 0, -18, 8, 7, -18, BRICK);    // Back wall (north)
cube(-16, 0, -18, -16, 7, 8, BRICK);    // Left wall
cube(8, 0, -18, 8, 7, 8, BRICK);        // Right wall
cube(-16, 7, -18, 8, 7, 8, WOOD);       // Roof

// Roof beams for detail
cube(-14, 8, -14, 6, 8, 4, WOOD);
cube(-10, 8, -16, 2, 8, -12, WOOD);

// Tall brick chimney - rises from back wall
cube(-8, 7, -18, -4, 16, -18, BRICK);
hollowCube(-8, 7, -18, -4, 16, -18, AIR);

// ===== MAIN FORGE/FURNACE (center-back) =====
// Stone foundation for forge
cube(-10, 0, -14, 0, 1, -6, STONE);

// Brick forge chamber
cube(-10, 1, -14, 0, 5, -6, BRICK);
// Forge interior - working chamber
cube(-9, 2, -13, -1, 4, -7, AIR);

// Heat source with LAVA and FIRE
cube(-6, 1, -11, -4, 2, -9, LAVA);
block(-5, 2, -10, FIRE);
block(-5, 3, -10, FIRE);
block(-4, 2, -10, FIRE);
block(-4, 3, -10, FIRE);
block(-3, 2, -9, FIRE);

// Forge opening facing front
cube(-10, 2, -14, -8, 3, -14, AIR);

// ===== ANVIL - Central Work Surface =====
// Iron anvil platform
cube(-14, 0, -4, -8, 1, 2, IRON);
cube(-14, 1, -4, -8, 2, 2, IRON);

// Characteristic anvil horn
block(-14, 2, -2, IRON);
block(-14, 3, -2, IRON);
block(-14, 4, -2, IRON);

// ===== WORK BENCHES =====
// Primary wooden workspace
cube(-4, 1, 0, 4, 1, 6, PLANKS);
cube(-4, 2, 0, 4, 2, 4, PLANKS);  // Shelf

// Secondary work area
cube(-10, 1, 2, -6, 1, 6, PLANKS);

// ===== TOOL RACKS & STORAGE =====
// Left wall vertical rack
cube(-16, 1, -8, -16, 6, 0, OAK_LOG);
// Hanging tools
for(let y = 2; y < 5; y++) {
  block(-15, y, -6, IRON);
  block(-15, y, -4, IRON);
  block(-15, y, -2, IRON);
}

// Right wall shelving
cube(6, 1, 2, 6, 6, 6, PLANKS);
for(let y = 2; y <= 5; y++) {
  block(5, y, 4, IRON);
}

// ===== BELLOWS MECHANISM =====
// Side-mounted air pump for forge
cube(-16, 0, -12, -12, 3, -8, WOOD);
cube(-16, 3, -12, -12, 4, -8, PLANKS);

// ===== METAL STORAGE =====
// Gold ingots
cube(4, 0, -12, 8, 2, -8, GOLD);

// Copper
cube(4, 0, -6, 8, 2, -2, COPPER);

// ===== COAL/FUEL STORAGE =====
cube(-10, 0, 6, -4, 2, 8, COBBLE);

// ===== WINDOWS =====
block(-16, 3, -8, GLASS);
block(-16, 3, 0, GLASS);
block(-16, 3, 4, GLASS);
block(8, 3, -10, GLASS);
block(8, 3, 2, GLASS);

// ===== DECORATIVE DISPLAY =====
// Finished metalwork display
cube(4, 1, 4, 6, 3, 6, IRON);
block(5, 3, 5, GLOWSTONE);

// Weapon rack
cube(-2, 1, -18, 2, 3, -18, IRON);

// Quenching barrel - water for cooling
cylinder(-8, 0, -2, 1, 1, COBBLE);
block(-8, 1, -2, WATER);

// Additional fire pit for ambiance
cylinder(-4, 0, 4, 1, 1, COBBLE);
block(-4, 1, 4, LAVA);
block(-4, 2, 4, FIRE);

// Entrance threshold
cube(-4, 0, -18, 2, 0, -18, COBBLE);

// Decorative anvil blocks on shelves
block(5, 2, 4, IRON);
block(5, 4, 4, IRON);
block(5, 6, 4, IRON);

// Small furnace for metals
cube(0, 0, 6, 2, 2, 8, BRICK);
hollowCube(0, 1, 6, 2, 1, 8, AIR);
block(1, 2, 7, LAVA);
```
*/

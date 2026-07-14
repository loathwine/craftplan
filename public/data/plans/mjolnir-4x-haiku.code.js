// mjolnir-4x-haiku — prompt:
// Thor's hammer Mjölnir...

// Thor's Hammer Mjölnir - voxel architecture

// Main hammer head - massive rectangular striking surface
// Core structure in STONE
cube(-4, 2, -2, 4, 10, 2, STONE);

// Front striking surface (facing camera/north) - COBBLE detail
cube(-4, 2, -2, 4, 10, -2, COBBLE);

// Back face detail
cube(-4, 2, 2, 4, 10, 2, COBBLE);

// Top surface
cube(-4, 10, -2, 4, 10, 2, COBBLE);

// Bottom surface
cube(-4, 2, -2, 4, 2, 2, COBBLE);

// Left and right side faces
cube(-4, 2, -2, -4, 10, 2, COBBLE);
cube(4, 2, -2, 4, 10, 2, COBBLE);

// Vertical ridges - BRICK detail lines suggesting power
line(-3, 2, -2, -3, 10, -2, BRICK);
line(-1, 2, -2, -1, 10, -2, BRICK);
line(1, 2, -2, 1, 10, -2, BRICK);
line(3, 2, -2, 3, 10, -2, BRICK);

// Horizontal reinforcement bands
cube(-4, 3, -2, 4, 3, 2, BRICK);
cube(-4, 5, -2, 4, 5, 2, BRICK);
cube(-4, 7, -2, 4, 7, 2, BRICK);
cube(-4, 9, -2, 4, 9, 2, BRICK);

// Recessed rune-like details on front for depth
cube(-2, 4, -2, 2, 5, -2, AIR);
cube(-3, 7, -2, 3, 8, -2, AIR);
cube(-1, 9, -2, 1, 9, -2, AIR);

// Internal stone layers for mass and structure
cube(-3, 4, 0, 3, 5, 0, STONE);
cube(-3, 6, 0, 3, 7, 0, STONE);
cube(-3, 8, 0, 3, 9, 0, STONE);

// Handle - wooden OAK_LOG shaft extending downward
cube(-1, -6, -1, 1, 1, 1, OAK_LOG);

// Handle grip wrapping - PLANKS for texture
cube(-2, -5, -1, -1, -3, 1, PLANKS);
cube(1, -5, -1, 2, -3, 1, PLANKS);
cube(-2, -2, -1, 2, 0, 1, PLANKS);

// Handle decorative metal bands - BRICK
cube(-2, -4, -1, 2, -4, 1, BRICK);
cube(-2, -2, -1, 2, -2, 1, BRICK);
cube(-3, -1, -1, 3, -1, 1, BRICK);

// Transition zone between head and handle
cube(-3, 0, -1, 3, 1, 1, STONE);
cube(-2, 1, -1, 2, 1, 1, COBBLE);

// Handle base - reinforced grip end
cube(-1, -7, 0, 1, -7, 0, OAK_LOG);
cube(-2, -6, -1, 2, -6, 1, OAK_LOG);

// Top of hammer head - subtle dome effect
cube(-3, 11, -1, 3, 11, 1, COBBLE);
cube(-2, 12, 0, 2, 12, 0, STONE);
cube(-1, 13, 0, 1, 13, 0, STONE);
// creeper-4x-haiku — prompt:
// a Minecraft creeper...

// Minecraft Creeper

// Main body - green cube (GRASS)
cube(-1, 0, -1, 1, 3, 1, 1);

// Head section on top
cube(-1, 4, -1, 1, 5, 1, 1);

// Body shading - darker green (LEAVES) for depth
cube(1, 1, 0, 1, 3, 1, 5);
cube(-1, 1, 1, 0, 3, 1, 5);
cube(-1, 3, -1, 1, 3, 1, 5);

// Four stubby legs (STONE - gray)
cube(-2, -2, -2, -1, -1, -1, 3);
cube(1, -2, -2, 2, -1, -1, 3);
cube(-2, -2, 1, -1, -1, 2, 3);
cube(1, -2, 1, 2, -1, 2, 3);

// Leg texture detail (COBBLE - darker)
cube(-2, -1, -2, -2, -1, -1, 8);
cube(2, -1, -2, 2, -1, -1, 8);
cube(-2, -1, 1, -2, -1, 2, 8);
cube(2, -1, 1, 2, -1, 2, 8);

// Face features - eyes and mouth (COBBLE - reddish brown)
cube(-1, 5, -2, 0, 5, -1, 8);
cube(1, 5, -2, 1, 5, -1, 8);
cube(-1, 4, -2, 1, 4, -1, 8);

// Additional facial depth
block(0, 5, -2, 8);

// Base shading underneath body
cube(-1, -1, -1, 1, -1, 1, 5);

// Subtle body edge detail
block(-2, 1, 0, 5);
block(2, 1, 0, 5);
block(0, 0, -2, 5);
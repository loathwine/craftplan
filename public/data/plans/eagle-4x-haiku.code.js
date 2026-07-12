// eagle-4x-haiku — prompt:
// a bald eagle with wings spread...

// Bald Eagle with Spread Wings

// BODY - Main barrel shape
cube(-2, 4, 0, 2, 8, 5, COBBLE);
cube(-1, 3, 2, 1, 5, 6, COBBLE);

// UPPER BREAST - lighter coloring
cube(-3, 6, 1, 3, 8, 3, STONE);

// CHEST/SHOULDERS
cube(-3, 5, 0, 3, 7, 2, COBBLE);

// HEAD & NECK
cube(-1.5, 8, -3, 1.5, 10, 0, STONE);
cube(-2, 7.5, -1, 2, 8.5, 1, STONE);

// DISTINCTIVE WHITE HEAD
cube(-1.5, 8.5, -3, 1.5, 10, -1, SNOW);
cube(-2, 8, -2, 2, 9, 0, SNOW);

// BROWN HEAD PATCH
block(-1.5, 9, -2, BRICK);
block(1.5, 9, -2, BRICK);

// BEAK - dark and pointed
cube(-0.5, 8, -4.5, 0.5, 8.5, -3, BRICK);
line(0, 8, -5, 0, 8, -6, BRICK);

// EYES
block(-0.8, 8.5, -2, GLASS);
block(0.8, 8.5, -2, GLASS);

// LEFT WING - segments extending left and back
cube(-3, 6, 0, -2, 9, 3, COBBLE);
cube(-5, 5, 1, -3, 8, 3, COBBLE);
cube(-7, 5, 2, -5, 7, 4, COBBLE);
cube(-9, 4, 3, -7, 6, 5, COBBLE);
cube(-11, 4, 4, -9, 5, 6, COBBLE);
cube(-13, 3, 5, -11, 4, 7, COBBLE);
cube(-15, 2, 6, -13, 3, 8, STONE);
cube(-17, 2, 7, -15, 3, 9, STONE);

// Left wing feather detail layers
cube(-4, 5, 0, -3, 7, 2, STONE);
cube(-6, 4, 1, -5, 6, 3, STONE);
cube(-8, 4, 2, -7, 5, 4, STONE);
cube(-10, 3, 3, -9, 4, 5, STONE);
cube(-12, 2, 4, -11, 3, 6, STONE);
cube(-14, 2, 5, -13, 3, 7, STONE);

// Left wing undersides
cube(-6, 5, 2, -5, 5, 3, COBBLE);
cube(-8, 4, 3, -7, 4, 4, COBBLE);
cube(-10, 3, 4, -9, 3, 5, COBBLE);

// RIGHT WING - segments extending right and back
cube(2, 6, 0, 3, 9, 3, COBBLE);
cube(3, 5, 1, 5, 8, 3, COBBLE);
cube(5, 5, 2, 7, 7, 4, COBBLE);
cube(7, 4, 3, 9, 6, 5, COBBLE);
cube(9, 4, 4, 11, 5, 6, COBBLE);
cube(11, 3, 5, 13, 4, 7, COBBLE);
cube(13, 2, 6, 15, 3, 8, STONE);
cube(15, 2, 7, 17, 3, 9, STONE);

// Right wing feather detail layers
cube(3, 5, 0, 4, 7, 2, STONE);
cube(5, 4, 1, 6, 6, 3, STONE);
cube(7, 4, 2, 8, 5, 4, STONE);
cube(9, 3, 3, 10, 4, 5, STONE);
cube(11, 2, 4, 12, 3, 6, STONE);
cube(13, 2, 5, 14, 3, 7, STONE);

// Right wing undersides
cube(5, 5, 2, 6, 5, 3, COBBLE);
cube(7, 4, 3, 8, 4, 4, COBBLE);
cube(9, 3, 4, 10, 3, 5, COBBLE);

// TAIL base
cube(-2, 3, 6, 2, 6, 8, COBBLE);

// TAIL extension
cube(-1, 3, 9, 1, 5, 11, STONE);

// Tail sides feathering
cube(-2, 4, 7, -1, 5, 8, STONE);
cube(1, 4, 7, 2, 5, 8, STONE);

// TAIL tip
block(0, 3, 12, STONE);

// BELLY/UNDERSIDE DETAIL
cube(-1, 3, 2, 1, 4, 4, STONE);

// BACK FEATHERING
cube(-1, 4, 5, 1, 5, 7, STONE);

// RUMP
cube(-1, 4, 6, 1, 5, 7, COBBLE);

// LEGS
cube(-0.5, 2, 1, 0.5, 4, 2, STONE);
cube(-0.5, 2, 3, 0.5, 4, 4, STONE);

// TALONS/CLAWS
cube(-1, 1, 0, 1, 2, 1, BRICK);
cube(-1, 1, 3, 1, 2, 4, BRICK);

// Claw points
block(0, 0, 0, BRICK);
block(-2, 0, 0, BRICK);
block(0, 0, 3, BRICK);
block(-2, 0, 3, BRICK);

// FEATHER TEXTURE - neck
cube(-1, 7, 0, 1, 8, 1, STONE);

// Wing primaries edge detail
block(-18, 2, 8, COBBLE);
block(-17, 2, 9, STONE);
block(18, 2, 8, COBBLE);
block(17, 2, 9, STONE);

// Additional wing layering for dimension
cube(-5, 6, 1, -4, 7, 2, COBBLE);
cube(4, 6, 1, 5, 7, 2, COBBLE);

// Mid-wing feathering
cube(-7, 4, 3, -6, 5, 4, STONE);
cube(6, 4, 3, 7, 5, 4, STONE);

// Far wing tips
cube(-16, 1, 7, -15, 2, 8, COBBLE);
cube(15, 1, 7, 16, 2, 8, COBBLE);
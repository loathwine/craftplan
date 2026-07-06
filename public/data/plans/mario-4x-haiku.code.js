// mario-4x-haiku — prompt:
// Super Mario...

// Super Mario - Iconic voxel builder

// Head - peachy round (PLANKS)
sphere(4, 10, 3, 3, 7);

// RED CAP - the iconic symbol
cube(2, 13, 1, 6, 16, 5, 10);
sphere(4, 16, 3, 2.5, 10);

// Cap visor extends forward
cube(1, 13, -1, 7, 14, 4, 10);

// Eyes - white with pupils
block(2, 11, 0, 11);
block(3, 11, 0, 11);
block(2, 11, 0, 8);
block(6, 11, 0, 11);
block(7, 11, 0, 11);
block(6, 11, 0, 8);

// Iconic MUSTACHE - black COBBLE
block(1, 9, 0, 8);
block(2, 9, 0, 8);
block(3, 9, 0, 8);
block(4, 9, 0, 8);
block(5, 9, 0, 8);
block(6, 9, 0, 8);
block(7, 9, 0, 8);

// Nose
block(4, 10, 0, 7);

// BODY - Blue shirt (GLASS)
cube(2, 6, 1, 6, 10, 5, 11);

// Red overalls/pants (BRICK)
cube(2, 2, 1, 6, 6, 5, 10);

// LEFT ARM - flesh (PLANKS)
cube(-1, 6, 2, 1, 10, 4, 7);
// Left glove - white (SNOW)
cube(-1, 6, 1, 1, 8, 5, 12);

// RIGHT ARM - flesh
cube(7, 6, 2, 9, 10, 4, 7);
// Right glove - white
cube(7, 6, 1, 9, 8, 5, 12);

// LEFT LEG
cube(2, 2, 2, 3, 6, 3, 10);
// Left foot/shoe - black (COBBLE)
cube(1, 0, 1, 4, 2, 4, 8);

// RIGHT LEG  
cube(5, 2, 2, 6, 6, 3, 10);
// Right foot/shoe - black
cube(4, 0, 1, 7, 2, 4, 8);

// SCENE ELEMENTS - use budget for detail

// Iconic green WARP PIPE
hollowCylinder(14, 0, -2, 2.5, 7, 5);
cube(13, 0, -3, 15, 1, -1, 5);

// Golden COINS scattered
sphere(11, 5, 10, 1, 6);
sphere(16, 4, -6, 1, 6);
sphere(18, 3, 8, 1, 6);
sphere(10, 4, -10, 1, 6);
sphere(19, 2, 2, 1, 6);

// Red MUSHROOM power-up
sphere(12, 4, 15, 1.5, 10);
cylinder(11, 2, 14, 0.8, 2, 7);

// BRICK BLOCKS
cube(20, 1, 6, 22, 3, 8, 10);
cube(20, 3, 6, 22, 5, 8, 10);
cube(-20, 1, 10, -18, 3, 12, 10);

// Green QUESTION BLOCKS  
cube(8, 2, 14, 10, 4, 16, 6);
block(9, 3, 15, 6);

// Stone brick platform detail
cube(-10, 0, -15, 18, 1, -18, 8);

// Another pipe structure
hollowCylinder(-12, 0, 10, 2, 5, 5);

// Extra coins in arc
sphere(-5, 6, 5, 0.8, 6);
sphere(-8, 7, 6, 0.8, 6);
sphere(-11, 8, 7, 0.8, 6);

// Fire flower - red/yellow
sphere(6, 4, -12, 1.2, 10);
block(5, 5, -12, 6);
block(7, 5, -12, 6);
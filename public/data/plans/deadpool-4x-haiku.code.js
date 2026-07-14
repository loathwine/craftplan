// deadpool-4x-haiku — prompt:
// Deadpool...

const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, OAK_LOG = 4, LEAVES = 5;
const SAND = 6, PLANKS = 7, COBBLE = 8, BRICK = 10, GLASS = 11, SNOW = 12;

// Base platform
cube(-6, -4, -5, 6, -3, 5, COBBLE);
cube(-5, -5, -4, 5, -4, 4, STONE);

// Left boot
cube(-3, -3, -3, -1.5, -1, 0.5, COBBLE);

// Right boot
cube(1.5, -3, -3, 3, -1, 0.5, COBBLE);

// Left leg - red
cube(-3, -1, -2.5, -1.5, 6, 0.5, BRICK);

// Right leg - red
cube(1.5, -1, -2.5, 3, 6, 0.5, BRICK);

// Black calf stripe left
cube(-2.8, 1, -2.7, -1.7, 4, -2, COBBLE);

// Black calf stripe right
cube(1.7, 1, -2.7, 2.8, 4, -2, COBBLE);

// Pelvis - red
cube(-3.5, 6, -2, 3.5, 7.5, 1, BRICK);

// Torso main - red
cube(-3.5, 7.5, -3, 3.5, 14, 1.5, BRICK);

// Black center stripe torso
cube(-0.5, 7.5, -3.1, 0.5, 14, 1.6, COBBLE);

// Black side panels
cube(-3.7, 8.5, -2.8, -3.3, 13, 1.3, COBBLE);
cube(3.3, 8.5, -2.8, 3.7, 13, 1.3, COBBLE);

// Belt
cube(-3.7, 7, -3, 3.7, 8, 1.5, STONE);

// Left shoulder/arm
cube(-5, 11.5, -2.5, -3, 13.5, 1, BRICK);

// Right shoulder/arm
cube(3, 11.5, -2.5, 5, 13.5, 1, BRICK);

// Left forearm - angled up
cube(-5.2, 9.5, -2.5, -3.5, 11, 1, BRICK);

// Right forearm - angled up
cube(3.5, 9.5, -2.5, 5.2, 11, 1, BRICK);

// Left glove - black
cube(-5.5, 8.5, -2.7, -4.8, 10, 0.8, COBBLE);

// Right glove - black
cube(4.8, 8.5, -2.7, 5.5, 10, 0.8, COBBLE);

// Neck
cube(-1.5, 13.5, -1.5, 1.5, 14.5, 1, BRICK);

// Head - mask (front-facing)
cube(-2.5, 14.5, -4, 2.5, 19.5, 0.5, BRICK);

// Face front red panel
cube(-2.2, 15, -4.2, 2.2, 19, -3.7, BRICK);

// Left eye - white
sphere(-1.2, 16.5, -4.3, 1, SNOW);

// Right eye - white
sphere(1.2, 16.5, -4.3, 1, SNOW);

// Left eye - black pupil
sphere(-1.2, 16.5, -4.5, 0.5, COBBLE);

// Right eye - black pupil
sphere(1.2, 16.5, -4.5, 0.5, COBBLE);

// Mouth detail
line(-1.5, 15, -4.1, 1.5, 15, -4.1, COBBLE);
line(-1.5, 15.5, -4.1, 1.5, 15.5, -4.1, COBBLE);

// Back of head
cube(-2.5, 14.5, 0.2, 2.5, 19.5, 0.5, COBBLE);

// Left katana on back
line(-2.8, 15, 1, -0.5, 20, 4, OAK_LOG);
cube(-2.5, 14.8, 0.8, -0.8, 15.5, 1.3, STONE);

// Right katana on back
line(2.8, 15, 1, 0.5, 20, 4, OAK_LOG);
cube(0.8, 14.8, 0.8, 2.5, 15.5, 1.3, STONE);

// Chest emblem
cube(-0.3, 9.5, -3.1, 0.3, 10.5, -2.9, STONE);
line(-0.6, 10, -3, 0.6, 10, -3, STONE);

// Left shoulder pauldron detail
cube(-5.2, 12.5, -3, -4.8, 13.8, 1.5, STONE);

// Right shoulder pauldron detail
cube(4.8, 12.5, -3, 5.2, 13.8, 1.5, STONE);

// Arm striping - left
cube(-5, 10.5, -2.7, -3.2, 12, 0.8, COBBLE);

// Arm striping - right
cube(3.2, 10.5, -2.7, 5, 12, 0.8, COBBLE);

// Hip armor left
cube(-3.8, 8, -3.2, -3.2, 9.5, 0.2, STONE);

// Hip armor right
cube(3.2, 8, -3.2, 3.8, 9.5, 0.2, STONE);

// Thigh armor left
cube(-3.2, 4.5, -3.2, -1.5, 6.5, -2.5, STONE);

// Thigh armor right
cube(1.5, 4.5, -3.2, 3.2, 6.5, -2.5, STONE);

// Knee armor left
cube(-2.8, 2, -3.2, -1.7, 3.5, -2.5, STONE);

// Knee armor right
cube(1.7, 2, -3.2, 2.8, 3.5, -2.5, STONE);

// Red hand details left
cube(-5.5, 9, -2.5, -5, 10, 0.5, BRICK);

// Red hand details right
cube(5, 9, -2.5, 5.5, 10, 0.5, BRICK);

// Utility belt pouch left
cube(-3.2, 7.2, -3.5, -2.8, 8.2, -2.8, COBBLE);

// Utility belt pouch right
cube(2.8, 7.2, -3.5, 3.2, 8.2, -2.8, COBBLE);

// Head side detail left
cube(-2.7, 16, -3.8, -2.4, 18, -3.5, COBBLE);

// Head side detail right
cube(2.4, 16, -3.8, 2.7, 18, -3.5, COBBLE);
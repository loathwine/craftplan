// thor-haiku55 — prompt:
// Thor summoning lightning...

cube(-8,0,-6,8,30,6,AIR);

cylinder(0,-2,0,8,2,COBBLE);
hollowCylinder(0,-1,0,8,1,STONE);
hollowCylinder(0,-1,0,5,1,GOLD);
disk(0,-1,0,4,BRICK);
line(-4,-1,0,4,-1,0,GOLD);
line(0,-1,-4,0,-1,4,GOLD);

const posts = [[7,0],[5,5],[0,7],[-5,5],[-7,0],[0,-7]];
for (const [x,z] of posts) { cube(x,0,z,x,2,z,COBBLE); block(x,3,z,BRICK); }
for (const x of [-5,5]) { const z = -5; cube(x,0,z,x,2,z,COBBLE); block(x,3,z,IRON); block(x,4,z,FIRE); }

cube(-8,0,4,-7,11,5,STONE);
cube(-8,12,4,-7,12,5,BRICK);
cube(7,0,4,8,7,5,STONE);
block(8,8,5,BRICK);

cube(-1,0,4,1,22,5,OBSIDIAN);
line(0,16,4,0,21,4,GOLD);
block(-1,18,4,GOLD);
block(1,19,4,GOLD);

sphere(-8,27,0,4,GRAY);
sphere(-12,26,-2,3,LIGHT_GRAY);
sphere(-3,29,-3,3,LIGHT_GRAY);
sphere(2,29,-3,4,GRAY);
sphere(10,28,-2,3,GRAY);
sphere(6,30,-6,3,LIGHT_GRAY);

cube(-3,0,-2,-1,0,0,BROWN);
cube(1,0,-2,3,0,0,BROWN);
cube(-3,1,-1,-1,5,1,BLUE);
cube(1,1,-1,3,5,1,BLUE);
block(-2,3,-2,IRON);
block(2,3,-2,IRON);

cube(-3,3,2,3,10,2,RED);
cube(-6,4,0,-6,9,2,RED);
cube(6,4,0,6,9,2,RED);

cube(-3,6,-1,3,10,1,IRON);
cube(-3,6,-1,3,6,1,BROWN);
block(0,6,-2,GOLD);
cube(-2,7,-2,2,9,-2,GOLD);
block(0,8,-2,RED);

cube(-5,7,-1,-4,10,0,IRON);
cube(-5,5,-1,-4,6,0,SAND);
cube(-5,4,-1,-4,4,0,GOLD);
cube(-5,10,-1,-3,11,1,GOLD);

cube(-4,15,-1,-3,17,0,IRON);
cube(3,15,-1,4,17,0,IRON);

cube(4,10,-1,5,12,0,IRON);
cube(3,10,-1,5,11,1,GOLD);
cube(4,13,-1,5,15,0,SAND);
cube(4,16,-1,5,16,0,GOLD);
cube(4,17,-1,5,17,0,SAND);

cube(5,18,-1,5,19,-1,OAK_LOG);
cube(3,20,-2,7,21,0,IRON);
block(4,21,-2,GOLD);
block(6,21,-2,GOLD);
block(5,20,-2,GOLD);

cube(-1,11,-1,1,11,1,SAND);
cube(-2,12,-2,2,14,1,SAND);
cube(-2,12,1,2,14,1,YELLOW);
cube(-2,12,-1,-2,14,1,YELLOW);
cube(2,12,-1,2,14,1,YELLOW);
cube(-2,14,-2,2,14,-2,IRON);
cube(-2,15,-2,2,15,1,IRON);
cube(-2,11,-3,2,12,-2,YELLOW);
block(-1,13,-2,NEON_BLUE);
block(1,13,-2,NEON_BLUE);

block(5,22,-1,ELECTRIC);
block(6,23,-1,ELECTRIC);
block(5,24,-1,ELECTRIC);
block(6,25,-1,ELECTRIC);
block(3,22,-2,ELECTRIC);
block(8,21,0,ELECTRIC);

block(-5,4,-5,FIRE);
block(5,4,-5,FIRE);
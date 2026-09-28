// thor-sonnet-fb1 — feedback pass 1
const CX = 0, CZ = 1;

function limb(x1, y1, z1, x2, y2, z2, id) {
  line(x1, y1, z1, x2, y2, z2, id);
  line(x1 + 1, y1, z1, x2 + 1, y2, z2, id);
}

// ---- ground ----
cylinder(CX, -2, CZ + 1, 12, 1, OBSIDIAN);
cylinder(CX, -1, CZ + 1, 11, 1, STONE);
cylinder(CX, -1, CZ + 1, 8, 1, COBBLE);
disk(CX, -1, CZ + 1, 5, OBSIDIAN);
cylinder(CX, 0, CZ + 1, 12, 3, AIR);

const rubble = [
  [-9,-1,-4],[-7,-1,7],[8,-1,-3],[9,-1,6],[-10,-1,2],[6,-1,-8],
  [-4,-1,9],[10,-1,-1],[-11,-1,-2],[3,-1,10],[-6,-1,-7],[7,-1,9]
];
for (const [x,y,z] of rubble) {
  cube(x, y, z, x + (Math.random()>0.5?1:0), y, z + (Math.random()>0.5?1:0), COBBLE);
}

const crackDirs = [[1,0.3],[-1,0.6],[0.4,1],[-0.5,1],[1,-1],[-1,-0.8],[0.2,-1],[-1,0.1]];
for (const [dx,dz] of crackDirs) {
  const len = 5 + Math.floor(Math.random()*3);
  line(CX, 0, CZ, Math.round(CX + dx*len), 0, Math.round(CZ + dz*len), NEON_BLUE);
}

// floating rubble - plain stone, only two get a faint spark accent
const floaters = [
  [-6,3,-3],[6,4,-2],[-5,7,4],[7,8,3],[-8,10,6],[4,12,-5],[-3,14,7]
];
for (const [x,y,z] of floaters) {
  cube(x, y, z, x+1, y+1, z+1, STONE);
}
block(7, 9, 3, ELECTRIC);
block(-3, 15, 7, ELECTRIC);

// ---- legs / boots ----
cylinder(CX - 1, 0, CZ, 1, 2, IRON);
cylinder(CX + 1, 0, CZ, 1, 2, IRON);
cylinder(CX - 1, 2, CZ, 1, 3, BLUE);
cylinder(CX + 1, 2, CZ, 1, 3, BLUE);
hollowCylinder(CX - 1, 1, CZ, 1, 1, GOLD);
hollowCylinder(CX + 1, 1, CZ, 1, 1, GOLD);
hollowCylinder(CX - 1, 4, CZ, 1, 1, GOLD);
hollowCylinder(CX + 1, 4, CZ, 1, 1, GOLD);

// ---- torso ----
cylinder(CX, 5, CZ, 2, 5, BLUE);
hollowCylinder(CX, 5, CZ, 2, 1, GOLD);         // belt
hollowCylinder(CX, 9, CZ, 2, 1, GOLD);         // chest trim
line(CX, 5, CZ - 2, CX, 9, CZ - 2, GOLD);      // emblem line
cube(CX - 1, 6, CZ - 2, CX + 1, 8, CZ - 2, GOLD); // emblem plate

// cape, trailing south (away from camera)
cube(CX - 2, 5, CZ + 2, CX + 1, 9, CZ + 2, PURPLE);
cube(CX - 1, 4, CZ + 3, CX + 3, 8, CZ + 4, PURPLE);
cube(CX, 3, CZ + 4, CX + 4, 7, CZ + 6, PURPLE);
cube(CX + 1, 2, CZ + 6, CX + 5, 5, CZ + 8, PURPLE);
cube(CX + 2, 1, CZ + 8, CX + 5, 3, CZ + 9, PURPLE);
line(CX - 2, 9, CZ + 2, CX + 1, 9, CZ + 2, GOLD); // cape clasp trim

// gauntlets
sphere(CX - 3, 4.5, CZ + 1, 0.7, GOLD);
sphere(CX + 3, 15, CZ - 2, 0.7, GOLD);

// pauldrons + neck + head
sphere(CX - 2.5, 10, CZ, 1.3, GOLD);
sphere(CX + 2.5, 10, CZ, 1.3, GOLD);
hollowSphere(CX - 2.5, 10, CZ, 1.4, BROWN);   // pauldron fur trim
hollowSphere(CX + 2.5, 10, CZ, 1.4, BROWN);
cylinder(CX, 10, CZ, 1, 1, IRON);
sphere(CX, 12, CZ, 1.4, LIGHT_GRAY);
sphere(CX, 13, CZ, 1.5, GOLD);
cube(CX - 1, 11, CZ - 1, CX + 1, 11, CZ - 1, BROWN);
cube(CX - 1, 10, CZ - 1, CX + 1, 10, CZ - 1, BROWN);

// winged helmet (signature feature) — thin white sweeps off the sides
line(CX - 2, 13, CZ, CX - 5, 15, CZ - 1, WHITE);
line(CX - 5, 15, CZ - 1, CX - 6, 16, CZ - 1, WHITE);
line(CX - 2, 13, CZ, CX - 4, 14, CZ - 1, WHITE);
line(CX + 2, 13, CZ, CX + 5, 15, CZ - 1, WHITE);
line(CX + 5, 15, CZ - 1, CX + 6, 16, CZ - 1, WHITE);
line(CX + 2, 13, CZ, CX + 4, 14, CZ - 1, WHITE);

block(CX - 1, 12, CZ - 1, NEON_BLUE);   // eyes
block(CX + 1, 12, CZ - 1, NEON_BLUE);

// ---- left arm, resting, empty fist ----
limb(CX - 2.5, 10, CZ, CX - 3, 7, CZ + 1, IRON);
limb(CX - 3, 7, CZ + 1, CX - 3, 5, CZ + 1, IRON);
sphere(CX - 3, 4, CZ + 1, 0.9, IRON);

// ---- right arm, raised, gripping hammer ----
limb(CX + 2.5, 10, CZ, CX + 3, 13, CZ - 1, IRON);
limb(CX + 3, 13, CZ - 1, CX + 3, 17, CZ - 2, IRON);
sphere(CX + 3, 15, CZ - 2, 0.9, IRON);

// ---- Mjolnir ----
line(CX + 3, 15, CZ - 2, CX + 3, 17, CZ - 2, BROWN);
cube(CX + 1, 17, CZ - 4, CX + 5, 20, CZ - 1, IRON);
hollowCube(CX + 1, 17, CZ - 4, CX + 5, 20, CZ - 1, GOLD);

// small, tight energy burst right at the hammer head only
hollowSphere(CX + 3, 18.5, CZ - 2.5, 1.5, ELECTRIC);
block(CX + 1, 20, CZ - 4, ELECTRIC);
block(CX + 5, 20, CZ - 1, ELECTRIC);
block(CX + 3, 21, CZ - 2, ELECTRIC);

// ---- lightning called from the sky, converging on the hammer ----
// kept clear of the body silhouette (offset east/north of the torso)
line(CX + 3, 30, CZ - 6, CX + 4, 26, CZ - 5, ELECTRIC);
line(CX + 4, 26, CZ - 5, CX + 3, 22, CZ - 4, ELECTRIC);
line(CX + 3, 22, CZ - 4, CX + 3, 19, CZ - 2, ELECTRIC);

line(CX + 4, 26, CZ - 5, CX + 8, 23, CZ - 3, ELECTRIC);
line(CX + 8, 23, CZ - 3, CX + 9, 20, CZ - 2, ELECTRIC);

line(CX + 3, 22, CZ - 4, CX - 1, 20, CZ - 6, ELECTRIC);
line(CX - 1, 20, CZ - 6, CX - 4, 19, CZ - 5, ELECTRIC);

// one distant secondary strike hitting rubble, well away from Thor
line(-6, 20, -8, -6, 8, -6, ELECTRIC);
line(-6, 8, -6, -7, 0, -6, ELECTRIC);

// ---- storm clouds, dark against the night sky ----
sphere(-7, 24, 8, 4, GRAY);
sphere(-3, 26, 10, 3, GRAY);
sphere(4, 25, 9, 5, GRAY);
sphere(9, 23, 7, 3, GRAY);
sphere(0, 28, 12, 4, LIGHT_GRAY);
sphere(-10, 22, 5, 3, GRAY);

// scorched marker stones at the perimeter
cube(-14, -1, -10, -13, 0, -9, COBBLE);
cube(12, -1, -11, 13, 0, -10, COBBLE);
block(-14, 0, -9, NEON_BLUE);
block(13, 0, -10, NEON_BLUE);
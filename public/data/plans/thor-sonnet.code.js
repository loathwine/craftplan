// thor-sonnet — prompt:
// Thor summoning lightning...

// ===== THOR SUMMONING LIGHTNING =====
// Facing -Z (north) toward camera. Body core at x=0,z=1. Hammer reaches forward/up toward -Z.

const CX = 0, CZ = 1;

// ---------- SITE PREP: scorched crater platform ----------
cylinder(CX, -2, CZ + 1, 12, 1, OBSIDIAN);           // deep scorched base
cylinder(CX, -1, CZ + 1, 11, 1, STONE);              // stone floor ring
cylinder(CX, -1, CZ + 1, 8, 1, COBBLE);              // inner cobble floor
disk(CX, -1, CZ + 1, 5, OBSIDIAN);                   // blast-scorched center
cylinder(CX, 0, CZ + 1, 12, 3, AIR);                 // clear obstructions above floor (trees/grass)

// crater rim rubble (asymmetric scatter)
const rubble = [
  [-9,-1,-4],[-7,-1,7],[8,-1,-3],[9,-1,6],[-10,-1,2],[6,-1,-8],
  [-4,-1,9],[10,-1,-1],[-11,-1,-2],[3,-1,10],[-6,-1,-7],[7,-1,9]
];
for (const [x,y,z] of rubble) {
  cube(x, y, z, x + (Math.random()>0.5?1:0), y, z + (Math.random()>0.5?1:0), COBBLE);
}

// radiating ground cracks (glowing)
const crackDirs = [[1,0.3],[ -1,0.6],[0.4,1],[ -0.5,1],[1,-1],[-1,-0.8],[0.2,-1],[-1,0.1]];
for (const [dx,dz] of crackDirs) {
  const len = 6 + Math.floor(Math.random()*4);
  line(CX, 0, CZ, Math.round(CX + dx*len), 0, Math.round(CZ + dz*len), NEON_BLUE);
}

// ---------- LEVITATING DEBRIS (storm is lifting rocks) ----------
const floaters = [
  [-6,3,-3],[6,4,-2],[-5,7,4],[7,8,3],[-8,10,6],[4,12,-5],[-3,14,7]
];
for (const [x,y,z] of floaters) {
  cube(x, y, z, x+1, y+1, z+1, STONE);
}

// ---------- THOR: LEGS ----------
cylinder(CX - 1, 0, CZ, 1, 2, IRON);      // left boot
cylinder(CX + 1, 0, CZ, 1, 2, IRON);      // right boot
cylinder(CX - 1, 2, CZ, 1, 3, BLUE);      // left greave
cylinder(CX + 1, 2, CZ, 1, 3, BLUE);      // right greave
hollowCylinder(CX - 1, 1, CZ, 1, 1, GOLD); // boot trim
hollowCylinder(CX + 1, 1, CZ, 1, 1, GOLD);
hollowCylinder(CX - 1, 4, CZ, 1, 1, GOLD); // knee trim
hollowCylinder(CX + 1, 4, CZ, 1, 1, GOLD);

// ---------- TORSO ----------
cylinder(CX, 5, CZ, 2, 5, BLUE);          // chest armor
hollowCylinder(CX, 5, CZ, 2, 1, GOLD);    // belt
hollowCylinder(CX, 9, CZ, 2, 1, GOLD);    // upper chest trim
line(CX, 5, CZ - 2, CX, 9, CZ - 2, GOLD); // center chest emblem line
cube(CX - 1, 6, CZ - 2, CX + 1, 8, CZ - 2, GOLD); // emblem plate

// cape (wind-blown to +X/+Z, asymmetric)
cube(CX - 2, 5, CZ + 2, CX + 1, 9, CZ + 2, PURPLE);
cube(CX - 1, 4, CZ + 3, CX + 3, 8, CZ + 4, PURPLE);
cube(CX, 3, CZ + 4, CX + 4, 7, CZ + 6, PURPLE);
cube(CX + 1, 2, CZ + 6, CX + 5, 5, CZ + 8, PURPLE);
cube(CX + 2, 1, CZ + 8, CX + 5, 3, CZ + 9, PURPLE);

// ---------- SHOULDERS / HEAD ----------
sphere(CX - 2.5, 10, CZ, 1.3, GOLD);   // left pauldron
sphere(CX + 2.5, 10, CZ, 1.3, GOLD);   // right pauldron (raised-arm side)
cylinder(CX, 10, CZ, 1, 1, IRON);      // neck
sphere(CX, 12, CZ, 1.4, LIGHT_GRAY);   // face/head
sphere(CX, 13, CZ, 1.5, GOLD);         // helmet dome (overlaps top of head)
cube(CX - 1, 11, CZ - 1, CX + 1, 11, CZ - 1, BROWN); // beard block
cube(CX - 1, 10, CZ - 1, CX + 1, 10, CZ - 1, BROWN); // beard lower

// helmet wings
line(CX - 2, 13, CZ, CX - 5, 15, CZ - 1, WHITE);
line(CX - 5, 15, CZ - 1, CX - 6, 16, CZ - 1, WHITE);
line(CX + 2, 13, CZ, CX + 5, 15, CZ - 1, WHITE);
line(CX + 5, 15, CZ - 1, CX + 6, 16, CZ - 1, WHITE);

// glowing eyes
block(CX - 1, 12, CZ - 1, NEON_BLUE);
block(CX + 1, 12, CZ - 1, NEON_BLUE);

// ---------- LEFT ARM (down, fist clenched at hip) ----------
line(CX - 2.5, 10, CZ, CX - 3, 7, CZ + 1, IRON);
line(CX - 3, 7, CZ + 1, CX - 3, 5, CZ + 1, IRON);
sphere(CX - 3, 4, CZ + 1, 0.9, IRON);

// ---------- RIGHT ARM (raised forward, holding hammer aloft) ----------
line(CX + 2.5, 10, CZ, CX + 3, 13, CZ - 1, IRON);
line(CX + 3, 13, CZ - 1, CX + 3, 17, CZ - 2, IRON);
sphere(CX + 3, 15, CZ - 2, 0.9, IRON); // grip

// ---------- MJOLNIR ----------
line(CX + 3, 15, CZ - 2, CX + 3, 17, CZ - 2, BROWN);       // handle
cube(CX + 1.5, 17, CZ - 3.5, CX + 4.5, 19, CZ - 0.5, IRON); // hammer head
hollowCube(CX + 1.5, 17, CZ - 3.5, CX + 4.5, 19, CZ - 0.5, GOLD); // trim
hollowSphere(CX + 3, 18, CZ - 2, 3, ELECTRIC); // crackling energy burst

// ---------- LIGHTNING BOLT FROM STORM TO HAMMER ----------
line(CX + 3, 30, CZ - 4, CX + 4, 27, CZ - 3);
line(CX + 3, 30, CZ - 4, CX + 4, 27, CZ - 3, ELECTRIC);
line(CX + 4, 27, CZ - 3, CX + 2, 24, CZ - 4, ELECTRIC);
line(CX + 2, 24, CZ - 4, CX + 4, 21, CZ - 3, ELECTRIC);
line(CX + 4, 21, CZ - 3, CX + 3, 18, CZ - 2, ELECTRIC);

// side branch bolts off the main strike
line(CX + 4, 27, CZ - 3, CX + 8, 25, CZ - 1, ELECTRIC);
line(CX + 8, 25, CZ - 1, CX + 10, 22, CZ + 1, ELECTRIC);
line(CX + 2, 24, CZ - 4, CX - 2, 22, CZ - 5, ELECTRIC);
line(CX - 2, 22, CZ - 5, CX - 5, 19, CZ - 6, ELECTRIC);

// secondary bolt striking near Thor's feet
line(CX - 6, 20, CZ - 2, CX - 4, 15, CZ - 1, ELECTRIC);
line(CX - 4, 15, CZ - 1, CX - 2, 9, CZ, ELECTRIC);
line(CX - 2, 9, CZ, CX - 1, 1, CZ, ELECTRIC);

// arcs around floating debris (energized rocks)
for (const [x,y,z] of floaters) {
  hollowSphere(x + 0.5, y + 0.5, z + 0.5, 1.5, ELECTRIC);
}

// ---------- STORM CLOUDS (background, asymmetric) ----------
sphere(-7, 24, 8, 4, GRAY);
sphere(-3, 26, 10, 3, LIGHT_GRAY);
sphere(4, 25, 9, 5, GRAY);
sphere(9, 23, 7, 3, LIGHT_GRAY);
sphere(0, 28, 12, 4, GRAY);
sphere(-10, 22, 5, 3, LIGHT_GRAY);

// ---------- FOREGROUND ACCENTS (closer to camera, low, small) ----------
cube(-14, -1, -10, -13, 0, -9, COBBLE);
cube(12, -1, -11, 13, 0, -10, COBBLE);
block(-14, 0, -9, NEON_BLUE);
block(13, 0, -10, NEON_BLUE);
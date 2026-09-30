// rocket-launch-fable — prompt:
// a rocket launching into space...

const cl = (a,b,c)=>Math.max(b,Math.min(c,a));

// --- clear trees over the pad area (air is free) ---
cube(-11, 0, -11, 11, 9, 11, AIR);

// --- launch pad ---
disk(0, -1, 0, 10, GRAY);
disk(0, 0, 0, 10, LIGHT_GRAY);
hollowCylinder(0, 0, 0, 10, 1, GRAY);
disk(0, 0, 0, 4, BLACK);            // scorch mark
// yellow hazard ring
for (let a = 0; a < Math.PI * 2; a += 0.35) {
  block(Math.round(Math.cos(a) * 7), 0, Math.round(Math.sin(a) * 7), YELLOW);
}
// flame trench (carved) with lava glow at the bottom
cube(-2, -3, -2, 2, -1, 2, AIR);
disk(0, -3, 0, 2, LAVA);

// --- rocket (lifted off, hovering above pad) ---
const RY = 9;                        // bottom of body
cylinder(0, RY, 0, 3, 16, WHITE);    // y 9..24
hollowCylinder(0, RY + 3, 0, 3, 1, RED);
hollowCylinder(0, RY + 4, 0, 3, 1, RED);
hollowCylinder(0, RY + 11, 0, 3, 1, RED);
hollowCylinder(0, RY + 12, 0, 3, 1, BLUE);
// side panel lines
for (let y = RY; y < RY + 16; y += 2) { block(3, y, -1, LIGHT_GRAY); block(-3, y, 1, LIGHT_GRAY); }
// porthole window facing north
block(0, RY + 8, -3, GLASS); block(-1, RY + 8, -3, GLASS); block(1, RY + 8, -3, GLASS);
block(0, RY + 9, -3, GLASS);
block(0, RY + 7, -3, IRON);
// nose cone
const noseR = [3, 3, 2, 2, 2, 1, 1, 1];
for (let i = 0; i < noseR.length; i++) disk(0, RY + 16 + i, 0, noseR[i], RED);
block(0, 33, 0, IRON);
disk(0, RY + 16, 0, 3, IRON);       // collar
// fins (4, tapered)
for (let i = 0; i < 5; i++) {
  const r = 3 + (5 - i);
  const y = RY + i;
  cube(3, y, 0, r, y, 0, RED);
  cube(-r, y, 0, -3, y, 0, RED);
  cube(0, y, 3, 0, y, r, RED);
  cube(0, y, -r, 0, y, -3, RED);
}
// fin tips
block(8, RY - 1, 0, RED); block(-8, RY - 1, 0, RED); block(0, RY - 1, 8, RED); block(0, RY - 1, -8, RED);
// engine section
disk(0, RY - 1, 0, 3, GRAY);
hollowCylinder(0, RY - 3, 0, 2, 2, IRON);   // main bell y 6..7
disk(0, RY - 3, 0, 1, LAVA);
for (const [dx, dz] of [[2,2],[-2,2],[2,-2],[-2,-2]]) {
  block(dx, RY - 2, dz, IRON);
  block(dx, RY - 3, dz, LAVA);
}

// --- exhaust plume ---
disk(0, 5, 0, 2, YELLOW);
disk(0, 4, 0, 2, YELLOW);
hollowCylinder(0, 4, 0, 3, 2, ORANGE);
disk(0, 3, 0, 3, ORANGE);
disk(0, 2, 0, 4, LAVA);
disk(0, 1, 0, 5, LAVA);
hollowCylinder(0, 1, 0, 6, 1, ORANGE);
// fire cells (kept sparse)
let fires = 0;
for (let a = 0; a < Math.PI * 2 && fires < 12; a += Math.PI / 6) {
  block(Math.round(Math.cos(a) * 4), 4, Math.round(Math.sin(a) * 4), FIRE); fires++;
}
for (let a = 0.3; a < Math.PI * 2 && fires < 24; a += Math.PI / 6) {
  block(Math.round(Math.cos(a) * 7), 2, Math.round(Math.sin(a) * 7), FIRE); fires++;
}
block(0, 6, 0, FIRE); block(1, 7, 1, FIRE); block(-1, 7, -1, FIRE);

// --- smoke clouds billowing outward ---
const smoke = [
  [7,1,-6,3,LIGHT_GRAY],[-7,1,-6,3,LIGHT_GRAY],[8,1,5,3,LIGHT_GRAY],[-8,1,5,3,LIGHT_GRAY],
  [0,1,-9,3,LIGHT_GRAY],[0,1,9,3,LIGHT_GRAY],[10,2,0,2,WHITE],[-10,2,0,2,WHITE],
  [11,1,-9,3,WHITE],[-11,1,-8,3,WHITE],[12,1,8,3,WHITE],[-12,1,9,3,WHITE],
  [4,3,-10,2,WHITE],[-5,3,-11,2,WHITE],[13,3,-3,2,WHITE],[-13,3,4,2,WHITE],
  [6,4,-7,2,WHITE],[-7,4,-6,2,WHITE],[15,1,-5,2,WHITE],[-15,1,-2,2,WHITE],
  [3,1,-14,2,WHITE],[-3,1,-14,2,WHITE],[2,2,14,2,WHITE],[-6,1,14,2,WHITE],
];
for (const [x,y,z,r,b] of smoke) {
  sphere(x, y, z, r, b);
  sphere(x, y - 1, z, r, AIR === 0 ? b : b); // keep base solid
}
// carve underside of smoke so it sits on the pad, not underground
cube(-16, -8, -16, 16, -2, 16, AIR);
disk(0, -1, 0, 10, GRAY);
cube(-2, -3, -2, 2, -1, 2, AIR);
disk(0, -3, 0, 2, LAVA);

// --- launch tower (east, catches light) ---
const TX = 8, TZ = 2;
for (const [dx, dz] of [[-1,-1],[1,-1],[-1,1],[1,1]]) line(TX+dx, 0, TZ+dz, TX+dx, 29, TZ+dz, IRON);
for (let y = 3; y <= 27; y += 4) {
  hollowCube(TX-1, y, TZ-1, TX+1, y, TZ+1, RED);
  // X bracing hints
  block(TX, y-2, TZ-1, IRON); block(TX, y-2, TZ+1, IRON); block(TX-1, y-2, TZ, IRON); block(TX+1, y-2, TZ, IRON);
}
for (let y = 8; y <= 24; y += 8) cube(TX-1, y, TZ-1, TX+1, y, TZ+1, LIGHT_GRAY);
cube(TX-1, 29, TZ-1, TX+1, 29, TZ+1, GRAY);
block(TX, 30, TZ, IRON); block(TX, 31, TZ, NEON_RED);
// swing arm (retracted, pointing north-west away from rocket)
line(TX-1, 26, TZ-1, TX-4, 26, TZ-3, LIGHT_GRAY);
line(TX-1, 27, TZ-1, TX-3, 27, TZ-2, IRON);
// umbilical arm lower
line(TX-1, 14, TZ, TX-4, 14, TZ-2, LIGHT_GRAY);
// ladder/lights
for (let y = 2; y <= 28; y += 6) block(TX+2, y, TZ, GLOWSTONE);
// tower base
cube(TX-2, 0, TZ-2, TX+2, 0, TZ+2, GRAY);

// --- fuel tanks (west background) ---
for (const [x, z] of [[-14, 4], [-14, 9]]) {
  cylinder(x, 0, z, 1, 1, GRAY);
  cylinder(x, 1, z, 2, 6, WHITE);
  hollowCylinder(x, 4, z, 2, 1, RED);
  disk(x, 7, z, 2, LIGHT_GRAY);
  block(x, 8, z, IRON);
  line(x + 2, 2, z, TX - 2, 2, TZ + 2, GRAY); // pipe to tower
}
// water tower for sound suppression (west-north)
cylinder(-13, 0, -8, 1, 7, IRON);
cylinder(-13, 7, -8, 3, 4, LIGHT_BLUE);
disk(-13, 11, -8, 3, GRAY);
block(-13, 12, -8, IRON);
line(-13, 3, -8, -11, 0, -8, GRAY); line(-13, 3, -8, -15, 0, -8, GRAY);

// --- small blockhouse / control bunker (north-east foreground, low) ---
cube(12, 0, -14, 17, 2, -11, COBBLE);
cube(13, 1, -15, 16, 1, -15, GLASS);
cube(12, 3, -14, 17, 3, -11, GRAY);
block(14, 4, -12, IRON); block(14, 5, -12, IRON); block(14, 6, -12, NEON_BLUE);

// --- surrounding light poles ---
for (const [x, z] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) {
  line(x, 1, z, x, 6, z, IRON);
  block(x, 7, z, GLOWSTONE);
}
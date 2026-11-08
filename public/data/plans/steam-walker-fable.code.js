// steam-walker-fable — prompt:
// a steam-powered walking machine...

// Steam-powered walking machine: copper boiler body on four articulated iron legs,
// cab + smokestack on top, coal tender behind. Faces NORTH (-Z).

function circleXY(cx, cy, z, r, id, ring) {
  for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
    const d = dx*dx + dy*dy;
    if (d <= r*r + 0.5 && (!ring || d > (r-1)*(r-1) + 0.5)) block(cx+dx, cy+dy, z, id);
  }
}
function circleYZ(x, cy, cz, r, id, ring) {
  for (let dy = -r; dy <= r; dy++) for (let dz = -r; dz <= r; dz++) {
    const d = dy*dy + dz*dz;
    if (d <= r*r + 0.5 && (!ring || d > (r-1)*(r-1) + 0.5)) block(x, cy+dy, cz+dz, id);
  }
}
function thickLine(x1,y1,z1,x2,y2,z2,id) {
  line(x1,y1,z1,x2,y2,z2,id);
  line(x1,y1+1,z1,x2,y2+1,z2,id);
  line(x1,y1,z1+1,x2,y2,z2+1,id);
}

// --- clear canopy around the machine (leaves/branches only) ---
cube(-14, 1, -13, 14, 9, 15, AIR);

// --- BOILER (horizontal copper cylinder along Z) ---
for (let z = -6; z <= 8; z++) circleXY(0, 11, z, 4, COPPER, false);
for (const z of [-6, -2, 2, 6]) circleXY(0, 11, z, 5, IRON, true);
// rivets on bands
for (const z of [-6, -2, 2, 6]) for (const [dx, dy] of [[0,5],[5,0],[-5,0],[0,-5],[4,3],[-4,3],[4,-3],[-4,-3],[3,4],[-3,4]]) block(dx, 11+dy, z, GRAY);
// front cap + furnace door
circleXY(0, 11, -7, 4, IRON, false);
circleXY(0, 11, -8, 3, GRAY, false);
cube(-1, 9, -9, 1, 11, -9, BLACK);
block(0, 10, -9, LAVA);
block(0, 11, -9, LAVA);
block(-2, 12, -9, IRON); block(2, 12, -9, IRON);
// headlamps
block(-3, 14, -8, GLOWSTONE); block(3, 14, -8, GLOWSTONE);
block(-3, 14, -7, GRAY); block(3, 14, -7, GRAY);
block(-3, 15, -7, IRON); block(3, 15, -7, IRON);
// rear cap
circleXY(0, 11, 9, 4, IRON, false);
circleXY(0, 11, 10, 2, GRAY, false);
// pressure gauge + safety valve up front
cube(-1, 15, -4, 1, 16, -4, WHITE);
block(0, 16, -5, RED);
cube(-1, 14, -4, 1, 14, -4, GOLD);
cylinder(0, 15, -1, 1, 3, GOLD);
block(0, 18, -1, STEAM);
// underbelly pipes & keel
line(-3, 7, -6, -3, 7, 8, GRAY);
line(3, 7, -6, 3, 7, 8, GRAY);
cube(-1, 6, -5, 1, 6, 7, IRON);
line(-5, 9, -4, -5, 9, 6, COPPER);
line(5, 9, -4, 5, 9, 6, COPPER);

// --- SMOKESTACK ---
cylinder(0, 15, 1, 2, 2, IRON);
hollowCylinder(0, 17, 1, 2, 8, BLACK);
cube(-2, 17, -1, 2, 24, 3, AIR);
hollowCylinder(0, 17, 1, 2, 8, BLACK);
circleXY(0, 25, 1, 0, BLACK, false);
for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
  const d = dx*dx + dz*dz;
  if (d <= 9.5 && d > 2.5) block(dx, 25, 1+dz, COPPER);
}
block(0, 26, 1, STEAM); block(0, 27, 1, STEAM); block(1, 27, 0, STEAM);
// secondary stacks
hollowCylinder(-3, 15, -3, 1, 5, COPPER);
block(-3, 20, -3, STEAM);
hollowCylinder(3, 15, -3, 1, 4, COPPER);
block(3, 19, -3, STEAM);

// --- CAB (behind stack) ---
cube(-4, 15, 4, 4, 15, 9, PLANKS);
cube(-4, 16, 4, 4, 20, 9, PLANKS);
cube(-3, 16, 5, 3, 19, 8, AIR);
// corner posts & trim
for (const [x, z] of [[-4,4],[4,4],[-4,9],[4,9]]) line(x, 15, z, x, 21, z, OAK_LOG);
// windows
cube(-2, 17, 4, 2, 18, 4, GLASS);
cube(-4, 17, 5, -4, 18, 8, GLASS);
cube(4, 17, 5, 4, 18, 8, GLASS);
cube(-2, 17, 9, 2, 18, 9, GLASS);
// roof
cube(-5, 21, 3, 5, 21, 10, BRICK);
cube(-4, 22, 4, 4, 22, 9, BRICK);
cube(-3, 23, 5, 3, 23, 8, BRICK);
cube(-1, 24, 6, 1, 24, 7, COPPER);
// roof lantern & whistle
block(0, 25, 6, GLOWSTONE);
block(-3, 24, 6, GOLD); block(-3, 25, 6, STEAM);
// driver at the controls
cube(-1, 16, 6, 1, 17, 7, BLUE);
block(0, 18, 6, BROWN);
block(0, 19, 6, BLACK);
block(0, 18, 5, PINK);
// control levers
block(2, 16, 5, IRON); block(2, 17, 5, RED);
block(-2, 16, 5, IRON); block(-2, 17, 5, GOLD);

// --- COAL TENDER ---
cube(-3, 8, 11, 3, 13, 15, BRICK);
cube(-2, 9, 12, 2, 13, 14, AIR);
cube(-2, 11, 12, 2, 13, 14, BLACK);
block(0, 14, 13, BLACK); block(1, 14, 12, BLACK); block(-1, 14, 14, BLACK);
line(-4, 8, 11, -4, 13, 11, IRON); line(4, 8, 11, 4, 13, 11, IRON);
line(-4, 8, 15, -4, 13, 15, IRON); line(4, 8, 15, 4, 13, 15, IRON);
cube(-3, 7, 11, 3, 7, 15, IRON);
// tender → boiler feed pipe
line(0, 9, 10, 0, 9, 11, COPPER);

// --- SIDE DRIVE GEARS + CRANKS ---
circleYZ(-5, 9, 1, 3, GOLD, true);
circleYZ(5, 9, 1, 3, GOLD, true);
for (const [dy, dz] of [[4,0],[-4,0],[0,4],[0,-4],[3,3],[-3,3],[3,-3],[-3,-3]]) { block(-5, 9+dy, 1+dz, GOLD); block(5, 9+dy, 1+dz, GOLD); }
block(-5, 9, 1, IRON); block(5, 9, 1, IRON);
circleYZ(-6, 13, -3, 2, IRON, true);
circleYZ(6, 13, 5, 2, IRON, true);

// --- LEGS ---
function leg(side, zHip, zFoot, lift) {
  const hx = side*4, hy = 10, hz = zHip;
  const kx = side*10, ky = 17, kz = Math.round((zHip + zFoot) / 2);
  const fx = side*13, fy = lift + 1, fz = zFoot;
  // hip joint
  sphere(side*5, hy, hz, 1.5, GRAY);
  block(side*6, hy, hz, IRON);
  // upper leg
  thickLine(hx, hy, hz, kx, ky, kz, IRON);
  line(hx, hy-1, hz, kx, ky-1, kz, GRAY);
  // knee
  sphere(kx, ky, kz, 1.5, COPPER);
  block(kx, ky+2, kz, GOLD);
  // piston actuator from boiler top to knee
  line(side*4, 14, hz, kx, ky, kz, COPPER);
  block(side*5, 15, hz, GRAY);
  block(side*6, 16, hz, STEAM);
  // lower leg
  thickLine(kx, ky, kz, fx, fy + 1, fz, IRON);
  line(kx, ky-1, kz, fx, fy, fz, GRAY);
  // ankle + foot pad
  sphere(fx, fy + 1, fz, 1, GRAY);
  cube(fx-1, fy, fz-2, fx+1, fy, fz+2, IRON);
  cube(fx-2, fy, fz-1, fx+2, fy, fz+1, IRON);
  block(fx, fy, fz-3, BLACK); block(fx, fy, fz+3, BLACK);
  block(fx-3, fy, fz, BLACK); block(fx+3, fy, fz, BLACK);
  block(fx, fy-1, fz, IRON);
  if (lift === 0) {
    // ground scar under planted foot
    cube(fx-3, -1, fz-3, fx+3, -1, fz+3, DIRT);
    cube(fx-2, 0, fz-2, fx+2, 0, fz+2, AIR);
    cube(fx-1, -1, fz-1, fx+1, -1, fz+1, COBBLE);
  }
}
leg(-1, -3, -9, 0);   // front-left planted, striding forward
leg( 1, -3, -2, 3);   // front-right lifted mid-step
leg(-1,  6,  4, 2);   // rear-left lifted
leg( 1,  6, 12, 0);   // rear-right planted

// --- OLD FOOTPRINTS behind the machine (where it came from) ---
for (const [x, z] of [[-13, 2], [13, -1], [-13, 16], [13, 19]]) {
  cube(x-2, -1, z-2, x+2, -1, z+2, DIRT);
  cube(x-1, 0, z-1, x+1, 0, z+1, AIR);
  block(x, -1, z, COBBLE);
}

// --- ground vent / hot spring the machine is passing ---
cube(6, -1, -14, 8, -1, -12, STONE);
block(7, -1, -13, WATER);
block(7, 0, -13, STEAM);

// --- small onlooker up front, gawking at the walker ---
cube(-9, 1, -15, -9, 2, -15, GREEN);
block(-9, 3, -15, PINK);
block(-9, 4, -15, BROWN);
block(-10, 2, -15, GREEN); block(-8, 2, -15, GREEN);
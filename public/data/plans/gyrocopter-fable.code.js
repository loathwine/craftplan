// gyrocopter-fable — prompt:
// a steampunk gyrocopter...

// Steampunk gyrocopter on a plank airfield, nose to the NORTH (-Z)
// ---------- helpers ----------
function hcylZ(cx, cy, z1, z2, r, id, hollow) {
  for (let z = z1; z <= z2; z++)
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++) {
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= r + 0.4 && (!hollow || d > r - 0.8)) block(cx + dx, cy + dy, z, id);
      }
}
function ringX(cx, cy, cz, r, id) { // wheel in YZ plane
  for (let dy = -r; dy <= r; dy++)
    for (let dz = -r; dz <= r; dz++) {
      const d = Math.sqrt(dy * dy + dz * dz);
      if (d <= r + 0.4 && d > r - 0.8) block(cx, cy + dy, cz + dz, id);
    }
}
function ringZ(cx, cy, cz, r, id) { // ring in XY plane
  for (let dx = -r; dx <= r; dx++)
    for (let dy = -r; dy <= r; dy++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= r + 0.4 && d > r - 0.8) block(cx + dx, cy + dy, cz, id);
    }
}

// ---------- site: clear trees, lay the airfield deck ----------
cube(-18, 1, -18, 18, 16, 20, AIR);
cube(-12, 0, -13, 12, 0, 19, PLANKS);
for (let z = -13; z <= 19; z += 4) cube(-12, 0, z, 12, 0, z, OAK_LOG);
hollowCube(-12, 0, -13, 12, 0, 19, IRON);
// painted landing circle
ringZ(0, 0, 0, 0, PLANKS);
for (let a = 0; a < 360; a += 6) {
  const x = Math.round(Math.cos(a * Math.PI / 180) * 9), z = Math.round(Math.sin(a * Math.PI / 180) * 9) + 1;
  block(x, 0, z, YELLOW);
}

// ---------- fuselage ----------
for (let z = -10; z <= 8; z++) {
  const hw = z <= -9 ? 1 : z <= -7 ? 2 : z <= 5 ? 3 : 2;
  const ytop = z <= -9 ? 4 : z <= -7 ? 5 : z <= -3 ? 6 : 8;
  cube(-hw, 2, z, hw, ytop, z, BROWN);
  // keel + top spine
  block(0, 2, z, IRON);
  if (z % 3 === 0) { // iron ribs
    cube(-hw, 2, z, -hw, ytop, z, IRON);
    cube(hw, 2, z, hw, ytop, z, IRON);
    cube(-hw, ytop, z, hw, ytop, z, IRON);
  } else if (z > -7 && z < 6) { // copper side panels
    block(-hw, 4, z, COPPER); block(-hw, 5, z, COPPER);
    block(hw, 4, z, COPPER); block(hw, 5, z, COPPER);
    block(-hw, 3, z, GOLD); block(hw, 3, z, GOLD); // gold stripe
  }
}
// portholes
for (const z of [1, 4]) { block(-3, 6, z, GLASS); block(3, 6, z, GLASS); }
// nose cap + headlamp
cube(0, 3, -11, 0, 4, -11, GOLD);
block(0, 4, -11, GLOWSTONE);
block(0, 5, -10, GOLD);
// cockpit opening
cube(-2, 5, -6, 2, 8, -1, AIR);
cube(-2, 6, -7, 2, 7, -7, GLASS);       // windscreen
cube(-2, 5, -7, 2, 5, -7, COPPER);      // windscreen frame
// dashboard gauges
block(-1, 5, -6, GOLD); block(0, 5, -6, GLASS); block(1, 5, -6, GOLD);
block(-2, 5, -6, IRON); block(2, 5, -6, IRON);
// seat + pilot
cube(-1, 5, -2, 1, 6, -1, BROWN);
block(0, 5, -3, BLACK);                 // legs
cube(-1, 6, -4, 1, 6, -3, BROWN);       // torso/coat
block(-1, 6, -5, IRON); block(1, 7, -5, IRON); // hands on levers
block(0, 7, -4, SAND);                  // head
block(0, 7, -5, GOLD);                  // brass goggles
block(0, 8, -4, BROWN);                 // leather cap
block(-1, 8, -4, BROWN); block(1, 8, -4, BROWN); // ear flaps
// red scarf streaming back
block(0, 6, -2, RED); block(0, 6, -1, RED); block(1, 7, 0, RED); block(1, 7, 1, RED); block(2, 8, 2, RED);

// ---------- boiler ----------
hcylZ(0, 7, 0, 6, 3, COPPER);
for (const z of [0, 3, 6]) hcylZ(0, 7, z, z, 3, GOLD, true);
for (const z of [1, 2, 4, 5]) { block(0, 10, z, IRON); block(-3, 7, z, IRON); block(3, 7, z, IRON); }
block(0, 7, 7, LAVA);                   // firebox glow
block(-1, 7, 7, IRON); block(1, 7, 7, IRON); block(0, 8, 7, IRON); block(0, 6, 7, IRON);
block(0, 9, 7, GLASS);                  // pressure gauge
// smokestack
hollowCylinder(-1, 10, 4, 1, 4, COPPER);
disk(-1, 14, 4, 1, GOLD);
block(-1, 14, 4, AIR);
block(-1, 14, 4, STEAM); block(-1, 16, 4, STEAM);
// side exhaust pipes
for (const s of [-1, 1]) {
  line(s * 3, 6, 2, s * 5, 6, 2, COPPER);
  line(s * 5, 6, 2, s * 5, 8, 2, COPPER);
  block(s * 5, 9, 2, GOLD);
  block(s * 5, 10, 2, STEAM);
  line(s * 3, 5, 5, s * 4, 5, 5, COPPER);
  block(s * 4, 4, 5, COPPER);
}

// ---------- rotor mast + rotor ----------
cube(0, 8, -1, 0, 13, -1, IRON);
cube(-1, 9, -1, 1, 9, -1, GOLD);
cube(0, 9, -2, 0, 9, 0, GOLD);
line(0, 8, -1, -2, 11, -1, COPPER); line(0, 8, -1, 2, 11, -1, COPPER); // mast braces
sphere(0, 14, -1, 1, GOLD);
// four blades, 2 wide, slight droop
line(2, 14, -1, 16, 13, -1, IRON); line(2, 14, 0, 16, 13, 0, BROWN);
line(-2, 14, -1, -16, 13, -1, IRON); line(-2, 14, 0, -16, 13, 0, BROWN);
line(0, 14, -3, 0, 13, -17, IRON); line(1, 14, -3, 1, 13, -17, BROWN);
line(0, 14, 1, 0, 13, 15, IRON); line(1, 14, 1, 1, 13, 15, BROWN);
for (const [x, z] of [[16, -1], [-16, -1], [0, -17], [0, 15]]) { block(x, 13, z, GOLD); block(x, 12, z, GOLD); }
// rotor root hardware
for (const [x, z] of [[2, -1], [-2, -1], [0, -3], [0, 1]]) block(x, 14, z, COPPER);

// ---------- tail boom + empennage ----------
line(0, 6, 8, 0, 6, 18, IRON);
line(0, 4, 8, 0, 4, 18, IRON);
for (let z = 8; z <= 17; z += 2) { line(0, 4, z, 0, 6, z + 1, COPPER); block(0, 5, z, BROWN); }
line(-1, 5, 8, -1, 5, 14, BROWN); line(1, 5, 8, 1, 5, 14, BROWN);
// vertical fin + rudder
hollowCube(0, 6, 15, 0, 11, 19, BROWN);
cube(0, 7, 16, 0, 10, 18, RED);
block(0, 9, 17, GOLD);
cube(0, 2, 16, 0, 4, 19, BROWN);
block(0, 3, 18, RED);
// horizontal stabilizer
cube(-5, 6, 16, 5, 6, 18, BROWN);
cube(-5, 6, 18, 5, 6, 18, RED);
line(-5, 6, 16, -5, 6, 18, IRON); line(5, 6, 16, 5, 6, 18, IRON);
line(-5, 6, 16, 5, 6, 16, IRON);
// tail skid
line(0, 3, 19, 0, 1, 19, IRON);

// ---------- pusher propeller ----------
block(0, 7, 9, GOLD);
line(0, 8, 9, 0, 12, 9, IRON); line(0, 6, 9, 0, 2, 9, IRON);
line(1, 7, 9, 5, 7, 9, IRON); line(-1, 7, 9, -5, 7, 9, IRON);
ringZ(0, 7, 9, 5, COPPER);

// ---------- landing gear ----------
line(-4, 2, 2, 4, 2, 2, IRON);           // axle
ringX(-4, 2, 2, 2, IRON); ringX(4, 2, 2, 2, IRON);
block(-4, 2, 2, GOLD); block(4, 2, 2, GOLD);
line(-3, 4, 1, -4, 2, 2, IRON); line(3, 4, 1, 4, 2, 2, IRON);
line(-3, 4, 3, -4, 2, 2, IRON); line(3, 4, 3, 4, 2, 2, IRON);
ringX(0, 1, -8, 1, IRON);
line(0, 3, -8, 0, 1, -8, IRON);
line(-1, 3, -8, 1, 3, -8, COPPER);

// ---------- fuel/water tower (east) ----------
cube(8, 1, 6, 12, 4, 10, BRICK);
hollowCube(8, 1, 6, 12, 4, 10, COBBLE);
cylinder(10, 5, 8, 3, 5, COPPER);
hollowCylinder(10, 6, 8, 3, 1, GOLD);
hollowCylinder(10, 9, 8, 3, 1, GOLD);
disk(10, 10, 8, 3, IRON);
sphere(10, 11, 8, 1, GOLD);
cube(13, 1, 8, 13, 9, 8, IRON);          // ladder
block(12, 7, 8, GLASS);                  // sight glass
// hose to the gyrocopter
line(7, 5, 7, 4, 5, 7, COPPER);
block(6, 6, 7, GOLD);
block(6, 7, 7, STEAM);
block(7, 4, 7, IRON);

// ---------- ground clutter ----------
cube(-8, 1, 4, -6, 2, 6, PLANKS);
hollowCube(-8, 1, 4, -6, 2, 6, OAK_LOG);
hollowCylinder(-9, 1, -6, 1, 3, IRON);
disk(-9, 4, -6, 1, IRON);
hollowCylinder(-9, 2, -6, 1, 1, GOLD);
cube(-6, 1, -6, -5, 1, -5, RED);          // toolbox
block(-5, 2, -5, IRON);
// mechanic with wrench
block(-6, 1, -2, BLUE); block(-6, 2, -2, BLUE);
block(-6, 3, -2, BROWN);
block(-6, 4, -2, SAND);
block(-6, 5, -2, BROWN);
block(-5, 3, -2, BROWN); block(-5, 4, -3, IRON); block(-5, 5, -3, IRON);
// lamp posts
for (const [x, z] of [[-10, -10], [12, -10], [-10, 17]]) {
  cube(x, 1, z, x, 5, z, IRON);
  block(x, 6, z, GLOWSTONE);
  block(x, 7, z, COPPER);
}
// oil spill + coal pile
cube(-7, 0, 8, -5, 0, 10, OBSIDIAN);
sphere(9, 1, -7, 2, BLACK);
cube(7, 1, -9, 11, 1, -5, AIR); // trim coal sphere bottom overhang
sphere(9, 0, -7, 2, BLACK);
cube(7, -1, -9, 11, -1, -5, AIR);
cube(7, -1, -9, 11, -1, -5, PLANKS);
// airship-fable — prompt:
// a steampunk airship...

// ===== Steampunk airship, bow to NORTH (-Z), moored to an iron mast =====
const CY = 20;         // envelope centre height
const A = 7, B = 7, C = 17;   // envelope semi-axes (x, y, z)

function inside(x, y, z) {
  return (x*x)/(A*A) + (y*y)/(B*B) + (z*z)/(C*C) <= 1.0;
}

// ---- Envelope: voxel shell of a prolate spheroid, canvas + ribs ----
for (let z = -C; z <= C; z++) {
  for (let y = -B; y <= B; y++) {
    for (let x = -A; x <= A; x++) {
      if (!inside(x, y, z)) continue;
      const shell = !inside(x+1,y,z) || !inside(x-1,y,z) || !inside(x,y+1,z) ||
                    !inside(x,y-1,z) || !inside(x,y,z+1) || !inside(x,y,z-1);
      if (!shell) continue;
      let id = SAND;                       // tan canvas
      if (((z + C) % 4) === 0) id = BROWN; // leather ribs
      if (z === 0 || z === 1) id = COPPER; // central brass band
      if (y <= -5 && ((z + C) % 4) !== 0) id = BROWN; // dark belly
      if (Math.abs(z) <= 5 && y >= 3 && ((x + 20) % 3) === 0) id = BROWN; // top seams
      block(x, CY + y, z, id);
    }
  }
}
// Nose cone & tail cap in brass
sphere(0, CY, -C, 2, COPPER);
block(0, CY, -C - 2, GOLD);
block(0, CY, -C - 3, GOLD);
sphere(0, CY, C, 2, COPPER);
// Keel catwalk under envelope
cube(-1, CY - 8, -11, 1, CY - 8, 11, OAK_LOG);
line(-1, CY - 7, -11, -1, CY - 7, 11, IRON);
line(1, CY - 7, -11, 1, CY - 7, 11, IRON);

// ---- Tail fins ----
for (let z = 11; z <= 19; z++) {
  const h = Math.max(1, Math.round((z - 9) * 0.9)); // grows toward stern
  const r = Math.max(0, Math.round(Math.sqrt(Math.max(0, 1 - (z*z)/(C*C))) * B));
  line(0, CY + r, z, 0, CY + r + h, z, RED);      // dorsal fin
  line(0, CY - r, z, 0, CY - r - h, z, RED);      // ventral fin
  line(r, CY, z, r + h, CY, z, RED);              // starboard fin
  line(-r, CY, z, -r - h, CY, z, RED);            // port fin
}
// Fin brass edges
line(0, CY + 9, 19, 0, CY + 2, 19, GOLD);
line(0, CY - 9, 19, 0, CY - 2, 19, GOLD);
line(9, CY, 19, 2, CY, 19, GOLD);
line(-9, CY, 19, -2, CY, 19, GOLD);

// ---- Gondola ----
const GY = 7; // gondola floor
cube(-3, GY, -9, 3, GY, 9, PLANKS);             // floor
cube(-3, GY - 1, -8, 3, GY - 1, 8, BROWN);      // underside
line(0, GY - 2, -8, 0, GY - 2, 8, OAK_LOG);     // keel
cube(-3, GY + 1, -9, -3, GY + 3, 9, PLANKS);    // port wall
cube(3, GY + 1, -9, 3, GY + 3, 9, PLANKS);      // starboard wall
cube(-3, GY + 1, 9, 3, GY + 3, 9, PLANKS);      // stern wall
// Bow: tapered prow
cube(-2, GY, -11, 2, GY + 2, -10, PLANKS);
cube(-1, GY, -13, 1, GY + 2, -12, PLANKS);
line(0, GY + 2, -14, 0, GY + 5, -16, GOLD);      // bowsprit
block(0, GY + 3, -14, COPPER);                    // figurehead
block(0, GY + 4, -15, GOLD);
// Cabin (wheelhouse) midships
cube(-3, GY + 4, -5, 3, GY + 4, 5, BROWN);       // cabin roof
cube(-3, GY + 1, -5, 3, GY + 3, -5, PLANKS);     // cabin front wall
cube(-3, GY + 1, 5, 3, GY + 3, 5, PLANKS);       // cabin back wall
// Windows: carve + glass
for (let z = -8; z <= 8; z += 2) {
  block(-3, GY + 2, z, GLASS);
  block(3, GY + 2, z, GLASS);
}
cube(-2, GY + 2, -5, 2, GY + 2, -5, GLASS);      // front windscreen
block(0, GY + 1, -5, AIR); block(0, GY + 1, 5, AIR); // doors
// Brass trim along gunwale
line(-3, GY + 4, -9, -3, GY + 4, 9, COPPER);
line(3, GY + 4, -9, 3, GY + 4, 9, COPPER);
line(-3, GY + 4, 9, 3, GY + 4, 9, COPPER);
// Deck railings fore
line(-2, GY + 3, -11, 2, GY + 3, -11, IRON);
line(-1, GY + 3, -13, 1, GY + 3, -13, IRON);
// Lanterns
block(-3, GY + 5, -9, GLOWSTONE);
block(3, GY + 5, -9, GLOWSTONE);
block(-3, GY + 5, 9, GLOWSTONE);
block(3, GY + 5, 9, GLOWSTONE);
block(0, GY + 3, -13, GLOWSTONE);
// Ship's wheel at bow of cabin
block(0, GY + 2, -7, OAK_LOG);
hollowCylinder(0, GY + 2, -7, 1, 1, BROWN);
cube(-1, GY + 3, -7, 1, GY + 3, -7, BROWN);

// ---- Boiler & engine room at stern ----
cylinder(0, GY + 1, 7, 2, 3, COPPER);            // boiler
hollowCylinder(0, GY + 2, 7, 2, 1, IRON);        // iron strap
block(0, GY + 1, 5, LAVA);                       // furnace glow
block(-1, GY + 1, 5, IRON); block(1, GY + 1, 5, IRON);
// Smokestacks
line(-1, GY + 4, 8, -1, GY + 7, 8, IRON);
line(1, GY + 4, 8, 1, GY + 7, 8, IRON);
block(-1, GY + 8, 8, COPPER); block(1, GY + 8, 8, COPPER);
block(-1, GY + 9, 8, STEAM);
block(1, GY + 9, 8, STEAM);
// Pressure gauges / pipes
line(-3, GY + 1, 6, -3, GY + 3, 6, COPPER);
line(3, GY + 1, 6, 3, GY + 3, 6, COPPER);
block(2, GY + 3, 7, GOLD); block(-2, GY + 3, 7, GOLD);
block(2, GY + 5, 7, STEAM);

// ---- Propellers (stern, both sides) ----
function propeller(px, py, pz) {
  line(px, py, pz - 3, px, py, pz - 1, IRON);     // drive shaft
  block(px, py, pz, GOLD);                       // hub
  line(px - 3, py + 3, pz, px + 3, py - 3, pz, PLANKS); // diagonal blade
  line(px - 3, py - 3, pz, px + 3, py + 3, pz, PLANKS); // other blade
  hollowCylinder(px, py, pz, 1, 1, IRON);        // hub ring (flat)
}
propeller(-6, GY + 2, 11);
propeller(6, GY + 2, 11);
// Engine nacelle arms
line(-3, GY + 2, 8, -6, GY + 2, 8, IRON);
line(3, GY + 2, 8, 6, GY + 2, 8, IRON);
cube(-7, GY + 1, 7, -5, GY + 3, 9, COPPER);
cube(7, GY + 1, 7, 5, GY + 3, 9, COPPER);
block(-6, GY + 4, 8, STEAM);
block(6, GY + 4, 8, STEAM);

// ---- Rigging: cables from gondola to envelope ----
const anchors = [
  [-3, -9], [3, -9], [-3, -3], [3, -3], [-3, 3], [3, 3], [-3, 9], [3, 9]
];
for (const [ax, az] of anchors) {
  const r = Math.sqrt(Math.max(0, 1 - (az*az)/(C*C))) * B;
  const ex = Math.sign(ax) * Math.round(r * 0.75);
  const ey = CY - Math.round(r * 0.65);
  line(ax, GY + 5, az, ex, ey, az, BROWN);
}
// Main iron struts
line(-1, GY + 5, -2, -1, CY - 7, -2, IRON);
line(1, GY + 5, -2, 1, CY - 7, -2, IRON);
line(-1, GY + 5, 2, -1, CY - 7, 2, IRON);
line(1, GY + 5, 2, 1, CY - 7, 2, IRON);
line(0, GY + 5, -10, 0, CY - 6, -11, IRON);
line(0, GY + 5, 9, 0, CY - 6, 10, IRON);

// ---- Mooring mast on the ground (NW, in view) ----
const MX = -14, MZ = -12;
cube(MX - 2, -1, MZ - 2, MX + 2, 18, MZ + 2, AIR);  // clear trees around mast
cube(MX - 2, -2, MZ - 2, MX + 2, -1, MZ + 2, COBBLE); // foundation
cube(MX - 1, 0, MZ - 1, MX + 1, 0, MZ + 1, STONE);
for (let y = 0; y <= 15; y++) {
  if (y % 5 === 0) {
    hollowCube(MX - 1, y, MZ - 1, MX + 1, y, MZ + 1, IRON);
  } else {
    block(MX - 1, y, MZ - 1, IRON); block(MX + 1, y, MZ - 1, IRON);
    block(MX - 1, y, MZ + 1, IRON); block(MX + 1, y, MZ + 1, IRON);
  }
}
// Cross bracing
for (let y = 1; y <= 14; y += 5) {
  line(MX - 1, y, MZ - 1, MX + 1, y + 3, MZ - 1, GRAY);
  line(MX - 1, y, MZ + 1, MX + 1, y + 3, MZ + 1, GRAY);
}
cube(MX - 2, 16, MZ - 2, MX + 2, 16, MZ + 2, PLANKS);   // platform
hollowCube(MX - 2, 17, MZ - 2, MX + 2, 17, MZ + 2, IRON); // railing
cube(MX - 1, 17, MZ - 1, MX + 1, 17, MZ + 1, AIR);
block(MX, 17, MZ, COPPER); block(MX, 18, MZ, GLOWSTONE);  // beacon
// Mooring cable to bow
line(MX, 18, MZ, 0, CY, -C - 3, BROWN);
// Ladder on mast
for (let y = 1; y <= 15; y += 2) block(MX, y, MZ - 2, OAK_LOG);

// ---- Ground details: crates, barrels, steam cart ----
cube(-9, 0, -8, -8, 0, -7, PLANKS);
cube(-8, 1, -8, -8, 1, -8, PLANKS);
cylinder(-10, 0, -5, 1, 2, BROWN);
cylinder(-6, 0, -10, 1, 2, BROWN);
block(-10, 2, -5, IRON);
cube(-12, 0, -4, -10, 1, -2, COPPER);   // small boiler cart
block(-11, 2, -3, IRON);
block(-11, 3, -3, STEAM);
block(-13, 0, -3, GRAY); block(-9, 0, -3, GRAY); // wheels
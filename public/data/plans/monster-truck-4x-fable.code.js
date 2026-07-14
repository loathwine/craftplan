// monster-truck-4x-fable — prompt:
// a monster truck...

// MONSTER TRUCK — front faces NORTH (-Z), crushing two cars, dirt flying behind

// Clear vegetation in the build footprint (trees/leaves up to y8)
cube(-14, 0, -16, 14, 8, 18, AIR);

// ---------- crushed cars under the truck ----------
// Car 1: cyan sedan (crushed flat)
cube(-6, 0, -4, 6, 1, -2, ICE);
cube(-3, 2, -4, 1, 2, -2, ICE);
cube(-2, 2, -4, 0, 2, -4, GLASS);          // squashed cabin windows
block(-5, 0, -5, STONE); block(3, 0, -5, STONE); // popped tires
// Car 2: yellow taxi (crushed flat)
cube(-6, 0, 1, 6, 1, 3, SAND);
cube(-2, 2, 1, 2, 2, 3, SAND);
cube(-1, 2, 1, 1, 2, 1, GLASS);
block(-3, 0, 5, STONE); block(2, 0, -7, STONE);  // flung tires

// ---------- drivetrain ----------
cube(-8, 5, -7, 8, 6, -7, STONE);          // front axle
cube(-8, 5, 7, 8, 6, 7, STONE);            // rear axle
sphere(0, 6, -7, 1, COBBLE);               // differentials
sphere(0, 6, 7, 1, COBBLE);
line(0, 6, -6, 0, 9, 0, COBBLE);           // driveshafts
line(0, 6, 6, 0, 9, 0, COBBLE);
// springs
cube(-4, 7, -7, -4, 9, -7, COBBLE); cube(4, 7, -7, 4, 9, -7, COBBLE);
cube(-4, 7, 7, -4, 9, 7, COBBLE);   cube(4, 7, 7, 4, 9, 7, COBBLE);
// 4-link suspension bars
line(5, 10, -3, 7, 6, -7, STONE);  line(-5, 10, -3, -7, 6, -7, STONE);
line(5, 10, 3, 7, 6, 7, STONE);    line(-5, 10, 3, -7, 6, 7, STONE);

// ---------- giant wheels (r=6, circular face in Y-Z plane) ----------
function wheel(x0, cz) {
  for (let dy = -6; dy <= 6; dy++) {
    for (let dz = -6; dz <= 6; dz++) {
      const d2 = dy * dy + dz * dz;
      if (d2 > 36) continue;
      let id;
      if (d2 <= 1) id = BRICK;                                   // hub cap
      else if (d2 <= 6) id = SNOW;                               // chrome hub
      else if (d2 <= 11) id = (dy === 0 || dz === 0 || Math.abs(dy) === Math.abs(dz)) ? SNOW : STONE; // spokes
      else if (d2 >= 29) id = (Math.abs(dy + dz) % 2 === 0) ? COBBLE : STONE; // knobby tread
      else id = STONE;                                           // tire sidewall
      cube(x0, 6 + dy, cz + dz, x0 + 2, 6 + dy, cz + dz, id);
    }
  }
}
wheel(-9, -7); wheel(7, -7);   // front pair
wheel(-9, 7);  wheel(7, 7);    // rear pair

// ---------- chassis frame ----------
cube(-5, 10, -10, -3, 11, 10, STONE);
cube(3, 10, -10, 5, 11, 10, STONE);
for (const z of [-9, -5, 0, 5, 9]) cube(-2, 10, z, 2, 11, z, STONE);

// ---------- red pickup body ----------
cube(-4, 12, -11, 4, 13, -10, BRICK);      // nose
cube(-4, 12, -9, 4, 14, -5, BRICK);        // hood
cube(-4, 12, -4, 4, 18, 1, BRICK);         // cab
cube(-4, 12, 2, 4, 12, 10, PLANKS);        // bed floor
cube(-4, 13, 2, 4, 15, 2, BRICK);          // bed front wall
cube(-4, 13, 2, -4, 15, 10, BRICK);        // bed left wall
cube(4, 13, 2, 4, 15, 10, BRICK);          // bed right wall
cube(-4, 13, 10, 4, 15, 10, BRICK);        // tailgate

// front face details (camera side)
cube(-2, 12, -11, 2, 13, -11, STONE);      // grille
block(-3, 13, -11, SNOW); block(3, 13, -11, SNOW); // headlights
cube(-4, 11, -12, 4, 12, -12, SNOW);       // front bumper
block(0, 11, -13, STONE);                  // tow hook
cube(-4, 11, 11, 4, 12, 11, SNOW);         // rear bumper

// windows
cube(-3, 15, -4, 3, 17, -4, GLASS);        // windshield
cube(-4, 15, -3, -4, 17, 0, GLASS);        // left window
cube(4, 15, -3, 4, 17, 0, GLASS);          // right window
cube(-2, 15, 1, 2, 16, 1, GLASS);          // rear window
// driver behind the windshield
block(0, 15, -3, SAND); block(0, 16, -3, STONE);

// racing stripe + hood scoop
cube(-1, 14, -9, 1, 14, -5, SNOW);
cube(-1, 18, -4, 1, 18, 1, SNOW);
cube(-1, 15, -8, 1, 16, -7, COBBLE);
cube(-1, 15, -8, 1, 16, -8, STONE);

// flame decals along both sides
for (let z = -9; z <= 9; z++) {
  for (const s of [-4, 4]) {
    block(s, 12, z, SAND);
    if ((z + 10) % 2 === 0) block(s, 13, z, SAND);
    if ((z + 9) % 4 === 0) block(s, 14, z, SAND);
  }
}

// roll bar with light pods
cube(-3, 13, 2, -3, 19, 2, STONE);
cube(3, 13, 2, 3, 19, 2, STONE);
cube(-3, 19, 2, 3, 19, 2, STONE);
block(-2, 20, 2, SNOW); block(0, 20, 2, SNOW); block(2, 20, 2, SNOW);

// cab roof light bar
cube(-3, 19, -3, 3, 19, -3, STONE);
for (const x of [-3, -1, 1, 3]) block(x, 19, -3, SNOW);

// exhaust stacks
cube(-3, 13, 4, -3, 20, 4, COBBLE); block(-3, 21, 4, SNOW);
cube(3, 13, 4, 3, 20, 4, COBBLE);  block(3, 21, 4, SNOW);

// spare tire in the bed
cylinder(0, 13, 6, 2, 1, STONE);
block(0, 13, 6, SNOW);

// ---------- dirt kicked up behind the rear wheels ----------
const spray = [
  [8, 2, 14, DIRT], [9, 4, 15, DIRT], [7, 5, 15, GRASS], [8, 7, 16, DIRT],
  [6, 3, 17, DIRT], [9, 8, 17, DIRT], [5, 2, 14, GRASS],
  [-8, 2, 14, DIRT], [-7, 4, 15, GRASS], [-9, 5, 15, DIRT], [-8, 7, 16, DIRT],
  [-6, 3, 17, DIRT], [-9, 8, 17, DIRT], [-5, 2, 14, GRASS]
];
for (const [x, y, z, id] of spray) block(x, y, z, id);

// ---------- checkered flags framing the arena front ----------
for (const px of [-12, 12]) {
  cube(px, -1, -14, px, 8, -14, OAK_LOG);
  block(px, 9, -14, SNOW);
}
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 3; j++) {
    const id = (i + j) % 2 === 0 ? SNOW : STONE;
    block(-11 + i, 5 + j, -14, id);   // left flag
    block(8 + i, 5 + j, -14, id);     // right flag
  }
}
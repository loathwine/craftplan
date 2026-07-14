// tank-4x-fable — prompt:
// a battle tank...

const T = { L: -8, Lc: -5, R: 5, Rc: 8 }; // track outer/inner x

// ---- site prep: clear tank footprint + barrel path, scene zones ----
cube(-9, 0, -20, 9, 12, 12, AIR);
cube(-18, 0, -15, -8, 9, -10, AIR);   // ruined wall zone
cube(-15, 0, -6, -9, 6, 2, AIR);      // sandbag zone
cube(9, 0, -10, 17, 8, -2, AIR);      // crater zone
cube(13, 0, 1, 19, 11, 7, AIR);       // wreck zone
block(1, -1, -7, AIR); block(4, -1, -3, AIR); // tree stumps under hull

// ---- foundations: dirt berms so tracks sit on ground everywhere ----
cube(-8, -2, -10, -5, -1, 10, DIRT);
cube(5, -2, -10, 8, -1, 10, DIRT);

// ---- tracks (dark cobble) ----
cube(-8, 0, -10, -5, 3, 10, COBBLE);
cube(5, 0, -10, 8, 3, 10, COBBLE);
// tread stripes on front faces
for (let x = -8; x <= -5; x += 2) cube(x, 0, -10, x, 3, -10, STONE);
for (let x = 5; x <= 8; x += 2) cube(x, 0, -10, x, 3, -10, STONE);
// road wheels on outer faces
for (const z of [-8, -5, -2, 1, 4, 7]) {
  for (const x of [-8, 8]) {
    block(x, 0, z, STONE); block(x, 2, z, STONE);
    block(x, 1, z - 1, STONE); block(x, 1, z + 1, STONE);
    block(x, 1, z, OAK_LOG); // hub
  }
}

// ---- fenders ----
cube(-8, 4, -11, -5, 4, 10, STONE);
cube(5, 4, -11, 8, 4, 10, STONE);
block(-6, 5, -11, SNOW); block(6, 5, -11, SNOW); // headlights
// fender stowage boxes
cube(-7, 5, 2, -5, 6, 5, COBBLE);
cube(5, 5, 2, 7, 6, 5, COBBLE);

// ---- hull ----
cube(-4, 2, -9, 4, 6, 10, STONE);
// sloped glacis nose (front, toward camera)
cube(-4, 2, -10, 4, 5, -10, STONE);
cube(-4, 2, -11, 4, 4, -11, STONE);
cube(-4, 2, -12, 4, 3, -12, STONE);
// driver viewports + bow MG
block(-2, 5, -10, GLASS); block(-1, 5, -10, GLASS);
block(2, 5, -10, COBBLE); block(2, 5, -11, STONE);
// spare track links on the nose
cube(-2, 4, -12, 0, 4, -12, COBBLE);
// engine deck vents
for (const z of [5, 7, 9]) cube(-3, 6, z, 3, 6, z, COBBLE);
// exhaust stacks
cube(-4, 7, 8, -4, 8, 9, COBBLE);
cube(4, 7, 8, 4, 8, 9, COBBLE);
// rear: unditching log + fuel drums
cube(-4, 3, 11, 4, 3, 11, OAK_LOG);
cube(-3, 4, 11, -2, 5, 11, OAK_LOG);
cube(1, 4, 11, 2, 5, 11, OAK_LOG);

// ---- turret ----
cylinder(0, 7, 1, 3, 3, STONE);          // y7..9
disk(0, 10, 1, 2, STONE);                // roof
cube(-2, 7, 5, 2, 8, 6, STONE);          // bustle
block(-1, 9, 5, OAK_LOG); block(0, 9, 5, OAK_LOG); block(1, 9, 6, OAK_LOG); // stowage
line(-2, 9, 6, -2, 13, 6, OAK_LOG);      // antenna
// commander cupola + top MG
cube(1, 10, 2, 2, 11, 3, COBBLE);
block(1, 12, 2, STONE); block(1, 12, 1, STONE); block(1, 12, 0, STONE);
block(1, 12, 3, OAK_LOG);
// loader hatch
block(-1, 10, 0, COBBLE); block(-1, 10, 1, COBBLE);
// insignia
block(3, 8, 1, BRICK); block(-3, 8, 1, BRICK);

// ---- main gun (points north / -Z at the camera) ----
cube(-1, 7, -3, 1, 9, -3, COBBLE);       // mantlet
line(0, 8, -4, 0, 8, -16, STONE);        // barrel
block(0, 9, -9, STONE); block(0, 9, -10, STONE); // bore evacuator
// muzzle brake
block(-1, 8, -16, COBBLE); block(1, 8, -16, COBBLE);
block(0, 7, -16, COBBLE); block(0, 9, -16, COBBLE);
block(0, 8, -17, STONE);
// muzzle flash + smoke
block(0, 8, -18, BRICK); block(0, 8, -19, BRICK);
block(1, 9, -19, BRICK); block(-1, 7, -19, BRICK);
block(2, 10, -19, SNOW); block(-2, 9, -20, SNOW);

// ---- camouflage patches ----
block(3, 4, -10, LEAVES); block(-3, 3, -11, OAK_LOG); block(1, 2, -10, LEAVES);
block(-3, 6, -4, LEAVES); block(2, 6, -6, OAK_LOG); block(0, 6, -8, LEAVES);
block(3, 6, 2, OAK_LOG);
block(2, 8, 3, LEAVES); block(-2, 7, -1, OAK_LOG); block(-2, 9, 3, LEAVES);

// ---- mud ruts trailing behind the tracks ----
cube(-8, -1, 11, -5, 0, 18, DIRT);
cube(5, -1, 11, 8, 0, 18, DIRT);

// ---- battle scene: shell crater (east, front) ----
disk(13, 0, -6, 4, DIRT);
disk(13, -1, -6, 4, DIRT);
sphere(13, -2, -6, 3, AIR);
block(10, 1, -6, COBBLE); block(16, 1, -6, COBBLE);
block(13, 1, -9, COBBLE); block(13, 1, -3, COBBLE); block(11, 1, -4, DIRT);
block(13, -3, -6, BRICK); block(12, -3, -6, BRICK); block(13, -3, -5, BRICK);
block(13, -2, -6, BRICK); block(12, -2, -5, BRICK);
block(13, 1, -6, SNOW); block(14, 3, -6, SNOW); block(13, 5, -7, SNOW);

// ---- ruined brick wall (west, shell-holed) ----
cube(-16, -1, -12, -9, 4, -12, BRICK);
cube(-13, 3, -12, -11, 4, -12, AIR);
cube(-10, 2, -12, -9, 4, -12, AIR);
cube(-15, 1, -12, -14, 2, -12, AIR);   // shell hole
block(-12, 2, -12, AIR); block(-16, 4, -12, AIR);
block(-15, 3, -12, COBBLE); block(-13, 1, -12, COBBLE); block(-16, 2, -12, COBBLE);
block(-14, 0, -13, BRICK); block(-13, 0, -13, BRICK); block(-10, 0, -13, BRICK);
block(-15, 0, -14, BRICK); block(-11, 0, -13, COBBLE);

// ---- sandbag emplacement (west flank) ----
cube(-13, 0, -5, -10, 0, -4, DIRT);
cube(-13, 0, -4, -12, 0, 1, DIRT);
cube(-13, 1, -5, -10, 2, -4, SAND);
cube(-13, 1, -4, -12, 2, 1, SAND);
block(-12, 3, -4, SAND); block(-13, 3, -2, SAND); block(-11, 3, -5, SAND);

// ---- smoldering wreck (east, background) ----
cube(14, 0, 2, 18, 2, 6, COBBLE);
sphere(16, 3, 4, 2, STONE);
cube(15, 1, 2, 16, 2, 2, AIR);          // blown-open front
block(15, 4, 4, BRICK); block(16, 4, 3, BRICK); block(17, 4, 5, BRICK);
block(16, 5, 4, SNOW); block(15, 7, 4, SNOW); block(16, 9, 5, SNOW); block(17, 11, 5, SNOW);
line(14, 3, 2, 11, 1, -1, STONE);       // wrecked gun drooping off
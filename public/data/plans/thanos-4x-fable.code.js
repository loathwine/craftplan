// thanos-4x-fable — prompt:
// Thanos...

// Thanos — armored titan with raised Infinity Gauntlet and double-bladed sword
// Purple skin = BRICK/GLASS checker dither; gold armor = SAND

function skinAt(x, y, z) {
  return (((x + y + z) % 2) + 2) % 2 === 0 ? BRICK : GLASS;
}
function skinBox(x1, y1, z1, x2, y2, z2) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++)
        block(x, y, z, skinAt(x, y, z));
}

// --- clear trees around the figure and sword sweep (AIR is free) ---
cube(-13, 1, -8, 13, 14, 8, AIR);
cube(-13, 8, -19, -8, 17, 19, AIR);

// --- battlefield platform ---
disk(0, 0, 0, 9, COBBLE);
disk(0, 1, 0, 5, COBBLE);
cube(-3, 0, -6, 0, 0, -3, STONE);
cube(2, 0, 3, 5, 0, 6, STONE);
cube(-6, 0, 2, -4, 0, 4, STONE);

// --- boots ---
cube(-6, 1, -3, -2, 3, 2, STONE);
cube(-5, 1, -4, -3, 2, -4, STONE);
line(-5, 3, -3, -3, 3, -3, SAND);
cube(2, 1, -3, 6, 3, 2, STONE);
cube(3, 1, -4, 5, 2, -4, STONE);
line(3, 3, -3, 5, 3, -3, SAND);

// --- legs ---
cube(-5, 4, -2, -2, 7, 1, STONE);
cube(2, 4, -2, 5, 7, 1, STONE);
cube(-5, 7, -3, -3, 8, -3, SAND);   // knee guards
cube(3, 7, -3, 5, 8, -3, SAND);
cube(-6, 8, -2, -2, 11, 2, STONE);  // thighs
cube(2, 8, -2, 6, 11, 2, STONE);
cube(-5, 9, -3, -3, 11, -3, COBBLE); // thigh plates
cube(3, 9, -3, 5, 11, -3, COBBLE);

// --- pelvis + belt ---
cube(-6, 12, -2, 6, 13, 2, STONE);
cube(-1, 12, -3, 1, 13, -3, COBBLE);
cube(-6, 14, -2, 6, 14, 2, SAND);
block(0, 14, -3, GLASS); // buckle gem

// --- torso (gold armor) ---
cube(-6, 15, -2, 6, 18, 2, SAND);
cube(-4, 15, -3, -1, 17, -3, SAND);  // ab plates
cube(1, 15, -3, 4, 17, -3, SAND);
cube(-5, 18, -3, 5, 18, -3, OAK_LOG); // rib trim
cube(-7, 19, -3, 7, 23, 2, SAND);     // chest
cube(-6, 20, -4, -1, 22, -4, SAND);   // pec plates
cube(1, 20, -4, 6, 22, -4, SAND);
line(-4, 23, -4, 4, 23, -4, OAK_LOG); // collar trim
cube(-1, 16, 3, 1, 22, 3, OAK_LOG);   // spine ridge
cube(-6, 19, 3, -2, 21, 3, SAND);     // shoulder-blade plates
cube(2, 19, 3, 6, 21, 3, SAND);

// --- pauldrons ---
cube(-11, 22, -3, -7, 24, 3, SAND);
cube(-10, 25, -2, -8, 25, 2, SAND);
cube(-11, 23, -3, -11, 23, 3, GLASS); // blue stripe
cube(-9, 26, 0, -9, 27, 0, STONE);    // spike
cube(7, 22, -3, 11, 24, 3, SAND);
cube(8, 25, -2, 10, 25, 2, SAND);
cube(11, 23, -3, 11, 23, 3, GLASS);

// --- neck + head (purple) ---
skinBox(-2, 24, -1, 2, 25, 1);
skinBox(-3, 26, -2, 3, 31, 2);       // skull
skinBox(-3, 26, -3, 3, 28, -3);      // heavy jaw
for (const gx of [-2, 0, 2]) {       // chin ridges (raised, AO shadows)
  block(gx, 26, -4, skinAt(gx, 26, -4));
  block(gx, 27, -4, skinAt(gx, 27, -4));
}
line(-1, 28, -3, 1, 28, -3, STONE);  // mouth
block(-2, 30, -2, SNOW);             // eyes
block(2, 30, -2, SNOW);
line(-3, 31, -2, -1, 31, -2, STONE); // brows
line(1, 31, -2, 3, 31, -2, STONE);
skinBox(-2, 32, -2, 2, 32, 1);       // crown
skinBox(-4, 28, 0, -4, 29, 0);       // ears
skinBox(4, 28, 0, 4, 29, 0);

// --- left arm raised with Infinity Gauntlet ---
skinBox(8, 25, -1, 10, 28, 1);       // bare upper arm
cube(7, 29, -2, 11, 29, 2, SAND);    // gauntlet cuff flare
cube(8, 30, -1, 10, 31, 1, SAND);    // gauntlet forearm
cube(8, 32, -2, 10, 33, 0, SAND);    // clenched fist
block(8, 32, -2, BRICK);             // six infinity stones
block(9, 32, -2, GLASS);
block(10, 32, -2, LEAVES);
block(8, 33, -2, ICE);
block(9, 33, -2, SNOW);
block(10, 33, -2, SAND);

// --- right arm gripping sword ---
skinBox(-11, 19, -1, -9, 21, 1);
skinBox(-11, 15, -1, -9, 18, 1);
skinBox(-12, 12, -2, -9, 14, 1);     // fist

// --- double-bladed sword (horizontal, blades fore and aft) ---
cube(-11, 13, -7, -10, 13, 7, OAK_LOG);      // grip
cube(-11, 12, -8, -10, 14, -8, STONE);       // guards
cube(-11, 12, 8, -10, 14, 8, STONE);
for (let i = 0; i < 10; i++) {
  const half = Math.max(0, 4 - Math.floor(i / 2));
  for (const s of [-1, 1]) {
    const z = s * (9 + i);
    cube(-11, 13 - half, z, -10, 13 + half, z, STONE);
    block(-11, 13 - half, z, SNOW);
    block(-10, 13 - half, z, SNOW);
    block(-11, 13 + half, z, SNOW);
    block(-10, 13 + half, z, SNOW);
  }
}

// --- battlefield debris + embers ---
cube(-14, 0, 3, -12, 1, 5, COBBLE);
block(-13, 2, 4, STONE);
cube(10, 0, -6, 12, 1, -4, COBBLE);
block(11, 2, -5, STONE);
block(7, 1, 4, BRICK);
block(8, 1, 3, BRICK);
block(7, 2, 3, BRICK);
block(-7, 1, -5, BRICK);
block(-8, 1, -4, BRICK);
block(5, 1, -7, COBBLE);
block(6, 1, -6, STONE);
block(-9, 1, 6, STONE);
// ornithopter-haiku55 — prompt:
// Da Vinci's flying machine...

// Da Vinci's flying machine: bat-wing ornithopter with an aerial screw, slung from a timber gantry.
// Nose points north (-Z), wings span X, body runs along Z.

// ---- Clear the launch site (trees, stray terrain) ----
cube(-16, 0, -9, 16, 30, 8, AIR);

// ---- Launch deck: checker of cobble and stone ----
for (let x = -13; x <= 13; x++)
  for (let z = -6; z <= 6; z++)
    block(x, 0, z, (x + z) & 1 ? STONE : COBBLE);

// ---- Grassy hill backdrop, south of the gantry ----
hollowSphere(0, -2, 12, 6, GRASS);

// ---- Gantry: two timber towers, cross-beams, bracing, lamps ----
for (const x0 of [-12, 11]) {
  cube(x0 - 1, 1, 3, x0 + 2, 1, 6, STONE);   // stone plinth
  cube(x0, 2, 4, x0 + 1, 24, 5, OAK_LOG);    // main post
}
for (const y of [8, 16]) cube(-12, y, 4, 12, y, 5, PLANKS);
cube(-12, 24, 4, 12, 24, 5, PLANKS);
line(-11, 2, 4, 11, 23, 4, OAK_LOG);           // X-truss behind the machine
line(11, 2, 4, -11, 23, 4, OAK_LOG);
block(-12, 25, 4, GLOWSTONE);
block(12, 25, 4, GLOWSTONE);
block(-6, 25, 4, IRON);                        // hoist pulleys
block(6, 25, 4, IRON);

// ---- Workshop shed, left foreground ----
cube(-12, 1, -6, -7, 3, -2, PLANKS);           // walls
cube(-11, 1, -5, -8, 3, -3, AIR);              // interior
cube(-13, 4, -7, -6, 4, -1, BRICK);            // roof
cube(-12, 5, -6, -7, 5, -2, BRICK);            // roof ridge
block(-9, 1, -2, AIR);                         // door
block(-9, 2, -2, AIR);
block(-7, 2, -4, GLASS);                       // windows
block(-12, 2, -4, GLASS);
cube(-8, 4, -5, -8, 7, -5, COBBLE);            // chimney
block(-10, 1, -4, OAK_LOG);                    // workbench

// ---- Hull / gondola ----
cube(-2, 11, -4, 2, 11, 3, PLANKS);            // floor
cube(-2, 12, -4, -2, 13, 3, PLANKS);           // port wall
cube(2, 12, -4, 2, 13, 3, PLANKS);             // starboard wall
cube(-2, 12, 3, 2, 13, 3, PLANKS);             // stern wall
cube(-1, 10, -3, 1, 10, 2, OAK_LOG);           // keel
cube(-2, 12, -4, 2, 13, -4, OAK_LOG);          // prow frame
line(0, 11, -4, 0, 11, -9, OAK_LOG);           // bowsprit
block(0, 11, -9, GOLD);

// ---- Wings: striped canvas membrane, spars, ribs, tip caps ----
for (const s of [-1, 1]) {
  for (let ax = 2; ax <= 10; ax++) {
    const t = (ax - 2) / 8;
    const zL = Math.round(-1 - 3 * t);
    const yL = Math.round(16 + 3 * t);
    const zT = Math.round(3 + t);
    const yT = Math.round(13 - 2 * t);
    line(s * ax, yL, zL, s * ax, yT, zT, ax % 2 ? SAND : LIGHT_GRAY);
  }
}
for (const s of [-1, 1]) {
  line(s, 16, -1, s * 10, 19, -4, OAK_LOG);    // leading spar
  line(s, 16, 0, s * 10, 11, 4, OAK_LOG);      // trailing spar
  for (const ax of [3, 5, 7, 9]) {
    const t = (ax - 2) / 8;
    line(s, 16, 0, s * ax, Math.round(13 - 2 * t), Math.round(3 + t), OAK_LOG);
  }
  block(s * 10, 19, -4, GOLD);
  block(s * 10, 11, 4, GOLD);
}
line(-2, 16, -1, 2, 16, -1, OAK_LOG);          // shoulder spar

// ---- Pedal crank and connecting rods ----
line(-4, 14, -2, 4, 14, -2, IRON);
block(-4, 14, -2, GOLD);
block(4, 14, -2, GOLD);
line(-4, 14, -2, -2, 16, -1, IRON);
line(4, 14, -2, 2, 16, -1, IRON);

// ---- Tail: vertical fin and tailplane ----
cube(0, 13, 4, 0, 18, 6, PLANKS);
cube(-3, 13, 5, 3, 13, 6, PLANKS);

// ---- Aerial screw (helicopter rotor) on the mast ----
line(0, 14, 0, 0, 28, 0, OAK_LOG);
for (let y = 20; y <= 28; y++) {
  const a = (y - 20) * 0.55;
  for (const off of [0, Math.PI]) {
    for (let r = 1; r <= 5; r++) {
      const px = Math.round(r * Math.cos(a + off));
      const pz = Math.round(r * Math.sin(a + off));
      block(px, y, pz, r === 5 ? IRON : SAND);
    }
  }
}
block(0, 29, 0, GOLD);

// ---- Pilot seated in the gondola ----
block(0, 12, 0, BLUE);
block(0, 12, 1, BLUE);
block(0, 13, 1, RED);
block(0, 14, 1, SAND);
block(-1, 13, -1, SAND);
block(1, 13, -1, SAND);

// ---- Suspension ropes from the top beam ----
line(-10, 24, 4, -10, 19, -4, BROWN);
line(10, 24, 4, 10, 19, -4, BROWN);
line(-6, 24, 4, -2, 13, 2, BROWN);
line(6, 24, 4, 2, 13, 2, BROWN);

// ---- Observer figure (Leonardo-style robe) on the deck ----
block(4, 1, -3, BROWN);
block(4, 2, -3, BROWN);
block(4, 3, -3, RED);
block(3, 3, -3, RED);
block(5, 3, -3, RED);
block(4, 4, -3, SAND);
block(4, 5, -3, BROWN);

// ---- Hoist crane, right foreground ----
cube(8, 1, -4, 8, 10, -4, OAK_LOG);            // mast
line(8, 10, -4, 13, 10, -4, PLANKS);           // jib
line(8, 6, -4, 12, 10, -4, OAK_LOG);           // brace
line(13, 9, -4, 13, 4, -4, BROWN);             // hoist rope
block(13, 3, -4, IRON);                        // hook
cube(11, 1, -5, 13, 2, -3, OAK_LOG);           // crate on the deck
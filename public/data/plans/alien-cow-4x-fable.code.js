// alien-cow-4x-fable — prompt:
// a UFO abducting a cow...

// UFO ABDUCTING A COW — saucer overhead, ice tractor beam, cow mid-air,
// crater below, panicked cow fleeing, red barn + silo farm backdrop.

function ring(cx, cy, cz, r, id, skipNorth) {
  const seen = new Set();
  const steps = Math.max(24, Math.ceil(r * 14));
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const x = Math.round(cx + r * Math.cos(a));
    const z = Math.round(cz + r * Math.sin(a));
    if (skipNorth && (z - cz) < -0.35 * r) continue; // window toward camera
    const k = x + ',' + z;
    if (!seen.has(k)) { seen.add(k); block(x, cy, z, id); }
  }
}

// ---- clear trees/logs around the beam site (targeted) ----
cube(-8, 0, -8, 8, 8, 8, AIR);

// ---- scorched crater under the beam ----
disk(0, -1, 0, 5, AIR);
disk(0, -2, 0, 4, AIR);
disk(0, -3, 0, 3, AIR);
disk(0, -4, 0, 2, AIR);
disk(0, -5, 0, 2, COBBLE);
ring(0, -4, 0, 2.8, COBBLE);
ring(0, -3, 0, 3.8, COBBLE);
ring(0, -2, 0, 4.8, COBBLE);
ring(0, -1, 0, 6, COBBLE);      // raised ejecta rim
// scattered scorch rocks
block(7, -1, 3, STONE); block(-7, -1, -2, STONE); block(5, -1, -7, COBBLE);
block(-4, -1, 6, COBBLE); block(3, -1, 7, STONE); block(-6, -1, 3, COBBLE);
block(6, -1, -4, STONE); block(-3, -1, -7, COBBLE);

// ---- tractor beam: cone of ice, open toward the camera so the cow shows ----
for (let y = 0; y <= 20; y++) {
  const r = 2.2 + (20 - y) * 0.22;
  const id = (y % 3 === 0) ? GLASS : ICE;
  ring(0, y, 0, r, id, y >= 5 && y <= 16);
}

// debris sucked up inside the beam
block(1, 4, 1, DIRT); block(-1, 3, 0, DIRT); block(0, 5, -1, DIRT);
block(2, 6, 1, GRASS); block(-2, 5, 0, OAK_LOG); block(-2, 6, 0, OAK_LOG);
block(2, 8, -1, PLANKS);

// ---- THE COW (mid-air, facing north toward camera) ----
cube(-1, 9, -2, 1, 11, 2, SNOW);                 // body
cube(-1, 10, 0, 0, 11, 1, OAK_LOG);              // brown patches
cube(1, 9, -1, 1, 10, 0, OAK_LOG);
block(0, 9, 2, OAK_LOG); block(-1, 11, 2, OAK_LOG); block(1, 11, -2, OAK_LOG);
block(0, 8, 0, BRICK); block(0, 8, 1, BRICK);    // udder
// dangling legs (hooves brown), one kicking out
cube(-1, 8, -2, -1, 8, -2, SNOW); block(-1, 7, -2, OAK_LOG);
cube(1, 8, -2, 1, 8, -2, SNOW);  block(1, 7, -2, OAK_LOG);
cube(-1, 8, 2, -1, 8, 2, SNOW);  block(-1, 7, 2, OAK_LOG);
block(1, 8, 2, SNOW); block(2, 7, 2, OAK_LOG);   // splayed panic leg
// head
cube(-1, 10, -4, 1, 12, -3, SNOW);
cube(-1, 10, -4, 1, 10, -4, BRICK);              // pink muzzle
block(-1, 12, -4, COBBLE); block(1, 12, -4, COBBLE); // eyes
block(-2, 12, -3, OAK_LOG); block(2, 12, -3, OAK_LOG); // ears
block(-2, 13, -3, SNOW); block(2, 13, -3, SNOW); // horns
// tail yanked upward by the beam
block(0, 12, 3, OAK_LOG); block(0, 13, 3, OAK_LOG);
// sparkles swirling in the beam
block(2, 13, 1, GLASS); block(-2, 15, -1, GLASS); block(1, 17, 0, GLASS);
block(-2, 6, 1, ICE); block(2, 14, -2, ICE); block(-3, 4, 2, ICE);

// ---- THE SAUCER ----
disk(0, 20, 0, 2, ICE);                          // glowing emitter
disk(0, 21, 0, 4, STONE);                        // underbelly
disk(0, 22, 0, 7, COBBLE);
disk(0, 23, 0, 9, STONE);
disk(0, 24, 0, 10, STONE);                       // widest rim
disk(0, 25, 0, 9, COBBLE);
disk(0, 26, 0, 6, STONE);
// running lights on the rim
for (let i = 0; i < 36; i++) {
  const a = (i / 36) * Math.PI * 2;
  block(Math.round(10 * Math.cos(a)), 24, Math.round(10 * Math.sin(a)), i % 2 ? BRICK : ICE);
}
// porthole band + underside lights
for (let i = 0; i < 24; i++) {
  const a = (i / 24) * Math.PI * 2;
  block(Math.round(9 * Math.cos(a)), 23, Math.round(9 * Math.sin(a)), i % 2 ? GLASS : STONE);
  block(Math.round(7 * Math.cos(a)), 22, Math.round(7 * Math.sin(a)), i % 2 ? BRICK : COBBLE);
}
// glass cockpit dome
ring(0, 26, 0, 4.4, GLASS);
ring(0, 27, 0, 3.9, GLASS);
ring(0, 28, 0, 3.3, GLASS);
ring(0, 29, 0, 2.3, GLASS);
disk(0, 30, 0, 1, GLASS);
// little green pilot inside
block(0, 27, 0, LEAVES); block(0, 28, 0, LEAVES);
block(-1, 28, 0, LEAVES); block(1, 28, 0, LEAVES);
block(0, 29, 0, LEAVES);
// antenna beacon
block(0, 31, 0, COBBLE); block(0, 32, 0, BRICK);

// ---- FARM BACKDROP: red barn (west), silo, hay ----
cube(-21, 0, 2, -10, 10, 12, AIR);               // clear canopy over barn site
cube(-19, -1, 4, -12, 4, 4, BRICK);              // north wall (faces camera)
cube(-19, -1, 10, -12, 4, 10, BRICK);            // south wall
cube(-19, -1, 5, -19, 4, 9, BRICK);              // west wall
cube(-12, -1, 5, -12, 4, 9, BRICK);              // east wall
// white corner trim
cube(-19, -1, 4, -19, 4, 4, SNOW); cube(-12, -1, 4, -12, 4, 4, SNOW);
cube(-19, -1, 10, -19, 4, 10, SNOW); cube(-12, -1, 10, -12, 4, 10, SNOW);
// big door with white X, oak frame
cube(-18, -1, 4, -18, 3, 4, OAK_LOG);
cube(-13, -1, 4, -13, 3, 4, OAK_LOG);
cube(-18, 3, 4, -13, 3, 4, OAK_LOG);
cube(-17, -1, 4, -14, 2, 4, PLANKS);
block(-17, -1, 4, SNOW); block(-16, 0, 4, SNOW); block(-15, 1, 4, SNOW); block(-14, 2, 4, SNOW);
block(-14, -1, 4, SNOW); block(-15, 0, 4, SNOW); block(-16, 1, 4, SNOW); block(-17, 2, 4, SNOW);
// gables
cube(-19, 5, 5, -19, 5, 9, BRICK); cube(-19, 6, 6, -19, 6, 8, BRICK); block(-19, 7, 7, BRICK);
cube(-12, 5, 5, -12, 5, 9, BRICK); cube(-12, 6, 6, -12, 6, 8, BRICK); block(-12, 7, 7, BRICK);
block(-12, 5, 7, GLASS); block(-19, 5, 7, GLASS); // gable windows
// stepped plank roof with overhang
cube(-20, 5, 3, -11, 5, 4, PLANKS);  cube(-20, 5, 10, -11, 5, 11, PLANKS);
cube(-20, 6, 5, -11, 6, 5, PLANKS);  cube(-20, 6, 9, -11, 6, 9, PLANKS);
cube(-20, 7, 6, -11, 7, 6, PLANKS);  cube(-20, 7, 8, -11, 7, 8, PLANKS);
cube(-20, 8, 7, -11, 8, 7, PLANKS);  // ridge
// silo beside the barn
cylinder(-9, 0, 13, 3, 8, AIR);
hollowCylinder(-9, -1, 13, 2, 8, COBBLE);
disk(-9, 7, 13, 2, BRICK); block(-9, 8, 13, BRICK);
// hay bales
cube(-11, -1, 4, -10, 0, 5, SAND);
cube(-15, -1, 1, -14, 0, 2, SAND);

// ---- broken fence (beam ripped the middle out) ----
cube(-9, 1, 6, -3, 1, 6, PLANKS);
cube(3, 1, 6, 9, 1, 6, PLANKS);
for (const px of [-9, -6, -3, 3, 6, 9]) cube(px, -1, 6, px, 1, 6, OAK_LOG);
block(-1, 0, 7, PLANKS); block(1, 0, 8, PLANKS); block(2, 0, 6, OAK_LOG); // wreckage

// ---- second cow fleeing east, foreground-right ----
cube(10, 2, -9, 13, 3, -8, SNOW);                // body
cube(11, 2, -9, 12, 3, -9, OAK_LOG);             // patch on camera side
block(10, 3, -8, OAK_LOG); block(13, 2, -8, OAK_LOG);
cube(10, -1, -9, 10, 1, -9, SNOW); cube(10, -1, -8, 10, 1, -8, SNOW);
cube(13, -1, -9, 13, 1, -9, SNOW); cube(13, -1, -8, 13, 1, -8, SNOW);
cube(14, 3, -9, 15, 4, -8, SNOW);                // head thrown forward
block(15, 3, -9, BRICK); block(15, 3, -8, BRICK);   // muzzle
block(15, 4, -9, COBBLE); block(15, 4, -8, COBBLE); // wide eyes
block(14, 5, -9, OAK_LOG); block(14, 5, -8, OAK_LOG); // ears
block(9, 3, -8, OAK_LOG); block(9, 2, -8, OAK_LOG);   // tail streaming behind
block(8, 0, -8, SNOW); block(7, 0, -9, SNOW);         // kicked-up dust

// ---- tiny scout saucer in the eastern sky ----
disk(16, 27, 14, 3, STONE);
disk(16, 28, 14, 2, COBBLE);
block(16, 29, 14, GLASS);
disk(16, 26, 14, 1, ICE);
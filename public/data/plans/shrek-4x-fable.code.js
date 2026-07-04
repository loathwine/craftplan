// shrek-4x-fable — prompt:
// Shrek...

// SHREK — ogre standing in his swamp, with Donkey, mud pool, outhouse and warning sign
// Palette: LEAVES=ogre skin, PLANKS=tunic, OAK_LOG=vest/pants, DIRT=belt/mud, SNOW=eyes/onion

function ell(cx, cy, cz, rx, ry, rz, colorFn) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) block(x, y, z, colorFn(x, y, z));
      }
}
function limb(x1, y1, z1, x2, y2, z2, r, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    sphere(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t), Math.round(z1 + (z2 - z1) * t), r, id);
  }
}

// ---- clear vegetation over the scene (targeted boxes, trees top out ~y8) ----
cube(-16, 1, -8, 14, 9, 8, AIR);        // main figure + donkey footprint
cube(-18, 1, -18, -9, 12, -9, AIR);     // hut site
cube(-13, 1, 9, -6, 8, 14, AIR);        // sign site
cube(10, 1, 1, 20, 6, 11, AIR);         // mud pool site
// tree stumps at ground level
[[-6,-8],[-7,-5],[7,-2],[8,-1],[-6,-1],[0,1],[-6,1],[8,3],[-7,4],[-7,5],[-2,7],[-10,8],[-7,8],[-6,9],[12,11]]
  .forEach(p => block(p[0], 0, p[1], AIR));
[[1,-7],[4,-3]].forEach(p => { cube(p[0], 0, p[1], p[0], 1, p[1], AIR); block(p[0], -1, p[1], GRASS); });

// ---- swamp set dressing ----
// mud pool (east)
disk(15, -1, 6, 5, DIRT);
block(13, 0, 5, LEAVES); block(16, 0, 8, LEAVES); block(14, 0, 7, LEAVES); // lily pads
[[11,9],[18,10],[19,3]].forEach(p => {   // cattails on the rim
  cube(p[0], 0, p[1], p[0], 1, p[1], LEAVES);
  cube(p[0], 2, p[1], p[0], 3, p[1], OAK_LOG);
});
// campfire (south-east)
[[12,-6],[16,-6],[14,-8],[14,-4],[13,-7],[15,-7],[13,-5],[15,-5]].forEach(p => block(p[0], 1, p[1], STONE));
block(13, 1, -6, OAK_LOG); block(15, 1, -6, OAK_LOG); block(14, 1, -7, OAK_LOG); block(14, 1, -5, OAK_LOG);
block(14, 1, -6, BRICK); block(14, 2, -6, BRICK); block(13, 2, -6, BRICK);
// onion ("ogres have layers")
sphere(9, 1, -7, 2, SNOW);
block(9, 4, -7, LEAVES); block(9, 5, -7, LEAVES);
// outhouse hut (north, behind Shrek)
cube(-16, 0, -16, -11, 0, -12, PLANKS);                    // floor
cube(-16, 1, -16, -11, 6, -16, PLANKS);                    // back wall
cube(-16, 1, -12, -11, 6, -12, PLANKS);                    // front wall
cube(-16, 1, -16, -16, 6, -12, PLANKS);                    // west wall
cube(-11, 1, -16, -11, 6, -12, PLANKS);                    // east wall
[[-16,-16],[-11,-16],[-16,-12],[-11,-12]].forEach(p => cube(p[0], 1, p[1], p[0], 7, p[1], OAK_LOG)); // corner posts
cube(-14, 1, -12, -13, 3, -12, AIR);                       // door opening
block(-13, 5, -12, SNOW);                                  // crescent-moon mark
cube(-11, 3, -15, -11, 4, -14, AIR);                       // side window
cube(-17, 7, -17, -10, 7, -11, OAK_LOG);                   // roof, slanted
cube(-17, 8, -17, -10, 8, -14, OAK_LOG);
cube(-17, 9, -17, -10, 9, -16, OAK_LOG);
cube(-12, 8, -16, -12, 11, -16, COBBLE);                   // chimney
block(-12, 12, -16, SNOW);                                 // smoke puff
// warning sign (south-west)
cube(-9, -1, 12, -9, 3, 12, OAK_LOG);                      // post
cube(-12, 3, 12, -7, 6, 12, PLANKS);                       // board
block(-11, 5, 12, DIRT); block(-8, 5, 12, DIRT);           // scrawled eyes
cube(-11, 4, 12, -8, 4, 12, DIRT);                         // scrawled KEEP OUT stroke

// ---- Donkey (west, looking at Shrek) ----
cube(-15, 3, 6, -10, 5, 8, COBBLE);                        // body
[[-15,6],[-15,8],[-11,6],[-11,8]].forEach(p => cube(p[0], 0, p[1], p[0], 2, p[1], COBBLE)); // legs
cube(-11, 5, 7, -10, 6, 7, COBBLE);                        // neck
cube(-11, 6, 7, -10, 7, 7, DIRT);                          // mane
cube(-10, 7, 6, -8, 9, 8, COBBLE);                         // head
block(-9, 8, 6, SNOW); block(-9, 8, 8, SNOW);              // eyes
cube(-7, 7, 7, -7, 8, 7, SNOW);                            // muzzle
cube(-9, 10, 6, -9, 11, 6, COBBLE);                        // ear
cube(-9, 10, 8, -9, 11, 8, COBBLE);                        // ear
cube(-16, 3, 7, -16, 4, 7, COBBLE); block(-16, 2, 7, DIRT); // tail + tuft

// ---- SHREK (facing +Z) ----
// grass pads + shoes
cube(-6, -1, -2, -2, -1, 4, GRASS); cube(2, -1, -2, 6, -1, 4, GRASS);
cube(-6, 0, -2, -2, 1, 3, DIRT); cube(-6, 0, 4, -3, 0, 4, DIRT);   // left shoe + toe
cube(2, 0, -2, 6, 1, 3, DIRT); cube(3, 0, 4, 6, 0, 4, DIRT);       // right shoe + toe
// plaid pants legs
cube(-5, 2, -2, -2, 8, 1, OAK_LOG);
cube(2, 2, -2, 5, 8, 1, OAK_LOG);
cube(-5, 4, -2, -2, 4, 1, DIRT); cube(2, 4, -2, 5, 4, 1, DIRT);    // plaid bands
cube(-5, 7, -2, -2, 7, 1, DIRT); cube(2, 7, -2, 5, 7, 1, DIRT);
cube(-4, 2, -2, -4, 8, 1, DIRT); cube(4, 2, -2, 4, 8, 1, DIRT);    // plaid stripes
// barrel torso: pants -> belt -> tunic with brown vest, green v-neck
ell(0, 15, 0, 8, 6, 6, (x, y, z) => {
  if (y <= 10) return OAK_LOG;                    // pants top
  if (y === 11) return DIRT;                      // belt
  if (y >= 19 && Math.abs(x) <= 1 && z >= 3) return LEAVES;  // v-neck chest
  if (z <= -2 || Math.abs(x) >= 5) return OAK_LOG;           // vest back + sides
  return PLANKS;                                  // tunic front panel
});
sphere(0, 13, 3, 4, PLANKS);                      // big belly, shirt hem over belt
block(-2, 13, 6, DIRT); block(2, 14, 6, DIRT);    // mud spatter on shirt
// shoulders + arms (left hangs, right raised waving)
sphere(-7, 18, 0, 3, PLANKS); sphere(7, 18, 0, 3, PLANKS);
limb(-7, 18, 0, -10, 13, 1, 2, PLANKS);           // left sleeve
limb(-10, 12, 1, -11, 9, 2, 2, LEAVES);           // left forearm
sphere(-11, 7, 2, 2, LEAVES);                     // left fist
limb(7, 18, 0, 10, 16, 0, 2, PLANKS);             // right sleeve
limb(10, 16, 0, 12, 21, 1, 2, LEAVES);            // right forearm raised
sphere(12, 23, 1, 2, LEAVES);                     // right fist waving
// neck + head
cylinder(0, 20, 0, 3, 2, LEAVES);
ell(0, 26, 0, 5.5, 5, 5, () => LEAVES);
sphere(-3, 23, 3, 2, LEAVES);                     // jowl
sphere(3, 23, 3, 2, LEAVES);                      // jowl
sphere(0, 22, 3, 2, LEAVES);                      // chin
sphere(0, 24, 5, 2, LEAVES);                      // bulbous nose
block(-1, 23, 6, AIR); block(1, 23, 6, AIR);      // nostrils
// eyes + brows
cube(-3, 26, 4, -2, 27, 5, SNOW); cube(2, 26, 4, 3, 27, 5, SNOW);
block(-2, 26, 5, DIRT); block(2, 26, 5, DIRT);    // pupils
cube(-3, 28, 4, -1, 28, 5, LEAVES); cube(1, 28, 4, 3, 28, 5, LEAVES); // brow ridge
// wide grin carved in, with teeth
cube(-3, 22, 2, 3, 22, 6, AIR);
cube(-4, 23, 2, -4, 23, 6, AIR); cube(4, 23, 2, 4, 23, 6, AIR);      // smile corners
block(-2, 22, 4, SNOW); block(2, 22, 4, SNOW);    // teeth
// trumpet ears
cube(5, 28, -1, 7, 29, 0, LEAVES);
cube(8, 29, -1, 8, 30, 0, LEAVES);
cube(9, 29, -2, 9, 32, 1, LEAVES);
cube(9, 30, -1, 9, 31, 0, AIR);
cube(-7, 28, -1, -5, 29, 0, LEAVES);
cube(-8, 29, -1, -8, 30, 0, LEAVES);
cube(-9, 29, -2, -9, 32, 1, LEAVES);
cube(-9, 30, -1, -9, 31, 0, AIR);
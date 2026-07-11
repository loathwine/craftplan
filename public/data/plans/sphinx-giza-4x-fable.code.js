// sphinx-giza-4x-fable — prompt:
// the Great Sphinx of Giza...

// The Great Sphinx of Giza — facing NORTH (-Z) toward the camera,
// lion body stretching south, nemes headdress, Dream Stele between the
// paws, weathered flanks, and two pyramids rising in the background.

const S = SAND, P = PLANKS, C = COBBLE;

// ---- clear the forest from the build footprint (targeted, not whole site)
cube(-12, 0, -22, 12, 9, 20, AIR);      // sphinx + court
cube(-22, 0, 8, -13, 9, 22, AIR);       // west pyramid zone
cube(12, 0, 13, 20, 9, 22, AIR);        // east pyramid zone

// ---- excavated temple court in front (cobble with a sand processional way)
cube(-9, -1, -21, 9, -1, -6, C);
cube(-2, -1, -21, 2, -1, -6, S);

// ---- fill the terrain dip under the east flank so nothing floats
cube(5, -2, 6, 9, -1, 13, S);

// ---- front legs + paws (mirrored)
for (const s of [1, -1]) {
  const x1 = s > 0 ? 5 : -8, x2 = s > 0 ? 8 : -5;
  cube(x1, 0, -19, x2, 1, -9, S);       // long forepaw
  cube(x1, 0, -20, x2, 0, -20, S);      // toe tips
  cube(x1, 2, -18, x2, 2, -16, S);      // knuckle ridge
  cube(x1, 0, -9, x2, 3, -6, S);        // foreleg
  cube(x1, 4, -7, x2, 4, -6, S);        // elbow
  cube(s * 6, 0, -20, s * 6, 2, -16, AIR); // toe groove
}

// ---- chest (tall front wall the head sits on)
cube(-5, 0, -6, 5, 5, -2, S);
cube(-4, 6, -6, 4, 8, -2, S);
cube(-4, 6, -3, 4, 8, 1, S);            // shoulder hump under the nemes

// ---- body
cube(-5, 0, -1, 5, 5, 13, S);
cube(-4, 6, 1, 4, 6, 12, S);            // arched back
cube(-2, 7, 2, 2, 7, 10, S);            // spine ridge

// ---- rump
cube(-4, 0, 14, 4, 4, 16, S);
cube(-2, 5, 14, 2, 5, 15, S);

// ---- haunches (mirrored) with tucked hind paws
for (const s of [1, -1]) {
  const x1 = s > 0 ? 6 : -8, x2 = s > 0 ? 8 : -6;
  cube(x1, 0, 6, x2, 3, 15, S);
  cube(s > 0 ? 6 : -7, 4, 8, s > 0 ? 7 : -6, 4, 14, S);
  cube(s * 6, 5, 9, s * 6, 5, 13, S);
  cube(x1, 0, 3, x2, 1, 5, S);          // hind paw poking forward
}

// ---- tail draped over the east haunch, curling on the ground
line(1, 5, 16, 5, 4, 16, S);
line(6, 3, 15, 8, 1, 13, S);
line(8, 0, 12, 8, 0, 8, S);
block(8, 1, 7, S);
block(8, 1, 6, OAK_LOG);                // dark tail tuft

// ---- nemes headdress: striped trapezoid, wide flaps at the shoulders
cube(-5, 9, -5, 5, 9, 2, S);
cube(-5, 10, -5, 5, 10, 2, P);
cube(-4, 11, -5, 4, 11, 2, S);
cube(-4, 12, -5, 4, 12, 1, P);
cube(-3, 13, -5, 3, 13, 1, S);
cube(-3, 14, -4, 3, 14, 1, P);
cube(-2, 15, -4, 2, 15, 0, S);
cube(-1, 16, -4, 1, 16, -1, S);
block(4, 13, -2, S);                    // flap bulges (ears)
block(-4, 13, -2, S);

// ---- face plate on the north side
cube(-2, 10, -6, 2, 14, -6, S);
cube(-2, 14, -6, 2, 14, -6, P);         // brow band of the nemes
block(-1, 13, -6, C);                   // eyes
block(1, 13, -6, C);
block(0, 12, -5, S);                    // sand backing behind the nose
block(0, 12, -6, AIR);                  // the famously missing nose
cube(-1, 11, -6, 1, 11, -6, AIR);       // recessed mouth line
block(0, 9, -6, S);                     // beard stub remnant
block(0, 15, -5, C);                    // uraeus cobra on the brow

// ---- Dream Stele standing between the paws
cube(-1, 0, -14, 1, 3, -14, STONE);
block(0, 4, -14, STONE);

// ---- weathering: eroded patches and fallen rubble
block(-5, 2, 3, C); block(-5, 3, 3, DIRT); block(-5, 4, 7, C);
block(5, 2, 9, DIRT); block(5, 3, 1, C); block(-8, 2, 10, C);
block(8, 1, -12, C); block(-6, 1, -15, DIRT); block(3, 4, -6, C);
block(-4, 7, -5, DIRT);
block(-8, 0, -12, C); block(-3, 0, -19, C);
block(6, 0, -21, C); block(-7, 0, -8, C);

// ---- Khafre's pyramid rising behind (southwest), lighter casing at the cap
for (let i = 0; i <= 6; i++) {
  const r = 6 - i;
  cube(-16 - r, -1 + i, 15 - r, -16 + r, -1 + i, 15 + r, i >= 5 ? SNOW : S);
}

// ---- smaller queen's pyramid to the southeast for depth
for (let i = 0; i <= 4; i++) {
  const r = 4 - i;
  cube(16 - r, -1 + i, 18 - r, 16 + r, -1 + i, 18 + r, S);
}
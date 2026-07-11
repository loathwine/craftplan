// sphinx-giza-4x-opus — prompt:
// the Great Sphinx of Giza...

// The Great Sphinx of Giza — recumbent lion body, pharaoh's head in a nemes
// headdress, splayed front paws, the famous broken nose, a ceremonial beard,
// the Dream Stele between the paws, and two background pyramids at Giza.
// Front (face) points NORTH (-Z) toward the camera. Sandstone = SAND.

const S = SAND, ST = STONE, C = COBBLE, G = GLASS, A = AIR;

function pyramid(cx, baseY, cz, half, id){
  for (let i = 0; i <= half; i++){
    const r = half - i;
    cube(cx - r, baseY + i, cz - r, cx + r, baseY + i, cz + r, id);
  }
}

// ---- 1. clear vegetation over the whole scene (this is a forest) ----
cube(-16, 1, -19, 16, 15, 18, A);

// ---- 2. desert floor ----
cube(-8, 0, -16, 8, 0, 15, S);
cube(-6, -1, -2, 6, -1, 14, S);   // shallow foundation under the monument

// ---- 3. background pyramids (south / behind, framing the horizon) ----
pyramid(-13, 0, 14, 5, S);
pyramid(13, 0, 15, 4, S);
// weathered capstone shading + erosion seams
block(-13, 5, 14, C); block(13, 4, 15, C);
line(-13, 3, 12, -13, 3, 16, C);
line(13, 2, 13, 13, 2, 17, C);

// ================= THE SPHINX =================

// ---- 4. lion body (reclining), haunches rising at the rear ----
cube(-4, 1, -2, 4, 7, 12, S);         // main body mass
cube(-4, 6, 6, 4, 9, 12, S);          // raised rear haunches
// soften the top-rear corners
cube(-4, 9, 6, -4, 9, 7, A); cube(4, 9, 6, 4, 9, 7, A);
cube(-4, 8, 12, 4, 9, 12, A);
// tail curling up the right haunch
cube(4, 6, 9, 4, 8, 12, S);
line(4, 6, 9, 4, 6, 5, S);

// ---- 5. chest / breast: solid mass dropping to the ground between the legs ----
cube(-3, 1, -8, 3, 9, -1, S);

// ---- 6. front legs & paws, splayed forward ----
cube(-4, 0, -16, -2, 3, -1, S);       // left foreleg
cube(2, 0, -16, 4, 3, -1, S);         // right foreleg
// toe grooves
cube(-3, 3, -16, -3, 3, -12, A);
cube(3, 3, -16, 3, 3, -12, A);
// paw fronts nose over the sand
cube(-4, 0, -16, -2, 1, -16, S);
cube(2, 0, -16, 4, 1, -16, S);

// ---- 7. head ----
cube(-3, 9, -8, 3, 16, -1, S);
// round the crown corners
block(-3, 16, -8, A); block(3, 16, -8, A);

// ---- 8. NEMES headdress ----
cube(-4, 15, -9, 4, 18, 1, S);        // striped cap over the crown
cube(-4, 18, -9, -4, 18, -8, A); cube(4, 18, -9, 4, 18, -8, A);
cube(-5, 3, -9, -4, 15, -8, S);       // left lappet framing the face
cube(4, 3, -9, 5, 15, -8, S);         // right lappet
// blue nemes stripes (blue/gold banding)
for (let y = 4; y <= 14; y += 2){ block(-5, y, -9, G); block(4, y, -9, G); }
for (let x = -4; x <= 4; x += 2){ block(x, 16, -9, G); }
// forehead band + uraeus (rearing cobra)
line(-4, 15, -9, 4, 15, -9, ST);
block(0, 16, -9, ST); block(0, 17, -9, ST);

// ---- 9. face (front plane z=-8) ----
cube(-2, 13, -8, -1, 13, -8, ST);     // left eye
cube(1, 13, -8, 2, 13, -8, ST);       // right eye
line(-3, 14, -8, 3, 14, -8, C);       // brow ridge
cube(0, 11, -8, 0, 12, -8, A);        // the famous broken nose (missing)
block(0, 11, -9, C);                  // chipped nose stub
cube(-1, 10, -8, 1, 10, -8, A);       // mouth
// ceremonial pharaoh's beard hanging from the chin
cube(-1, 6, -8, 1, 9, -7, S);
block(-1, 6, -8, C); block(1, 6, -8, C);

// ---- 10. Dream Stele standing between the paws ----
cube(-1, 1, -14, 1, 5, -13, ST);
block(0, 4, -14, S); block(0, 3, -14, S);   // faint carved cartouche
block(-1, 5, -14, C); block(1, 5, -14, C);

// ---- 11. weathering / erosion patches across the ancient stone ----
const wear = [
  [3,4,4],[-3,3,8],[4,5,10],[-4,2,2],[2,2,-9],[-3,1,-11],
  [3,3,-6],[-2,5,11],[0,7,10],[-4,4,6],[3,6,8],[-3,8,9],
  [2,1,-14],[-2,0,-15],[3,0,-13],[1,5,-2],[-1,4,-4],[0,1,7]
];
for (const [x,y,z] of wear) block(x, y, z, C);
// crumbled edge on the left paw
block(-4, 3, -15, A); block(-2, 3, -16, A);
// sand drift banked against the right haunch
cube(4, 1, 8, 6, 1, 12, S);
cube(-6, 1, 3, -5, 1, 8, S);
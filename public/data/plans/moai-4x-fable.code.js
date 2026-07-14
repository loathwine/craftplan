// moai-4x-fable — prompt:
// the Moai statues of Easter Island...

// The Moai of Easter Island — an ahu platform with five standing moai
// facing north, a restored one with coral eyes and red pukao topknots,
// a fallen moai in the east foreground, and a half-buried head to the west.

// --- carve sightlines: remove tree canopies in front and clear the ahu site ---
cube(-22, 1, -18, 22, 12, 2, AIR);       // north viewing field (keep ground)
cube(-21, 0, 2, 21, 14, 11, AIR);        // platform footprint, full clear

// --- ceremonial gravel plaza in front of the ahu ---
disk(0, -1, -4, 8, SAND);
disk(0, 0, -4, 7, SAND);

// --- the ahu (stone platform) ---
cube(-20, 0, 3, 20, 0, 9, COBBLE);       // base course
cube(-20, 1, 3, 20, 1, 9, STONE);        // dressed top course
cube(-20, 0, 3, 20, 1, 3, COBBLE);       // front facing wall
cube(-19, 0, 10, 19, 0, 11, COBBLE);     // rubble apron behind
// central ramp of rounded stones
cube(-4, 0, -1, 4, 0, 2, COBBLE);
cube(-3, 1, 1, 3, 1, 2, COBBLE);

// --- moai builder: front face toward -Z, features protrude at cz-1 ---
function moai(cx, y0, cz, bodyH, headH, pukao, eyeBlock, lean) {
  const hx = cx + lean;                  // weathered statues lean a little
  // torso
  cube(cx - 2, y0, cz, cx + 2, y0 + bodyH - 1, cz + 3, STONE);
  // belly bulge
  cube(cx - 1, y0, cz - 1, cx + 1, y0 + Math.floor(bodyH / 2), cz - 1, STONE);
  // arms carved down the front corners
  cube(cx - 2, y0 + 1, cz, cx - 2, y0 + bodyH - 1, cz, COBBLE);
  cube(cx + 2, y0 + 1, cz, cx + 2, y0 + bodyH - 1, cz, COBBLE);
  // hands meeting on the belly
  block(cx - 1, y0 + 2, cz - 1, COBBLE);
  block(cx + 1, y0 + 2, cz - 1, COBBLE);

  const hy = y0 + bodyH;                 // head base
  const eyeY = hy + headH - 4;
  // head mass
  cube(hx - 2, hy, cz, hx + 2, hy + headH - 1, cz + 3, STONE);
  // heavy protruding chin
  cube(hx - 1, hy, cz - 1, hx + 1, hy, cz - 1, STONE);
  // thin mouth slit (recessed shadow)
  cube(hx - 1, hy + 1, cz, hx + 1, hy + 1, cz, AIR);
  // long nose
  cube(hx, hy + 2, cz - 1, hx, eyeY, cz - 1, STONE);
  block(hx, hy + 2, cz - 2, STONE);      // downturned nose tip
  // deep eye sockets under the brow
  block(hx - 1, eyeY, cz, eyeBlock);
  block(hx + 1, eyeY, cz, eyeBlock);
  // overhanging brow ridge
  cube(hx - 2, eyeY + 1, cz - 1, hx + 2, eyeY + 1, cz - 1, STONE);
  // elongated ears on the sides
  cube(hx - 2, hy + 1, cz + 2, hx - 2, eyeY, cz + 2, COBBLE);
  cube(hx + 2, hy + 1, cz + 2, hx + 2, eyeY, cz + 2, COBBLE);
  // red scoria pukao topknot
  if (pukao) {
    cube(hx - 1, hy + headH, cz, hx + 1, hy + headH + 1, cz + 2, BRICK);
    block(hx, hy + headH + 2, cz + 1, BRICK);
  }
}

// --- five moai on the ahu, tallest in the middle ---
moai(-16, 2, 4, 7, 7, false, AIR, 1);    // old weathered one, leaning east
moai(-8, 2, 4, 8, 8, true, AIR, 0);
moai(0, 2, 4, 9, 9, true, SNOW, 0);      // restored: white coral eyes
moai(8, 2, 4, 8, 7, false, AIR, 0);
moai(16, 2, 4, 7, 8, false, AIR, 0);

// pukao that toppled off the fourth moai, resting on the platform
cube(11, 2, 6, 12, 3, 7, BRICK);

// --- fallen moai, face-down in the east foreground ---
cube(12, -1, -4, 16, 0, -16, STONE);     // seat it into the ground
cube(12, 0, -4, 16, 2, -11, STONE);      // body
cube(13, 3, -5, 15, 3, -10, STONE);      // rounded back
cube(12, 1, -5, 12, 1, -10, COBBLE);     // arm along west side
cube(16, 1, -5, 16, 1, -10, COBBLE);     // arm along east side
cube(12, 0, -12, 16, 2, -16, STONE);     // head
cube(13, 3, -13, 15, 3, -15, STONE);     // back of skull
cube(12, 2, -11, 16, 2, -11, AIR);       // crack at the broken neck
// its pukao rolled away to the northeast
cube(19, 0, -15, 21, 1, -17, BRICK);
block(20, 2, -16, BRICK);

// --- half-buried head sinking into the west slope ---
cube(-15, -1, -9, -11, -1, -6, STONE);   // seated below grade
cube(-15, 0, -9, -11, 4, -6, STONE);     // head emerging from the earth
cube(-15, 5, -8, -11, 5, -6, STONE);     // crown tilted back, gazing up
cube(-13, 1, -10, -13, 3, -10, STONE);   // nose
block(-14, 3, -9, AIR);                  // eye sockets
block(-12, 3, -9, AIR);
cube(-15, 4, -10, -11, 4, -10, STONE);   // brow
cube(-15, 1, -6, -15, 3, -6, COBBLE);    // ear hints
cube(-11, 1, -6, -11, 3, -6, COBBLE);

// --- scattered basalt boulders and rubble around the plaza ---
sphere(9, 0, -8, 1, COBBLE);
sphere(-7, 0, -13, 1, COBBLE);
sphere(-4, -1, -9, 1, COBBLE);
block(6, 0, -12, COBBLE);
block(-9, 0, -5, COBBLE);
block(3, 0, -14, COBBLE);
cube(-18, 0, -3, -17, 1, -2, COBBLE);    // small cairn west
cube(18, 0, 0, 19, 1, 1, COBBLE);        // small cairn east
// spider-man-4x-fable — prompt:
// Spider-Man...

// Spider-Man — rooftop hero pose: swinging web up to the sky, shooting a net at street level
// Scene: brick building rooftop, Spidey (red BRICK / blue GLASS suit, SNOW eyes),
// web line to sky, radial spider web on a frame, background tower with billboard.

// ---- clear trees over build sites ----
cube(-11, 1, -9, 11, 10, 9, AIR);      // main building footprint
cube(11, 1, 9, 21, 9, 19, AIR);        // background tower footprint
cube(-21, 0, -14, -11, 13, -9, AIR);   // radial-web corner

// ================= BACKGROUND TOWER (x 12..20, z 10..18) =================
cube(12, -2, 10, 20, 12, 10, BRICK);
cube(12, -2, 18, 20, 12, 18, BRICK);
cube(12, -2, 11, 12, 12, 17, BRICK);
cube(20, -2, 11, 20, 12, 17, BRICK);
cube(12, 13, 10, 20, 13, 18, STONE);   // roof
cube(12, 14, 10, 20, 14, 10, COBBLE);  // parapet
cube(12, 14, 18, 20, 14, 18, COBBLE);
cube(12, 14, 11, 12, 14, 17, COBBLE);
cube(20, 14, 11, 20, 14, 17, COBBLE);
for (const wy of [0, 3]) for (const wx of [14, 17]) cube(wx, wy, 10, wx + 1, wy + 1, 10, GLASS);
for (const wy of [0, 3, 6, 9]) for (const wz of [12, 15]) cube(12, wy, wz, 12, wy + 1, wz + 1, GLASS);
// billboard facing the hero
cube(13, 7, 10, 19, 10, 10, SNOW);
cube(13, 7, 10, 19, 7, 10, PLANKS);
cube(13, 10, 10, 19, 10, 10, PLANKS);
cube(13, 8, 10, 13, 9, 10, PLANKS);
cube(19, 8, 10, 19, 9, 10, PLANKS);
block(16, 9, 10, BRICK); block(16, 8, 10, BRICK);
block(15, 9, 10, BRICK); block(17, 9, 10, BRICK);
block(15, 8, 10, BRICK); block(17, 8, 10, BRICK);
// antenna
cube(16, 14, 14, 16, 18, 14, OAK_LOG);
block(16, 19, 14, SNOW);

// ================= MAIN BUILDING (x -10..10, z -8..8) =================
// cobble base course
cube(-10, -3, -8, 10, -1, -8, COBBLE);
cube(-10, -3, 8, 10, -1, 8, COBBLE);
cube(-10, -3, -7, -10, -1, 7, COBBLE);
cube(10, -3, -7, 10, -1, 7, COBBLE);
// brick walls
cube(-10, 0, -8, 10, 4, -8, BRICK);
cube(-10, 0, 8, 10, 4, 8, BRICK);
cube(-10, 0, -7, -10, 4, 7, BRICK);
cube(10, 0, -7, 10, 4, 7, BRICK);
// cobble corner quoins
for (const [cx, cz] of [[-10, -8], [10, -8], [-10, 8], [10, 8]]) cube(cx, -3, cz, cx, 4, cz, COBBLE);
// roof + parapet
cube(-10, 5, -8, 10, 5, 8, STONE);
cube(-10, 6, -8, 10, 6, -8, COBBLE);
cube(-10, 6, 8, 10, 6, 8, COBBLE);
cube(-10, 6, -7, -10, 6, 7, COBBLE);
cube(10, 6, -7, 10, 6, 7, COBBLE);
// windows
for (const wx of [-8, -5, 3, 6]) { cube(wx, 1, -8, wx + 1, 3, -8, GLASS); cube(wx, 1, 8, wx + 1, 3, 8, GLASS); }
for (const wz of [-5, -1, 3]) { cube(-10, 1, wz, -10, 3, wz + 1, GLASS); cube(10, 1, wz, 10, 3, wz + 1, GLASS); }
// front door
cube(-1, 0, -8, 1, 3, -8, AIR);
cube(-2, 0, -8, -2, 3, -8, OAK_LOG);
cube(2, 0, -8, 2, 3, -8, OAK_LOG);
cube(-2, 4, -8, 2, 4, -8, OAK_LOG);

// rooftop props: water tank
for (const [lx, lz] of [[-8, 2], [-4, 2], [-8, 6], [-4, 6]]) cube(lx, 6, lz, lx, 7, lz, OAK_LOG);
cylinder(-6, 8, 4, 2, 4, PLANKS);
disk(-6, 12, 4, 2, COBBLE);
block(-6, 13, 4, COBBLE);
// AC unit
cube(6, 6, 3, 8, 7, 5, STONE);
block(7, 8, 4, COBBLE);
// stairwell hut
cube(6, 6, -7, 9, 9, -4, BRICK);
cube(5, 10, -8, 10, 10, -3, STONE);
cube(7, 6, -4, 8, 8, -4, PLANKS);

// ================= SPIDER-MAN (feet on roof at y6, ~27 tall) =================
// boots (red)
cube(-3, 6, -1, -1, 8, 1, BRICK);
cube(1, 6, -1, 3, 8, 1, BRICK);
cube(-3, 6, -2, -1, 6, -2, BRICK);  // toes face -Z
cube(1, 6, -2, 3, 6, -2, BRICK);
// legs + hips (blue)
cube(-3, 9, -1, -1, 15, 1, GLASS);
cube(1, 9, -1, 3, 15, 1, GLASS);
cube(-3, 16, -1, 3, 17, 1, GLASS);
// torso (red, tapering wider at chest)
cube(-3, 18, -2, 3, 20, 2, BRICK);
cube(-4, 21, -2, 4, 25, 2, BRICK);
// blue under-arm side panels
cube(-4, 21, -1, -4, 23, 1, GLASS);
cube(4, 21, -1, 4, 23, 1, GLASS);
// chest webbing + spider emblem (front, z=-2)
line(0, 18, -2, 0, 25, -2, COBBLE);
line(0, 25, -2, -4, 21, -2, COBBLE);
line(0, 25, -2, 4, 21, -2, COBBLE);
line(-3, 20, -2, 3, 20, -2, COBBLE);
block(-1, 23, -2, COBBLE); block(1, 23, -2, COBBLE);
block(-1, 22, -2, COBBLE); block(1, 22, -2, COBBLE);
// big back spider (z=2)
line(0, 19, 2, 0, 24, 2, COBBLE);
block(-1, 24, 2, COBBLE); block(1, 24, 2, COBBLE);
block(-2, 25, 2, COBBLE); block(2, 25, 2, COBBLE);
block(-1, 21, 2, COBBLE); block(1, 21, 2, COBBLE);
block(-2, 20, 2, COBBLE); block(2, 20, 2, COBBLE);
// shoulders
sphere(-5, 25, 0, 2, BRICK);
sphere(5, 25, 0, 2, BRICK);
// right arm raised, gripping web line
cube(6, 26, -1, 7, 27, 0, BRICK);
cube(7, 28, -1, 8, 29, 0, BRICK);
cube(8, 30, -1, 9, 31, 0, BRICK);
cube(8, 32, -1, 9, 32, 0, BRICK);   // fist
// left arm thrust down-forward, thwip pose
cube(-8, 22, -1, -7, 24, 0, BRICK);
cube(-9, 20, -2, -8, 21, -1, BRICK);
cube(-10, 18, -3, -9, 19, -2, BRICK);
block(-10, 18, -2, COBBLE);          // web shooter
// neck + head
cube(-1, 26, -1, 1, 26, 1, BRICK);
cube(-2, 27, -2, 2, 31, 2, BRICK);
cube(-1, 32, -1, 1, 32, 1, BRICK);
for (const dx of [-2, 2]) for (const dz of [-2, 2]) { block(dx, 27, dz, AIR); block(dx, 31, dz, AIR); }
// big white eyes (front face z=-2)
cube(1, 28, -2, 2, 29, -2, SNOW); block(2, 30, -2, SNOW);
cube(-2, 28, -2, -1, 29, -2, SNOW); block(-2, 30, -2, SNOW);
// mask webbing
line(0, 27, -2, 0, 31, -2, COBBLE);
line(0, 27, 2, 0, 31, 2, COBBLE);
line(2, 27, 0, 2, 30, 0, COBBLE);
line(-2, 27, 0, -2, 30, 0, COBBLE);

// ================= WEBS =================
// swing line from raised fist off to the sky
line(9, 32, 0, 14, 33, -3, SNOW);
line(14, 33, -3, 22, 33, -9, SNOW);
// web spray from left wrist toward the street-corner net
line(-10, 18, -3, -15, 10, -12, SNOW);
line(-10, 18, -3, -17, 7, -12, SNOW);
line(-10, 18, -3, -13, 7, -12, SNOW);
// radial spider web on a wooden frame (plane z=-12, center -16,8)
cube(-20, -1, -12, -20, 14, -12, OAK_LOG);
cube(-12, -1, -12, -12, 14, -12, OAK_LOG);
line(-20, 14, -12, -12, 14, -12, OAK_LOG);
for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4], [3, 3], [3, -3], [-3, 3], [-3, -3]]) {
  line(-16, 8, -12, -16 + dx, 8 + dy, -12, SNOW);
}
for (let i = 0; i < 12; i++) {
  const a = i * Math.PI / 6;
  block(Math.round(-16 + 2.4 * Math.cos(a)), Math.round(8 + 2.4 * Math.sin(a)), -12, SNOW);
}
for (let i = 0; i < 20; i++) {
  const a = i * Math.PI / 10;
  block(Math.round(-16 + 4.2 * Math.cos(a)), Math.round(8 + 4.2 * Math.sin(a)), -12, SNOW);
}
line(-16, 4, -12, -16, 0, -12, SNOW);    // bottom anchor strand
line(-16, 12, -12, -16, 14, -12, SNOW);  // top anchor strand

// ================= STREET PROPS =================
// lamppost
cube(-6, -1, -11, -6, 5, -11, OAK_LOG);
block(-5, 5, -11, OAK_LOG);
block(-5, 4, -11, SNOW);
// fire hydrant
block(5, 0, -10, BRICK);
block(5, 1, -10, BRICK);
block(5, 2, -10, SNOW);
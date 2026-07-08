// spongebob-4x-opus — prompt:
// SpongeBob SquarePants...

cube(-7, 9, -4, 7, 29, 1, SAND); // main yellow sponge body
// slightly rounded top corners
cube(-7, 28, -4, -6, 29, 1, AIR);
cube(6, 28, -4, 7, 29, 1, AIR);
block(-7, 27, -4, AIR); block(7, 27, -4, AIR);
block(-6, 29, -4, AIR); block(6, 29, -4, AIR);

// ---- sponge pores (subtle dimples on the yellow) ----
for (let x = -6; x <= 6; x++) {
  for (let y = 10; y <= 27; y++) {
    if (((x * 7 + y * 13 + 51) % 11) === 0) {
      block(x, y, -4, AIR);
      block(x, y, -3, SAND); // keep depth behind
    }
  }
}

// ---- brown shorts ----
cube(-7, 4, -4, 7, 8, 1, OAK_LOG);
// belt line
cube(-7, 8, -5, 7, 8, -5, STONE);
cube(-7, 8, -4, 7, 8, -4, STONE);
// side seams
line(-7, 4, -5, -7, 8, -5, PLANKS);
line(7, 4, -5, 7, 8, -5, PLANKS);

// ---- white shirt collar band + red tie ----
cube(-7, 8, -5, 7, 10, -5, SNOW);      // white band on front
cube(-7, 9, -4, 7, 10, 1, SNOW);       // wrap
// collar V points
line(0, 9, -6, -4, 12, -6, SNOW);
line(0, 9, -6, 4, 12, -6, SNOW);
line(-1, 9, -6, -4, 12, -6, SNOW);
line(1, 9, -6, 4, 12, -6, SNOW);
// red tie
cube(-1, 9, -6, 1, 10, -6, BRICK);     // knot
for (let y = 3; y <= 9; y++) {
  let w = Math.max(0, Math.floor((9 - y) / 2));
  cube(-w, y, -6, w, y, -6, BRICK);
}
block(0, 3, -6, BRICK);

// ================= FACE =================
function circleXY(cx, cy, z, r, id) {
  for (let x = -r; x <= r; x++)
    for (let y = -r; y <= r; y++)
      if (x * x + y * y <= r * r + 1) block(cx + x, cy + y, z, id);
}

const EY = 21;
function eye(cx) {
  // white bulge
  circleXY(cx, EY, -4, 4, SNOW);
  circleXY(cx, EY, -5, 4, SNOW);
  circleXY(cx, EY, -6, 3, SNOW);
  // outline (dark rim)
  for (let a = 0; a < 360; a += 20) {
    let rx = Math.round(cx + 4 * Math.cos(a * Math.PI / 180));
    let ry = Math.round(EY + 4 * Math.sin(a * Math.PI / 180));
    block(rx, ry, -5, STONE);
  }
  // blue iris
  circleXY(cx, EY - 1, -6, 2, GLASS);
  circleXY(cx, EY - 1, -7, 2, GLASS);
  // pupil
  circleXY(cx, EY - 1, -7, 1, STONE);
  block(cx, EY - 1, -8, STONE);
  // shine
  block(cx + 1, EY, -8, SNOW);
  block(cx + 1, EY, -7, SNOW);
  // eyelashes
  block(cx - 4, EY + 4, -5, STONE);
  block(cx - 4, EY + 5, -5, STONE);
  block(cx, EY + 5, -5, STONE);
  block(cx + 1, EY + 5, -6, STONE);
  block(cx + 4, EY + 4, -5, STONE);
  block(cx + 4, EY + 5, -5, STONE);
}
eye(-3);
eye(4);

// ---- long nose pointing out toward camera ----
for (let z = -4; z >= -9; z--) block(0, 16, z, SAND);
for (let z = -4; z >= -8; z--) block(0, 17, z, SAND);
sphere(0, 16, -10, 1, SAND);

// ---- big smile ----
for (let x = -6; x <= 6; x++) {
  let y = 12 + Math.floor((x * x) / 12);
  block(x, y, -5, BRICK);
  block(x, y + 1, -5, BRICK);
  if (Math.abs(x) >= 5) block(x, y + 2, -5, BRICK); // corners curl up
}
// mouth interior (darker) + lower lip
for (let x = -4; x <= 4; x++) {
  let ytop = 12 + Math.floor((x * x) / 12);
  for (let y = 9; y < ytop; y++) block(x, y, -5, STONE);
}
line(-4, 9, -5, 4, 9, -5, BRICK); // lower lip

// ---- two big buck teeth ----
cube(-2, 9, -6, -1, 12, -6, SNOW);
cube(-2, 9, -7, -1, 12, -7, SNOW);
cube(1, 9, -6, 2, 12, -6, SNOW);
cube(1, 9, -7, 2, 12, -7, SNOW);
block(0, 9, -6, STONE); // gap between teeth
block(0, 10, -6, STONE);

// ---- freckle cheeks ----
function freck(cx) {
  block(cx, 14, -5, STONE);
  block(cx - 1, 13, -5, STONE);
  block(cx + 1, 13, -5, STONE);
  block(cx, 12, -5, STONE);
}
freck(-6);
freck(6);

// ================= ARMS =================
// west arm raised, waving
cube(-9, 13, -3, -8, 14, 0, SAND);   // shoulder out
cube(-9, 14, -3, -8, 22, 0, SAND);   // up
sphere(-8, 23, -1, 2, SAND);         // hand
// fingers
line(-9, 24, -1, -9, 26, -1, SAND);
line(-8, 25, -1, -8, 27, -1, SAND);
line(-7, 24, -1, -7, 26, -1, SAND);

// east arm out and slightly down
cube(8, 12, -3, 12, 13, 0, SAND);
sphere(13, 12, -1, 2, SAND);
line(14, 12, -1, 15, 12, -1, SAND);
line(14, 13, -1, 15, 14, -1, SAND);
line(14, 11, -1, 15, 10, -1, SAND);

// ================= LEGS, SOCKS, SHOES =================
function leg(cx) {
  cube(cx, 1, -3, cx + 1, 4, -1, SAND);     // thin leg
  // sock (white with red stripe)
  cube(cx, 1, -4, cx + 1, 2, -1, SNOW);
  cube(cx, 2, -4, cx + 1, 2, -1, BRICK);
}
leg(-4);
leg(3);
// black shoes
cube(-6, 0, -5, -3, 0, 0, STONE);
cube(-6, -1, -5, -3, -1, 0, STONE);
cube(2, 0, -5, 5, 0, 0, STONE);
cube(2, -1, -5, 5, -1, 0, STONE);
// shoe fronts protrude
cube(-6, 0, -6, -3, 0, -6, STONE);
cube(2, 0, -6, 5, 0, -6, STONE);

// ---- side/back shading edges to define the block form ----
line(-7, 9, 1, -7, 27, 1, PLANKS);
line(7, 9, 1, 7, 27, 1, PLANKS);
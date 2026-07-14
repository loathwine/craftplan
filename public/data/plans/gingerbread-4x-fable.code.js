// gingerbread-4x-fable — prompt:
// a gingerbread house...

// Gingerbread house — front (door + gable) faces NORTH (-Z) toward the camera.

// ---------- site prep ----------
cube(-13, 1, -15, 13, 8, 12, AIR);            // clear trees/canopy over the yard only

// frosted sugar yard (two layers so it hugs the dips in the terrain)
cube(-13, -1, -15, 13, -1, 12, SNOW);
cube(-13, 0, -15, 13, 0, 12, SNOW);

// cookie path from the gate to the door
for (let z = -14; z <= 0; z++) {
  cube(-1, 0, z, 1, 0, z, PLANKS);
  if (z % 2 === 0) block(0, 0, z, BRICK);
}

// ---------- house body (gingerbread = oak brown) ----------
cube(-6, 1, 1, 6, 6, 1, OAK_LOG);             // front wall
cube(-6, 1, 11, 6, 6, 11, OAK_LOG);           // back wall
cube(-6, 1, 2, -6, 6, 10, OAK_LOG);           // west wall
cube(6, 1, 2, 6, 6, 10, OAK_LOG);             // east wall
cube(-5, 1, 2, 5, 1, 10, PLANKS);             // floor

// white icing: corner columns + band under the eaves
line(-6, 1, 1, -6, 6, 1, SNOW);  line(6, 1, 1, 6, 6, 1, SNOW);
line(-6, 1, 11, -6, 6, 11, SNOW); line(6, 1, 11, 6, 6, 11, SNOW);
cube(-6, 6, 1, 6, 6, 1, SNOW);   cube(-6, 6, 11, 6, 6, 11, SNOW);
cube(-6, 6, 2, -6, 6, 10, SNOW); cube(6, 6, 2, 6, 6, 10, SNOW);

// gables front + back, with iced rake edges
for (let i = 0; i <= 6; i++) {
  cube(-(6 - i), 7 + i, 1, 6 - i, 7 + i, 1, OAK_LOG);
  cube(-(6 - i), 7 + i, 11, 6 - i, 7 + i, 11, OAK_LOG);
  block(-(6 - i), 7 + i, 1, SNOW); block(6 - i, 7 + i, 1, SNOW);
  block(-(6 - i), 7 + i, 11, SNOW); block(6 - i, 7 + i, 11, SNOW);
}

// stepped snow roof with front/back overhang
for (let i = 0; i <= 6; i++) {
  const y = 7 + i, x = 7 - i;
  cube(-x, y, 0, -x, y, 12, SNOW);
  cube(x, y, 0, x, y, 12, SNOW);
}
cube(0, 14, 0, 0, 14, 12, SNOW);              // ridge cap

// gumdrop candies stuck on the roof slopes
const drops = [BRICK, ICE, LEAVES];
for (let z = 1; z <= 11; z += 2) {
  block(-5, 10, z, drops[z % 3]);
  block(5, 10, z, drops[(z + 1) % 3]);
}
for (let z = 2; z <= 10; z += 3) {
  block(-2, 13, z, drops[(z + 2) % 3]);
  block(2, 13, z, drops[z % 3]);
}

// icing scallops dripping under the eaves
for (let z = 0; z <= 12; z += 2) { block(-7, 6, z, SNOW); block(7, 6, z, SNOW); }

// ---------- front facade ----------
// red candy door with arch + icing frame that sticks out
cube(-1, 1, 1, 1, 3, 1, BRICK);
block(0, 4, 1, BRICK);
block(1, 2, 1, ICE);                          // knob
line(-2, 1, 0, -2, 4, 0, SNOW); line(2, 1, 0, 2, 4, 0, SNOW);
block(-1, 4, 0, SNOW); block(1, 4, 0, SNOW); block(0, 5, 0, SNOW);

// front windows with icing frames + candy sills
for (const wx of [-4, 4]) {
  cube(wx - 1, 2, 1, wx + 1, 5, 1, SNOW);
  cube(wx, 3, 1, wx, 4, 1, GLASS);
  block(wx, 2, 0, BRICK);
}

// candy buttons on the facade
block(-2, 5, 1, ICE); block(2, 5, 1, ICE); block(0, 5, 1, BRICK);

// peppermint medallion + candy row on the gable
block(0, 10, 1, BRICK);
block(-1, 10, 1, SNOW); block(1, 10, 1, SNOW);
block(0, 9, 1, SNOW); block(0, 11, 1, SNOW);
block(-4, 8, 1, ICE); block(-2, 8, 1, BRICK); block(2, 8, 1, BRICK); block(4, 8, 1, ICE);

// side windows
for (const s of [-6, 6]) {
  for (const wz of [4, 8]) {
    cube(s, 2, wz - 1, s, 5, wz + 1, SNOW);
    cube(s, 3, wz, s, 4, wz, GLASS);
  }
}

// chimney with snow cap and smoke puffs
cube(3, 9, 8, 4, 14, 9, BRICK);
cube(3, 15, 8, 4, 15, 9, SNOW);
block(4, 17, 8, SNOW); block(3, 18, 9, SNOW); block(4, 20, 9, SNOW);

// ---------- candy yard ----------
// candy canes (striped, hook curls toward the camera)
function cane(x, z, h) {
  let c = 0;
  const col = () => (c++ % 2) ? SNOW : BRICK;
  for (let y = 1; y <= h; y++) block(x, y, z, col());
  block(x, h + 1, z, col());
  block(x, h + 1, z - 1, col());
  block(x, h, z - 2, col());
}
cane(-3, 0, 5); cane(3, 0, 5);                // flanking the door
cane(-2, -14, 3); cane(2, -14, 3);            // garden gate

// gumdrop-button fence around the yard
for (let x = -12; x <= 12; x += 2) {
  const c = (x % 4 === 0) ? BRICK : SNOW;
  if (Math.abs(x) > 2) block(x, 1, -15, c);   // gap for the path
  block(x, 1, 12, c);
}
for (let z = -13; z <= 11; z += 2) {
  const c = ((z + 13) % 4 < 2) ? BRICK : SNOW;
  block(-13, 1, z, c); block(13, 1, z, c);
}
for (const cx of [-13, 13]) for (const cz of [-15, 12]) {
  block(cx, 1, cz, BRICK); block(cx, 2, cz, SNOW);
}

// gingerbread men, arms up, icing faces toward the camera
function gman(x, z) {
  block(x - 1, 1, z, OAK_LOG); block(x + 1, 1, z, OAK_LOG);
  block(x - 1, 2, z, OAK_LOG); block(x + 1, 2, z, OAK_LOG);
  cube(x - 1, 3, z, x + 1, 5, z, OAK_LOG);
  block(x - 2, 5, z, OAK_LOG); block(x + 2, 5, z, OAK_LOG);
  block(x - 3, 6, z, OAK_LOG); block(x + 3, 6, z, OAK_LOG);
  cube(x - 1, 6, z, x + 1, 7, z, OAK_LOG); block(x, 8, z, OAK_LOG);
  block(x - 1, 7, z, SNOW); block(x + 1, 7, z, SNOW);   // eyes
  block(x, 6, z, SNOW);                                 // smile
  block(x, 3, z, BRICK); block(x, 4, z, SNOW);          // buttons
}
gman(8, -7); gman(-7, -5);

// snowman with carrot-red nose facing the camera
sphere(-11, 1, -12, 1, SNOW);
block(-11, 3, -12, SNOW);
block(-11, 3, -13, BRICK);
line(-12, 2, -12, -13, 3, -12, OAK_LOG);
line(-10, 2, -12, -9, 3, -12, OAK_LOG);

// lollipops — swirl heads face the camera
function lolli(x, z, c1, c2) {
  for (let y = 1; y <= 6; y++) block(x, y, z, PLANKS);
  for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= 2.4) block(x + dx, 8 + dy, z, d < 1 ? c1 : (d < 1.8 ? c2 : c1));
  }
}
lolli(10, -12, BRICK, SNOW);
lolli(-10, -2, ICE, SNOW);

// scattered gumdrops
const gd = [[5, -5, BRICK], [-4, -12, LEAVES], [11, -6, LEAVES], [-12, -8, BRICK],
            [4, -14, ICE], [-5, -2, ICE], [6, -10, BRICK], [-9, 4, LEAVES], [12, 3, ICE]];
for (const [x, z, id] of gd) sphere(x, 1, z, 1, id);

// candy wishing well, east side
hollowCylinder(10, 1, 0, 2, 2, BRICK);
disk(10, 1, 0, 1, ICE);
cube(8, 3, 0, 8, 4, 0, OAK_LOG); cube(12, 3, 0, 12, 4, 0, OAK_LOG);
disk(10, 5, 0, 3, SNOW);
disk(10, 6, 0, 2, BRICK);
block(10, 7, 0, SNOW);

// frosted gingerbread trees in the back corners
for (const [tx, tz] of [[-10, 8], [11, 9]]) {
  cube(tx, 1, tz, tx, 3, tz, OAK_LOG);
  sphere(tx, 5, tz, 2, LEAVES);
  disk(tx, 7, tz, 2, SNOW);
}
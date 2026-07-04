// terminator-4x-fable — prompt:
// the Terminator...

const M = STONE, D = COBBLE, W = SNOW, F = BRICK, G = SAND, L = OAK_LOG;
let seed = 1337;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

// ---- clear battle zone (trees/brush) ----
cube(-12, 0, -14, 12, 13, 11, AIR);
cube(-21, 0, 4, -7, 15, 13, AIR);
cube(8, 0, 4, 17, 10, 10, AIR);
cube(-17, 0, -6, -13, 9, 6, AIR);

// ---- scorched ground ----
disk(0, -1, 0, 8, D);
for (let k = 0; k < 30; k++) {
  const a = rnd() * 6.283, r = rnd() * 7.5;
  block(Math.round(Math.cos(a) * r), -1, Math.round(Math.sin(a) * r), rnd() < 0.4 ? M : D);
}
// debris annulus
for (let k = 0; k < 90; k++) {
  const a = rnd() * 6.283, r = 9 + rnd() * 4;
  block(Math.round(Math.cos(a) * r), 0, Math.round(Math.sin(a) * r * 0.8), [D, M, F][Math.floor(rnd() * 3)]);
}

// ================= T-800 ENDOSKELETON (facing -Z, ~32 tall) =================
// legs + feet + hips + shoulders (mirrored)
for (const s of [1, -1]) {
  const xo = s > 0 ? 3 : -4;      // low-x of 2-wide limb
  const fx = s * 4;
  // foot with toe claws
  cube(fx - 1, 0, -3, fx + 1, 0, 1, D);
  cube(fx - 1, 1, -1, fx + 1, 1, 1, D);
  block(fx - 1, 0, -4, M); block(fx, 0, -5, M); block(fx + 1, 0, -4, M);
  // shin struts + rear piston
  cube(xo, 2, -1, xo + 1, 7, 0, M);
  line(fx, 2, 1, fx, 7, 1, W);
  // knee actuator
  sphere(fx, 8, 0, 1, D);
  block(fx, 8, -1, W);
  // thigh + front hydraulic rod
  cube(xo, 9, -1, xo + 1, 12, 0, D);
  line(fx, 9, -2, s * 3, 12, -2, W);
  // hip ball joint
  sphere(s * 4, 12, 0, 1, M);
  // waist cable
  block(s * 2, 14, 0, W);
  // shoulder actuator
  sphere(s * 6, 23, 0, 2, D);
}
// pelvis
cube(-3, 12, -1, 3, 13, 1, D);
cube(-1, 12, -2, 1, 13, -2, M);
// ribcage: open rings with gaps between
const rings = [[15, 2], [17, 4], [19, 5], [21, 5]];
for (const [y, w] of rings) {
  cube(-w, y, -2, w, y, -2, M);
  cube(-w, y, 1, w, y, 1, D);
  cube(-w, y, -1, -w, y, 0, M);
  cube(w, y, -1, w, y, 0, M);
}
for (const [y, w] of [[16, 3], [18, 4], [20, 5]]) {
  cube(-w, y, -1, -w, y, 0, D);
  cube(w, y, -1, w, y, 0, D);
  block(0, y, -2, W);              // sternum
}
cube(-5, 22, -2, 5, 22, 1, M);     // chest top plate
cube(-1, 17, 0, 1, 19, 0, F);      // red power-core glow seen through ribs
for (let y = 14; y <= 22; y++) block(0, y, 1, (y % 2) ? W : D);  // vertebrae
cube(-5, 23, -1, 5, 23, 0, M);     // clavicle bar
cube(-1, 24, -1, 1, 24, 0, D);     // neck
block(0, 24, 1, W);

// ---- chrome skull ----
function face(y, arr, z) {
  for (let i = 0; i < 7; i++) { const id = arr[i]; if (id !== null) block(i - 3, y, z, id); }
}
cube(-2, 32, -2, 2, 32, 1, M);
cube(-3, 31, -3, 3, 31, 1, M);
cube(-3, 30, -3, 3, 30, 1, M);
cube(-3, 29, -2, 3, 29, 1, M);
cube(-3, 29, -3, 3, 29, -3, M);
cube(-3, 29, -4, 3, 29, -4, D);            // brow overhang
cube(-3, 28, -2, 3, 28, 1, M);
face(28, [F, F, D, M, D, F, F], -3);       // burning red eyes
cube(-3, 27, -2, 3, 27, 1, M);
face(27, [M, M, D, D, D, M, M], -3);       // cheekbones + nasal cavity
cube(-2, 26, -2, 2, 26, 1, M);
face(26, [null, W, D, W, D, W, null], -3); // upper teeth
cube(-2, 25, -2, 2, 25, 1, D);
face(25, [null, D, W, D, W, D, null], -3); // lower teeth
for (const s of [1, -1]) {
  line(s * 3, 25, -1, s * 3, 27, -1, D);   // jaw pistons
  block(s * 4, 28, -1, D); block(s * 4, 28, 0, D); // ear servos
}

// ---- left arm, hanging with open claw ----
cube(-7, 19, -1, -6, 22, 0, D);
sphere(-7, 18, 0, 1, M);
cube(-8, 13, -1, -7, 17, 0, M);
line(-6, 14, 0, -6, 17, 0, W);
cube(-8, 12, -1, -7, 12, 0, D);
cube(-8, 11, -1, -7, 11, 0, D);
block(-8, 10, -1, W); block(-8, 9, -1, W);
block(-7, 10, -2, W); block(-7, 9, -2, W);
block(-7, 10, 1, W); block(-7, 9, 1, W);

// ---- right arm raised, aiming plasma rifle forward ----
cube(7, 22, -1, 8, 23, 0, D);
cube(8, 21, -1, 9, 22, 0, D);
sphere(9, 21, -1, 1, M);
cube(8, 20, -6, 9, 21, -2, M);
// rifle
cube(8, 19, -11, 10, 21, -5, D);
line(9, 22, -11, 9, 22, -6, M);            // sight rail
line(9, 20, -12, 9, 20, -16, M);           // barrel
for (const z of [-12, -14]) {              // plasma coils
  block(8, 20, z, ICE); block(10, 20, z, ICE);
  block(9, 21, z, ICE); block(9, 19, z, ICE);
}
block(9, 20, -17, ICE);                    // muzzle glow
block(8, 20, -9, F); block(10, 20, -9, F); // power cells
cube(9, 19, -4, 9, 20, -3, D);             // stock
cube(8, 19, -7, 9, 20, -5, M);             // gripping hand

// ================= crawling blown-in-half endoskeleton =================
const cx = -11, cz = -8;
disk(cx, -1, cz, 3, D);
cube(cx - 1, 0, cz - 1, cx + 1, 2, cz + 1, M);
cube(cx - 1, 0, cz - 1, cx + 1, 0, cz - 1, W);   // teeth
block(cx - 1, 1, cz - 1, F); block(cx + 1, 1, cz - 1, F); // eyes
block(cx, 1, cz - 1, D);
line(cx - 2, 1, cz, cx - 4, 0, cz - 4, M);       // dragging arm
block(cx - 5, 0, cz - 5, M); block(cx - 4, 0, cz - 6, M); block(cx - 3, 0, cz - 5, M);
block(cx + 2, 1, cz, D); block(cx + 2, 0, cz + 1, D);
for (let z = cz + 2; z <= cz + 7; z++) block(cx, 0, z, (z % 2) ? W : D); // trailing spine
for (const dz of [2, 4]) {
  block(cx - 1, 1, cz + dz, M); block(cx + 1, 1, cz + dz, M);
  block(cx - 2, 0, cz + dz, M); block(cx + 2, 0, cz + dz, M);
}
block(cx, 1, cz + 7, F); block(cx + 1, 0, cz + 7, G); // sparks at the break

// ================= ruined city backdrop =================
// bombed-out building, left rear
const hsA = [12, 13, 12, 11, 12, 10, 9, 7, 6, 4, 3, 2];
for (let i = 0; i < 12; i++) {
  const x = -20 + i, h = hsA[i];
  cube(x, -1, 8, x, h, 9, F);
  block(x, (i * 5) % (h + 1), 8, D);
  block(x, (i * 11) % (h + 1), 8, D);
}
for (const wy of [2, 6, 10])
  for (let i = 1; i < 12; i += 3) {
    const x = -20 + i, h = hsA[i];
    if (h > wy + 2) cube(x, wy, 8, x, wy + 1, 9, AIR);
  }
for (let j = 0; j < 4; j++) {              // return wall
  const z = 10 + j, h = 11 - j * 2;
  cube(-20, -1, z, -19, h, z, F);
}
cube(-19, 5, 9, -15, 5, 12, M);            // collapsed floor slab
line(-9, 3, 8, -6, 1, 5, D);               // bent rebar
line(-13, 11, 8, -11, 13, 6, D);
line(-19, 7, 12, -17, 9, 13, D);

// low wall fragment, right rear
const hsB = [5, 6, 4, 3, 4, 2];
for (let i = 0; i < 6; i++) {
  const x = 12 + i, h = hsB[i];
  cube(x, -1, 7, x, h, 8, F);
  block(x, (i * 7) % (h + 1), 7, D);
}
cube(14, 0, 7, 15, 2, 8, AIR);             // blast breach
line(12, 6, 7, 10, 8, 5, D);

// rubble piles at wall bases
for (let k = 0; k < 45; k++) {
  const x = -20 + Math.floor(rnd() * 13), z = 4 + Math.floor(rnd() * 4);
  block(x, rnd() < 0.3 ? 1 : 0, z, [F, D, M][Math.floor(rnd() * 3)]);
}
for (let k = 0; k < 25; k++) {
  const x = 11 + Math.floor(rnd() * 7), z = 4 + Math.floor(rnd() * 3);
  block(x, 0, z, [F, D][Math.floor(rnd() * 2)]);
}

// burnt snag trees
line(-15, 0, 2, -15, 7, 2, L); line(-15, 5, 2, -13, 7, 1, L); line(-15, 3, 2, -16, 5, 3, L);
line(11, 0, -11, 11, 6, -11, L); line(11, 4, -11, 13, 6, -12, L);

// crushed car hulk, burning
cube(0, 0, -14, 3, 0, -12, D);
cube(1, 1, -13, 2, 1, -12, M);
block(0, 1, -13, F); block(0, 2, -13, G);

// toppled street lamp
line(-7, 0, -11, -7, 6, -11, D);
line(-7, 6, -11, -4, 6, -11, D);
block(-4, 5, -11, GLASS);

// half-buried endo arm clawing out of the rubble
line(7, 0, 8, 8, 2, 9, M);
block(8, 3, 9, M); block(9, 2, 9, M); block(8, 2, 10, M);

// ================= skull field (future-war ground) =================
function gskull(x, z) {
  cube(x - 1, 0, z, x + 1, 1, z + 1, W);
  block(x - 1, 1, z, D); block(x + 1, 1, z, D);
}
for (const [x, z] of [[-6, -5], [3, -7], [7, -2], [-2, -9], [6, 3], [-7, 3], [2, 6], [-5, 6], [11, -4], [-10, -3], [4, 9], [-13, 6], [0, 9], [9, 2]]) gskull(x, z);

// ================= fires =================
function flame(x, z) {
  cube(x, 0, z, x + 1, 0, z + 1, F);
  block(x, 1, z, F); block(x + 1, 1, z + 1, G); block(x, 1, z + 1, G);
  block(x, 2, z, G);
}
for (const [x, z] of [[-9, -6], [9, -8], [-11, 2], [11, 4], [5, -11], [-4, -12], [-15, 6], [13, 6], [7, 10], [-8, 11]]) flame(x, z);
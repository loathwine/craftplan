// mjolnir-4x-opus — prompt:
// Thor's hammer Mjölnir...

// Thor's hammer Mjolnir — standing upright, head at top, front face toward -Z (viewer/north)

const HEAD_Y0 = 17, HEAD_Y1 = 28;   // head vertical span
const HW = 9;                       // half-width of head body
const DZ0 = -4, DZ1 = 4;            // head depth (front at -Z)
const CH = 3;                       // corner chamfer size

// ================= BASE / GROUND =================
// planted mound of cracked stone the hammer is driven into
disk(0, -2, 0, 6, STONE);
disk(0, -1, 0, 5, STONE);
disk(0, 0, 0, 3, COBBLE);
// scattered rubble around the impact site
const rocks = [[6,2],[-6,-1],[3,6],[-4,-5],[7,-3],[-7,4],[5,5],[-5,-4],[8,1],[-8,-2]];
for (const [rx, rz] of rocks) { cube(rx, -1, rz, rx, 0, rz, COBBLE); }

// ================= HANDLE (wrapped leather grip) =================
const H_Y0 = -1, H_Y1 = 16;
for (let y = H_Y0; y <= H_Y1; y++) {
  const leather = (Math.floor((y - H_Y0) / 2) % 2 === 0) ? OAK_LOG : PLANKS;
  cube(-1, y, -1, 1, y, 1, leather);
}
// solid oak core
cube(0, H_Y0, 0, 0, H_Y1, 0, OAK_LOG);

// leather thong loop protruding toward the viewer, just under the head
(function loop() {
  const cy = 12, cx = 0, cz = -6, r = 2.6;
  for (let a = 0; a < 360; a += 10) {
    const t = a * Math.PI / 180;
    block(Math.round(cx + Math.cos(t) * r), Math.round(cy + Math.sin(t) * r), cz, OAK_LOG);
  }
})();

// ================= FERRULE / COLLAR =================
cube(-3, 14, -3, 3, 16, 3, STONE);
hollowCube(-4, 14, -4, 4, 15, 4, COBBLE);

// ================= HEAD (chamfered rectangular block) =================
for (let y = HEAD_Y0; y <= HEAD_Y1; y++) {
  const d = Math.min(HEAD_Y1 - y, y - HEAD_Y0);
  const cut = Math.max(0, CH - d);          // shave the four outer corners
  const left = -HW + cut, right = HW - cut;
  cube(left, y, DZ0, right, y, DZ1, STONE);
}

// flared striking faces (the two ends bulge outward, mid-height) in darker metal
for (let side of [-1, 1]) {
  const xIn = side * HW, xOut = side * (HW + 1);
  cube(xOut, 20, DZ0, xOut, 25, DZ1, COBBLE);   // extra flare column
  cube(xIn, 18, DZ0, xIn, 27, DZ1, COBBLE);     // striking-face plate
  cube(xOut, 21, DZ0 + 1, xOut, 24, DZ1 - 1, STONE); // beveled cap detail
}

// raised rim frame around the front face (viewer side = DZ0)
const FZ = DZ0 - 1;
for (let x = -HW + CH; x <= HW - CH; x++) {
  block(x, HEAD_Y0 + 1, FZ, COBBLE);
  block(x, HEAD_Y1 - 1, FZ, COBBLE);
}
for (let y = HEAD_Y0 + 1; y <= HEAD_Y1 - 1; y++) {
  block(-HW + CH - 1, y, FZ, COBBLE);
  block(HW - CH + 1, y, FZ, COBBLE);
}

// central boss (raised diamond) on the front face
(function boss() {
  const cy = 22, R = 4;
  for (let x = -R; x <= R; x++) {
    for (let y = -R; y <= R; y++) {
      if (Math.abs(x) + Math.abs(y) <= R) {
        block(x, cy + y, FZ, STONE);
        if (Math.abs(x) + Math.abs(y) === R) block(x, cy + y, FZ, COBBLE);
      }
    }
  }
  block(0, cy, FZ - 1, COBBLE);
})();

// glowing runic lightning-bolt emblem in ICE on the boss front
const boltZ = FZ - 1;
const bolt = [[1,26],[0,25],[1,24],[0,23],[-1,23],[0,22],[-1,21],[0,20],[1,20],[0,19],[-1,18]];
for (const [bx, by] of bolt) block(bx, by, boltZ, ICE);
// rune ticks flanking the bolt
for (const [rx, ry] of [[-4,24],[4,24],[-4,20],[4,20],[-3,22],[3,22]]) block(rx, ry, boltZ, ICE);

// corner rivets on the front face
for (const s of [-1, 1]) for (const yy of [HEAD_Y0 + 2, HEAD_Y1 - 2]) {
  block(s * (HW - CH), yy, FZ - 1, GLASS);
}

// ================= LIGHTNING ARCS =================
function bolt3(pts, id) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    line(a[0], a[1], a[2], b[0], b[1], b[2], id);
  }
}
// bolts leaping up off the head into the sky
bolt3([[-3, 28, 0], [-5, 30, 0], [-3, 31, 0], [-6, 33, 0]], ICE);
bolt3([[ 4, 28, 0], [ 2, 30, 0], [ 5, 31, 0], [ 3, 33, 0]], ICE);
// arcs jumping off the striking faces outward
bolt3([[ 10, 24, 0], [ 13, 23, 0], [ 15, 25, 0], [ 18, 24, 0]], GLASS);
bolt3([[-10, 22, 0], [-13, 23, 0], [-15, 21, 0], [-18, 22, 0]], GLASS);
bolt3([[ 11, 20, 2], [ 14, 19, 2], [ 16, 21, 2]], ICE);
bolt3([[-11, 25, -2], [-14, 26, -2], [-16, 24, -2]], ICE);
// energy sparks floating around the head
for (const [sx, sy, sz] of [[7,30,3],[-7,29,-3],[12,27,-4],[-12,28,4],[0,32,4]]) block(sx, sy, sz, ICE);
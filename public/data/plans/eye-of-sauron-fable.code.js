// eye-of-sauron-fable — prompt:
// the Eye of Sauron on the tower of Barad-dur...

// Barad-dûr: black spire with the flaming Eye of Sauron, facing north (-Z)
// Budget-aware: tower is a hollow shell with interior carved, eye built from thin surfaces.

const B = BLACK, O = OBSIDIAN, G = GRAY, D = LIGHT_GRAY;

// helper: hollow vertical ring (walls only) between two heights
function ring(cx, cz, r, y1, y2, id) {
  for (let y = y1; y <= y2; y++) {
    for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
      const d = Math.sqrt(x*x + z*z);
      if (d <= r + 0.5 && d > r - 0.7) block(cx + x, y, cz + z, id);
    }
  }
}
// helper: square hollow layer
function shell(cx, cz, half, y1, y2, id) {
  for (let y = y1; y <= y2; y++) {
    for (let x = -half; x <= half; x++) for (let z = -half; z <= half; z++) {
      if (Math.abs(x) === half || Math.abs(z) === half) block(cx + x, y, cz + z, id);
    }
  }
}

// ---------- clear trees near the tower ----------
cube(-9, 0, -9, 9, 9, 9, AIR);

// ---------- rocky base / plateau ----------
disk(0, -1, 0, 11, O);
disk(0, 0, 0, 9, B);
// ragged rock outcrops around the base
for (let i = 0; i < 14; i++) {
  const a = i * 0.45, r = 9 + (i % 3);
  const x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r);
  const h = 1 + (i % 3);
  cube(x - 1, 0, z - 1, x + 1, h, z + 1, i % 2 ? O : G);
}
// lava moat cracks (sparse)
for (let i = 0; i < 8; i++) {
  const a = i * 0.8 + 0.3;
  const x = Math.round(Math.cos(a) * 12), z = Math.round(Math.sin(a) * 12);
  block(x, -1, z, LAVA); block(x + 1, -1, z, LAVA);
}

// ---------- fortress base: square, buttressed ----------
shell(0, 0, 7, 1, 6, B);
shell(0, 0, 6, 1, 7, O);
// corner buttress towers
for (const [bx, bz] of [[-7,-7],[7,-7],[-7,7],[7,7]]) {
  hollowCylinder(bx, 1, bz, 2, 9, O);
  disk(bx, 10, bz, 2, B);
  // crenellations
  for (const [dx, dz] of [[2,0],[-2,0],[0,2],[0,-2],[1,1],[-1,-1],[1,-1],[-1,1]])
    block(bx + dx, 11, bz + dz, B);
}
// gatehouse on north face
cube(-3, 1, -8, 3, 6, -8, O);
cube(-1, 1, -8, 1, 3, -8, AIR);
block(-2, 5, -8, LAVA); block(2, 5, -8, LAVA);

// ---------- main shaft: tapering octagonal-ish tower ----------
ring(0, 0, 5, 7, 12, B);
ring(0, 0, 4.5, 13, 18, O);
ring(0, 0, 4, 19, 22, B);
// vertical ribs (jagged iron spines) on the shaft
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4;
  const x = Math.round(Math.cos(a) * 5.6), z = Math.round(Math.sin(a) * 5.6);
  line(x, 7, z, Math.round(Math.cos(a) * 4.6), 20, Math.round(Math.sin(a) * 4.6), i % 2 ? IRON : O);
}
// narrow arrow slits glowing with lava on the north face
for (let y = 9; y <= 20; y += 3) {
  block(0, y, -5, AIR); block(0, y, -5, LAVA);
  block(-2, y + 1, -5, LAVA); block(2, y + 1, -5, LAVA);
}

// ---------- crown platform: the twin horns holding the Eye ----------
disk(0, 23, 0, 5, O);
disk(0, 24, 0, 4, B);
// two curving horns, left and right, rising past the eye
function horn(sign) {
  const pts = [[3,24],[4,25],[5,26],[5,27],[5,28],[5,29],[4,30],[4,31],[3,32],[2,33]];
  for (let i = 0; i < pts.length; i++) {
    const [dx, y] = pts[i];
    const x = sign * dx;
    const t = i < 4 ? 1 : 0;
    cube(x - t, y, -t, x + t, y, t, i < 5 ? O : B);
    if (i < 7) block(x + sign, y, 0, IRON);
  }
}
horn(1); horn(-1);
// cross-strut behind the eye, iron
line(-4, 27, 2, 4, 27, 2, IRON);

// ---------- the Eye of Sauron ----------
// Flaming lens: ellipse in the XY plane, facing north, at z=0, centered y=28
const EY = 28;
function eyeAt(x, y) {
  const nx = x / 4.6, ny = y / 2.4; // 9 wide, 5 tall
  return nx*nx + ny*ny;
}
for (let x = -5; x <= 5; x++) for (let y = -3; y <= 3; y++) {
  const e = eyeAt(x, y);
  if (e > 1.15) continue;
  const ax = x, ay = EY + y;
  if (Math.abs(x) <= 0 && Math.abs(y) <= 2) {
    // cat-slit pupil
    block(ax, ay, 0, B); block(ax, ay, -1, B);
  } else if (e < 0.55) {
    block(ax, ay, 0, LAVA);
    block(ax, ay, -1, ORANGE);
  } else if (e <= 1.0) {
    block(ax, ay, 0, NEON_RED);
    block(ax, ay, -1, RED);
  } else {
    block(ax, ay, 0, RED);
  }
}
// pupil face (front layer overrides)
line(0, EY - 2, -1, 0, EY + 2, -1, B);
// flame tongues licking off the eye
const flames = [[-6,28],[6,28],[-5,30],[5,30],[-3,31],[3,31],[0,32],[-6,26],[6,26],[0,24]];
for (const [fx, fy] of flames) block(fx, fy, -1, FIRE);
// heat halo (orange wisps)
for (let i = 0; i < 12; i++) {
  const a = i * Math.PI / 6;
  const x = Math.round(Math.cos(a) * 6), y = Math.round(EY + Math.sin(a) * 3.5);
  if (Math.abs(y - EY) < 3.5 || true) block(x, y, 1, i % 2 ? RED : ORANGE);
}

// ---------- outer wall + spikes on the plateau ----------
shell(0, 0, 10, 1, 2, O);
for (let i = 0; i < 20; i++) {
  const a = i * Math.PI / 10;
  const x = Math.round(Math.cos(a) * 10), z = Math.round(Math.sin(a) * 10);
  line(x, 2, z, x, 3 + (i % 3), z, IRON);
}
// open the wall on north for the gate road
cube(-2, 1, -10, 2, 3, -10, AIR);
line(0, 0, -11, 0, 0, -20, COBBLE);
line(-1, 0, -13, -1, 0, -19, COBBLE);
line(1, 0, -13, 1, 0, -19, COBBLE);
// braziers along the road
for (let z = -14; z >= -20; z -= 3) {
  block(-3, 0, z, O); block(-3, 1, z, FIRE);
  block(3, 0, z, O); block(3, 1, z, FIRE);
}

// ---------- background: Mount Doom smoke plume behind (south) ----------
cube(4, 0, 12, 12, 2, 20, G);
cube(6, 3, 14, 10, 5, 18, D);
cube(7, 6, 15, 9, 7, 17, G);
block(8, 7, 16, LAVA); block(8, 8, 16, FIRE); block(9, 8, 15, FIRE);
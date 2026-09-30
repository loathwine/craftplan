// dragon-fire-sonnet — prompt:
// a dragon breathing fire...

// ===== Helpers =====
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpPt(p, q, t) {
  return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), lerp(p[2], q[2], t), lerp(p[3], q[3], t)];
}
function hash(x, y, z) {
  let h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return h - Math.floor(h);
}

// ===== Rocky perch =====
sphere(0, -3, 8, 6, STONE);
sphere(0, -3, 8, 5, COBBLE);
cube(-6, -2, 3, 6, -1, 13, STONE);
for (let i = 0; i < 14; i++) {
  const bx = Math.round(lerp(-7, 7, hash(i, 1, 0)));
  const bz = Math.round(lerp(3, 14, hash(i, 2, 0)));
  sphere(bx, -2, bz, 1 + Math.floor(hash(i, 3, 0) * 2), COBBLE);
}

// ===== Body spine (hip -> shoulder -> neck -> skull) =====
const spine = [
  [0, 3, 11, 2.4],   // hip
  [0, 4, 8, 2.8],
  [0, 6, 5, 3.2],    // chest / shoulder
  [0, 9, 2, 3.0],
  [0, 11, -1, 2.5],
  [1, 13, -4, 2.0],  // neck
  [2, 13, -7, 1.6],
  [3, 11, -10, 2.1], // skull
];
for (let i = 0; i < spine.length - 1; i++) {
  for (let s = 0; s <= 4; s++) {
    const t = s / 4;
    const [x, y, z, r] = lerpPt(spine[i], spine[i + 1], t);
    sphere(Math.round(x), Math.round(y), Math.round(z), r, GREEN);
  }
}

// belly highlight strip
for (let i = 0; i < spine.length - 1; i++) {
  for (let s = 0; s <= 4; s++) {
    const t = s / 4;
    const [x, y, z, r] = lerpPt(spine[i], spine[i + 1], t);
    cube(Math.round(x - r * 0.6), Math.round(y - r), Math.round(z - 1),
         Math.round(x + r * 0.6), Math.round(y - r + 1), Math.round(z + 1), LIME);
  }
}

// back spikes
for (let i = 0; i < spine.length; i++) {
  const [x, y, z, r] = spine[i];
  block(Math.round(x), Math.round(y + r + 1), Math.round(z), OBSIDIAN);
  block(Math.round(x), Math.round(y + r + 2), Math.round(z), OBSIDIAN);
}

// scale speckle
for (let i = 0; i < spine.length - 1; i++) {
  const [x0, y0, z0] = spine[i];
  const [x1, y1, z1] = spine[i + 1];
  for (let k = 0; k < 8; k++) {
    const t = k / 8;
    const x = Math.round(lerp(x0, x1, t) + (hash(k, i, 5) - 0.5) * 3);
    const y = Math.round(lerp(y0, y1, t) + (hash(k, i, 6) - 0.5) * 3);
    const z = Math.round(lerp(z0, z1, t) + (hash(k, i, 7) - 0.5) * 3);
    block(x, y, z, LIME);
  }
}

// ===== Tail (hip -> curled tip) =====
const tail = [
  [0, 3, 11, 2.2],
  [0, 3, 14, 1.8],
  [0, 4, 16, 1.3],
  [0, 6, 17, 0.9],
  [1, 8, 16, 0.6],
];
for (let i = 0; i < tail.length - 1; i++) {
  for (let s = 0; s <= 3; s++) {
    const t = s / 3;
    const [x, y, z, r] = lerpPt(tail[i], tail[i + 1], t);
    sphere(Math.round(x), Math.round(y), Math.round(z), r, GREEN);
  }
}
block(1, 9, 15, OBSIDIAN);
block(1, 10, 15, OBSIDIAN);

// ===== Head detail =====
const skull = [3, 11, -10];
// snout
cube(skull[0] - 1, skull[1] - 2, skull[2] - 3, skull[0] + 2, skull[1], skull[2], GREEN);
// upper jaw
cube(skull[0] - 1, skull[1] - 1, skull[2] - 6, skull[0] + 2, skull[1], skull[2] - 3, GREEN);
// lower jaw (open, dropped down)
cube(skull[0] - 1, skull[1] - 4, skull[2] - 6, skull[0] + 2, skull[1] - 3, skull[2] - 2, GREEN);
// teeth
for (let x = skull[0] - 1; x <= skull[0] + 2; x++) {
  block(x, skull[1] - 1, skull[2] - 6, WHITE);
  block(x, skull[1] - 3, skull[2] - 5, WHITE);
}
// horns
line(skull[0] - 2, skull[1] + 2, skull[2] + 1, skull[0] - 4, skull[1] + 6, skull[2] + 3, OBSIDIAN);
line(skull[0] + 3, skull[1] + 2, skull[2] + 1, skull[0] + 5, skull[1] + 6, skull[2] + 3, OBSIDIAN);
line(skull[0] - 1, skull[1] + 2, skull[2], skull[0] - 2, skull[1] + 5, skull[2] + 2, OBSIDIAN);
line(skull[0] + 2, skull[1] + 2, skull[2], skull[0] + 3, skull[1] + 5, skull[2] + 2, OBSIDIAN);
// eyes
block(skull[0] - 2, skull[1] + 1, skull[2] - 1, NEON_RED);
block(skull[0] + 3, skull[1] + 1, skull[2] - 1, NEON_RED);

// ===== Hind legs =====
function leg(sx) {
  cylinder(sx, -2, 9, 1.4, 8, GREEN);
  cube(sx - 2, -2, 8, sx + 2, -1, 11, GREEN); // foot pad
  // claws
  for (let c = -1; c <= 1; c++) {
    line(sx + c, -1, 11, sx + c, -1, 13, OBSIDIAN);
  }
}
leg(-4);
leg(4);

// ===== Front arms (tucked at chest) =====
function arm(sx) {
  line(sx, 6, 2, sx, 3, 4, GREEN);
  cylinder(sx > 0 ? sx : sx, 2, 4, 0.9, 2, GREEN);
  block(sx, 2, 5, OBSIDIAN);
  block(sx + (sx > 0 ? 1 : -1), 2, 5, OBSIDIAN);
}
arm(-3);
arm(3);

// ===== Wings =====
function wing(side) {
  const anchor = [2 * side, 11, 1];
  const f1 = [8 * side, 15, -1];
  const f2 = [15 * side, 19, 3];
  const f3 = [20 * side, 18, 8];
  const trail = [10 * side, 8, 12]; // trailing edge back toward hip

  // finger bones
  line(...anchor, ...f1, GRAY);
  line(...anchor, ...f2, GRAY);
  line(...anchor, ...f3, GRAY);
  block(f1[0], f1[1], f1[2], OBSIDIAN);
  block(f2[0], f2[1], f2[2], OBSIDIAN);
  block(f3[0], f3[1], f3[2], OBSIDIAN);

  // membrane fans between consecutive fingers
  function fan(pa, pb) {
    for (let s = 0; s <= 8; s++) {
      const t = s / 8;
      const p = [lerp(anchor[0], pa[0], t), lerp(anchor[1], pa[1], t), lerp(anchor[2], pa[2], t)];
      const q = [lerp(anchor[0], pb[0], t), lerp(anchor[1], pb[1], t), lerp(anchor[2], pb[2], t)];
      line(Math.round(p[0]), Math.round(p[1]), Math.round(p[2]),
           Math.round(q[0]), Math.round(q[1]), Math.round(q[2]), BLACK);
    }
  }
  fan(f1, f2);
  fan(f2, f3);
  // trailing membrane from last finger back to hip area
  for (let s = 0; s <= 8; s++) {
    const t = s / 8;
    const p = [lerp(anchor[0], f1[0], t), lerp(anchor[1], f1[1], t), lerp(anchor[2], f1[2], t)];
    const q = [lerp(anchor[0], trail[0], t), lerp(anchor[1], trail[1], t), lerp(anchor[2], trail[2], t)];
    line(Math.round(p[0]), Math.round(p[1]), Math.round(p[2]),
         Math.round(q[0]), Math.round(q[1]), Math.round(q[2]), BLACK);
  }
  line(...anchor, ...trail, GRAY);
}
wing(1);
wing(-1);

// ===== Fire breath (from mouth, streaming north) =====
const mouth = [skull[0] + 0.5, skull[1] - 2, skull[2] - 6];
block(Math.round(mouth[0]), Math.round(mouth[1]), Math.round(mouth[2]), LAVA);
block(Math.round(mouth[0]), Math.round(mouth[1]) + 1, Math.round(mouth[2]) - 1, GLOWSTONE);

let fireCount = 0;
for (let i = 0; i < 9; i++) {
  const z = Math.round(mouth[2]) - 1 - i * 1.4;
  const spread = 1 + i * 0.9;
  const cy = mouth[1] - i * 0.15;
  for (let dx = -spread; dx <= spread; dx++) {
    for (let dy = -spread * 0.6; dy <= spread * 0.6; dy++) {
      const d = Math.sqrt(dx * dx + (dy / 0.6) * (dy / 0.6)) / spread;
      if (d > 1) continue;
      if (hash(dx, dy, i) < 0.35) continue; // flicker gaps
      const x = Math.round(mouth[0] + dx);
      const y = Math.round(cy + dy);
      let id;
      if (d < 0.35) id = YELLOW;
      else if (d < 0.7) id = ORANGE;
      else id = RED;
      block(x, y, z, id);
      if (fireCount < 36 && hash(dx, dy, i + 50) < 0.12 && i < 6) {
        block(x, y + 1, z, FIRE);
        fireCount++;
      }
    }
  }
}
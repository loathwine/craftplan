// creeper-4x-opus — prompt:
// a Minecraft creeper...

cube(-99,-99,-99,-99,-99,-99,AIR); // no-op guard

// ---- helpers ----
function h3(x, y, z) {
  let n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function greenAt(x, y, z) {
  return h3(x, y, z) < 0.30 ? GRASS : LEAVES;
}
// full 6-face shell, colored by fn(x,y,z); interior left as AIR (free)
function shell(x1, y1, z1, x2, y2, z2, fn) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++) {
        if (x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2)
          block(x, y, z, fn(x, y, z));
      }
}
function clearInterior(x1, y1, z1, x2, y2, z2) {
  if (x2 - x1 >= 2 && y2 - y1 >= 2 && z2 - z1 >= 2)
    cube(x1 + 1, y1 + 1, z1 + 1, x2 - 1, y2 - 1, z2 - 1, AIR);
}

// ---- 1. scorched arena base ----
function burnt(x, z) {
  const r = Math.sqrt(x * x + z * z);
  const n = h3(x, 7, z);
  if (r < 5) return n < 0.5 ? STONE : COBBLE;          // charred core
  if (r < 9) return n < 0.4 ? COBBLE : (n < 0.72 ? DIRT : STONE);
  return n < 0.55 ? DIRT : GRASS;                       // grassy rim
}
const BR = 13;
for (let x = -BR; x <= BR; x++)
  for (let z = -BR; z <= BR; z++) {
    if (x * x + z * z <= BR * BR) {
      block(x, -2, z, STONE);
      block(x, -1, z, DIRT);
      block(x, 0, z, burnt(x, z));
    }
  }

// small blast craters in the base
function crater(cx, cz) {
  disk(cx, 0, cz, 3, COBBLE);
  sphere(cx, 0, cz, 2, AIR);
  sphere(cx, -1, cz, 1, AIR);
  block(cx, -2, cz, COBBLE);
}
crater(11, 4);
crater(-10, 3);
crater(6, 9);

// ---- 2. MAIN CREEPER ----
// body boxes
const HX1 = -6, HX2 = 5, HZ1 = -6, HZ2 = 5, HY1 = 24, HY2 = 33; // head
const BX1 = -6, BX2 = 5, BZ1 = -3, BZ2 = 2, BY1 = 8,  BY2 = 23; // torso

// clear own volume so garden blocks don't poke through
clearInterior(HX1, HY1, HZ1, HX2, HY2, HZ2);
clearInterior(BX1, BY1, BZ1, BX2, BY2, BZ2);

// torso + head shells (mottled green)
shell(BX1, BY1, BZ1, BX2, BY2, BZ2, greenAt);
shell(HX1, HY1, HZ1, HX2, HY2, HZ2, greenAt);

// legs: four, 5 wide x 3 deep x 8 tall
function leg(x1, z1) {
  const x2 = x1 + 4, z2 = z1 + 2;
  clearInterior(x1, 0, z1, x2, 7, z2);
  shell(x1, 0, z1, x2, 7, z2, greenAt);
}
leg(-6, -3); // front-left
leg(1, -3);  // front-right
leg(-6, 0);  // back-left
leg(1, 0);   // back-right

// ---- 3. the iconic face (dark), 2 blocks deep on the front (-Z) ----
const P = [
  "........",
  ".XX..XX.",
  ".XX..XX.",
  "...XX...",
  "..XXXX..",
  "..XXXX..",
  "..X..X..",
  "........",
];
for (let fy = 0; fy < 8; fy++) {
  for (let fx = 0; fx < 8; fx++) {
    if (P[fy][fx] === "X") {
      const x = -4 + fx;
      const y = 32 - fy;
      block(x, y, -6, STONE);
      block(x, y, -5, COBBLE); // inner shade -> depth
    }
  }
}

// ---- 4. TNT sticks (foreground props) ----
function tnt(cx, cz) {
  cube(cx, 0, cz, cx + 2, 2, cz + 2, BRICK);
  for (let x = cx; x <= cx + 2; x++)
    for (let z = cz; z <= cz + 2; z++) {
      block(x, 0, z, SNOW);
      block(x, 2, z, SNOW);
    }
  block(cx + 1, 3, cz + 1, OAK_LOG); // fuse
  block(cx + 1, 4, cz + 1, SNOW);    // spark
}
tnt(-12, -10);
tnt(8, -11);

// ---- 5. background BABY creeper (depth) ----
function baby(ox, oz) {
  const hx1 = ox - 3, hx2 = ox + 2, hz1 = oz - 3, hz2 = oz + 2, hy1 = 12, hy2 = 16;
  const bx1 = ox - 3, bx2 = ox + 2, bz1 = oz - 1, bz2 = oz + 2, by1 = 4,  by2 = 11;
  clearInterior(hx1, hy1, hz1, hx2, hy2, hz2);
  clearInterior(bx1, by1, bz1, bx2, by2, bz2);
  shell(bx1, by1, bz1, bx2, by2, bz2, greenAt);
  shell(hx1, hy1, hz1, hx2, hy2, hz2, greenAt);
  // legs 2x2x4
  function bleg(x1, z1) {
    shell(x1, 0, z1, x1 + 1, 3, z1 + 1, greenAt);
  }
  bleg(ox - 3, oz - 1);
  bleg(ox + 1, oz - 1);
  bleg(ox - 3, oz + 1);
  bleg(ox + 1, oz + 1);
  // little face on front (-Z)
  const fz = hz1;
  const eyes = [[ox - 2, 15], [ox + 1, 15]];
  const mouth = [[ox - 1, 14], [ox, 14], [ox - 1, 13], [ox, 13], [ox - 2, 12], [ox + 1, 12]];
  for (const [x, y] of eyes) block(x, y, fz, STONE);
  for (const [x, y] of mouth) block(x, y, fz, STONE);
}
baby(-15, 12);

// scattered "gunpowder" specks around the arena
for (let i = 0; i < 14; i++) {
  const a = i * 1.7;
  const r = 6 + (i % 4) * 2;
  const x = Math.round(Math.cos(a) * r);
  const z = Math.round(Math.sin(a) * r);
  if (x * x + z * z <= (BR - 1) * (BR - 1)) block(x, 0, z, h3(x, i, z) < 0.5 ? STONE : COBBLE);
}
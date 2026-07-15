// stonehenge-4x-haiku — prompt:
// Stonehenge...

const STONE = 3;
const COBBLE = 8;

// OUTER SARSEN CIRCLE - 24 massive standing stones
const outerRadius = 11;
for (let i = 0; i < 24; i++) {
  const angle = (i / 24) * Math.PI * 2;
  const x = Math.round(outerRadius * Math.cos(angle));
  const z = Math.round(outerRadius * Math.sin(angle));
  cube(x, 1, z, x, 8, z, STONE);
  
  // Occasional taller stone for variation
  if (i % 4 === 0) block(x, 9, z, STONE);
}

// LINTELS connecting outer stones (double-high)
for (let i = 0; i < 24; i++) {
  const a1 = (i / 24) * Math.PI * 2;
  const a2 = ((i + 1) / 24) * Math.PI * 2;
  const x1 = Math.round(outerRadius * Math.cos(a1));
  const z1 = Math.round(outerRadius * Math.sin(a1));
  const x2 = Math.round(outerRadius * Math.cos(a2));
  const z2 = Math.round(outerRadius * Math.sin(a2));
  
  line(x1, 8, z1, x2, 8, z2, COBBLE);
  line(x1, 9, z1, x2, 9, z2, COBBLE);
}

// BLUESTONES inner circle - 16 smaller stones
const innerRadius = 6;
for (let i = 0; i < 16; i++) {
  const angle = (i / 16) * Math.PI * 2;
  const x = Math.round(innerRadius * Math.cos(angle));
  const z = Math.round(innerRadius * Math.sin(angle));
  cube(x, 1, z, x, 4, z, STONE);
}

// SECONDARY inner ring for depth
const midRadius = 3;
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const x = Math.round(midRadius * Math.cos(angle));
  const z = Math.round(midRadius * Math.sin(angle));
  cube(x, 1, z, x, 2, z, STONE);
}

// TRILITHONS - the iconic 3-stone structures arranged in horseshoe
const trilithons = [
  [0, -4, 8, 3],   // Center (tallest, facing camera)
  [-4, -1, 6, 2],  // Left
  [4, -1, 6, 2],   // Right
  [-5, 4, 5, 1],   // Far left
  [5, 4, 5, 1]     // Far right
];

for (const [cx, cz, h, sep] of trilithons) {
  cube(cx - sep, 1, cz, cx - sep, h, cz, STONE);  // Left upright
  cube(cx + sep, 1, cz, cx + sep, h, cz, STONE);  // Right upright
  line(cx - sep, h + 1, cz, cx + sep, h + 1, cz, COBBLE);  // Lintel
}

// CENTRAL ALTAR
cube(-2, 1, 0, 2, 3, 0, COBBLE);
block(0, 4, 0, STONE);

// SCATTERED fallen/partial stones for atmosphere
const scatters = [
  [0, 2, 8],
  [7, 2, -8],
  [-8, 2, -9],
  [-10, 2, 4],
  [9, 1, 6],
  [-9, 2, -7],
  [11, 1, 3],
  [-11, 2, -2],
  [3, 1, 11],
  [-4, 2, -10],
  [6, 1, -10],
  [-6, 1, 10]
];

for (const [x, h, z] of scatters) {
  cube(x, 1, z, x, h, z, STONE);
}
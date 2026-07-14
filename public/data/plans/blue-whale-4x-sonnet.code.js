// blue-whale-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
function interp(t, pts) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const f = (t - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * f;
    }
  }
  return pts[pts.length - 1][1];
}

const widthPts = [[0,0.5],[0.05,0.72],[0.15,0.95],[0.3,1.0],[0.55,0.82],[0.75,0.5],[0.9,0.25],[1.0,0.12]];
const heightPts = [[0,0.45],[0.05,0.62],[0.15,0.82],[0.3,0.88],[0.55,0.7],[0.75,0.4],[0.9,0.2],[1.0,0.1]];

const RX_MAX = 6, RY_MAX = 4.6;
const Z_MIN = -14, Z_MAX = 19;
const LEN = Z_MAX - Z_MIN;

function centerY(t) { return 1 + 21 * Math.pow(1 - t, 1.4); }

for (let z = Z_MIN; z <= Z_MAX; z++) {
  const t = (z - Z_MIN) / LEN;
  const cy = centerY(t);
  const rx = RX_MAX * interp(t, widthPts);
  const ry = RY_MAX * interp(t, heightPts);
  const xr = Math.ceil(rx), yr = Math.ceil(ry);
  for (let x = -xr; x <= xr; x++) {
    for (let dy = -yr; dy <= yr; dy++) {
      const y = Math.round(cy) + dy;
      const nx = x / rx, ny = dy / ry;
      if (nx * nx + ny * ny <= 1) {
        const belly = dy < -0.25 * ry;
        let color = belly ? SNOW : ICE;
        if (!belly && (x + z) % 9 === 0 && dy > ry * 0.3) color = SNOW;
        block(x, y, z, color);
      }
    }
  }
}

{
  const t = 0.04;
  const cy = Math.round(centerY(t));
  block(2, cy, Z_MIN + 1, COBBLE);
  block(-2, cy, Z_MIN + 1, COBBLE);
}

for (let z = Z_MIN; z <= Z_MIN + 6; z++) {
  const t = (z - Z_MIN) / LEN;
  const cy = centerY(t);
  const ry = RY_MAX * interp(t, heightPts);
  const yLine = Math.round(cy - ry * 0.85);
  for (let x = -3; x <= 3; x++) block(x, yLine, z, AIR);
}

for (let z = Z_MIN + 2; z <= Z_MIN + 12; z += 1) {
  const t = (z - Z_MIN) / LEN;
  const cy = centerY(t);
  const ry = RY_MAX * interp(t, heightPts);
  const yLine = Math.round(cy - ry * 0.6);
  for (let x = -4; x <= 4; x += 2) block(x, yLine, z, AIR);
}

function pecFin(sign) {
  const t = 0.24;
  const cy = centerY(t);
  const rx = RX_MAX * interp(t, widthPts);
  const ry = RY_MAX * interp(t, heightPts);
  const rootX = sign * Math.round(rx - 1);
  const rootY = Math.round(cy - ry * 0.5);
  const rootZ = Math.round(Z_MIN + t * LEN);
  for (let i = 0; i < 6; i++) {
    const width = Math.max(1, 3 - Math.floor(i * 0.6));
    const x = rootX + sign * i * 2;
    const x2 = x + sign;
    const y = rootY - Math.round(i * 0.8);
    const z = rootZ + Math.round(i * 1.0);
    cube(Math.min(x, x2), y, z - width, Math.max(x, x2), y, z + width, ICE);
  }
}
pecFin(1);
pecFin(-1);

{
  const t = 0.75;
  const cy = centerY(t);
  const ry = RY_MAX * interp(t, heightPts);
  const backZ = Math.round(Z_MIN + t * LEN);
  const topY = Math.round(cy + ry);
  cube(-1, topY, backZ - 1, 1, topY, backZ + 1, ICE);
  cube(-1, topY + 1, backZ, 0, topY + 1, backZ + 1, ICE);
  block(0, topY + 2, backZ + 1, ICE);
}

{
  const t = 0.88;
  const cy = centerY(t);
  const ry = RY_MAX * interp(t, heightPts);
  const z0 = Math.round(Z_MIN + t * LEN);
  for (let i = 0; i < 3; i++) {
    block(0, Math.round(cy + ry) + 1, z0 + i, STONE);
  }
}

{
  const flukeZ0 = Z_MAX + 1, flukeZ1 = Z_MAX + 3;
  const flukeY = 1;
  for (let z = flukeZ0; z <= flukeZ1; z++) {
    const span = 7 - (z - flukeZ0) * 2;
    for (let x = -span; x <= span; x++) {
      const edge = Math.abs(x) > span - 1;
      block(x, flukeY, z, edge ? SNOW : ICE);
    }
  }
  for (let z = flukeZ0; z <= flukeZ1; z++) block(0, flukeY, z, AIR);
  block(1, flukeY, flukeZ1, AIR);
  block(-1, flukeY, flukeZ1, AIR);
}

disk(0, 0, 5, 16, GLASS);

const splashSpots = [
  [6, 1, 16], [-6, 1, 15], [8, 1, 19], [-7, 1, 20],
  [3, 2, 21], [-3, 2, 20], [10, 1, 12], [-9, 1, 13]
];
for (const [sx, sy, sz] of splashSpots) sphere(sx, sy, sz, 1, SNOW);

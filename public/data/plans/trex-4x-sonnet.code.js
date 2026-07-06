// trex-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
const SKIN = LEAVES;
const SKIN_DARK = COBBLE;
const BELLY = DIRT;
const BONE = SNOW;
const MOUTH = BRICK;
const SOCKET = STONE;

function circleZ(cz, cx, cy, r, colorFn) {
  const ri = Math.ceil(r);
  for (let dx = -ri; dx <= ri; dx++) {
    for (let dy = -ri; dy <= ri; dy++) {
      if (dx * dx + dy * dy <= r * r + 0.25) {
        block(cx + dx, cy + dy, cz, colorFn(dx, dy, r));
      }
    }
  }
}

function circleY(cy, cx, cz, r, colorFn) {
  const ri = Math.ceil(r);
  for (let dx = -ri; dx <= ri; dx++) {
    for (let dz = -ri; dz <= ri; dz++) {
      if (dx * dx + dz * dz <= r * r + 0.25) {
        block(cx + dx, cy, cz + dz, colorFn(dx, dz, r));
      }
    }
  }
}

function spineColor(dx, dy, r, z) {
  if (dy > r * 0.55) return SKIN_DARK;
  if (dy < -r * 0.35) return BELLY;
  if (Math.floor(z / 3) % 2 === 0 && Math.abs(dx) < r * 0.28) return SKIN_DARK;
  return SKIN;
}

// ---- Tail + torso + neck spine (tube along Z) ----
const spineKeys = [
  [-21, 4, 0.6],
  [-16, 5, 1.6],
  [-11, 7, 2.4],
  [-6, 9, 3.0],
  [-2, 11, 3.6],
  [2, 12, 4.2],
  [6, 14, 4.0],
  [9, 15.5, 3.4],
  [12, 17, 2.4],
  [15, 18.5, 1.8],
];

for (let k = 0; k < spineKeys.length - 1; k++) {
  const [z0, y0, r0] = spineKeys[k];
  const [z1, y1, r1] = spineKeys[k + 1];
  for (let z = z0; z <= z1; z++) {
    const t = (z - z0) / (z1 - z0);
    const y = y0 + (y1 - y0) * t;
    const r = r0 + (r1 - r0) * t;
    circleZ(z, 0, Math.round(y), r, (dx, dy, rr) => spineColor(dx, dy, rr, z));
  }
}

// back ridge spikes along spine top
for (let z = -19; z <= 13; z += 2) {
  const key = spineKeys.find((k, i) => i < spineKeys.length - 1 && z >= k[0] && z <= spineKeys[i + 1][0]);
  let topY = 8;
  for (let k = 0; k < spineKeys.length - 1; k++) {
    const [z0, y0, r0] = spineKeys[k];
    const [z1, y1, r1] = spineKeys[k + 1];
    if (z >= z0 && z <= z1) {
      const t = (z - z0) / (z1 - z0);
      topY = Math.round(y0 + (y1 - y0) * t + (r0 + (r1 - r0) * t) * 0.55);
    }
  }
  block(0, topY + 1, z, SKIN_DARK);
  block(0, topY + 2, z, BONE);
}

// ---- Head ----
// cranium
cube(-2, 17, 15, 2, 21, 17, SKIN_DARK);
cube(-2, 16, 17, 2, 20, 19, SKIN);
hollowCube(-2, 16, 17, 2, 20, 19, SKIN_DARK);
cube(-2, 16, 19, 2, 19, 20, SKIN);
cube(-1, 16, 20, 1, 18, 22, SKIN);
cube(-1, 16, 22, 1, 17, 22, SKIN);

// brow horns
line(-2, 20, 16, -2, 22, 15, BONE);
line(2, 20, 16, 2, 22, 15, BONE);

// eye sockets + eyes
block(-2, 19, 17, SOCKET);
block(2, 19, 17, SOCKET);
block(-2, 19, 18, MOUTH);
block(2, 19, 18, MOUTH);

// upper jaw teeth (along snout underside)
for (let z = 17; z <= 21; z++) {
  const w = z <= 19 ? 2 : 1;
  block(-w, 15, z, BONE);
  block(w, 15, z, BONE);
  if (z % 2 === 0) block(0, 15, z, BONE);
}

// lower jaw (open mouth)
cube(-1, 12, 16, 1, 13, 21, SKIN);
cube(-1, 13, 21, 1, 13, 22, SKIN);
hollowCube(-1, 12, 16, 1, 13, 21, SKIN_DARK);
cube(-1, 14, 17, 1, 14, 20, MOUTH); // mouth interior
for (let z = 17; z <= 20; z++) {
  block(-1, 14, z, BONE);
  block(1, 14, z, BONE);
}

// ---- Legs ----
function buildLeg(sideX) {
  const legKeys = [
    [11, sideX * 3.0, 1.0, 2.4],
    [8, sideX * 3.3, 2.3, 2.1],
    [5, sideX * 3.4, 1.6, 1.6],
    [2, sideX * 3.4, 0.6, 1.2],
  ];
  for (let k = 0; k < legKeys.length - 1; k++) {
    const [y0, x0, z0, r0] = legKeys[k];
    const [y1, x1, z1, r1] = legKeys[k + 1];
    for (let y = y0; y >= y1; y--) {
      const t = (y0 - y) / (y0 - y1);
      const x = x0 + (x1 - x0) * t;
      const z = z0 + (z1 - z0) * t;
      const r = r0 + (r1 - r0) * t;
      circleY(y, Math.round(x), Math.round(z), r, (dx, dz, rr) => {
        if (dz < -rr * 0.3) return BELLY;
        if (dx * sideX > rr * 0.5) return SKIN_DARK;
        return SKIN;
      });
    }
  }
  // foot
  const fx = Math.round(sideX * 3.4);
  cube(fx - 2, 0, -1, fx + 2, 1, 3, SKIN);
  hollowCube(fx - 2, 0, -1, fx + 2, 0, 3, SKIN_DARK);
  // toes + claws
  for (let t = -1; t <= 1; t++) {
    line(fx + t, 0, 3, fx + t, 0, 4, SKIN);
    block(fx + t, 0, 5, BONE);
  }
  block(fx, 0, -2, BONE); // heel spur
}
buildLeg(1);
buildLeg(-1);

// ---- Arms (small, folded) ----
function buildArm(sideX) {
  const bx = sideX * 4;
  cube(bx, 13, 5, bx + sideX, 14, 6, SKIN);
  cube(bx + sideX, 12, 6, bx + sideX * 2, 13, 7, SKIN);
  block(bx + sideX * 2, 11, 7, BONE);
  block(bx + sideX * 2, 11, 8, BONE);
  block(bx + sideX * 2 - sideX, 11, 8, BONE);
}
buildArm(1);
buildArm(-1);

// ---- Ground detail: broken log + rocks near the tail ----
line(-6, 0, -19, -3, 1, -21, OAK_LOG);
block(-6, 0, -18, OAK_LOG);
sphere(6, 0, -15, 1, COBBLE);
sphere(-8, 0, -8, 1, STONE);
block(9, 0, -12, STONE);
block(-9, 0, -6, COBBLE);

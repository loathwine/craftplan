// jack-o-lantern-4x-opus — prompt:
// a jack-o'-lantern...

const meta = undefined; // (ignored — sandbox build)

// ---- Jack-o'-lantern ----------------------------------------------
// Big ridged pumpkin, glowing carved face toward NORTH (-Z),
// twisty stem, vines, and a patch of smaller pumpkins + fallen leaves.

const cx = 0, cy = 9, cz = 6;      // center of the big pumpkin
const R = 11, V = 8;               // horizontal radius / vertical half-height
const LOBES = 8, AMP = 1.25;       // pumpkin ridges

// --- face mask (fx = x-cx, fy = y-cy), front-facing glow ------------
function faceGlow(fx, fy) {
  // eyes: downward-pointing triangles, flat top
  for (const ex of [-4.5, 4.5]) {
    if (fy >= 1 && fy <= 4) {
      const hw = 2.6 * (fy - 1) / 3;           // 0 at bottom apex, wide on top
      if (Math.abs(fx - ex) <= hw) return true;
    }
  }
  // nose: small upward triangle
  if (fy >= -1 && fy <= 1) {
    const hw = 1.4 * (1 - fy) / 2;
    if (Math.abs(fx) <= hw) return true;
  }
  // grin: curved band (corners up), with zig-zag teeth
  if (Math.abs(fx) <= 7) {
    const cl = -4 + 0.06 * fx * fx;             // smile centerline
    if (fy >= cl - 1 && fy <= cl + 1) {
      const t = (Math.round(fx) + 7) % 4;
      if (t === 0 && fy > cl) return false;     // top tooth notch
      if (t === 2 && fy < cl) return false;     // bottom tooth notch
      return true;
    }
  }
  return false;
}

// --- big pumpkin shell ---------------------------------------------
for (let x = -14; x <= 14; x++) {
  for (let y = 0; y <= 20; y++) {
    for (let z = -14; z <= 14; z++) {
      const px = x, py = cy + (y - cy), pz = cz + z; // absolute
      const fx = x, fy = y - cy, fz = z;             // relative to center
      const rho = Math.sqrt(fx * fx + fz * fz);
      const theta = Math.atan2(fz, fx);
      const Reff = R + AMP * Math.cos(LOBES * theta);
      const dOut = (rho / Reff) ** 2 + (fy / V) ** 2;
      const dIn = (rho / (Reff - 2.4)) ** 2 + (fy / (V - 2.2)) ** 2;
      if (dOut <= 1.0 && dIn >= 1.0) {
        const front = fz <= -2.5;
        if (front && faceGlow(fx, fy)) {
          block(cx + fx, y, cz + fz, SAND);        // glowing carved face
        } else {
          block(cx + fx, y, cz + fz, BRICK);       // pumpkin flesh
        }
      }
    }
  }
}

// carve the face openings slightly deeper so the glow reads as recessed
for (let x = -8; x <= 8; x++) {
  for (let y = 3; y <= 15; y++) {
    if (faceGlow(x, y - cy)) {
      // hollow one layer behind the glow face
      block(cx + x, y, cz - 5, AIR);
      block(cx + x, y, cz - 6, AIR);
    }
  }
}

// --- twisty stem ---------------------------------------------------
cylinder(cx, 16, cz + 1, 2, 3, OAK_LOG);
block(cx, 19, cz + 1, OAK_LOG);
block(cx + 1, 20, cz + 1, OAK_LOG);
block(cx + 1, 21, cz, OAK_LOG);
block(cx + 2, 21, cz, OAK_LOG);
block(cx, 20, cz, OAK_LOG);
// leafy sprig at the stem base
for (const [lx, ly, lz] of [[-2, 17, cz], [2, 17, cz + 2], [0, 18, cz + 3], [-2, 18, cz + 1]]) {
  block(lx, ly, lz, LEAVES);
}

// --- trailing vines over the ground --------------------------------
function vine(x0, z0, x1, z1) {
  line(x0, 0, z0, x1, 0, z1, OAK_LOG);
}
vine(cx - 9, cz + 6, cx - 15, cz + 12);
vine(cx + 9, cz + 6, cx + 14, cz + 13);
vine(cx - 3, cz + 12, cx - 6, cz + 18);
for (const [vx, vz] of [[-15, cz + 12], [14, cz + 13], [-6, cz + 18], [-12, cz + 15], [11, cz + 16]]) {
  block(vx, 1, vz, LEAVES);
}

// --- smaller pumpkins around the base ------------------------------
function miniPumpkin(ox, oz, r, faceFront) {
  const vv = r - 0.5;
  for (let x = -r - 1; x <= r + 1; x++) {
    for (let y = 0; y <= 2 * r; y++) {
      for (let z = -r - 1; z <= r + 1; z++) {
        const theta = Math.atan2(z, x);
        const Reff = r + 0.5 * Math.cos(6 * theta);
        const rho = Math.sqrt(x * x + z * z);
        const d = (rho / Reff) ** 2 + ((y - r) / vv) ** 2;
        if (d <= 1.0) {
          let b = BRICK;
          if (faceFront && z <= -r + 1 && y >= r - 1 && y <= r &&
              (x === -1 || x === 1)) b = SAND;   // tiny eyes
          block(ox + x, y, oz + z, b);
        }
      }
    }
  }
  block(ox, 2 * r, oz, OAK_LOG); // stem
}

miniPumpkin(-14, cz - 3, 3, true);
miniPumpkin(13, cz - 1, 3, true);
miniPumpkin(-10, cz + 11, 2, false);
miniPumpkin(9, cz + 12, 2, true);
miniPumpkin(-17, cz + 6, 2, false);

// --- fallen leaves scattered on the ground -------------------------
const scatter = [
  [-6, 0], [-8, 4], [5, 3], [8, 8], [-3, 9], [3, 12], [-12, 2],
  [11, 4], [-15, 8], [15, 6], [-2, 14], [6, 15], [-9, 15], [12, 10],
  [0, 16], [-5, 5], [7, 1], [-11, 8], [10, -2], [-4, -3],
];
for (const [sx, sz] of scatter) {
  block(sx, 0, cz + sz, LEAVES);
}
// fighter-jet-4x-opus — prompt:
// a fighter jet...

const cx = 0;
const cy = 12; // fuselage centerline height (jet flies above ground)

// ---- fuselage cross-section keyframes: [z, halfWidthX, halfHeightY] ----
const KF = [
  [-20, 0.5, 0.5],
  [-18, 1.1, 1.0],
  [-14, 1.9, 1.7],
  [-10, 2.6, 2.3],
  [-6,  3.1, 2.7],
  [0,   3.3, 2.9],
  [6,   3.0, 2.6],
  [10,  2.6, 2.4],
  [14,  2.2, 2.2],
  [16,  2.0, 2.0],
];
function profile(z) {
  if (z <= KF[0][0]) return [KF[0][1], KF[0][2]];
  if (z >= KF[KF.length - 1][0]) return [KF[KF.length-1][1], KF[KF.length-1][2]];
  for (let i = 0; i < KF.length - 1; i++) {
    if (z >= KF[i][0] && z <= KF[i+1][0]) {
      const t = (z - KF[i][0]) / (KF[i+1][0] - KF[i][0]);
      return [
        KF[i][1] + t * (KF[i+1][1] - KF[i][1]),
        KF[i][2] + t * (KF[i+1][2] - KF[i][2]),
      ];
    }
  }
  return [1, 1];
}

// ---- solid rounded fuselage (grey metal) ----
for (let z = -20; z <= 16; z++) {
  const [rx, ry] = profile(z);
  const RX = Math.ceil(rx), RY = Math.ceil(ry);
  for (let dx = -RX; dx <= RX; dx++) {
    for (let dy = -RY; dy <= RY; dy++) {
      const e = (dx*dx)/(rx*rx + 0.15) + (dy*dy)/(ry*ry + 0.15);
      if (e <= 1) {
        // darker panel bands + belly keel for surface detail
        let id = STONE;
        if (dy <= -RY + 0) id = COBBLE;               // belly keel line
        else if ((z % 6 === 0) && dy >= RY - 1) id = COBBLE; // spine panel lines
        block(cx + dx, cy + dy, z, id);
      }
    }
  }
}

// ---- pointed nose radome + pitot ----
for (let z = -22; z <= -17; z++) {
  const r = z < -20 ? 0 : 1;
  if (z >= -21) sphere(cx, cy, z, r, COBBLE);
  else block(cx, cy, z, COBBLE);
}
block(cx, cy, -22, STONE);

// ---- air intakes (dark boxes on lower sides, front-facing openings) ----
for (let s of [-1, 1]) {
  cube(cx + s*4, cy - 2, -8, cx + s*4, cy, -1, COBBLE);
  cube(cx + s*3, cy - 2, -9, cx + s*3, cy, -9, AIR); // inlet mouth (dark)
  cube(cx + s*4, cy - 2, -9, cx + s*4, cy, -9, COBBLE);
}

// ---- glass cockpit canopy (raised bubble on top-front) ----
for (let z = -13; z <= -3; z++) {
  const t = (z + 13) / 10;              // 0..1
  const hw = 1 + Math.round(1.7 * Math.sin(Math.PI * t));
  const ht = 1 + Math.round(2.2 * Math.sin(Math.PI * t));
  for (let dx = -hw; dx <= hw; dx++) {
    for (let dy = 0; dy <= ht; dy++) {
      if ((dx*dx)/(hw*hw + 0.4) + (dy*dy)/(ht*ht + 0.4) <= 1) {
        block(cx + dx, cy + 2 + dy, z, GLASS);
      }
    }
  }
}
// canopy front frame
line(cx - 2, cy + 2, -13, cx + 2, cy + 2, -13, COBBLE);

// ---- swept delta wings ----
for (let x = 3; x <= 19; x++) {
  const t = (x - 3) / 16;
  const zLead = Math.round(-2 + t * 13);   // leading edge sweeps back
  const zTrail = Math.round(13 - t * 3);   // trailing edge
  for (let z = zLead; z <= zTrail; z++) {
    for (let s of [1, -1]) {
      const id = (z === zLead) ? COBBLE : STONE; // dark leading edge
      block(cx + s*x, cy - 1, z, id);
      if (x < 12) block(cx + s*x, cy, z, STONE); // thicker wing root
    }
  }
  // wingtip winglets
  if (x >= 18) {
    for (let s of [1, -1]) {
      const ztip = Math.round(-2 + t * 13);
      block(cx + s*x, cy, ztip + 1, STONE);
      block(cx + s*x, cy + 1, ztip + 1, COBBLE);
    }
  }
}

// ---- underwing missiles / weapon pods ----
for (let s of [1, -1]) {
  for (let xoff of [8, 13]) {
    line(cx + s*xoff, cy - 2, -6, cx + s*xoff, cy - 2, 3, STONE);
    block(cx + s*xoff, cy - 2, -7, BRICK);   // missile nose
    block(cx + s*xoff, cy - 2, 4, COBBLE);   // fin
  }
}

// ---- horizontal stabilizers (tailplane) ----
for (let x = 2; x <= 10; x++) {
  const t = (x - 2) / 8;
  const zLead = Math.round(9 + t * 5);
  const zTrail = Math.round(16 - t * 1);
  for (let z = zLead; z <= zTrail; z++) {
    for (let s of [1, -1]) {
      block(cx + s*x, cy - 1, z, (z === zLead) ? COBBLE : STONE);
    }
  }
}

// ---- twin canted vertical tail fins ----
function fin(sx) {
  for (let z = 8; z <= 16; z++) {
    let top;
    if (z <= 10) top = cy + 1 + (z - 8) * 3.0;   // rises toward front
    else top = cy + 7 - (z - 10) * 0.8;          // swept-back trailing edge
    top = Math.round(top);
    for (let y = cy + 1; y <= top; y++) {
      const id = (y === top || z === 8) ? COBBLE : STONE;
      block(cx + sx, y, z, id);
    }
  }
}
fin(2);
fin(-2);

// ---- engine nozzles + afterburner flame at tail ----
for (let z = 16; z <= 17; z++) hollowSphere(cx, cy, z, 2, COBBLE);
for (let z = 18; z <= 21; z++) {
  const r = Math.max(0, 2 - (z - 18) * 0.6);
  sphere(cx, cy, z, Math.round(r) + 0.5, BRICK);     // outer flame
  if (z <= 19) sphere(cx, cy, z, Math.max(0, Math.round(r) - 1) + 0.4, SAND); // hot core
}

// ---- national insignia / markings (white) ----
block(cx, cy + 3, -6, SNOW);
block(cx, cy + 3, 2, SNOW);
for (let s of [1, -1]) {
  block(cx + s*7, cy - 1, 4, SNOW);   // roundel on wings
  block(cx + s*8, cy - 1, 5, SNOW);
}
// fuselage stripe
line(cx - 3, cy, 8, cx + 3, cy, 8, SNOW);
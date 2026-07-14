// christ-redeemer-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function lerp(a, b, t) { return a + (b - a) * t; }

// ============ PLINTH (stepped Corcovado-style base) ============
cube(-6, -2, -6, 6, -2, 6, STONE);
hollowCube(-6, -2, -6, 6, -2, 6, COBBLE);
cube(-5, -1, -5, 5, -1, 5, STONE);
hollowCube(-5, -1, -5, 5, -1, 5, COBBLE);
cube(-4, 0, -4, 4, 1, 4, STONE);
hollowCube(-4, 0, -4, 4, 1, 4, COBBLE);
cube(-3, 2, -3, 3, 3, 3, STONE);
hollowCube(-3, 2, -3, 3, 3, 3, COBBLE);

// small chapel door, front face (-Z)
cube(-1, 0, -4, 1, 1, -4, AIR);
line(-1, 0, -4, -1, 1, -4, BRICK);
line(1, 0, -4, 1, 1, -4, BRICK);
line(-1, 1, -4, 1, 1, -4, BRICK);

// foreground boulder outcrops flanking base
sphere(-8, -2, -3, 2, COBBLE);
sphere(8, -2, 2, 2, STONE);
sphere(-7, -2, 5, 1, COBBLE);
sphere(7, -2, -6, 1, STONE);

// ============ ROBE (tapered cloak, asymmetric cape flare) ============
const ROBE_BOTTOM = 4, ROBE_TOP = 21;
for (let y = ROBE_BOTTOM; y <= ROBE_TOP; y++) {
  const t = (y - ROBE_BOTTOM) / (ROBE_TOP - ROBE_BOTTOM);
  const r = lerp(5.2, 2.5, t);
  const ri = Math.ceil(r * 1.2);
  for (let x = -ri; x <= ri; x++) {
    for (let z = -ri; z <= ri; z++) {
      const flare = z >= 0 ? 1.15 : 0.88; // cape flares back, cinches front
      const rr = r * flare;
      if (x * x + z * z <= rr * rr) {
        const angle = Math.atan2(z, x);
        const sector = Math.floor((angle + Math.PI) / (Math.PI / 10)) % 2;
        let id = sector === 0 ? STONE : COBBLE;
        block(x, y, z, id);
      }
    }
  }
}

// belt / sash ring
for (let x = -3; x <= 3; x++) {
  for (let z = -3; z <= 3; z++) {
    if (x * x + z * z <= 9) block(x, 12, z, BRICK);
  }
}
// sash fringe dangling at front
line(-1, 11, -3, -1, 10, -3, BRICK);
line(0, 11, -3, 0, 10, -3, BRICK);
line(1, 11, -3, 1, 10, -3, BRICK);

// drapery fold grooves (shallow carved shadow lines)
for (let k = 0; k < 8; k++) {
  const a = (k / 8) * Math.PI * 2;
  const gx = Math.round(Math.cos(a) * 3);
  const gz = Math.round(Math.sin(a) * 3);
  for (let y = 5; y <= 19; y += 3) block(gx, y, gz, AIR);
}

// ============ NECK ============
for (let y = 22; y <= 24; y++) {
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (x * x + z * z <= 2.2 * 2.2) block(x, y, z, STONE);
    }
  }
}

// ============ HEAD ============
const HEAD_CY = 27, HEAD_R = 3;
for (let y = HEAD_CY - HEAD_R; y <= HEAD_CY + HEAD_R; y++) {
  const dy = y - HEAD_CY;
  for (let x = -HEAD_R; x <= HEAD_R; x++) {
    for (let z = -HEAD_R; z <= HEAD_R; z++) {
      if (x * x + dy * dy + z * z <= HEAD_R * HEAD_R) {
        let id = STONE;
        if (dy >= 1 && z >= -1) id = COBBLE; // hair cap, top/back
        block(x, y, z, id);
      }
    }
  }
}
// nose bump
block(0, 27, -4, STONE);
block(0, 26, -4, STONE);
// eyes (carved sockets)
block(-1, 27, -2, AIR);
block(1, 27, -2, AIR);
// mouth
block(-1, 25, -2, AIR);
block(0, 25, -2, AIR);
block(1, 25, -2, AIR);
// brow ridge
line(-2, 28, -2, 2, 28, -2, COBBLE);

// ============ ARMS (outstretched cross silhouette) ============
function buildArm(sign) {
  const L = 15;
  const shoulderX = sign * 3;
  const shoulderY = 20;
  for (let i = 0; i <= L; i++) {
    const t = i / L;
    let r = lerp(2.1, 1.0, t);
    if (t > 0.85) r = lerp(1.0, 1.6, (t - 0.85) / 0.15); // flare at hand
    const x = shoulderX + sign * i;
    const yC = Math.round(shoulderY - t * 5);
    const zC = Math.round(-1 - t * 1.8); // lean forward toward camera
    const ri = Math.ceil(r);
    for (let dy = -ri; dy <= ri; dy++) {
      for (let dz = -ri; dz <= ri; dz++) {
        if (dy * dy + dz * dz <= r * r) {
          const id = (i % 4 < 2) ? STONE : COBBLE;
          block(x, yC + dy, zC + dz, id);
        }
      }
    }
    if (i === L) {
      // hand
      cube(x, yC - 1, zC - 1, x, yC + 1, zC + 1, STONE);
      for (let f = -1; f <= 1; f++) {
        line(x, yC, zC + f, x + sign * 2, yC, zC + f, STONE);
      }
    }
  }
}
buildArm(-1);
buildArm(1);

// sleeve cuffs
for (const sign of [-1, 1]) {
  const cx = sign * 15;
  for (let z = -2; z <= 2; z++) {
    block(cx, 15 + Math.round(-1 - (15 / 15) * 1.8) + 2, z, BRICK);
  }
}
```

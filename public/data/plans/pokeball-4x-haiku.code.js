// pokeball-4x-haiku — prompt:
// a giant Poké Ball...

const cx = 0, cy = 7, cz = 0;
const r = 11;

// Red top hemisphere
sphere(cx, cy, cz, r, BRICK);

// White bottom hemisphere
for (let x = -r - 1; x <= r + 1; x++) {
  for (let y = cy - r - 1; y <= cy - 1; y++) {
    for (let z = -r - 1; z <= r + 1; z++) {
      const dist = Math.sqrt(x*x + (y - cy)*(y - cy) + z*z);
      if (dist <= r) {
        block(cx + x, y, cz + z, SNOW);
      }
    }
  }
}

// Thick black equatorial band (5 blocks tall)
for (let x = -r - 2; x <= r + 2; x++) {
  for (let z = -r - 2; z <= r + 2; z++) {
    const rdist = Math.sqrt(x*x + z*z);
    if (rdist >= r - 2.5 && rdist <= r + 0.5) {
      block(cx + x, cy - 2, cz + z, COBBLE);
      block(cx + x, cy - 1, cz + z, COBBLE);
      block(cx + x, cy, cz + z, COBBLE);
      block(cx + x, cy + 1, cz + z, COBBLE);
      block(cx + x, cy + 2, cz + z, COBBLE);
    }
  }
}

// White button/circle on top
sphere(cx, cy + r - 4, cz, 3, SNOW);

// Dark center dot
sphere(cx, cy + r - 2, cz, 1, COBBLE);

// Decorative ridge/rim around button
for (let i = 0; i < 20; i++) {
  const angle = (i / 20) * Math.PI * 2;
  const bx = Math.round(5.5 * Math.cos(angle));
  const bz = Math.round(5.5 * Math.sin(angle));
  block(cx + bx, cy + r, cz + bz, BRICK);
  block(cx + bx, cy + r + 1, cz + bz, BRICK);
}

// Structural ridges - 8 vertical lines for depth
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const rvx = Math.round(r * Math.cos(angle));
  const rvz = Math.round(r * Math.sin(angle));
  
  for (let y = -r; y <= r; y++) {
    if (Math.sqrt(rvx*rvx + y*y + rvz*rvz) <= r + 0.5) {
      block(cx + rvx, cy + y, cz + rvz, STONE);
    }
  }
}

// Highlight band on lower white half for dimension
for (let x = -r; x <= r; x++) {
  for (let z = -r; z <= r; z++) {
    for (let y = cy - r + 2; y < cy - 3; y++) {
      const dist = Math.sqrt(x*x + (y - cy)*(y - cy) + z*z);
      if (Math.abs(dist - r) < 1.5 && z > 0) {
        block(cx + x, y, cz + z, GLASS);
      }
    }
  }
}

// Small accent details on red half
for (let x = -r; x <= r; x++) {
  for (let z = -r; z <= r; z++) {
    for (let y = cy + 2; y < cy + r - 2; y++) {
      const dist = Math.sqrt(x*x + (y - cy)*(y - cy) + z*z);
      if (Math.abs(dist - r) < 1 && x > 0) {
        block(cx + x, y, cz + z, STONE);
      }
    }
  }
}

// Base - foundation disks for stability and visual grounding
disk(cx, cy - r - 2, cz, r + 2, COBBLE);
disk(cx, cy - r - 3, cz, r + 1, STONE);
// octopus-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
const BODY = BRICK;
const DARK = COBBLE;
const SHADE = STONE;

function lerp(a, b, t) { return a + (b - a) * t; }

// ---- Mantle (bulbous head/body) ----
const mantle = { x: 0, y: 14, z: 2 };
const mRx = 7, mRy = 6.5, mRz = 6.5;
for (let x = -Math.ceil(mRx); x <= Math.ceil(mRx); x++) {
  for (let y = -Math.ceil(mRy); y <= Math.ceil(mRy); y++) {
    for (let z = -Math.ceil(mRz); z <= Math.ceil(mRz); z++) {
      const d = Math.sqrt((x / mRx) ** 2 + (y / mRy) ** 2 + (z / mRz) ** 2);
      if (d <= 1) {
        let id = BODY;
        if (d > 0.88 && Math.random() < 0.22) id = DARK;
        if (y < -0.15 * mRy && d > 0.55 && Math.random() < 0.15) id = SHADE;
        block(mantle.x + x, mantle.y + y, mantle.z + z, id);
      }
    }
  }
}

// ---- Eyes ----
function eye(ex, ey, ez) {
  sphere(ex, ey, ez, 1.6, SNOW);
  sphere(ex, ey, ez - 1.1, 0.9, SHADE);
}
eye(-3, 15, -3);
eye(3, 15, -3);

// eyelid ridges
hollowCube(-4, 16, -3, -2, 16, -2, DARK);
hollowCube(2, 16, -3, 4, 16, -2, DARK);

// ---- Beak ----
cube(-1, 6, 1, 1, 7, 3, SHADE);
block(0, 6, 0, SHADE);

// ---- Horns above eyes ----
function horn(hx, hy, hz, dir) {
  for (let i = 0; i < 4; i++) {
    sphere(hx + dir * i * 0.4, hy + i, hz - i * 0.5, 1.2 - i * 0.25, DARK);
  }
}
horn(-3, 19, -2, -1);
horn(3, 19, -2, 1);

// ---- Siphon (side funnel) ----
for (let i = 0; i < 3; i++) {
  sphere(8 + i, 10 - i, 4, 1.3 - i * 0.3, SHADE);
}

// ---- Tentacles ----
const baseCenter = { x: 0, y: 7, z: 3 };
const attachR = 4;

const tentacles = [
  { angle: -40, length: 22, style: 'raised', baseR: 3.0, tipR: 0.5 },
  { angle: -15, length: 20, style: 'wave', baseR: 2.6, tipR: 0.5 },
  { angle: 15, length: 22, style: 'raised', baseR: 3.0, tipR: 0.5 },
  { angle: 40, length: 20, style: 'wave', baseR: 2.6, tipR: 0.5 },
  { angle: -90, length: 16, style: 'ground', baseR: 2.4, tipR: 0.5 },
  { angle: 90, length: 16, style: 'ground', baseR: 2.4, tipR: 0.5 },
  { angle: -150, length: 12, style: 'back', baseR: 2.0, tipR: 0.5 },
  { angle: 150, length: 12, style: 'back', baseR: 2.0, tipR: 0.5 },
];

for (const T of tentacles) {
  const rad = T.angle * Math.PI / 180;
  const dx = Math.sin(rad), dz = -Math.cos(rad);
  const attach = {
    x: baseCenter.x + dx * attachR,
    y: baseCenter.y - 1,
    z: baseCenter.z + dz * attachR
  };
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const dist = t * T.length;
    let x = attach.x + dx * dist;
    let z = attach.z + dz * dist;
    let y;
    const radius = lerp(T.baseR, T.tipR, t);

    if (T.style === 'raised') {
      const dip = Math.sin(t * Math.PI) * -1.2;
      const rise = Math.pow(t, 1.8) * 17;
      y = attach.y - 4 * t + dip * 0.3 + rise;
      if (t > 0.75) {
        const ct = (t - 0.75) / 0.25;
        const curl = ct * Math.PI * 1.3;
        x += Math.sin(curl) * radius * 2.2 * ct;
        z += (Math.cos(curl) - 1) * radius * 1.6 * ct;
      }
    } else if (T.style === 'wave') {
      y = lerp(attach.y, 0.6, Math.min(1, t * 1.25));
      const wave = Math.sin(t * Math.PI * 2.2) * 2.2 * t;
      x += wave * Math.cos(rad);
      z += wave * Math.sin(rad);
      if (t > 0.85) {
        const ct = (t - 0.85) / 0.15;
        y += ct * ct * 3;
      }
    } else if (T.style === 'ground') {
      y = lerp(attach.y, 0.6, Math.min(1, t * 1.2));
      const wave = Math.sin(t * Math.PI * 1.6) * 1.4 * t;
      x += wave * Math.cos(rad);
      z += wave * Math.sin(rad);
    } else {
      y = lerp(attach.y, 0.6, Math.min(1, t * 1.3));
    }

    const ix = Math.round(x), iy = Math.round(y), iz = Math.round(z);
    sphere(ix, iy, iz, radius, BODY);

    if (i % 3 === 0 && t < 0.9 && radius > 0.9) {
      block(ix, Math.round(iy - radius), iz, DARK);
    }
  }
}

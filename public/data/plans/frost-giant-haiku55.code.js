// frost-giant-haiku55 — prompt:
// a frost giant wielding an ice axe...

// Helpers
const nz = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

function spire(cx, cz, h, r0) {
  for (let y = 0; y < h; y++) {
    const r = Math.max(0, Math.round(r0 * (1 - y / h)));
    if (r === 0) block(cx, y, cz, ICE); else disk(cx, y, cz, r, ICE);
  }
  block(cx, h, cz, SNOW);
}

function pine(cx, cz, h) {
  cube(cx, 0, cz, cx, h - 6, cz, OAK_LOG);
  for (let k = 0; k < 6; k++) {
    const y = h - 6 + k;
    const r = k < 2 ? 3 : k < 4 ? 2 : 1;
    disk(cx, y, cz, r, k >= 4 ? SNOW : LEAVES);
  }
  block(cx, h, cz, SNOW);
}

// ---- Far background: snowy mountain range (z 14..17)
for (let x = -16; x <= 16; x++) {
  for (let z = 14; z <= 17; z++) {
    const h = Math.round(5 + 13 * Math.exp(-(x * x) / 110) + 3 * nz(x * 31 + z * 7));
    cube(x, 0, z, x, h - 3, z, STONE);
    cube(x, h - 2, z, x, h, z, SNOW);
  }
}

// ---- Midground: ice spires and frozen pines (z 4..13)
spire(-13, 6, 14, 3);
spire(14, 8, 16, 3);
spire(-7, 11, 10, 2);
spire(7, 12, 12, 2);
spire(-19, 4, 9, 2);
spire(19, 13, 11, 2);
pine(-18, 10, 15);
pine(-9, 6, 12);
pine(-2, 10, 13);
pine(4, 9, 12);
pine(18, 7, 12);

// ---- Foreground ground: snow drifts and ice chunks
cube(-14, 0, -7, 14, 0, -6, SNOW);
cube(-12, 0, -5, -9, 0, -3, SNOW);
cube(10, 0, -5, 13, 0, -3, SNOW);
cube(-12, 0, -5, -11, 1, -4, ICE);
block(-13, 0, -2, ICE);
block(-14, 1, -1, ICE);
block(15, 0, -4, ICE);

// ---- The frost giant (front = north, z negative)

// Cape (behind body)
cube(-7, 10, 3, 7, 19, 3, SNOW);

// Feet / boots
cube(-6, 0, -3, -2, 2, 1, SNOW);
cube(2, 0, -3, 6, 2, 1, SNOW);

// Legs
cube(-5, 3, -2, -2, 9, 1, LIGHT_BLUE);
cube(2, 3, -2, 5, 9, 1, LIGHT_BLUE);
cube(-6, 3, -2, -6, 6, 1, SNOW);
cube(6, 3, -2, 6, 6, 1, SNOW);
cube(-5, 5, -3, -2, 6, -3, ICE);
cube(2, 5, -3, 5, 6, -3, ICE);

// Hips, loincloth, belt
cube(-6, 9, -2, 6, 10, 1, LIGHT_BLUE);
cube(-4, 8, -3, 4, 10, -3, SNOW);
cube(-6, 11, -3, 6, 11, 2, BROWN);
block(0, 11, -4, GOLD);
block(-1, 11, -4, GOLD);
block(1, 11, -4, GOLD);

// Torso
cube(-6, 12, -2, 6, 19, 2, LIGHT_BLUE);
cube(-6, 19, -2, 6, 19, 2, SNOW);
cube(-4, 13, -3, 4, 18, -3, ICE);
block(0, 15, -4, NEON_BLUE);
cube(-6, 12, -3, 6, 12, -3, SNOW);

// Neck and beard
cube(-2, 20, -1, 2, 20, 1, LIGHT_BLUE);
cube(-3, 19, -4, 3, 20, -4, SNOW);

// Head
cube(-4, 21, -3, 4, 27, 2, LIGHT_BLUE);
cube(-4, 25, -4, -1, 25, -4, ICE);
cube(1, 25, -4, 4, 25, -4, ICE);
block(-2, 24, -4, NEON_BLUE);
block(2, 24, -4, NEON_BLUE);
cube(0, 22, -4, 0, 23, -4, ICE);
cube(-2, 21, -4, 2, 21, -4, BLACK);
block(-3, 21, -4, WHITE);
block(3, 21, -4, WHITE);

// Hair and crown of ice
cube(-4, 28, -3, 4, 28, 2, SNOW);
cube(-5, 24, -2, -5, 27, 1, SNOW);
cube(5, 24, -2, 5, 27, 1, SNOW);
block(-3, 29, -2, ICE);
block(0, 30, -1, ICE);
block(3, 29, -2, ICE);
block(-2, 29, 1, ICE);
block(-1, 29, -3, ICE);

// Left arm (hanging, -X side)
cube(-10, 8, -2, -7, 18, 1, LIGHT_BLUE);
cube(-10, 9, -3, -7, 12, -3, ICE);
cube(-10, 5, -3, -7, 7, 0, LIGHT_BLUE);

// Left pauldron and spikes
cube(-10, 18, -3, -6, 21, 2, SNOW);
block(-8, 22, -1, ICE);
block(-6, 22, 0, ICE);
block(-9, 22, 0, ICE);

// Right shoulder (axe arm, +X side)
cube(7, 17, -2, 8, 21, 1, LIGHT_BLUE);
cube(6, 18, -3, 10, 21, 2, SNOW);
block(6, 22, 0, ICE);
block(8, 22, -1, ICE);

// Right forearm, bracer, gauntlet
cube(9, 22, -2, 12, 25, 1, LIGHT_BLUE);
cube(9, 22, -3, 12, 24, -3, ICE);
cube(10, 26, -3, 13, 27, 0, ICE);

// Ice axe: haft, collar, blade, spikes
line(13, 21, -1, 13, 31, -1, PLANKS);
cube(13, 28, -2, 13, 30, 0, IRON);
cube(14, 28, -1, 16, 31, -1, ICE);
cube(17, 29, -1, 17, 30, -1, ICE);
cube(11, 30, -1, 12, 31, -1, ICE);
block(13, 32, -1, ICE);
block(18, 29, 0, ICE);
block(16, 33, 0, ICE);
block(17, 27, -1, IRON);
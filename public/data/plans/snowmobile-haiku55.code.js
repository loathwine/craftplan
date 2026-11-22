// snowmobile-haiku55 — prompt:
// a snowmobile jumping over a snowdrift...

// Snowmobile leaping a snowdrift, filmed from the north.
// Built in a frame rotated ~34 degrees off the camera axis so the sled's nose and side both read.

const B = 22;
const ANG = -0.6;
const HX = Math.cos(ANG), HZ = Math.sin(ANG);   // forward (sled nose)
const LX = -HZ, LZ = HX;                         // lateral (sled's left)
const UC = 5, VC = 9;                            // sled body centre (u, y)
const PITCH = 0.2;                               // nose-up, radians
const CP = Math.cos(PITCH), SP = Math.sin(PITCH);

const cells = new Map();
const put = (x, y, z, id) => cells.set(x + ',' + y + ',' + z, [x, y, z, id]);
const frac = (a) => a - Math.floor(a);
const rnd = (a, b, c) => frac(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453);
const local = (x, z) => ({ u: x * HX + z * HZ, w: x * LX + z * LZ });
const taper = (w) => Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(w) / 10.5, 2.2)));
const inEnvelope = (u, w) => u >= -11 && u <= 17 && Math.abs(w) <= 11;

// Snow height along the path: take-off kicker, drift hump, landing slope.
function ridge(u) {
  if (u >= -10 && u < -1) return 0.42 * (u + 10);
  if (u >= 1 && u < 6) return 4.6 * Math.sin((Math.PI / 2) * (u - 1) / 5);
  if (u >= 6 && u <= 15) return 4.6 * Math.cos((Math.PI / 2) * (u - 6) / 9);
  return 0;
}
function snowH(u, w) {
  const r = ridge(u);
  if (r <= 0) return 0;
  const lump = r > 0.3 ? 0.5 * Math.sin(w * 0.7 + u * 1.3) * Math.cos(w * 0.37) : 0;
  return Math.max(0, r * taper(w) + lump);
}

// 1. Clear the build envelope (AIR is free) and lay a snowy ground layer.
for (let x = -B; x <= B; x++) for (let z = -B; z <= B; z++) {
  const { u, w } = local(x, z);
  if (!inEnvelope(u, w)) continue;
  for (let y = 0; y <= 15; y++) put(x, y, z, AIR);
  put(x, -1, z, SNOW);
}

// 2. Snowdrift, take-off kicker and landing slope, with wind-crust ICE flecks on top.
for (let x = -B; x <= B; x++) for (let z = -B; z <= B; z++) {
  const { u, w } = local(x, z);
  const h = snowH(u, w);
  const top = Math.ceil(h) - 1;
  for (let y = 0; y < h; y++) {
    put(x, y, z, y === top && rnd(x, y, z) < 0.3 ? ICE : SNOW);
  }
}

// 3. Spray plume kicked up behind the track.
for (let x = -B; x <= B; x++) for (let z = -B; z <= B; z++) for (let y = 0; y <= 12; y++) {
  const { u, w } = local(x, z);
  const du = (u + 3.4) / 3.2, dy = (y - 6.2) / 1.7, dw = w / 2.2;
  if (du * du + dy * dy + dw * dw <= 1 && rnd(x, y, z) < 0.4) put(x, y, z, SNOW);
}

// 4. The snowmobile, in its own pitched frame (pu = along sled, pv = up from body centre).
const SLED = [
  [-5.5, -0.5, -2.4, -1.0, -1.1, 1.1, BLACK],   // track
  [-6.0, -2.0, -1.0, 1.0, -1.1, 1.1, RED],      // rear deck
  [-2.0, 2.5, -1.0, 0.5, -1.1, 1.1, RED],       // tunnel
  [-3.0, -0.5, 0.8, 1.6, -0.9, 0.9, BLACK],     // seat
  [1.5, 2.8, 1.0, 2.6, -0.8, 0.8, GLASS],       // windscreen
  [0.8, 1.9, 1.2, 2.7, -1.3, -0.4, IRON],       // handlebar posts
  [0.8, 1.9, 1.2, 2.7, 0.4, 1.3, IRON],
  [0.6, 1.8, 2.5, 3.1, -1.3, 1.3, IRON],        // handlebar
  [2.5, 5.0, -2.4, -1.5, -1.9, -1.1, IRON],     // skis
  [2.5, 5.0, -2.4, -1.5, 1.1, 1.9, IRON],
  [2.2, 3.4, -1.6, -0.4, -0.6, 0.6, IRON],      // ski strut
  [4.6, 5.4, -0.2, 0.6, -0.6, 0.6, GLOWSTONE],  // headlight
  [-0.2, 2.2, 0.0, 1.1, -0.7, 0.7, BLACK],      // rider legs
  [-1.2, 0.3, 1.6, 3.6, -0.8, 0.8, BLUE],       // rider torso
  [0.4, 1.7, 2.6, 3.2, -1.0, -0.5, BLUE],       // arms
  [0.4, 1.7, 2.6, 3.2, 0.5, 1.0, BLUE],
  [0.2, 0.9, 4.0, 4.6, -0.7, 0.7, BLACK],       // visor
];
for (let x = -B; x <= B; x++) for (let z = -B; z <= B; z++) for (let y = 3; y <= 16; y++) {
  const { u, w } = local(x, z);
  const a = u - UC, b = y - VC;
  const pu = a * CP + b * SP, pv = -a * SP + b * CP;
  let id = null;
  // nose cowl wedge
  if (pu >= 2.5 && pu <= 5.0 && pv >= -1.0 && pv <= 0.9 - 0.35 * (pu - 2.5) && Math.abs(w) <= 1.0) id = RED;
  // helmet
  if (Math.pow(pu + 0.3, 2) + Math.pow(pv - 4.3, 2) + w * w <= 1.0) id = YELLOW;
  for (const [u1, u2, v1, v2, w1, w2, k] of SLED) {
    if (pu >= u1 && pu <= u2 && pv >= v1 && pv <= v2 && w >= w1 && w <= w2) id = k;
  }
  if (id !== null) put(x, y, z, id);
}

// 5. Background: snow hills, then a row of snowy pines behind the jump.
function hill(cx, cz, r) {
  for (let x = cx - r; x <= cx + r; x++) for (let z = cz - r; z <= cz + r; z++) for (let y = 0; y <= r; y++) {
    if (Math.pow(x - cx, 2) + y * y + Math.pow(z - cz, 2) <= r * r) put(x, y, z, rnd(x, y, z) < 0.15 ? ICE : SNOW);
  }
}
function pine(cx, cz, h) {
  for (let y = 0; y < h - 5; y++) put(cx, y, cz, OAK_LOG);
  for (let y = h - 6; y <= h; y++) {
    const r = Math.max(0, 3.2 - (y - (h - 6)) * 0.5);
    for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
      if (dx * dx + dz * dz <= r * r + 0.6) {
        const snowy = y >= h - 2 && rnd(cx + dx, y, cz + dz) < 0.5;
        put(cx + dx, y, cz + dz, snowy ? SNOW : LEAVES);
      }
    }
  }
}
hill(-14, 18, 5);
hill(2, 19, 6);
hill(16, 18, 5);
for (let i = -3; i <= 3; i++) {
  const x = i * 6 + Math.round(rnd(i, 1, 2) * 3 - 1);
  const z = 14 + ((i + 9) % 2) * 2;
  pine(x, z, 9 + Math.floor(rnd(i, 3, 4) * 5));
}
pine(-17, -3, 10);
pine(17, -9, 9);

// 6. Foreground: snow mounds on the near side of the jump.
hill(-11, -12, 3);
hill(-4, -14, 2);
hill(9, -13, 2);
hill(15, -10, 2);

// Emit everything (later writes already overrode earlier ones at the same cell).
for (const [x, y, z, id] of cells.values()) block(x, y, z, id);
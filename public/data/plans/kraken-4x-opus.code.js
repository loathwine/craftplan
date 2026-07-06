// kraken-4x-opus — prompt:
// a kraken...

const meta = { name: 'kraken', description: 'A kraken rising from the sea' };

// ---- palette ----
const BODY = COBBLE;   // mottled sea-monster hide
const SKIN2 = STONE;   // darker underbelly / suckers
const WATER = GLASS;   // ocean surface
const FOAM = SNOW;      // sea foam + eye whites
const BEAK = STONE;     // dark beak
const RIDGE = BRICK;    // angry brow

// ================= OCEAN =================
// churning water surface the beast rises from (thin, patchy, with foam ring)
for (let x = -14; x <= 14; x++) {
  for (let z = -14; z <= 14; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d <= 13) {
      // leave a hole where the body erupts
      if (d > 4) block(x, -1, z, WATER);
      // ripple bumps
      if (((x * 7 + z * 5) % 11 + 11) % 11 === 0 && d > 5 && d < 12) block(x, 0, z, WATER);
    }
  }
}
// foam splash ring around the base
for (let a = 0; a < Math.PI * 2; a += 0.28) {
  const rr = 5 + ((Math.round(a * 3)) % 2);
  const fx = Math.round(Math.cos(a) * rr);
  const fz = Math.round(Math.sin(a) * rr);
  block(fx, 0, fz, FOAM);
  if (a % 0.56 < 0.28) block(fx, 1, fz, FOAM);
}

// ================= MANTLE (teardrop head) =================
const baseY = 6;
const maxR = 6;
const H = 17;
for (let h = 0; h <= H; h++) {
  const y = baseY + h;
  const frac = h / H;
  // bulge low, taper to a point on top
  let r = Math.round(maxR * (1 - frac * frac));
  if (frac < 0.15) r = maxR;             // fat crown of the head
  if (r >= 1) disk(0, y, 0, r, BODY);
}
// rounded bottom of the head so tentacles flow out of a mass
sphere(0, baseY + 1, 0, maxR, BODY);
sphere(0, baseY, 0, maxR - 1, SKIN2);   // darker underbelly

// two side fins near the top of the mantle
for (let s = -1; s <= 1; s += 2) {
  for (let k = 0; k < 4; k++) {
    line(s * (maxR - 2), baseY + 11 + k, 0, s * (maxR + 1 + k), baseY + 9 + k, 0, BODY);
  }
}

// ================= FACE (looking +Z / south) =================
const eyeY = baseY + 6;
for (let s = -1; s <= 1; s += 2) {
  const ex = s * 3;
  // brow ridge — angry
  line(ex - 2, eyeY + 3, 4, ex + 2, eyeY + 2, 5, RIDGE);
  // eye white
  sphere(ex, eyeY, 5, 2, FOAM);
  // pupil, staring forward
  sphere(ex, eyeY, 6, 1, SKIN2);
  block(ex, eyeY, 7, SKIN2);
  // glint
  block(ex + (s === 1 ? -1 : 1), eyeY + 1, 6, FOAM);
}
// beak / maw below the eyes
for (let k = 0; k < 3; k++) {
  cube(-2 - k, eyeY - 2 - k, 4, 2 + k, eyeY - 2 - k, 6 + k, BEAK);
}
block(0, eyeY - 5, 6, BEAK);

// ================= TENTACLES =================
function tentacle(angle, length, curlDir, thick) {
  const steps = length * 2;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const dist = t * length;
    // organic sideways curl as it extends
    const a = angle + curlDir * t * 0.7;
    const x = Math.round(Math.cos(a) * dist);
    const z = Math.round(Math.sin(a) * dist);
    // dip toward the water, then curl up at the tip
    let y = Math.round(baseY - 1 - 11 * t + 15 * t * t);
    if (y < -1) y = -1;
    const r = Math.max(1, Math.round(thick * (1 - t * 0.8)));
    sphere(x, y, z, r, BODY);
    // suckers on the underside every few steps
    if (i % 3 === 0 && t > 0.1) block(x, y - r, z, SKIN2);
    // curled tips reach up and grasp
    if (t > 0.9) block(x, y + 1, z, BODY);
  }
}

// eight arms; two long "feeding" tentacles reach forward
const arms = [
  { ang: Math.PI * 0.5, len: 20, curl: 0.6, th: 3 },   // front (south)
  { ang: Math.PI * 0.5, len: 20, curl: -0.6, th: 3 },
  { ang: Math.PI * 0.25, len: 17, curl: 0.5, th: 3 },
  { ang: Math.PI * 0.75, len: 17, curl: -0.5, th: 3 },
  { ang: 0, len: 18, curl: 0.4, th: 3 },
  { ang: Math.PI, len: 18, curl: -0.4, th: 3 },
  { ang: -Math.PI * 0.25, len: 15, curl: 0.5, th: 2 }, // rear
  { ang: -Math.PI * 0.75, len: 15, curl: -0.5, th: 2 },
  { ang: -Math.PI * 0.5, len: 14, curl: 0.3, th: 2 },
];
for (const arm of arms) tentacle(arm.ang, arm.len, arm.curl, arm.th);

// a couple of tentacle tips breaching high, curling menacingly
line(15, 6, 14, 17, 10, 12, BODY);
sphere(18, 11, 11, 2, BODY);
block(18, 12, 11, SKIN2);
line(-15, 6, 14, -17, 10, 12, BODY);
sphere(-18, 11, 11, 2, BODY);
block(-18, 12, 11, SKIN2);
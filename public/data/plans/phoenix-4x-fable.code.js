// phoenix-4x-fable — prompt:
// a phoenix rising from flames...

// Phoenix rising from flames
// Layout: ash crater + layered fire (white core -> yellow -> red) at ground,
// phoenix body y11-23, swept-up wings to y30, tail streamers trailing into the fire.

const h = (a, b) => {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

// ---- clear canopy/trunks inside the fire zone (AIR is free); leave y<=0 stumps as burnt snags
cube(-13, 1, -13, 13, 12, 13, AIR);

// ---- ash crater
disk(0, 0, 0, 10, COBBLE);
hollowCylinder(0, 0, 0, 11, 1, STONE);
// glowing cracks radiating through the ash
for (let c = 0; c < 10; c++) {
  const a = c * 0.628 + 0.3;
  line(Math.round(Math.cos(a) * 3), 0, Math.round(Math.sin(a) * 3),
       Math.round(Math.cos(a) * 12), 0, Math.round(Math.sin(a) * 12),
       c % 3 === 0 ? OAK_LOG : BRICK);
}
// scattered scorch beyond the rim
for (let x = -14; x <= 14; x++) {
  for (let z = -14; z <= 14; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d > 11 && d < 14.5 && h(x, z) < 0.22) block(x, 0, z, h(z, x) < 0.5 ? COBBLE : DIRT);
  }
}

// ---- fire: concentric rings of wavering flame licks, hotter toward center
for (let ring = 0; ring < 5; ring++) {
  const r = 3.5 + ring * 2;
  const steps = Math.round((r * Math.PI * 2) / 1.05);
  for (let s = 0; s < steps; s++) {
    const a = (s / steps) * Math.PI * 2 + ring * 0.45;
    const fx = Math.cos(a) * r, fz = Math.sin(a) * r;
    const hgt = Math.max(1, Math.round(1.5 + h(fx * 3, fz * 3) * (10 - ring * 2)));
    for (let y = 0; y <= hgt; y++) {
      const frac = y / hgt;
      let id;
      if (ring === 0) id = frac < 0.5 ? SNOW : SAND;
      else if (ring < 3) id = frac < 0.45 ? SAND : BRICK;
      else id = frac < 0.25 ? SAND : BRICK;
      const wx = Math.round(fx + Math.sin(y * 0.9 + a * 3) * (0.2 + y * 0.18));
      const wz = Math.round(fz + Math.cos(y * 0.8 + a * 2) * (0.2 + y * 0.18));
      block(wx, y, wz, id);
    }
  }
}

// white-hot core column directly under the bird
cylinder(0, 0, 0, 3, 3, SAND);
cylinder(0, 0, 0, 2, 5, SAND);
cylinder(0, 0, 0, 1, 8, SNOW);
sphere(0, 3, 0, 2, SNOW);

// tall spiral tongues licking up around the body
for (let k = 0; k < 6; k++) {
  const a0 = k * 1.047;
  const top = 12 + (k % 3);
  for (let y = 1; y <= top; y++) {
    const rad = 6.5 - y * 0.32;
    const a = a0 + y * 0.38;
    const x = Math.round(Math.cos(a) * rad);
    const z = Math.round(Math.sin(a) * rad);
    block(x, y, z, y > top - 3 ? BRICK : (y < 5 ? SAND : (h(k, y) < 0.5 ? SAND : BRICK)));
    if (y % 3 === 0 && y < 8) block(x + 1, y, z, BRICK);
  }
}

// drifting embers and sparks
for (let e = 0; e < 40; e++) {
  const a = h(e, 7) * Math.PI * 2;
  const rr = 6 + h(e, 13) * 11;
  const ex = Math.round(Math.cos(a) * rr);
  const ey = Math.round(2 + h(e, 29) * 22);
  const ez = Math.round(Math.sin(a) * rr);
  const p = h(e, 31);
  block(ex, ey, ez, p < 0.45 ? SAND : (p < 0.85 ? BRICK : SNOW));
}

// ---- phoenix body (tilted forward: head -Z, tail +Z)
sphere(0, 12, 2, 3, BRICK);      // hips
sphere(0, 14, 0, 3, BRICK);      // torso
sphere(0, 16, -2, 2, BRICK);     // chest
sphere(0, 14, -3, 1, SAND);      // golden breast tuft
sphere(-4, 14, 0, 2, BRICK);     // shoulders
sphere(4, 14, 0, 2, BRICK);
// neck + head
line(0, 17, -2, 0, 19, -3, BRICK);
cube(-1, 18, -3, 1, 19, -2, BRICK);
sphere(0, 21, -3, 2, BRICK);
// beak
cube(0, 21, -6, 0, 21, -5, SAND);
block(0, 20, -6, SAND);
// eyes
block(2, 22, -4, GLASS);
block(-2, 22, -4, GLASS);
// crest feathers
line(0, 23, -3, 0, 27, -1, SAND);
line(1, 23, -3, 2, 26, -1, BRICK);
line(-1, 23, -3, -2, 26, -1, BRICK);

// ---- wings: swept up in a V, yellow leading edge, red vane, finger feathers below
function wing(dir) {
  const N = 19;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = dir * (2 + i);
    const lead = Math.round(13 + 17 * Math.pow(t, 0.85));
    const chord = Math.round(6 * (1 - t)) + 2;
    const bot = lead - chord;
    const zb = Math.round(3 * t);
    for (let y = bot; y <= lead; y++) {
      const id = (y === lead) ? SAND : (y <= bot + 1 ? SAND : BRICK);
      block(x, y, zb, id);
      if (t < 0.7) block(x, y, zb + 1, BRICK);
      if (t < 0.35) block(x, y, zb - 1, BRICK);
    }
    // separated finger feathers hanging off the trailing edge
    let fl = (i % 3 === 0) ? 3 : (i % 3 === 1 ? 1 : 0);
    if (t > 0.5) fl += Math.round(2 * t);
    for (let f = 1; f <= fl; f++) {
      block(x, bot - f, zb, f === fl ? SNOW : SAND);
    }
  }
  // extended tip primaries
  line(dir * 21, 30, 3, dir * 22, 32, 4, SAND);
  block(dir * 22, 33, 4, SNOW);
}
wing(1);
wing(-1);

// ---- tail: long streamers falling back into the flames
function streamer(x0, sway, zRun, len) {
  for (let s = 0; s <= len; s++) {
    const t = s / len;
    const x = Math.round(x0 + Math.sin(t * 4 + sway) * 1.5 * t);
    const y = Math.round(11 - 11 * Math.pow(t, 1.3));
    const z = Math.round(3 + zRun * t);
    block(x, y, z, s % 3 === 0 ? SAND : BRICK);
    if (t > 0.75) {
      block(x - 1, y, z, BRICK);
      block(x + 1, y, z, SAND);
    }
  }
}
streamer(-3, 0.0, 8, 14);
streamer(-1.5, 1.3, 10, 16);
streamer(0, 2.1, 12, 17);
streamer(1.5, 3.4, 10, 16);
streamer(3, 4.7, 8, 14);
// upper tail coverts fanning off the hips
cube(-2, 12, 4, 2, 13, 5, BRICK);
line(-2, 13, 5, -3, 11, 7, SAND);
line(2, 13, 5, 3, 11, 7, SAND);
line(0, 13, 5, 0, 12, 8, SAND);
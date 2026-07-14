// scorpion-4x-fable — prompt:
// a giant scorpion...

const seen = new Set();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (seen.has(k)) return;
  seen.add(k);
  block(x, y, z, id);
}
function blob(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.06) put(x, y, z, id);
      }
}
function ball(cx, cy, cz, r, id) { blob(cx, cy, cz, r, r, r, id); }
function seg(x1, y1, z1, x2, y2, z2, id, thick) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  const steps = Math.ceil(n * 2) + 1;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, z = z1 + (z2 - z1) * t;
    put(x, y, z, id);
    if (thick > 1) put(x, y - 1, z, id);
  }
}
function taper(x1, y1, z1, r1, x2, y2, z2, r2, n, id) {
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ball(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r1 + (r2 - r1) * t, id);
  }
}

// ---- clear trees/canopy over the build footprint (AIR is free) ----
cube(-17, 0, -22, 17, 13, 15, AIR);
cube(14, 0, -8, 21, 8, 4, AIR);

// ---- eyes + fangs (placed first so body fill can't overwrite them) ----
put(-1, 7, -8, GLASS); put(1, 7, -8, GLASS);
put(-3, 6, -8, GLASS); put(3, 6, -8, GLASS);
put(-1, 4, -9, STONE); put(1, 4, -9, STONE);
put(-1, 4, -10, STONE); put(1, 4, -10, STONE);
put(-1, 3, -10, STONE); put(1, 3, -10, STONE);

// ---- head + segmented body (facing north / -Z) ----
blob(0, 5, -6, 4.3, 2.7, 3.3, BRICK);
blob(0, 5, -3, 4.8, 3.0, 3.0, BRICK);
blob(0, 5.2, 0, 5.0, 3.1, 3.0, BRICK);
blob(0, 5.2, 3, 4.8, 3.0, 3.0, BRICK);
blob(0, 5.3, 6, 4.4, 2.9, 3.0, BRICK);
blob(0, 5.6, 9, 3.7, 2.6, 2.7, BRICK);

// dorsal armor ridges (taller than body so they crest the back)
blob(0, 5.4, -1.5, 3.9, 3.5, 0.9, COBBLE);
blob(0, 5.5, 1.5, 4.0, 3.6, 0.9, COBBLE);
blob(0, 5.5, 4.5, 3.8, 3.5, 0.9, COBBLE);
blob(0, 5.6, 7.5, 3.4, 3.2, 0.9, COBBLE);

// ---- tail: beaded segments arcing up and over toward the head ----
const tail = [
  [0, 6.5, 10, 2.7],
  [0.5, 9.5, 12, 2.5],
  [1, 13, 13, 2.4],
  [1, 16.5, 12.5, 2.2],
  [0.5, 19.5, 11, 2.1],
  [0, 22, 8.5, 2.0],
  [0, 23.8, 5.5, 1.9]
];
tail.forEach(p => ball(p[0], p[1], p[2], p[3], BRICK));
// barbs on the outside of the curl
const TC = { x: 0, y: 15, z: 4.5 };
tail.slice(1).forEach(p => {
  const dx = p[0] - TC.x, dy = p[1] - TC.y, dz = p[2] - TC.z;
  const m = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const ux = dx / m, uy = dy / m, uz = dz / m, r = p[3];
  seg(p[0] + ux * (r - 0.5), p[1] + uy * (r - 0.5), p[2] + uz * (r - 0.5),
      p[0] + ux * (r + 1.6), p[1] + uy * (r + 1.6), p[2] + uz * (r + 1.6), STONE, 1);
});
// venom bulb + stinger hooking down-forward over the head
blob(0, 25, 3, 2.1, 2.1, 2.4, COBBLE);
taper(0, 24.3, 1, 1.2, 0, 20.8, -1.8, 0.5, 5, SNOW);
put(0, 20, -2.3, SNOW);

// ---- pedipalp arms + pincers (east claw raised for asymmetry) ----
for (const s of [1, -1]) {
  const y0 = s > 0 ? 6 : 4.5;
  taper(s * 4.5, 5.4, -6.5, 2.2, s * 8.5, y0, -11.5, 1.9, 4, BRICK);
  blob(s * 10.3, y0, -13.8, 2.7, 2.2, 3.1, COBBLE);
  taper(s * 11.8, y0, -16.5, 1.4, s * 9.3, y0 + 0.3, -21, 0.7, 5, STONE);
  taper(s * 8.4, y0, -15.6, 1.2, s * 6.6, y0 + 0.2, -19.6, 0.6, 4, STONE);
}

// ---- eight arched legs ----
const legZ = [-3, 0, 3, 6], kick = [-3, -1, 1, 3];
for (const s of [1, -1]) {
  for (let i = 0; i < 4; i++) {
    const az = legZ[i], kz = kick[i];
    seg(s * 4, 5, az, s * 10, 9.5, az + kz, OAK_LOG, 2);
    seg(s * 10, 9.5, az + kz, s * 15, -1, az + kz * 2, OAK_LOG, 2);
    put(s * 10, 10.5, az + kz, STONE); // knee spike
  }
}

// ---- prey remains between the claws ----
put(-1, 1, -19, AIR); put(1, 1, -19, AIR); // eye sockets before skull fill
blob(0, 0.8, -18, 1.6, 1.4, 1.7, SNOW);
for (const rz of [-15, -13]) {
  put(-2, 0, rz, SNOW); put(-2, 1, rz, SNOW); put(-1, 2, rz, SNOW);
  put(0, 2, rz, SNOW); put(1, 2, rz, SNOW); put(2, 1, rz, SNOW); put(2, 0, rz, SNOW);
}
seg(0, 0, -16, 0, 0, -12, SNOW, 1);

// ---- boulders + scattered rocks ----
blob(-16, 0.3, -15, 2.2, 1.6, 2.4, COBBLE);
blob(13, 0, 10, 1.8, 1.3, 2.0, COBBLE);
blob(-14, -0.3, 14, 2.0, 1.4, 2.2, STONE);
for (const r of [[7, -12], [-8, -13], [4, -18], [-6, -19], [11, -7], [-12, 3], [9, 14], [-9, 16]]) {
  put(r[0], -1, r[1], COBBLE); put(r[0], 0, r[1], COBBLE);
}

// ---- baby scorpion off to the east ----
for (let x = 14; x <= 20; x++) for (let z = -6; z <= 2; z++) { put(x, -1, z, SAND); put(x, 0, z, SAND); }
put(16.4, 2, -4, GLASS); put(17.6, 2, -4, GLASS);
blob(17, 1.8, -2, 1.6, 1.1, 2.4, BRICK);
ball(17, 2.6, 0.8, 0.9, BRICK); ball(17, 3.8, 0.6, 0.8, BRICK); ball(17, 4.6, -0.6, 0.7, BRICK);
put(17, 4.2, -1.6, SNOW);
ball(15.8, 1.2, -4.6, 0.9, BRICK); ball(18.2, 1.2, -4.6, 0.9, BRICK);
put(15.5, 1, -5.6, STONE); put(18.5, 1, -5.6, STONE);
seg(15.9, 1.5, -3, 14.4, 0, -4, OAK_LOG, 1); seg(15.9, 1.5, -1, 14.4, 0, 0, OAK_LOG, 1);
seg(18.1, 1.5, -3, 19.6, 0, -4, OAK_LOG, 1); seg(18.1, 1.5, -1, 19.6, 0, 0, OAK_LOG, 1);

// ---- desert floor last (skips anything already placed) ----
for (let x = -14; x <= 14; x++)
  for (let z = -16; z <= 12; z++)
    if (x * x + (z + 2) * (z + 2) <= 196) put(x, -1, z, SAND);
for (let x = -9; x <= 9; x++)
  for (let z = -22; z <= -4; z++)
    if (x * x + (z + 13) * (z + 13) <= 81) put(x, -1, z, SAND);
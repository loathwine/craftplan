// mammoth-4x-opus — prompt:
// a woolly mammoth...

cube(-11, 1, -12, 11, 24, 16, AIR); // clear intruding forest from the build volume only

// ---- helpers ----
const H = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };

// shaggy brown fur: mostly OAK_LOG, patches of DIRT, a few dark COBBLE tufts
function fur(x, y, z) {
  const f = H(x, y, z);
  if (f < 0.55) return OAK_LOG;
  if (f < 0.86) return DIRT;
  if (f < 0.95) return OAK_LOG;
  return COBBLE;
}

// filled ellipsoid; fn is a block id or a function(x,y,z)->id
function blob(cx, cy, cz, rx, ry, rz, fn) {
  const rx2 = rx * rx, ry2 = ry * ry, rz2 = rz * rz;
  for (let x = -Math.ceil(rx); x <= rx; x++)
    for (let y = -Math.ceil(ry); y <= ry; y++)
      for (let z = -Math.ceil(rz); z <= rz; z++) {
        if ((x * x) / rx2 + (y * y) / ry2 + (z * z) / rz2 <= 1.0) {
          const id = (typeof fn === 'function') ? fn(cx + x, cy + y, cz + z) : fn;
          block(cx + x, cy + y, cz + z, id);
        }
      }
}

// ---- LEGS (thick furry columns) ----  front faces -Z
function leg(cx, cz) {
  for (let y = 0; y <= 8; y++) {
    const r = (y <= 1) ? 3.0 : 2.5;   // flared foot
    const r2 = r * r;
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++)
        if (x * x + z * z <= r2) block(cx + x, y, cz + z, fur(cx + x, y, cz + z));
  }
  // pale toenails on the front (-Z) of the foot
  for (let nx = -2; nx <= 2; nx++)
    if (nx * nx + 4 <= 9) { block(cx + nx, 0, cz - 2, SNOW); block(cx + nx, 1, cz - 2, SNOW); }
}
leg(-4, -1);  // front-left
leg(4, -1);   // front-right
leg(-4, 12);  // rear-left
leg(4, 12);   // rear-right

// ---- BODY ---- long rounded barrel
blob(0, 11, 6, 7, 5, 9, fur);
// shoulder hump (highest point of the back)
blob(0, 15, 4, 5, 3, 4, fur);
// rear rounding
blob(0, 11, 13, 5, 4, 3, fur);

// ---- HEAD ---- big domed skull at the front (-Z)
blob(0, 12.5, -2, 5, 5.5, 5, fur);
// domed crown (the classic mammoth top-knot)
blob(0, 17, -2, 3.5, 2.5, 3.5, fur);
// forehead tuft
for (let x = -3; x <= 3; x++)
  for (let z = -3; z <= 1; z++) {
    const top = 19 + Math.floor(H(x, 7, z) * 2);
    for (let y = 18; y <= top; y++) if (H(x, y, z) < 0.5) block(x, y, z, fur(x, y, z));
  }

// ---- EARS ---- small (woolly mammoth ears are tiny)
blob(5.6, 13, -1, 1.2, 2.6, 2.4, fur);
blob(-5.6, 13, -1, 1.2, 2.6, 2.4, fur);

// ---- EYES ----
block(2.6, 13.6, -6.6, COBBLE); block(2.4, 13.6, -6.7, STONE);
block(-2.6, 13.6, -6.6, COBBLE); block(-2.4, 13.6, -6.7, STONE);

// ---- TRUNK ---- hangs from the front of the face and curls forward
const trunk = [
  [0, 9.5, -6, 2.7], [0, 8, -7, 2.4], [0, 6.2, -7.6, 2.1],
  [0, 4.4, -8, 1.9], [0, 2.8, -8, 1.7], [0.4, 1.4, -7.4, 1.5],
  [0.8, 0.4, -6.4, 1.3], [1.3, 0.2, -5.2, 1.2]
];
for (const [x, y, z, r] of trunk) blob(x, y, z, r, r, r, fur);

// ---- TUSKS ---- long white curved ivory
function tusk(s) {
  const pts = [
    [s * 2.6, 8, -6, 1.3], [s * 3.2, 6.6, -7, 1.3], [s * 3.4, 5.2, -8.2, 1.2],
    [s * 3.2, 4.0, -9.4, 1.2], [s * 2.6, 3.4, -10.4, 1.1], [s * 1.7, 3.8, -11.2, 1.1],
    [s * 1.0, 5.0, -11.4, 1.0], [s * 0.7, 6.2, -11.0, 0.9]
  ];
  for (const [x, y, z, r] of pts) blob(x, y, z, r, r, r, SNOW);
}
tusk(1); tusk(-1);

// ---- TAIL ---- thin, with a dark tuft
for (let i = 0; i <= 5; i++) block(0, 11 - i, 15 + Math.floor(i / 3), fur(0, 11 - i, 15));
blob(0, 5, 16, 1.4, 1.4, 1.4, COBBLE);

// ---- SHAGGY SKIRT ---- long hanging fur along both flanks (the "woolly" look)
for (let z = -2; z <= 13; z++) {
  const t = 1 - ((z - 6) * (z - 6)) / (9 * 9);
  if (t <= 0) continue;
  const ex = Math.round(7 * Math.sqrt(t));
  for (const s of [-1, 1]) {
    const len = 3 + Math.floor(H(z, s, 3) * 4); // 3..6 long
    for (let y = 7; y >= 7 - len; y--) block(s * ex, y, z, fur(s * ex, y, z));
  }
}
// front chest fringe
for (let x = -5; x <= 5; x++) {
  if (x * x > 30) continue;
  const len = 4 + Math.floor(H(x, 0, -3) * 3);
  for (let y = 7; y >= 7 - len; y--) block(x, y, -6, fur(x, y, -6));
}
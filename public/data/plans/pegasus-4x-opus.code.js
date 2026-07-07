// pegasus-4x-opus — prompt:
// Pegasus...

const meta = { name: "pegasus" };

// ---------- helpers ----------
function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -Math.ceil(rx); x <= Math.ceil(rx); x++)
    for (let y = -Math.ceil(ry); y <= Math.ceil(ry); y++)
      for (let z = -Math.ceil(rz); z <= Math.ceil(rz); z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d <= 1.0) block(cx + x, cy + y, cz + z, id);
      }
}
function ellipShell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -Math.ceil(rx); x <= Math.ceil(rx); x++)
    for (let y = -Math.ceil(ry); y <= Math.ceil(ry); y++)
      for (let z = -Math.ceil(rz); z <= Math.ceil(rz); z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d <= 1.0 && d >= 0.6) block(cx + x, cy + y, cz + z, id);
      }
}
// tapered limb: spheres of shrinking radius along a path
function limb(ax, ay, az, bx, by, bz, r0, r1, id, steps) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(ax + (bx - ax) * t);
    const y = Math.round(ay + (by - ay) * t);
    const z = Math.round(az + (bz - az) * t);
    const r = r0 + (r1 - r0) * t;
    sphere(x, y, z, r, id);
  }
}

// ============================================================
// CLOUD BASE — puffy support so the horse reads as flying
// ============================================================
const cloudPuffs = [
  [0, 1, 5, 6], [-7, 0, 3, 4], [7, 0, 4, 4], [-4, 0, 11, 4],
  [5, 1, 10, 4], [0, 0, 13, 4], [-9, -1, 7, 3], [10, -1, 8, 3],
  [2, -1, -2, 4], [-5, 0, -3, 3], [0, -2, 4, 5],
];
for (const [cx, cy, cz, r] of cloudPuffs) ellipsoid(cx, cy, cz, r, r * 0.6, r, SNOW);
// wispy trailing tendrils (background separation, drifting south)
for (const [cx, cy, cz, r] of [[-13,-1,14,3],[13,-1,15,3],[0,-2,20,4],[-16,-2,10,2],[16,-2,11,2]])
  ellipsoid(cx, cy, cz, r, r * 0.5, r, SNOW);

// ============================================================
// BODY — elongated, chest to the north (-Z), rump south (+Z)
// ============================================================
ellipsoid(0, 14, 4, 4.2, 4.0, 7.0, SNOW);
// chest swell (front, well lit)
ellipsoid(0, 13, -2, 3.6, 3.6, 2.8, SNOW);
// haunch (rear power)
ellipsoid(0, 14, 9, 4.2, 4.2, 3.0, SNOW);

// ============================================================
// NECK + HEAD — arched, reaching forward and up to the north
// ============================================================
// arched neck: base at front-top of body up to head
limb(0, 16, -2,  0, 20, -7, 3.2, 1.9, SNOW, 10);
// head (turned very slightly east to catch light)
ellipsoid(1, 21, -8, 2.2, 2.4, 2.6, SNOW);
// muzzle projecting north
ellipsoid(1, 20, -11, 1.5, 1.5, 2.3, SNOW);
block(1, 19, -13, SNOW); block(2, 19, -13, SNOW);
// nostrils / mouth shadow
block(0, 19, -13, STONE); block(2, 20, -13, STONE);
// eyes (blue GLASS), on the lit north-east face
block(2, 22, -10, GLASS); block(-1, 22, -10, GLASS);
block(2, 22, -10, GLASS);
// brow ridge
line(-1, 23, -9, 3, 23, -9, SNOW);
// ears — two alert points on top of head
limb(0, 23, -7, -1, 26, -6, 1.0, 0.4, SNOW, 4);
limb(2, 23, -7,  3, 26, -6, 1.0, 0.4, SNOW, 4);

// ============================================================
// MANE — flowing cyan crest down the back of the neck
// ============================================================
for (let i = 0; i <= 12; i++) {
  const t = i / 12;
  const x = Math.round(-1 + 3 * t);          // sweeps slightly across
  const y = Math.round(25 - 9 * t);
  const z = Math.round(-6 + 5 * t);
  const id = (i % 3 === 0) ? SNOW : ICE;
  sphere(x, y, z, 1.4 - 0.3 * t, id);
  // strands trailing back (+z) and down
  line(x, y, z, x - 1, y - 2, z + 2, ICE);
}
// forelock between the ears
line(1, 25, -8, 0, 22, -11, ICE);

// ============================================================
// LEGS — front pair reaching forward, hind pair driving back
// ============================================================
// front-left / front-right, extended toward the north, hooves in STONE
function leg(hipX, hipY, hipZ, footX, footY, footZ, kneeDrop) {
  const kx = (hipX + footX) / 2 + 0.4;
  const ky = (hipY + footY) / 2 - kneeDrop;
  const kz = (hipZ + footZ) / 2;
  limb(hipX, hipY, hipZ, kx, ky, kz, 1.7, 1.1, SNOW, 5);   // upper
  limb(kx, ky, kz, footX, footY + 1, footZ, 1.1, 0.7, SNOW, 5); // lower
  cube(footX - 1, footY, footZ - 1, footX + 1, footY + 1, footZ + 1, STONE); // hoof
}
leg( 2.5, 11, -1,  4, 3, -6, 1);   // front right — reaching
leg(-2.5, 11, -1, -3, 4, -3, 2);   // front left — bent, gathered
leg( 2.5, 12, 9,   4, 2, 13, 1);   // hind right — trailing
leg(-2.5, 12, 9,  -3, 2, 11, 1);   // hind left

// ============================================================
// TAIL — long streaming cyan tail off the rump
// ============================================================
for (let i = 0; i <= 14; i++) {
  const t = i / 14;
  const x = Math.round((i % 2 ? 1 : -1) * 1.5 * Math.sin(t * 4));
  const y = Math.round(15 - 11 * t);
  const z = Math.round(11 + 6 * t);
  const id = (i % 3 === 0) ? SNOW : ICE;
  sphere(x, y, z, 1.6 - 0.6 * t, id);
}

// ============================================================
// WINGS — the centrepiece: huge feathered wings sweeping up & out
// ============================================================
function wing(side) {
  const shX = side * 3, shY = 16, shZ = 1;      // shoulder anchor
  const tipX = side * 20, tipY = 26, tipZ = 4;  // wing tip (up, out, slightly back)
  const K = 16;
  // main leading spar (thick)
  limb(shX, shY, shZ, tipX, tipY, tipZ, 1.8, 0.7, SNOW, 12);
  // muscular wing shoulder
  ellipsoid(shX, shY + 1, shZ + 1, 2.6, 2.4, 2.6, SNOW);
  for (let k = 0; k <= K; k++) {
    const t = k / K;
    // point along the spar
    const sx = shX + (tipX - shX) * t;
    const sy = shY + (tipY - shY) * t;
    const sz = shZ + (tipZ - shZ) * t;
    // feather length profile — longest in the mid-wing
    const prof = Math.sin(Math.PI * (0.15 + 0.85 * t));
    const L = 3 + 9 * prof;
    // feather points backward (+z) and droops downward
    const ex = sx + side * 0.5;
    const ey = sy - L * 0.55;
    const ez = sz + L;
    const tipId = (k % 3 === 0) ? ICE : SNOW; // cyan primaries for detail
    limb(sx, sy, sz, ex, ey, ez, 1.1, 0.5, tipId, Math.max(4, Math.round(L)));
    // secondary covert feathers, shorter, in front of primaries (membrane fill)
    const L2 = L * 0.55;
    limb(sx, sy - 0.5, sz - 0.3, sx + side * 0.3, sy - L2 * 0.5, sz + L2, 0.9, 0.5, SNOW, Math.max(3, Math.round(L2)));
  }
  // solid leading membrane near the shoulder for a filled upper wing
  for (let k = 0; k <= 6; k++) {
    const t = k / 6;
    const sx = shX + (tipX - shX) * (t * 0.5);
    const sy = shY + (tipY - shY) * (t * 0.5);
    const sz = shZ + (tipZ - shZ) * (t * 0.5);
    limb(sx, sy, sz - 1, sx, sy - 2, sz + 2, 1.2, 0.8, SNOW, 4);
  }
}
wing(1);   // east / right wing (extra-lit)
wing(-1);  // west / left wing

// ============================================================
// FINISHING TOUCHES
// ============================================================
// saddle-blanket accent across the back (bit of colour, red)
for (let z = 2; z <= 8; z++) {
  block(-4, 15 + Math.round(Math.sin(z) * 0), z, BRICK);
  block( 4, 15, z, BRICK);
}
line(-3, 18, 3, 3, 18, 3, BRICK);
line(-3, 18, 6, 3, 18, 6, BRICK);
// chest star marking
block(0, 12, -4, ICE); block(0, 13, -4, ICE); block(1, 12, -4, ICE);
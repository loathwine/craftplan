// cobra-4x-fable — prompt:
// a king cobra ready to strike...

const seen = new Set();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (seen.has(k)) return;
  seen.add(k);
  block(x, y, z, id);
}
function putCube(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++) put(x, y, z, id);
}
function ball(cx, cy, cz, r, col) {
  const rr = (r + 0.3) * (r + 0.3);
  for (let x = Math.floor(cx - r - 0.3); x <= Math.ceil(cx + r + 0.3); x++)
    for (let y = Math.floor(cy - r - 0.3); y <= Math.ceil(cy + r + 0.3); y++)
      for (let z = Math.floor(cz - r - 0.3); z <= Math.ceil(cz + r + 0.3); z++) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        if (dx * dx + dy * dy + dz * dz <= rr) put(x, y, z, col(x, y, z, cx, cy, cz));
      }
}
let ring = 0;
function tube(pts, colFn) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]), 0.001);
    const steps = Math.max(1, Math.ceil(d * 2));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t;
      const cz = a[2] + (b[2] - a[2]) * t, r = a[3] + (b[3] - a[3]) * t;
      const rg = ring++;
      ball(cx, cy, cz, r, (x, y, z, ccx, ccy, ccz) => colFn(x, y, z, ccx, ccy, ccz, rg));
    }
  }
}
// snake skin: brown scales, tan belly (faces camera on the reared neck), pale chevron bands
function skin(x, y, z, cx, cy, cz, rg) {
  const rear = cy > 8.5;
  const belly = rear ? (z < cz - 0.5) : (y < cy - 0.8);
  const band = (rg % 9) < 2;
  if (belly) return band ? SAND : PLANKS;
  if (band && (rear ? z > cz + 0.2 : y > cy + 0.2)) return SAND;
  return OAK_LOG;
}

// ---- clear trees from the arena (canopy tops at y<=8) ----
cube(-12, 0, -6, 13, 9, 18, AIR);   // coil footprint
cube(-13, 0, -19, 12, 9, -7, AIR);  // strike corridor / mongoose stage

// ---- head (faces north, slightly east; details first so fills can't overwrite) ----
put(1, 24, -10, STONE); put(3, 24, -10, STONE);            // nostrils
putCube(0, 25, -8, 0, 25, -7, BRICK);                      // eyes
putCube(4, 25, -8, 4, 25, -7, BRICK);
put(1, 22, -9, SNOW); put(1, 21, -9, SNOW);                // fangs
put(3, 22, -9, SNOW); put(3, 21, -9, SNOW);
put(2, 20, -10, BRICK); put(2, 20, -11, BRICK);            // forked tongue
put(2, 19, -12, BRICK);
put(1, 19, -13, BRICK); put(1, 18, -14, BRICK);
put(3, 19, -13, BRICK); put(3, 18, -14, BRICK);
putCube(1, 23, -9, 3, 23, -4, BRICK);                      // mouth roof
putCube(1, 20, -4, 3, 22, -4, BRICK);                      // red throat back wall
tube([[2, 21.5, -3.8, 1.4], [2, 20.3, -6.5, 1.2], [2, 19.8, -8.6, 0.9]],
  (x, y, z, cx, cy, cz) => (y >= cy + 0.3 ? BRICK : PLANKS));  // dropped lower jaw
putCube(0, 24, -8, 4, 25, -1, OAK_LOG);                    // skull
putCube(0, 26, -7, 4, 26, -2, OAK_LOG);                    // rounded crown
putCube(1, 24, -10, 3, 25, -9, OAK_LOG);                   // snout
putCube(0, 22, -3, 4, 23, -1, OAK_LOG);                    // rear cheeks

// ---- hood: leans forward with the strike, banded throat in front, spectacle mark behind ----
function neckZ(y) {
  const NK = [[6.8, 1.2], [9, 3.6], [12, 5.6], [15, 6.2], [18, 5.0], [21, 2.2], [23.4, -1.2], [24.6, -3.4]];
  if (y <= NK[0][0]) return NK[0][1];
  for (let i = 0; i < NK.length - 1; i++) {
    if (y <= NK[i + 1][0]) {
      const t = (y - NK[i][0]) / (NK[i + 1][0] - NK[i][0]);
      return NK[i][1] + (NK[i + 1][1] - NK[i][1]) * t;
    }
  }
  return NK[NK.length - 1][1];
}
const hoodW = [[13, 2.5], [14, 4], [15, 5.5], [16, 6.5], [17, 7], [18, 7.4], [19, 7.4], [20, 7.2], [21, 6.6], [22, 5.6], [23, 4.6], [24, 3.4]];
for (const [y, w] of hoodW) {
  const zc = Math.round(neckZ(y));
  const hx = Math.round(0.15 * (y - 8));
  const wi = Math.round(w);
  for (let x = hx - wi; x <= hx + wi; x++) {
    for (let dz = -1; dz <= 1; dz++) {
      let id = OAK_LOG;
      if (dz === -1) {
        const rim = Math.abs(x - hx) > w - 1.7;
        id = rim ? OAK_LOG : ((y % 4 < 2) ? SAND : PLANKS);
      } else if (dz === 1) {
        for (const e of [hx - 3, hx + 3]) {
          const dd = (x - e) * (x - e) + (y - 20) * (y - 20);
          if (dd >= 2 && dd <= 6) id = SAND;
        }
        if (y === 22 && Math.abs(x - hx) <= 1) id = SAND;
      }
      put(x, y, zc + dz, id);
    }
  }
}

// ---- body: tail tip -> coiled pile -> S-curved rearing neck ----
const body = [[12, 1, 13, 0.6], [10.6, 1.1, 12, 1.1]];
const th0 = 0.9, sweep = 4 * Math.PI + (Math.PI - th0);
const N = 100;
for (let i = 0; i <= N; i++) {
  const t = i / N, th = th0 + sweep * t;
  const R = 9.0 - 4.0 * t, yy = 1.8 + 5.0 * t;
  const br = 1.4 + 1.2 * Math.min(1, t * 4);
  body.push([R * Math.sin(th), yy, 6 + R * Math.cos(th), br]);
}
body.push(
  [0, 6.8, 1.2, 2.5],
  [0.2, 9, 3.6, 2.4],
  [0.6, 12, 5.6, 2.3],
  [1.05, 15, 6.2, 2.15],
  [1.5, 18, 5.0, 2.0],
  [1.95, 21, 2.2, 1.9],
  [2.3, 23.4, -1.2, 1.7],
  [2.5, 24.6, -3.4, 1.5]
);
tube(body, skin);

// ---- sandy arena pads ----
for (let x = -9; x <= 9; x++)
  for (let z = -11; z <= 7; z++)
    if (x * x + (z + 2) * (z + 2) <= 72) put(x, 0, z, SAND);
for (let x = -12; x <= -4; x++)
  for (let z = -19; z <= -11; z++) {
    const dx = x + 8, dz = z + 15;
    if (dx * dx + dz * dz <= 18) put(x, 0, z, SAND);
  }

// ---- mongoose challenger, up on hind legs facing the cobra ----
const mx = -8, mz = -15;
put(mx - 1, 6, mz + 1, STONE); put(mx + 1, 6, mz + 1, STONE);  // eyes
putCube(mx - 1, 1, mz - 1, mx + 1, 4, mz, PLANKS);             // torso
putCube(mx, 1, mz + 1, mx, 4, mz + 1, SNOW);                   // belly stripe
putCube(mx - 1, 5, mz, mx + 1, 6, mz + 1, PLANKS);             // head
put(mx, 5, mz + 2, OAK_LOG);                                   // snout
put(mx - 1, 7, mz, OAK_LOG); put(mx + 1, 7, mz, OAK_LOG);      // ears
put(mx - 1, 3, mz + 2, OAK_LOG); put(mx + 1, 3, mz + 2, OAK_LOG); // raised paws
put(mx - 1, 0, mz, PLANKS); put(mx + 1, 0, mz, PLANKS);        // feet
put(mx, 1, mz - 2, OAK_LOG); put(mx, 2, mz - 3, OAK_LOG);      // tail
put(mx, 2, mz - 4, OAK_LOG); put(mx, 3, mz - 5, STONE);

// ---- scattered rocks and old bones ----
const rockCol = (x, y, z) => (((x * 7 + z * 13 + y * 5) & 1) ? STONE : COBBLE);
ball(11, 0, -5, 2.2, rockCol);
ball(-12, 0, 3, 1.7, rockCol);
ball(-6, 0, -10, 1.4, rockCol);
ball(13, 0, 2, 1.5, rockCol);
put(4, 1, -10, STONE); put(6, 1, -10, STONE);                  // skull eye sockets
putCube(4, 0, -10, 6, 2, -8, SNOW);                            // victim's skull
put(1, 0, -12, SNOW); put(2, 0, -13, SNOW);                    // stray bones
put(8, 0, -12, SNOW); put(8, 1, -12, SNOW);
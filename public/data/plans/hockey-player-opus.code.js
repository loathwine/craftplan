// hockey-player-opus — prompt:
// an ice hockey player taking a slapshot...

const B = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  B.set(x + ',' + y + ',' + z, id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function tube(a, b, r, idf) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]);
  const n = Math.max(1, Math.ceil(L * 3)), R = Math.ceil(r);
  for (let i = 0; i <= n; i++) {
    const t = i / n, c = [a[0] + d[0] * t, a[1] + d[1] * t, a[2] + d[2] * t];
    for (let x = Math.floor(c[0] - R); x <= Math.ceil(c[0] + R); x++)
      for (let y = Math.floor(c[1] - R); y <= Math.ceil(c[1] + R); y++)
        for (let z = Math.floor(c[2] - R); z <= Math.ceil(c[2] + R); z++)
          if ((x - c[0]) ** 2 + (y - c[1]) ** 2 + (z - c[2]) ** 2 <= r * r)
            put(x, y, z, typeof idf === 'function' ? idf(x, y, z) : idf);
  }
}
function seg(a, b, idf) { tube(a, b, 0.75, idf); }

// ---------- clear rink area + north foreground (trees) ----------
for (let x = -22; x <= 22; x++) for (let z = -12; z <= 12; z++) for (let y = 1; y <= 8; y++) put(x, y, z, AIR);
for (let x = -22; x <= 22; x++) for (let z = -22; z <= -13; z++) for (let y = 1; y <= 8; y++) put(x, y, z, AIR);

// ---------- outdoor rink ----------
function inRink(x, z) {
  const ax = Math.abs(x), az = Math.abs(z);
  if (ax > 21 || az > 10) return false;
  if (ax > 16 && az > 5) return (ax - 16) ** 2 + (az - 5) ** 2 <= 26;
  return true;
}
function isBoard(x, z) {
  if (inRink(x, z)) return false;
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (inRink(x + dx, z + dz)) return true;
  return false;
}
const ADS = [RED, BLUE, WHITE, BLACK, BLUE, RED, WHITE];
for (let x = -22; x <= 22; x++) for (let z = -11; z <= 11; z++) {
  if (inRink(x, z)) {
    let id = WHITE;
    const dc = Math.hypot(x - 1, z - 1);
    if (dc >= 7.5 && dc < 8.5) id = RED;          // faceoff circle
    if (dc < 1.2) id = RED;                        // faceoff dot
    if (x === 11 || x === 12) id = BLUE;           // blue line
    if (x === -14) id = RED;                       // goal line
    const dg = Math.hypot(x + 14, z);
    if (x > -14 && dg <= 6) id = dg > 5.2 ? RED : LIGHT_BLUE; // crease
    put(x, 0, z, id);
  } else if (isBoard(x, z)) {
    put(x, 0, z, STONE);
    put(x, 1, z, YELLOW);
    let top = WHITE;
    if (z >= 11 && Math.abs(x) <= 18) top = ADS[Math.floor((x + 18) / 6) % 7];
    put(x, 2, z, top);
    if (z >= 4 || x <= -17) {                      // safety glass behind the play
      const post = ((x + z) % 5 === 0);
      for (let y = 3; y <= 5; y++) put(x, y, z, post ? IRON : GLASS);
      put(x, 6, z, IRON);
    }
  }
}
// goal light on top of the glass behind the net
put(-22, 7, 0, IRON); put(-22, 8, 0, NEON_RED);

// ---------- floodlights (south corners, shining north onto the ice) ----------
for (const px of [-17, 17]) {
  box(px, 0, 15, px, 17, 15, IRON);
  box(px - 2, 18, 14, px + 2, 19, 15, GRAY);
  box(px - 2, 18, 13, px + 2, 19, 13, GLOWSTONE);
  box(px - 1, 0, 15, px + 1, 0, 16, GRAY);
}

// ---------- puck + ice spray ----------
box(0, 1, -6, 1, 1, -5, BLACK);
[[9, 1, -2], [10, 2, -1], [10, 1, 0], [11, 2, -2], [11, 3, 0], [12, 2, 1], [9, 2, 1], [12, 1, -1], [13, 3, 1], [11, 1, 1], [13, 2, -1]]
  .forEach(p => put(p[0], p[1], p[2], SNOW));

// ================= SHOOTER: faces north, winding up a slapshot to the east =================
// skates
for (const sx of [-3, 7]) {
  box(sx, 1, -3, sx + 1, 1, 1, IRON);
  box(sx, 2, -3, sx + 1, 3, 1, BLACK);
  box(sx, 2, -4, sx + 1, 2, -4, BLACK);
  put(sx, 3, -3, WHITE); put(sx + 1, 3, -3, WHITE);
  box(sx, 3, 1, sx + 1, 3, 1, WHITE);
}
// socks over shin guards (red with white/black hoops)
const sock = (x, y, z) => y === 5 ? WHITE : (y === 6 ? BLACK : RED);
tube([-2.5, 4, -1], [-1.5, 7.5, -2], 1.3, sock);
tube([7.5, 4, -1], [6.5, 7.5, -1.5], 1.3, sock);
// thighs + hockey pants
tube([-1.5, 7.5, -2], [0.5, 10, 0], 1.6, BLACK);
tube([6.5, 7.5, -1.5], [4.5, 10, 0], 1.6, BLACK);
box(-1, 9, -2, 6, 11, 2, BLACK);
box(-2, 10, -2, 7, 11, 1, BLACK);
box(-2, 9, 0, -2, 11, 0, RED); box(7, 9, 0, 7, 11, 0, RED);
// jersey torso
for (let y = 12; y <= 17; y++) for (let x = -1; x <= 6; x++) for (let z = -2; z <= 2; z++) {
  if ((x === -1 || x === 6) && Math.abs(z) === 2) continue;
  put(x, y, z, y === 12 ? BLACK : (y === 13 || y === 16) ? WHITE : RED);
}
// shoulder pads
for (let x = -2; x <= 7; x++) for (let z = -2; z <= 2; z++) {
  if ((x === -2 || x === 7) && Math.abs(z) === 2) continue;
  put(x, 17, z, RED);
}
box(-2, 16, -1, -2, 16, 1, RED); box(7, 16, -1, 7, 16, 1, RED);
// chest crest
box(1, 14, -3, 4, 15, -3, WHITE); box(2, 14, -3, 3, 15, -3, BLACK);
// number on the back
box(1, 14, 3, 1, 15, 3, WHITE); box(3, 14, 3, 4, 14, 3, WHITE); box(4, 15, 3, 4, 15, 3, WHITE);
// collar + neck
box(1, 18, -1, 4, 18, 1, WHITE); box(2, 18, -1, 3, 18, 0, SAND);
// helmet head
box(0, 19, -2, 5, 22, 1, BLACK);
box(1, 23, -2, 4, 23, 0, BLACK);
box(2, 23, -2, 3, 23, 1, RED); box(2, 22, 2, 3, 22, 2, RED);
box(1, 19, -3, 4, 20, -3, SAND);                 // face
put(1, 20, -3, BLACK); put(4, 20, -3, BLACK);    // eyes
put(2, 19, -3, WHITE); put(3, 19, -3, WHITE);    // mouthguard grit
box(0, 21, -3, 5, 21, -3, BLACK);                // helmet brim
box(1, 22, -3, 4, 22, -3, BLACK);
box(0, 20, -4, 5, 21, -4, GLASS);                // visor
put(0, 19, -3, BLACK); put(5, 19, -3, BLACK);    // chin straps
put(-1, 20, -1, GRAY); put(6, 20, -1, GRAY);     // ear guards
// arms
tube([-2, 16, 0], [0, 13.5, -3], 1.3, RED);
tube([0, 13.5, -3], [3, 15, -4.8], 1.15, (x, y, z) => x === 2 ? WHITE : RED);
tube([7, 16, 0], [9.5, 16.5, -1.5], 1.3, RED);
tube([9.5, 16.5, -1.5], [8.5, 19, -3.3], 1.15, (x, y, z) => y === 18 ? WHITE : RED);
put(-1, 13, -3, BLACK); put(10, 16, -2, BLACK);  // elbow pads
// stick: wooden shaft raised at ~45 degrees, knob below the top hand
const K = [1.5, 13, -5.5], E = [15, 25.5, -1.7];
const shaft = (x, y, z) => (y <= 13 ? WHITE : (y === 21 ? RED : PLANKS));
seg(K, E, shaft);
seg([K[0] + 1, K[1], K[2]], [E[0] + 1, E[1], E[2]], shaft);
// blade (white tape with black stripes), curved toe
box(15, 25, -2, 20, 26, -2, WHITE);
put(21, 25, -2, WHITE); put(21, 24, -2, WHITE);
box(15, 24, -2, 16, 24, -2, BLACK);
put(17, 25, -2, BLACK); put(19, 25, -2, BLACK);
put(20, 26, -1, WHITE); put(21, 25, -1, WHITE);
// gloves gripping the shaft
box(3, 14, -6, 5, 16, -4, BLACK); box(3, 14, -5, 3, 16, -4, RED); put(4, 16, -6, RED);
box(8, 18, -4, 10, 20, -2, BLACK); box(8, 18, -3, 8, 18, -2, RED); put(9, 20, -4, RED);

// ================= GOAL (west end, mouth facing east) =================
const GX = -14;
const h = x => x >= -16 ? 12 : Math.round(1 + (x + 20) * 11 / 4);
for (let x = -20; x <= GX; x++) for (const zs of [-9, 9]) {
  for (let y = 1; y <= h(x); y++) if ((x + y) % 2 === 0) put(x, y, zs, WHITE);
}
for (let z = -8; z <= 8; z++) {
  for (let y = 1; y <= 12; y++) { const x = Math.round(-20 + (y - 1) * 4 / 11); if ((y + z) % 2 === 0) put(x, y, z, WHITE); }
  for (let x = -16; x <= -15; x++) if ((x + z) % 2 === 0) put(x, 12, z, WHITE);
}
box(-20, 1, -9, -20, 1, 9, RED);
for (const zs of [-9, 9]) {
  box(-20, 1, zs, GX, 1, zs, RED);
  box(GX, 1, zs, GX, 12, zs, RED);
  seg([-16, 12, zs], [-20, 1, zs], RED);
  box(-16, 12, zs, GX, 12, zs, RED);
}
box(GX, 12, -9, GX, 12, 9, RED);

// ================= GOALIE (faces east toward the shooter) =================
for (const zs of [-1, 1]) {
  const z0 = zs < 0 ? -5 : 3, z1 = z0 + 2;
  box(-11, 1, z0, -9, 1, z1, IRON);
  for (let y = 2; y <= 6; y++) {
    const shift = y >= 5 ? -zs : 0;
    box(-11, y, z0 + shift, -9, y, z1 + shift, (y === 3 || y === 6) ? BLUE : WHITE);
  }
  box(-8, 1, z0, -8, 2, z1, WHITE);                 // pad toe
  box(-12, 7, z0 - zs, -8, 7, z1 - zs, WHITE);      // knee roll
}
box(-12, 8, -4, -9, 9, 4, BLUE);                    // pants
box(-12, 10, -4, -9, 10, 4, BLUE);
box(-12, 11, -4, -8, 11, 4, WHITE);                 // jersey stripe
box(-11, 12, -4, -8, 14, 4, BLUE);                  // chest, leaning forward
box(-8, 12, -1, -7, 13, 1, WHITE); put(-7, 12, 0, BLUE); // crest
box(-11, 14, -5, -9, 14, -4, WHITE); box(-11, 14, 4, -9, 14, 5, WHITE); // shoulder caps
// mask
for (let x = -10; x <= -6; x++) for (let y = 14; y <= 18; y++) for (let z = -2; z <= 2; z++) {
  if (y === 18 && (Math.abs(z) === 2 || x === -10 || x === -6)) continue;
  if (x === -6 && Math.abs(z) === 2) continue;
  put(x, y, z, (y === 18 || (y === 17 && Math.abs(z) === 2)) ? BLUE : WHITE);
}
box(-11, 15, -1, -11, 17, 1, WHITE);
for (let y = 14; y <= 16; y++) for (let z = -1; z <= 1; z++) put(-5, y, z, (y + z) % 2 === 0 ? IRON : BLACK);
put(-6, 16, -1, BLACK); put(-6, 16, 1, BLACK);
// catching glove (north side, toward camera)
tube([-10, 13, -4.5], [-7.5, 11.5, -7.5], 1.2, BLUE);
box(-7, 10, -10, -5, 13, -7, WHITE);
box(-5, 11, -9, -5, 12, -8, BROWN);
box(-6, 13, -10, -4, 14, -9, WHITE);
put(-4, 12, -10, BLUE); put(-7, 10, -10, BLUE);
// blocker (south side)
tube([-10, 13, 4.5], [-7, 10, 7], 1.2, BLUE);
box(-5, 7, 6, -5, 11, 8, WHITE);
box(-5, 7, 6, -5, 7, 8, BLUE); box(-5, 11, 6, -5, 11, 8, BLUE);
box(-6, 9, 6, -6, 10, 7, BLUE);
// goalie stick, paddle down, blade covering the five-hole
seg([-6, 9, 6], [-5, 4, 4], BLACK);
box(-5, 2, 3, -5, 4, 4, BLACK);
box(-5, 1, -2, -5, 1, 4, BLACK);
put(-5, 1, -2, WHITE);

// ---------- emit ----------
for (const [k, id] of B) { const p = k.split(',').map(Number); block(p[0], p[1], p[2], id); }
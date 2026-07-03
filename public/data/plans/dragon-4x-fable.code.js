// dragon-4x-fable — prompt:
// a fire-breathing dragon...

// A fire-breathing dragon rearing over a burning, ruined watchtower.
// Gray scaled body, red wing membranes, white horns/claws, glowing gullet,
// fire cone blasting the tower top, scorched burn corridor with charred snag.

const rnd = (a, b) => a + Math.random() * (b - a);
const fireBlock = () => (Math.random() < 0.45 ? SAND : BRICK);

function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  block(x, y, z, id);
}

// chain of interpolated spheres along waypoints [x,y,z,r]
function chain(pts, id) {
  for (let s = 0; s < pts.length - 1; s++) {
    const a = pts[s], b = pts[s + 1];
    const d = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]));
    const n = Math.max(1, Math.ceil(d / 1.5));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      sphere(Math.round(a[0] + (b[0] - a[0]) * t),
             Math.round(a[1] + (b[1] - a[1]) * t),
             Math.round(a[2] + (b[2] - a[2]) * t),
             a[3] + (b[3] - a[3]) * t, id);
    }
  }
}

// ---------- burn corridor: clear forest between dragon and its target ----------
cube(-6, 2, -22, 3, 9, -12, AIR);

// ---------- ruined watchtower (the fire's target), center (-2,-18) ----------
const TX = -2, TZ = -18;
hollowCylinder(TX, -1, TZ, 2.5, 12, COBBLE); // y -1..10
// stone mottling on the walls
const ring = [[-2,-1],[-2,0],[-2,1],[2,-1],[2,0],[2,1],[-1,-2],[0,-2],[1,-2],[-1,2],[0,2],[1,2]];
for (let i = 0; i < 16; i++) {
  const c = ring[Math.floor(rnd(0, ring.length))];
  put(TX + c[0], Math.floor(rnd(0, 10)), TZ + c[1], STONE);
}
// merlons
for (const c of [[2,0],[-2,0],[0,2],[0,-2],[1,-2],[-1,2]]) put(TX + c[0], 11, TZ + c[1], COBBLE);
// door (south, facing dragon) with firelight inside
cube(TX, 1, TZ + 2, TX + 1, 2, TZ + 2, AIR);
put(TX, 1, TZ + 1, SAND); put(TX + 1, 1, TZ + 1, SAND);
// glowing windows
cube(0, 3, -18, 0, 4, -18, AIR);   put(-1, 3, -18, SAND); put(-1, 4, -18, SAND);
cube(-4, 5, -18, -4, 6, -18, AIR); put(-3, 5, -18, SAND); put(-3, 6, -18, SAND);
cube(-2, 4, -16, -2, 5, -16, AIR); put(-2, 4, -17, SAND); put(-2, 5, -17, SAND);
// burning interior + charred roof beams
disk(TX, 9, TZ, 1.5, BRICK);
line(-4, 10, -20, 0, 10, -17, OAK_LOG);
line(-4, 9, -16, -1, 10, -20, OAK_LOG);
// blast bite: south-east top wall torn open, embers on the broken rim
cube(-3, 8, -17, 0, 12, -15, AIR);
for (const p of [[-3,8,-16],[-2,8,-16],[-1,8,-16],[0,8,-17],[-3,9,-17]]) put(p[0], p[1], p[2], fireBlock());

// ---------- dragon body: STONE scales, rearing, head high over the tower ----------
const spine = [
  [0, 6.5, 10, 3.4],   // hips
  [0, 8,   6, 3.8],
  [0, 9.5, 2, 3.9],    // chest
  [0, 11.5, -1, 3.1],  // shoulders
  [0, 13.5, -3.5, 2.5],
  [0, 15.8, -5.5, 2.2],
  [0, 18, -7, 2.0],
  [0, 20, -8.5, 1.9],  // neck top
];
chain(spine, STONE);

// cobble mottling on the torso hide
for (let i = 0; i < 55; i++) {
  const p = spine[Math.floor(rnd(0, 4))];
  const th = rnd(0, Math.PI * 2), ph = rnd(0, Math.PI);
  put(p[0] + Math.sin(ph) * Math.cos(th) * p[3],
      p[1] + Math.cos(ph) * p[3],
      p[2] + Math.sin(ph) * Math.sin(th) * p[3], COBBLE);
}

// ---------- wings (before legs so inner membrane tucks into the haunches) ----------
for (const s of [1, -1]) {
  line(3 * s, 12, -1, 10 * s, 18, 0, OAK_LOG);   // upper arm
  line(3 * s, 13, -1, 10 * s, 19, 0, OAK_LOG);
  line(10 * s, 18, 0, 18 * s, 24, 2, OAK_LOG);   // leading edge
  line(10 * s, 19, 0, 18 * s, 25, 2, OAK_LOG);
  // red membrane, scalloped trailing edge, swept back and down
  for (let i = 4; i <= 18; i++) {
    const u = (i - 4) / 14;
    const yle = 13 + 11 * u;
    const zle = -1 + 3 * u;
    const chord = 11 - 8 * u - 2.2 * Math.max(0, Math.sin(u * Math.PI * 3));
    for (let dz = 1; dz <= chord; dz++) {
      const y = Math.round(yle - dz * 0.9);
      put(i * s, y, zle + dz, BRICK);
      put(i * s, y - 1, zle + dz, BRICK);
    }
  }
  // finger ribs across the membrane
  line(10 * s, 18, 0, 16 * s, 19, 6, OAK_LOG);
  line(10 * s, 18, 0, 15 * s, 18, 5, OAK_LOG);
  line(10 * s, 18, 0, 12 * s, 14, 7, OAK_LOG);
  // wing claw
  put(19 * s, 25, 2, SNOW); put(19 * s, 24, 1, SNOW); put(20 * s, 23, 1, SNOW);
}

// ---------- legs ----------
for (const s of [1, -1]) {
  // hind: haunch, shank, foot planted on the ground
  sphere(4 * s, 5, 9, 2.9, STONE);
  chain([[4 * s, 4, 9, 1.7], [5 * s, 1.5, 10, 1.2]], STONE);
  cube(4 * s - 1, 0, 7, 4 * s + 1, 1, 11, STONE);
  cube(4 * s - 1, -2, 7, 4 * s + 1, -1, 11, STONE); // foundation into terrain
  put(4 * s - 1, 0, 6, SNOW); put(4 * s, 0, 6, SNOW); put(4 * s + 1, 0, 6, SNOW);
  put(4 * s, 0, 5, SNOW); // long middle talon
  // front: raised, claws splayed toward the tower
  chain([[3 * s, 10, -1, 1.4], [4 * s, 7, -3, 1.2], [4 * s, 5, -5, 1.0]], STONE);
  put(3 * s, 4, -6, SNOW); put(4 * s, 4, -6, SNOW); put(5 * s, 4, -6, SNOW);
}

// ---------- belly plates + glowing gullet ----------
cube(-1, 3, 9, 1, 4, 11, PLANKS);
cube(-1, 4, 5, 1, 5, 7, PLANKS);
cube(-1, 6, 1, 1, 7, 3, PLANKS);
cube(-1, 8, -3, 1, 9, -2, PLANKS);
line(0, 10, -4, 0, 12, -6, SAND);
line(0, 12, -6, 0, 15, -7, SAND);
line(0, 15, -7, 0, 17, -9, SAND);
line(0, 17, -9, 0, 19, -10, SAND);

// ---------- dorsal spikes ----------
for (let i = 0; i < spine.length; i++) {
  const p = spine[i];
  put(p[0], p[1] + p[3], p[2], BRICK);
  if (i < 4) put(p[0], p[1] + p[3] + 1, p[2], BRICK);
  if (i < spine.length - 1) {
    const q = spine[i + 1];
    put((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + (p[3] + q[3]) / 2, (p[2] + q[2]) / 2, BRICK);
  }
}

// ---------- tail: drags east then curls up with a spade ----------
const tail = [
  [0, 6, 11, 2.5],
  [2, 4.5, 14, 2.0],
  [5, 3, 17, 1.7],
  [9, 2, 19, 1.4],
  [13, 1.5, 20, 1.2],
  [16, 2, 19, 1.0],
  [19, 2.5, 16, 0.9],
  [21, 3.5, 14, 0.8],
];
chain(tail, STONE);
for (let i = 1; i < tail.length; i++) put(tail[i][0], tail[i][1] + tail[i][3], tail[i][2], BRICK);
for (const p of [[21,4,13],[21,5,13],[21,6,13],[21,5,12],[21,5,14],[22,5,13],[20,5,13]]) put(p[0], p[1], p[2], BRICK);

// ---------- head: jaws wide open, mid-breath ----------
sphere(0, 21, -10, 2.4, STONE);
cube(-2, 20, -11, 2, 22, -9, STONE);   // cheeks / jaw base
cube(-1, 21, -15, 1, 21, -12, STONE);  // upper snout
cube(-1, 22, -13, 1, 22, -11, STONE);
cube(-2, 23, -11, 2, 23, -9, STONE);   // heavy brow
put(-2, 22, -10, SAND); put(2, 22, -10, SAND); // glowing eyes
for (const s of [1, -1]) {
  line(2 * s, 23, -9, 4 * s, 26, -5, SNOW);    // swept-back horns
  line(2 * s, 22, -9, 4 * s, 25, -5, SNOW);
  put(3 * s, 21, -10, SNOW);                    // cheek spike
}
line(0, 24, -8, 0, 25, -6, BRICK); put(0, 23, -7, BRICK); // crest
// lower jaw dropped open
cube(-1, 19, -12, 1, 20, -11, STONE);
cube(-1, 18, -14, 1, 19, -13, STONE);
cube(-1, 17, -15, 1, 17, -14, STONE);
put(0, 16, -14, SNOW); // chin spike
// fangs
put(-1, 20, -15, SNOW); put(1, 20, -15, SNOW);
put(-1, 20, -12, SNOW); put(1, 20, -12, SNOW);
put(0, 18, -15, SNOW); put(-1, 18, -13, SNOW); put(1, 18, -13, SNOW);
// fire boiling inside the mouth
put(0, 19, -13, SAND); put(0, 20, -14, SAND); put(0, 19, -14, SAND); put(0, 20, -13, BRICK);

// ---------- the fire breath: cone from mouth down onto the tower ----------
for (let i = 0; i <= 16; i++) {
  const t = i / 16;
  const cx = -2.2 * t;
  const cy = 19.5 - 8.5 * Math.pow(t, 1.25);
  const cz = -14 - 4.8 * t;
  const r = 0.8 + 2.4 * t;
  const n = Math.ceil(r * r * 6);
  for (let k = 0; k < n; k++) {
    const dx = rnd(-r, r), dy = rnd(-r, r), dz = rnd(-r, r);
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 > r * r) continue;
    put(cx + dx, cy + dy, cz + dz, d2 < r * r * 0.3 ? SAND : fireBlock());
  }
}
// impact splash wrapping the tower top
for (let a = 0; a < 12; a++) {
  const th = (a / 12) * Math.PI * 2;
  const rr = rnd(2.6, 3.8);
  const fx = TX + Math.cos(th) * rr, fz = TZ + Math.sin(th) * rr;
  const h = Math.floor(rnd(1, 4));
  for (let y = 11; y <= 11 + h; y++) put(fx, y, fz, fireBlock());
}
// flames licking down the south face, sparks drifting off the stream
for (let i = 0; i < 8; i++) put(rnd(-4, 0), rnd(6, 10), -15, fireBlock());
for (let i = 0; i < 15; i++) {
  const t = Math.random();
  put(-2.2 * t + rnd(-3.5, 3.5), 19 - 8 * t + rnd(0, 4.5), -14 - 4.8 * t + rnd(-3, 3),
      Math.random() < 0.6 ? SAND : BRICK);
}

// ---------- scorched ground, burning stumps, charred snag, rubble ----------
line(-4, 1, -13, -4, 6, -13, OAK_LOG);   // dead snag
line(-4, 5, -13, -6, 8, -14, OAK_LOG);
line(-4, 6, -13, -2, 8, -12, OAK_LOG);
put(-6, 9, -14, BRICK); put(-2, 9, -12, SAND); // branch tips alight
put(1, 2, -13, BRICK); put(1, 3, -13, SAND);   // sheared stump, burning
put(0, 2, -20, BRICK); put(0, 3, -20, SAND);
for (let i = 0; i < 16; i++) put(rnd(-6, 2), 0, rnd(-16, -11), COBBLE);      // scorched earth
for (let i = 0; i < 9; i++) put(rnd(-5, 1), 1, rnd(-15, -12), fireBlock());  // ground fires
for (const d of [[1,1,-14],[-4,1,-14],[2,1,-12],[-1,1,-13],[0,1,-12]]) put(d[0], d[1], d[2], COBBLE); // fallen rubble

// ---------- smoke rising off the blaze ----------
sphere(1, 15, -18, 1.2, SNOW);
sphere(3, 18, -17, 1.5, SNOW);
sphere(6, 21, -16, 1.8, SNOW);
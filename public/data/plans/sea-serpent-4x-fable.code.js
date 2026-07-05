// sea-serpent-4x-fable — prompt:
// a sea serpent...

const W = new Map();
const RX = 20, RZ = 13;
const K = (x,y,z) => x + ',' + y + ',' + z;

function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  W.set(K(x,y,z), [x,y,z,id]);
}

function box(x1,y1,z1,x2,y2,z2,id) {
  for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++)
    for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++)
      for (let z = Math.min(z1,z2); z <= Math.max(z1,z2); z++)
        put(x,y,z,id);
}

function line3(x1,y1,z1,x2,y2,z2,id) {
  const n = Math.max(Math.abs(x2-x1), Math.abs(y2-y1), Math.abs(z2-z1), 1);
  for (let i = 0; i <= n; i++)
    put(x1+(x2-x1)*i/n, y1+(y2-y1)*i/n, z1+(z2-z1)*i/n, id);
}

// body ball: skips deep underwater voxels (hidden below glass), sandy belly
function ball(cx, cy, cz, r, id, belly) {
  for (let x = Math.floor(cx-r); x <= Math.ceil(cx+r); x++)
    for (let y = Math.floor(cy-r); y <= Math.ceil(cy+r); y++)
      for (let z = Math.floor(cz-r); z <= Math.ceil(cz+r); z++) {
        if (y < -1) continue;
        const dx = x-cx, dy = y-cy, dz = z-cz;
        if (dx*dx + dy*dy + dz*dz <= r*r + 0.4)
          put(x, y, z, (belly && dy < -0.35*r) ? SAND : id);
      }
}

function foam(cx, cz, R) {
  for (let a = 0; a < 26; a++) {
    const A = a * Math.PI * 2 / 26;
    const rr = R + ((a % 5 === 0) ? 1 : 0);
    const x = Math.round(cx + rr * Math.cos(A));
    const z = Math.round(cz + rr * Math.sin(A));
    if ((x*x)/(RX*RX) + (z*z)/(RZ*RZ) > 1.0) continue;
    const e = W.get(K(x,1,z));
    if (e && e[3] !== AIR) continue;
    put(x, 1, z, SNOW);
  }
}

// ---- lagoon: glass water bowl + sand beach ring, clear trees above ----
for (let x = -RX; x <= RX; x++) {
  for (let z = -RZ; z <= RZ; z++) {
    const d = (x*x)/(RX*RX) + (z*z)/(RZ*RZ);
    const w = 0.1 * Math.sin(x*0.55 + 2) * Math.cos(z*0.5);
    if (d < 0.8 + w) {
      put(x, 0, z, GLASS);
      put(x, -1, z, GLASS);
      for (let y = 1; y <= 8; y++) put(x, y, z, AIR);
    } else if (d < 1.02 + w) {
      put(x, 0, z, SAND);
      put(x, -1, z, SAND);
      for (let y = 1; y <= 8; y++) put(x, y, z, AIR);
    }
  }
}

// wave crests on the surface
line3(-10,0,-7, -4,0,-10, ICE);
line3(0,0,8, 7,0,10, ICE);
line3(-16,0,-2, -12,0,-5, ICE);
line3(14,0,4, 17,0,2, ICE);

// ---- serpent body: three coils rising out of the water ----
function finPair(x, y, z, rr) {
  for (const s of [-1, 1]) {
    for (let k = 0; k <= 3; k++) {
      const zz = Math.round(z + s*(rr + k*0.9));
      const yy = Math.round(y + 1.2 - k);
      put(Math.round(x), yy, zz, LEAVES);
      put(Math.round(x), yy-1, zz, BRICK);
      if (k < 2) {
        put(Math.round(x)+1, yy, zz, LEAVES);
        put(Math.round(x)+1, yy-1, zz, BRICK);
      }
    }
  }
}

const N = 150;
let above = false, first = true;
for (let i = 0; i <= N; i++) {
  const u = i / N;
  const x = -16 + 26*u;
  const z = 7.5 * Math.sin(u*Math.PI*2.1 + 2.6) * (1 - 0.25*u);
  const amp = 6.5 + 5*u;
  const yc = -3.2 + amp * Math.pow(Math.abs(Math.sin(u*Math.PI*3)), 1.35);
  const r = 1.0 + 2.0 * Math.sin(Math.PI*(0.08 + 0.75*u));
  ball(x, yc, z, r, LEAVES, true);
  const a = yc >= -0.6;
  if (!first && a !== above) foam(x, z, r + 1.0);
  above = a; first = false;
  if (yc + r >= 0.6) {
    const tx = Math.round(x), tz = Math.round(z), ty = Math.round(yc + r - 0.3);
    put(tx, ty, tz, BRICK);
    if (i % 5 === 0) {
      put(tx, ty+1, tz, BRICK);
      if (yc > 3) put(tx, ty+2, tz, BRICK);
    }
  }
  if (i === 75 || i === 125) finPair(x, yc, z, r);
}

// tail fluke breaching near the tail tip
const fh = [3, 5, 6, 4, 2];
for (let j = 0; j < 5; j++) {
  const fx = -17 + j;
  for (let y = 0; y <= fh[j]; y++) put(fx, y, 4, LEAVES);
  put(fx, fh[j], 4, BRICK);
}

// ---- neck: rises from the water, leans out, head curls back over the lagoon ----
const z1 = 7.5 * Math.sin(Math.PI*2.1 + 2.6) * 0.75;
const NM = 48;
for (let i = 0; i <= NM; i++) {
  const v = i / NM;
  const x = 10 + 6.5 * Math.sin(v*Math.PI);
  const y = -2 + 19.5*v;
  const z = z1 * (1 - 0.85*v);
  const rr = 2.2 - 0.7*v;
  ball(x, y, z, rr, LEAVES, true);
  if (i % 2 === 0 && v > 0.08 && y > 1)
    put(Math.round(x + rr*0.9), Math.round(y + 0.6), Math.round(z), BRICK);
}
foam(12, 1, 3);

// ---- head at (10,18,0), facing -x, jaws open over the boat ----
ball(10, 18, 0, 2.8, LEAVES, false);
// upper jaw: green top, red mouth-roof underside
box(3, 20, -1, 9, 20, 1, LEAVES);
box(3, 19, -1, 9, 19, 1, BRICK);
box(4, 21, 0, 8, 21, 0, LEAVES);
// upper fangs
put(3,18,-1,SNOW); put(3,18,1,SNOW);
put(5,18,-1,SNOW); put(5,18,1,SNOW);
put(7,18,-1,SNOW); put(7,18,1,SNOW);
// lower jaw: green underside first, red inner surface on top
box(6, 14, -1, 8, 14, 1, LEAVES);
box(4, 13, -1, 6, 13, 1, LEAVES);
box(3, 12, -1, 4, 12, 1, LEAVES);
box(8, 16, -1, 9, 16, 1, BRICK);
box(6, 15, -1, 8, 15, 1, BRICK);
box(4, 14, -1, 6, 14, 1, BRICK);
box(3, 13, -1, 4, 13, 1, BRICK);
// lower fangs
put(3,14,0,SNOW);
put(5,15,-1,SNOW); put(5,15,1,SNOW);
put(7,16,-1,SNOW); put(7,16,1,SNOW);
// eyes + brows
put(8,19,-2,BRICK); put(8,19,2,BRICK);
put(7,20,-2,LEAVES); put(8,20,-2,LEAVES);
put(7,20,2,LEAVES); put(8,20,2,LEAVES);
// crest running down the back of the skull
put(9,21,0,BRICK); put(10,21,0,BRICK); put(11,21,0,BRICK);
put(12,20,0,BRICK); put(12,19,0,BRICK); put(13,18,0,BRICK);
// bone horns sweeping up and back
line3(11,20,1, 14,24,2, SNOW); put(15,25,2,SNOW);
line3(11,20,-1, 14,24,-2, SNOW); put(15,25,-2,SNOW);

// ---- doomed rowboat under the head ----
box(0, 1, -5, 6, 1, -3, PLANKS);
for (let x = 1; x <= 5; x++) { put(x,2,-5,PLANKS); put(x,2,-3,PLANKS); }
box(0, 2, -5, 0, 2, -3, PLANKS);
box(6, 2, -5, 6, 2, -3, PLANKS);
put(-1,2,-4,PLANKS); put(7,2,-4,PLANKS);
line3(3,2,-4, 5,6,-4, OAK_LOG);
put(5,5,-3,SNOW); put(5,4,-3,SNOW); put(4,4,-3,SNOW);
foam(3, -4, 4);

// ---- rocks, moss, reeds ----
ball(-13, 0, -8, 2.3, STONE, false);
ball(-12, 2, -7, 1.2, LEAVES, false);
ball(12, 0, -8, 1.8, COBBLE, false);
ball(-18, 0, 8, 1.6, COBBLE, false);
const reeds = [[-19,1],[-18,5],[15,8],[18,-5],[5,12],[-6,12],[-2,-12],[9,-11],[-15,-9]];
reeds.forEach(([x,z], i) => {
  const h = 2 + (i % 2);
  for (let y = 1; y <= h; y++) put(x, y, z, LEAVES);
});

// ---- flush (deduped, last write wins) ----
for (const [, p] of W) block(p[0], p[1], p[2], p[3]);
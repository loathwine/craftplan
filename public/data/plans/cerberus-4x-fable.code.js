// cerberus-4x-fable — prompt:
// Cerberus, the three-headed dog...

// Cerberus, the three-headed hellhound — guarding the gate of the underworld.
// Standing snarling on a lava-veined hell-mound, serpent tail, spiked collars,
// fire-breath from the center head, bone piles, braziers and an iron gate behind.

const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  if (typeof id === "function") id = id(x, y, z);
  M.set(x + "," + y + "," + z, id);
}
function del(x, y, z) {
  M.delete(Math.round(x) + "," + Math.round(y) + "," + Math.round(z));
}
function h3(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
const rockMix = (x, y, z) => h3(x, y, z) < 0.35 ? COBBLE : STONE;
const furMix  = (x, y, z) => h3(x, y, z) < 0.18 ? COBBLE : STONE;
const gateMix = (x, y, z) => h3(x, y, z) < 0.5 ? COBBLE : STONE;

function eball(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
  for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
    const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
    if (a * a + b * b + c * c <= 1.06) put(x, y, z, id);
  }
}
function tube(x1, y1, z1, x2, y2, z2, r1, r2, id) {
  const d = Math.hypot(x2 - x1, y2 - y1, z2 - z1), n = Math.max(2, Math.ceil(d * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n, r = r1 + (r2 - r1) * t;
    eball(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r, r, r, id);
  }
}

// ---- clear forest canopy over the site (stumps at ground level stay: scorched land) ----
cube(-18, 1, -17, 18, 9, 22, AIR);

// ---- hell-mound pedestal ----
const rings = [[-1, 9, 10], [0, 8.5, 9.5], [1, 7, 8], [2, 5.5, 6.5], [3, 4.5, 5.5], [4, 3, 4]];
for (const [y, rx, rz] of rings)
  for (let x = -10; x <= 10; x++)
  for (let z = -8; z <= 14; z++) {
    const a = x / rx, b = (z - 3) / rz;
    if (a * a + b * b <= 1.03) put(x, y, z, rockMix);
  }
// lava veins crawling up the slopes
for (const a of [0.5, 1.4, 2.4, 3.3, 4.2, 5.3])
  for (const [y, rx, rz] of rings) {
    put(Math.cos(a) * rx * 0.92, y, 3 + Math.sin(a) * rz * 0.92, BRICK);
    put(Math.cos(a) * rx * 0.72, y, 3 + Math.sin(a) * rz * 0.72, BRICK);
  }
// boulders
eball(-8, 0, 10, 1.6, 1.3, 1.6, rockMix);
eball(9, 0, -3, 1.4, 1.2, 1.4, rockMix);
eball(7, 0, 9, 1.3, 1.1, 1.3, rockMix);

// ---- fires around the mound ----
function flame(x, z, h) {
  for (let y = -2; y <= 0; y++)
    for (let dx = 0; dx <= 1; dx++)
      for (let dz = 0; dz <= 1; dz++) put(x + dx, y, z + dz, BRICK);
  for (let y = 1; y <= h; y++) put(x + (y % 2), y, z + ((y >> 1) % 2), BRICK);
}
flame(-12, -5, 4); flame(12, 1, 3); flame(-9, 9, 3);
flame(10, -8, 4); flame(13, 10, 3); flame(-12, 15, 4);
flame(-1, -13, 5); // pool where the fire-breath lands

// ---- bones of past visitors ----
eball(-12, 0, -8, 1.3, 1.1, 1.5, SNOW);        // skull
eball(-12, -0.2, -9.8, 0.8, 0.6, 0.9, SNOW);   // snout
for (const rx of [11, 12, 13])                  // ribcage
  for (let i = 0; i <= 8; i++) {
    const t = Math.PI * i / 8;
    put(rx, -1 + 2.4 * Math.sin(t), -6 + 2.4 * Math.cos(t), SNOW);
  }
for (let x = 11; x <= 13; x++) put(x, -1, -8.2, SNOW);
eball(11, -1, 13, 1.1, 0.9, 1.2, SNOW);         // second half-buried skull
put(2, 4, 6, SNOW); put(2, 4, 7, SNOW);          // gnawed bones on the mound
put(-3, 4, 4, SNOW); put(-2, 4, 4, SNOW);

// ---- legs & paws ----
function leg(x0, z0, y0) {
  for (let x = x0; x <= x0 + 1; x++)
  for (let z = z0; z <= z0 + 1; z++)
  for (let y = y0; y <= 10; y++) put(x, y, z, furMix);
}
function paw(x0, z0, yb) {
  for (let x = x0; x <= x0 + 2; x++)
  for (let z = z0; z <= z0 + 3; z++)
  for (let y = yb; y <= yb + 1; y++) put(x, y, z, furMix);
  for (const dx of [0, 1, 2]) put(x0 + dx, yb, z0 - 1, SNOW); // claws
}
paw(2, -5, 2); paw(-4, -5, 2); leg(2, -4, 4); leg(-3, -4, 4);   // front
paw(2, 4, 4);  paw(-4, 4, 4);  leg(2, 5, 6);  leg(-3, 5, 6);    // hind, higher on the rock
eball(3.4, 10, 6.5, 1.9, 2.9, 2.9, furMix);    // haunches
eball(-3.4, 10, 6.5, 1.9, 2.9, 2.9, furMix);
eball(3.2, 11.5, -3, 1.7, 2.4, 2.1, furMix);   // shoulders
eball(-3.2, 11.5, -3, 1.7, 2.4, 2.1, furMix);

// ---- body ----
eball(0, 12.5, 2, 4.3, 3.6, 6.8, furMix);      // barrel
eball(0, 13, -2.5, 4.7, 3.8, 3.4, furMix);     // broad chest
eball(0, 14.5, -3, 3.2, 2.6, 2.6, furMix);     // withers / neck root
// hackles along the spine
for (let z = -2; z <= 8; z += 2) {
  const t = (z - 2) / 6.8, top = 12.5 + 3.6 * Math.sqrt(Math.max(0, 1 - t * t));
  put(0, top + 0.6, z, COBBLE);
  if (z >= 0 && z <= 4) put(0, top + 1.6, z, COBBLE);
}

// ---- serpent tail, rearing behind ----
tube(0, 13.5, 8.2, 0, 16, 11, 1.6, 1.2, furMix);
tube(0, 16, 11, 0, 18.5, 13, 1.2, 1.0, furMix);
tube(0, 18.5, 13, 0, 20.5, 14.2, 1.0, 0.8, furMix);
eball(0, 21.3, 15.2, 1.2, 1.0, 1.7, STONE);    // snake head
put(-1, 21, 16, BRICK); put(1, 21, 16, BRICK); // eyes
put(0, 21, 17, BRICK); put(-1, 21, 18, BRICK); put(1, 21, 18, BRICK); // forked tongue

// ---- three necks ----
tube(0, 15.5, -3, 0, 20, -7, 1.8, 1.4, furMix);
tube(-2.3, 15, -3, -5.6, 18.3, -6.2, 1.7, 1.3, furMix);
tube(2.3, 15, -3, 5.6, 18.3, -6.2, 1.7, 1.3, furMix);
function manes(x1, y1, z1, x2, y2, z2, r) {
  for (const t of [0.3, 0.55, 0.8])
    put(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + r + 0.4, z1 + (z2 - z1) * t + 0.8, COBBLE);
}
manes(0, 15.5, -3, 0, 20, -7, 1.6);
manes(-2.3, 15, -3, -5.6, 18.3, -6.2, 1.5);
manes(2.3, 15, -3, 5.6, 18.3, -6.2, 1.5);
// spiked collars
function collar(x1, y1, z1, x2, y2, z2) {
  const t = 0.55, px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t, pz = z1 + (z2 - z1) * t;
  eball(px, py, pz, 2.3, 0.8, 2.3, BRICK);
  put(px + 2.9, py, pz, SNOW); put(px - 2.9, py, pz, SNOW); put(px, py, pz - 2.9, SNOW);
}
collar(0, 15.5, -3, 0, 20, -7);
collar(-2.3, 15, -3, -5.6, 18.3, -6.2);
collar(2.3, 15, -3, 5.6, 18.3, -6.2);
// snapped chain dangling from the center collar
put(0, 17, -8, COBBLE); put(0, 16, -8, COBBLE); put(1, 15, -8, COBBLE);
put(1, 14, -8, COBBLE); put(0, 13, -8, COBBLE);

// ---- heads ----
function head(cx, cy, cz, side) {
  const sx = cx + side * 1.3;
  eball(cx, cy, cz, 2.3, 2.1, 2.4, STONE);              // skull
  eball(sx, cy - 0.4, cz - 3.1, 1.5, 1.05, 2.1, STONE); // muzzle
  eball(sx, cy - 2.1, cz - 3.3, 1.25, 0.6, 1.8, STONE); // lower jaw
  // carve the open maw
  for (let x = Math.round(sx) - 1; x <= Math.round(sx) + 1; x++)
    for (let z = Math.round(cz) - 5; z <= Math.round(cz) - 3; z++)
      del(x, Math.round(cy) - 1, z);
  // glowing throat + fangs
  for (let x = Math.round(sx) - 1; x <= Math.round(sx) + 1; x++)
    put(x, cy - 1, cz - 2.6, BRICK);
  put(sx - 1, cy - 1, cz - 3.9, SNOW);
  put(sx + 1, cy - 1, cz - 3.9, SNOW);
  put(sx, cy + 0.3, cz - 4.9, COBBLE);                  // nose
  // eyes + brow
  put(cx + side * 0.8 - 1.1, cy + 0.5, cz - 2.2, BRICK);
  put(cx + side * 0.8 + 1.1, cy + 0.5, cz - 2.2, BRICK);
  put(cx + side * 0.8 - 1.1, cy + 1.4, cz - 2.1, COBBLE);
  put(cx + side * 0.8 + 1.1, cy + 1.4, cz - 2.1, COBBLE);
  // ears
  for (const e of [-1.6, 1.6]) {
    put(cx + e, cy + 2, cz + 0.9, COBBLE);
    put(cx + e, cy + 3, cz + 0.9, COBBLE);
    put(cx + e * 0.7, cy + 3.9, cz + 0.9, STONE);
  }
}
head(0, 21.5, -8.5, 0);
head(-6.5, 19.5, -7.5, -1);
head(6.5, 19.5, -7.5, 1);

// fire-breath from the center head down to the burning pool
for (let y = 1; y <= 20; y++) {
  const w = y % 4 === 0 ? 1 : (y % 4 === 2 ? -1 : 0);
  put(w, y, -13 + (y % 2), BRICK);
}

// ---- gate of the underworld (background) ----
for (const s of [-1, 1]) {
  for (let x = 8; x <= 9; x++)
    for (let z = 19; z <= 20; z++) {
      for (let y = -2; y <= 13; y++) put(s * x, y, z, gateMix);
      put(s * x, 14, z, BRICK);                          // brazier bowl
    }
  for (let x = 7; x <= 10; x++)
    for (let z = 18; z <= 21; z++) put(s * x, 13, z, STONE); // cap slab
  put(s * 8, 15, 19, BRICK); put(s * 9, 15, 20, BRICK); put(s * 9, 16, 19, BRICK);
}
for (let x = -7; x <= 7; x++) {
  const y = 13 + 2.6 * (1 - (x / 8) * (x / 8));
  put(x, y, 20, gateMix); put(x, y - 1, 20, gateMix); put(x, y, 19, gateMix);
}
for (const x of [-6, -3, 3, 6]) put(x, 14 + 2.6 * (1 - (x / 8) * (x / 8)), 20, COBBLE);
put(0, 15.6, 20, BRICK); put(0, 14.6, 20, BRICK);        // burning keystone
// iron fence wings
for (const s of [-1, 1]) {
  for (let x = 11; x <= 17; x += 2) {
    for (let y = -2; y <= 3; y++) put(s * x, y, 20, gateMix);
    put(s * x, 4, 20, COBBLE);
  }
  for (let x = 10; x <= 18; x++) put(s * x, 2, 20, STONE);
}
// great chain half-buried between mound and gate pillar
const links = [[4, 2, 9], [5, 1, 10], [5, 0, 11], [6, 0, 12], [6, 0, 13],
               [7, 0, 14], [7, 0, 15], [8, 0, 16], [8, 0, 17], [8, 1, 18], [8, 2, 18]];
for (const [x, y, z] of links) { put(x, y, z, COBBLE); put(x, y - 1, z, COBBLE); }

// ---- flush (deduped; safety-capped under budget) ----
let placed = 0;
for (const [k, v] of M) {
  if (placed >= 3990) break;
  const p = k.split(",");
  block(+p[0], +p[1], +p[2], v);
  placed++;
}
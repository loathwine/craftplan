// basilisk-4x-fable — prompt:
// a basilisk...

const LEAF = LEAVES;
const spine = [];
const P = [
  [0, 6.8, -10, 2.3],
  [0, 4.6, -7, 2.8],
  [-3, 3.9, -3, 3.4],
  [-6, 4.1, 2, 3.6],
  [-4.5, 4.4, 7, 3.6],
  [0, 3.9, 10, 3.3],
  [7, 3.4, 12, 2.9]
];
for (let s = 0; s < P.length - 1; s++) {
  const a = P[s], b = P[s + 1];
  for (let i = 0; i < 8; i++) {
    const t = i / 8;
    spine.push([
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
      a[3] + (b[3] - a[3]) * t
    ]);
  }
}
// tail coil, spiraling inward, tip rising at the end
const ccx = 5.8, ccz = 16.1;
const a0 = Math.atan2(12 - ccz, 7 - ccx);
let tipX = 7, tipY = 4, tipZ = 15;
for (let i = 0; i <= 30; i++) {
  const t = i / 30;
  const a = a0 + t * Math.PI * 2.2;
  const R = 4.3 - 2.9 * t;
  const y = 3.0 - 1.2 * t + (t > 0.85 ? (t - 0.85) * 16 : 0);
  const x = ccx + R * Math.cos(a);
  const z = ccz + R * Math.sin(a);
  spine.push([x, y, z, 2.7 - 1.9 * t]);
  if (i === 30) { tipX = Math.round(x); tipY = Math.round(y); tipZ = Math.round(z); }
}

// ---- PASS 1: carve clearance (trees/canopy) ----
for (const p of spine) {
  sphere(Math.round(p[0]), Math.round(p[1] + 3), Math.round(p[2]), p[3] + 3, AIR);
}
cube(-8, 4, -22, 8, 17, -9, AIR);      // head zone
cube(4, 1, -21, 9, 3, -17, AIR);       // statue spot
sphere(15, 4, 7, 4.5, AIR);            // egg spot

// ---- PASS 2: body ----
for (const p of spine) {
  sphere(Math.round(p[0]), Math.round(p[1]), Math.round(p[2]), p[3], LEAF);
}

// dorsal brick spikes + yellow scale markings
spine.forEach((p, i) => {
  const X = Math.round(p[0]), Z = Math.round(p[2]);
  if (p[3] > 1.4 && i % 4 === 1) {
    const top = Math.round(p[1] + p[3]);
    block(X, top, Z, BRICK);
    block(X, top + 1, Z, BRICK);
  }
  if (p[3] > 3 && i % 5 === 2) {
    block(Math.round(p[0] - p[3] + 0.5), Math.round(p[1]), Z, SAND);
    block(Math.round(p[0] + p[3] - 0.5), Math.round(p[1]), Z, SAND);
  }
});
// raised tail tip stinger
block(tipX, tipY + 1, tipZ, BRICK);

// ---- PASS 3: head (rearing, facing north / -Z) ----
cube(-3, 5, -16, 3, 6, -12, LEAF);     // throat
cube(-3, 7, -17, 3, 11, -11, LEAF);    // cranium block
sphere(0, 9, -14, 4, LEAF);            // rounded skull
cube(-2, 8, -21, 2, 10, -17, LEAF);    // upper snout
cube(-2, 5, -20, 2, 6, -16, LEAF);     // lower jaw (mouth open at y7)
cube(-2, 7, -17, 2, 7, -16, BRICK);    // dark red back of mouth
// fangs
block(-2, 7, -21, SNOW); block(0, 7, -21, SNOW); block(2, 7, -21, SNOW);
block(-1, 7, -20, SNOW); block(1, 7, -20, SNOW);
// forked tongue
block(0, 6, -21, BRICK);
block(-1, 6, -22, BRICK); block(1, 6, -22, BRICK);
// nostrils
block(-1, 9, -21, AIR); block(1, 9, -21, AIR);
// glowing yellow eyes under brow ridges
cube(-2, 10, -20, -2, 10, -18, SAND);
cube(2, 10, -20, 2, 10, -18, SAND);
cube(-3, 11, -19, -1, 11, -17, OAK_LOG);
cube(1, 11, -19, 3, 11, -17, OAK_LOG);
// king-of-serpents crest (red crown fin along skull)
block(0, 13, -16, BRICK);
block(0, 14, -14, BRICK); block(0, 15, -14, BRICK);
block(0, 13, -12, BRICK); block(0, 14, -12, BRICK);
block(0, 10, -10, BRICK); block(0, 11, -10, BRICK);
block(-2, 13, -14, BRICK); block(2, 13, -14, BRICK);
// side frills
block(-4, 10, -15, OAK_LOG); block(-4, 10, -13, OAK_LOG); block(-5, 11, -14, OAK_LOG);
block(4, 10, -15, OAK_LOG); block(4, 10, -13, OAK_LOG); block(5, 11, -14, OAK_LOG);

// ---- PASS 4: petrified victim, arms raised, frozen before the gaze ----
disk(6, 0, -19, 2, COBBLE);
block(5, 1, -19, STONE); block(5, 2, -19, STONE);
block(7, 1, -19, STONE); block(7, 2, -19, STONE);
cube(5, 3, -19, 7, 4, -19, STONE);
block(6, 4, -19, COBBLE);
block(6, 5, -19, STONE); block(6, 6, -19, STONE);
block(4, 4, -19, STONE); block(4, 5, -19, STONE);
block(8, 4, -19, STONE); block(8, 5, -19, COBBLE);

// ---- PASS 5: hatched egg the basilisk crawled from ----
hollowSphere(15, 2, 7, 2, SNOW);
cube(12, 4, 4, 18, 7, 10, AIR);        // crack the top open
block(14, 4, 6, SNOW); block(16, 4, 8, SNOW);  // jagged rim
block(17, 0, 5, SNOW); block(12, 0, 9, SNOW);  // shell shards

// ---- PASS 6: scattered boulders ----
sphere(-11, 1, -5, 2, COBBLE);
sphere(-9, 0, -2, 1, STONE);
sphere(13, 1, -3, 2, COBBLE);
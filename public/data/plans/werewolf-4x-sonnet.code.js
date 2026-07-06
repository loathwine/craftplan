// werewolf-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// deterministic pseudo-random (no Math.random dependency)
let seed = 918273;
function rnd() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

// ===== ROCKY CRAG PEDESTAL =====
disk(0, -2, 0, 6, STONE);
disk(0, -1, 0, 6, STONE);
disk(0, 0, 0, 5, STONE);
disk(0, 1, 0, 5, COBBLE);
disk(0, 2, 0, 4, STONE);
disk(0, 3, 0, 4, COBBLE);
disk(0, 4, 0, 3, STONE);
disk(0, 5, 0, 3, COBBLE);
disk(0, 6, 0, 2, STONE);

// jagged spikes around the crag
for (let i = 0; i < 26; i++) {
  const ang = (i / 26) * Math.PI * 2;
  const r = 4 + rnd() * 2.5;
  const x = Math.round(Math.cos(ang) * r);
  const z = Math.round(Math.sin(ang) * r);
  const h = Math.round(1 + rnd() * 3);
  const baseY = Math.round(rnd() * 3) - 2;
  cube(x, baseY, z, x, baseY + h, z, rnd() > 0.5 ? STONE : COBBLE);
}

// scattered ground rocks
for (let i = 0; i < 14; i++) {
  const ang = rnd() * Math.PI * 2;
  const r = 8 + rnd() * 12;
  const x = Math.round(Math.cos(ang) * r);
  const z = Math.round(Math.sin(ang) * r);
  cube(x, 0, z, x + (rnd() > 0.5 ? 1 : 0), 0, z + (rnd() > 0.5 ? 1 : 0), STONE);
}

// dead tree, foreground framing element
(function deadTree() {
  const bx = -15, bz = 9;
  cylinder(bx, 0, bz, 1, 6, OAK_LOG);
  line(bx, 6, bz, bx - 3, 9, bz - 2, OAK_LOG);
  line(bx, 6, bz, bx + 2, 9, bz + 1, OAK_LOG);
  line(bx - 3, 9, bz - 2, bx - 5, 10, bz - 3, OAK_LOG);
  line(bx + 2, 9, bz + 1, bx + 4, 11, bz + 2, OAK_LOG);
  line(bx, 6, bz, bx - 1, 10, bz + 2, OAK_LOG);
})();

// sitting wolf pups (pack howling alongside)
function wolfPup(cx, cz, mirror) {
  cube(cx - 1, 0, cz - 1, cx + 1, 1, cz + 1, COBBLE);
  cube(cx - 1, 2, cz - 1, cx + 1, 2, cz, OAK_LOG);
  const hz = mirror ? cz - 2 : cz + 2;
  block(cx, 3, hz, OAK_LOG);
  block(cx - 1, 4, hz, COBBLE);
  block(cx + 1, 4, hz, COBBLE);
  block(cx, 4, hz, OAK_LOG);
  block(cx, 5, hz - (mirror ? -1 : 1), OAK_LOG); // snout tip, tilted up
}
wolfPup(-7, 3, false);
wolfPup(7, 4, true);
wolfPup(3, 10, false);

// ===== WEREWOLF (feet at y=7, standing on the crag) =====

// paws / feet
cube(-3, 7, 0, -2, 7, 2, COBBLE);
cube(2, 7, 0, 3, 7, 2, COBBLE);
block(-3, 7, 3, SNOW); block(-2, 7, 3, SNOW);
block(2, 7, 3, SNOW); block(3, 7, 3, SNOW);

// lower legs (bent back, digitigrade)
cube(-3, 8, -1, -2, 8, 1, OAK_LOG);
cube(2, 8, -1, 3, 8, 1, OAK_LOG);
cube(-3, 9, -1, -2, 9, 0, OAK_LOG);
cube(2, 9, -1, 3, 9, 0, OAK_LOG);

// thighs, widening forward again toward the hips
cube(-3, 10, 0, -1, 10, 2, OAK_LOG);
cube(1, 10, 0, 3, 10, 2, OAK_LOG);
cube(-3, 11, -1, 3, 11, 2, OAK_LOG);

// tail, curling down and back
cube(-1, 10, -2, 1, 11, -2, OAK_LOG);
cube(-1, 9, -3, 1, 9, -3, OAK_LOG);
block(0, 8, -4, OAK_LOG);
cube(-1, 7, -5, 1, 8, -5, COBBLE);

// torso, tapering waist to a broad chest
cube(-3, 12, -2, 3, 12, 2, OAK_LOG);
cube(-4, 13, -2, 4, 13, 2, OAK_LOG);
cube(-4, 14, -3, 4, 14, 2, OAK_LOG);
cube(-4, 15, -3, 4, 15, 2, OAK_LOG);
cube(-4, 16, -3, 4, 16, 1, OAK_LOG);
cube(-2, 14, 2, 2, 16, 2, COBBLE); // chest fur patch

// fur stripe patches on the flanks
for (let y = 12; y <= 15; y++) {
  block(-4, y, -1, COBBLE);
  block(4, y, -1, COBBLE);
}

// bristled dorsal ridge (hackles raised)
for (let y = 12; y <= 19; y++) {
  block(0, y, -4, COBBLE);
}

// shoulders
cube(-5, 17, -2, 5, 17, 1, OAK_LOG);

// arms raised in a howl, clawed paws overhead
function arm(sign) {
  const s = sign;
  cube(5 * s, 18, -2, 6 * s, 18, -1, OAK_LOG);
  cube(6 * s, 19, -3, 7 * s, 19, -2, OAK_LOG);
  cube(7 * s, 20, -4, 8 * s, 20, -3, OAK_LOG);
  cube(8 * s, 21, -4, 9 * s, 22, -3, COBBLE);
  block(8 * s, 23, -4, SNOW);
  block(9 * s, 23, -4, SNOW);
  block(8 * s, 23, -3, SNOW);
}
arm(-1);
arm(1);

// neck, thrown back
cube(-1, 19, -3, 1, 19, -4, OAK_LOG); // throat fill
cube(-2, 18, -2, 2, 18, -1, OAK_LOG);
cube(-2, 19, -3, 2, 19, -2, OAK_LOG);

// head, tilted skyward, mouth open mid-howl
sphere(0, 20, -4, 2, OAK_LOG);
cube(-1, 21, -5, 1, 21, -7, OAK_LOG); // upper snout
block(0, 21, -7, COBBLE);            // nose
cube(-1, 19, -5, 1, 19, -7, OAK_LOG); // lower jaw
block(-1, 20, -5, SNOW); block(1, 20, -5, SNOW);
block(-1, 20, -6, SNOW); block(1, 20, -6, SNOW);

// ears
cube(-3, 20, -4, -2, 20, -3, COBBLE);
block(-3, 21, -4, COBBLE);
cube(2, 20, -3, 3, 20, -4, COBBLE);
block(3, 21, -4, COBBLE);

// glowing eyes
block(-1, 20, -3, ICE);
block(1, 20, -3, ICE);

// ===== MOON, high and to the side, halo glow =====
sphere(8, 27, -15, 4, SNOW);
hollowSphere(8, 27, -15, 5, ICE);
// craters (free — AIR doesn't count against budget)
block(7, 28, -12, AIR);
block(9, 26, -12, AIR);
block(6, 25, -13, AIR);
block(10, 28, -14, AIR);
block(8, 24, -12, AIR);

// thin wisp clouds drifting past the moon
disk(3, 24, -12, 3, SNOW);
disk(14, 29, -17, 2, SNOW);
```

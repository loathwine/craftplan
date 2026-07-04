// xenomorph-4x-fable — prompt:
// the Alien xenomorph...

// The Alien xenomorph — crouched in a hive clearing, right arm raised to strike,
// long banana dome, ribbed tail sweeping east with raised blade, dorsal tubes,
// hive resin floor + eggs + facehugger + resin columns. Palette: COBBLE/STONE
// biomech shell, SNOW teeth/claw glints, LEAVES acid drool.

function lerp(a, b, t) { return a + (b - a) * t; }

// tapered organic tube along a polyline; optional idB gives ribbed banding
function tube(pts, r0, r1, idA, idB) {
  const n = pts.length - 1;
  let k = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[i + 1];
    const steps = Math.max(1, Math.ceil(Math.max(
      Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]))));
    for (let s = 0; s < steps; s++) {
      const t = s / steps, g = (i + t) / n;
      const r = Math.max(1, Math.round(lerp(r0, r1, g)));
      const id = (idB !== undefined && k % 5 < 2) ? idB : idA;
      sphere(Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)),
             Math.round(lerp(a[2], b[2], t)), r, id);
      k++;
    }
  }
  const e = pts[n];
  sphere(Math.round(e[0]), Math.round(e[1]), Math.round(e[2]),
         Math.max(1, Math.round(r1)), idA);
}

function spike(x, z, h) {
  for (let i = 0; i < h; i++) block(x, 1 + i, z, COBBLE);
  block(x, 1 + h, z, STONE);
  block(x + 1, 1, z, COBBLE); block(x - 1, 1, z, COBBLE);
  block(x, 1, z + 1, COBBLE); block(x, 1, z - 1, COBBLE);
}

function egg(cx, cz, open) {
  cylinder(cx, 1, cz, 2, 2, LEAVES);
  sphere(cx, 3, cz, 2, LEAVES);
  line(cx - 2, 1, cz, cx - 2, 3, cz, OAK_LOG);
  line(cx + 2, 1, cz, cx + 2, 3, cz, OAK_LOG);
  line(cx, 1, cz - 2, cx, 3, cz - 2, OAK_LOG);
  line(cx, 1, cz + 2, cx, 3, cz + 2, OAK_LOG);
  if (open) {
    cube(cx - 1, 4, cz - 1, cx + 1, 5, cz + 1, AIR);
    block(cx - 1, 4, cz - 1, OAK_LOG); block(cx + 1, 4, cz - 1, OAK_LOG);
    block(cx - 1, 4, cz + 1, OAK_LOG); block(cx + 1, 4, cz + 1, OAK_LOG);
    block(cx, 3, cz, OAK_LOG);
  } else {
    block(cx, 5, cz, OAK_LOG);
  }
}

// ---- clear trees / brush only where the scene lives (AIR is free) ----
cube(-9, 0, -14, 9, 9, 10, AIR);      // creature volume
cube(9, 0, 5, 19, 9, 16, AIR);        // tail sweep
cube(-15, 0, 3, -8, 11, 13, AIR);     // left hive column + egg
cube(12, 1, -16, 22, 11, -4, AIR);    // right hive column zone
block(17, 0, -11, AIR); block(18, 0, -13, AIR); // trunk stumps
cube(-14, 0, -9, -9, 8, -1, AIR);     // canopy over open egg

// ---- hive resin floor ----
disk(0, 0, 0, 11, COBBLE);
disk(6, 0, 8, 6, COBBLE);
disk(10, 0, 13, 5, COBBLE);
disk(15, 0, 9, 4, COBBLE);
disk(-8, 0, -6, 5, COBBLE);
disk(-11, 0, 8, 4, COBBLE);
disk(8, 0, -8, 5, COBBLE);
disk(-4, 0, -11, 4, COBBLE);
disk(16, 0, -7, 4, COBBLE);
disk(19, 0, 14, 3, COBBLE);
for (let i = 0; i < 10; i++) {        // radiating resin veins
  const a = i * Math.PI / 5 + 0.4;
  line(Math.round(Math.cos(a) * 3), 0, Math.round(Math.sin(a) * 3),
       Math.round(Math.cos(a) * 10), 0, Math.round(Math.sin(a) * 10), STONE);
}

// ---- hive columns (background separation) ----
tube([[-13, 0, 10], [-12, 4, 9], [-10, 8, 7], [-8, 11, 5]], 1.6, 0.9, COBBLE, STONE);
tube([[16, 0, -8], [15, 4, -7], [13, 8, -5], [11, 11, -3]], 1.6, 0.9, COBBLE, STONE);
tube([[19, 0, 15], [18, 4, 14], [16, 7, 12], [14, 9, 10]], 1.4, 0.8, COBBLE, STONE);
spike(-10, 2, 3); spike(9, -6, 2); spike(18, -6, 3);
spike(-11, 5, 2); spike(4, -10, 2);

// ---- eggs + facehugger ----
egg(-11, -3, true);
egg(-8, 8, false);
egg(8, 4, false);
cube(-4, 1, -11, -3, 1, -10, SAND);   // facehugger body
block(-3, 2, -10, SAND);
line(-2, 1, -10, 0, 1, -9, SAND);     // tail
line(-5, 1, -11, -6, 1, -12, SAND); line(-5, 1, -10, -6, 1, -9, SAND);
line(-4, 1, -12, -5, 1, -13, SAND); line(-3, 1, -12, -2, 1, -13, SAND);
line(-4, 1, -9, -5, 1, -8, SAND);   line(-3, 1, -9, -2, 1, -8, SAND);

// ---- legs (digitigrade) ----
tube([[-2, 12, 4], [-5, 8, 0], [-5, 4, 5], [-4, 2, 6]], 1.8, 1.1, COBBLE, STONE);
tube([[2, 12, 4], [5, 8, 0], [5, 4, 5], [4, 2, 6]], 1.8, 1.1, COBBLE, STONE);
tube([[-4, 2, 6], [-4, 1, 2]], 1.1, 1.0, COBBLE);
tube([[4, 2, 6], [4, 1, 2]], 1.1, 1.0, COBBLE);
line(-4, 1, 2, -6, 1, -1, STONE); line(-4, 1, 2, -4, 1, -1, STONE); line(-4, 1, 2, -2, 1, 0, STONE);
line(4, 1, 2, 6, 1, -1, STONE);   line(4, 1, 2, 4, 1, -1, STONE);   line(4, 1, 2, 2, 1, 0, STONE);
line(-5, 8, 0, -7, 10, -1, STONE); line(5, 8, 0, 7, 10, -1, STONE);   // knee spurs
line(-4, 3, 7, -4, 5, 9, STONE);   line(4, 3, 7, 4, 5, 9, STONE);     // heel spurs

// ---- ribbed torso ----
tube([[0, 11, 5], [0, 13, 3], [0, 15, 1], [0, 16.5, -1], [0, 17, -3]], 2.7, 2.0, COBBLE, STONE);
sphere(0, 12, 4, 2, COBBLE);
sphere(-3, 16, -1, 2, COBBLE); sphere(3, 16, -1, 2, COBBLE);
for (let i = 0; i < 4; i++) {         // flank ribs
  const y = 12 + Math.round(i * 1.5), z = Math.round(3.5 - i * 1.4);
  line(-3, y, z, -3, y + 1, z - 1, STONE);
  line(3, y, z, 3, y + 1, z - 1, STONE);
}

// ---- arms: left crouched to ground, right raised to strike ----
tube([[-3, 16, -2], [-6, 11, -2], [-7, 6, -4], [-7, 2, -6]], 1.5, 1.0, COBBLE, STONE);
line(-7, 1, -6, -9, 1, -9, STONE); line(-7, 1, -6, -7, 1, -10, STONE);
line(-7, 1, -6, -5, 1, -9, STONE); line(-7, 1, -6, -9, 1, -4, STONE);
line(-6, 11, -2, -8, 12, 0, STONE);                                    // elbow spike
tube([[3, 16, -2], [7, 15, 1], [8, 19, 0], [7, 22, -3]], 1.5, 1.0, COBBLE, STONE);
line(7, 22, -3, 5, 24, -6, STONE); line(7, 22, -3, 7, 24, -7, STONE);
line(7, 22, -3, 9, 24, -6, STONE);
line(8, 19, 0, 10, 20, 2, STONE);                                      // elbow spike

// ---- dorsal tubes (two pairs) ----
tube([[-2, 17, -1], [-3, 21, 3], [-4, 22, 6]], 1.2, 0.8, COBBLE); block(-4, 22, 7, STONE);
tube([[2, 17, -1], [3, 21, 3], [4, 22, 6]], 1.2, 0.8, COBBLE);   block(4, 22, 7, STONE);
tube([[-2, 15, 2], [-3, 18, 6], [-3, 19, 9]], 1.1, 0.8, COBBLE);  block(-3, 19, 10, STONE);
tube([[2, 15, 2], [3, 18, 6], [3, 19, 9]], 1.1, 0.8, COBBLE);    block(3, 19, 10, STONE);

// ---- segmented tail, sweeping ground then rising to the blade ----
tube([[0, 11, 5], [1, 9, 8], [3, 5, 11], [6, 2, 13], [10, 1, 13],
      [13, 2, 12], [16, 4, 9], [17, 7, 7], [17, 10, 5]], 1.7, 0.7, COBBLE, STONE);
block(1, 11, 8, STONE); block(3, 7, 11, STONE); block(6, 4, 13, STONE);
block(10, 3, 13, STONE); block(13, 4, 12, STONE); block(16, 6, 9, STONE);
block(17, 11, 4, STONE); block(17, 12, 3, STONE); block(17, 13, 2, STONE); // blade
block(16, 11, 4, STONE); block(18, 11, 4, STONE);
block(16, 10, 5, STONE); block(18, 10, 5, STONE);
block(17, 11, 5, COBBLE);

// ---- neck + elongated dome (smooth STONE carapace) ----
tube([[0, 17, -3], [0, 18, -6]], 1.6, 1.3, COBBLE);
tube([[0, 18, -7], [0, 19.5, -3], [0, 20.5, 1], [0, 21, 5], [0, 20.5, 8]], 2.3, 1.0, STONE);

// ---- jaw, teeth, inner jaw, acid ----
tube([[0, 14.5, -4], [0, 14, -9]], 1.2, 1.0, COBBLE);   // lower jaw
cube(-1, 15, -9, 1, 16, -6, AIR);                       // open mouth
for (let z = -9; z <= -6; z++) {
  for (let x = -1; x <= 1; x++) {
    const upper = (((x + z) % 2) + 2) % 2 === 0 && z >= -8;
    if (upper) block(x, 16, z, SNOW); else block(x, 15, z, SNOW);
  }
}
line(0, 15, -8, 0, 15, -12, STONE);                     // inner jaw striking out
block(0, 15, -13, SNOW);
line(1, 13, -9, 1, 11, -9, LEAVES);                     // acid drool
block(-1, 13, -8, LEAVES); block(-1, 12, -8, LEAVES);
line(0, 14, -12, 0, 11, -12, LEAVES);
block(0, 8, -12, LEAVES); block(0, 4, -12, LEAVES);
disk(0, 0, -12, 2, LEAVES);                             // acid pool eating the floor
block(2, 0, -11, LEAVES); block(-1, 0, -13, LEAVES); block(1, 0, -14, LEAVES);
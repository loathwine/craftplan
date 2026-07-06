// yoda-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== YODA — Jedi Master on Dagobah =====
// Character centered at x=0,z=0 facing south (+Z). Hut behind (north),
// pond+dead tree east, sunken X-wing tail west.

// ---------- ground / dais ----------
disk(0, 0, 0, 6, STONE);
hollowCylinder(0, 0, 0, 6, 1, COBBLE);           // rim
disk(0, 0, 0, 3, DIRT);                          // muddy center under robe
// scattered swamp mud / moss patches around the plaza
block(5, 0, 3, DIRT); block(4, 0, -4, DIRT); block(-5, 0, 2, DIRT);
block(3, 0, 5, SAND); block(-4, 0, -3, DIRT);
for (let i = 0; i < 10; i++) {
  const a = i * 0.63;
  const rx = Math.round(Math.cos(a) * 6);
  const rz = Math.round(Math.sin(a) * 6);
  if (Math.random() > 0.4) block(rx, 0, rz, DIRT);
}

// ---------- robe (body) ----------
cylinder(0, 1, 0, 5, 1, OAK_LOG);   // hem flare
cylinder(0, 2, 0, 4, 2, OAK_LOG);   // lower robe
cylinder(0, 4, 0, 3, 2, OAK_LOG);   // waist
cylinder(0, 6, 0, 3, 2, OAK_LOG);   // chest / shoulders
hollowCylinder(0, 3, 0, 4, 1, COBBLE); // belt
hollowCylinder(0, 8, 0, 2, 1, OAK_LOG); // collar

// robe fold lines (vertical accents, 4 sides)
line(0, 1, 5, 0, 7, 3, PLANKS);
line(0, 1, -5, 0, 7, -3, PLANKS);
line(5, 1, 0, 3, 7, 0, PLANKS);
line(-5, 1, 0, -3, 7, 0, PLANKS);

// ---------- neck & head ----------
cylinder(0, 9, 0, 1, 2, LEAVES);
sphere(0, 13, 0, 3, LEAVES);

// face (front = +Z)
block(-1, 13, 3, COBBLE); block(1, 13, 3, COBBLE);      // eyes
block(-1, 13, 4, STONE);  block(1, 13, 4, STONE);        // brow ridge pop
block(0, 12, 4, STONE);                                   // nose
line(-1, 11, 3, 1, 11, 3, COBBLE);                        // mouth
block(-2, 14, 2, LEAVES); block(2, 14, 2, LEAVES);        // cheek/head ridges
block(0, 15, 0, LEAVES);                                  // head crown wisps
block(-1, 10, -3, DIRT); block(1, 10, -3, DIRT);          // age spots (back head)

// ---------- ears (drooping, tapered) ----------
function ear(sign) {
  const pts = [
    [3, 14], [4, 13], [5, 12], [6, 11], [6, 9], [5, 8]
  ];
  for (let i = 0; i < pts.length; i++) {
    const [dx, y] = pts[i];
    const x = sign * dx;
    const z = -1 + i * 0.4 | 0;
    cube(x, y, z, x, y, z, LEAVES);
    if (i < pts.length - 1) block(x, y - 1, z, LEAVES); // thickness
  }
}
ear(1);
ear(-1);

// ---------- arms & hands ----------
line(3, 7, 0, 6, 5, 1, OAK_LOG);     // right sleeve
block(6, 5, 1, LEAVES);              // right hand
block(6, 4, 1, LEAVES); block(7, 5, 1, LEAVES); // fingers
line(-3, 7, 0, -6, 5, 1, OAK_LOG);   // left sleeve
block(-6, 5, 1, LEAVES);             // left hand
block(-6, 4, 1, LEAVES); block(-7, 5, 1, LEAVES);

// cane, gripped by right hand
line(6, 4, 1, 5, 0, 2, OAK_LOG);
block(5, 0, 2, COBBLE); // foot tip

// small mushroom beside Yoda
block(-3, 0, 4, OAK_LOG); block(-3, 1, 4, OAK_LOG);
disk(-3, 2, 4, 1, BRICK);

// ============================================================
// Yoda's hut — mound + roots, north of the plaza
// ============================================================
const HX = 0, HZ = -14;
sphere(HX, 3, HZ, 5, DIRT);
sphere(HX, 4, HZ, 4, LEAVES);           // mossy cap
cube(HX - 1, 0, HZ - 9, HX + 1, 2, HZ - 9, PLANKS); // door
cube(HX - 1, 0, HZ - 11, HX + 1, 2, HZ - 10, AIR);  // hollow interior
block(HX + 3, 3, HZ - 10, GLASS); block(HX + 4, 3, HZ - 10, GLASS); // window
block(HX + 3, 4, HZ - 10, GLASS); block(HX + 4, 4, HZ - 10, GLASS);
line(HX - 5, 0, HZ, HX - 8, 0, HZ + 2, OAK_LOG); // roots
line(HX + 5, 0, HZ, HX + 8, 0, HZ - 1, OAK_LOG);
line(HX - 4, 0, HZ - 4, HX - 6, 0, HZ - 7, OAK_LOG);
line(HX + 4, 0, HZ - 4, HX + 6, 0, HZ - 6, OAK_LOG);
line(HX, 8, HZ, HX, 10, HZ, OAK_LOG);            // chimney stick
sphere(HX, 11, HZ, 1, LEAVES);                   // tuft on top

// ============================================================
// Pond + dead tree — east side
// ============================================================
const PX = 14, PZ = 6;
disk(PX, -1, PZ, 5, DIRT);
disk(PX, 0, PZ, 4, GLASS);
cylinder(PX, 1, PZ + 4, 1, 6, OAK_LOG);          // dead trunk
line(PX, 6, PZ + 4, PX + 3, 8, PZ + 3, OAK_LOG); // branch
line(PX, 6, PZ + 4, PX - 2, 7, PZ + 5, OAK_LOG); // branch
block(PX + 3, 8, PZ + 3, LEAVES); block(PX - 2, 7, PZ + 5, LEAVES);
line(PX + 3, 7, PZ + 3, PX + 3, 4, PZ + 3, LEAVES); // hanging vine
line(PX - 2, 6, PZ + 5, PX - 2, 3, PZ + 5, LEAVES); // hanging vine

// ============================================================
// Sunken X-wing tail — west side, half-buried in mud
// ============================================================
const WX = -14, WZ = 8;
disk(WX, -1, WZ, 5, DIRT);
// tilted fuselage stump, stepped stack
const fus = [
  [0, 0, 0, 2], [-1, 1, 1, 2], [-1, 2, 2, 1], [-2, 3, 2, 1],
  [-2, 4, 3, 1], [-3, 5, 3, 1], [-3, 6, 4, 1]
];
for (const [dx, y, dz, r] of fus) {
  cube(WX + dx - r, y, WZ + dz - r, WX + dx + r, y, WZ + dz + r, COBBLE);
}
block(WX - 2, 3, WZ + 2, BRICK); block(WX - 3, 5, WZ + 3, BRICK); // red hull stripes
cube(WX - 5, 1, WZ + 1, WX - 4, 1, WZ + 3, STONE); // snapped wing fragment
block(WX - 1, 2, WZ + 1, GLASS); // cracked cockpit shard
```

// dutch-windmill — prompt:
// A classic Dutch windmill on a grassy field. A tall tapering cylindrical tower body of PLANKS and OAK_LOG (wood) widening at the base, with a domed OAK_LOG cap on top. Four huge crossed sail-blades (th...

const CX = 0, CZ = 4, HUBY = 19, sailZ = -6;

function radius(y) {
  if (y <= 1) return 7.0;       // flared skirt
  if (y === 2) return 6.6;
  if (y === 3) return 6.3;
  const t = (y - 3) / 20;       // taper across y4..23
  return 6.3 - t * 3.0;         // 6.3 -> 3.3
}

// ---------- 1. clear the forest to make a grassy field + sail air ----------
for (let y = 1; y <= 32; y++)
  for (let x = -13; x <= 13; x++)
    for (let z = -9; z <= 17; z++) {
      const dx = x - CX, dz = z - CZ;
      if (dx * dx + dz * dz <= 12 * 12) block(x, y, z, AIR);
    }
cube(-15, 5, -7, 15, 33, -4, AIR);   // clear space for the big sails

// ---------- 2. cobble foundation / base ----------
disk(CX, -2, CZ, 8, COBBLE);
disk(CX, -1, CZ, 7.6, COBBLE);
disk(CX, 0, CZ, 7.2, COBBLE);        // base apron ring visible around the foot

// ---------- 3. tapering tower body (PLANKS + OAK_LOG bands) ----------
for (let y = 0; y <= 23; y++) {
  const r = radius(y), inner = r - 2.0;
  for (let x = Math.floor(CX - r); x <= Math.ceil(CX + r); x++)
    for (let z = Math.floor(CZ - r); z <= Math.ceil(CZ + r); z++) {
      const d = Math.hypot(x - CX, z - CZ);
      if (d <= r + 0.25 && d >= inner) {
        let b = PLANKS;
        if (y % 4 === 0) b = OAK_LOG;   // horizontal beams
        if (y <= 1) b = OAK_LOG;        // sturdy footing
        block(x, y, z, b);
      }
    }
}
// interior floors
disk(CX, 0, CZ, 5, PLANKS);
disk(CX, 7, CZ, radius(7) - 2, PLANKS);
disk(CX, 13, CZ, radius(13) - 2, PLANKS);

// ---------- 4. vertical OAK_LOG ribs following the taper ----------
for (let k = 0; k < 12; k++) {
  const a = k * Math.PI / 6;
  for (let y = 2; y <= 23; y++) {
    const r = radius(y) + 0.25;
    block(Math.round(CX + Math.cos(a) * r), y, Math.round(CZ + Math.sin(a) * r), OAK_LOG);
  }
}

// ---------- 5. eaves / cornice ring at the top of the wall ----------
for (let y = 22; y <= 23; y++) {
  const r = radius(y), ro = r + 0.9, ri = r - 0.2;
  for (let x = Math.floor(CX - ro); x <= Math.ceil(CX + ro); x++)
    for (let z = Math.floor(CZ - ro); z <= Math.ceil(CZ + ro); z++) {
      const d = Math.hypot(x - CX, z - CZ);
      if (d <= ro + 0.2 && d >= ri) block(x, y, z, OAK_LOG);
    }
}

// ---------- 6. domed OAK_LOG cap ----------
const capR = [5.0, 4.9, 4.6, 4.2, 3.6, 2.8, 1.8, 0.9];
for (let i = 0; i < capR.length; i++) disk(CX, 24 + i, CZ, capR[i], OAK_LOG);
block(CX, 32, CZ, OAK_LOG);
block(CX, 33, CZ, OAK_LOG);          // finial pole
block(CX + 1, 33, CZ, SNOW);         // tiny pennant

// ---------- 7. windshaft, hub and the four crossed sails ----------
for (let z = sailZ; z <= 4; z++) {   // the shaft emerging from the cap
  block(CX, HUBY, z, OAK_LOG);
  block(CX, HUBY + 1, z, OAK_LOG);
}
cube(CX - 1, HUBY - 1, sailZ - 1, CX + 1, HUBY + 1, sailZ + 1, OAK_LOG); // hub

function blade(dx, dy) {
  const L = 12, HW = 2;
  for (let l = 1; l <= L; l++)
    for (let w = -HW; w <= HW; w++) {
      const x = Math.round(CX + dx * l + dy * w);
      const y = Math.round(HUBY + dy * l - dx * w);
      let b = SNOW;                          // sailcloth
      if (Math.abs(w) === HW) b = OAK_LOG;   // outer frame
      else if (w === 0) b = OAK_LOG;         // central whip
      else if (l % 3 === 0) b = OAK_LOG;     // lattice rungs
      else if (l === L) b = OAK_LOG;         // tip cap
      block(x, y, sailZ, b);
      block(x, y, sailZ + 1, b);             // 2 thick for presence
    }
}
blade(1, 1); blade(-1, 1); blade(-1, -1); blade(1, -1);

// ---------- 8. door (front, -Z) ----------
cube(CX - 1, 0, -5, CX + 1, 3, 0, AIR);          // doorway
cube(CX - 1, 0, -3, CX + 1, 2, -3, PLANKS);      // door panel
cube(CX - 2, 0, -3, CX - 2, 3, -3, OAK_LOG);     // left post
cube(CX + 2, 0, -3, CX + 2, 3, -3, OAK_LOG);     // right post
cube(CX - 2, 3, -3, CX + 2, 3, -3, OAK_LOG);     // lintel
cube(CX - 1, 0, -4, CX + 1, 0, -4, COBBLE);      // threshold

// ---------- 9. GLASS windows ----------
function win(a, y) {
  const rad = a * Math.PI / 180, r = radius(y);
  const x = Math.round(CX + Math.cos(rad) * r), z = Math.round(CZ + Math.sin(rad) * r);
  block(x, y, z, GLASS); block(x, y + 1, z, GLASS);
  block(x, y - 1, z, OAK_LOG); block(x, y + 2, z, OAK_LOG);
}
win(0, 8); win(180, 8); win(0, 14); win(180, 14);
win(270, 14); win(90, 10); win(45, 11); win(135, 11);

// ---------- 10. cobble plaza + SAND path + fence ----------
cube(CX - 2, -1, -7, CX + 2, 0, -3, COBBLE);
for (let z = -17; z <= -8; z++)
  for (let x = CX - 1; x <= CX + 1; x++) block(x, 0, z, SAND);
block(CX - 2, 0, -12, SAND); block(CX + 2, 0, -12, SAND);
[[-3, -9], [3, -9], [-3, -14], [3, -14], [-3, -17], [3, -17]].forEach(([x, z]) => {
  block(x, 1, z, OAK_LOG); block(x, 2, z, OAK_LOG);
});
line(-3, 2, -9, -3, 2, -17, OAK_LOG);
line(3, 2, -9, 3, 2, -17, OAK_LOG);

// ---------- 11. LEAVES bushes scattered on the field ----------
[[-6, -9, 2], [6, -11, 2], [-8, 3, 2], [9, 5, 2], [-9, -3, 1],
 [8, -2, 2], [-5, -16, 1], [5, -15, 2], [-10, 8, 2], [10, 11, 2], [-11, -1, 2]]
  .forEach(([x, z, r]) => sphere(x, r, z, r, LEAVES));

// ---------- 12. little rustic shed (extra structure, midground) ----------
cube(7, 1, 6, 13, 8, 12, AIR);
cube(8, 0, 7, 12, 0, 11, COBBLE);
cube(8, 1, 7, 12, 4, 7, PLANKS);
cube(8, 1, 11, 12, 4, 11, PLANKS);
cube(8, 1, 7, 8, 4, 11, PLANKS);
cube(12, 1, 7, 12, 4, 11, PLANKS);
[[8, 7], [12, 7], [8, 11], [12, 11]].forEach(([x, z]) => cube(x, 1, z, x, 4, z, OAK_LOG));
for (let i = 0; i <= 2; i++) cube(8 + i, 5 + i, 6, 12 - i, 5 + i, 12, OAK_LOG); // roof
cube(9, 1, 6, 10, 2, 7, AIR);          // shed doorway
block(11, 2, 7, GLASS);                // shed window
cube(6, 0, 8, 6, 1, 11, OAK_LOG);      // woodpile

// ---------- 13. low cobble field wall arc (behind, +Z) ----------
for (let deg = 15; deg <= 165; deg += 4) {
  const a = deg * Math.PI / 180;
  const x = Math.round(CX + Math.cos(a) * 12.5), z = Math.round(CZ + Math.sin(a) * 12.5);
  block(x, 0, z, COBBLE); block(x, 1, z, COBBLE);
}

// ---------- 14. grain sacks by the door ----------
cube(4, 0, -4, 5, 1, -3, SAND); block(4, 2, -4, SAND);
cube(-5, 0, -4, -4, 1, -3, DIRT);
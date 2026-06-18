// taj-mahal — prompt:
// The Taj Mahal, the white marble mausoleum. A grand symmetric white SNOW building: a large central bulbous onion DOME on a cubic base, topped with a SAND (gold) finial spire. Smaller domes at the corne...

// ===== THE TAJ MAHAL =====
const CX = 0, CZ = 9;

// ---------- helpers ----------
function rim(x1, z1, x2, z2, y, id) {
  cube(x1, y, z1, x2, y, z1, id);
  cube(x1, y, z2, x2, y, z2, id);
  cube(x1, y, z1, x1, y, z2, id);
  cube(x2, y, z1, x2, y, z2, id);
}
function onion(cx, cy, cz, profile, id) {
  for (let i = 0; i < profile.length; i++) disk(cx, cy + i, cz, profile[i], id);
}
// pointed (ogee-ish) arch carved into a Z-facing wall
function archZ(faceZ, dir, cx, baseY, halfW, topY, depth) {
  const st = topY - halfW;
  for (let d = 0; d < depth; d++) {
    const z = faceZ + dir * d;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dx = Math.abs(x - cx);
      for (let y = baseY; y <= topY; y++) {
        if (y <= st || dx + (y - st) <= halfW) block(x, y, z, AIR);
      }
    }
  }
}
// pointed arch carved into an X-facing wall
function archX(faceX, dir, cz, baseY, halfW, topY, depth) {
  const st = topY - halfW;
  for (let d = 0; d < depth; d++) {
    const x = faceX + dir * d;
    for (let z = cz - halfW; z <= cz + halfW; z++) {
      const dz = Math.abs(z - cz);
      for (let y = baseY; y <= topY; y++) {
        if (y <= st || dz + (y - st) <= halfW) block(x, y, z, AIR);
      }
    }
  }
}
// small domed kiosk (chhatri)
function chhatri(x, z) {
  for (let y = 17; y <= 19; y++) {
    block(x - 1, y, z - 1, SNOW); block(x + 1, y, z - 1, SNOW);
    block(x - 1, y, z + 1, SNOW); block(x + 1, y, z + 1, SNOW);
  }
  cube(x - 1, 20, z - 1, x + 1, 20, z + 1, SNOW);
  onion(x, 21, z, [2, 2, 1], SNOW);
  block(x, 24, z, SAND);
}
// tall slender minaret with balcony galleries + small dome cap
function minaret(x, z) {
  cube(x - 2, 2, z - 2, x + 2, 3, z + 2, SNOW);   // footing
  rim(x - 2, z - 2, x + 2, z + 2, 3, COBBLE);
  cube(x - 1, 4, z - 1, x + 1, 20, z + 1, SNOW);  // shaft
  for (const by of [10, 16]) {
    cube(x - 2, by, z - 2, x + 2, by, z + 2, SNOW);
    rim(x - 2, z - 2, x + 2, z + 2, by, SAND);
  }
  cube(x - 2, 21, z - 2, x + 2, 21, z + 2, SNOW); // top gallery
  cylinder(x, 22, z, 1, 2, SNOW);                 // drum
  onion(x, 24, z, [2, 2, 1], SNOW);               // cap dome
  block(x, 27, z, SAND);                          // finial
}

// ---------- site prep (targeted clearing of forest) ----------
cube(-16, 2, -3, 16, 10, 21, AIR);
cube(-13, 1, -22, 13, 9, -3, AIR);

// ---------- raised platform (two-tier plinth) ----------
cube(-16, 0, -3, 16, 1, 21, SNOW);     // lower tier
rim(-16, -3, 16, 21, 1, COBBLE);       // cobble edge
cube(-11, 2, -1, 11, 3, 19, SNOW);     // upper tier
rim(-11, -1, 11, 19, 3, COBBLE);

// ---------- reflecting pool (foreground, toward -Z viewer) ----------
cube(-12, 0, -22, 12, 0, -4, SNOW);    // marble frame
cube(-11, 0, -21, 11, 0, -5, GLASS);   // water
cube(-1, 0, -22, 1, 0, -4, SNOW);      // central watercourse bank
cube(-11, 0, -14, 11, 0, -12, SNOW);   // cross walkway
for (let z = -20; z <= -6; z += 3) block(0, 0, z, SAND);  // gold inlays down the spine
[[-12, -22], [12, -22], [-12, -4], [12, -4]].forEach(c => block(c[0], 0, c[1], COBBLE));
cube(-13, 0, -22, -13, 1, -4, SNOW);   // garden walls flanking the pool
cube(13, 0, -22, 13, 1, -4, SNOW);
cube(-13, 1, -22, -13, 1, -4, COBBLE);
cube(13, 1, -22, 13, 1, -4, COBBLE);
for (let z = -19; z <= -7; z += 4) {   // gold-tipped marble posts
  block(-12, 1, z, SNOW); block(-12, 2, z, SAND);
  block(12, 1, z, SNOW);  block(12, 2, z, SAND);
}

// ---------- grand front staircase ----------
cube(-3, 2, -2, 3, 2, -1, SNOW);
cube(-3, 1, -3, 3, 1, -2, SNOW);
cube(-3, 0, -4, 3, 0, -3, SNOW);

// ---------- main building (square — four identical facades) ----------
const BX1 = -8, BX2 = 8, BZ1 = 1, BZ2 = 17, BB = 4, BT = 15, RF = 16;
cube(BX1, BB, BZ1, BX2, BT, BZ1, SNOW);
cube(BX1, BB, BZ2, BX2, BT, BZ2, SNOW);
cube(BX1, BB, BZ1, BX1, BT, BZ2, SNOW);
cube(BX2, BB, BZ1, BX2, BT, BZ2, SNOW);
cube(BX1, RF, BZ1, BX2, RF, BZ2, SNOW);   // roof

// gold corner quoins
for (let y = BB; y <= RF; y++) {
  block(BX1, y, BZ1, SAND); block(BX2, y, BZ1, SAND);
  block(BX1, y, BZ2, SAND); block(BX2, y, BZ2, SAND);
}
// gold cornice under the roof
for (let x = BX1; x <= BX2; x++) { block(x, BT, BZ1, SAND); block(x, BT, BZ2, SAND); }
for (let z = BZ1; z <= BZ2; z++) { block(BX1, BT, z, SAND); block(BX2, BT, z, SAND); }

// gold pishtaq frames around each iwan
function frameZ(z) {
  for (let y = BB; y <= 13; y++) { block(-4, y, z, SAND); block(4, y, z, SAND); }
  for (let x = -4; x <= 4; x++) block(x, 13, z, SAND);
}
function frameX(x) {
  for (let y = BB; y <= 13; y++) { block(x, y, 5, SAND); block(x, y, 13, SAND); }
  for (let z = 5; z <= 13; z++) block(x, 13, z, SAND);
}
frameZ(BZ1); frameZ(BZ2); frameX(BX1); frameX(BX2);

// glass inlay accents
[BZ1, BZ2].forEach(z => { block(-2, 14, z, GLASS); block(2, 14, z, GLASS); block(0, 14, z, GLASS); });
[BX1, BX2].forEach(x => { block(x, 14, 7, GLASS); block(x, 14, 11, GLASS); block(x, 14, 9, GLASS); });

// parapet + corner pinnacles on the roof
rim(BX1, BZ1, BX2, BZ2, 17, SNOW);
[[BX1, BZ1], [BX2, BZ1], [BX1, BZ2], [BX2, BZ2]].forEach(c => {
  block(c[0], 17, c[1], SAND); block(c[0], 18, c[1], SAND);
});

// recessed arched entrances carved on every face (front toward viewer)
archZ(BZ1, 1, 0, BB, 3, 12, 2);
archZ(BZ2, -1, 0, BB, 3, 12, 2);
archX(BX1, 1, CZ, BB, 3, 12, 2);
archX(BX2, -1, CZ, BB, 3, 12, 2);

// ---------- drum + great central onion dome ----------
cylinder(CX, 17, CZ, 5, 3, SNOW);              // drum
disk(CX, 19, CZ, 5, SAND); disk(CX, 19, CZ, 4, SNOW);   // gold cornice ring
onion(CX, 20, CZ, [5, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1], SNOW);  // bulbous dome
// gold finial spire (highest point)
block(CX, 31, CZ, SAND);
block(CX + 1, 31, CZ, SAND); block(CX - 1, 31, CZ, SAND);
block(CX, 31, CZ + 1, SAND); block(CX, 31, CZ - 1, SAND);
block(CX, 32, CZ, SAND);
block(CX, 33, CZ, SAND);

// ---------- four corner chhatris around the dome ----------
chhatri(-6, 5); chhatri(6, 5); chhatri(-6, 13); chhatri(6, 13);

// ---------- four minarets framing the composition ----------
minaret(-14, 1); minaret(14, 1); minaret(-14, 17); minaret(14, 17);
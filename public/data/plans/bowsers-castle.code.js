// bowsers-castle — prompt:
// Bowser's Castle from Super Mario - a menacing dark fortress over lava. SHAPE: a big blocky dark COBBLE and STONE castle with tall towers topped by pointed BRICK (red) cone roofs, crenellated walls, an...

// ===== BOWSER'S CASTLE — dark lava fortress, monster-mouth gate faces -Z =====

// ---------- helpers (no callbacks) ----------
function coneRoof(cx, cz, baseY, baseR, h, blk) {
  for (let i = 0; i <= h; i++) {
    const r = baseR * (1 - i / h);
    disk(cx, baseY + i, cz, r, blk);
  }
}
function ringCrenel(x1, z1, x2, z2, y, blk) {
  for (let x = x1; x <= x2; x++) {
    if (((x - x1) & 1) === 0) { block(x, y, z1, blk); block(x, y, z2, blk); }
  }
  for (let z = z1; z <= z2; z++) {
    if (((z - z1) & 1) === 0) { block(x1, y, z, blk); block(x2, y, z, blk); }
  }
}
function spike(cx, cz, baseY, h, baseR, blk) {
  for (let i = 0; i < h; i++) {
    const r = Math.floor(baseR * (h - 1 - i) / (h - 1));
    cube(cx - r, baseY + i, cz - r, cx + r, baseY + i, cz + r, blk);
  }
}
function horn(sx, sy, sz, dir, blk) {
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const dx = dir * 6 * (1 - Math.cos(f * Math.PI / 2));
    const dy = 9 * Math.sin(f * Math.PI / 2);
    const dz = -2 * f;
    const r = Math.max(0.5, 2.4 * (1 - f));
    sphere(Math.round(sx + dx), Math.round(sy + dy), Math.round(sz + dz), r, blk);
  }
}

// ---------- 0. clear the forest in our footprint ----------
cube(-22, 1, -22, 22, 11, 22, AIR);

// ---------- 1. lava lake / glowing moat (island = |x|<=15 & |z|<=15) ----------
cube(-22, 0, -22, 22, 0, -16, BRICK);   // north band
cube(-22, 0, 16, 22, 0, 22, BRICK);     // south band
cube(-22, 0, -15, -16, 0, 15, BRICK);   // west band
cube(16, 0, -15, 22, 0, 15, BRICK);     // east band
for (let x = -22; x <= 22; x++) {
  for (let z = -22; z <= 22; z++) {
    if (Math.abs(x) <= 15 && Math.abs(z) <= 15) continue;
    let n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
    n = n - Math.floor(n);
    if (n > 0.83) block(x, 0, z, SAND);   // bright glow speckles
  }
}

// ---------- 2. rocky island + craggy cliffs rising from the lava ----------
cube(-15, 1, -15, 15, 1, 15, COBBLE);          // courtyard / island top
cube(-15, -4, -15, 15, 0, -15, COBBLE);        // cliff face z=-15
cube(-15, -4, 15, 15, 0, 15, COBBLE);          // cliff face z=15
cube(-15, -4, -14, -15, 0, 14, COBBLE);        // cliff face x=-15
cube(15, -4, -14, 15, 0, 14, COBBLE);          // cliff face x=15
cube(-3, -6, -3, 3, 0, 3, COBBLE);             // central stem into lava
// a few lava cracks bleeding into the courtyard
block(-10, 1, 9, BRICK); block(9, 1, -10, BRICK); block(11, 1, 8, BRICK);
block(-9, 1, -11, BRICK); block(8, 1, 11, BRICK); block(-11, 1, -8, SAND);
// jagged volcanic rock spires out in the moat (foreground / depth)
spike(-19, -11, 0, 6, 1, STONE);
spike(18, 7, 0, 5, 1, COBBLE);
spike(-8, 19, 0, 6, 1, STONE);
spike(11, -19, 0, 5, 1, COBBLE);
spike(20, -18, 0, 4, 1, STONE);
spike(-20, 14, 0, 5, 1, COBBLE);

// ---------- 3. outer curtain walls + banding + crenellations ----------
cube(-14, 2, 13, 14, 10, 14, COBBLE);    // back wall (+Z)
cube(-14, 2, -14, -13, 10, 14, COBBLE);  // west wall
cube(13, 2, -14, 14, 10, 14, COBBLE);    // east wall
cube(-14, 2, -14, 14, 10, -13, COBBLE);  // front wall (-Z), gate carved later
// gray STONE string-course
cube(-14, 6, 13, 14, 6, 14, STONE);
cube(-14, 6, -14, -13, 6, 14, STONE);
cube(13, 6, -14, 14, 6, 14, STONE);
cube(-14, 6, -14, 14, 6, -13, STONE);
// 2-tall battlements
ringCrenel(-14, -14, 14, 14, 11, COBBLE);
ringCrenel(-14, -14, 14, 14, 12, COBBLE);

// ---------- 4. corner towers + red cone roofs + finials + windows ----------
const towers = [[-14, -14], [14, -14], [-14, 14], [14, 14]];
for (let t = 0; t < towers.length; t++) {
  const cx = towers[t][0], cz = towers[t][1];
  cube(cx - 2, -4, cz - 2, cx + 2, 0, cz + 2, COBBLE);  // rock pillar from lava
  hollowCylinder(cx, 1, cz, 3, 15, COBBLE);             // shaft y=1..15
  disk(cx, 1, cz, 3, COBBLE);                           // floor
  hollowCylinder(cx, 7, cz, 3, 1, STONE);               // band
  hollowCylinder(cx, 13, cz, 3, 1, STONE);              // band
  coneRoof(cx, cz, 15, 4, 8, BRICK);                    // pointed red roof y=15..23
  line(cx, 23, cz, cx, 27, cz, STONE);                  // finial spike
  block(cx, 27, cz, STONE);
  // glowing window slit facing the viewer (-Z)
  block(cx, 5, cz - 3, GLASS);
  block(cx, 8, cz - 3, GLASS);
  block(cx, 11, cz - 3, GLASS);
}

// ---------- 5. monster-mouth GATEHOUSE (front, -Z, faces viewer) ----------
cube(-7, 1, -18, 7, 13, -13, COBBLE);    // main mass (protrudes over the lava)
cube(-7, -4, -18, 7, 0, -16, COBBLE);    // rocky pedestal rising from lava
cube(-7, 12, -18, 7, 13, -18, STONE);    // heavy STONE brow ridge
// --- carve the monstrous maw (rounded arch tunnel into courtyard) ---
cube(-4, 2, -19, 4, 5, -12, AIR);
cube(-3, 6, -19, 3, 6, -12, AIR);
cube(-2, 7, -19, 2, 7, -12, AIR);
cube(-1, 8, -19, 1, 8, -12, AIR);
// --- BRICK fang-teeth around the mouth (interlocking) ---
// lower fangs (rise from floor)
cube(0, 1, -18, 0, 4, -17, BRICK);
cube(-2, 1, -18, -2, 3, -17, BRICK); cube(2, 1, -18, 2, 3, -17, BRICK);
cube(-4, 1, -18, -4, 2, -17, BRICK); cube(4, 1, -18, 4, 2, -17, BRICK);
// upper fangs (hang from the arch)
cube(-1, 5, -18, -1, 7, -17, BRICK); cube(1, 5, -18, 1, 7, -17, BRICK);
cube(-3, 4, -18, -3, 5, -17, BRICK); cube(3, 4, -18, 3, 5, -17, BRICK);
// --- glowing monster eyes (BRICK sockets, GLASS pupils) ---
cube(-5, 9, -18, -3, 11, -18, BRICK); block(-4, 10, -18, GLASS);
cube(3, 9, -18, 5, 11, -18, BRICK);   block(4, 10, -18, GLASS);
// --- angry STONE brows slanting toward the center ---
line(-6, 13, -18, -2, 11, -18, STONE);
line(2, 11, -18, 6, 13, -18, STONE);
// snout ridge between the eyes
block(0, 9, -18, STONE); block(0, 10, -18, STONE);
// gatehouse parapet + two horns
ringCrenel(-7, -18, 7, -13, 13, COBBLE);
spike(-6, -16, 13, 5, 1, STONE);
spike(6, -16, 13, 5, 1, STONE);

// ---------- 6. central KEEP (tallest) + shell spikes + horns ----------
hollowCylinder(0, 1, 0, 7, 6, COBBLE);    // y=1..6   r7
hollowCylinder(0, 7, 0, 6, 8, COBBLE);    // y=7..14  r6
hollowCylinder(0, 15, 0, 5, 8, COBBLE);   // y=15..22 r5
hollowCylinder(0, 6, 0, 7, 1, STONE);     // step band
hollowCylinder(0, 14, 0, 6, 1, STONE);    // step band
disk(0, 22, 0, 5, COBBLE);                // cap
// base buttresses
cube(0, 1, -7, 0, 6, -7, STONE); cube(0, 1, 7, 0, 6, 7, STONE);
cube(-7, 1, 0, -7, 6, 0, STONE); cube(7, 1, 0, 7, 6, 0, STONE);
// crown of STONE shell-spikes around the rim
for (let a = 0; a < 8; a++) {
  const ang = a * Math.PI / 4;
  const sx = Math.round(5 * Math.cos(ang));
  const sz = Math.round(5 * Math.sin(ang));
  spike(sx, sz, 22, 5, 1, STONE);
}
// small red crest cone between the horns
coneRoof(0, 0, 23, 2, 4, BRICK);
// two big curved horns (like Bowser's shell)
horn(-4, 20, -1, -1, STONE);
horn(4, 20, -1, 1, STONE);
// menacing glowing windows on the keep front (faces viewer)
block(0, 11, -6, GLASS); block(0, 12, -6, GLASS);
cube(0, 16, -5, 0, 19, -5, GLASS);
block(-1, 17, -5, BRICK); block(1, 17, -5, BRICK);
block(-6, 9, 0, GLASS); block(6, 9, 0, GLASS);

// ---------- 7. spikes bristling along the walls ----------
for (let z = -12; z <= 12; z += 3) {
  spike(-14, z, 13, 3, 1, STONE);
  spike(14, z, 13, 3, 1, STONE);
}
for (let x = -12; x <= 12; x += 3) {
  spike(x, 14, 13, 3, 1, STONE);
}
spike(-12, -14, 13, 3, 1, STONE); spike(-9, -14, 13, 3, 1, STONE);
spike(9, -14, 13, 3, 1, STONE);   spike(12, -14, 13, 3, 1, STONE);
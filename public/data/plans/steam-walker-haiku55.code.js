// steam-walker-haiku55 — prompt:
// a steam-powered walking machine...

const P = (x, y, z, id) => block(Math.round(x), Math.round(y), Math.round(z), id);

function fillBox(x1, y1, z1, x2, y2, z2, id) {
  const ax = Math.min(x1, x2), bx = Math.max(x1, x2);
  const ay = Math.min(y1, y2), by = Math.max(y1, y2);
  const az = Math.min(z1, z2), bz = Math.max(z1, z2);
  for (let x = ax; x <= bx; x++)
    for (let y = ay; y <= by; y++)
      for (let z = az; z <= bz; z++) P(x, y, z, id);
}

function shellBox(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++)
        if (x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2) P(x, y, z, id);
}

function ball(cx, cy, cz, r, id) {
  cx = Math.round(cx); cy = Math.round(cy); cz = Math.round(cz);
  const R = Math.ceil(r);
  for (let x = -R; x <= R; x++)
    for (let y = -R; y <= R; y++)
      for (let z = -R; z <= R; z++)
        if (x * x + y * y + z * z <= r * r + 0.01) P(cx + x, cy + y, cz + z, id);
}

function capsule(a, b, r, id) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(L * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ball(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, id);
  }
}

function thinRod(a, b, id) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(L * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    P(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, id);
  }
}

// horizontal cylinder along Z; thick = shell thickness (undefined = solid)
function tubeZ(cx, cy, zA, zB, r, id, thick) {
  const R = Math.ceil(r);
  for (let z = zA; z <= zB; z++)
    for (let dx = -R; dx <= R; dx++)
      for (let dy = -R; dy <= R; dy++) {
        const d = Math.hypot(dx, dy);
        if (d <= r + 0.01 && (thick === undefined || d > r - thick)) P(cx + dx, cy + dy, z, id);
      }
}

// vertical cylinder; thick = shell thickness (undefined = solid)
function tubeY(cx, cz, yA, yB, r, id, thick) {
  const R = Math.ceil(r);
  for (let y = yA; y <= yB; y++)
    for (let dx = -R; dx <= R; dx++)
      for (let dz = -R; dz <= R; dz++) {
        const d = Math.hypot(dx, dz);
        if (d <= r + 0.01 && (thick === undefined || d > r - thick)) P(cx + dx, y, cz + dz, id);
      }
}

// gear in the YZ plane at x; alternating teeth on the rim
function gearX(x, cy, cz, r, teeth, toothId, bodyId, hubId) {
  for (let y = cy - r; y <= cy + r; y++)
    for (let z = cz - r; z <= cz + r; z++) {
      const dy = y - cy, dz = z - cz;
      const d = Math.hypot(dy, dz);
      if (d > r + 0.01) continue;
      const ang = ((Math.atan2(dz, dy) + Math.PI) / (2 * Math.PI)) * teeth;
      if (d <= 1.01) P(x, y, z, hubId);
      else if (d <= r - 1 + 0.01) P(x, y, z, bodyId);
      else P(x, y, z, Math.floor(ang) % 2 === 0 ? toothId : bodyId);
    }
}

function leg(sx, sz) {
  const zc = sz * 4;
  const hip = [sx * 6, 10, zc], knee = [sx * 10, 5, zc], ankle = [sx * 9, 1, zc];
  capsule(hip, knee, 1, IRON);
  capsule(knee, ankle, 1, COPPER);
  ball(hip[0], hip[1], hip[2], 1, GOLD);
  ball(knee[0], knee[1], knee[2], 1, GOLD);
  ball(ankle[0], ankle[1], ankle[2], 1, IRON);
  fillBox(sx * 9 - 2, 0, zc - 2, sx * 9 + 2, 0, zc + 2, IRON);   // foot plate
  fillBox(sx * 9 - 2, 0, zc - 2, sx * 9 + 2, 0, zc - 2, GOLD);   // toe trim
}

// ---------- 1. clear the site (AIR is free) ----------
fillBox(-12, 0, -8, 12, 30, 8, AIR);
fillBox(-19, 0, 11, -11, 33, 19, AIR);
fillBox(11, 0, 11, 18, 30, 18, AIR);

// ---------- 2. foundations (single layer at y=-1, feet stand at y=0) ----------
for (let x = -11; x <= 11; x++)
  for (let z = -7; z <= 7; z++)
    P(x, -1, z, (x % 6 === 0 || z % 6 === 0) ? STONE : COBBLE);
fillBox(-18, -1, 12, -12, -1, 18, COBBLE);
fillBox(12, -1, 12, 17, -1, 17, COBBLE);

// ---------- 3. background: clock tower (left) and smaller tower (right) ----------
shellBox(-18, 0, 13, -13, 30, 18, BRICK);
[8, 16, 24].forEach(y => fillBox(-17, y, 14, -14, y, 17, IRON));
[4, 9, 14, 27].forEach(y => {
  P(-16, y, 13, GLASS); P(-15, y, 13, GLASS);
  P(-16, y + 1, 13, GLASS); P(-15, y + 1, 13, GLASS);
});
// clock face on the north wall, centre (-15.5, 21)
for (let x = -18; x <= -13; x++)
  for (let y = 18; y <= 24; y++) {
    const d = Math.hypot(x + 15.5, y - 21);
    if (d <= 1.3) P(x, y, 13, WHITE);
    else if (d <= 2.6) P(x, y, 13, GOLD);
  }
P(-15, 21, 13, BLACK); P(-15, 23, 13, BLACK);
fillBox(-18, 31, 13, -13, 31, 18, IRON);
fillBox(-16, 32, 14, -15, 32, 17, COPPER);
fillBox(-16, 33, 15, -15, 33, 16, COPPER);

shellBox(13, 0, 13, 16, 22, 16, STONE);
fillBox(13, 23, 13, 16, 23, 16, IRON);
[4, 9, 14].forEach(y => { P(14, y, 13, GLASS); P(15, y, 13, GLASS); });
P(14, 24, 14, STEAM); P(15, 24, 15, STEAM);

// ---------- 4. the walking machine (front = -Z, faces the camera) ----------

// boiler: horizontal along Z, centre (0,13,0), radius 4
tubeZ(0, 13, -4, 4, 3, IRON);            // solid core
tubeZ(0, 13, -4, 4, 4, COPPER, 1);       // copper shell
tubeZ(0, 13, -2, -2, 4, IRON);           // iron bands
tubeZ(0, 13, 1, 1, 4, IRON);
tubeZ(0, 13, -4, -4, 4, IRON);           // front cap
tubeZ(0, 13, 4, 4, 4, IRON);             // back cap

// face plate with rivets, furnace door and eyes on the front
fillBox(-3, 9, -5, 3, 17, -5, IRON);
[[-3, 9], [3, 9], [-3, 17], [3, 17], [-3, 13], [3, 13]].forEach(([x, y]) => P(x, y, -5, GOLD));
for (let x = -2; x <= 2; x++)
  for (let y = 10; y <= 14; y++) {
    const d = Math.hypot(x, y - 12);
    if (d <= 1.01) P(x, y, -5, GLOWSTONE);
    else if (d <= 2.01) P(x, y, -5, GOLD);
  }
P(0, 12, -5, FIRE);
P(-2, 15, -5, NEON_RED); P(2, 15, -5, NEON_RED);
P(-2, 16, -5, GOLD); P(2, 16, -5, GOLD);

// two smokestacks with gold bands and flared caps
tubeY(-2, 0, 14, 24, 1.5, COPPER);
tubeY(2, 0, 14, 24, 1.5, COPPER);
tubeY(-2, 0, 20, 20, 1.5, GOLD);
tubeY(2, 0, 20, 20, 1.5, GOLD);
tubeY(-2, 0, 25, 25, 2, IRON);
tubeY(2, 0, 25, 25, 2, IRON);
P(-2, 26, 0, STEAM); P(2, 26, 0, STEAM);

// cab on the rear half of the boiler
shellBox(-3, 17, 1, 3, 21, 4, IRON);
fillBox(-3, 16, 1, 3, 16, 4, IRON);
fillBox(-4, 22, 0, 4, 22, 5, IRON);
fillBox(-2, 18, 1, 2, 20, 1, GLASS);
fillBox(-3, 18, 2, -3, 20, 3, GLASS);
fillBox(3, 18, 2, 3, 20, 3, GLASS);
P(0, 19, 3, GLOWSTONE);
P(0, 23, 2, GOLD); P(0, 24, 2, GOLD); P(0, 25, 2, STEAM);

// flywheel gears on both sides of the boiler
gearX(-5, 13, 0, 3, 12, GOLD, IRON, COPPER);
gearX(5, 13, 0, 3, 12, GOLD, IRON, COPPER);
thinRod([-5, 12, 3], [-6, 10, 4], COPPER);
thinRod([5, 12, 3], [6, 10, 4], COPPER);

// hip crossbeams under the boiler, one at each end
fillBox(-6, 9, -5, 6, 9, -3, IRON);
fillBox(-6, 9, 3, 6, 9, 5, IRON);

// four walking legs
for (const sx of [-1, 1]) for (const sz of [-1, 1]) leg(sx, sz);

// coal bunker at the rear
shellBox(-3, 9, 5, 3, 14, 7, BLACK);
fillBox(-3, 15, 5, 3, 15, 7, IRON);
P(-2, 12, 5, GOLD); P(2, 12, 5, GOLD);

// ---------- 5. ground clutter ----------
ball(-12, 0, 4, 1, COBBLE);
ball(12, 0, -4, 1, STONE);
ball(3, 0, -8, 1, COBBLE);
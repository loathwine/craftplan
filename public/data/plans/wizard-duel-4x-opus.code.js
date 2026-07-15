// wizard-duel-4x-opus — prompt:
// two wizards dueling with magic...

cube(-21, 1, -9, 21, 21, 9, AIR); // clear the stage foliage/trees so the duel is visible

// ---------- arena floor + magic rune circles ----------
disk(0, 0, 0, 17, STONE);
disk(0, -1, 0, 17, COBBLE);
// weathered patches
disk(6, 0, -5, 3, COBBLE);
disk(-7, 0, 4, 3, COBBLE);
disk(-4, 0, -6, 2, COBBLE);

function ringGlyph(rad, y, blkA, blkB) {
  for (let a = 0; a < 360; a += 8) {
    const x = Math.round(rad * Math.cos(a * Math.PI / 180));
    const z = Math.round(rad * Math.sin(a * Math.PI / 180));
    block(x, y, z, ((a / 8) % 2) ? blkA : blkB);
  }
}
ringGlyph(16, 0, ICE, BRICK);
ringGlyph(12, 0, GLASS, BRICK);
ringGlyph(8, 0, ICE, BRICK);
// runic spokes radiating from the clash point
for (let a = 0; a < 360; a += 45) {
  const dx = Math.cos(a * Math.PI / 180), dz = Math.sin(a * Math.PI / 180);
  line(Math.round(4 * dx), 0, Math.round(4 * dz),
       Math.round(11 * dx), 0, Math.round(11 * dz),
       (a % 90) ? ICE : BRICK);
}

// ---------- wizard builder ----------
// dir = +1 : stands left of center, casts toward +X
// dir = -1 : stands right of center, casts toward -X
function buildWizard(bx, dir, robe, trim, hat, orb, beard) {
  // flared robe (stacked tapering disks)
  disk(bx, 0, 0, 5, trim);         // hem
  for (let y = 1; y <= 8; y++) {
    const r = Math.round(4.6 - y * 0.4);
    disk(bx, y, 0, r, robe);
  }
  // cape flare trailing back (+Z) for silhouette depth
  for (let z = 1; z <= 4; z++) {
    const w = 4 - z;
    cube(bx - w, 0, z, bx + w, Math.max(1, 5 - z), z, robe);
  }
  // belt
  disk(bx, 4, 0, 3, trim);
  block(bx, 4, -3, orb); // belt buckle gem
  // shoulders
  disk(bx, 9, 0, 2, robe);
  // neck + head
  block(bx, 9, 0, SAND);
  cube(bx - 1, 10, -1, bx + 1, 12, 1, SAND); // face block
  block(bx, 11, -2, SAND);                   // nose
  // shadowed eyes
  block(bx - 1, 11, -2, AIR);
  block(bx + 1, 11, -2, AIR);
  // long beard down the front
  cube(bx - 1, 7, -2, bx + 1, 9, -2, beard);
  cube(bx - 1, 8, -2, bx + 1, 9, -1, beard);
  block(bx, 6, -2, beard);
  block(bx, 5, -2, beard);
  // pointed wizard hat
  disk(bx, 13, 0, 4, hat);      // wide brim
  disk(bx, 13, 0, 4, hat);
  for (let i = 0; i <= 7; i++) {
    const r = Math.max(0, Math.round(3.2 - i * 0.45));
    disk(bx, 14 + i, 0, r, hat);
  }
  disk(bx, 15, 0, 3, trim);     // hat band
  block(bx, 21, 0, orb);        // star at the tip
  // scattered stars on the hat
  block(bx + 1, 17, -1, trim);
  block(bx - 1, 18, 0, trim);
  block(bx, 16, -2, orb);

  // casting arm reaching toward the center, sleeve
  const sx = bx + dir * 2, hx = bx + dir * 5;
  line(bx + dir * 1, 9, -1, hx, 7, -1, robe);
  line(bx + dir * 1, 8, -1, hx, 6, -1, robe);
  cube(sx, 8, -2, sx + dir, 9, 0, robe); // shoulder pad
  block(hx, 6, -1, SAND);                // hand

  // staff held diagonally, tip toward the clash
  const tx = bx + dir * 8, ty = 12, tz = 0;
  line(hx, 4, -1, tx, ty, tz, OAK_LOG);
  line(hx, 5, -1, tx - dir, ty - 1, tz, OAK_LOG);
  // glowing orb crowning the staff
  sphere(tx, ty, tz, 2, orb);
  hollowSphere(tx, ty, tz, 3, trim);

  return { tx, ty, tz };
}

// ICE wizard on the left (blue/cyan), FIRE wizard on the right (red/gold)
const iceStaff  = buildWizard(-13, +1, GLASS, ICE,   ICE,   SNOW, SNOW);
const fireStaff = buildWizard( 13, -1, BRICK, SAND,  BRICK, BRICK, SNOW);

// ---------- clashing magic in the center ----------
const CX = 0, CY = 9, CZ = 0;

function beam(s, colOuter, colInner) {
  // thick converging beam from a staff orb to the clash point
  line(s.tx, s.ty, s.tz, CX, CY, CZ, colInner);
  line(s.tx, s.ty + 1, s.tz, CX, CY + 1, CZ, colOuter);
  line(s.tx, s.ty - 1, s.tz, CX, CY - 1, CZ, colOuter);
  line(s.tx, s.ty, s.tz + 1, CX, CY, CZ + 1, colOuter);
  line(s.tx, s.ty, s.tz - 1, CX, CY, CZ - 1, colOuter);
}
beam(iceStaff, ICE, GLASS);
beam(fireStaff, SAND, BRICK);

// central explosion where the spells collide — a mixed ice/fire nova
for (let dx = -4; dx <= 4; dx++)
  for (let dy = -4; dy <= 4; dy++)
    for (let dz = -4; dz <= 4; dz++) {
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > 2.6 && d < 3.6) {
        // fire on the +X half, ice on the -X half, white seam in the middle
        let b;
        if (dx > 1) b = BRICK;
        else if (dx < -1) b = ICE;
        else b = SNOW;
        block(CX + dx, CY + dy, CZ + dz, b);
      }
    }
sphere(CX, CY, CZ, 1, SNOW); // blinding core

// jagged discharge bolts bursting from the collision
function bolt(ex, ey, ez, mx, my, mz, col) {
  line(CX, CY, CZ, mx, my, mz, col);
  line(mx, my, mz, ex, ey, ez, col);
}
bolt(6, 15, -2, 3, 11, 0, BRICK);
bolt(-6, 15, 2, -3, 11, 0, ICE);
bolt(2, 16, 3, 1, 12, 1, SNOW);
bolt(-2, 14, -4, -1, 11, -2, GLASS);
bolt(5, 5, 4, 2, 7, 2, BRICK);
bolt(-5, 4, -4, -2, 7, -2, ICE);
bolt(0, 17, 0, 0, 13, 0, SNOW);
bolt(4, 12, -5, 2, 10, -2, SAND);
bolt(-4, 13, 5, -2, 10, 2, GLASS);

// floating spell shards orbiting the nova (asymmetric, both elements)
const shards = [
  [7, 12, -3, BRICK], [8, 10, 2, SAND], [-7, 13, 3, ICE], [-8, 11, -2, GLASS],
  [3, 15, 4, BRICK], [-3, 16, -4, ICE], [5, 8, -4, BRICK], [-5, 7, 4, ICE],
  [2, 18, -1, SNOW], [-2, 17, 1, SNOW], [6, 6, 3, SAND], [-6, 6, -3, GLASS],
];
for (const [x, y, z, b] of shards) block(x, y, z, b);

// ---------- surrounding ruined pillars (foreground/background framing) ----------
function pillar(px, pz, h, top) {
  cylinder(px, 0, pz, 1, h, COBBLE);
  block(px, h, pz, top);          // capstone / rune
  if (h > 4) block(px + 1, h - 1, pz, COBBLE); // broken chunk
}
pillar(-18, -6, 8, ICE);
pillar(18, -6, 6, BRICK);
pillar(-19, 6, 5, ICE);
pillar(19, 5, 9, BRICK);
pillar(-16, 9, 4, ICE);     // shorter, broken
pillar(16, 9, 7, BRICK);
pillar(-13, -9, 10, ICE);
pillar(13, -9, 10, BRICK);

// scattered rubble from the battle
const rubble = [
  [-9, 0, 6], [9, 0, -6], [-6, 0, 7], [7, 0, 6], [4, 0, -7],
  [-4, 0, -7], [11, 0, 3], [-11, 0, -3], [3, 1, 6], [-3, 1, -6],
];
for (const [x, y, z] of rubble) { block(x, y, z, COBBLE); block(x, y + 1, z, COBBLE); }

// impact scorch + frost cracks radiating on the floor beneath the clash
line(0, 0, 0, 6, 0, 3, BRICK);
line(0, 0, 0, -6, 0, -3, ICE);
line(0, 0, 0, 4, 0, -5, BRICK);
line(0, 0, 0, -4, 0, 5, ICE);
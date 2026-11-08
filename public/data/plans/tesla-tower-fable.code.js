// tesla-tower-fable — prompt:
// a steampunk Tesla coil tower crackling with lightning...

// Steampunk Tesla coil tower — front faces north (-Z)
// Ground around origin is y=-1/0 with some trees; clear the site
cube(-12, 0, -12, 12, 12, 12, AIR);
cube(-16, 0, -16, 16, 3, 16, AIR);

// ===== Foundation plaza =====
disk(0, -1, 0, 11, COBBLE);
disk(0, 0, 0, 9, STONE);
hollowCylinder(0, 0, 0, 10, 1, BRICK);
// corner bollards
for (const [bx, bz] of [[-9,-9],[9,-9],[-9,9],[9,9]]) {
  cube(bx, 0, bz, bx, 2, bz, IRON);
  block(bx, 3, bz, COPPER);
}

// ===== Base engine house (octagon-ish) =====
cylinder(0, 1, 0, 7, 1, BRICK);
hollowCylinder(0, 2, 0, 7, 5, BRICK);
hollowCylinder(0, 7, 0, 7, 1, COPPER);   // copper trim ring
// riveted iron corner bands
for (let a = 0; a < 8; a++) {
  const ang = a * Math.PI / 4 + Math.PI / 8;
  const x = Math.round(Math.cos(ang) * 7), z = Math.round(Math.sin(ang) * 7);
  cube(x, 2, z, x, 7, z, IRON);
}
// front door (north) with arch
cube(-1, 2, -7, 1, 4, -7, AIR);
cube(-2, 5, -7, 2, 5, -7, COPPER);
block(0, 6, -7, GOLD);
// windows around with brass frames
for (const [wx, wz] of [[-7,0],[7,0],[0,7]]) {
  if (wx === 0) { cube(-1, 3, wz, 1, 4, wz, GLASS); cube(-2, 3, wz, -2, 4, wz, COPPER); cube(2, 3, wz, 2, 4, wz, COPPER); }
  else { cube(wx, 3, -1, wx, 4, 1, GLASS); cube(wx, 3, -2, wx, 4, -2, COPPER); cube(wx, 3, 2, wx, 4, 2, COPPER); }
}
// roof deck
disk(0, 8, 0, 7, IRON);
hollowCylinder(0, 9, 0, 7, 1, COPPER); // railing

// ===== Boiler room annex (east, rear) =====
cube(8, 1, 2, 14, 5, 8, BRICK);
cube(8, 6, 2, 14, 6, 8, IRON);
cube(9, 2, 1, 13, 4, 1, GLASS);  // north window strip
cube(9, 1, 1, 9, 5, 1, COPPER); cube(13, 1, 1, 13, 5, 1, COPPER);
// boiler drum on top
for (let z = 3; z <= 7; z++) hollowCylinder(11, 7, z, 2, 1, COPPER);
cube(11, 7, 2, 11, 7, 8, IRON);
// smokestack with STEAM
cylinder(13, 7, 7, 1, 6, IRON);
hollowCylinder(13, 13, 7, 2, 1, COPPER);
block(13, 14, 7, STEAM);
block(13, 15, 7, STEAM);
// pipes from boiler to tower
cube(8, 8, 4, 2, 8, 4, COPPER);
cube(8, 8, 6, 2, 8, 6, COPPER);
cube(7, 9, 4, 7, 9, 6, COPPER);
// valve wheels
block(5, 9, 4, GOLD); block(5, 9, 6, GOLD);
block(8, 9, 2, STEAM);

// ===== Generator shed (west) =====
cube(-13, 1, -3, -8, 4, 3, PLANKS);
hollowCube(-13, 1, -3, -8, 5, 3, OAK_LOG);
cube(-13, 5, -3, -8, 5, 3, IRON);
cube(-12, 2, -3, -9, 3, -3, GLASS);
// big flywheel on north side
hollowCylinder(-10, 6, 0, 3, 1, IRON);
// west wheel (vertical) — ring using line in XZ-plane is awkward, do YZ ring
for (let i = 0; i < 24; i++) {
  const a = i / 24 * Math.PI * 2;
  block(-14, Math.round(8 + 3 * Math.sin(a)), Math.round(0 + 3 * Math.cos(a)), IRON);
}
cube(-14, 5, 0, -14, 11, 0, COPPER);
cube(-14, 8, -3, -14, 8, 3, COPPER);
block(-14, 8, 0, GOLD);
// drive shaft to tower
cube(-8, 6, 0, -1, 6, 0, COPPER);
block(-9, 6, -1, STEAM);

// ===== Tower shaft =====
// lattice iron legs
for (const [lx, lz] of [[-4,-4],[4,-4],[-4,4],[4,4]]) {
  cube(lx, 9, lz, lx, 20, lz, IRON);
}
// cross bracing rings
for (const y of [11, 14, 17, 20]) {
  hollowCube(-4, y, -4, 4, y, 4, COPPER);
}
// diagonal struts
for (let y = 9; y <= 20; y++) {
  const t = (y - 9) / 11;
  const d = Math.round(4 - 2 * t);
  block(-d, y, -4, IRON); block(d, y, -4, IRON);
  block(-d, y, 4, IRON); block(d, y, 4, IRON);
  block(-4, y, -d, IRON); block(-4, y, d, IRON);
  block(4, y, -d, IRON); block(4, y, d, IRON);
}
// central primary coil (copper winding, insulated core)
cylinder(0, 9, 0, 2, 12, OBSIDIAN);
for (let y = 10; y <= 20; y += 2) hollowCylinder(0, y, 0, 3, 1, COPPER);
// glowing insulator rings
for (const y of [12, 16]) hollowCylinder(0, y, 0, 2, 1, GLOWSTONE);
// secondary coil (narrow, tall)
cylinder(0, 21, 0, 1, 7, COPPER);
cube(0, 21, 0, 0, 28, 0, GOLD);
hollowCylinder(0, 21, 0, 2, 1, IRON);
hollowCylinder(0, 24, 0, 2, 1, IRON);
hollowCylinder(0, 27, 0, 2, 1, IRON);

// ===== Toroid top =====
for (let i = 0; i < 32; i++) {
  const a = i / 32 * Math.PI * 2;
  const cx = Math.cos(a), cz = Math.sin(a);
  for (let r = 3; r <= 5; r++) {
    const x = Math.round(cx * r), z = Math.round(cz * r);
    block(x, 29, z, IRON);
    block(x, 30, z, r === 4 ? IRON : COPPER);
    if (r === 4) block(x, 31, z, IRON);
  }
}
disk(0, 29, 0, 2, IRON);
disk(0, 30, 0, 3, COPPER);
block(0, 31, 0, GOLD);
cube(0, 32, 0, 0, 33, 0, GOLD);
// lightning
block(0, 33, 0, ELECTRIC);
block(5, 31, -3, ELECTRIC);
block(-5, 31, 2, ELECTRIC);
block(2, 33, -5, ELECTRIC);
block(-3, 32, 5, ELECTRIC);
block(4, 24, -4, ELECTRIC);
block(-4, 18, -4, ELECTRIC);
block(-10, 11, 0, ELECTRIC);

// ===== Discharge rods on the plaza (lightning targets) =====
for (const [rx, rz] of [[-7,-11],[7,-11]]) {
  cube(rx, 0, rz, rx, 1, rz, STONE);
  cube(rx, 2, rz, rx, 10, rz, IRON);
  cube(rx, 11, rz, rx, 12, rz, COPPER);
  block(rx, 13, rz, GOLD);
  hollowCylinder(rx, 10, rz, 1, 1, COPPER);
}
block(-7, 14, -11, ELECTRIC);
block(7, 14, -11, ELECTRIC);

// ===== Front details =====
// gear emblem over door
hollowCylinder(0, 6, -8, 2, 1, GOLD);
for (const [gx, gy] of [[-3,6],[3,6],[0,9],[0,4]]) block(gx, gy, -8, GOLD);
// gauges / dials on front wall
block(-4, 5, -7, GOLD); block(4, 5, -7, GOLD);
block(-4, 4, -7, NEON_BLUE); block(4, 4, -7, NEON_BLUE);
// lamp posts flanking the path
for (const lx of [-3, 3]) {
  cube(lx, 0, -10, lx, 3, -10, IRON);
  block(lx, 4, -10, GLOWSTONE);
  block(lx, 5, -10, COPPER);
}
// path to door
cube(-1, -1, -12, 1, -1, -8, BRICK);
cube(-1, 0, -12, 1, 0, -8, AIR);
// crates and barrels in yard
cube(-7, 1, -8, -6, 1, -7, PLANKS);
block(-6, 2, -8, PLANKS);
hollowCylinder(6, 1, -8, 1, 2, OAK_LOG);
block(6, 1, -8, COPPER); block(6, 2, -8, COPPER);
// loose copper wire coils on the ground
hollowCylinder(5, 1, -6, 1, 1, COPPER);
hollowCylinder(-5, 1, -6, 1, 1, COPPER);
// rooftop spark gaps
block(-6, 10, -5, COPPER); block(-6, 11, -5, NEON_BLUE);
block(6, 10, -5, COPPER); block(6, 11, -5, NEON_BLUE);
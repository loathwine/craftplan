// ornithopter-fable — prompt:
// Da Vinci's flying machine...

const SIDE = [-1, 1];
const R = Math.round;

// --- clear the launch site and the aerial-screw plot ---
cube(-6, 0, -10, 6, 9, 9, AIR);
cube(9, 0, 8, 20, 13, 20, AIR);

// --- launch gantry (wooden scaffold) ---
for (const sx of SIDE) for (const sz of SIDE) {
  cube(sx * 4, -2, sz * 5, sx * 4, 8, sz * 5, OAK_LOG);
  block(sx * 4, -2, sz * 5, STONE);
}
for (const y of [2, 5]) {
  for (const sx of SIDE) line(sx * 4, y, -5, sx * 4, y, 5, PLANKS);
  for (const sz of SIDE) line(-4, y, sz * 5, 4, y, sz * 5, PLANKS);
}
// diagonal bracing
for (const sx of SIDE) {
  line(sx * 4, 0, -5, sx * 4, 4, 0, PLANKS);
  line(sx * 4, 0, 5, sx * 4, 4, 0, PLANKS);
  line(sx * 4, 4, -5, sx * 4, 8, 0, PLANKS);
  line(sx * 4, 4, 5, sx * 4, 8, 0, PLANKS);
}
for (const sz of SIDE) {
  line(-4, 0, sz * 5, 0, 4, sz * 5, PLANKS);
  line(4, 0, sz * 5, 0, 4, sz * 5, PLANKS);
}
// deck + mid platform
cube(-5, 8, -6, 5, 8, 6, PLANKS);
cube(-3, 4, -3, 3, 4, 3, PLANKS);
// railing on deck edges (short)
for (const sx of SIDE) line(sx * 5, 9, -6, sx * 5, 9, 6, OAK_LOG);
// ladder on north face
for (let y = 0; y <= 8; y++) line(-1, y, -6, 1, y, -6, (y % 2 === 0) ? OAK_LOG : PLANKS);
cube(-1, 0, -6, -1, 8, -6, OAK_LOG);
cube(1, 0, -6, 1, 8, -6, OAK_LOG);

// --- fuselage frame (ornithopter keel + hoops) ---
line(0, 9, -9, 0, 9, 9, OAK_LOG);
line(0, 9, -9, 0, 11, -12, OAK_LOG);         // bowsprit nose
for (const sx of SIDE) line(sx * 2, 11, -7, sx * 2, 11, 7, OAK_LOG);
for (const z of [-7, -3, 1, 5]) hollowCube(-2, 9, z, 2, 11, z, PLANKS);
line(-2, 11, -7, 0, 11, -12, PLANKS);
line(2, 11, -7, 0, 11, -12, PLANKS);
// upper spine arch over pilot
line(0, 12, -7, 0, 12, 7, PLANKS);
for (const z of [-7, 7]) line(-2, 11, z, 2, 11, z, PLANKS);

// --- pilot lying prone, head north ---
cube(-1, 10, -4, 1, 10, 1, BROWN);           // tunic
cube(-1, 10, 2, -1, 10, 5, BLUE);             // legs
cube(1, 10, 2, 1, 10, 5, BLUE);
block(-1, 10, 6, BLACK); block(1, 10, 6, BLACK);   // boots
sphere(0, 10, -5, 1, SAND);                   // head
cube(-1, 11, -6, 1, 11, -4, BROWN);           // hair
block(0, 10, -7, SAND);                       // chin forward
block(-1, 10, -6, WHITE); block(1, 10, -6, WHITE); // eyes-ish
// arms up to levers
line(-1, 10, -3, -3, 12, -6, BROWN);
line(1, 10, -3, 3, 12, -6, BROWN);
block(-3, 13, -6, IRON); block(3, 13, -6, IRON);   // lever handles
line(-3, 11, -6, -3, 13, -6, IRON);
line(3, 11, -6, 3, 13, -6, IRON);
// windlass drum under the feet + crank
cylinder(0, 8, 5, 2, 1, COPPER);
hollowCylinder(0, 9, 5, 2, 1, IRON);
line(2, 9, 5, 3, 10, 5, IRON);

// --- wings (bat-membrane, canvas on wooden fingers) ---
function wing(s) {
  const tipPts = [];
  for (let dx = 4; dx <= 20; dx++) {
    const x = s * dx;
    const t = (dx - 4) / 16;
    const y = 11 + R(t * t * 4);
    const lead = -7 + R(t * 5);
    const scallop = ((dx + 3) % 6 === 0) ? 2 : (((dx + 2) % 6 === 0 || (dx + 4) % 6 === 0) ? 1 : 0);
    const trail = 7 - R(t * 7) - scallop;
    for (let z = lead; z <= trail; z++) block(x, y, z, SAND);
    block(x, y, lead, OAK_LOG);                  // leading spar
    block(x, y + 1, lead, OAK_LOG);
    if (dx % 4 === 0) {                          // finger ribs
      for (let z = lead; z <= trail; z++) block(x, y, z, OAK_LOG);
      block(x, y, trail + 1, BROWN);
      tipPts.push([x, y, trail]);
    }
  }
  // fan ribs from shoulder joint to fingertips
  for (const p of tipPts) line(s * 4, 11, -6, p[0], p[1], p[2], BROWN);
  // shoulder joint + pulley
  cube(s * 3, 11, -7, s * 4, 12, -5, OAK_LOG);
  block(s * 4, 13, -6, COPPER);
  // control rope from lever to mid-wing
  line(s * 3, 13, -6, s * 12, 13, -3, BROWN);
  block(s * 12, 13, -3, COPPER);
  // under-wing strut to keel
  line(s * 2, 9, -3, s * 10, 11, -2, PLANKS);
}
wing(-1); wing(1);

// --- fan tail ---
for (let z = 8; z <= 15; z++) {
  const w = Math.min(6, z - 7);
  cube(-w, 10, z, w, 10, z, SAND);
  block(-w, 10, z, OAK_LOG); block(w, 10, z, OAK_LOG);
}
line(0, 10, 8, 0, 10, 15, OAK_LOG);
line(0, 10, 8, -6, 10, 14, BROWN);
line(0, 10, 8, 6, 10, 14, BROWN);

// --- workshop props on the ground (north-west, visible from camera) ---
cube(-10, 0, -9, -8, 0, -8, PLANKS);          // drafting table
cube(-10, -1, -9, -10, -1, -9, OAK_LOG);
cube(-8, -1, -8, -8, -1, -8, OAK_LOG);
cube(-10, 1, -9, -9, 1, -9, WHITE);           // sketches
block(-8, 1, -8, BROWN);                       // notebook
block(-9, 1, -8, GLOWSTONE);                   // candle
cube(7, 0, -9, 8, 1, -8, PLANKS);              // crate
cube(7, 0, -6, 7, 0, -5, OAK_LOG);             // lumber pile
cube(8, 0, -6, 9, 0, -5, OAK_LOG);
block(10, 0, -7, IRON);                        // tools

// --- aerial screw (Da Vinci's helix) in the south-east ---
cube(14, -1, 14, 14, 11, 14, OAK_LOG);
cube(12, -1, 12, 16, -1, 16, PLANKS);
hollowCube(11, 0, 11, 17, 0, 17, OAK_LOG);
for (let i = 0; i <= 70; i++) {
  const a = i * 0.22;
  const y = 2 + i * 0.11;
  for (let r = 1; r <= 5; r++) {
    const bx = R(14 + r * Math.cos(a)), bz = R(14 + r * Math.sin(a));
    block(bx, R(y), bz, r === 5 ? OAK_LOG : SAND);
  }
}
// spokes for the screw
for (let k = 0; k < 4; k++) {
  const a = k * Math.PI / 2;
  line(14, 1, 14, R(14 + 5 * Math.cos(a)), 1, R(14 + 5 * Math.sin(a)), PLANKS);
}
block(14, 12, 14, COPPER);
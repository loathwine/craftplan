// ski-jumper-haiku55 — prompt:
// a ski jumper flying off a ski jump...

// Ski jumper in flight off a ski jump. Jump runs west to east; the jumper flies east in profile to the north-facing camera.

const SPECTATOR_COLORS = [RED, YELLOW, BLUE, WHITE, ORANGE, PINK, LIME, PURPLE];
const hash = (n) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

// Thick 2D stroke in the XY plane, 3 blocks deep in Z
function limb(x1, y1, x2, y2, id) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(x1 + ((x2 - x1) * i) / steps);
    const y = Math.round(y1 + ((y2 - y1) * i) / steps);
    for (let z = -1; z <= 1; z++) block(x, y, z, id);
  }
}

// Inrun: steep ramp from y=24 at x=-14 down to y=9 at x=-2, takeoff lip at x=0
function inrunTop(x) {
  if (x === 0) return 8;
  return Math.round(24 - ((x + 14) * 15) / 12);
}

// Landing hill: drops steeply after the lip, flattens into the outrun
const LANDING = { 1: 7, 2: 6, 3: 5, 4: 4, 5: 4, 6: 3, 7: 3, 8: 2, 9: 2, 10: 2, 11: 1, 12: 1, 13: 1 };
function landTop(x) { return LANDING[x] !== undefined ? LANDING[x] : 0; }

// 1. Clear the site (AIR is free)
cube(-22, 0, -7, 22, 30, 7, AIR);
cube(10, 0, 8, 22, 12, 11, AIR);

// 2. Inrun deck, side walls with red rails, pillars underneath
for (let x = -14; x <= 0; x++) {
  const y = inrunTop(x);
  cube(x, y, -2, x, y, 2, SNOW);
  for (const z of [-3, 3]) {
    cube(x, -2, z, x, y, z, STONE);
    block(x, y + 1, z, RED);
  }
  if ((x + 14) % 3 === 0 || x === 0) {
    for (const z of [-2, 0, 2]) cube(x, -2, z, x, y - 1, z, STONE);
  }
}

// 3. Start tower with cross-bracing and platform
for (const [x, z] of [[-20, -3], [-20, 3], [-17, -3], [-17, 3]]) {
  cube(x, -2, z, x, 23, z, OAK_LOG);
}
for (const y of [6, 14, 22]) {
  line(-20, y, -3, -20, y, 3, OAK_LOG);
  line(-17, y, -3, -17, y, 3, OAK_LOG);
  line(-20, y, -3, -17, y, -3, OAK_LOG);
  line(-20, y, 3, -17, y, 3, OAK_LOG);
}
cube(-20, 24, -3, -15, 24, 3, PLANKS);
line(-20, 25, -3, -15, 25, -3, PLANKS);
line(-20, 25, 3, -15, 25, 3, PLANKS);
line(-20, 25, -3, -20, 25, 3, PLANKS);

// 4. Landing hill with red K-line, outrun flattening at ground level
for (let x = 1; x <= 22; x++) {
  const top = landTop(x);
  for (let z = -4; z <= 4; z++) {
    cube(x, -2, z, x, top - 1, z, STONE);
    block(x, top, z, SNOW);
  }
  if (x >= 3 && x <= 13) block(x, top, 0, RED);
}

// 5. Snowy ridge backdrop to the south
for (let x = -22; x <= 22; x++) {
  const peak = 11 - 0.35 * Math.abs(x + 2);
  for (let z = 16; z <= 21; z++) {
    const top = Math.round(peak - (z - 16) * 2.2);
    if (top < 1) continue;
    cube(x, 0, z, x, top, z, STONE);
    if (top >= 6) block(x, top, z, SNOW);
  }
}

// 6. Bleachers behind the landing hill, rising toward the back, with spectators
for (let x = 12; x <= 22; x++) {
  for (let z = 8; z <= 11; z++) {
    const top = z - 7;
    cube(x, 0, z, x, top, z, PLANKS);
    if (hash(x * 31 + z * 17) > 0.55) {
      block(x, top + 1, z, SPECTATOR_COLORS[Math.floor(hash(x * 7 + z * 91) * SPECTATOR_COLORS.length)]);
    }
  }
}

// 7. Pines between the stands and the ridge
function pine(x, z, h) {
  cube(x, 0, z, x, h, z, OAK_LOG);
  for (let y = 2; y <= h - 1; y++) cube(x - 1, y, z - 1, x + 1, y, z + 1, LEAVES);
  block(x, h, z, LEAVES);
}
pine(-20, 11, 7);
pine(-13, 13, 6);
pine(-7, 9, 7);
pine(-2, 12, 6);
pine(5, 13, 7);

// 8. Flags on poles at the front of the outrun (foreground)
for (const [px, col] of [[16, RED], [19, YELLOW]]) {
  line(px, 0, -6, px, 6, -6, OAK_LOG);
  cube(px + 1, 5, -6, px + 2, 6, -6, col);
}

// 9. The jumper, mid-flight, flying east (+X), seen in profile
const ax = 9, ay = 14;
// skis: two boards, tips curled up
line(ax - 8, ay - 4, -1, ax + 3, ay - 4, -1, IRON);
line(ax - 8, ay - 4, 1, ax + 3, ay - 4, 1, IRON);
block(ax + 4, ay - 3, -1, IRON); block(ax + 4, ay - 3, 1, IRON);
block(ax + 5, ay - 2, -1, IRON); block(ax + 5, ay - 2, 1, IRON);
// legs in a tuck
limb(ax - 3, ay, ax - 1, ay - 2, BLUE);
limb(ax - 1, ay - 2, ax - 4, ay - 3, BLUE);
for (let z = -1; z <= 1; z++) block(ax - 4, ay - 3, z, BLACK);
// torso leaning forward, neck, arms reaching ahead
limb(ax - 3, ay, ax + 2, ay + 2, BLUE);
limb(ax + 2, ay + 2, ax + 3, ay + 3, BLUE);
limb(ax + 2, ay + 2, ax + 6, ay + 1, BLUE);
for (let z = -1; z <= 1; z++) block(ax + 6, ay + 1, z, BLACK);
// race bib on the north (camera-facing) side
cube(ax, ay + 1, -2, ax + 1, ay + 2, -2, WHITE);
// helmet, goggles, nose
sphere(ax + 4, ay + 4, 0, 1, RED);
block(ax + 4, ay + 4, -1, LIGHT_BLUE);
block(ax + 5, ay + 4, 0, PINK);
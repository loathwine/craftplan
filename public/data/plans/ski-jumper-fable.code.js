// ski-jumper-fable — prompt:
// a ski jumper flying off a ski jump...

const rnd = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- clear trees out of the venue band ----------
cube(-22, 1, -10, 22, 8, 9, AIR);
cube(8, 1, -16, 22, 8, -11, AIR);

// ---------- snowfield under the tower ----------
cube(-22, 0, -9, -13, 0, 9, SNOW);
cube(-22, -1, -9, -21, -1, -6, SNOW);

// ---------- landing hill (heightfield skin) ----------
const P = x => x < -8 ? 11 - 2.5 * (-8 - x)
  : x <= -2 ? 11
  : x <= 20 ? 0.4 + 10.6 * (0.5 + 0.5 * Math.cos(Math.PI * (x + 2) / 22))
  : 0.4;
const Hf = (x, z) => {
  let h = P(x) - 2.5 * Math.max(0, Math.abs(z) - 5);
  if (x >= 13 && Math.abs(z) <= 7) h = Math.max(h, 0.4);
  return Math.max(-3, Math.round(h));
};
for (let x = -13; x <= 22; x++) {
  for (let z = -10; z <= 10; z++) {
    const top = Hf(x, z);
    if (top < -1) continue;
    const nb = Math.min(Hf(x - 1, z), Hf(x + 1, z), Hf(x, z - 1), Hf(x, z + 1));
    const bot = Math.max(-2, Math.min(top, nb + 1));
    const az = Math.abs(z);
    for (let y = bot; y <= top; y++) {
      let id = SNOW;
      if (y < top && az > 5 && rnd(x * 3 + y, z) < 0.35) id = STONE;
      if (y === top && az <= 5) {
        if (x === 12) id = RED;                 // K-point line
        else if (x === 15) id = BLUE;           // hill-size line
        else if (az === 5 && x >= 2 && x <= 18 && x % 2 === 0) id = GREEN; // fir-bough markers
      }
      block(x, y, z, id);
    }
  }
}

// ---------- start tower (steel lattice) ----------
for (const z of [-3, 3]) {
  cube(-22, -2, z, -22, 29, z, IRON);
  cube(-19, -2, z, -19, 26, z, IRON);
}
for (const y of [5, 11, 17, 23]) {
  cube(-22, y, -3, -19, y, -3, IRON);
  cube(-22, y, 3, -19, y, 3, IRON);
  cube(-22, y, -3, -22, y, 3, IRON);
  cube(-19, y, -3, -19, y, 3, IRON);
}
[-1, 5, 11, 17, 23].forEach((y0, i) => {
  for (const z of [-3, 3]) {
    if (i % 2 === 0) line(-22, y0, z, -19, y0 + 6, z, IRON);
    else line(-19, y0, z, -22, y0 + 6, z, IRON);
  }
  if (i % 2 === 0) line(-22, y0, -3, -22, y0 + 6, 3, IRON);
  else line(-22, y0, 3, -22, y0 + 6, -3, IRON);
  if (i < 4) {
    if (i % 2 === 0) line(-19, y0, 3, -19, y0 + 6, -3, IRON);
    else line(-19, y0, -3, -19, y0 + 6, 3, IRON);
  }
});
cube(-21, -1, -1, -20, 29, 0, GRAY);            // lift core
cube(-22, 30, -3, -20, 30, 3, PLANKS);          // start platform
cube(-22, 31, -3, -22, 32, 3, RED);             // start hut
for (const z of [-3, 3]) {
  cube(-21, 31, z, -20, 32, z, RED);
  block(-21, 32, z, GLASS);
}
cube(-22, 33, -4, -19, 33, 4, SNOW);            // snowy roof
block(-21, 32, 0, GLOWSTONE);                   // hut lamp
cube(-20, 31, -2, -20, 31, 2, IRON);            // start bar

// ---------- in-run ----------
const hIn = x => 14 + 16 * Math.pow(Math.max(0, 1 - (x + 19) / 17), 1.35);
const beamY = {};
for (let x = -19; x <= -2; x++) {
  const top = Math.round(hIn(x));
  const nxt = x < -2 ? Math.round(hIn(x + 1)) : top;
  const yb = nxt - 2;
  beamY[x] = yb;
  cube(x, yb, -3, x, yb, 3, IRON);
  cube(x, nxt - 1, -2, x, top, 2, SNOW);
  block(x, top, -1, ICE);
  block(x, top, 1, ICE);
  const panel = (Math.floor((x + 19) / 3) % 2 === 0) ? BLUE : WHITE;
  const lamp = ((x + 19) % 4 === 2);
  for (const z of [-3, 3]) {
    cube(x, nxt - 1, z, x, top, z, panel);
    block(x, top + 1, z, lamp ? GLOWSTONE : RED);
  }
}
cube(-2, 12, -3, -2, 12, 3, RED);               // takeoff lip marker

// truss under the in-run
for (let x = -18; x <= -9; x++) {
  const yb = beamY[x];
  for (const z of [-3, 3]) {
    cube(x, yb - 4, z, x, yb - 3, z, IRON);
    if (Math.abs(x) % 2 === 0) cube(x, yb - 2, z, x, yb - 1, z, IRON);
  }
}
// takeoff table side skins on the knoll
for (let x = -8; x <= -2; x++) {
  const yb = beamY[x];
  if (yb - 1 >= 12) for (const z of [-3, 3]) cube(x, 12, z, x, yb - 1, z, LIGHT_GRAY);
}
// mid pylon with struts
for (const z of [-3, 3]) {
  cube(-14, -2, z, -14, 16, z, IRON);
  line(-14, 5, z, -10, 12, z, IRON);
  line(-14, 9, z, -18, 21, z, IRON);
}
line(-14, 0, -3, -14, 7, 3, IRON);
line(-14, 0, 3, -14, 7, -3, IRON);
line(-14, 8, -3, -14, 15, 3, IRON);
line(-14, 8, 3, -14, 15, -3, IRON);
cube(-14, 16, -3, -14, 16, 3, IRON);

// ---------- the ski jumper (flying east, V-style) ----------
const skiY = x => Math.round(15 + 0.19 * x);
const skiZ = x => Math.min(4, Math.round(1 + 0.2 * (x + 1)));
for (const s of [-1, 1]) {
  for (let x = 0; x <= 17; x++) block(x, skiY(x), s * skiZ(x), x >= 16 ? ORANGE : YELLOW);
  block(18, 19, s * 4, ORANGE);
  // boots
  block(5, 17, s * 2, BLACK);
  block(6, 17, s * 2, BLACK);
  // legs
  block(5, 18, s * 2, BLUE);
  cube(6, 18, s * 2, 6, 19, s * 2, BLUE);
  cube(7, 19, s * 2, 7, 20, s * 2, BLUE);
  cube(7, 19, s, 7, 20, s, BLUE);
  cube(8, 19, s, 8, 20, s, BLUE);
}
const torso = [[9, 19], [10, 20], [11, 21], [12, 21], [13, 22]];
for (const [x, y0] of torso) {
  cube(x, y0, -1, x, y0 + 2, 1, (x === 11 || x === 12) ? WHITE : BLUE);
  for (const s of [-1, 1]) cube(x, y0, s * 2, x, y0 + 1, s * 2, x === 9 ? BLACK : RED); // arms + gloves
}
cube(14, 24, -1, 16, 26, 1, RED);               // helmet
cube(16, 24, -1, 16, 24, 1, PINK);              // chin
cube(16, 25, -1, 16, 25, 1, GOLD);              // mirrored goggles
// snow spray off the lip
block(-1, 13, -1, SNOW);
block(0, 12, 1, SNOW);
block(1, 13, -2, SNOW);
block(0, 14, 2, SNOW);

// ---------- coach with flag on the knoll ----------
block(-5, 12, -5, BLACK);
block(-5, 13, -5, ORANGE);
block(-5, 14, -5, PINK);
block(-4, 14, -5, ORANGE);
cube(-4, 15, -5, -3, 16, -5, LIME);

// ---------- judges' tower (south side) ----------
cube(18, -1, 9, 20, 5, 11, COBBLE);
cube(17, 6, 8, 21, 6, 12, PLANKS);
for (let y = 7; y <= 9; y++) {
  for (let x = 17; x <= 21; x++) for (let z = 8; z <= 12; z++) {
    if (x === 17 || x === 21 || z === 8 || z === 12) {
      let id = PLANKS;
      if (y === 8 && z === 8 && x >= 18 && x <= 20) id = GLASS;
      if (y === 8 && x === 17 && z >= 9 && z <= 11) id = GLASS;
      block(x, y, z, id);
    }
  }
}
[BLUE, GREEN, PURPLE].forEach((c, i) => { block(18 + i, 7, 9, c); block(18 + i, 8, 9, PINK); });
cube(16, 10, 7, 22, 10, 13, RED);
cube(17, 11, 8, 21, 11, 12, SNOW);
block(17, 9, 7, GLOWSTONE);
block(21, 9, 7, GLOWSTONE);

// ---------- crowd ----------
const cols = [RED, BLUE, YELLOW, GREEN, PURPLE, ORANGE, CYAN, MAGENTA, LIME, LIGHT_BLUE];
const skin = [PINK, SAND, PINK, BROWN];
// bleachers (south)
for (let r = 0; r < 3; r++) {
  const z = 8 + r;
  cube(10, -1, z, 15, r, z, PLANKS);
  for (let x = 10; x <= 15; x++) {
    if (rnd(x, z) < 0.15) continue;
    const k = Math.floor(rnd(x + 7, z + 3) * 100);
    block(x, r + 1, z, cols[k % cols.length]);
    block(x, r + 2, z, skin[k % skin.length]);
  }
}
cube(10, -1, 11, 15, 3, 11, PLANKS);
// standing crowd (north)
const person = (x, y, z, k) => {
  block(x, y, z, GRAY);
  block(x, y + 1, z, cols[k % cols.length]);
  block(x, y + 2, z, skin[k % skin.length]);
};
for (let x = 14; x <= 22; x++) {
  const r = rnd(x, 3);
  if (r >= 0.2) person(x, 1, -8, Math.floor(r * 97));
  if (x % 2 === 0 && rnd(x, 11) > 0.5) person(x, 1, -9, Math.floor(rnd(x, 5) * 89));
}
// outrun fences
const fc = [BLUE, BLUE, WHITE, WHITE, RED, RED, YELLOW, YELLOW];
for (let x = 13; x <= 22; x++) {
  block(x, 1, -7, fc[(x - 13) % 8]);
  block(x, 1, 7, fc[(x - 9) % 8]);
}
for (let z = -6; z <= 6; z++) block(22, 1, z, (z + 6) % 2 ? WHITE : RED);

// ---------- flags ----------
const flag = (px, base, topY, z, design) => {
  cube(px, base, z, px, topY, z, IRON);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) block(px - 1 - i, topY - 2 + j, z, design(i, j));
};
const nordic = (bg, cr) => (i, j) => (i === 1 || j === 1) ? cr : bg;
flag(21, 0, 10, -10, nordic(BLUE, YELLOW));     // Sweden
flag(13, 0, 10, -10, nordic(RED, BLUE));        // Norway
flag(16, -1, 8, 11, nordic(WHITE, BLUE));       // Finland

// ---------- hill lamp posts ----------
for (const x of [2, 8]) for (const s of [-1, 1]) {
  const b = Hf(x, 7 * s) + 1;
  cube(x, b, 7 * s, x, b + 2, 7 * s, IRON);
  block(x, b + 3, 7 * s, GLOWSTONE);
}

// ---------- flame cauldron ----------
cube(20, -1, -15, 20, 3, -15, STONE);
cube(19, 4, -16, 21, 4, -14, GOLD);
cube(19, 5, -16, 21, 5, -14, GOLD);
block(20, 5, -15, LAVA);
block(20, 6, -15, FIRE);
block(20, 7, -15, FIRE);

// ---------- snowy pines ----------
const pine = (x, y, z) => {
  cube(x, y, z, x, y + 1, z, OAK_LOG);
  disk(x, y + 2, z, 3, LEAVES);
  disk(x, y + 3, z, 2, SNOW);
  disk(x, y + 4, z, 2, LEAVES);
  disk(x, y + 5, z, 1, SNOW);
  disk(x, y + 6, z, 1, LEAVES);
  block(x, y + 7, z, LEAVES);
  block(x, y + 8, z, SNOW);
};
pine(-16, 0, -8);
pine(-10, 1, -9);
pine(-14, 0, 8);
pine(-3, 0, 12);
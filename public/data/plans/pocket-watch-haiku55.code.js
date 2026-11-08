// pocket-watch-haiku55 — prompt:
// a giant open pocket watch with ticking gears...

// Giant open pocket watch with ticking gears. Dial faces north (-Z).
// All centers are integers so the block loops stay on the integer grid.
const CX = 0, CY = 17;

const DIGITS = {
  0: ['111','101','101','101','111'],
  1: ['010','110','010','010','111'],
  2: ['111','001','111','100','111'],
  3: ['111','001','111','001','111'],
  4: ['101','101','111','001','001'],
  5: ['111','100','111','001','111'],
  6: ['111','100','111','101','111'],
  7: ['111','001','001','001','001'],
  8: ['111','101','111','101','111'],
  9: ['111','101','111','001','111'],
};

function diskP(r) { return (dx, dy) => dx * dx + dy * dy <= r * r; }

function ringP(ri, ro) {
  return (dx, dy) => {
    const d2 = dx * dx + dy * dy;
    return d2 > ri * ri && d2 <= ro * ro;
  };
}

function gearP(ro, ri, teeth) {
  return (dx, dy) => {
    const d = Math.hypot(dx, dy);
    if (d <= ri) return true;
    if (d > ro) return false;
    const t = (((Math.atan2(dy, dx) / (2 * Math.PI)) * teeth) % 1 + 1) % 1;
    return t < 0.5;
  };
}

function paintXY(cx, cy, z1, z2, rad, id, pred) {
  const R = Math.ceil(rad) + 1;
  for (let x = cx - R; x <= cx + R; x++)
    for (let y = cy - R; y <= cy + R; y++)
      if (pred(x - cx, y - cy))
        for (let z = z1; z <= z2; z++) block(x, y, z, id);
}

function gearAt(ax, ay, z1, z2, ro, ri, teeth, id) {
  paintXY(ax, ay, z1, z2, ro + 1, id, gearP(ro, ri, teeth));
}

function glyph(str, ax, ay, z, id) {
  const w = str.length * 4 - 1;
  const x0 = Math.round(ax - w / 2);
  const y0 = Math.round(ay);
  for (let i = 0; i < str.length; i++) {
    const rows = DIGITS[str[i]];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 3; c++)
        if (rows[r][c] === '1') block(x0 + i * 4 + c, y0 + 2 - r, z, id);
  }
}

function hand(len, deg, z, id, w) {
  const a = deg * Math.PI / 180;
  const x2 = Math.round(Math.sin(a) * len);
  const y2 = Math.round(Math.cos(a) * len);
  for (let k = 0; k < w; k++)
    line(CX + k, CY, z, CX + x2 + k, CY + y2, z, id);
}

// ---------- Stone stand: foundation, plinth, brass column, chimney ----------
cube(CX - 5, 0, -5, CX + 5, 1, 5, STONE);
hollowCube(CX - 5, 1, -5, CX + 5, 1, 5, BRICK);
cube(CX - 3, 2, -3, CX + 3, 3, 3, COBBLE);
hollowCube(CX - 3, 3, -3, CX + 3, 3, 3, GOLD);
cube(CX - 1, 4, -1, CX + 1, 5, 1, GOLD);
for (const sx of [-3, 3])
  for (const sz of [-3, 3])
    cube(CX + sx, 4, sz, CX + sx, 5, sz, IRON);
cube(4, 2, 4, 5, 6, 5, BRICK);
block(4, 7, 4, STEAM);
block(5, 7, 5, STEAM);

// ---------- Case: copper back, gold bezel ----------
paintXY(CX, CY, 1, 2, 12, COPPER, diskP(11));
paintXY(CX, CY, -2, 1, 12, GOLD, ringP(9.5, 11));

// ---------- Dial ----------
paintXY(CX, CY, 0, 0, 10, WHITE, diskP(9.5));

// Minute track
for (let m = 0; m < 60; m++) {
  const a = m * 6 * Math.PI / 180;
  block(Math.round(CX + Math.sin(a) * 9), Math.round(CY + Math.cos(a) * 9), 0, BLACK);
}

// Arabic numerals
for (let h = 1; h <= 12; h++) {
  const a = h * 30 * Math.PI / 180;
  glyph(String(h), CX + Math.sin(a) * 7.3, CY + Math.cos(a) * 7.3, 0, BLACK);
}

// Bezel rivets
for (let k = 0; k < 24; k++) {
  const a = k * 15 * Math.PI / 180;
  block(Math.round(CX + Math.sin(a) * 10.2), Math.round(CY + Math.cos(a) * 10.2), -2, IRON);
}

// ---------- Movement: gears standing proud of the dial ----------
gearAt(CX - 3, CY + 2, -2, -1, 3.4, 2.6, 10, IRON);
gearAt(CX + 3, CY - 1, -2, -1, 3.0, 2.3, 9, GOLD);
gearAt(CX - 2, CY - 3, -2, -1, 2.6, 1.9, 8, COPPER);
gearAt(CX + 4, CY + 3, -2, -1, 2.4, 1.7, 7, IRON);
gearAt(CX - 6, CY - 1, -2, -1, 1.6, 1.1, 6, GOLD);

// Hands and centre arbor
block(CX, CY, -3, GOLD);
block(CX, CY, -2, GOLD);
hand(5, 305, -3, IRON, 2);   // hour hand, pointing near 10
hand(8, 60, -3, GOLD, 1);    // minute hand, pointing near 2

// ---------- Bow (ring loop) and crown ----------
paintXY(CX, CY + 13, -1, 1, 3, GOLD, ringP(1.8, 2.8));
cube(CX + 12, CY - 1, -1, CX + 13, CY + 1, 0, GOLD);

// ---------- Floating background and foreground gears ----------
gearAt(-17, 26, -5, -4, 3.6, 2.8, 11, IRON);   // foreground, far left
gearAt(18, 20, -6, -5, 2.5, 1.8, 7, GOLD);     // foreground, right
gearAt(16, 9, -4, -3, 3.0, 2.3, 9, COPPER);    // mid-ground, lower right
gearAt(14, 27, -3, -2, 2.2, 1.6, 7, GOLD);     // mid-ground, upper right
gearAt(-15, 6, 3, 4, 2.4, 1.8, 8, GOLD);       // background, lower left
gearAt(-13, 31, 2, 3, 1.8, 1.2, 6, IRON);      // background, upper left
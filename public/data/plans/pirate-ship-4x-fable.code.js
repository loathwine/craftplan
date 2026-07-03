// pirate-ship-4x-fable — prompt:
// a pirate ship...

const ZB = -17, ZS = 15;

function hwF(z) {
  let w = 5;
  const fb = z - ZB, fs = ZS - z;
  if (fb < 8) w = Math.min(5, Math.round(fb * 0.65) + 1);
  if (fs === 0) w = Math.min(w, 4);
  return Math.max(1, w);
}
function botF(z) { return Math.round(2 * Math.pow(Math.abs(z + 1) / 16, 1.7)); }
function deckF(z) { if (z <= -10) return 7; if (z >= 12) return 9; if (z >= 7) return 8; return 6; }

// ---- lagoon: clear site, water surface at y=0, sand shoreline ----
for (let z = -22; z <= 22; z++) {
  const ti = 1 - (z * z) / (22.4 * 22.4);
  const to = 1 - (z * z) / (23.2 * 23.2);
  const xi = ti > 0 ? Math.floor(13 * Math.sqrt(ti)) : -1;
  const xo = to > 0 ? Math.min(22, Math.floor(15 * Math.sqrt(to))) : -1;
  if (xo < 0) continue;
  cube(-xo, 0, z, xo, 13, z, AIR);
  if (xi >= 0) {
    cube(-xi, 0, z, xi, 0, z, GLASS);
    if (xo > xi) {
      cube(xi + 1, 0, z, xo, 0, z, SAND);
      cube(-xo, 0, z, -xi - 1, 0, z, SAND);
    }
  } else {
    cube(-xo, 0, z, xo, 0, z, SAND);
  }
}

// ---- hull ----
for (let z = ZB; z <= ZS; z++) {
  const w = hwF(z), b = botF(z), d = deckF(z);
  if (z < ZB + 8) {
    // raked solid bow section
    cube(-w, b, z, w, d, z, PLANKS);
    if (b <= 1) cube(-w, b, z, w, Math.min(1, d), z, OAK_LOG);
    if (b <= 3 && d >= 3) cube(-w, 3, z, w, 3, z, OAK_LOG);
    block(w, d + 1, z, OAK_LOG);
    block(-w, d + 1, z, OAK_LOG);
  } else {
    cube(-w + 1, b, z, w - 1, b, z, OAK_LOG);
    for (let y = b; y <= d + 1; y++) {
      const m = (y <= 1 || y === 3 || y === d + 1) ? OAK_LOG : PLANKS;
      block(w, y, z, m);
      block(-w, y, z, m);
    }
    cube(-w + 1, d, z, w - 1, d, z, PLANKS);
  }
}

// cabin floor under quarterdeck
cube(-4, 6, 7, 4, 6, 14, PLANKS);

// quarterdeck front wall with door + windows
cube(-4, 7, 6, 4, 8, 6, PLANKS);
block(0, 7, 6, AIR);
block(0, 8, 6, AIR);
block(-2, 8, 6, GLASS);
block(2, 8, 6, GLASS);

// transom (stern face) with galleon windows + lanterns + balcony
cube(-4, 2, 15, 4, 10, 15, PLANKS);
cube(-4, 5, 15, 4, 5, 15, OAK_LOG);
[-3, -1, 1, 3].forEach(x => { block(x, 6, 15, GLASS); block(x, 7, 15, GLASS); });
block(4, 11, 15, BRICK);
block(-4, 11, 15, BRICK);
cube(-3, 8, 16, 3, 8, 16, PLANKS);
block(-3, 9, 16, OAK_LOG);
block(3, 9, 16, OAK_LOG);

// gunports with cannon barrels
[-8, -5, -2, 1, 4].forEach(z => {
  block(5, 4, z, STONE); block(6, 4, z, STONE);
  block(-5, 4, z, STONE); block(-6, 4, z, STONE);
});

// stem post, bowsprit, figurehead
cube(0, 2, -17, 0, 8, -17, OAK_LOG);
line(0, 8, -17, 0, 12, -22, OAK_LOG);
block(0, 6, -18, SNOW);
block(0, 7, -18, SNOW);
block(0, 7, -19, SNOW);

// ---- masts, yards, sails ----
function yardSail(zM, yTop, h, hwS) {
  cube(-hwS, yTop, zM, hwS, yTop, zM, OAK_LOG);
  for (let x = -hwS; x <= hwS; x++) {
    const bulge = Math.round((1 - Math.abs(x) / hwS) * 2);
    const zc = zM - 1 - bulge;
    cube(x, yTop - h, zc, x, yTop - 1, zc, SNOW);
  }
}

cube(0, 7, -11, 0, 24, -11, OAK_LOG);   // foremast
yardSail(-11, 14, 5, 5);
yardSail(-11, 19, 4, 4);
yardSail(-11, 23, 3, 3);

cube(0, 6, 0, 0, 31, 0, OAK_LOG);       // mainmast
yardSail(0, 14, 6, 6);
yardSail(0, 20, 5, 5);
yardSail(0, 25, 4, 4);

cube(0, 8, 9, 0, 21, 9, OAK_LOG);       // mizzen
line(0, 20, 8, 0, 15, 15, OAK_LOG);     // gaff
line(0, 11, 8, 0, 11, 14, OAK_LOG);     // boom
for (let z = 9; z <= 14; z++) {
  const yt = 20 - Math.round((z - 8) * 0.8);
  cube(0, 12, z, 0, yt, z, SNOW);
}

// crow's nest on mainmast
disk(0, 26, 0, 1, PLANKS);
hollowCylinder(0, 27, 0, 1, 1, OAK_LOG);

// forestay + jib sail
line(0, 12, -22, 0, 24, -11, OAK_LOG);
for (let z = -18; z <= -14; z++) {
  const yt = Math.round(10 + (z + 18) * 1.6);
  cube(0, 9, z, 0, yt, z, SNOW);
}

// shroud rigging
line(5, 7, -8, 0, 16, -11, OAK_LOG);
line(-5, 7, -8, 0, 16, -11, OAK_LOG);
line(5, 7, 4, 0, 17, 0, OAK_LOG);
line(-5, 7, 4, 0, 17, 0, OAK_LOG);
line(5, 10, 12, 0, 16, 9, OAK_LOG);
line(-5, 10, 12, 0, 16, 9, OAK_LOG);

// ---- jolly roger ----
cube(0, 27, 1, 0, 31, 8, COBBLE);
cube(0, 28, 4, 0, 30, 6, SNOW);
block(0, 29, 4, COBBLE);
block(0, 29, 6, COBBLE);
block(0, 27, 3, SNOW);
block(0, 27, 7, SNOW);

// ---- deck details ----
cube(-1, 6, -6, 1, 6, -4, OAK_LOG);     // hatch coaming
block(0, 6, -5, AIR);
block(3, 7, -3, OAK_LOG);               // barrels
block(4, 7, -3, OAK_LOG);
block(3, 8, -3, OAK_LOG);
block(-4, 7, 5, OAK_LOG);
block(-3, 7, -7, PLANKS);               // crate
block(0, 9, 10, OAK_LOG);               // helm
block(0, 10, 10, COBBLE);
block(0, 8, -14, OAK_LOG);              // capstan

// anchor on port bow
line(-5, 2, -12, -5, 4, -12, COBBLE);
block(-5, 2, -13, COBBLE);
block(-5, 2, -11, COBBLE);

// ---- dinghy alongside ----
cube(9, 0, 4, 10, 0, 8, PLANKS);
hollowCube(8, 1, 3, 11, 1, 9, PLANKS);

// ---- foam at waterline ----
for (let z = ZB; z <= ZS; z += 2) {
  const w = hwF(z);
  block(w + 1, 0, z, SNOW);
  block(-w - 1, 0, z, SNOW);
}
cube(-1, 0, -19, 1, 0, -18, SNOW);
block(2, 0, -18, SNOW);
block(-2, 0, -18, SNOW);
cube(-1, 0, 16, 1, 0, 17, SNOW);
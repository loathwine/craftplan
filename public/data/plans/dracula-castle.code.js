// dracula-castle — prompt:
// Dracula's haunted castle perched on a craggy peak. A cluster of tall, thin, crooked Gothic towers of STONE and COBBLE with steep pointed BRICK (dark) spire roofs, crowded together and leaning at sligh...

cube(-10, 3, -10, 10, 13, 10, AIR);

function rnd(a, b, c) { var h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return h - Math.floor(h); }

var cragTop = 6;
for (var y = -5; y <= cragTop; y++) {
  var t = (y + 5) / (cragTop + 5);
  var baseR = (y <= -3) ? 12 : 10;
  baseR -= t * 0.8;
  for (var x = -13; x <= 13; x++) {
    for (var z = -13; z <= 13; z++) {
      var d = Math.sqrt(x * x + z * z);
      var jag = (rnd(x * 1.3, y * 0.7, z * 1.3) - 0.5) * 3.2;
      var ripple = 1.4 * Math.sin(x * 0.8 + y * 0.2) * Math.cos(z * 0.8);
      if (d <= baseR + jag + ripple) {
        block(x, y, z, (rnd(x, y, z) < 0.34) ? COBBLE : STONE);
      }
    }
  }
}
disk(0, 5, 0, 9, STONE);
disk(0, 6, 0, 9, COBBLE);

// dark cave mouth gouged into the front of the crag (eerie)
cube(-3, -5, -13, 3, 1, -8, AIR);
sphere(0, -1, -9, 3, AIR);
// jagged front cliff bites
cube(-7, -2, -12, -5, 1, -10, AIR);
cube(5, -2, -11, 7, 1, -9, AIR);
// protruding rock ledges for dead trees to cling to
cube(-9, 0, -10, -7, 1, -8, COBBLE);
cube(7, 1, -9, 9, 2, -7, COBBLE);
cube(-10, -1, 4, -8, 0, 6, COBBLE);

function towerBody(bx, bz, baseY, bodyTop, hw, lx, lz) {
  var tcx = bx, tcz = bz;
  for (var i = 0; baseY + i <= bodyTop; i++) {
    var y = baseY + i;
    var cx = Math.round(bx + lx * i);
    var cz = Math.round(bz + lz * i);
    tcx = cx; tcz = cz;
    var bid = (rnd(bx * 7, y, bz * 7) < 0.42) ? COBBLE : STONE;
    cube(cx - hw, y, cz - hw, cx + hw, y, cz - hw, bid);
    cube(cx - hw, y, cz + hw, cx + hw, y, cz + hw, bid);
    cube(cx - hw, y, cz - hw, cx - hw, y, cz + hw, bid);
    cube(cx + hw, y, cz - hw, cx + hw, y, cz + hw, bid);
    // sparse lit lancet windows, mostly on the viewer-facing (-Z) wall
    if ((i === 5 || i === 10) && rnd(bx * 2 + i, bz * 2, 3) > 0.4) {
      block(cx, y, cz - hw, GLASS);
      if (hw >= 2) block(cx, y + 1, cz - hw, GLASS);
    }
    if (i === 8 && rnd(bx, bz, y) > 0.62) block(cx + hw, y, cz, GLASS);
  }
  return [tcx, tcz];
}

function spireRoof(cx, cz, baseY, hw, steps) {
  var y = baseY, h = hw;
  while (h >= 0) {
    for (var s = 0; s < steps; s++) {
      if (y > 33) return;
      cube(cx - h, y, cz - h, cx + h, y, cz + h, BRICK);
      y++;
    }
    h--;
  }
  if (y <= 33) block(cx, y, cz, BRICK);
}

function parapet(cx, cz, y, hw) {
  for (var x = cx - hw; x <= cx + hw; x++) {
    for (var z = cz - hw; z <= cz + hw; z++) {
      if (x === cx - hw || x === cx + hw || z === cz - hw || z === cz + hw) {
        block(x, y, z, (rnd(x, y, z) < 0.4) ? COBBLE : STONE);
        var r = rnd(x * 3, y, z * 3);
        if (((x + z) % 2 === 0) && r > 0.25) {
          block(x, y + 1, z, STONE);
          if (r > 0.74) block(x, y + 2, z, STONE);
        }
      }
    }
  }
}

// crowded cluster of crooked towers; tallest keep dead center, facing -Z
var towers = [
  [0, 1, 5, 22, 2, 0.01, 0.0, 'keep'],
  [-1, 9, 5, 19, 2, -0.02, 0.04, 'keep'],
  [-7, 2, 5, 17, 1, -0.09, 0.03, 'spire'],
  [7, 2, 5, 18, 1, 0.08, 0.03, 'spire'],
  [-4, 7, 5, 16, 1, -0.05, 0.05, 'spire'],
  [4, 7, 5, 18, 1, 0.05, 0.05, 'spire'],
  [-7, -6, 5, 12, 1, -0.10, -0.05, 'spire'],
  [7, -6, 5, 13, 1, 0.10, -0.05, 'spire'],
  [-3, -8, 5, 14, 1, -0.05, -0.09, 'spire'],
  [3, -8, 5, 15, 1, 0.05, -0.09, 'spire'],
  [-8, -1, 5, 15, 1, -0.10, 0.0, 'ruin'],
  [8, -2, 5, 14, 1, 0.10, 0.02, 'spire'],
  [0, -3, 5, 11, 1, 0.0, -0.06, 'spire']
];
for (var ti = 0; ti < towers.length; ti++) {
  var T = towers[ti];
  var top = towerBody(T[0], T[1], T[2], T[3], T[4], T[5], T[6]);
  var cx = top[0], cz = top[1], bt = T[3], hw = T[4];
  if (T[7] === 'keep') {
    parapet(cx, cz, bt + 1, hw + 1);
    spireRoof(cx, cz, bt + 2, hw, 3);
  } else if (T[7] === 'ruin') {
    for (var rr = 0; rr < 11; rr++) {
      var ang = rnd(rr, T[0], T[1]) * 6.283;
      var px = Math.round(cx + Math.cos(ang) * hw);
      var pz = Math.round(cz + Math.sin(ang) * hw);
      var ph = Math.floor(rnd(rr, 7, T[1]) * 3);
      for (var q = 0; q <= ph; q++) block(px, bt + 1 + q, pz, (q % 2) ? COBBLE : STONE);
    }
  } else {
    spireRoof(cx, cz, bt + 1, hw, 2);
  }
}

// ragged curtain wall hugging the crag rim, with crooked merlons
var wallPts = [[-7, -5], [-3, -8], [3, -8], [7, -5], [8, 0], [7, 6], [3, 9], [-3, 9], [-7, 6], [-8, 0]];
function wallSeg(x1, z1, x2, z2, topY) {
  var n = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1));
  for (var s = 0; s <= n; s++) {
    var x = Math.round(x1 + (x2 - x1) * s / n);
    var z = Math.round(z1 + (z2 - z1) * s / n);
    for (var y = 5; y <= topY; y++) block(x, y, z, (rnd(x, y, z) < 0.4) ? COBBLE : STONE);
    var r = rnd(x * 5, topY, z * 5);
    if (r > 0.32) { block(x, topY + 1, z, STONE); if (r > 0.76) block(x, topY + 2, z, STONE); }
  }
}
for (var wi = 0; wi < wallPts.length; wi++) {
  var A = wallPts[wi], B = wallPts[(wi + 1) % wallPts.length];
  wallSeg(A[0], A[1], B[0], B[1], 9);
}

// gatehouse on the viewer-facing front, with a dark arch
cube(-3, 5, -9, 3, 12, -8, STONE);
cube(-1, 5, -9, 1, 8, -7, AIR);
block(-1, 9, -8, GLASS); block(1, 9, -8, GLASS); block(0, 11, -8, GLASS);
block(-3, 13, -8, STONE); block(-1, 13, -8, STONE); block(1, 13, -8, STONE); block(3, 13, -8, STONE);

// flying-buttress struts off the keep
line(2, 16, 1, 5, 12, 6, STONE);
line(-2, 16, 1, -4, 12, -4, STONE);
line(2, 14, 3, 4, 11, 7, STONE);
line(-2, 18, 2, -4, 14, 6, STONE);

// little pinnacles on the wall corners
function pinnacle(x, z, baseY, h) {
  for (var i = 0; i < h; i++) block(x, baseY + i, z, (i < h - 1) ? COBBLE : STONE);
  block(x, baseY + h, z, BRICK);
}
pinnacle(-7, -5, 10, 3); pinnacle(7, -5, 10, 3); pinnacle(8, 0, 10, 3);
pinnacle(-8, 0, 10, 3); pinnacle(3, 9, 10, 3); pinnacle(-3, 9, 10, 3);

// rubble / boulders piled at the base
function boulder(x, y, z, r) { sphere(x, y, z, r, (rnd(x, y, z) < 0.5) ? COBBLE : STONE); }
boulder(-10, -1, -7, 2); boulder(9, -1, -6, 2); boulder(-11, -2, 4, 2);
boulder(11, -1, 3, 2); boulder(-6, -1, 11, 2); boulder(6, -2, 11, 2);
boulder(0, -1, -12, 2); boulder(-12, -2, -1, 1); boulder(12, -2, 0, 2);

// dead OAK_LOG trees clinging to the rocks
function deadTree(x, y, z, h, lean) {
  var tx = x, tz = z, ty = y;
  for (var i = 0; i < h; i++) {
    tx = Math.round(x + lean * i); tz = Math.round(z + lean * 0.5 * i); ty = y + i;
    block(tx, ty, tz, OAK_LOG);
  }
  var nb = 2 + Math.floor(rnd(x * 3, y, z * 3) * 3);
  for (var b = 0; b < nb; b++) {
    var ang = rnd(b * 2, x, z) * 6.283;
    var bl = 2 + Math.floor(rnd(b, z, x) * 2);
    var by = ty - Math.floor(rnd(b, 5, x) * Math.min(3, h - 1));
    line(tx, by, tz, tx + Math.round(Math.cos(ang) * bl), by + 1 + Math.floor(rnd(b, 9, z) * 2), tz + Math.round(Math.sin(ang) * bl), OAK_LOG);
  }
}
deadTree(-9, 1, -9, 5, -0.22);
deadTree(8, 2, -8, 4, 0.25);
deadTree(-9, 0, 5, 6, -0.15);
deadTree(11, -1, 3, 5, 0.2);
deadTree(-6, 0, 11, 5, -0.12);
deadTree(5, 0, 12, 4, 0.14);
deadTree(12, -1, 8, 5, 0.18);
deadTree(-12, -1, -4, 5, -0.2);
deadTree(2, -1, -12, 4, 0.1);

// guaranteed lit lancet windows glowing on the main keep front
block(0, 11, -1, GLASS); block(0, 12, -1, GLASS);
block(0, 17, -1, GLASS); block(0, 18, -1, GLASS);
block(-2, 14, -1, GLASS); block(2, 15, -1, GLASS);
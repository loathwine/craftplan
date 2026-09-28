// jack-o-lantern-n-sonnet — prompt:
// a glowing jack-o'-lantern...

var cx = 0, cy = 8, cz = 3;
var rx = 9, ry = 7, rz = 9;
var shellT = 2.2;
var irx = rx - shellT, iry = ry - shellT, irz = rz - shellT;

function eyeMask(lx, ly, apexX, apexY, baseY, halfW) {
  if (ly < baseY || ly > apexY) return false;
  var t = (ly - baseY) / (apexY - baseY);
  var maxHalf = halfW * (1 - t);
  return Math.abs(lx - apexX) <= maxHalf;
}

function noseMask(lx, ly) {
  var apexY = 2.2, baseY = -0.8, halfW = 1.3;
  if (ly < baseY || ly > apexY) return false;
  var t = (ly - baseY) / (apexY - baseY);
  var maxHalf = halfW * (1 - t);
  return Math.abs(lx) <= maxHalf;
}

function mouthMask(lx, ly) {
  var topY = -2, baseY = -6.2;
  if (ly < baseY || ly > topY) return false;
  if (lx < -6 || lx > 7) return false;
  var col = Math.round(lx + 6);
  var isEven = col % 2 === 0;
  if (isEven) {
    if (ly >= topY - 1.6) return false;
    return true;
  } else {
    if (ly <= baseY + 1.6) return false;
    return true;
  }
}

function faceMask(lx, ly) {
  return eyeMask(lx, ly, -4, 4, 1, 2.3) ||
         eyeMask(lx, ly, 4, 3.5, 1.2, 2.0) ||
         noseMask(lx, ly) ||
         mouthMask(lx, ly);
}

// ---- Main pumpkin shell (hollow ellipsoid) ----
for (var x = -9; x <= 9; x++) {
  for (var y = cy - 7; y <= cy + 7; y++) {
    var ly = y - cy;
    for (var z = cz - 9; z <= cz + 9; z++) {
      var lz = z - cz;
      var dOuter = (x / rx) * (x / rx) + (ly / ry) * (ly / ry) + (lz / rz) * (lz / rz);
      if (dOuter > 1) continue;
      var dInner = (x / irx) * (x / irx) + (ly / iry) * (ly / iry) + (lz / irz) * (lz / irz);
      if (dInner < 1) continue;
      var angle = Math.atan2(lz, x);
      var a = ((angle + Math.PI) / (2 * Math.PI)) * 12;
      var frac = a - Math.floor(a);
      var col2 = frac < 0.1 ? BROWN : ORANGE;
      block(x, y, z, col2);
    }
  }
}

// ---- Carve the glowing face (eyes, nose, jagged mouth) ----
for (var fx = -9; fx <= 9; fx++) {
  for (var fy = cy - 7; fy <= cy + 7; fy++) {
    var fly = fy - cy;
    if (!faceMask(fx, fly)) continue;
    var e = (fx / rx) * (fx / rx) + (fly / ry) * (fly / ry);
    if (e >= 1) continue;
    var zSurf = Math.round(cz - rz * Math.sqrt(1 - e));
    for (var dz = 0; dz <= 3; dz++) {
      block(fx, fy, zSurf + dz, AIR);
    }
    block(fx, fy, zSurf + 3, GLOWSTONE);
  }
}

// ---- Flattened base so it sits flush on the ground ----
cylinder(0, 0, cz, 5, 1, ORANGE);
disk(0, 0, cz, 5, BROWN);

// ---- Carved lid opening at the top ----
for (var tx = -2; tx <= 2; tx++) {
  for (var tz = cz - 2; tz <= cz + 2; tz++) {
    var tlz = tz - cz;
    if (tx * tx + tlz * tlz > 4) continue;
    var te = (tx / rx) * (tx / rx) + (tlz / rz) * (tlz / rz);
    if (te >= 1) continue;
    var ySurf = Math.round(cy + ry * Math.sqrt(1 - te));
    for (var dy = 0; dy <= 3; dy++) {
      block(tx, ySurf - dy, tz, AIR);
    }
  }
}

// ---- Interior glow core + wisps of smoke escaping the lid ----
sphere(0, cy, cz, 2, GLOWSTONE);
block(0, cy + 3, cz, FIRE);
block(0, cy + 4, cz, FIRE);

// ---- Curved stem ----
cylinder(0, 13, cz, 2, 3, OAK_LOG);
cylinder(0, 16, cz, 2, 2, BROWN);
cylinder(1, 18, cz + 1, 1, 2, OAK_LOG);
block(1, 20, cz + 1, OAK_LOG);
block(2, 20, cz + 2, OAK_LOG);

// ---- Trailing vines with leaves ----
line(1, 18, cz + 1, -6, 3, cz + 8, LEAVES);
line(-6, 3, cz + 8, -9, 1, cz + 12, LEAVES);
line(2, 19, cz + 2, 7, 4, cz - 9, LEAVES);
line(7, 4, cz - 9, 10, 1, cz - 14, LEAVES);
sphere(-6, 3, cz + 8, 1, LEAVES);
sphere(7, 4, cz - 9, 1, LEAVES);

// ---- Mini companion pumpkins ----
function miniPumpkin(px, pz, r) {
  var py = r;
  sphere(px, py, pz, r, ORANGE);
  block(px, py + r, pz, BROWN);
  block(px, py + r + 1, pz, OAK_LOG);
}
miniPumpkin(-13, -8, 2);
miniPumpkin(11, -7, 2);
miniPumpkin(-14, 6, 2);
miniPumpkin(13, 8, 2);
miniPumpkin(-8, -13, 1);

// ---- Hay bales ----
cube(-11, 0, -10, -9, 1, -9, YELLOW);
cube(9, 0, -9, 11, 1, -8, YELLOW);
cube(-16, 0, 4, -15, 1, 6, YELLOW);

// ---- Fallen leaves scattered around the patch ----
var leafSpots = [
  [-5, -14], [-3, -15], [2, -15], [5, -14], [-15, -2], [-17, 2], [14, -3], [16, 3],
  [-10, 10], [10, 11], [-4, 12], [4, 13], [-18, 10], [18, 8]
];
for (var i = 0; i < leafSpots.length; i++) {
  block(leafSpots[i][0], 0, leafSpots[i][1], LEAVES);
}

// ---- Tall cornstalks flanking the scene for a sky silhouette ----
function cornstalk(px, pz, h) {
  line(px, 0, pz, px, h, pz, BROWN);
  for (var j = 3; j < h; j += 3) {
    line(px, j, pz, px + 2, j + 1, pz, LEAVES);
    line(px, j, pz, px - 2, j + 1, pz, LEAVES);
    block(px + 1, j, pz + 1, YELLOW);
  }
  block(px, h, pz, LEAVES);
}
cornstalk(-15, 7, 13);
cornstalk(-13, 8, 11);
cornstalk(15, 7, 14);
cornstalk(13, 9, 12);

// ---- Low back fence framing the patch ----
for (var fxp = -16; fxp <= 16; fxp += 4) {
  cube(fxp, 0, 13, fxp, 3, 13, PLANKS);
}
line(-16, 3, 13, 16, 3, 13, PLANKS);
line(-16, 2, 13, 16, 2, 13, PLANKS);

// ---- Crow perched on the stem ----
block(2, 21, cz + 1, BLACK);
block(2, 22, cz + 1, BLACK);
block(3, 22, cz + 1, BLACK);
block(1, 22, cz + 1, BLACK);
block(3, 22, cz, ORANGE);
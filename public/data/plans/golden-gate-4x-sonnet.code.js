// golden-gate-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== Golden Gate Bridge =====
// Bridge spans EAST-WEST (X axis) so its iconic side profile faces the
// north-looking camera. Roadway centered at Z=0, towers at X=-12 and X=12.

var TX = [-12, 12];      // tower X positions
var TZ = [-3, 3];        // tower leg Z positions (match roadway edges)
var WATER_Y = -1;
var DECK_Y = 7;
var DECK_STRUCT_Y = 6;
var GIRDER_Y = 5;
var RAIL_Y = 8;
var TOWER_TOP = 27;

// ---- 1. Bay water under the bridge ----
cube(-22, WATER_Y, -7, 22, WATER_Y, 7, GLASS);

// ---- 2. Pier foundations under each tower ----
for (var pi = 0; pi < TX.length; pi++) {
  var px = TX[pi];
  cube(px - 2, -2, -4, px + 2, -1, 4, STONE);
}

// ---- 3. Tower legs (two columns per tower) ----
for (var ti = 0; ti < TX.length; ti++) {
  var tx = TX[ti];
  for (var li = 0; li < TZ.length; li++) {
    var tz = TZ[li];
    cube(tx - 1, -2, tz - 1, tx + 1, TOWER_TOP, tz + 1, BRICK);
  }
  // horizontal portal braces connecting the two legs at several levels
  var braceLevels = [3, 9, 15, 21, 25];
  for (var bl = 0; bl < braceLevels.length; bl++) {
    var by = braceLevels[bl];
    cube(tx - 1, by, -4, tx + 1, by + 1, 4, BRICK);
  }
  // tapered cap
  cube(tx - 2, TOWER_TOP, -4, tx + 2, TOWER_TOP + 1, 4, BRICK);
  cube(tx - 1, TOWER_TOP + 1, -3, tx + 1, TOWER_TOP + 3, 3, BRICK);
  block(tx, TOWER_TOP + 4, 0, BRICK);
}

// ---- 4. Roadway deck ----
cube(-20, GIRDER_Y, -4, 20, GIRDER_Y, 4, STONE);      // underside girder
cube(-20, DECK_STRUCT_Y, -3, 20, DECK_STRUCT_Y, 3, STONE); // deck structure
cube(-20, DECK_Y, -3, 20, DECK_Y, 3, PLANKS);          // roadway surface

// ---- 5. Railings ----
line(-20, RAIL_Y, -3, 20, RAIL_Y, -3, BRICK);
line(-20, RAIL_Y, 3, 20, RAIL_Y, 3, BRICK);
for (var rx = -20; rx <= 20; rx += 2) {
  block(rx, RAIL_Y, -3, BRICK);
  block(rx, RAIL_Y, 3, BRICK);
}

// ---- 6. Lamp posts along the railings ----
for (var lx = -18; lx <= 18; lx += 6) {
  var lampZ = [-3, 3];
  for (var lzi = 0; lzi < lampZ.length; lzi++) {
    var lz = lampZ[lzi];
    block(lx, RAIL_Y + 1, lz, OAK_LOG);
    block(lx, RAIL_Y + 2, lz, OAK_LOG);
    block(lx, RAIL_Y + 3, lz, SNOW);
  }
}

// ---- 7. Main suspension cable (parabola between towers, straight backstays to anchors) ----
function mainCableY(x) {
  if (x <= -12) {
    var t1 = (x + 20) / 8; // 0 at anchor(-20), 1 at tower(-12)
    return 9 + t1 * (24 - 9);
  } else if (x >= 12) {
    var t2 = (x - 12) / 8; // 0 at tower(12), 1 at anchor(20)
    return 24 + t2 * (9 - 24);
  } else {
    var t3 = x / 12;
    return 9 + (24 - 9) * t3 * t3;
  }
}

var cableZ = [-3, 3];
for (var czi = 0; czi < cableZ.length; czi++) {
  var cz = cableZ[czi];
  var prevX = -20;
  var prevY = Math.round(mainCableY(-20));
  for (var cx = -19; cx <= 20; cx++) {
    var cy = Math.round(mainCableY(cx));
    line(prevX, prevY, cz, cx, cy, cz, COBBLE);
    prevX = cx;
    prevY = cy;
  }
}

// ---- 8. Vertical suspender cables ----
for (var sxi = 0; sxi < cableZ.length; sxi++) {
  var sz = cableZ[sxi];
  for (var sx = -19; sx <= 19; sx += 2) {
    var skip = false;
    for (var tsi = 0; tsi < TX.length; tsi++) {
      if (Math.abs(sx - TX[tsi]) <= 1) skip = true;
    }
    if (skip) continue;
    var topY = Math.round(mainCableY(sx)) - 1;
    if (topY > DECK_Y) {
      line(sx, DECK_Y + 1, sz, sx, topY, sz, COBBLE);
    }
  }
}

// ---- 9. End anchorage blocks ----
cube(-22, -1, -5, -19, 6, 5, STONE);
cube(19, -1, -5, 22, 6, 5, STONE);

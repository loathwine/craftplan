// viking-longship-4x-fable — prompt:
// a Viking longship...

// Viking longship — bow (dragon prow) faces NORTH (-Z), sailing toward the camera.
// Layout: sea ellipse at y=0, hull z=-17..15, mast amidships, striped square sail,
// shield row, oars mid-stroke, crew, stern tent, wake foam, gulls.

function hash(a, b) {
  var h = (a * 374761393 + b * 668265263) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  h = h ^ (h >> 16);
  return Math.abs(h) % 100;
}

// ---- hull profile helpers ----
var zB = -17, zS = 15;
function tOf(z) { return (z - zB) / (zS - zB); }
function hwAt(z) {
  var t = tOf(z);
  return Math.max(1, Math.round(4.3 * Math.sin(Math.PI * (0.08 + 0.84 * t))));
}
function gunAt(z) {
  var t = tOf(z);
  return 5 + Math.round(4.5 * Math.pow(Math.abs(t - 0.5) * 2, 2.2));
}
function botAt(z) {
  var t = tOf(z);
  return Math.round(3.2 * Math.pow(Math.abs(t - 0.5) * 2, 2.2));
}

// ---- 1. sea + clear trees only inside the lake footprint ----
for (var x = -15; x <= 15; x++) {
  for (var z = -22; z <= 22; z++) {
    var e = (x * x) / 225 + (z * z) / 506;
    if (e <= 1.15) cube(x, 1, z, x, 9, z, AIR);          // clear trunks/canopy above water
    if (e <= 1) {
      var c = GLASS;
      if (e > 0.9 && hash(x, z) < 45) c = ICE;           // shoreline foam
      else if (hash(x * 5 + 3, z * 7 + 1) < 6) c = ICE;  // scattered whitecaps
      block(x, 0, z, c);
    }
  }
}

// ---- 2. hull ----
for (var z = zB; z <= zS; z++) {
  var hw = hwAt(z), gun = gunAt(z), bot = botAt(z);
  // solid lower hull (flared strakes) up to just below deck
  for (var y = bot; y <= Math.min(3, gun - 1); y++) {
    var f = (y - bot) / Math.max(1, 4 - bot);
    var w = Math.max(1, Math.round(hw * (0.45 + 0.55 * Math.min(1, f))));
    cube(-w, y, z, w, y, z, PLANKS);
  }
  // deck
  var wd = Math.max(0, hw - 1);
  cube(-wd, 4, z, wd, 4, z, PLANKS);
  // topside strakes + gunwale rail
  for (var y2 = 4; y2 <= gun; y2++) {
    block(-hw, y2, z, y2 === gun ? OAK_LOG : PLANKS);
    block(hw, y2, z, y2 === gun ? OAK_LOG : PLANKS);
  }
  // keel
  block(0, bot - 1, z, OAK_LOG);
}
// curved stem and stern posts
line(0, 0, -13, 0, 9, -17, OAK_LOG);
line(0, 0, 11, 0, 9, 15, OAK_LOG);

// ---- 3. dragon prow (faces north / camera) ----
line(0, 9, -17, 0, 13, -20, OAK_LOG);      // neck
line(0, 9, -16, 0, 12, -19, OAK_LOG);      // neck thickness
cube(-1, 14, -20, 1, 16, -18, OAK_LOG);    // skull
cube(-1, 15, -22, 1, 16, -21, OAK_LOG);    // upper snout
cube(-1, 13, -22, 1, 13, -19, OAK_LOG);    // lower jaw (mouth open at y=14)
line(0, 14, -22, 0, 14, -20, BRICK);       // tongue
block(-1, 14, -22, SNOW); block(1, 14, -22, SNOW);   // fangs
block(-1, 14, -20, SNOW); block(1, 14, -20, SNOW);
block(-1, 16, -20, BRICK); block(1, 16, -20, BRICK); // glowing eyes
line(-1, 17, -18, -3, 19, -17, STONE);     // horns
line(1, 17, -18, 3, 19, -17, STONE);
block(0, 13, -17, STONE);                  // neck crest spikes
block(0, 12, -16, STONE);

// ---- 4. stern tail curl ----
block(0, 10, 16, OAK_LOG); block(0, 11, 16, OAK_LOG);
block(0, 12, 16, OAK_LOG); block(0, 13, 15, OAK_LOG);
block(0, 13, 14, OAK_LOG); block(0, 12, 13, OAK_LOG);

// ---- 5. mast, yard, sail, rigging, banner ----
cube(0, 4, 0, 0, 23, 0, OAK_LOG);
cube(-9, 21, 0, 9, 21, 0, OAK_LOG);
for (var sx = -8; sx <= 8; sx++) {
  var bulge = 2.3 * Math.cos((sx / 8.5) * Math.PI / 2);
  var col = (Math.floor((sx + 8) / 3) % 2 === 0) ? BRICK : SNOW;
  for (var sy = 9; sy <= 20; sy++) {
    var f2 = Math.min(1, (20 - sy) / 5);            // flat at yard, billowed below
    block(sx, sy, 1 + Math.round(bulge * f2), col);
  }
}
line(0, 23, 0, 0, 10, -17, OAK_LOG);   // forestay
line(0, 23, 0, 0, 9, 15, OAK_LOG);     // backstay
cube(1, 23, 0, 5, 23, 0, BRICK);       // raven pennant
cube(1, 22, 0, 3, 22, 0, BRICK);

// ---- 6. shields along both gunwales (alternating red/white, stone boss) ----
var sIdx = 0;
for (var zsh = -13; zsh <= 11; zsh += 3) {
  var hws = hwAt(zsh), guns = gunAt(zsh);
  var scol = (sIdx % 2 === 0) ? BRICK : SNOW;
  for (var side = -1; side <= 1; side += 2) {
    var px = side * (hws + 1);
    block(px, guns + 1, zsh, scol);
    block(px, guns - 1, zsh, scol);
    block(px, guns, zsh - 1, scol);
    block(px, guns, zsh + 1, scol);
    block(px, guns, zsh, STONE);
  }
  sIdx++;
}

// ---- 7. benches, rowers, oars ----
var benches = [-11, -7, -3, 3, 7];
for (var i = 0; i < benches.length; i++) {
  var bz = benches[i];
  var bhw = hwAt(bz), bw = Math.max(1, bhw - 1);
  cube(-bw, 5, bz, bw, 5, bz, OAK_LOG);            // thwart
  var rx = Math.max(1, bw - 1);
  var tunic = (i % 2 === 0) ? BRICK : OAK_LOG;
  for (var rs = -1; rs <= 1; rs += 2) {
    block(rs * rx, 6, bz, tunic);                  // seated torso
    block(rs * rx, 7, bz, SAND);                   // head
    block(rs * rx, 8, bz, STONE);                  // helmet
    // oar: from rail down into the water, blade trailing aft
    line(rs * bhw, gunAt(bz), bz, rs * (bhw + 5), 0, bz + 3, OAK_LOG);
    block(rs * (bhw + 6), 0, bz + 3, ICE);         // oar splash
  }
}

// ---- 8. chieftain at bow, steersman aft, cargo ----
block(0, 5, -14, BRICK); block(0, 6, -14, BRICK);  // red tunic
block(0, 7, -14, SAND); block(0, 8, -14, STONE);
cube(1, 5, -14, 1, 8, -14, OAK_LOG);               // spear
block(1, 9, -14, STONE);
block(0, 5, 13, OAK_LOG); block(0, 6, 13, OAK_LOG); // steersman
block(0, 7, 13, SAND); block(0, 8, 13, STONE);
line(2, 6, 13, 5, 0, 14, OAK_LOG);                 // steering oar
cylinder(-2, 5, 2, 1, 2, OAK_LOG);                 // barrel by the mast
block(2, 5, 1, OAK_LOG); block(2, 6, 1, OAK_LOG);  // crate

// ---- 9. striped tent on the stern deck ----
for (var tz = 9; tz <= 12; tz++) {
  var tc = (tz % 2 === 0) ? SNOW : BRICK;
  block(-2, 5, tz, tc); block(2, 5, tz, tc);
  block(-1, 6, tz, tc); block(1, 6, tz, tc);
  block(0, 7, tz, tc);
}

// ---- 10. bow wake + stern foam ----
line(-2, 0, -16, -9, 0, -4, ICE);
line(2, 0, -16, 9, 0, -4, ICE);
line(-3, 0, -18, -6, 0, -14, ICE);
line(3, 0, -18, 6, 0, -14, ICE);
cube(-1, 0, 16, 1, 0, 18, ICE);

// ---- 11. gulls trailing the ship ----
block(7, 13, -8, SNOW); block(8, 12, -8, SNOW); block(9, 13, -8, SNOW);
block(-6, 15, 4, SNOW); block(-5, 14, 4, SNOW); block(-4, 15, 4, SNOW);
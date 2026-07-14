// moai-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
cube(-18, -1, -3, 18, -1, 2, STONE);
cube(-18, 0, -3, 18, 0, 2, COBBLE);

cube(-6, 0, -4, 6, 0, -4, COBBLE);
cube(-4, -1, -5, 4, -1, -5, STONE);

function buildMoai(cx, baseY, H, opts) {
  opts = opts || {};
  var pukao = opts.pukao || false;
  var leanZ = opts.leanZ || 0;

  var bodyH = Math.floor(H * 0.55);
  var headH = H - bodyH;
  var yTorsoTop = baseY + bodyH - 1;
  var yHeadBase = baseY + bodyH;
  var yTop = baseY + H - 1;

  // torso / lower body
  cube(cx - 2, baseY, -1, cx + 2, yTorsoTop, 1, STONE);

  // arms folded against the sides
  var armY0 = baseY + Math.floor(bodyH * 0.3);
  var armY1 = baseY + Math.floor(bodyH * 0.8);
  cube(cx - 2, armY0, -1, cx - 2, armY1, -1, COBBLE);
  cube(cx + 2, armY0, -1, cx + 2, armY1, -1, COBBLE);

  // hands resting on the belly
  var handY = baseY + Math.floor(bodyH * 0.42);
  cube(cx - 1, handY, -1, cx + 1, handY, -1, COBBLE);

  // head block, slightly leaning
  var hf = -1 + leanZ, hb = 1 + leanZ;
  cube(cx - 2, yHeadBase, hf, cx + 2, yTop, hb, STONE);

  // heavy overhanging brow ridge
  var browY = yHeadBase + Math.floor(headH * 0.55);
  var bf = -2 + leanZ;
  cube(cx - 2, browY, bf, cx + 2, browY, bf, COBBLE);
  cube(cx - 2, browY, hf, cx + 2, browY, hf, COBBLE);

  // deep-set eye sockets, carved for free
  block(cx - 1, browY - 1, hf, AIR);
  block(cx - 1, browY - 2, hf, AIR);
  block(cx + 1, browY - 1, hf, AIR);
  block(cx + 1, browY - 2, hf, AIR);

  // long straight nose
  var noseTop = browY - 1;
  var noseBottom = Math.max(yHeadBase, browY - 4);
  cube(cx, noseBottom, bf, cx, noseTop, bf, STONE);
  cube(cx, noseBottom, hf, cx, noseTop, hf, STONE);

  // thin pursed lips
  var mouthY = noseBottom - 1;
  cube(cx - 1, mouthY, hf, cx + 1, mouthY, hf, COBBLE);

  // elongated carved earlobes
  var earY0 = yHeadBase - 3;
  var earY1 = yTop - 3;
  cube(cx - 3, earY0, 0 + leanZ, cx - 3, earY1, 0 + leanZ, STONE);
  cube(cx + 3, earY0, 0 + leanZ, cx + 3, earY1, 0 + leanZ, STONE);

  // moss / lichen weathering
  block(cx - 2, baseY + 1, 1, LEAVES);
  block(cx + 3, earY0 + 1, 0 + leanZ, LEAVES);
  block(cx, yTop - 1, hb, LEAVES);

  // red scoria topknot (pukao) on restored statues
  if (pukao) {
    cylinder(cx, yTop + 1, 0 + leanZ, 2, 3, BRICK);
  }
}

var statues = [
  { cx: -16, H: 15 },
  { cx: -8,  H: 18, leanZ: -1 },
  { cx: 0,   H: 22, pukao: true },
  { cx: 8,   H: 18, pukao: true, leanZ: 1 },
  { cx: 16,  H: 15 }
];

for (var i = 0; i < statues.length; i++) {
  var s = statues[i];
  buildMoai(s.cx, 1, s.H, s);
}

// fallen, broken moai lying face-up in the grass west of the ahu
cube(-21, -1, -14, -18, 1, -6, STONE);
cube(-22, -1, -14, -17, 2, -12, STONE);
block(-20, 2, -13, AIR);
block(-19, 2, -13, AIR);
cube(-21, 1, -10, -18, 1, -9, AIR);
block(-20, 1, -8, LEAVES);
block(-19, 1, -7, LEAVES);
block(-21, 1, -11, LEAVES);

// scattered quarry rubble near the ahu steps
block(-14, 0, -5, COBBLE);
block(-13, 0, -4, STONE);
block(11, 0, -5, COBBLE);
block(13, 0, -4, STONE);
block(-3, 0, -3, COBBLE);
block(3, 0, -3, COBBLE);
block(-9, 0, -4, STONE);
block(9, 0, -4, STONE);

// terraced grassy hill rising behind the ahu
cube(-18, 1, 3, 18, 1, 5, GRASS);
cube(-18, 1, 6, 18, 2, 7, GRASS);
cube(-16, 1, 8, 16, 3, 9, GRASS);
cube(-12, 1, 10, 12, 4, 10, DIRT);
cube(-12, 4, 10, 12, 4, 10, GRASS);

// glimpse of ocean at the horizon
cube(-18, 1, 11, 18, 1, 11, GLASS);

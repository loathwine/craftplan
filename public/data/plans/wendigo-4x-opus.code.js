// wendigo-4x-opus — prompt:
// a wendigo...

// ===== Wendigo — gaunt antlered forest horror, facing NORTH (-Z) =====

// thick segment: stacks cubes of half-size r along a 3D line (r=0 -> single blocks)
function seg(x1, y1, z1, x2, y2, z2, r, id) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  for (let i = 0; i <= steps; i++) {
    const t = steps ? i / steps : 0;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    const z = Math.round(z1 + (z2 - z1) * t);
    cube(x - r, y - r, z - r, x + r, y + r, z + r, id);
  }
}

// ---------- frozen ground / scene ----------
disk(0, 0, 1, 9, SNOW);           // trampled snow the beast stands in
disk(0, -1, 1, 9, SNOW);
// scattered frost tufts
[[-8,-5],[7,-6],[-6,7],[9,4],[5,8],[-9,2],[8,-2]].forEach(([x,z]) => {
  block(x, 0, z, ICE);
});

// dead background trees (bare, snow-dusted)
function deadTree(bx, bz, h) {
  seg(bx, 0, bz, bx, h, bz, 0, OAK_LOG);
  seg(bx, h - 3, bz, bx + 3, h + 1, bz - 1, 0, OAK_LOG);
  seg(bx, h - 5, bz, bx - 2, h - 2, bz + 1, 0, OAK_LOG);
  seg(bx, h - 1, bz, bx - 1, h + 2, bz - 2, 0, OAK_LOG);
  block(bx, h + 1, bz, SNOW);
}
deadTree(-15, 6, 15);
deadTree(16, 8, 13);
deadTree(-13, 12, 11);
deadTree(14, 14, 12);

// ============================================================
//  THE WENDIGO
// ============================================================

const SKIN = STONE;   // gray decayed skin
const BONE = SNOW;    // exposed bone / skull / claws

// ---------- feet & legs (digitigrade, emaciated) ----------
function leg(side) {           // side = -1 left, +1 right
  const hx = side * 2;         // hip x
  // clawed foot, claws splayed forward (north, -Z)
  cube(hx - 1, 0, -1, hx + 1, 1, 1, SKIN);
  for (let t = -1; t <= 1; t++) {
    seg(hx + t, 0, -1, hx + t * 2, 0, -4, 0, BONE);   // toe claws
  }
  seg(hx, 1, 0, hx, 0, 2, 0, BONE);                    // heel spur
  // shin: ankle up to backward-kicked knee
  seg(hx, 1, 0, side * 3, 7, 2, 1, SKIN);
  // thigh: knee forward and inward to hip
  seg(side * 3, 7, 2, hx - side, 12, -1, 1, SKIN);
  // knee bone knob
  cube(side * 3 - 1, 6, 1, side * 3 + 1, 8, 3, BONE);
}
leg(-1);
leg(1);

// ---------- pelvis / gaunt hips ----------
cube(-3, 11, -1, 3, 13, 2, SKIN);
cube(-3, 12, 1, 3, 13, 2, BONE);      // iliac crest
seg(-2, 13, -2, 2, 13, -2, 0, BONE);  // pelvic front edge

// ---------- spine & starved torso ----------
seg(0, 12, 2, 0, 24, 3, 1, SKIN);          // spine column (back)
for (let y = 13; y <= 24; y += 2) block(0, y, 3, BONE);  // vertebrae knobs

// sternum / front centerline
seg(0, 13, -2, 0, 21, -1, 0, BONE);

// ribcage — ribs sweep from spine, out, and down toward sternum (sunken belly left hollow)
function rib(y, side) {
  seg(side * 1, y, 2, side * 4, y, 0, 0, BONE);        // spine -> flank
  seg(side * 4, y, 0, side * 1, y - 1, -2, 0, BONE);   // flank -> sternum, angled down
}
[20, 18, 16, 14].forEach(y => { rib(y, -1); rib(y, 1); });
// thin dark flesh clinging over the back of the ribs
cube(-3, 14, 1, 3, 21, 2, SKIN);

// ---------- shoulders / clavicles ----------
cube(-5, 21, 0, 5, 22, 2, SKIN);
seg(-4, 22, -1, 4, 22, -1, 0, BONE);   // collarbone
cube(-5, 20, 1, -4, 22, 2, BONE);      // shoulder knobs
cube(4, 20, 1, 5, 22, 2, BONE);

// ---------- long grasping arms with hooked claws ----------
function arm(side) {
  const sx = side * 5;
  cube(sx - 1, 20, 0, sx + 1, 22, 2, SKIN);            // shoulder ball
  // upper arm out to elbow
  seg(sx, 21, 1, side * 7, 15, -1, 1, SKIN);
  cube(side * 7 - 1, 14, -2, side * 7 + 1, 16, 0, BONE); // elbow knob
  // forearm down past the knees
  seg(side * 7, 15, -1, side * 5, 8, -3, 1, SKIN);
  // wrist
  const wx = side * 5, wy = 8, wz = -3;
  cube(wx - 1, wy - 1, wz - 1, wx + 1, wy, wz + 1, BONE);
  // splayed hooked claws reaching low
  for (let t = -1; t <= 1; t++) {
    seg(wx + t, wy - 1, wz, wx + t * 2, wy - 5, wz - 2, 0, BONE);
    block(wx + t * 2, wy - 6, wz - 3, BONE);           // hooked tips
  }
}
arm(-1);
arm(1);

// ---------- gaunt neck ----------
seg(0, 22, 1, 0, 24, 0, 1, SKIN);
seg(0, 22, 2, 0, 24, 2, 0, BONE);   // nape bone

// ---------- elk-skull head (elongated snout points NORTH) ----------
cube(-2, 24, 0, 2, 27, 3, BONE);          // cranium
cube(-1, 24, -3, 1, 26, 0, BONE);         // snout / muzzle forward
cube(-1, 23, -3, 1, 24, -1, BONE);        // lower jaw
seg(-1, 23, -3, 1, 23, -3, 0, SKIN);      // teeth/jaw shadow line
// deep eye sockets (carved) with faint burning glow
cube(-2, 25, -1, -1, 26, 0, AIR);
cube(1, 25, -1, 2, 26, 0, AIR);
block(-2, 26, -1, BRICK);
block(2, 26, -1, BRICK);
block(0, 25, -3, AIR);                    // nostril hollow

// ---------- towering branching antlers (OAK_LOG bone-wood) ----------
function antler(side) {
  const bx = side * 2, by = 27, bz = 2;
  // main sweeping beam: up, out, and back
  seg(bx, by, bz, side * 6, 32, 4, 1, OAK_LOG);
  cube(bx, 27, 1, bx + side, 28, 3, OAK_LOG);          // burr/base
  // forward brow tine
  seg(side * 3, 29, 2, side * 3, 31, -2, 0, OAK_LOG);
  // mid outward tine
  seg(side * 4, 30, 3, side * 8, 31, 4, 0, OAK_LOG);
  block(side * 8, 32, 4, OAK_LOG);
  // upward tine off the beam
  seg(side * 5, 31, 3, side * 5, 34, 2, 0, OAK_LOG);
  // crown fork at the top
  seg(side * 6, 32, 4, side * 7, 34, 2, 0, OAK_LOG);
  seg(side * 6, 32, 4, side * 5, 34, 5, 0, OAK_LOG);
  block(side * 7, 34, 2, SNOW);                         // snow-capped tips
  block(side * 5, 34, 5, SNOW);
  block(side * 5, 34, 2, SNOW);
}
antler(-1);
antler(1);

// wisps of frozen breath / hanging frost from the ribs and jaw
[[-3,10,-2],[3,9,-1],[0,22,-4],[-1,12,-3],[2,15,-3]].forEach(([x,y,z]) => {
  block(x, y, z, ICE);
});
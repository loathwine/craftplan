// knight-vs-dragon-4x-fable — prompt:
// a knight fighting a dragon...

// KNIGHT VS DRAGON — knight (west) with raised sword and shield, rearing green dragon (east)
// breathing fire down onto the shield. Camera views from north (-Z).

function sph(x, y, z, r, id) {
  sphere(Math.round(x), Math.round(y), Math.round(z), Math.max(1, Math.round(r)), id);
}
function seg(a, b, r1, r2, id) {
  const d = Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2]);
  const n = Math.max(1, Math.ceil(d * 1.5));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    sph(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t, r1+(r2-r1)*t, id);
  }
}
function tri(a, b, c, id) {
  const e1 = Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2]);
  const e2 = Math.hypot(c[0]-a[0], c[1]-a[1], c[2]-a[2]);
  const n = Math.max(4, Math.ceil(Math.max(e1, e2) * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    line(
      Math.round(a[0]+(b[0]-a[0])*t), Math.round(a[1]+(b[1]-a[1])*t), Math.round(a[2]+(b[2]-a[2])*t),
      Math.round(a[0]+(c[0]-a[0])*t), Math.round(a[1]+(c[1]-a[1])*t), Math.round(a[2]+(c[2]-a[2])*t),
      id
    );
  }
}

// ---- clear trees/bushes over the battle scene (AIR is free) ----
cube(-20, 1, -10, 21, 12, 16, AIR);
cube(12, 1, 14, 22, 8, 22, AIR);

// ---- scorched battlefield ground ----
disk(-4, 0, 1, 7, COBBLE);
disk(-11, 0, 1, 5, COBBLE);
disk(-4, 0, 1, 3, STONE);
// glowing ember cracks in the scorch
[[-2,0,3],[0,0,0],[-6,0,-1],[1,0,2],[-8,0,2],[-3,0,-3]].forEach(p => block(p[0], p[1], p[2], BRICK));
// ground pads under dragon feet
cube(10, 0, 2, 14, 0, 6, STONE);
cube(18, 0, 11, 22, 0, 15, STONE);

// ---- background: ruined watchtower (south-west) ----
cylinder(-15, -1, 12, 4, 2, COBBLE);
hollowCylinder(-15, 1, 12, 3, 8, STONE);
cube(-19, 5, 8, -14, 9, 12, AIR);           // broken away toward camera
cube(-16, 1, 9, -14, 3, 9, AIR);            // doorway
[[-12,9,11],[-12,9,13],[-13,9,15],[-15,9,15]].forEach(p => block(p[0], p[1], p[2], COBBLE));
[[-12,4,11],[-12,6,12],[-13,2,14],[-12,3,13]].forEach(p => block(p[0], p[1], p[2], LEAVES)); // ivy
[[-14,1,7],[-16,1,6],[-12,1,8]].forEach(p => block(p[0], p[1], p[2], COBBLE));               // rubble
cube(-15, 1, 7, -14, 1, 8, STONE);

// ---- knight's war banner ----
line(-19, 0, 2, -19, 9, 2, OAK_LOG);
line(-19, 9, 2, -15, 9, 2, OAK_LOG);
cube(-18, 5, 2, -15, 8, 2, BRICK);
block(-18, 5, 2, AIR); block(-16, 5, 2, AIR); // tattered hem
block(-17, 6, 2, SNOW); block(-16, 7, 2, SNOW); block(-17, 7, 2, SNOW); block(-16, 6, 2, SNOW);

// ---- battlefield props ----
sph(-1, 0, 8, 2, STONE); block(0, 2, 8, LEAVES);      // mossy boulder mid-field
sph(19, 1, 2, 2, STONE);                               // boulder east
sph(-9, 0, -7, 1, COBBLE);                             // foreground stone
line(8, 0, -6, 8, 6, -6, OAK_LOG);                     // burnt dead tree
line(8, 5, -6, 10, 7, -7, OAK_LOG);
line(8, 4, -6, 6, 6, -6, OAK_LOG);
line(16, 1, -3, 16, 7, -3, OAK_LOG);                   // second dead tree
line(16, 6, -3, 14, 8, -2, OAK_LOG);
line(-4, 1, -6, 2, 1, -8, OAK_LOG);                    // shattered lance (foreground)
block(-1, 1, -7, AIR);
block(3, 1, -8, COBBLE);
block(4, 1, -5, STONE); block(4, 2, -5, STONE); block(3, 2, -5, STONE); // fallen helm

// ==================== DRAGON (rearing, facing the knight) ====================
// hips + haunches + hind legs
sph(16, 8, 9, 4, LEAVES);
sph(13, 6, 6, 2, LEAVES);
sph(19, 6, 12, 2, LEAVES);
seg([13, 5, 6], [12, 2, 4.5], 1.3, 1.1, LEAVES);
seg([19, 5, 12], [20, 2, 13.5], 1.3, 1.1, LEAVES);
cube(11, 1, 3, 13, 2, 5, LEAVES);
[[11,1,2],[12,1,2],[13,1,2]].forEach(p => block(p[0], p[1], p[2], SNOW)); // claws
cube(19, 1, 12, 21, 2, 14, LEAVES);
[[19,1,11],[20,1,11],[21,1,11]].forEach(p => block(p[0], p[1], p[2], SNOW));

// body spine arcing up to raised chest
seg([16, 8, 9], [14, 11, 7], 3.6, 3.3, LEAVES);
seg([14, 11, 7], [12, 13, 5.5], 3.3, 3.2, LEAVES);
sph(11, 14, 4, 3.5, LEAVES);
cube(9, 11, 3, 11, 12, 4, SAND); // pale belly plates

// forelegs raking forward at the knight
seg([10, 12, 2], [6, 10, 0], 1.3, 1, LEAVES);
seg([6, 10, 0], [4, 8, -1], 1, 0.8, LEAVES);
block(3, 7, -1, SNOW); block(3, 8, -2, SNOW); block(4, 7, 0, SNOW);
seg([12, 12, 6], [9, 9, 6], 1.3, 1, LEAVES);
seg([9, 9, 6], [7, 7, 6], 1, 0.8, LEAVES);
block(6, 7, 6, SNOW); block(6, 6, 6, SNOW);

// tail sweeping east along the ground
seg([16, 8, 10], [19, 6, 14], 2.2, 1.6, LEAVES);
seg([19, 6, 14], [21, 4, 18], 1.6, 1.1, LEAVES);
seg([21, 4, 18], [17, 1, 21], 1.1, 0.8, LEAVES);
tri([17, 1, 21], [15, 4, 22], [14, 1, 21], BRICK); // tail spade

// neck rising to the looming head
seg([11, 15, 4], [9, 18, 3], 2.2, 2, LEAVES);
seg([9, 18, 3], [7, 20, 2], 2, 1.7, LEAVES);
seg([7, 20, 2], [5, 21, 1], 1.7, 1.4, LEAVES);
// throat scutes
[[10,13,4],[9,15,3],[8,16,3],[7,18,2],[6,19,1],[5,20,1]].forEach(p => block(p[0], p[1], p[2], SAND));

// head: skull, brow, snout, open jaw with fangs
cube(2, 20, -1, 5, 23, 3, LEAVES);
cube(1, 22, 0, 2, 23, 2, LEAVES);
cube(-1, 21, 0, 1, 22, 2, LEAVES);
cube(0, 19, 0, 3, 19, 2, LEAVES);
cube(-2, 18, 0, 0, 18, 2, LEAVES);
[[-1,20,0],[-1,20,2],[1,20,0],[1,20,2]].forEach(p => block(p[0], p[1], p[2], SNOW)); // upper fangs
block(-2, 19, 0, SNOW); block(-2, 19, 2, SNOW);                                       // lower fangs
block(1, 20, 1, BRICK); block(2, 20, 1, BRICK); block(0, 19, 1, BRICK);               // mouth glow
block(3, 22, -2, BRICK); block(3, 22, 4, BRICK);                                      // burning eyes
line(5, 23, 0, 8, 26, -1, OAK_LOG);                                                   // horns
line(5, 23, 2, 8, 26, 4, OAK_LOG);
block(8, 27, -1, SNOW); block(8, 27, 4, SNOW);
block(4, 24, 1, SNOW); block(5, 24, 1, SNOW);                                         // crest

// dorsal spikes
[[16,13,9],[14,15,7],[12,17,5],[11,18,4],[9,20,3],[7,22,2],
 [17,9,11],[18,8,13],[20,7,15],[21,5,18]].forEach(p => block(p[0], p[1], p[2], SNOW));

// ---- wings: red membranes on log bones, swept up and back ----
// east wing
tri([13, 16, 6], [18, 23, 10], [21, 17, 14], BRICK);
tri([13, 16, 6], [21, 17, 14], [17, 11, 10], BRICK);
tri([18, 23, 10], [21, 26, 12], [21, 17, 14], BRICK);
seg([13, 16, 6], [18, 23, 10], 1, 1, OAK_LOG);
seg([18, 23, 10], [21, 26, 12], 1, 0.8, OAK_LOG);
line(18, 23, 10, 21, 17, 14, OAK_LOG);
block(21, 27, 12, SNOW);
// west wing
tri([9, 16, 2], [3, 23, 7], [1, 17, 11], BRICK);
tri([9, 16, 2], [1, 17, 11], [13, 11, 9], BRICK);
tri([3, 23, 7], [-1, 26, 10], [1, 17, 11], BRICK);
seg([9, 16, 2], [3, 23, 7], 1, 1, OAK_LOG);
seg([3, 23, 7], [-1, 26, 10], 1, 0.8, OAK_LOG);
line(3, 23, 7, 1, 17, 11, OAK_LOG);
block(-1, 27, 10, SNOW);

// ==================== KNIGHT (lunging east, sword overhead) ====================
// legs + boots
cube(-14, 1, 0, -13, 4, 1, STONE);
cube(-10, 1, 0, -9, 4, 1, STONE);
cube(-14, 1, 0, -13, 1, 1, COBBLE);
cube(-10, 1, 0, -9, 1, 1, COBBLE);
cube(-13, 5, 0, -10, 5, 1, COBBLE);                 // belt
cube(-13, 6, -1, -10, 7, 2, STONE);                 // lower torso
cube(-12, 8, -1, -9, 9, 2, STONE);                  // upper torso leaning into the fight
// red cape flowing back west
cube(-14, 6, 0, -14, 9, 1, BRICK);
cube(-15, 4, 0, -15, 8, 1, BRICK);
cube(-16, 2, 0, -16, 7, 1, BRICK);
cube(-17, 1, 0, -17, 5, 1, BRICK);
cube(-18, 1, 0, -18, 3, 1, BRICK);
// pauldrons
cube(-14, 9, -1, -13, 10, 2, COBBLE);
cube(-9, 9, -1, -8, 10, 2, COBBLE);
// heraldic cross on chest (north face, toward camera)
[[-11,8,-2],[-11,7,-2],[-11,6,-2],[-12,7,-2],[-10,7,-2]].forEach(p => block(p[0], p[1], p[2], BRICK));
// helm + visor slit + plume
cube(-12, 10, 0, -11, 12, 1, STONE);
block(-11, 11, 0, AIR); block(-11, 11, 1, AIR);
block(-12, 13, 0, BRICK); block(-13, 13, 0, BRICK); block(-14, 12, 0, BRICK);

// shield arm + great shield (facing the dragon)
line(-9, 9, 0, -7, 8, 0, STONE);
line(-9, 9, 1, -7, 8, 1, STONE);
block(-7, 8, 0, COBBLE); block(-7, 8, 1, COBBLE);
for (let y = 5; y <= 12; y++) {
  for (let z = -3; z <= 4; z++) {
    const dy = (y - 8.5) / 4, dz = (z - 0.5) / 4;
    const d = dy * dy + dz * dz;
    if (d <= 1) block(-6, y, z, d > 0.55 ? COBBLE : STONE);
  }
}
for (let y = 6; y <= 11; y++) { block(-6, y, 0, SNOW); block(-6, y, 1, SNOW); } // snow cross
for (let z = -2; z <= 3; z++) { block(-6, 8, z, SNOW); block(-6, 9, z, SNOW); }
block(-5, 8, 0, COBBLE); block(-5, 8, 1, COBBLE); block(-5, 9, 0, COBBLE); block(-5, 9, 1, COBBLE); // boss

// sword arm raised, blade sweeping up toward the dragon's head
line(-14, 10, 0, -16, 13, 0, STONE);
line(-14, 10, 1, -16, 13, 1, STONE);
block(-16, 13, 0, COBBLE); block(-16, 13, 1, COBBLE);
cube(-17, 14, 0, -15, 14, 1, COBBLE);               // crossguard
for (let i = 0; i < 8; i++) cube(-16 + i, 15 + i, 0, -15 + i, 15 + i, 1, SNOW);
block(-8, 23, 0, SNOW); block(-8, 23, 1, SNOW);     // blade tip

// ==================== FIRE BREATH (placed last so it licks over the shield) ====================
sph(-1, 19, 1, 1, BRICK);
sph(-3, 16, 1, 1.5, BRICK);
sph(-5, 13, 0, 2, BRICK);
sph(-6, 11, 0, 2, BRICK);
line(-1, 19, 1, -6, 12, 0, SAND);                   // white-hot core
line(-2, 18, 1, -5, 13, 1, SAND);
// flame tongues and sparks around the impact
[[-8,13,-2],[-8,14,2],[-4,15,-1],[-7,15,0],[-5,10,3],[-7,9,-3]].forEach(p => block(p[0], p[1], p[2], BRICK));
[[-9,15,-1],[-6,16,1],[-3,18,-1]].forEach(p => block(p[0], p[1], p[2], SAND));
// embers pooling at the knight's feet
[[-5,1,3],[-4,1,-2],[-2,1,1]].forEach(p => block(p[0], p[1], p[2], BRICK));
block(-3, 1, 3, SAND);
// automaton-fable — prompt:
// a steampunk automaton robot...

// Steampunk automaton robot — brass, copper and iron, facing north (-Z)
// Trees stand on the site: clear the central area where the robot stands.
cube(-12, 0, -12, 12, 9, 12, AIR);

// ---------- helpers ----------
function rivetRing(cx, y, cz, r, id) {
  for (let a = 0; a < 360; a += 45) {
    const x = Math.round(cx + Math.cos(a * Math.PI / 180) * r);
    const z = Math.round(cz + Math.sin(a * Math.PI / 180) * r);
    block(x, y, z, id);
  }
}
function gear(cx, cy, cz, r, axis, id) {
  // flat gear in a plane; axis 'z' => gear lies in XY plane
  for (let a = 0; a < 360; a += 30) {
    const dx = Math.round(Math.cos(a * Math.PI / 180) * (r + 1));
    const dy = Math.round(Math.sin(a * Math.PI / 180) * (r + 1));
    if (axis === 'z') block(cx + dx, cy + dy, cz, id);
    else block(cx, cy + dy, cz + dx, id);
  }
  if (axis === 'z') {
    for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++)
      if (x * x + y * y <= r * r) block(cx + x, cy + y, cz, id);
    block(cx, cy, cz, BLACK);
  } else {
    for (let z = -r; z <= r; z++) for (let y = -r; y <= r; y++)
      if (z * z + y * y <= r * r) block(cx, cy + y, cz + z, id);
    block(cx, cy, cz, BLACK);
  }
}

// ---------- base plinth / workshop floor ----------
cube(-9, -1, -7, 9, -1, 7, COBBLE);
cube(-8, 0, -6, 8, 0, 6, IRON);
hollowCube(-8, 0, -6, 8, 0, 6, COPPER);
for (let x = -8; x <= 8; x += 2) { block(x, 0, -6, GOLD); block(x, 0, 6, GOLD); }

// ---------- feet / boots ----------
// left boot (west), right boot (east); toes toward -Z
cube(-6, 1, -4, -3, 2, 2, IRON);
cube(-6, 1, -5, -3, 1, -5, COPPER);   // toe cap
cube(-6, 3, -2, -3, 3, 2, COPPER);    // ankle cuff
cube(3, 1, -4, 6, 2, 2, IRON);
cube(3, 1, -5, 6, 1, -5, COPPER);
cube(3, 3, -2, 6, 3, 2, COPPER);
// boot rivets
for (let z = -4; z <= 2; z += 2) { block(-7, 2, z, GOLD); block(7, 2, z, GOLD); }

// ---------- legs: pistons + hydraulic rods ----------
for (const sx of [-1, 1]) {
  const lx = sx * 4.5;
  const cx = Math.round(lx);
  // lower leg cylinder (brass) y4..9
  cylinder(cx, 4, 0, 1, 6, GOLD);
  // iron piston rods flanking
  line(cx + 2 * sx, 4, 0, cx + 2 * sx, 9, 0, IRON);
  line(cx, 4, 2, cx, 9, 2, IRON);
  // knee joint - big gear facing north
  gear(cx, 10, -2, 2, 'z', COPPER);
  sphere(cx, 10, 0, 2, IRON);
  // upper leg (thigh) iron, slightly inward
  cube(cx - 1 - (sx < 0 ? 0 : 0), 11, -1, cx + 1, 15, 1, IRON);
  cube(cx - 1, 11, -2, cx + 1, 15, -2, COPPER);  // copper front plating
  for (let y = 11; y <= 15; y += 2) { block(cx - 2, y, 0, GOLD); block(cx + 2, y, 0, GOLD); }
  // steam vent near knee
  block(cx + 3 * sx, 10, 1, COPPER);
}

// ---------- pelvis / hips ----------
cube(-6, 15, -2, 6, 17, 2, IRON);
cube(-6, 16, -3, 6, 16, -3, COPPER);
cube(-5, 15, 3, 5, 17, 3, COPPER);
// hip gear bolts
block(-7, 16, 0, GOLD); block(7, 16, 0, GOLD);
// belt buckle
cube(-1, 15, -3, 1, 17, -3, GOLD);

// ---------- torso: boiler body ----------
// main barrel chest (brass) y18..27, flattened cylinder
cylinder(0, 18, 0, 6, 10, GOLD);
cylinder(0, 18, 0, 6, 1, COPPER);   // bottom band
cylinder(0, 22, 0, 6, 1, COPPER);   // mid band
cylinder(0, 27, 0, 6, 1, COPPER);   // top band
rivetRing(0, 19, 0, 6, IRON);
rivetRing(0, 21, 0, 6, IRON);
rivetRing(0, 24, 0, 6, IRON);
rivetRing(0, 26, 0, 6, IRON);
// front chest plate (iron) with porthole and glowing furnace
cube(-4, 19, -6, 4, 26, -6, IRON);
cube(-3, 20, -6, 3, 25, -6, COPPER);
hollowCube(-2, 21, -6, 2, 24, -6, GOLD);
cube(-1, 22, -6, 1, 23, -6, LAVA);   // furnace glow
cube(-1, 22, -5, 1, 23, -5, LAVA);
// furnace grate bars
block(0, 21, -7, IRON); block(0, 24, -7, IRON);
// pressure gauges on chest
block(-5, 24, -6, WHITE); block(-5, 24, -7, GLASS);
block(5, 24, -6, WHITE); block(5, 24, -7, GLASS);
block(-5, 23, -6, BLACK); block(5, 23, -6, BLACK);
// back boiler plate with pipes
cube(-4, 19, 6, 4, 26, 6, IRON);
cube(-2, 18, 7, 2, 27, 7, COPPER);
// vertical pipes on back
line(-3, 18, 7, -3, 29, 7, COPPER);
line(3, 18, 7, 3, 29, 7, COPPER);
line(-3, 29, 7, -3, 29, 4, COPPER);
line(3, 29, 7, 3, 29, 4, COPPER);
// side gears on torso
gear(-7, 22, 0, 2, 'x', IRON);
gear(7, 22, 0, 2, 'x', IRON);
gear(-7, 22, 0, 1, 'x', GOLD);
gear(7, 22, 0, 1, 'x', GOLD);

// ---------- smokestacks on shoulders/back ----------
cylinder(-3, 28, 3, 1, 4, IRON);
cylinder(3, 28, 3, 1, 4, IRON);
cube(-4, 32, 2, -2, 32, 4, COPPER);
cube(2, 32, 2, 4, 32, 4, COPPER);
block(-3, 33, 3, STEAM);
block(3, 33, 3, STEAM);

// ---------- shoulders ----------
sphere(-8, 26, 0, 3, IRON);
sphere(8, 26, 0, 3, IRON);
hollowCube(-10, 29, -2, -6, 29, 2, COPPER);  // pauldron rims
hollowCube(6, 29, -2, 10, 29, 2, COPPER);
cube(-9, 30, -1, -7, 30, 1, GOLD);
cube(7, 30, -1, 9, 30, 1, GOLD);
rivetRing(-8, 27, 0, 3, GOLD);
rivetRing(8, 27, 0, 3, GOLD);

// ---------- arms ----------
// LEFT arm (west) hangs down with a piston forearm
cube(-12, 20, -1, -10, 25, 1, GOLD);         // upper arm brass
cube(-13, 20, 0, -13, 25, 0, IRON);          // piston rod
gear(-11, 19, -2, 2, 'z', COPPER);           // elbow gear
sphere(-11, 19, 0, 2, IRON);
cube(-12, 12, -1, -10, 18, 1, IRON);         // forearm
cube(-13, 13, -1, -13, 17, 1, COPPER);       // forearm plate outer
cube(-12, 12, -2, -10, 17, -2, COPPER);      // front plate
// left hand: claw
cube(-13, 9, -2, -9, 11, 2, IRON);
cube(-13, 7, -2, -13, 8, -2, GOLD);
cube(-9, 7, -2, -9, 8, -2, GOLD);
cube(-13, 7, 2, -13, 8, 2, GOLD);
cube(-9, 7, 2, -9, 8, 2, GOLD);
block(-11, 7, 0, GOLD); block(-11, 8, 0, GOLD);

// RIGHT arm (east) raised forward holding a lantern-ish arm
cube(10, 22, -1, 12, 27, 1, GOLD);
cube(13, 22, 0, 13, 27, 0, IRON);
gear(11, 21, -2, 2, 'z', COPPER);
sphere(11, 21, 0, 2, IRON);
// forearm points north (-Z)
cube(10, 19, -9, 12, 21, -1, IRON);
cube(10, 22, -9, 12, 22, -2, COPPER);
cube(13, 19, -8, 13, 21, -2, COPPER);
line(9, 20, -8, 9, 20, -2, GOLD);
// right hand: open grasp with hanging lantern
cube(9, 18, -12, 13, 22, -9, IRON);
block(9, 17, -12, GOLD); block(13, 17, -12, GOLD);
block(9, 17, -9, GOLD); block(13, 17, -9, GOLD);
// glowing lantern in the grip
cube(10, 15, -12, 12, 16, -10, COPPER);
hollowCube(10, 13, -12, 12, 14, -10, GOLD);
block(11, 13, -11, GLOWSTONE); block(11, 14, -11, GLOWSTONE);
block(11, 12, -11, COPPER);
line(11, 17, -11, 11, 17, -11, IRON);

// ---------- neck ----------
cylinder(0, 28, 0, 2, 2, IRON);
rivetRing(0, 29, 0, 2, COPPER);

// ---------- head ----------
cube(-4, 30, -4, 4, 33, 4, GOLD);       // brass skull
// cheek plates & jaw
cube(-4, 30, -5, 4, 30, -5, IRON);      // jaw
cube(-3, 31, -5, 3, 33, -5, COPPER);    // face plate
// eyes: glowing lenses facing north
block(-2, 32, -5, NEON_BLUE); block(2, 32, -5, NEON_BLUE);
block(-2, 32, -6, GLASS); block(2, 32, -6, GLASS);
hollowCube(-3, 31, -5, -1, 33, -5, IRON);
hollowCube(1, 31, -5, 3, 33, -5, IRON);
// monocle gear on right eye
gear(3, 32, -6, 1, 'z', COPPER);
block(3, 32, -6, GLASS);
// mouth grille
for (let x = -2; x <= 2; x++) block(x, 30, -6, x % 2 === 0 ? IRON : BLACK);
// ear ventilators
cube(-5, 31, -1, -5, 32, 1, COPPER);
cube(5, 31, -1, 5, 32, 1, COPPER);
block(-6, 31, 0, IRON); block(6, 31, 0, IRON);
// top hat (hat = iron with gold band) – clamp to Y<=33
// top of the head is y=33 so the hat brim sits at 33 and crown is implied by eyebrow line
cube(-5, 33, -5, 5, 33, 5, OBSIDIAN);
cube(-3, 33, -3, 3, 33, 3, GOLD);
// (crown would exceed Y limit; the brim gives the top-hat silhouette)

// ---------- extra pipes and gauges on sides ----------
line(-6, 18, 3, -6, 17, 5, COPPER);
line(6, 18, 3, 6, 17, 5, COPPER);
line(-6, 20, 5, -9, 20, 5, COPPER);
line(6, 20, 5, 9, 20, 5, COPPER);
block(-9, 20, 5, STEAM); block(9, 20, 5, STEAM);

// ---------- workshop scene: forge, crates, gears on the ground ----------
// small furnace to the west
cube(-14, 0, -3, -11, 3, 0, BRICK);
cube(-13, 1, -4, -12, 2, -4, LAVA);
cube(-13, 4, -2, -12, 7, -1, COBBLE);
block(-13, 8, -2, STEAM); block(-12, 8, -1, FIRE);
// crates to the east
cube(13, 1, 2, 15, 3, 4, PLANKS);
cube(16, 1, 3, 17, 2, 4, PLANKS);
hollowCube(13, 1, 2, 15, 3, 4, OAK_LOG);
// scattered spare gears lying flat on the plinth
gear(-10, 1, 5, 2, 'z', COPPER);
disk(10, 1, 5, 2, IRON); block(10, 1, 5, BLACK);
disk(-10, 1, -8, 1, GOLD);
// barrels
cylinder(14, 1, -4, 1, 3, OAK_LOG);
cylinder(14, 4, -4, 1, 1, COPPER);
cylinder(-15, 1, 4, 1, 3, OAK_LOG);
cylinder(-15, 4, 4, 1, 1, COPPER);
// oil puddle
disk(-4, 0, -9, 1, OBSIDIAN);
// steam leak at the pelvis joint
block(0, 18, -7, STEAM);
block(-7, 14, 0, STEAM);
block(7, 14, 0, STEAM);
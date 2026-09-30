// ghost-rider-fable — prompt:
// Ghost Rider on his flaming motorcycle...

// Ghost Rider on flaming motorcycle — bike rides north (-Z), rider faces camera.
// Terrain: ground ~y=-1/0 around origin, a few trees (OAK_LOG at (1,-1..1,-7), (4,-1..1,-3), (0,0..1,1)).
// Clear the immediate site of tree trunks/leaves.
cube(-8, 0, -12, 9, 8, 6, AIR);

// ---------- ROAD ----------
cube(-4, -1, -20, 4, -1, 14, BLACK);
cube(-5, -1, -20, -5, -1, 14, GRAY);
cube(5, -1, -20, 5, -1, 14, GRAY);
for (let z = -19; z <= 13; z += 4) cube(0, -1, z, 0, -1, z + 1, YELLOW);
// scorched trail behind the bike
for (let z = 6; z <= 18; z++) {
  const w = z > 12 ? 1 : 2;
  cube(-w, -1, z, w, -1, z, OBSIDIAN);
  if (z % 3 === 0) block((z % 2 ? 1 : -1), -1, z, LAVA);
}
// skid marks + embers
line(-2, -1, 4, -2, -1, 11, COBBLE);
line(2, -1, 5, 2, -1, 12, COBBLE);

// ---------- MOTORCYCLE (long axis along Z, facing -Z) ----------
// Wheels: vertical disks in the X=const plane. Build with helper.
function wheelZ(cx, cy, cz, r, id) {
  for (let dy = -r; dy <= r; dy++)
    for (let dz = -r; dz <= r; dz++)
      if (dy * dy + dz * dz <= r * r + r * 0.5) block(cx, cy + dy, cz + dz, id);
}
function ringZ(cx, cy, cz, r, id) {
  for (let dy = -r; dy <= r; dy++)
    for (let dz = -r; dz <= r; dz++) {
      const d = dy * dy + dz * dz;
      if (d <= r * r + r * 0.5 && d > (r - 1) * (r - 1) + (r - 1) * 0.5) block(cx, cy + dy, cz + dz, id);
    }
}
// Front wheel (north)
for (let x = -1; x <= 1; x++) wheelZ(x, 3, -9, 3, BLACK);
ringZ(-1, 3, -9, 3, OBSIDIAN); ringZ(1, 3, -9, 3, OBSIDIAN);
for (let x = -1; x <= 1; x++) wheelZ(x, 3, -9, 1, IRON);
// Rear wheel (south), bigger
for (let x = -1; x <= 1; x++) wheelZ(x, 3, 6, 4, BLACK);
ringZ(-1, 3, 6, 4, OBSIDIAN); ringZ(1, 3, 6, 4, OBSIDIAN);
for (let x = -1; x <= 1; x++) wheelZ(x, 3, 6, 1, IRON);
// Fender over rear wheel
for (let dz = -4; dz <= 4; dz++) {
  const y = 7 + Math.round(Math.sqrt(Math.max(0, 16 - dz * dz))) - 4;
  cube(-2, y + 1, 6 + dz, 2, y + 1, 6 + dz, IRON);
}
// Front fender
for (let dz = -3; dz <= 3; dz++) {
  const y = 3 + Math.round(Math.sqrt(Math.max(0, 9 - dz * dz)));
  cube(-1, y + 1, -9 + dz, 1, y + 1, -9 + dz, IRON);
}
// Fork (angled from headstock down to front axle)
line(-2, 9, -3, -2, 3, -9, IRON);
line(2, 9, -3, 2, 3, -9, IRON);
line(-2, 9, -2, -2, 3, -8, LIGHT_GRAY);
line(2, 9, -2, 2, 3, -8, LIGHT_GRAY);
// Headlight & headstock
cube(-2, 8, -4, 2, 10, -2, IRON);
cube(-1, 8, -5, 1, 9, -5, GLOWSTONE);
block(0, 9, -6, GLOWSTONE);
// Handlebars (ape hangers)
line(-5, 10, -2, 5, 10, -2, IRON);
line(-5, 10, -2, -5, 12, -3, IRON);
line(5, 10, -2, 5, 12, -3, IRON);
block(-5, 12, -3, BLACK); block(5, 12, -3, BLACK);
block(-6, 12, -3, BLACK); block(6, 12, -3, BLACK);
// Frame / engine block
cube(-2, 5, -3, 2, 7, 3, IRON);
cube(-3, 4, -2, 3, 6, 2, GRAY);
cube(-4, 4, -1, -3, 5, 1, IRON); cube(3, 4, -1, 4, 5, 1, IRON);
// cylinder heads (V-twin)
cube(-3, 7, -1, 3, 8, -1, LIGHT_GRAY);
cube(-3, 7, 1, 3, 8, 1, LIGHT_GRAY);
cube(-2, 8, -1, 2, 8, -1, GRAY);
cube(-2, 8, 1, 2, 8, 1, GRAY);
// Fuel tank — skull-fire painted (black with orange flames)
cube(-2, 8, -1, 2, 10, 3, BLACK);
cube(-3, 9, 0, 3, 9, 2, BLACK);
block(-3, 10, 1, ORANGE); block(3, 10, 1, ORANGE);
block(-2, 10, 0, ORANGE); block(2, 10, 0, ORANGE);
block(-2, 10, 2, RED); block(2, 10, 2, RED);
block(0, 11, 1, GOLD); // gas cap
// Seat
cube(-2, 9, 4, 2, 9, 8, BLACK);
cube(-2, 10, 7, 2, 10, 8, BLACK); // seat rise
// Exhaust pipes (chrome, sweeping back)
line(-4, 5, -1, -4, 4, 10, IRON);
line(4, 5, -1, 4, 4, 10, IRON);
line(-4, 4, 10, -5, 4, 13, IRON);
line(4, 4, 10, 5, 4, 13, IRON);
block(-5, 4, 14, GRAY); block(5, 4, 14, GRAY);
// Rear swingarm & chain guard
cube(-3, 4, 2, -3, 5, 6, GRAY);
cube(3, 4, 2, 3, 5, 6, GRAY);
cube(-2, 4, 3, 2, 4, 5, GRAY);
// Chains draped on bike (Ghost Rider's chain)
line(-3, 8, 5, -6, 6, 9, IRON);
line(-6, 6, 9, -7, 5, 11, IRON);
line(3, 9, 6, 5, 8, 10, IRON);
// Rear light
block(0, 6, 10, NEON_RED);
block(-1, 6, 10, RED); block(1, 6, 10, RED);

// ---------- GHOST RIDER ----------
// Legs (on pegs, bent knees)
cube(-4, 5, 0, -3, 8, 1, BLACK);   // left lower leg
cube(3, 5, 0, 4, 8, 1, BLACK);     // right lower leg
cube(-4, 8, 1, -3, 9, 5, BLACK);   // left thigh
cube(3, 8, 1, 4, 9, 5, BLACK);     // right thigh
block(-4, 4, -1, GRAY); block(4, 4, -1, GRAY); // boots on pegs
cube(-4, 4, 0, -3, 4, 1, GRAY); cube(3, 4, 0, 4, 4, 1, GRAY);
block(-4, 5, 1, IRON); block(4, 5, 1, IRON); // boot buckles
// Torso (leather jacket, leaning forward)
cube(-3, 10, 4, 3, 15, 7, BLACK);
cube(-3, 15, 3, 3, 17, 6, BLACK);
cube(-2, 17, 3, 2, 18, 5, BLACK);
// Jacket details: zipper, studs, spikes on shoulders
line(0, 10, 3, 0, 17, 2, GRAY);
for (let y = 11; y <= 16; y += 2) { block(-3, y, 3, IRON); block(3, y, 3, IRON); }
cube(-4, 17, 3, -4, 18, 5, IRON); cube(4, 17, 3, 4, 18, 5, IRON); // shoulder pads
block(-4, 19, 4, IRON); block(4, 19, 4, IRON);
block(-5, 18, 4, IRON); block(5, 18, 4, IRON);
// Chest flame accent
block(-1, 13, 3, ORANGE); block(1, 13, 3, ORANGE); block(0, 12, 3, RED);
// Belt
cube(-3, 10, 3, 3, 10, 3, GRAY); block(0, 10, 3, GOLD);
// Arms reaching forward to handlebars
line(-4, 17, 4, -5, 14, 0, BLACK); line(-5, 14, 0, -5, 12, -2, BLACK);
line(4, 17, 4, 5, 14, 0, BLACK);   line(5, 14, 0, 5, 12, -2, BLACK);
line(-3, 17, 4, -4, 14, 0, BLACK); line(-4, 14, 0, -4, 12, -2, BLACK);
line(3, 17, 4, 4, 14, 0, BLACK);   line(4, 14, 0, 4, 12, -2, BLACK);
// Gloves (gripping bars)
cube(-6, 11, -3, -5, 12, -2, GRAY); cube(5, 11, -3, 6, 12, -2, GRAY);
block(-5, 13, -2, IRON); block(5, 13, -2, IRON); // glove studs
// Neck (bone)
cube(-1, 19, 4, 1, 19, 5, WHITE);
// Skull head (faces -Z)
cube(-2, 20, 3, 2, 24, 6, WHITE);
cube(-3, 21, 4, 3, 23, 5, WHITE);
cube(-2, 20, 2, 2, 23, 2, WHITE);   // face plate
cube(-1, 25, 3, 1, 25, 5, WHITE);   // crown
cube(-1, 20, 7, 1, 23, 7, WHITE);   // back of skull
// Jaw
cube(-2, 19, 2, 2, 19, 4, WHITE);
cube(-1, 18, 2, 1, 18, 3, WHITE);
// Teeth line
for (let x = -2; x <= 2; x++) block(x, 19, 1, x % 2 === 0 ? WHITE : BLACK);
// Nose hole
block(0, 21, 1, BLACK);
cube(0, 20, 2, 0, 21, 2, BLACK);
// Eye sockets (deep) with fire glow
cube(-2, 22, 1, -1, 23, 2, BLACK); cube(1, 22, 1, 2, 23, 2, BLACK);
block(-1, 22, 2, NEON_RED); block(1, 22, 2, NEON_RED);
block(-2, 23, 2, LAVA); block(2, 23, 2, LAVA);
// Cheek shading
block(-3, 20, 3, LIGHT_GRAY); block(3, 20, 3, LIGHT_GRAY);
block(-3, 24, 4, LIGHT_GRAY); block(3, 24, 4, LIGHT_GRAY);

// ---------- FLAMES ----------
// Skull fire: solid LAVA/ORANGE core rising off the skull, FIRE effects on top.
cube(-2, 26, 3, 2, 26, 6, LAVA);
cube(-1, 27, 4, 1, 27, 6, ORANGE);
cube(-2, 27, 5, -2, 28, 7, LAVA); cube(2, 27, 5, 2, 28, 7, LAVA);
cube(-1, 28, 5, 1, 29, 7, ORANGE);
block(0, 30, 6, YELLOW); block(-1, 29, 8, YELLOW); block(1, 30, 7, YELLOW);
cube(0, 26, 7, 0, 27, 9, ORANGE); // streaming back
block(1, 27, 9, RED); block(-1, 26, 9, RED);
block(0, 31, 7, LAVA);
// FIRE effect cells around the skull (kept small in count)
block(0, 26, 4, FIRE); block(-2, 26, 5, FIRE); block(2, 26, 5, FIRE);
block(0, 28, 6, FIRE); block(-1, 29, 7, FIRE); block(1, 29, 8, FIRE);
block(0, 27, 10, FIRE); block(0, 25, 8, FIRE);

// Flaming wheels — lava ring around each tire + FIRE at top/back
ringZ(-2, 3, -9, 4, ORANGE); ringZ(2, 3, -9, 4, ORANGE);
ringZ(-2, 3, 6, 5, ORANGE); ringZ(2, 3, 6, 5, ORANGE);
// upper halves of wheel rings go LAVA for glow
for (const [cz, r] of [[-9, 4], [6, 5]]) {
  for (let dz = -r; dz <= r; dz++) {
    const dy = Math.round(Math.sqrt(Math.max(0, r * r - dz * dz)));
    if (dy > r * 0.5) { block(-2, 3 + dy, cz + dz, LAVA); block(2, 3 + dy, cz + dz, LAVA); }
  }
}
// Fire cells near wheels
block(0, 8, -9, FIRE); block(0, 7, -12, FIRE); block(-2, 8, -8, FIRE); block(2, 8, -8, FIRE);
block(0, 9, 6, FIRE); block(-2, 9, 7, FIRE); block(2, 9, 7, FIRE); block(0, 8, 11, FIRE);
// Flame trail behind (solid, tapering to the south)
function trail(z, w, h, id) { cube(-w, 0, z, w, h, z, id); }
trail(11, 3, 3, LAVA); trail(12, 3, 4, ORANGE); trail(13, 2, 3, LAVA);
trail(14, 3, 2, ORANGE); trail(15, 2, 3, RED); trail(16, 2, 2, ORANGE);
trail(17, 1, 2, RED); trail(18, 1, 1, LAVA); trail(19, 1, 1, RED); trail(20, 0, 1, ORANGE);
block(-4, 1, 12, RED); block(4, 1, 13, RED); block(-3, 2, 15, ORANGE); block(3, 4, 14, ORANGE);
block(0, 5, 12, YELLOW); block(-1, 5, 14, LAVA); block(1, 4, 16, ORANGE);
block(0, 4, 13, FIRE); block(-2, 3, 16, FIRE); block(2, 3, 17, FIRE); block(0, 2, 19, FIRE);
// Exhaust fire
block(-5, 4, 15, FIRE); block(5, 4, 15, FIRE);
block(-5, 3, 16, LAVA); block(5, 3, 16, LAVA);

// ---------- ENVIRONMENT ----------
// Hell-scorched roadside: cracked earth with lava veins
for (let i = 0; i < 40; i++) {
  const x = Math.round(Math.sin(i * 7.3) * 14);
  const z = Math.round(Math.cos(i * 4.1) * 16);
  if (Math.abs(x) < 6) continue;
  block(x, -1, z, i % 3 === 0 ? LAVA : OBSIDIAN);
  if (i % 4 === 0) block(x + 1, -1, z, OBSIDIAN);
}
// Dead trees flanking the road (burnt)
function deadTree(x, z, h) {
  cube(x, 0, z, x, h, z, OBSIDIAN);
  line(x, h - 2, z, x + 2, h + 1, z + 1, BLACK);
  line(x, h - 3, z, x - 2, h, z - 1, BLACK);
  line(x, h, z, x + 1, h + 3, z - 1, BLACK);
  block(x, h + 1, z, BLACK);
  block(x + 1, -1, z, FIRE);
}
deadTree(-10, -8, 8); deadTree(11, -12, 7); deadTree(-12, 8, 9); deadTree(12, 6, 6);
// Tombstone cluster + graveyard fence on the east side
for (let i = 0; i < 5; i++) {
  const x = 8 + (i % 3) * 2, z = -3 + Math.floor(i / 3) * 3 + i;
  cube(x, 0, z, x, 2, z, STONE);
  block(x, 3, z, COBBLE);
  block(x, 2, z - 1, GRAY);
}
line(7, 1, -6, 7, 1, 5, IRON);
for (let z = -6; z <= 5; z += 2) cube(7, 0, z, 7, 2, z, IRON);
// Broken sign post west
cube(-9, 0, -3, -9, 5, -3, OAK_LOG);
cube(-11, 4, -3, -8, 5, -3, PLANKS);
block(-10, 6, -3, OAK_LOG);
// Distant road glow: a couple of lanterns
block(-9, 6, -3, FIRE);
// Hell-portal crack in the road ahead (foreground, north)
cube(-1, -1, -16, 1, -1, -14, LAVA);
block(-2, -1, -15, LAVA); block(2, -1, -14, LAVA);
block(0, -2, -15, LAVA);
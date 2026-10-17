// bonfire-night-fable — prompt:
// a Bonfire Night bonfire with fireworks...

// Bonfire Night: big bonfire on cleared ground, Guy on top, fireworks bursting in the sky,
// rockets on launch racks, crowd of onlookers, sparklers, fence + benches. Front faces -Z.

// ---- ground clearing: flatten and remove trees near the bonfire ----
cube(-14, 0, -14, 14, 9, 14, AIR);
disk(0, -1, 0, 13, DIRT);
disk(0, -1, 0, 7, COBBLE);         // scorched ring
disk(0, -1, 0, 5, BLACK);          // ash circle

// ---- the bonfire: stacked log teepee ----
function logRing(y, r, id) {
  for (let a = 0; a < Math.PI * 2; a += 0.35) {
    const x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r);
    block(x, y, z, id);
  }
}
// leaning logs from base to apex
for (let a = 0; a < Math.PI * 2; a += Math.PI / 7) {
  const x = Math.round(Math.cos(a) * 5), z = Math.round(Math.sin(a) * 5);
  line(x, 0, z, Math.round(Math.cos(a) * 0.5), 9, Math.round(Math.sin(a) * 0.5), OAK_LOG);
}
for (let a = 0.3; a < Math.PI * 2; a += Math.PI / 5) {
  const x = Math.round(Math.cos(a) * 4), z = Math.round(Math.sin(a) * 4);
  line(x, 0, z, 0, 8, 0, PLANKS);
}
// pallet / crate pile around base
cube(-5, 0, -5, 5, 1, 5, PLANKS);
cube(-4, 0, -4, 4, 1, 4, OAK_LOG);
hollowCube(-3, 2, -3, 3, 3, 3, OAK_LOG);
cube(-2, 2, -2, 2, 5, 2, BROWN);
// burning core: glowing lava + orange/yellow flames rising inside the teepee
cube(-2, 1, -2, 2, 1, 2, LAVA);
cube(-1, 2, -1, 1, 6, 1, LAVA);
for (let y = 2; y <= 8; y++) {
  const r = 3.2 - y * 0.25;
  for (let a = 0; a < Math.PI * 2; a += 0.5) {
    const x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r);
    if ((x + z + y) % 3 === 0) block(x, y, z, ORANGE);
    else if ((x * 3 + z + y) % 5 === 0) block(x, y, z, YELLOW);
  }
}
// tongues of fire licking out between the logs (effects, sparing)
const fireCells = [[0,9,0],[1,10,0],[-1,10,1],[0,10,-1],[2,6,-3],[-3,6,2],[3,5,2],[-2,5,-3],[0,7,-3],[-3,7,-1],[3,8,0],[0,8,3],[1,11,1],[-1,12,0],[0,12,-1]];
for (const [x,y,z] of fireCells) block(x, y, z, FIRE);
// embers (lava specks) in the base
block(4, 1, -4, LAVA); block(-4, 1, 3, LAVA); block(3, 2, 4, LAVA); block(-4, 2, -2, LAVA);

// ---- the Guy effigy on top (pole + straw figure) ----
line(0, 9, 0, 0, 16, 0, OAK_LOG);
// body
cube(-1, 12, -1, 1, 14, 1, BROWN);
block(-1, 12, 0, YELLOW); block(1, 13, 0, YELLOW); block(0, 14, -1, YELLOW);
// legs dangling
block(-1, 11, 0, BROWN); block(1, 11, 0, BROWN);
block(-1, 10, 0, BLACK); block(1, 10, 0, BLACK);
// arms outstretched
line(-2, 14, 0, -4, 15, 0, BROWN); line(2, 14, 0, 4, 15, 0, BROWN);
block(-4, 15, 0, YELLOW); block(4, 15, 0, YELLOW);
// head + hat
cube(-1, 15, -1, 1, 16, 1, SAND);
block(0, 16, -2, BLACK); block(0, 15, -2, BLACK);  // face shadow toward camera
block(-1, 15, -2, NEON_RED); block(1, 15, -2, NEON_RED); // glowing eyes toward -Z
cube(-2, 17, -2, 2, 17, 2, BLACK);
cube(-1, 18, -1, 1, 19, 1, BLACK);
block(0, 20, 0, RED);

// ---- smoke column rising from the apex ----
for (let y = 13; y <= 26; y++) {
  const r = 1 + (y - 13) * 0.22;
  const dx = Math.round(Math.sin(y * 0.7) * 1.5) + 2;
  const dz = Math.round(Math.cos(y * 0.5) * 1.2) + 3;
  for (let a = 0; a < Math.PI * 2; a += 0.9) {
    const x = Math.round(dx + Math.cos(a + y) * r), z = Math.round(dz + Math.sin(a + y) * r);
    if (Math.abs(x) <= 1 && Math.abs(z) <= 1 && y < 21) continue;
    block(x, y, z, (y + x) % 2 ? GRAY : LIGHT_GRAY);
  }
}

// ---- fireworks bursts in the sky ----
function burst(cx, cy, cz, r, idA, idB, spokes) {
  block(cx, cy, cz, GLOWSTONE);
  for (let i = 0; i < spokes; i++) {
    const t = i * 2.399963;            // golden angle spread
    const ph = Math.acos(1 - 2 * (i + 0.5) / spokes);
    const dx = Math.sin(ph) * Math.cos(t), dy = Math.cos(ph), dz = Math.sin(ph) * Math.sin(t);
    for (let d = 1; d <= r; d++) {
      const x = Math.round(cx + dx * d), y = Math.round(cy + dy * d), z = Math.round(cz + dz * d);
      if (y > 33 || Math.abs(x) > 22 || Math.abs(z) > 22) break;
      block(x, y, z, d >= r - 1 ? idB : idA);
    }
  }
}
// big red/gold chrysanthemum west-high
burst(-11, 27, -2, 6, RED, GOLD, 36);
// blue/white peony east-high
burst(12, 28, 4, 5, BLUE, WHITE, 30);
// smaller green/lime burst behind
burst(2, 25, 11, 4, GREEN, LIME, 22);
// pink/magenta burst low-front-left
burst(-16, 20, -9, 4, MAGENTA, PINK, 22);
// cyan/light_blue burst right-front
burst(16, 21, -6, 3, CYAN, LIGHT_BLUE, 18);
// purple willow drooping tails
burst(-5, 31, 8, 3, PURPLE, WHITE, 18);
for (let i = 0; i < 6; i++) {
  const x = -8 + i * 1.3, z = 5 + i * 1;
  for (let y = 0; y < 5; y++) block(Math.round(x), 30 - y - i, Math.round(z), i % 2 ? PURPLE : WHITE);
}
// bright cores on the big bursts
block(-11, 27, -2, GLOWSTONE); block(12, 28, 4, GLOWSTONE);
block(-10, 27, -2, GLOWSTONE); block(12, 27, 4, GLOWSTONE);
// sparks drifting
const sparkSpots = [[-14,22,0],[-9,22,-5],[14,24,8],[10,23,0],[4,29,10],[-2,22,12],[18,19,-3],[-18,17,-9],[-7,33,9],[-13,31,-3]];
for (const [x,y,z] of sparkSpots) block(x, y, z, YELLOW);
// electric crackles at a couple of burst centres
block(12, 29, 4, ELECTRIC); block(-11, 28, -2, ELECTRIC); block(-16, 21, -9, ELECTRIC);

// ---- rocket trails arcing up from the launch rack ----
function trail(x0, z0, x1, y1, z1, n) {
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
    const y = 1 + (y1 - 1) * t * t;
    if (i % 2 === 0) block(Math.round(x), Math.round(y), Math.round(z), i === n ? GLOWSTONE : (i % 4 ? YELLOW : ORANGE));
  }
}
trail(-15, -8, -16, 19, -9, 14);
trail(-15, -8, -11, 26, -2, 18);
trail(16, -8, 16, 20, -6, 14);
trail(16, -8, 12, 27, 4, 18);

// ---- launch racks west and east (sand-bagged crates with rocket tubes) ----
function rack(x, z) {
  cube(x - 2, 0, z - 1, x + 2, 0, z + 1, PLANKS);
  cube(x - 2, 1, z - 1, x + 2, 1, z + 1, SAND);
  hollowCube(x - 2, 1, z - 1, x + 2, 2, z + 1, OAK_LOG);
  for (let i = -1; i <= 1; i++) {
    line(x + i, 2, z, x + i, 4, z, IRON);
    block(x + i, 5, z, i === 0 ? RED : BLUE);
  }
  // little fuse flame on one tube
  block(x, 6, z, FIRE);
  // warning rope posts
  block(x - 3, 0, z - 2, OAK_LOG); block(x + 3, 0, z - 2, OAK_LOG);
  line(x - 3, 1, z - 2, x + 3, 1, z - 2, YELLOW);
}
rack(-15, -8);
rack(16, -8);

// ---- safety fence around the fire (rope on posts) ----
for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
  const x = Math.round(Math.cos(a) * 9), z = Math.round(Math.sin(a) * 9);
  line(x, 0, z, x, 1, z, OAK_LOG);
  const x2 = Math.round(Math.cos(a + Math.PI / 10) * 9), z2 = Math.round(Math.sin(a + Math.PI / 10) * 9);
  line(x, 2, z, x2, 2, z2, WHITE);
}

// ---- crowd of onlookers around the north side (front), facing the fire ----
function person(x, z, coat, hat, facingZ) {
  cube(x, 0, z, x, 1, z, BLACK);                  // legs
  cube(x, 2, z, x, 3, z, coat);                   // coat
  block(x - 1, 2, z, coat); block(x + 1, 2, z, coat); // arms
  block(x, 4, z, SAND);                           // head
  block(x, 5, z, hat);                            // hat / hood
  block(x, 4, z + facingZ, hat);                  // hat brim towards fire
}
const coats = [RED, BLUE, GREEN, PURPLE, BROWN, LIGHT_GRAY, ORANGE, CYAN, PINK, GRAY];
const hats = [BLACK, GRAY, WHITE, BROWN, BLUE, RED];
let k = 0;
for (let x = -13; x <= 13; x += 3) {
  person(x, -11, coats[k % coats.length], hats[k % hats.length], 1); k++;
}
for (let x = -11; x <= 11; x += 4) {
  person(x, -14, coats[(k + 3) % coats.length], hats[(k + 2) % hats.length], 1); k++;
}
// side watchers
person(-12, -2, YELLOW, BLACK, 0); person(-12, 4, BLUE, GRAY, 0);
person(12, -1, GREEN, WHITE, 0); person(12, 5, RED, BROWN, 0);
// kids with sparklers (little figures + a glowing tip)
function kid(x, z) {
  block(x, 0, z, BLACK); block(x, 1, z, RED); block(x, 2, z, SAND); block(x, 3, z, BLUE);
  block(x + 1, 2, z, IRON); block(x + 2, 3, z, GLOWSTONE);
}
kid(-6, -12); kid(2, -12); kid(8, -13); kid(-2, -15);
block(-3, 3, -12, ELECTRIC); block(10, 3, -13, ELECTRIC);

// ---- benches, a food stall, lanterns ----
function bench(x, z) {
  cube(x - 2, 0, z, x + 2, 0, z, OAK_LOG);
  cube(x - 2, 1, z, x + 2, 1, z, PLANKS);
}
bench(-8, -17); bench(0, -17); bench(8, -17);
// toffee-apple / hot-dog stall at back-west
cube(-20, 0, 2, -16, 0, 6, PLANKS);
cube(-20, 1, 2, -20, 3, 6, PLANKS);
cube(-16, 1, 2, -16, 3, 6, PLANKS);
cube(-20, 4, 1, -16, 4, 7, RED);
cube(-20, 5, 1, -16, 5, 7, WHITE);
cube(-19, 1, 1, -17, 2, 1, BRICK);   // counter facing north
block(-18, 3, 0, GLOWSTONE);          // stall lamp
block(-19, 3, 1, RED); block(-17, 3, 1, ORANGE); // apples
// lantern posts
function lantern(x, z) {
  line(x, 0, z, x, 4, z, IRON);
  block(x, 5, z, GLOWSTONE);
  hollowCube(x - 1, 5, z - 1, x + 1, 5, z + 1, GLASS);
}
lantern(-12, -17); lantern(12, -17); lantern(-20, -14); lantern(20, -14);
lantern(-19, 9); lantern(19, 10);

// ---- scattered crates, barrels, cones in the clearing ----
cube(-9, 0, 10, -8, 1, 11, PLANKS); block(-9, 2, 10, OAK_LOG);
cube(9, 0, 10, 10, 1, 11, PLANKS);
cylinder(11, 0, 13, 1, 2, BROWN); cylinder(-11, 0, 13, 1, 2, BROWN);
for (const [x, z] of [[-10, -6], [10, -6], [-7, -9], [7, -9]]) {
  block(x, 0, z, ORANGE); block(x, 1, z, WHITE); block(x, 2, z, ORANGE);
}

// ---- warm glow lighting the ground around the fire ----
for (let a = 0; a < Math.PI * 2; a += 0.6) {
  block(Math.round(Math.cos(a) * 6), 0, Math.round(Math.sin(a) * 6), ORANGE);
}
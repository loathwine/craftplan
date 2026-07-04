// creeper-4x-fable — prompt:
// a Minecraft creeper...

function h(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

// mottled creeper hide: mostly leaf-green with lighter green, white and gray specks
function skin(x, y, z) {
  const r = h(x, y, z);
  if (r < 0.80) return LEAVES;
  if (r < 0.92) return GRASS;
  if (r < 0.97) return SNOW;
  return STONE;
}

function solidSkin(x1, y1, z1, x2, y2, z2) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++) block(x, y, z, skin(x, y, z));
}

function shellSkin(x1, y1, z1, x2, y2, z2) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++)
        if (x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2)
          block(x, y, z, skin(x, y, z));
}

const FACE = [
  "........",
  "........",
  ".XX..XX.",
  ".XX..XX.",
  "...XX...",
  "..XXXX..",
  "..XXXX..",
  "..X..X.."
];

// full-size creeper, classic 1 block = 1 texel proportions, facing south (+Z)
function creeper(bx, bz) {
  // four feet, sunk 1 into ground so they never float
  solidSkin(bx,     -1, bz + 2, bx + 3, 5, bz + 5); // front-left
  solidSkin(bx + 4, -1, bz + 2, bx + 7, 5, bz + 5); // front-right
  solidSkin(bx,     -1, bz - 6, bx + 3, 5, bz - 3); // back-left
  solidSkin(bx + 4, -1, bz - 6, bx + 7, 5, bz - 3); // back-right
  // body 8x12x4
  shellSkin(bx, 6, bz - 2, bx + 7, 17, bz + 1);
  // head 8x8x8
  shellSkin(bx, 18, bz - 4, bx + 7, 25, bz + 3);
  // recessed dark face on the south side
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (FACE[r][c] === 'X') {
        block(bx + c, 25 - r, bz + 3, AIR);
        block(bx + c, 25 - r, bz + 2, STONE);
      }
}

// baby creeper: stubby legs, small body, oversized head
function babyCreeper(bx, bz) {
  solidSkin(bx,     -1, bz + 2, bx + 1, 1, bz + 3);
  solidSkin(bx + 2, -1, bz + 2, bx + 3, 1, bz + 3);
  solidSkin(bx,     -1, bz - 3, bx + 1, 1, bz - 2);
  solidSkin(bx + 2, -1, bz - 3, bx + 3, 1, bz - 2);
  solidSkin(bx, 2, bz - 1, bx + 3, 7, bz + 1);
  shellSkin(bx - 1, 8, bz - 3, bx + 4, 13, bz + 2);
  const px = [
    [bx, 12], [bx, 11], [bx + 3, 12], [bx + 3, 11],      // eyes
    [bx + 1, 10], [bx + 2, 10], [bx + 1, 9], [bx + 2, 9], // mouth
    [bx + 1, 8], [bx + 2, 8]                              // frown
  ];
  for (const [x, y] of px) {
    block(x, y, bz + 2, AIR);
    block(x, y, bz + 1, STONE);
  }
}

// ---- clear trees only where structures go ----
cube(-13, 0, -9, 0, 14, 8, AIR);      // main creeper
cube(9, 0, -17, 22, 14, -1, AIR);     // background creeper
cube(-20, 0, -17, -11, 14, -7, AIR);  // baby creeper
cube(10, 0, 0, 22, 14, 17, AIR);      // house + well yard
cube(1, 0, 1, 13, 10, 13, AIR);       // crater airspace
cube(-4, 0, 8, 7, 6, 13, AIR);        // fence + TNT strip
cube(-2, 1, 13, 1, 7, 16, AIR);       // dead tree bubble

// ---- broken fence line (ends abruptly at the blast) ----
cube(-3, 1, 13, 6, 1, 13, PLANKS);
for (const fx of [-3, 0, 3, 6]) {
  block(fx, 0, 13, OAK_LOG);
  block(fx, 1, 13, OAK_LOG);
}
block(5, -1, 15, PLANKS);
block(8, -1, 15, PLANKS);
block(9, -1, 14, OAK_LOG);

// ---- explosion crater with scorched bowl, ember bits, raised rim ----
const CCX = 7, CCZ = 7;
for (let dx = -6; dx <= 6; dx++)
  for (let dz = -6; dz <= 6; dz++) {
    const r2 = dx * dx + dz * dz;
    const x = CCX + dx, z = CCZ + dz;
    if (r2 <= 36) {
      const fy = -1 - Math.round(Math.sqrt(36 - r2) * 0.65);
      cube(x, fy + 1, z, x, 8, z, AIR);
      const r = h(x, 0, z);
      block(x, fy, z, r < 0.42 ? STONE : r < 0.72 ? COBBLE : r < 0.85 ? DIRT : r < 0.94 ? BRICK : PLANKS);
    } else if (r2 <= 54) {
      const r = h(x, 3, z);
      if (r < 0.7) {
        block(x, -1, z, r < 0.3 ? COBBLE : r < 0.5 ? STONE : r < 0.62 ? DIRT : PLANKS);
        if (r < 0.22) block(x, 0, z, COBBLE);
      }
    }
  }

// ---- the creepers ----
creeper(-10, 0);        // hero creeper, front and center-west
creeper(11, -9);        // second creeper stalking in from the north
babyCreeper(-17, -12);  // baby trailing behind in the west

// ---- TNT crate left by the crater ----
cube(-3, 0, 10, -1, 0, 12, BRICK);
cube(-3, 1, 10, -1, 1, 12, SNOW);
cube(-3, 2, 10, -1, 2, 12, BRICK);

// ---- half-destroyed oak house east of the crater ----
const HX1 = 12, HX2 = 20, HZ1 = 2, HZ2 = 10;
cube(HX1, -1, HZ1, HX2, -1, HZ2, COBBLE);   // foundation
cube(HX1, 0, HZ1, HX2, 0, HZ2, PLANKS);     // floor
for (const [cx, cz] of [[HX1, HZ1], [HX1, HZ2], [HX2, HZ1], [HX2, HZ2]])
  cube(cx, 1, cz, cx, 5, cz, OAK_LOG);
cube(HX1 + 1, 1, HZ1, HX2 - 1, 5, HZ1, PLANKS); // north wall
cube(HX1 + 1, 1, HZ2, HX2 - 1, 5, HZ2, PLANKS); // south wall
cube(HX1, 1, HZ1 + 1, HX1, 5, HZ2 - 1, PLANKS); // west wall (gets blasted)
cube(HX2, 1, HZ1 + 1, HX2, 5, HZ2 - 1, PLANKS); // east wall
cube(16, 1, HZ2, 16, 2, HZ2, AIR);              // south door
cube(13, 2, HZ2, 14, 3, HZ2, GLASS);
cube(18, 2, HZ2, 19, 3, HZ2, GLASS);
cube(HX2, 2, 4, HX2, 3, 5, GLASS);
cube(HX2, 2, 7, HX2, 3, 8, GLASS);
cube(15, 2, HZ1, 17, 3, HZ1, GLASS);
for (let i = 0; i <= 4; i++) {                  // gable ends
  cube(HX1, 6 + i, HZ1 + i, HX1, 6 + i, HZ2 - i, PLANKS);
  cube(HX2, 6 + i, HZ1 + i, HX2, 6 + i, HZ2 - i, PLANKS);
}
for (let i = 0; i <= 3; i++) {                  // stepped roof with overhang
  cube(HX1 - 1, 6 + i, HZ1 - 1 + i, HX2 + 1, 6 + i, HZ1 - 1 + i, PLANKS);
  cube(HX1 - 1, 6 + i, HZ2 + 1 - i, HX2 + 1, 6 + i, HZ2 + 1 - i, PLANKS);
}
cube(HX1 - 1, 10, 5, HX2 + 1, 10, 7, OAK_LOG);  // ridge cap
cube(19, 1, 8, 19, 12, 8, COBBLE);              // chimney
block(19, 1, 3, PLANKS);                        // crafting table
block(18, 1, 3, BRICK);                         // furnace

// blast damage: west wall blown open toward the crater
sphere(12, 3, 6, 4, AIR);
sphere(13, 9, 4, 2, AIR);
for (let y = 0; y <= 8; y++)
  for (let z = HZ1; z <= HZ2; z++) {
    const d = Math.sqrt((y - 3) * (y - 3) + (z - 6) * (z - 6));
    if (d > 3.4 && d <= 5 && h(12, y, z) < 0.55)
      block(12, y, z, h(12, y + 9, z) < 0.5 ? COBBLE : STONE);
  }
for (let x = 13; x <= 16; x++)
  for (let z = 4; z <= 8; z++)
    if (h(x, 20, z) < 0.3) block(x, 0, z, COBBLE); // charred floor

// debris thrown into the yard south of the house
for (let x = 13; x <= 19; x++)
  for (let z = 12; z <= 16; z++) {
    const r = h(x, 7, z);
    if (r < 0.22) block(x, -1, z, r < 0.08 ? BRICK : r < 0.15 ? PLANKS : COBBLE);
  }

// cobble path from the door to the well
cube(16, -2, 11, 16, -1, 16, COBBLE);

// ---- stone well ----
cube(15, -1, 14, 17, 1, 16, COBBLE);
cube(16, -6, 15, 16, 1, 15, AIR);
block(16, -6, 15, GLASS);
block(16, -5, 15, GLASS);
cube(15, 2, 15, 15, 3, 15, OAK_LOG);
cube(17, 2, 15, 17, 3, 15, OAK_LOG);
cube(14, 4, 14, 18, 4, 16, PLANKS);

// ---- scorched stumps and a dead tree near the blast ----
block(2, 0, 2, OAK_LOG); block(2, 1, 2, OAK_LOG); block(2, 2, 2, COBBLE);
block(13, 0, 16, OAK_LOG); block(13, 1, 16, COBBLE);
cube(-1, 0, 14, -1, 4, 14, OAK_LOG);
block(-1, 5, 14, COBBLE);
block(0, 4, 14, OAK_LOG);
block(0, 5, 14, COBBLE);
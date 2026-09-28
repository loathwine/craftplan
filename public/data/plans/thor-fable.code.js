// thor-fable — prompt:
// Thor summoning lightning...

// Thor summoning lightning — facing NORTH (-Z), hammer raised in the east hand
// ---------- helpers ----------
function bolt(pts, a, b) {
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i], q = pts[i + 1];
    line(p[0], p[1], p[2], q[0], q[1], q[2], i % 2 === 0 ? a : b);
    block(p[0], p[1], p[2], ELECTRIC);
  }
  const l = pts[pts.length - 1];
  block(l[0], l[1], l[2], ELECTRIC);
}
function pillar(cx, cz, h, broken) {
  hollowCylinder(cx, -1, cz, 2, h, STONE);
  cube(cx - 2, -1, cz - 2, cx + 2, 0, cz + 2, COBBLE); // plinth
  for (let y = h - 3; y < h; y++) { // ragged top
    block(cx + 2, y, cz, AIR); block(cx - 1, y + 1, cz - 2, AIR);
    block(cx, y + 1, cz + 2, AIR);
  }
  if (broken) {
    cube(cx + 3, 0, cz - 1, cx + 8, 1, cz + 1, STONE); // fallen drum
    block(cx + 9, 0, cz, COBBLE);
  }
}

// ---------- clear trees / site ----------
cube(-13, 1, -13, 13, 9, 13, AIR);

// ---------- ground: cracked rocky summit ----------
disk(0, -2, 0, 8, STONE);
disk(0, -1, 0, 12, STONE);
disk(0, 0, 0, 11, COBBLE);
disk(0, 0, 0, 5, STONE);
disk(0, 0, 1, 3, OBSIDIAN);
// glowing cracks radiating from Thor's feet
[[-9,-8],[10,-9],[-11,4],[11,5],[-4,-11],[5,-11],[-7,9],[8,8]].forEach(([x, z]) => {
  line(0, 0, 1, x, 0, z, NEON_BLUE);
  block(x, 1, z, ELECTRIC);
});
// scattered rubble
[[-6,-9],[7,-10],[-10,-2],[9,-3],[-9,7],[3,-8],[-2,-10]].forEach(([x, z]) => {
  block(x, 1, z, COBBLE); block(x + 1, 1, z, STONE);
});

// ---------- ruined pillars ----------
pillar(-10, -6, 9, false);
pillar(10, -6, 8, false);
pillar(-11, 6, 6, true);
pillar(11, 6, 10, false);
block(-10, 9, -6, ELECTRIC); block(11, 10, 6, ELECTRIC);
block(-4, 2, 7, FIRE); block(-2, 2, 7, FIRE); // burning fallen drum
block(10, 8, -6, FIRE);

// ---------- THOR ----------
// boots
cube(-4, 1, -1, -2, 3, 2, BLACK);
cube(1, 1, -1, 3, 3, 2, BLACK);
block(-3, 3, -2, IRON); block(2, 3, -2, IRON);       // boot caps
// legs
cube(-4, 4, 0, -2, 7, 2, BLACK);
cube(1, 4, 0, 3, 7, 2, BLACK);
cube(-4, 6, -1, -2, 6, -1, IRON); cube(1, 6, -1, 3, 6, -1, IRON); // knee plates
// belt
cube(-5, 8, -1, 4, 8, 3, GOLD);
block(-1, 8, -2, IRON); block(0, 8, -2, IRON);       // buckle
// torso
cube(-5, 9, -1, 4, 14, 3, IRON);
cube(-5, 9, -2, 4, 14, -2, LIGHT_GRAY);              // chest plate
for (const x of [-5, -2, 1, 4]) line(x, 9, -2, x, 14, -2, BLACK);
for (const y of [9, 12]) line(-5, y, -2, 4, y, -2, BLACK);
// the six discs
[[-4,10],[-1,10],[2,10],[-4,13],[-1,13],[2,13]].forEach(([x, y]) => {
  block(x, y, -3, IRON); block(x + 1, y, -3, IRON);
});
// pauldrons
cube(-8, 14, -1, -6, 15, 3, LIGHT_GRAY);
cube(5, 14, -1, 7, 15, 3, LIGHT_GRAY);
cube(-9, 15, 0, -9, 15, 2, IRON); cube(8, 15, 0, 8, 15, 2, IRON);
// left arm (west) hanging, fist clenched
cube(-8, 10, 0, -6, 13, 2, IRON);
cube(-8, 7, 0, -6, 9, 2, SAND);
block(-7, 6, 0, SAND);
// right arm (east) raised to the sky
cube(6, 16, 0, 8, 19, 2, IRON);          // upper arm (sleeve)
cube(6, 20, 0, 8, 22, 2, SAND);          // bare forearm
cube(6, 23, 0, 8, 24, 2, SAND);          // fist
cube(6, 23, -1, 8, 24, -1, SAND);
// Mjolnir
line(7, 20, 1, 7, 26, 1, BROWN);         // leather-wrapped handle
block(7, 20, 1, GOLD);                   // pommel
cube(4, 27, -1, 10, 29, 3, IRON);        // head
hollowCube(4, 27, -1, 10, 29, 3, GRAY);  // edges
cube(5, 28, -2, 9, 28, -2, LIGHT_GRAY);  // front ornament band
block(7, 28, -2, NEON_BLUE);
cube(4, 28, 0, 4, 28, 2, GOLD); cube(10, 28, 0, 10, 28, 2, GOLD); // gilded ends
// head
cube(-2, 16, -1, 2, 19, 3, SAND);
cube(-2, 16, -2, 2, 16, -2, YELLOW);     // beard
cube(-1, 15, -1, 1, 15, 2, YELLOW);
block(-1, 18, -2, NEON_BLUE); block(1, 18, -2, NEON_BLUE); // lightning eyes
block(0, 17, -2, SAND);
// hair (long, blond, flowing back)
cube(-3, 16, 0, 3, 20, 4, YELLOW);
cube(-2, 16, -1, 2, 19, 3, SAND);        // re-carve face volume
cube(-3, 13, 3, 3, 15, 5, YELLOW);       // hair on shoulders/back
cube(-2, 20, -1, 2, 20, 3, YELLOW);
// winged helmet
cube(-3, 21, -1, 3, 21, 3, IRON);
cube(-2, 22, 0, 2, 22, 2, IRON);
line(-3, 21, -2, 3, 21, -2, GOLD);       // brow band
// wings
cube(-5, 21, 0, -4, 22, 2, WHITE); cube(-6, 23, 0, -5, 24, 1, WHITE); block(-7, 25, 0, WHITE);
cube(4, 21, 0, 5, 22, 2, WHITE);   cube(5, 23, 0, 6, 24, 1, WHITE);   block(7, 25, 0, WHITE);

// cape (red, billowing to the south/back)
cube(-6, 6, 4, 5, 15, 4, RED);
cube(-8, 3, 5, 7, 9, 5, RED);
cube(-9, 1, 6, 8, 5, 6, RED);
cube(-10, 1, 7, -6, 3, 7, RED); cube(5, 1, 7, 9, 3, 7, RED);
cube(-4, 14, 4, 3, 16, 5, RED);          // collar
line(-7, 15, 3, 6, 15, 3, GOLD);         // clasp band

// ---------- LIGHTNING ----------
block(7, 30, 1, ELECTRIC); block(7, 31, 1, ELECTRIC);
bolt([[7,33,1],[9,32,0],[6,31,2],[7,30,1]], WHITE, NEON_BLUE);
bolt([[-19,33,-8],[-13,32,-4],[-7,31,-1],[0,31,1],[5,30,1]], WHITE, NEON_BLUE);
bolt([[21,33,-6],[16,32,-3],[12,31,0],[9,30,1]], NEON_BLUE, WHITE);
bolt([[-6,33,10],[-2,32,6],[3,31,3],[6,30,2]], WHITE, NEON_BLUE);
bolt([[10,28,2],[14,21,4],[12,13,-2],[10,9,-6]], WHITE, NEON_BLUE);   // strikes east pillar
bolt([[4,28,0],[-2,23,-4],[-8,16,-6],[-10,10,-6]], NEON_BLUE, WHITE); // strikes west pillar
bolt([[9,29,3],[13,24,6],[11,15,7],[11,11,6]], WHITE, NEON_BLUE);     // strikes southeast pillar
// sparks around the hammer
[[3,30,-2],[12,29,3],[7,32,-2],[11,31,4],[2,28,3]].forEach(([x,y,z]) => block(x, y, z, ELECTRIC));

// ---------- storm clouds ----------
cube(-22, 32, -8, -9, 32, 11, GRAY);
cube(-20, 31, -5, -11, 31, 8, BLACK);
cube(-22, 33, -3, -12, 33, 6, LIGHT_GRAY);
cube(9, 32, -8, 22, 32, 11, GRAY);
cube(11, 31, -5, 20, 31, 8, BLACK);
cube(12, 33, -3, 22, 33, 6, LIGHT_GRAY);
cube(-8, 33, -8, 8, 33, -6, GRAY);
cube(-8, 33, 9, 8, 33, 11, GRAY);
[[-16,30,2],[15,30,1],[-18,30,-3],[18,30,6]].forEach(([x,y,z]) => block(x, y, z, ELECTRIC));
// batman-4x-fable — prompt:
// Batman...

const S = STONE, C = COBBLE;

// --- clear trees inside the build zone ---
cube(-11, 0, -9, 11, 11, 10, AIR);

// --- gothic rooftop tower (Batman's perch) ---
// perimeter walls y-3..5
cube(-8, -3, -6, 8, 5, -6, S);
cube(-8, -3, 8, 8, 5, 8, S);
cube(-8, -3, -5, -8, 5, 7, S);
cube(8, -3, -5, 8, 5, 7, S);
// corner pillars
[[-8,-6],[8,-6],[-8,8],[8,8]].forEach(function(p){ cube(p[0], -3, p[1], p[0], 6, p[1], C); });
// cornice ring (1-block overhang) at y5
cube(-9, 5, -7, 9, 5, -7, C);
cube(-9, 5, 9, 9, 5, 9, C);
cube(-9, 5, -7, -9, 5, 9, C);
cube(9, 5, -7, 9, 5, 9, C);
// roof slab
cube(-8, 6, -6, 8, 6, 8, S);
// crenellations
for (let x = -8; x <= 8; x += 2) { block(x, 7, -6, C); block(x, 7, 8, C); }
for (let z = -4; z <= 6; z += 2) { block(-8, 7, z, C); block(8, 7, z, C); }
// lit windows (warm yellow for night renders)
cube(-6, 1, -6, -5, 3, -6, SAND);
cube(4, 1, -6, 5, 3, -6, SAND);
cube(-8, 1, -2, -8, 3, -1, SAND);
cube(-8, 1, 3, -8, 3, 4, SAND);
cube(8, 1, -2, 8, 3, -1, SAND);
cube(8, 1, 3, 8, 3, 4, SAND);
// front door with cobble arch
cube(-2, 0, -6, -2, 4, -6, C);
cube(2, 0, -6, 2, 4, -6, C);
cube(-2, 4, -6, 2, 4, -6, C);
cube(-1, 0, -6, 1, 3, -6, PLANKS);
// gargoyles perched on front corners
block(-9, 6, -7, C); block(-10, 6, -7, C); block(-10, 7, -8, C); block(-9, 7, -8, C);
block(9, 6, -7, C); block(10, 6, -7, C); block(10, 7, -8, C); block(9, 7, -8, C);
// roof access box, back-left
cube(-7, 7, 6, -4, 10, 8, C);
cube(-6, 8, 6, -5, 9, 6, PLANKS);
// antenna with red beacon
cube(-6, 11, 7, -6, 16, 7, OAK_LOG);
block(-6, 17, 7, BRICK);
// brick chimney, front-left
cube(-6, 7, -4, -5, 9, -3, BRICK);
cube(-6, 10, -4, -5, 10, -3, C);

// --- Batman (facing -Z), feet on roof at y7, ~26 tall ---
// boots (toes forward)
cube(-3, 7, -2, -1, 8, 1, C);
cube(1, 7, -2, 3, 8, 1, C);
// legs
cube(-3, 9, -1, -1, 15, 1, S);
cube(1, 9, -1, 3, 15, 1, S);
// trunks + utility belt
cube(-3, 16, -1, 3, 16, 1, C);
cube(-3, 17, -1, 3, 17, 1, SAND);
block(0, 17, -2, SAND);
// torso, tapering out to the chest
cube(-3, 18, -1, 3, 20, 1, S);
cube(-4, 21, -1, 4, 25, 1, S);
// chest emblem: yellow oval + bat
cube(-3, 21, -2, 3, 23, -2, SAND);
cube(-2, 22, -2, 2, 22, -2, C);
block(0, 23, -2, C);
block(0, 21, -2, C);
// shoulders + cape mantle over them
cube(-6, 25, -1, 6, 26, 1, S);
cube(-6, 26, 1, 6, 26, 2, C);
// left arm hanging, gloved fist
cube(-6, 19, -1, -5, 24, 0, S);
cube(-6, 17, -1, -5, 18, 0, C);
// right arm raised, holding a batarang
cube(5, 23, -1, 8, 24, 0, S);
cube(7, 25, -1, 8, 26, 0, S);
cube(7, 27, -1, 8, 29, 0, C);
cube(5, 30, -1, 10, 30, -1, C);
block(5, 31, -1, C);
block(10, 31, -1, C);
// cowled head
cube(-2, 27, -1, 2, 31, 1, C);
cube(-1, 27, -2, 1, 28, -2, PLANKS);   // exposed jaw
cube(-2, 29, -2, 2, 31, -2, C);        // cowl face plate
block(-2, 27, -2, C); block(2, 27, -2, C);
block(-2, 28, -2, C); block(2, 28, -2, C);
block(-1, 29, -2, SNOW);               // white eye slits
block(1, 29, -2, SNOW);
// ears
cube(-2, 32, 0, -2, 33, 0, C);
cube(2, 32, 0, 2, 33, 0, C);

// --- cape: widens and drapes back as it falls, scalloped hem ---
for (let y = 25; y >= 7; y--) {
  const t = (25 - y) / 18;
  const hw = Math.round(5 + 3 * t);
  const zc = 2 + Math.min(2, Math.floor((25 - y) / 7));
  if (y > 7) {
    cube(-hw, y, zc, hw, y, zc + 1, C);
  } else {
    for (let x = -hw; x <= hw; x++) {
      if (((x % 4) + 4) % 4 !== 2) { block(x, y, zc, C); block(x, y, zc + 1, C); }
    }
  }
}

// --- bat-signal searchlight on front-right roof, beaming at the moon ---
cylinder(6, 7, -4, 1, 2, S);
block(6, 9, -4, GLASS);
block(7, 9, -3, GLASS);
line(7, 10, -2, 14, 26, 13, SNOW);
line(6, 10, -2, 13, 26, 13, SNOW);
line(7, 11, -2, 14, 27, 13, SNOW);

// --- full moon behind, plus a flight of bats ---
sphere(14, 27, 15, 5, SNOW);
function bat(x, y, z) { block(x, y, z, C); block(x - 1, y + 1, z, C); block(x + 1, y + 1, z, C); }
bat(11, 20, 4);
bat(16, 23, 9);
bat(10, 26, 12);
bat(17, 30, 13);
bat(13, 18, 2);
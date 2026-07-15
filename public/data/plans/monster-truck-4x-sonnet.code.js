// monster-truck-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
function wheel(cx, cz) {
  const r = 4, cy = 4;
  sphere(cx, cy, cz, r, COBBLE);
  sphere(cx, cy, cz, 2, STONE);
  block(cx, cy, cz, BRICK);
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const dx = Math.round((r + 1) * Math.cos(ang));
    const dy = Math.round((r + 1) * Math.sin(ang));
    for (const dz of [-3, 0, 3]) {
      block(cx + dx, cy + dy, cz + dz, COBBLE);
    }
  }
}

function fender(xSign, zc) {
  const x1 = xSign > 0 ? 6 : -10;
  const x2 = xSign > 0 ? 10 : -6;
  cube(x1, 8, zc - 3, x2, 9, zc + 3, BRICK);
}

function mudflap(xSign, z) {
  const x1 = xSign > 0 ? 9 : -11;
  const x2 = xSign > 0 ? 11 : -9;
  cube(x1, 3, z, x2, 6, z, COBBLE);
}

wheel(-10, -6);
wheel(10, -6);
wheel(-10, 6);
wheel(10, 6);

fender(1, -6);
fender(-1, -6);
fender(1, 6);
fender(-1, 6);

mudflap(1, 9);
mudflap(-1, 9);
mudflap(1, -9);
mudflap(-1, -9);

cube(-9, 7, -3, -7, 7, 3, STONE);
cube(7, 7, -3, 9, 7, 3, STONE);

line(-10, 4, -6, 10, 4, -6, STONE);
line(-10, 4, 6, 10, 4, 6, STONE);

cube(-6, 9, -8, 6, 12, 8, BRICK);

cube(-6, 9, -11, 6, 11, -8, BRICK);

cube(-7, 8, -12, 7, 9, -11, STONE);
cube(-6, 10, -12, -5, 10, -12, GLASS);
cube(5, 10, -12, 6, 10, -12, GLASS);
cube(-4, 9, -12, 4, 10, -12, COBBLE);

block(-6, 10, -11, SAND);
block(-6, 11, -10, SAND);
block(-6, 10, -9, SAND);
block(6, 10, -11, SAND);
block(6, 11, -10, SAND);
block(6, 10, -9, SAND);
cube(-5, 11, -11, -3, 11, -10, SAND);
cube(3, 11, -11, 5, 11, -10, SAND);

cube(-7, 8, 9, 7, 9, 10, STONE);
cube(-2, 10, 8, 2, 10, 8, SNOW);

cube(-5, 12, -3, 5, 16, 5, BRICK);
cube(-4, 13, -3, 4, 15, -3, GLASS);
cube(-5, 13, -1, -5, 15, 3, GLASS);
cube(5, 13, -1, 5, 15, 3, GLASS);
cube(-4, 13, 5, 4, 15, 5, GLASS);
cube(-5, 17, -3, 5, 17, 5, BRICK);

block(-6, 15, -2, STONE);
block(6, 15, -2, STONE);

line(-5, 17, -3, -5, 20, -3, STONE);
line(5, 17, -3, 5, 20, -3, STONE);
line(-5, 20, -3, 5, 20, -3, STONE);
line(-5, 17, 5, -5, 20, 5, STONE);
line(5, 17, 5, 5, 20, 5, STONE);
line(-5, 20, 5, 5, 20, 5, STONE);
line(-5, 20, -3, -5, 20, 5, STONE);
line(5, 20, -3, 5, 20, 5, STONE);

cylinder(-4, 12, 6, 1, 7, STONE);
cylinder(4, 12, 6, 1, 7, STONE);
block(-4, 19, 6, BRICK);
block(4, 19, 6, BRICK);

line(-5, 17, 8, -5, 20, 8, STONE);
line(5, 17, 8, 5, 20, 8, STONE);
cube(-6, 20, 7, 6, 21, 9, BRICK);

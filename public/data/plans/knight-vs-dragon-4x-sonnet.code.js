// knight-vs-dragon-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
function wingFan(sx, sy, sz, x1, y1, z1, x2, y2, z2, id, steps) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ex = Math.round(x1 + (x2 - x1) * t);
    const ey = Math.round(y1 + (y2 - y1) * t);
    const ez = Math.round(z1 + (z2 - z1) * t);
    line(sx, sy, sz, ex, ey, ez, id);
  }
}

function fireCone(x0, y0, z0, x1, y1, z1, maxR, idCore, idEmber, steps) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cx = x0 + (x1 - x0) * t;
    const cy = y0 + (y1 - y0) * t;
    const cz = z0 + (z1 - z0) * t;
    const r = 0.6 + maxR * t;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (dx * dx + dz * dz <= r * r && ((Math.round(dx) + Math.round(dz) + i) % 2 === 0)) {
          const id = (i % 3 === 0) ? idEmber : idCore;
          block(Math.round(cx + dx), Math.round(cy), Math.round(cz + dz), id);
        }
      }
    }
  }
}

// ===================== KNIGHT (west side, lunging east toward the dragon) =====================

// legs
cube(-17, 0, 1, -15, 1, 3, COBBLE);   // back boot
cube(-17, 1, 1, -16, 3, 2, STONE);    // back shin
cube(-17, 3, 1, -16, 4, 2, STONE);    // back thigh

cube(-14, 0, -2, -12, 1, 0, COBBLE);  // front boot (stepping forward)
cube(-14, 1, -2, -13, 3, -1, STONE);  // front shin
cube(-14, 3, -1, -13, 4, 0, STONE);   // front thigh

// hips / belt
cube(-17, 4, -1, -12, 5, 2, STONE);
cube(-17, 5, -1, -12, 5, 2, BRICK);

// torso
cube(-17, 6, -1, -12, 9, 1, COBBLE);
cube(-15, 7, -1, -14, 8, -1, BRICK); // chest emblem, north-facing

// shoulders
cube(-18, 9, -1, -11, 10, 1, STONE);

// shield arm + shield (facing the dragon / camera side)
cube(-13, 7, -1, -12, 9, 0, STONE);
cube(-12, 6, -2, -11, 8, -1, STONE);
cube(-12, 3, -4, -10, 9, -3, BRICK);
hollowCube(-12, 3, -4, -10, 9, -3, STONE);
sphere(-11, 6, -4, 1, STONE);

// sword arm, raised overhead swinging toward dragon
cube(-14, 9, -2, -13, 11, -1, STONE);
cube(-13, 11, -3, -12, 13, -2, STONE);
cube(-12, 13, -4, -10, 13, -3, COBBLE);
line(-11, 13, -4, -4, 17, -2, ICE);
line(-11, 14, -4, -4, 18, -2, ICE);

// helmet
cube(-16, 10, -2, -13, 12, 1, STONE);
line(-16, 11, -2, -13, 11, -2, AIR);
cube(-15, 12, 0, -14, 14, 1, BRICK);

// cape trailing behind
cube(-19, 7, 2, -17, 9, 3, BRICK);
cube(-19, 5, 3, -18, 7, 5, BRICK);
cube(-19, 3, 4, -18, 5, 6, BRICK);

// belt straps / boot detail
line(-14, 0, -2, -14, 0, 0, STONE);
line(-17, 0, 1, -17, 0, 3, STONE);

// ===================== DRAGON (east side, reared up, breathing fire at the knight) =====================

// hind legs
cube(6, 0, -2, 8, 4, 0, LEAVES);
cube(5, 0, -3, 9, 1, 0, LEAVES);
line(5, 0, -4, 5, 0, -3, STONE);
line(7, 0, -4, 7, 0, -3, STONE);
line(9, 0, -4, 9, 0, -3, STONE);

cube(12, 0, -2, 14, 4, 0, LEAVES);
cube(11, 0, -3, 15, 1, 0, LEAVES);
line(11, 0, -4, 11, 0, -3, STONE);
line(13, 0, -4, 13, 0, -3, STONE);
line(15, 0, -4, 15, 0, -3, STONE);

// hips
cube(6, 4, -2, 14, 6, 0, LEAVES);

// tail sweeping back and out
cube(14, 3, 0, 17, 5, 3, LEAVES);
cube(16, 2, 3, 19, 4, 5, LEAVES);
cube(18, 1, 5, 21, 3, 7, LEAVES);
cube(20, 1, 7, 22, 2, 9, LEAVES);
cube(22, 2, 9, 22, 3, 9, STONE);
for (let i = 0; i < 6; i++) {
  const x = 15 + i * 1.3;
  const y = 5 - i * 0.5;
  const z = i * 1.5;
  block(Math.round(x), Math.round(y) + 1, Math.round(z), STONE);
}

// torso, reared up and tilted forward toward the knight
cube(5, 6, -3, 14, 10, 1, LEAVES);
cube(4, 10, -3, 12, 13, 0, LEAVES);
cube(5, 6, -3, 14, 6, 1, SAND);

// neck
cube(1, 11, -3, 4, 14, -1, LEAVES);
cube(-2, 9, -3, 1, 12, -1, LEAVES);

// spine spikes along back / neck / tail
for (let i = 0; i < 10; i++) {
  const x = 12 - i;
  const y = 13 - i * 0.3;
  block(x, Math.round(y) + 1, -1, STONE);
}

// head
cube(-6, 10, -3, -2, 13, 0, LEAVES); // skull
cube(-6, 7, -3, -2, 8, 0, LEAVES);   // lower jaw (gap at y=9 = open mouth)
line(-6, 10, -3, -6, 10, 0, STONE);  // upper teeth
line(-6, 8, -3, -6, 8, 0, STONE);    // lower teeth
line(-4, 13, -3, -3, 16, -3, STONE); // horn
line(-4, 13, 0, -3, 16, 0, STONE);   // horn
block(-5, 11, -3, BRICK);           // eye
block(-5, 11, 0, BRICK);            // eye

// forelimbs reaching toward the knight
cube(2, 7, -2, 4, 9, 0, LEAVES);
cube(0, 6, -2, 2, 7, 0, LEAVES);
block(-1, 6, -2, STONE);
block(-1, 6, -1, STONE);
block(-1, 6, 0, STONE);

// wings, fanned struts + membrane
line(11, 13, 0, 11, 26, 10, STONE);
line(11, 13, 0, 15, 20, 7, STONE);
wingFan(11, 13, 0, 11, 26, 10, 15, 20, 7, COBBLE, 10);

line(11, 13, 0, 11, 26, -10, STONE);
line(11, 13, 0, 15, 20, -7, STONE);
wingFan(11, 13, 0, 11, 26, -10, 15, 20, -7, COBBLE, 10);

block(11, 26, 10, STONE);
block(11, 26, -10, STONE);
block(15, 20, 7, STONE);
block(15, 20, -7, STONE);

// fire breath toward the knight's shield
fireCone(-6, 9, -1, -10, 6, -2, 3, BRICK, SAND, 12);

// scorched ground under the fire path
cube(-10, -1, -3, -6, -1, 1, SAND);
block(-9, -1, -2, DIRT);
block(-8, -1, 0, DIRT);

// battlefield rubble / scale reference
sphere(18, 1, -6, 1, COBBLE);
sphere(-19, 1, 6, 1, COBBLE);
sphere(16, 1, 8, 2, COBBLE);
cube(-20, 0, -5, -19, 2, -4, OAK_LOG);
```

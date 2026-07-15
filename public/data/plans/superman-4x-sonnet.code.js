// superman-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Superman — hero landing stance, chest out, fist raised, cape streaming =====

// Clear a working volume so existing trees/paths don't poke through the statue
cube(-8, -1, -9, 8, 20, 9, AIR);

// ---- Ground: impact/plaza disk with radial cracks ----
disk(0, -1, 0, 6, STONE);
disk(0, -1, 0, 2, COBBLE);
for (let a = 0; a < 8; a++) {
  const ang = (a / 8) * Math.PI * 2;
  const x2 = Math.round(Math.cos(ang) * 6);
  const z2 = Math.round(Math.sin(ang) * 6);
  line(0, -1, 0, x2, -1, z2, COBBLE);
}
// scattered rubble
block(4, -1, 3, STONE); block(-4, -1, 2, STONE); block(3, -1, -3, COBBLE);
block(-3, -1, -4, COBBLE); block(5, -1, -1, STONE); block(-5, -1, 1, STONE);

// ---- Boots ----
cube(-3, 0, -2, -1, 1, 1, BRICK);
cube(1, 0, -2, 3, 1, 1, BRICK);

// ---- Legs (blue tights) ----
cube(-3, 2, -1, -1, 7, 1, GLASS);
cube(1, 2, -1, 3, 7, 1, GLASS);

// ---- Belt ----
cube(-4, 7, -2, 4, 7, 2, SAND);

// ---- Trunks ----
cube(-4, 8, -2, 4, 9, 2, BRICK);

// ---- Torso ----
cube(-4, 9, -2, 4, 14, 2, GLASS);

// ---- Chest emblem (S-shield), popped forward off the chest for relief ----
// yellow diamond backing
block(0, 13, -3, SAND);
cube(-1, 12, -3, 1, 12, -3, SAND);
cube(-1, 11, -3, 1, 11, -3, SAND);
block(0, 10, -3, SAND);
// red S, one step further forward
cube(-1, 13, -4, 1, 13, -4, BRICK);
block(-1, 12, -4, BRICK);
cube(-1, 11, -4, 1, 11, -4, BRICK);
block(1, 10, -4, BRICK);
cube(-1, 9, -4, 1, 9, -4, BRICK);

// ---- Left arm: fist braced on hip ----
cube(-5, 12, -2, -4, 14, 0, GLASS);
cube(-5, 9, -2, -4, 11, 0, GLASS);
cube(-5, 8, -2, -4, 9, -1, PLANKS);

// ---- Right arm: raised fist punching skyward/forward (dynamic silhouette) ----
cube(4, 12, -2, 5, 15, -1, GLASS);
cube(5, 15, -3, 6, 18, -2, GLASS);
cube(5, 18, -4, 6, 19, -3, PLANKS);

// ---- Neck & head ----
cube(-1, 14, -1, 1, 15, 1, PLANKS);
cube(-2, 15, -2, 2, 18, 2, PLANKS);

// hair cap + back hair, leave face front (z=-2) as skin
cube(-2, 18, -2, 2, 18, 2, COBBLE);
cube(-2, 16, 1, 2, 17, 2, COBBLE);
cube(-2, 16, -2, -1, 17, -2, COBBLE); // hairline sides
cube(1, 16, -2, 2, 17, -2, COBBLE);
block(0, 19, -1, COBBLE); // spit curl
block(0, 20, -1, COBBLE);

// face features (popped one step forward for visibility)
block(-1, 16, -3, STONE); // eye
block(1, 16, -3, STONE);  // eye
block(0, 15, -3, STONE);  // mouth line

// ---- Cape: attached at shoulders, billowing back and up in the wind ----
cube(-3, 12, 2, 3, 14, 3, BRICK);
cube(-4, 10, 2, 4, 12, 4, BRICK);
cube(-5, 8, 3, 5, 10, 5, BRICK);
cube(-5, 5, 3, 5, 8, 6, BRICK);
cube(-4, 3, 4, 4, 5, 7, BRICK);
cube(-2, 2, 5, 2, 3, 8, BRICK);
// tattered bottom edge
block(-3, 2, 7, BRICK); block(3, 2, 7, BRICK); block(0, 1, 8, BRICK);
// cape catching light on the east side — a few extra streaming blocks
cube(3, 6, 5, 6, 7, 6, BRICK);
cube(4, 4, 6, 6, 5, 7, BRICK);

// ---- Background skyline (Metropolis), sits behind the figure for depth ----
function tower(cx, cz, w, h, dep) {
  cube(cx - w, 0, cz, cx + w, h, cz + dep, STONE);
  for (let y = 2; y < h - 1; y += 2) {
    for (let x = -w + 1; x <= w - 1; x += 2) {
      block(cx + x, y, cz, GLASS);
    }
  }
}
tower(-13, 15, 2, 10, 3);
tower(-9, 17, 1, 7, 2);
tower(10, 16, 2, 12, 3);
tower(14, 18, 1, 8, 2);
tower(-16, 19, 1, 6, 2);
tower(17, 14, 1, 6, 2);
```

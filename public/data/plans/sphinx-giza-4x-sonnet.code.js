// sphinx-giza-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== THE GREAT SPHINX OF GIZA =====
// Reclining lion body, pharaoh head w/ nemes headdress, facing north (-Z) toward camera.
// Background: three stepped pyramids for depth/silhouette.

function pyramid(cx, baseY, cz, baseSize, layers, id) {
  let size = baseSize;
  let y = baseY;
  for (let i = 0; i < layers; i++) {
    const half = Math.floor(size / 2);
    cube(cx - half, y, cz - half, cx + half, y, cz + half, id);
    size -= 2;
    y += 1;
    if (size < 1) break;
  }
}

// ---------- 1. SANDSTONE PLATFORM ----------
cube(-8, 0, -16, 8, 0, 12, SAND);

// ---------- 2. FRONT PAWS (extended north) ----------
cube(-5, 1, -18, -2, 2, -15, SAND); // left paw
cube(2, 1, -18, 5, 2, -15, SAND);   // right paw
// toe grooves (free)
cube(-3, 1, -18, -3, 2, -15, AIR);
cube(3, 1, -18, 3, 2, -15, AIR);

// ---------- 3. FRONT LEGS ----------
cube(-5, 1, -15, -2, 7, -11, SAND);
cube(2, 1, -15, 5, 7, -11, SAND);
cube(-1, 1, -15, 1, 7, -11, SAND); // chest fill between legs

// ---------- 4. TORSO ----------
cube(-5, 1, -11, 5, 6, 4, SAND);

// ---------- 5. HAUNCHES (wider, rounded rear) ----------
cube(-6, 1, 5, 6, 7, 10, SAND);
hollowCube(-6, 1, 5, 6, 7, 10, SAND); // reinforce rounded silhouette edges (same id, cosmetic pass)

// ---------- 6. TAIL (curls along the right flank) ----------
line(6, 3, 9, 9, 2, 13, SAND);
line(9, 2, 13, 10, 2, 16, SAND);
cube(9, 1, 15, 11, 3, 17, SAND); // tail tuft

// ---------- 7. HEAD ----------
cube(-4, 7, -13, 4, 14, -9, SAND); // face block

// eyes: carved sockets + recessed pupils
block(-2, 11, -13, AIR);
block(2, 11, -13, AIR);
block(-2, 11, -12, STONE);
block(2, 11, -12, STONE);

// missing nose (historically accurate erosion damage)
cube(-1, 9, -13, 1, 10, -13, AIR);

// mouth
cube(-2, 8, -13, 2, 8, -13, AIR);

// ---------- 8. NEMES HEADDRESS ----------
cube(-5, 14, -14, 5, 17, -9, SAND);       // crown top
cube(-6, 3, -13, -5, 13, -10, SAND);      // left lappet
cube(5, 3, -13, 6, 13, -10, SAND);        // right lappet
cube(-4, 8, -9, 4, 13, -8, SAND);         // back drape

// nemes stripe accents (blue bands on gold)
for (let y = 5; y <= 11; y += 2) {
  cube(-6, y, -13, -6, y, -10, ICE);
  cube(6, y, -13, 6, y, -10, ICE);
}
for (let x = -4; x <= 4; x += 2) {
  cube(x, 14, -14, x, 17, -14, ICE);
}

// ---------- 9. UNIQUE DETAILS ----------
// ceremonial pharaoh beard
cube(-1, 3, -14, 1, 6, -13, SAND);
// uraeus (cobra) on brow
line(0, 15, -14, 0, 18, -14, STONE);
block(0, 18, -14, COBBLE);

// ---------- 10. BACKGROUND PYRAMIDS (depth separation) ----------
pyramid(-15, 0, 17, 9, 5, SAND);
pyramid(15, 0, 17, 9, 5, SAND);
pyramid(0, 0, 19, 7, 4, SAND);
// pyramid caps (weathered stone tips)
block(-15, 5, 17, STONE);
block(15, 5, 17, STONE);
block(0, 4, 19, STONE);
```

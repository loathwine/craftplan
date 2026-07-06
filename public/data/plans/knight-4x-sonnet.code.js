// knight-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ============================================================
// KNIGHT ON HORSEBACK
// Horse faces +X (east). Pedestal at y=-1. Hooves at y=0.
// ============================================================

// ---------- Pedestal ----------
cube(-7, -1, -5, 11, -1, 5, STONE);
cube(-7, -1, -5, 11, -1, -5, BRICK);
cube(-7, -1, 5, 11, -1, 5, BRICK);
cube(-7, -1, -5, -7, -1, 5, BRICK);
cube(11, -1, -5, 11, -1, 5, BRICK);

// corner pillars with banner tops
function pillar(px, pz) {
  cube(px, -1, pz, px, 3, pz, OAK_LOG);
  cube(px - 1, 4, pz - 1, px + 1, 4, pz + 1, COBBLE);
  cube(px, 5, pz, px, 6, pz, BRICK);
}
pillar(-6, -4);
pillar(-6, 4);
pillar(10, -4);
pillar(10, 4);

// scattered gravel / rock detail at base
block(-5, 0, -4, COBBLE); block(-4, 0, -5, COBBLE); block(9, 0, -4, COBBLE);
block(8, 0, 5, COBBLE); block(-6, 0, 3, COBBLE); block(6, 0, -5, COBBLE);
// tufts of foreground greenery
block(-6, 0, -3, LEAVES); block(9, 0, 4, LEAVES); block(-5, 0, 4, LEAVES);

// ---------- Horse legs (with knee joint + hoof) ----------
function leg(lx, lz) {
  cube(lx, 0, lz, lx, 2, lz, OAK_LOG);
  cube(lx, 3, lz, lx, 3, lz, DIRT); // knee joint shading
  block(lx, 0, lz, COBBLE); // hoof
}
leg(3, -1); leg(3, 1);   // front legs
leg(-3, -1); leg(-3, 1); // back legs

// ---------- Horse body ----------
cube(-3, 3, -1, 3, 6, 1, OAK_LOG);      // main body
cube(-3, 3, -1, 3, 3, 1, DIRT);         // underbelly shade
cube(-4, 3, -1, -4, 6, 1, OAK_LOG);     // rump haunch bump

// barding (armor plates) on flanks
cube(-2, 5, -1, -1, 5, -1, STONE);
cube(-2, 5, 1, -1, 5, 1, STONE);
cube(1, 5, -1, 2, 5, -1, STONE);
cube(1, 5, 1, 2, 5, 1, STONE);
cube(3, 4, -1, 3, 5, 1, STONE);   // chest plate
cube(-4, 4, -1, -4, 5, 1, STONE); // rear plate

// tail
line(-4, 6, 0, -6, 2, 0, DIRT);
block(-6, 1, 0, DIRT);

// ---------- Neck & head ----------
cube(3, 6, -1, 4, 7, 1, OAK_LOG);   // neck base
cube(4, 7, -1, 5, 8, 1, OAK_LOG);   // neck mid
cube(5, 7, -1, 7, 9, 1, OAK_LOG);   // head
cube(7, 7, 0, 8, 8, 0, OAK_LOG);    // muzzle
block(8, 7, 0, COBBLE);             // nostril tip
block(6, 10, -1, OAK_LOG);          // ears
block(6, 10, 1, OAK_LOG);
block(6, 8, -1, GLASS);             // eyes
block(6, 8, 1, GLASS);

// mane ridge (dark, stepped along the incline)
block(3, 7, 0, COBBLE);
block(4, 8, 0, COBBLE);
block(5, 8, 0, COBBLE);
block(5, 9, 0, COBBLE);
block(6, 9, 0, COBBLE);

// ---------- Saddle ----------
cube(-1, 7, -1, 1, 7, 1, BRICK);
block(1, 8, 0, PLANKS); // saddle horn
line(6, 8, 0, 1, 9, 0, COBBLE); // reins

// ---------- Knight legs draping the horse ----------
cube(0, 5, -1, 0, 7, -1, STONE);
cube(0, 5, 1, 0, 7, 1, STONE);
block(0, 5, -1, COBBLE); // boot
block(0, 5, 1, COBBLE);

// ---------- Knight torso ----------
cube(-1, 8, -1, 1, 10, 1, STONE);
cube(-1, 8, -1, 1, 8, 1, COBBLE); // belt
// chest studs (armor detail)
block(0, 9, -1, COBBLE);
block(0, 9, 1, COBBLE);

// left arm + shield
block(-1, 9, -2, STONE);
cube(-2, 8, -3, -1, 10, -3, PLANKS);
block(-2, 9, -3, BRICK); // emblem
cube(-2, 8, -4, -1, 10, -4, COBBLE); // shield rim behind

// right arm + lance
cube(1, 9, 1, 2, 9, 1, STONE);
line(2, 9, 1, 11, 9, 1, PLANKS);
block(11, 9, 1, STONE); // lance tip
cube(9, 10, 1, 9, 11, 1, BRICK); // pennant

// ---------- Helmet & plume ----------
cube(-1, 11, -1, 1, 12, 1, COBBLE);
block(1, 11, 0, AIR); // visor slit
cube(0, 13, 0, 0, 14, 0, BRICK);
block(0, 15, 0, BRICK);
block(-1, 14, 0, BRICK);
block(1, 14, 0, BRICK);

// ---------- Cape ----------
cube(-2, 7, -1, -1, 10, 1, BRICK);
cube(-3, 6, -1, -2, 8, 1, COBBLE); // fur trim, lower drape
```

Built a fully armored knight on horseback: horse with jointed legs, barded flanks, mane ridge, and tail; knight with torso armor, shield, forward-thrust lance with pennant, plumed helmet, and a draping cape — all raised on a brick-bordered stone pedestal flanked by four corner pillars.

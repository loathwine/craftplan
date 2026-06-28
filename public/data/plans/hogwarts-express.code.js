// hogwarts-express — prompt:
// The Hogwarts Express, the scarlet steam locomotive from Harry Potter, on a stone viaduct bridge. SHAPE: a classic steam train engine - a long red BRICK cylindrical boiler body, a black COBBLE smokesta...

// ===== Hogwarts Express on a stone viaduct over a gorge =====
// ---- level constants (define before use) ----
const GORGE = -8;          // gorge floor
const DECK = 1;            // deck slab top surface (slab at y=0..1)
const RAIL = 2;            // rail / tie level on the deck
const BCY = 8;             // boiler center Y
const BR = 3;              // boiler radius

// ---- helpers (defined before any are called) ----
function circleFilledXY(cx, cy, z, r, id){
  for (let dx=-r; dx<=r; dx++)
    for (let dy=-r; dy<=r; dy++)
      if (dx*dx + dy*dy <= r*r + r*0.5) block(cx+dx, cy+dy, z, id);
}
function tubeXY(cx, cy, z, r, id){            // ring in the X-Y plane
  for (let dx=-r; dx<=r; dx++)
    for (let dy=-r; dy<=r; dy++){
      const d = dx*dx + dy*dy;
      if (d <= r*r + r*0.5 && d >= (r-1)*(r-1)) block(cx+dx, cy+dy, z, id);
    }
}
function boilerZ(cx, cy, z1, z2, r, id){      // solid horizontal cylinder along Z
  for (let z=z1; z<=z2; z++) circleFilledXY(cx, cy, z, r, id);
}
function wheelYZ(x, cy, cz, r){               // train wheel in the Y-Z plane
  for (let dy=-r; dy<=r; dy++)
    for (let dz=-r; dz<=r; dz++){
      const d2 = dy*dy + dz*dz;
      if (d2 <= r*r + r*0.5){
        block(x, cy+dy, cz+dz, (Math.sqrt(d2) >= r-0.5) ? COBBLE : STONE);
      }
    }
  block(x, cy, cz, OAK_LOG);                  // hub
  for (let k=1; k<r; k++){                     // spokes
    block(x, cy+k, cz, COBBLE); block(x, cy-k, cz, COBBLE);
    block(x, cy, cz+k, COBBLE); block(x, cy, cz-k, COBBLE);
    block(x, cy+k, cz+k, COBBLE); block(x, cy-k, cz-k, COBBLE);
    block(x, cy+k, cz-k, COBBLE); block(x, cy-k, cz+k, COBBLE);
  }
}
function carveArch(zc, hw){                    // open a viaduct arch (AIR) through full X
  cube(-9, GORGE, zc-hw, 9, -2, zc+hw, AIR);  // straight legs
  for (let dz=-hw; dz<=hw; dz++)              // semicircular head
    for (let dy=0; dy<=hw; dy++)
      if (dz*dz + dy*dy <= hw*hw + 0.5)
        cube(-9, -2+dy, zc+dz, 9, -2+dy, zc+dz, AIR);
}
function archRing(zc, hw){                     // COBBLE voussoir outline on both faces
  for (const x of [-4, 4]){
    for (let dz=-hw; dz<=hw; dz++)
      for (let dy=0; dy<=hw+1; dy++){
        const d = Math.sqrt(dz*dz + dy*dy);
        if (d <= hw+0.5 && d > hw-0.95) block(x, -2+dy, zc+dz, COBBLE);
      }
    line(x, GORGE, zc-hw, x, -2, zc-hw, COBBLE);
    line(x, GORGE, zc+hw, x, -2, zc+hw, COBBLE);
  }
}
function pine(x, z){
  cube(x, 1, z, x, 5, z, OAK_LOG);
  disk(x, 3, z, 2, LEAVES); disk(x, 4, z, 2, LEAVES);
  disk(x, 5, z, 1, LEAVES); block(x, 6, z, LEAVES);
  block(x, 6, z, SNOW);
}
function lamp(x, z){
  cube(x, RAIL, z, x, RAIL+2, z, OAK_LOG);
  block(x, RAIL+3, z, GLASS); block(x, RAIL+4, z, SNOW);
}

// ---- 1. clear the corridor & dig the gorge ----
cube(-11, 0, -19, 11, 14, 20, AIR);           // remove trees/terrain above ground
cube(-8, GORGE, -19, 8, -1, 20, AIR);         // carve the chasm

// ---- 2. gorge floor: river + boulders + framing cliffs ----
cube(-3, GORGE, -19, 3, GORGE, 20, GLASS);    // river
block(-5, GORGE, -4, COBBLE); block(6, GORGE, 8, COBBLE);
block(-6, GORGE, 14, STONE); block(5, GORGE, -10, STONE);
cube(-11, GORGE, -19, -9, -1, 20, STONE);     // west cliff
cube(9, GORGE, -19, 11, -1, 20, STONE);       // east cliff
cube(-11, 0, -19, -9, 0, 20, GRASS);
cube(9, 0, -19, 11, 0, 20, GRASS);
cube(-9, -1, 2, -9, 0, 5, GLASS);             // little waterfall
pine(-10, -14); pine(-10, 4); pine(-10, 18);
pine(10, -12); pine(10, 6); pine(10, 16);

// ---- 3. viaduct support wall (solid, then carve arches) ----
cube(-4, GORGE, -19, 4, DECK-1, 19, STONE);
for (let y=GORGE; y<=DECK-1; y++){            // two-tone coursing on the visible faces
  const b = (y % 2 === 0) ? COBBLE : STONE;
  cube(-4, y, -19, -4, y, 19, b);
  cube(4, y, -19, 4, y, 19, b);
}
carveArch(-15, 3); carveArch(-6, 3); carveArch(3, 3); carveArch(12, 3);
archRing(-15, 3); archRing(-6, 3); archRing(3, 3); archRing(12, 3);

// ---- 4. deck slab, parapets, rails ----
cube(-5, 0, -20, 5, DECK, 20, STONE);
cube(-5, 0, -20, -5, DECK, 20, COBBLE);
cube(5, 0, -20, 5, DECK, 20, COBBLE);
cube(-5, RAIL, -20, -5, RAIL, 20, COBBLE);    // parapet
cube(5, RAIL, -20, 5, RAIL, 20, COBBLE);
for (let z=-20; z<=20; z+=4){ block(-5, RAIL+1, z, SNOW); block(5, RAIL+1, z, SNOW); }
for (let z=-19; z<=20; z+=2) cube(-3, RAIL, z, 3, RAIL, z, OAK_LOG);   // sleepers
line(-2, RAIL, -19, -2, RAIL, 20, STONE);     // rails
line(2, RAIL, -19, 2, RAIL, 20, STONE);
lamp(-5, -12); lamp(5, -12); lamp(-5, 4); lamp(5, 4); lamp(-5, 16); lamp(5, 16);

// ---- 5. locomotive chassis & boiler ----
cube(-2, RAIL, -15, 2, 4, 6, STONE);          // engine frame
boilerZ(0, BCY, -14, -12, BR, COBBLE);        // smokebox (front)
boilerZ(0, BCY, -11, -1, BR, BRICK);          // red boiler
tubeXY(0, BCY, -9, BR, OAK_LOG);              // boiler bands (trim)
tubeXY(0, BCY, -5, BR, OAK_LOG);
tubeXY(0, BCY, -2, BR, OAK_LOG);
tubeXY(0, BCY, -14, 2, STONE);                // smokebox door rim
block(0, BCY, -14, COBBLE);

// front: buffer beam, buffers, headlight, cowcatcher
cube(-3, 4, -15, 3, 5, -15, OAK_LOG);
block(-2, 5, -16, COBBLE); block(2, 5, -16, COBBLE);
block(0, BCY, -15, SNOW); block(0, BCY+2, -14, SNOW);
cube(-3, RAIL, -15, 3, RAIL+1, -15, COBBLE);
cube(-2, RAIL, -16, 2, RAIL, -16, COBBLE);
cube(-1, RAIL, -17, 1, RAIL, -17, COBBLE);
block(0, RAIL, -18, COBBLE);

// smokestack funnel + domes + whistle
cylinder(0, BCY+BR, -12, 1, 3, COBBLE);
disk(0, BCY+BR+3, -12, 2, COBBLE);
disk(0, BCY+BR+4, -12, 2, STONE);
cylinder(0, BCY+BR, -6, 1, 2, COBBLE); block(0, BCY+BR+2, -6, BRICK);  // steam dome
block(0, BCY+BR, -9, BRICK);                  // sand dome
block(0, BCY+BR, -2, STONE);                  // whistle

// driving wheels + coupling rods
wheelYZ(-3, RAIL+2, -10, 2); wheelYZ(-3, RAIL+2, -6, 2); wheelYZ(-3, RAIL+2, -2, 2);
wheelYZ(3, RAIL+2, -10, 2); wheelYZ(3, RAIL+2, -6, 2); wheelYZ(3, RAIL+2, -2, 2);
line(-3, RAIL+2, -10, -3, RAIL+2, -2, STONE);
line(3, RAIL+2, -10, 3, RAIL+2, -2, STONE);

// ---- 6. cab with glass windows ----
cube(-3, 4, 0, 3, 12, 6, BRICK);
cube(-2, 5, 1, 2, 11, 5, AIR);
cube(-3, 8, 1, -3, 10, 5, GLASS);
cube(3, 8, 1, 3, 10, 5, GLASS);
cube(-2, 8, 6, 2, 10, 6, GLASS);
cube(-4, 12, -1, 4, 13, 7, OAK_LOG);          // cab roof overhang
wheelYZ(-3, RAIL+1, 4, 1); wheelYZ(3, RAIL+1, 4, 1);

// ---- 7. coupling ----
cube(-1, 3, 7, 1, 3, 8, COBBLE);

// ---- 8. passenger carriage ----
cube(-2, RAIL, 9, 2, 4, 18, STONE);           // carriage frame
cube(-3, 4, 9, 3, 9, 18, BRICK);              // body
cube(-2, 5, 10, 2, 8, 17, AIR);               // hollow interior
cube(-3, 6, 9, 3, 6, 18, OAK_LOG);            // lower trim
cube(-3, 9, 9, 3, 9, 18, OAK_LOG);            // upper trim
cube(-4, 10, 8, 4, 11, 19, OAK_LOG);          // roof
for (let z=10; z<=17; z+=2){                  // window row
  cube(-3, 7, z, -3, 8, z+1, GLASS);
  cube(3, 7, z, 3, 8, z+1, GLASS);
}
cube(-2, 7, 18, 2, 8, 18, GLASS);             // rear window
wheelYZ(-3, RAIL+1, 11, 1); wheelYZ(3, RAIL+1, 11, 1);
wheelYZ(-3, RAIL+1, 16, 1); wheelYZ(3, RAIL+1, 16, 1);

// ---- 9. billowing steam (SNOW puffs + GLASS wisps), trailing back over the train ----
sphere(0, BCY+BR+5, -12, 2, SNOW);
sphere(1, BCY+BR+7, -10, 2, GLASS);
sphere(-1, BCY+BR+8, -8, 3, SNOW);
sphere(1, BCY+BR+10, -6, 2, SNOW);
sphere(0, BCY+BR+11, -3, 3, SNOW);
sphere(-1, BCY+BR+12, 0, 2, GLASS);
sphere(1, BCY+BR+13, 3, 3, SNOW);
sphere(0, BCY+BR+14, 6, 2, SNOW);
block(0, BCY+BR+4, -12, SNOW);
block(0, BCY+BR+3, -11, GLASS);
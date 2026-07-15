// viking-longship-4x-opus — prompt:
// a Viking longship...

block(0,0,0,AIR); // no-op anchor

// ============ Viking longship ============
// Length runs along Z. Dragon-head prow faces NORTH (-Z) toward the camera.
// Hull = PLANKS, trim/keel/mast = OAK_LOG, striped sail = BRICK/SNOW.

const HULL = PLANKS, RAIL = OAK_LOG, KEEL = OAK_LOG;

const zBow = -18, zStern = 16;
const zc = (zBow + zStern) / 2;        // -1
const halfLen = (zStern - zBow) / 2;   // 17

const uOf   = z => (z - zc) / halfLen;
const hullHW = z => { const u = uOf(z), s = 1 - u*u; return s <= 0 ? 0 : 4.2*Math.sqrt(s); };
const keelY = z => Math.round(3 * uOf(z)*uOf(z));        // mid 0, ends 3 (rocker)
const gunY  = z => Math.round(5 + 3 * uOf(z)*uOf(z));    // mid 5, ends 8 (sheer)
const widthAtY = (z,y) => { const yk=keelY(z),yg=gunY(z); const f=(y-yk)/Math.max(1,(yg-yk)); return 0.5 + (hullHW(z)-0.5)*f; };

// ---- 0. Clear tree foliage in the ship corridor (AIR is free) ----
cube(-8, 2, -21, 8, 20, 19, AIR);

// ---- 1. Sea surface (single layer of "water") ----
for (let z = -21; z <= 19; z++)
  for (let x = -8; x <= 8; x++)
    block(x, 1, z, GLASS);

// ---- 2. Solid hull, carved hollow ----
for (let z = zBow; z <= zStern; z++) {
  const yk = keelY(z), yg = gunY(z);
  for (let y = yk; y <= yg; y++) {
    const xr = Math.max(0, Math.round(widthAtY(z, y)));
    cube(-xr, y, z, xr, y, z, HULL);
  }
}
// hollow the interior, keeping 2 bottom layers as the deck floor
for (let z = zBow + 1; z <= zStern - 1; z++) {
  const yk = keelY(z), yg = gunY(z);
  for (let y = yk + 2; y <= yg; y++) {
    const inner = Math.round(widthAtY(z, y)) - 1;
    if (inner >= 0) cube(-inner, y, z, inner, y, z, AIR);
  }
}

// ---- 3. Gunwale rail + keel line ----
for (let z = zBow; z <= zStern; z++) {
  const xr = Math.max(0, Math.round(hullHW(z)));
  const yg = gunY(z);
  block(xr, yg, z, RAIL);
  block(-xr, yg, z, RAIL);
  block(0, keelY(z), z, KEEL);
}

// ---- 4. Dragon-head prow (faces -Z / north / the camera) ----
const neck = [[0,6,-14],[0,7,-15],[0,8,-16],[0,9,-17],[0,11,-18],[0,12,-19],[0,13,-20]];
for (const [x,y,z] of neck) sphere(x, y, z, 1, OAK_LOG);
cube(-2, 12, -21, 2, 15, -20, OAK_LOG);   // head block
cube(-1, 14, -22, 1, 14, -21, PLANKS);    // upper jaw
cube(-1, 12, -22, 1, 12, -21, PLANKS);    // lower jaw (mouth gapes open at y=13)
block(0, 13, -22, BRICK);                 // tongue
block(-1, 14, -22, SNOW); block(1, 14, -22, SNOW); // top teeth
block(-1, 12, -22, SNOW); block(1, 12, -22, SNOW); // bottom teeth
block(-1, 15, -21, BRICK); block(1, 15, -21, BRICK); // eyes
block(0, 15, -22, OAK_LOG);               // snout crest
line(-1, 16, -19, -1, 18, -17, OAK_LOG);  // horns
line( 1, 16, -19,  1, 18, -17, OAK_LOG);

// ---- 5. Curled stern tail ----
const tail = [[0,6,14],[0,7,15],[0,9,15],[0,11,15],[0,12,14],[0,12,13],[0,11,12]];
for (const [x,y,z] of tail) sphere(x, y, z, 1, OAK_LOG);
block(0, 11, 11, SNOW);                   // carved tip

// ---- 6. Mast, yard and striped sail ----
cube(-1, 1, -1, 1, 1, 1, OAK_LOG);        // mast partner / step
cube(0, 2, 0, 0, 16, 0, OAK_LOG);         // mast
block(0, 17, 0, BRICK);                   // masthead
cube(-7, 14, -1, 7, 14, 0, OAK_LOG);      // yardarm
for (let x = -6; x <= 6; x++)
  for (let y = 6; y <= 13; y++)
    block(x, y, -1, (Math.floor((x + 6) / 2) % 2 === 0) ? BRICK : SNOW);

// ---- 7. Rigging (gray ropes) ----
line(0, 15, 0, 0, 13, -20, STONE);        // forestay to dragon head
line(0, 15, 0, 0, 12, 15, STONE);         // backstay to tail
line(0, 15, 0, 6, 5, -1, STONE);          // shrouds
line(0, 15, 0, -6, 5, -1, STONE);
line(0, 15, 0, 6, 5, 4, STONE);
line(0, 15, 0, -6, 5, 4, STONE);

// ---- 8. Round shields along both gunwales (alternating colors) ----
const SHIELD = [BRICK, SNOW, GLASS, STONE];
let ci = 0;
for (let z = zBow + 5; z <= zStern - 5; z += 3) {
  const xr = Math.max(1, Math.round(hullHW(z)));
  const sy = gunY(z) - 1;
  for (const side of [-1, 1]) {
    const sx = side * (xr + 1);
    const col = SHIELD[ci % SHIELD.length];
    for (let dy = -1; dy <= 1; dy++)
      for (let dz = -1; dz <= 1; dz++)
        if (dy*dy + dz*dz <= 2) block(sx, sy + dy, z + dz, col);
    block(sx, sy, z, STONE);              // shield boss
    ci++;
  }
}

// ---- 9. Oars raked out to the water (below the shields) ----
for (let z = zBow + 6; z <= zStern - 6; z += 3) {
  const xr = Math.max(1, Math.round(hullHW(z)));
  const yg = gunY(z);
  line( xr, yg - 2, z,  xr + 5, 0, z + 1, OAK_LOG);
  line(-xr, yg - 2, z, -xr - 5, 0, z + 1, OAK_LOG);
}

// ---- 10. Steering oar (steerboard side, east) ----
line(2, 4, 13, 6, -1, 16, OAK_LOG);

// ---- 11. Deck cargo: barrels + crate ----
cylinder(-1, 2, 11, 1, 2, OAK_LOG);
cylinder( 1, 2,  9, 1, 2, OAK_LOG);
cube(-1, 2, -7, 0, 3, -6, PLANKS);

// ---- 12. Bow foam on the water ----
block(0, 1, -16, SNOW); block(-1, 1, -15, SNOW); block(1, 1, -15, SNOW);
block(0, 2, -15, SNOW); block(0, 1, -17, SNOW);
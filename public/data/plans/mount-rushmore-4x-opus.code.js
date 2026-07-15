// mount-rushmore-4x-opus — prompt:
// Mount Rushmore...

block(0,0,0,STONE); // (placeholder; overwritten below if needed)

const hwTable = [2,3,3,4,4,4,4,4,4,4,4,4,4,4,3,3,2]; // dy 0..16 half-widths
const HW0 = 4; // cliff full half-width under each head

const FACE_Z = -2, BACK_Z = 1, NOSE_Z = -4, BROW_Z = -3;

function frac(x){ return x - Math.floor(x); }
function rnd(a,b,c){ return frac(Math.sin(a*12.9898 + b*78.233 + c*37.719) * 43758.5453); }

function buildHead(cx, by, zOff, style){
  const fz = FACE_Z + zOff, bz = BACK_Z + zOff, nz = NOSE_Z + zOff, brz = BROW_Z + zOff;

  // ---- lower cliff / neck: solid rock from ground up to the chin ----
  cube(cx - HW0, -2, fz, cx + HW0, by - 1, bz, STONE);

  // ---- head mass (silhouette by y) ----
  for (let dy = 0; dy < hwTable.length; dy++){
    const hw = hwTable[dy];
    cube(cx - hw, by + dy, fz, cx + hw, by + dy, bz, STONE);
    // granite weathering speckle on the front plane
    for (let x = cx - hw; x <= cx + hw; x++){
      if (rnd(x, by + dy, 7) > 0.86) block(x, by + dy, fz, COBBLE);
    }
  }

  // ---- brow ridge (protrudes 1 forward, casts shadow over the eyes) ----
  cube(cx - 4, by + 10, brz, cx + 4, by + 11, brz, STONE);

  // ---- nose: nostrils wide at bottom, narrowing bridge up to the brow ----
  cube(cx - 1, by + 4, nz,   cx + 1, by + 5, fz - 1, STONE); // nostril block
  block(cx, by + 4, nz, STONE); block(cx, by + 5, nz, STONE); // tip
  cube(cx - 1, by + 6, nz + 1, cx + 1, by + 6, fz - 1, STONE);
  cube(cx,     by + 7, nz + 1, cx,     by + 10, fz - 1, STONE); // bridge
  // dark nostril shadows
  block(cx - 1, by + 4, nz, COBBLE); block(cx + 1, by + 4, nz, COBBLE);

  // ---- eyes: recessed sockets under the brow with a dark iris ----
  for (const ex of [cx - 2, cx + 2]){
    cube(ex - 1, by + 8, fz, ex + 1, by + 9, fz, AIR);       // carve socket
    cube(ex - 1, by + 8, fz + 1, ex + 1, by + 9, fz + 1, COBBLE); // shadow back
    block(ex, by + 8, fz + 1, STONE);                        // eyeball glint
  }

  // ---- mouth ----
  cube(cx - 2, by + 2, fz, cx + 2, by + 2, fz, COBBLE);

  // ---- hair cap ----
  cube(cx - 3, by + 16, fz, cx + 3, by + 17, bz - 1, STONE);
  for (let x = cx - 4; x <= cx + 4; x++){
    for (let dy = 13; dy <= 17; dy++){
      if (rnd(x, dy, 3) > 0.78) block(x, by + dy, fz, COBBLE); // curls
    }
  }

  // ---- per-president touches ----
  if (style === 'wig'){ // Washington: fuller wig, rolled at the sides
    cube(cx - 5, by + 11, fz + 1, cx - 4, by + 15, bz, STONE);
    cube(cx + 4, by + 11, fz + 1, cx + 5, by + 15, bz, STONE);
    for (let dy = 11; dy <= 15; dy++){ block(cx - 5, by + dy, fz + 1, COBBLE); block(cx + 5, by + dy, fz + 1, COBBLE); }
  } else if (style === 'mustache'){ // Roosevelt: mustache + pince-nez glasses
    cube(cx - 2, by + 3, fz, cx + 2, by + 3, fz, COBBLE);
    block(cx - 3, by + 9, fz, COBBLE); block(cx + 3, by + 9, fz, COBBLE);
    block(cx - 3, by + 8, fz, COBBLE); block(cx + 3, by + 8, fz, COBBLE);
    block(cx, by + 8, fz, COBBLE); // bridge of the glasses
  } else if (style === 'beard'){ // Lincoln: chin beard
    cube(cx - 2, by - 3, fz, cx + 2, by - 1, bz, STONE);
    for (let x = cx - 2; x <= cx + 2; x++)
      for (let dy = -3; dy <= 1; dy++)
        if (rnd(x, dy, 9) > 0.55) block(x, by + dy, fz, COBBLE);
    cube(cx - 2, by + 1, fz, cx + 2, by + 1, fz, COBBLE); // upper-lip line
  } else { // Jefferson: neat side hair
    for (let dy = 12; dy <= 15; dy++){ block(cx - 4, by + dy, fz, COBBLE); block(cx + 4, by + dy, fz, COBBLE); }
  }
}

// ===== clear trees from the viewing corridor in front of the monument =====
cube(-22, 1, -22, 22, 32, -6, AIR);

// ===== the four faces (front toward -Z / north) =====
buildHead(-15, 6, -1, 'wig');       // Washington — most forward, best lit
buildHead(-5, 4,  1, 'plain');      // Jefferson
buildHead( 4, 3,  2, 'mustache');   // Roosevelt — recessed, lower
buildHead(14, 5,  1, 'beard');      // Lincoln

// ===== fill the narrow rock gaps between the heads =====
for (const gx of [-10, 9]){
  cube(gx, -2, -1, gx, 21, 2, STONE);
}

// ===== jagged rocky summit above the faces, with snow caps =====
for (let x = -22; x <= 22; x++){
  for (let z = -1; z <= 1; z++){
    let h = 22 + Math.round(1.6 * (Math.sin(x * 0.6) + Math.cos(z * 0.8)) + 1.4 * rnd(x, z, 1));
    if (h < 22) h = 22;
    cube(x, 22, z, x, h, z, STONE);
    block(x, h, z, SNOW);
    if (rnd(x, z, 2) > 0.6) block(x, h - 1, z, SNOW);
  }
}

// ===== side buttress rock, framing the monument =====
for (let x = -22; x <= -20; x++)
  cube(x, -2, -1, x, 15 + Math.round(2 * rnd(x, 0, 4)), 2, STONE);
for (let x = 20; x <= 22; x++)
  cube(x, -2, -1, x, 15 + Math.round(2 * rnd(x, 0, 5)), 2, STONE);

// ===== foreground pines for scale and depth (well off to the sides) =====
function pine(x, z, h){
  cube(x, 0, z, x, h, z, OAK_LOG);
  sphere(x, h, z, 2, LEAVES);
  disk(x, h - 2, z, 2, LEAVES);
}
pine(-20, -4, 5);
pine(-21, 0, 4);
pine(20, -4, 5);
pine(21, 1, 4);

// ===== a little talus/scree of boulders at the cliff foot =====
for (let i = 0; i < 40; i++){
  const x = -18 + Math.floor(rnd(i, 3, 6) * 37);
  const z = -4 + Math.floor(rnd(i, 8, 2) * 3);
  block(x, -2, z, rnd(i, 1, 1) > 0.5 ? STONE : COBBLE);
  if (rnd(i, 2, 2) > 0.6) block(x, -1, z, STONE);
}
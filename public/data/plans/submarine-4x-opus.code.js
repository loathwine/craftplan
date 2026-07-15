// submarine-4x-opus — prompt:
// a submarine...

block(0,0,0,3); // sentinel origin marker will be overwritten
// ============================================================
//  SUBMARINE  — long hull along X (broadside faces the camera),
//  bow to the EAST (+X, catches light), stern + propeller WEST.
//  Red anti-fouling bottom, gray steel hull, conning tower,
//  periscopes, dive planes, propeller, portholes, sitting in the sea.
// ============================================================

const cy = 7;      // hull vertical centre
const cz = 2;      // hull depth centre
const WATER = 2;   // waterline height

// ---- radius profile along the length -----------------------
function radiusAt(x){
  if (x >= -10 && x <= 10) return 5;                 // main body
  if (x > 10){ const t=(x-10)/9; return 5-4*t; }     // pointed bow (east)  ->1
  const t=(-10-x)/9; return 5-3*t;                   // rounded stern (west)->2
}

// ---- clear foliage in the build zone (AIR is free) ---------
cube(-22, 3, -7, 22, 26, 13, AIR);

// ---- the sea (two shallow layers of GLASS + icy ripples) ---
for (let x=-21; x<=21; x++){
  for (let z=-6; z<=11; z++){
    block(x, WATER-1, z, GLASS);
    const ripple = ((x*7 + z*13) % 5 === 0);
    block(x, WATER, z, ripple ? ICE : GLASS);
  }
}

// ---- hull cross-section --------------------------------------
function hullSlice(x, r, shell){
  const R = Math.ceil(r);
  for (let y=-R; y<=R; y++){
    for (let z=-R; z<=R; z++){
      const d = Math.sqrt(y*y + z*z);
      if (d <= r + 0.3){
        if (shell && d < r - 1.35) continue;         // hollow steel shell
        const wy = cy + y;
        const id = wy <= 4 ? BRICK : STONE;           // red bottom / grey top
        block(x, wy, cz + z, id);
      }
    }
  }
}
for (let x=-19; x<=19; x++){
  const r = radiusAt(x);
  hullSlice(x, r, r > 2.4);                           // solid caps at the tips
}

// ---- deck walkway + railing along the crest ----------------
for (let x=-15; x<=17; x++){
  block(x, cy+5, cz,   PLANKS);
  block(x, cy+5, cz-1, PLANKS);
  block(x, cy+5, cz+1, PLANKS);
}
for (let x=-14; x<=16; x+=3){
  block(x, cy+6, cz-1, OAK_LOG);
  block(x, cy+6, cz+1, OAK_LOG);
}

// ---- portholes on the north-facing (camera) side -----------
function northZ(x,y){
  const r = radiusAt(x);
  const dy = y - cy;
  if (Math.abs(dy) >= r) return null;
  return cz - Math.round(Math.sqrt(r*r - dy*dy));
}
for (const x of [-9,-6,-3,0,3,6,9]){
  const z = northZ(x, cy+2);
  if (z !== null){ block(x, cy+2, z, GLASS); block(x, cy+2, z-1, GLASS); }
  const z2 = northZ(x, cy);
  if (z2 !== null){ block(x, cy, z2, GLASS); }
}

// ---- conning tower (sail) ----------------------------------
cube(-2, cy+5, cz-1, 4, cy+10, cz+2, COBBLE);         // main sail block
// rounded/sloped leading edge toward the bow (east)
line(5, cy+6, cz,   6, cy+5, cz, COBBLE);
line(5, cy+7, cz+1, 5, cy+9, cz+1, COBBLE);
block(5, cy+8, cz-1, COBBLE);
block(5, cy+9, cz-1, COBBLE);
// bridge windows on the north face
for (const x of [-1,0,1,3]){
  block(x, cy+8, cz-1, GLASS);
  block(x, cy+9, cz-1, GLASS);
}
// sail-mounted dive planes
cube(-3, cy+8, cz-3, -3, cy+8, cz-2, STONE);
cube(5,  cy+8, cz+3, 5,  cy+8, cz+4, STONE);

// ---- periscopes + antenna rising from the sail -------------
line(1, cy+11, cz, 1, cy+16, cz, STONE);              // periscope 1
block(1, cy+16, cz-1, STONE);                          // periscope head
line(2, cy+11, cz+1, 2, cy+14, cz+1, STONE);          // periscope 2
line(-1, cy+11, cz, -1, cy+18, cz, OAK_LOG);          // radio antenna
block(-1, cy+18, cz-1, ICE);                           // antenna tip

// ---- bow dive planes (fins near the front) -----------------
cube(11, cy, cz-9, 13, cy, cz-6, STONE);              // north fin
cube(11, cy, cz+6, 13, cy, cz+9, STONE);              // south fin

// ---- stern dive planes + rudder ----------------------------
cube(-16, cy, cz-8, -14, cy, cz-6, STONE);            // north stern plane
cube(-16, cy, cz+6, -14, cy, cz+8, STONE);            // south stern plane
cube(-18, cy+2, cz, -15, cy+7, cz, STONE);            // upper rudder fin
cube(-18, cy-3, cz, -15, cy-1, cz, STONE);            // lower rudder fin

// ---- propeller + shaft at the very stern (west) ------------
line(-19, cy, cz, -20, cy, cz, COBBLE);               // shaft
sphere(-20, cy, cz, 1, COBBLE);                        // hub
const bl = 4;
for (const [dy,dz] of [[1,0.4],[-1,-0.4],[0.4,-1],[-0.4,1]]){
  const ey = cy + Math.round(dy*bl);
  const ez = cz + Math.round(dz*bl);
  line(-20, cy, cz, -20, ey, ez, STONE);
  line(-21, cy, cz, -21, ey, ez, STONE);
}

// ---- bow dome + torpedo hatch ------------------------------
sphere(18, cy, cz, 1, STONE);
block(15, cy, northZ(15, cy), GLASS);

// ---- foam: bow wave (east) and churning wake (west) --------
for (let z=-4; z<=8; z++){
  if ((z % 2) === 0) block(20, WATER, cz + (z-cz), ICE);
}
for (const [x,z] of [[-22,0],[-22,3],[-21,-1],[-21,5],[-20,2],[-20,4],[-22,2],[-21,1]]){
  block(x, WATER, z, ICE);
}
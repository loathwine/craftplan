// golden-gate-4x-opus — prompt:
// the Golden Gate Bridge...

const meta = null; // (ignored — this is a build script, not a workflow)

// ---------------------------------------------------------------
// THE GOLDEN GATE BRIDGE
// Spans east-west along X so the camera (north, looking south)
// sees the full iconic broadside: twin orange towers, sweeping
// main cables, vertical suspenders, roadway over the strait.
// ---------------------------------------------------------------

const TOWER = BRICK;   // International Orange
const CABLE = BRICK;
const DECK  = STONE;   // roadway
const CURB  = COBBLE;
const PIER  = COBBLE;
const WATER = GLASS;

const R = Math.round;

// ---- clear the corridor: trees + terrain in the bridge lane ----
cube(-22, 1, -8, 22, 32, 8, AIR);
// scoop the strait a touch below the water line
cube(-22, -3, -7, 22, -1, 7, AIR);

// ---- the strait (one shimmering layer of water) ----
cube(-22, -2, -7, 22, -2, 7, WATER);

// ---------------------------------------------------------------
const DY   = 6;      // roadway deck top-of-slab reference
const DECKTOP = 7;   // walking surface
const zF   = -3;     // front cable / leg plane (nearest camera)
const zB   =  3;     // back cable / leg plane
const TOP  = 30;     // tower height
const towerXs = [-11, 11];

// cable geometry ------------------------------------------------
function mainY(x){ return 11 + 0.157 * x * x; }          // sag between towers
function sideY(x){                                        // tower -> anchor
  const tt = (Math.abs(x) - 11) / 11;                     // 0 at tower, 1 at anchor
  return TOP - 24 * Math.pow(tt, 1.4);
}
function cableY(x){ return Math.abs(x) <= 11 ? mainY(x) : sideY(x); }

// ---------------------------------------------------------------
// TOWERS — two legs (front/back), portal cross-bracing, top caps
// ---------------------------------------------------------------
for (const tx of towerXs){
  // deep pier footings sunk into the water
  cube(tx-2, -3, zF-1, tx+1, -1, -1, PIER);
  cube(tx-2, -3,    1, tx+1, -1, zB+1, PIER);

  // front + back legs (2 wide in X, 2 deep in Z)
  cube(tx-1, -3, zF,   tx, TOP, zF+1, TOWER);
  cube(tx-1, -3, zB-1, tx, TOP, zB,   TOWER);

  // horizontal portal struts tying the legs together
  for (const hy of [DY-1, 13, 19, 25, 29]){
    cube(tx-1, hy, zF, tx, hy+1, zB, TOWER);
  }
  // rounded top cap
  cube(tx-1, TOP, zF, tx, TOP+1, zB, TOWER);
  block(tx-1, TOP+2, zF, TOWER); block(tx, TOP+2, zF, TOWER);
  block(tx-1, TOP+2, zB, TOWER); block(tx, TOP+2, zB, TOWER);
}

// ---------------------------------------------------------------
// MAIN CABLES — front and back sweeping catenaries (2 thick)
// ---------------------------------------------------------------
for (let x = -22; x <= 22; x++){
  const y = R(cableY(x));
  for (const z of [zF, zB]){
    block(x, y,   z, CABLE);
    block(x, y+1, z, CABLE);
  }
}
// anchorages where the side cables dive into the headlands
for (const ax of [-22, 22]){
  cube(ax-1 < -22 ? -22 : ax-1, 4, zF-1, ax, DY, zF+1, PIER);
  cube(ax-1 < -22 ? -22 : ax-1, 4, zB-1, ax, DY, zB+1, PIER);
}

// ---------------------------------------------------------------
// SUSPENDERS — vertical hangers from cable down to the deck
// ---------------------------------------------------------------
for (let x = -20; x <= 20; x += 2){
  if (towerXs.some(tx => Math.abs(x - tx) <= 1)) continue; // skip through towers
  const top = R(cableY(x)) - 1;
  for (const z of [zF, zB]){
    if (top >= DECKTOP + 1) cube(x, DECKTOP + 1, z, x, top, z, CABLE);
  }
}

// ---------------------------------------------------------------
// DECK — roadway slab, stiffening side trusses, curbs, lane line
// ---------------------------------------------------------------
// stiffening truss just under the deck at both cable planes
cube(-22, DY-1, zF, 22, DY-1, zF, TOWER);
cube(-22, DY-1, zB, 22, DY-1, zB, TOWER);
// deck slab
cube(-22, DY, -2, 22, DECKTOP, 2, DECK);
// curbs / railings
cube(-22, DECKTOP+1, -2, 22, DECKTOP+1, -2, CURB);
cube(-22, DECKTOP+1,  2, 22, DECKTOP+1,  2, CURB);
// centre lane markings
for (let x = -21; x <= 21; x += 2) block(x, DECKTOP+1, 0, SNOW);

// ---------------------------------------------------------------
// SCENE DETAIL — a couple of cars on the deck + a boat below
// ---------------------------------------------------------------
function car(x, z, col){
  cube(x, DECKTOP+1, z, x+1, DECKTOP+2, z, col);
}
car(-6, -1, SNOW);
car( 4,  1, BRICK);
car(-16, 1, STONE);
car(14, -1, SNOW);

// little sailboat on the strait
cube(8, -1, -5, 10, -1, -4, PLANKS);   // hull
block(9, 0, -5, PLANKS);               // mast base
cube(9, 1, -5, 9, 4, -5, OAK_LOG);     // mast
cube(9, 2, -5, 9, 4, -4, SNOW);        // sail
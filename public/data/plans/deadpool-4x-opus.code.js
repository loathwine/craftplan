// deadpool-4x-opus — prompt:
// Deadpool...

block(0,0,0,0); // no-op anchor

// ===== Deadpool =====
// Palette: BRICK(10)=red suit, COBBLE(8)=black, STONE(3)=steel, SNOW(12)=white eyes, OAK_LOG(4)=katana handles
const RED=BRICK, BLACK=COBBLE, STEEL=STONE, WHITE=SNOW, HANDLE=OAK_LOG;

// clear the shot: remove foliage/trees in front and inside the figure zone
cube(-12,0,-15, 12,32,-5, AIR);   // front viewing corridor
cube(-10,0,-6, 10,32,4, AIR);     // figure bounding volume

// helper: return [xlo,xhi] for a part on the +X side, mirrored for s=-1
function sx(s, inner, outer){ return s>0 ? [inner,outer] : [-outer,-inner]; }

// ---------------------------------------------------------------
// BOOTS + LEGS
// ---------------------------------------------------------------
for(const s of [1,-1]){
  const [xl,xh]=sx(s,1,4);
  // boot (black), with a forward toe
  cube(xl,0,-4, xh,2,1, BLACK);
  cube(xl,0,-6, xh,1,-5, BLACK);        // toe of the boot
  // red leg
  cube(xl,3,-4, xh,11,1, RED);
  // black knee band
  cube(xl,6,-4, xh,6,1, BLACK);
  // side seam
  cube(s>0?xh:xl,3,-4, s>0?xh:xl,11,1, BLACK);
}

// pelvis / hips (connect legs to torso)
cube(-5,11,-4, 5,13,2, RED);

// belt (black) + steel buckle + hip pouches
cube(-5,11,-4, 5,12,2, BLACK);
cube(-1,11,-5, 1,12,-5, STEEL);        // buckle protruding
for(const s of [1,-1]){
  const [xl,xh]=sx(s,2,4);
  cube(xl,10,-5, xh,12,-5, HANDLE);    // pouch on hip
  cube(xl,10,-4, xh,10,-4, BLACK);
}

// ---------------------------------------------------------------
// TORSO
// ---------------------------------------------------------------
cube(-5,13,-4, 5,22,2, RED);
// slim the waist a touch (carve lower-side corners)
for(const s of [1,-1]){
  const [xl,xh]=sx(s,5,5);
  cube(xl,13,-4, xh,14,-4, RED);
}

// black harness straps crossing the chest (the katana rig), protruding
line(-4,21,-5, 4,14,-5, BLACK);
line( 4,21,-5,-4,14,-5, BLACK);
// small buckle where straps cross
cube(-1,17,-5, 1,18,-5, STEEL);

// ---------------------------------------------------------------
// ARMS + GLOVES
// ---------------------------------------------------------------
for(const s of [1,-1]){
  const [xl,xh]=sx(s,6,8);
  // shoulder pad (black)
  cube(xl,21,-4, xh,22,2, BLACK);
  // red upper arm / forearm
  cube(xl,13,-3, xh,20,1, RED);
  // black glove
  cube(xl,13,-3, xh,16,1, BLACK);
  // clenched fist pushed slightly forward
  cube(xl,12,-4, xh,13,0, BLACK);
}

// ---------------------------------------------------------------
// NECK + HEAD (the mask)
// ---------------------------------------------------------------
cube(-2,22,-3, 2,23,1, BLACK);          // neck
cube(-4,23,-4, 4,30,2, RED);            // head
// round the top-front corners of the mask
for(const s of [1,-1]){
  const [xl,xh]=sx(s,4,4);
  block(xl,30,-4, AIR);
  block(xl,29,-4, RED);
  block(xl,30,-3, AIR);
}
block(-4,30,2,AIR); block(4,30,2,AIR);
block(-4,30,-4,AIR); block(4,30,-4,AIR);

// ---------------------------------------------------------------
// EYES — white almond patches with black rims, protruding from face
// ---------------------------------------------------------------
function eye(s){
  // white almond: per-column vertical spans (rises toward the outer edge)
  const cols = [
    [1,25,27],
    [2,25,28],
    [3,26,29],
    [4,27,29],
  ];
  // black rim: bounding box one bigger, on the face plane
  const xs = cols.map(c=>c[0]);
  const y0 = 24, y1 = 30;
  const [bxl,bxh]=sx(s, Math.min(...xs), Math.max(...xs));
  cube(bxl-0,y0,-5, bxh+0,y1,-5, BLACK);   // rim plane (protruding)
  cube(bxl,   y0,-4, bxh,   y1,-4, BLACK);   // recess behind
  // white columns override the rim interior
  for(const [x,ya,yb] of cols){
    const wx = s>0 ? x : -x;
    cube(wx,ya,-6, wx,yb,-5, WHITE);
  }
}
eye(1);
eye(-1);

// ---------------------------------------------------------------
// KATANAS — crossed on the back, handles poking above the shoulders
// ---------------------------------------------------------------
function katana(s){
  const hx = s>0 ? 6 : -6;      // handle x (above one shoulder)
  const tx = s>0 ? -3 : 3;      // blade tip x (opposite hip)
  // handle (brown) with pommel + guard
  cube(hx,26,3, hx,30,3, HANDLE);
  block(hx,31,3, HANDLE);        // pommel
  cube(hx-0,25,3, hx-0,25,3, STEEL); // guard base
  cube(s>0?hx-1:hx, 25, 3, s>0?hx:hx+1, 25, 3, STEEL); // small guard
  // steel blade diagonally down to the opposite hip
  line(hx,25,3, tx,14,3, STEEL);
}
katana(1);
katana(-1);

// ground shadow / stance pad so the feet read against the terrain
disk(0,-1,0,7,STONE);
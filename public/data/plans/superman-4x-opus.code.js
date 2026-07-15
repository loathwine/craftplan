// superman-4x-opus — prompt:
// Superman...

cube(-13,0,-7, 13,34,6, AIR); // clear forest foliage from the figure's volume

const SUIT=GLASS, RED=BRICK, YEL=SAND, SKIN=PLANKS, HAIR=OAK_LOG, EYE=STONE;

// ======================= CAPE (built first, sits behind) =======================
// Big billowing red cape: flares into raised "wings" at the sides that frame the
// figure and peek out to the viewer in the north. Center panel drapes behind body.
for(let x=-12;x<=12;x++){
  const ax=Math.abs(x);
  let top = ax<=4 ? 24 : Math.min(33, 24 + Math.round((ax-4)*1.7));
  if(x>0) top = Math.min(33, top+1);              // slight asymmetry, taller east wing
  let bot = 2 + Math.round(Math.max(0,ax-3)*0.6) + (x%2===0?1:0); // wavy hem
  for(let z=2; z<=4; z++){
    cube(x,bot,z, x,top,z, RED);
  }
}
// mantle bridging shoulders to the cape sheet
cube(-6,22,1, 6,25,2, RED);
// cape pooling/flowing on the ground behind
cube(-9,2,3, 9,4,6, RED);
// billow curl: lower wing edges swing forward
cube(-12,9,1, -10,13,1, RED);
cube(10,9,1, 12,14,1, RED);

// ======================= LEGS & BOOTS =======================
for(const s of [-1,1]){
  const x1 = s<0 ? -5 : 2;
  const x2 = s<0 ? -2 : 5;
  cube(x1,0,-6, x2,3,0, RED);      // red boot, toe pushed north (front)
  cube(x1,0,-6, x2,1,-6, RED);     // toe cap
  cube(x1,3,-4, x2,12,0, SUIT);    // blue leg
}

// ======================= TRUNKS / BELT =======================
cube(-5,11,-4, 5,14,1, RED);       // red trunks
cube(-5,13,-4, 5,13,1, YEL);       // yellow belt ring
block(-1,13,-4, YEL); block(0,13,-4, YEL); block(1,13,-4, YEL); // buckle plate (front)

// ======================= TORSO =======================
cube(-4,14,-3, 4,16,1, SUIT);      // waist
cube(-6,16,-3, 6,24,1, SUIT);      // broad chest
cube(-5,23,-3, 5,24,1, SUIT);      // upper chest / clavicle
// subtle pec shading with a proud ridge line
line(-4,22,-4, 4,22,-4, SUIT);

// ======================= CHEST EMBLEM (S-shield) =======================
// yellow shield, proud of the chest (z=-4)
cube(-3,18,-4, 3,22,-4, YEL);
line(-2,17,-4, 2,17,-4, YEL);
block(-1,16,-4, YEL); block(0,16,-4, YEL); block(1,16,-4, YEL); // pointed base
// red "S", proud of the shield (z=-5)
line(-2,21,-5, 2,21,-5, RED);
block(-2,20,-5, RED);
line(-2,19,-5, 2,19,-5, RED);
block(2,18,-5, RED);
line(-2,17,-5, 2,17,-5, RED);

// ======================= ARMS (fists on hips, elbows flared) =======================
// left
cube(-8,20,-3, -6,24,1, SUIT);     // deltoid
cube(-9,14,-2, -7,21,1, SUIT);     // upper arm, elbow out at x=-9
line(-8,15,-1, -5,13,-1, SUIT);    // forearm angling in
line(-8,15, 0, -5,13, 0, SUIT);
cube(-6,12,-3, -4,15,0, SKIN);     // fist on hip
// right
cube(6,20,-3, 8,24,1, SUIT);
cube(7,14,-2, 9,21,1, SUIT);
line(8,15,-1, 5,13,-1, SUIT);
line(8,15, 0, 5,13, 0, SUIT);
cube(4,12,-3, 6,15,0, SKIN);

// ======================= NECK & HEAD =======================
cube(-2,24,-3, 2,25,1, SKIN);      // neck
cube(-3,25,-3, 3,31,2, SKIN);      // head
cube(-2,24,-3, 2,25,-3, SKIN);     // chin/jaw front
// eyes (flush on the north face)
block(-2,28,-3, EYE); block(2,28,-3, EYE);
// dark brow ridge
line(-2,29,-3, 2,29,-3, HAIR);

// ======================= HAIR =======================
cube(-4,31,-4, 4,33,3, HAIR);      // helmet of hair
cube(-4,28,-3, -3,32,2, HAIR);     // left sideburn/frame
cube( 3,28,-3,  4,32,2, HAIR);     // right sideburn/frame
cube(-3,26,2, 3,32,3, HAIR);       // back of head
// iconic spit curl on the forehead
block(0,30,-4, HAIR); block(1,30,-4, HAIR);
block(1,29,-4, HAIR); block(0,31,-4, HAIR);
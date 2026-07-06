// minotaur-4x-opus — prompt:
// a minotaur...

const meta = null; // (ignored — this is a builder script, not a workflow)

// ---- Minotaur ----
// Origin (0,0,0) = feet on ground. Front = +Z (south). Symmetric about x=0.

const FUR   = OAK_LOG;   // brown hide
const LIGHT = PLANKS;    // tan muscle / muzzle highlight
const DARK  = STONE;     // hooves, shadow, axe blade
const BONE  = SNOW;      // horns / claws
const RED   = BRICK;     // eyes, nostrils, loincloth
const EYE   = GLASS;     // (unused primary) — kept subtle

// helper: mirror a filled box across x=0
function mcube(x1,y1,z1,x2,y2,z2,id){
  cube(x1,y1,z1,x2,y2,z2,id);
  cube(-x2,y1,z1,-x1,y2,z2,id);
}
function mblock(x,y,z,id){ block(x,y,z,id); block(-x,y,z,id); }

// ============ LEGS (digitigrade bull legs) ============
// Hooves — cloven, dark
mcube(1,0,-1, 4,1,4, DARK);           // hoof block (right + mirror left)
mblock(2,0,4, DARK); mblock(3,0,4, DARK);
// cleft in hoof front
block(2,0,4,AIR); block(-2,0,4,AIR);
// pastern / ankle
mcube(1,2,-1, 4,4,2, FUR);
// lower shin (angled back for digitigrade look)
mcube(1,4,-2, 4,7,1, FUR);
// knee joint
mcube(1,7,-1, 4,9,2, DARK);
// heavy thigh
mcube(1,9,-2, 4,14,3, FUR);
// thigh muscle highlight (front)
mcube(2,10,3, 3,13,3, LIGHT);

// ============ PELVIS / HIPS ============
cube(-4,13,-2, 4,16,3, FUR);

// ============ LOINCLOTH (red, hanging front & back) ============
cube(-5,11,3, 5,16,4, RED);           // front flap
cube(-5,11,-3, 5,16,-2, RED);         // back flap
mblock(4,12,4, DARK); mblock(3,11,4, RED);
cube(-1,10,3, 1,16,4, RED);           // longer center strip
// belt
cube(-5,16,-2, 5,16,3, DARK);
mblock(0,16,3, LIGHT);                // belt buckle
block(0,16,3, LIGHT);

// ============ TORSO / CHEST ============
// broad muscular trunk, tapering up to shoulders
cube(-5,16,-2, 5,20,3, FUR);
cube(-6,20,-2, 6,23,3, FUR);          // upper chest / ribcage
// abdominal wall highlight
cube(-3,16,3, 3,20,3, LIGHT);
// ab separation shading
mblock(0,17,3,DARK); mblock(0,19,3,DARK); block(0,18,3,DARK);
cube(-3,18,3,3,18,3,FUR);
// pectorals (two slabs)
mcube(1,21,3, 4,23,4, FUR);
mcube(2,22,4, 3,22,4, LIGHT);
// collar / shading between pecs
block(0,21,3,DARK);block(0,22,3,DARK);

// ============ SHOULDERS ============
cube(-8,22,-2, 8,25,3, FUR);          // huge trapezius/shoulders
mcube(6,23,-1, 8,25,2, DARK);         // shoulder cap shadow
mcube(6,24,3, 7,25,3, LIGHT);

// ============ ARMS (hang to sides) ============
function arm(sx){ // sx = +1 right, -1 left; build on right then this handles sign
  const s = sx;
  const X = (a)=> s>0 ? a : -a;
  // deltoid
  cube(Math.min(X(6),X(9)),19,-2, Math.max(X(6),X(9)),24,3, FUR);
  // upper arm (biceps)
  cube(Math.min(X(7),X(9)),13,-1, Math.max(X(7),X(9)),20,2, FUR);
  // bicep highlight
  cube(Math.min(X(8),X(8)),15,2, Math.max(X(8),X(8)),18,2, LIGHT);
  // elbow
  cube(Math.min(X(7),X(9)),11,-1, Math.max(X(7),X(9)),13,2, DARK);
  // forearm (thicker toward fist)
  cube(Math.min(X(7),X(10)),6,-1, Math.max(X(7),X(10)),11,3, FUR);
  cube(Math.min(X(8),X(9)),7,3, Math.max(X(8),X(9)),10,3, LIGHT);
  // fist
  cube(Math.min(X(7),X(10)),4,0, Math.max(X(7),X(10)),7,4, DARK);
}
arm(1);
arm(-1);

// ============ NECK ============
cube(-3,23,-1, 3,26,3, FUR);
mblock(2,24,3, LIGHT);

// ============ BULL HEAD ============
// skull
cube(-4,26,-2, 4,31,3, FUR);
// brow ridge shading
cube(-4,30,3, 4,31,3, DARK);
// muzzle / snout (lighter, projects forward)
cube(-3,26,3, 3,29,6, LIGHT);
cube(-3,26,6, 3,28,6, LIGHT);
// jaw underside
cube(-3,25,3, 3,26,5, FUR);
// nostrils
mblock(2,27,6, RED); mblock(2,26,6, DARK);
// mouth line
cube(-3,26,5, 3,26,6, DARK);
// eyes — glowing red, set under brow
mblock(3,29,3, RED);
mblock(2,29,3, RED);
// eye sockets shadow
mblock(2,28,3, DARK); mblock(3,28,3, DARK);
// forehead tuft of fur
cube(-2,31,0, 2,32,2, FUR);
mblock(0,32,1,DARK);

// ============ EARS ============
mcube(4,28,0, 5,29,2, FUR);
mblock(5,28,1, LIGHT);

// ============ HORNS (bone-white, curving out & up) ============
function horn(s){
  const X = a => s>0 ? a : -a;
  mblockOff(); // no-op guard
  // base on skull side
  block(X(4),30,1,BONE);
  block(X(5),30,1,BONE);
  block(X(5),31,1,BONE); block(X(6),31,1,BONE);
  block(X(6),32,1,BONE); block(X(7),32,0,BONE);
  block(X(7),33,0,BONE); block(X(7),33,-1,BONE);
  block(X(6),33,-1,BONE);
  // curl tips forward
  block(X(7),32,-1,BONE);
}
function mblockOff(){}
horn(1); horn(-1);
// thicken horn bases
mblock(4,29,1,BONE);

// ============ WEAPON: great double-bladed axe in right fist ============
const HX = 9;   // handle x (right side, at fist)
// handle
line(HX,4,4, HX,27,4, OAK_LOG);
line(HX,4,3, HX,27,3, OAK_LOG);
// pommel + top cap
block(HX,3,4,DARK); block(HX,28,4,DARK);
// double-bit axe head near top (y ~22-28)
cube(HX-1,22,3, HX-1,28,5, DARK);   // inner shoulder
// outer crescent blade (curved)
block(HX+1,23,4,DARK);block(HX+2,24,4,DARK);block(HX+2,25,4,DARK);
block(HX+3,25,4,DARK);block(HX+2,26,4,DARK);block(HX+2,27,4,DARK);
block(HX+1,28,4,DARK);block(HX+1,22,4,DARK);
cube(HX+1,24,4,HX+1,27,4,DARK);
// front/back broaden the blade
cube(HX+1,24,5,HX+2,26,5,DARK);
cube(HX+1,24,2,HX+2,26,2,DARK);
// blade highlight edge
block(HX+3,25,5,LIGHT);block(HX+3,25,2,LIGHT);block(HX+3,25,3,LIGHT);

// ============ GROUND: cracked rock + scattered bones ============
// stone slab the minotaur stands on
cube(-6,-1,-4, 6,-1,6, DARK);
cube(-7,-1,-2, 7,-1,4, DARK);
// cracks
block(0,-1,0,AIR);block(1,-1,2,AIR);block(-2,-1,3,AIR);block(3,-1,-1,AIR);
// scattered bones (BONE) around base
mblock(6,0,6,BONE); mblock(7,0,2,BONE); block(-5,0,7,BONE); block(5,0,-4,BONE);
mblock(6,0,-3,BONE);
// a broken pillar behind, ruined-labyrinth vibe
cube(-9,0,-6, -7,6,-4, DARK);
cube(-9,7,-6, -7,7,-5, DARK);
mblock(-8,4,-5,LIGHT);
cube(8,0,-6, 10,4,-4, DARK);
block(9,5,-5,DARK);
// low labyrinth wall fragments framing the scene
cube(-11,0,6, -9,3,7, COBBLE);
cube(9,0,6, 11,2,7, COBBLE);
mblock(-10,3,6,DARK);
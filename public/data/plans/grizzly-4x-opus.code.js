// grizzly-4x-opus — prompt:
// a grizzly bear standing on its hind legs...

// ===== Grizzly bear rearing on hind legs — faces NORTH (-Z) =====
// Body: OAK_LOG (brown fur). Muzzle/paw pads: PLANKS. Nose/eyes/claws darks & SNOW.

// --- helper: organic limb as a chain of spheres between two points ---
function limb(x1,y1,z1, x2,y2,z2, r, id){
  const n = Math.max(Math.abs(x2-x1), Math.abs(y2-y1), Math.abs(z2-z1), 1);
  for(let i=0;i<=n;i++){
    const t=i/n;
    sphere(Math.round(x1+(x2-x1)*t), Math.round(y1+(y2-y1)*t), Math.round(z1+(z2-z1)*t), r, id);
  }
}

// --- 0. Clear a viewing corridor in front so foliage doesn't block the bear ---
cube(-13, 0, -20, 13, 30, -4, AIR);
// clear the airspace the body will occupy of stray leaves too
cube(-12, 0, -5, 12, 28, 9, AIR);

// ================= LEGS (hind legs) =================
// thick brown legs, planted, front toward -Z
limb(-4, 0, 1, -4, 9, 1, 3, OAK_LOG);   // left leg
limb( 4, 0, 1,  4, 9, 1, 3, OAK_LOG);   // right leg
// knees / thigh bulk
sphere(-4, 7, 1, 3, OAK_LOG);
sphere( 4, 7, 1, 3, OAK_LOG);

// feet (splayed forward, toes to the north)
for(const fx of [-4,4]){
  sphere(fx, 1, -2, 3, OAK_LOG);          // heel/pad
  cube(fx-2, 0, -5, fx+2, 1, -1, OAK_LOG); // sole extending forward
  // paw pads (lighter)
  cube(fx-2, 0, -4, fx+2, 0, -2, PLANKS);
  // claws
  for(const cx of [-2,0,2]){
    block(fx+cx, 1, -6, SNOW);
    block(fx+cx, 0, -6, SNOW);
  }
}

// ================= BODY (rounded, belly bulges north) =================
sphere(0, 10, 1, 5, OAK_LOG);   // hips
sphere(0, 13, 0, 6, OAK_LOG);   // belly (bulges toward -Z front)
sphere(0, 17, 0, 5, OAK_LOG);   // chest
sphere(0, 19, 1, 4, OAK_LOG);   // upper back hump (grizzly shoulder hump)
sphere(0, 20, 2, 3, OAK_LOG);   // pronounced back hump
// fill between legs and hips
cube(-4, 6, -1, 4, 10, 3, OAK_LOG);
// lighter chest blaze on the front
sphere(0, 14, -4, 3, PLANKS);
cube(-2, 12, -6, 2, 16, -5, PLANKS);
// re-round chest edge with a thin brown cap so blaze reads as a patch
sphere(0, 17, -4, 2, OAK_LOG);

// ================= ARMS =================
// East (+X) arm RAISED high — catches the northern/eastern light (roar pose)
limb(4, 17, -1,  8, 21, -3, 3, OAK_LOG);   // upper
limb(8, 21, -3, 10, 25, -4, 2, OAK_LOG);   // forearm reaching up
sphere(10, 26, -4, 2, OAK_LOG);            // raised paw
// claws on raised paw
for(const cz of [-6,-5,-4]){ block(11, 27, cz, SNOW); }
block(12, 26, -5, SNOW);

// West (-X) arm lower, reaching forward with bared claws
limb(-4, 16, -1, -8, 14, -3, 3, OAK_LOG);  // upper
limb(-8, 14, -3, -10, 12, -6, 2, OAK_LOG); // forearm forward
sphere(-10, 12, -6, 2, OAK_LOG);           // paw
cube(-11, 11, -6, -9, 12, -6, PLANKS);     // pad
for(const cx of [-1,0,1]){ block(-10+cx, 12, -8, SNOW); block(-10+cx, 11, -8, SNOW); }

// ================= HEAD =================
sphere(0, 23, -1, 4, OAK_LOG);       // skull
sphere(0, 22, -3, 3, OAK_LOG);       // brow/cheek forward
// muzzle protruding NORTH (-Z)
cube(-2, 21, -7, 2, 24, -2, PLANKS);
sphere(0, 22, -6, 2, PLANKS);
// nose tip (dark)
cube(-1, 23, -8, 1, 24, -8, COBBLE);
block(0, 22, -8, COBBLE);
// mouth line
cube(-2, 21, -8, 2, 21, -6, STONE);

// eyes (dark, on the front face, slightly east-lit)
block(-2, 25, -5, STONE);
block( 2, 25, -5, STONE);
// small brow tufts
block(-2, 26, -4, OAK_LOG);
block( 2, 26, -4, OAK_LOG);

// ears (round, on top)
for(const ex of [-3,3]){
  sphere(ex, 27, 0, 2, OAK_LOG);
  block(ex, 28, 0, PLANKS); // inner ear hint
}

// ================= FUR / BACK DETAIL =================
// shaggy back ridge (asymmetric tufts) down the spine (+Z side, subtle from front)
for(let y=11;y<=20;y+=2){
  block(0, y, 5, OAK_LOG);
  block((y%4===0)?1:-1, y, 5, OAK_LOG);
}
// short tail
sphere(0, 8, 6, 1, OAK_LOG);

// ================= FOREGROUND SET DRESSING =================
// a couple of boulders + a fallen log at the bear's feet (depth separation)
sphere(-9, 0, -8, 2, STONE);
sphere(-11, 1, -6, 2, COBBLE);
sphere(10, 0, -9, 2, STONE);
limb(6, 1, -10, 12, 1, -8, 1, OAK_LOG); // fallen log
// scattered snow patches on the ground for contrast
block(-6, 0, -9, SNOW);
block(7, 0, -11, SNOW);
block(-2, 0, -12, SNOW);
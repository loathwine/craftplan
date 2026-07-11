// knight-vs-dragon-4x-opus — prompt:
// a knight fighting a dragon...

const meta = undefined; // (ignored — plain build script below)

// ================= KNIGHT vs DRAGON =================
// Camera looks SOUTH (-Z). Scene staged in profile along X:
// Knight on the WEST (-X), rearing Dragon on the EAST (+X),
// jaws + firebreath crashing down toward the lifted sword.

function lerp(a,b,t){ return a+(b-a)*t; }

// filled 2D triangle at a fixed Z (great for wing membranes / spines)
function fillTri(ax,ay,bx,by,cx,cy,z,id){
  const minx=Math.floor(Math.min(ax,bx,cx)), maxx=Math.ceil(Math.max(ax,bx,cx));
  const miny=Math.floor(Math.min(ay,by,cy)), maxy=Math.ceil(Math.max(ay,by,cy));
  const d=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);
  if(d===0) return;
  for(let x=minx;x<=maxx;x++){
    for(let y=miny;y<=maxy;y++){
      const a=((by-cy)*(x-cx)+(cx-bx)*(y-cy))/d;
      const b=((cy-ay)*(x-cx)+(ax-cx)*(y-cy))/d;
      const c=1-a-b;
      if(a>=-0.03&&b>=-0.03&&c>=-0.03) block(x,y,z,id);
    }
  }
}

// dorsal spine sticking straight up from a back point (shows on silhouette)
function spine(bx,by,h){
  fillTri(bx-1,by, bx+1,by, bx,by+h, 0, BRICK);
}

/* ---------------------------------------------------------------
   BATTLEFIELD — scorched, trampled ground beneath the duel
--------------------------------------------------------------- */
for(let x=-16;x<=17;x++){
  for(let z=-5;z<=6;z++){
    const h=((x*3+z*7)%5+5)%5;
    if(h===0) block(x,0,z, COBBLE);
    else if(((x*5+z*3)%11+11)%11===0) block(x,0,z, STONE);
  }
}
// smouldering embers where the fire has been raining down
for(let x=-13;x<=-4;x++){
  if(((x*2)%3+3)%3===0){ block(x,0,-1, BRICK); block(x,0,1, SAND); }
}
// a couple of cracked boulders as foreground weight
sphere(-6,0,4,2, STONE);
sphere(2,0,-4,2, COBBLE);

/* ===============================================================
   THE KNIGHT  (west, lunging east, sword raised to the sky)
   Steel armour = STONE, trim = COBBLE, red cape/plume = BRICK
=============================================================== */
// --- legs, lunging stance ---
// back (bracing) leg, planted west
cube(-16,0,-2,-15,5,-1, STONE);
cube(-17,0,-2,-15,0,-1, STONE);      // heel
// front (driving) leg, bent forward east
cube(-13,3,0,-12,5,1, STONE);        // thigh
cube(-12,0,0,-11,3,1, STONE);        // shin
cube(-12,0,0,-9,1,1, STONE);         // boot
// pelvis / faulds
cube(-16,5,-2,-11,6,1, STONE);
cube(-16,5,-2,-12,5,1, COBBLE);      // belt trim

// --- torso, leaning into the blow ---
cube(-15,6,-2,-11,10,1, STONE);
cube(-15,6,-1,-11,6,0, COBBLE);      // waist band
block(-13,8,-2, BRICK); block(-12,7,-2, BRICK); // heraldic marks on flank
// broad pauldrons
cube(-16,9,-3,-11,10,2, STONE);
block(-16,10,-3, COBBLE); block(-16,10,2, COBBLE);

// --- head + helmet with crest ---
cube(-14,10,-1,-12,12,1, STONE);
cube(-14,11,-1,-14,11,1, AIR);       // visor slit (carved)
line(-14,11,-1,-14,11,1, COBBLE);    // visor lip below slit
cube(-14,12,-1,-13,15,0, BRICK);     // flowing red plume

// --- flowing cape trailing west (drama + backlight) ---
cube(-15,8,-2,-14,10,1, BRICK);
cube(-16,6,-2,-15,9,1, BRICK);
cube(-17,3,-2,-16,7,1, BRICK);
cube(-17,1,-1,-17,4,0, BRICK);

// --- shield arm, braced toward the dragon (east face) ---
cube(-11,5,-3,-11,10,1, COBBLE);     // shield plate
line(-11,7,-3,-11,7,1, BRICK);       // horizontal of cross
line(-11,5,-1,-11,10,-1, BRICK);     // vertical of cross
block(-11,10,-3, STONE); block(-11,10,1, STONE); // rim studs

// --- sword arm raised, blade thrust up to meet the dragon ---
cube(-11,10,-1,-10,12,0, STONE);     // upper arm
cube(-10,12,-1,-9,14,0, STONE);      // forearm
cube(-9,13,-1,-8,13,0, COBBLE);      // gauntlet grip
line(-9,14,-1,-9,14,1, COBBLE);      // cross-guard
// long blade sweeping up-and-east into the fray
line(-8,14,0,-3,21,0, STONE);
line(-8,15,0,-3,22,0, STONE);        // blade thickness
block(-3,22,0, SNOW); block(-3,23,0, SNOW); // gleaming tip

/* ===============================================================
   THE DRAGON  (east, reared up, wings flared, breathing fire)
   Scales = STONE, belly = COBBLE, wings/spines/fire = BRICK+SAND
=============================================================== */
// --- core body masses ---
sphere(15,7,0,4, STONE);             // haunch
sphere(8,11,0,4, STONE);             // chest
cube(8,8,-3,15,12,3, STONE);         // back / spine mass
cube(8,4,-3,15,8,3, COBBLE);         // pale belly

// --- neck arching up and forward toward the knight ---
const neck=[[7,13,3],[6,15,3],[5,17,2],[3,18,2],[2,17,2],[0,16,2]];
for(const [x,y,r] of neck) sphere(x,y,0,r, STONE);
cube(1,15,-1,2,16,1, COBBLE);        // throat

// --- head, jaws agape ---
cube(-3,14,-2,1,17,2, STONE);        // skull
cube(-2,17,-1,0,17,1, COBBLE);       // brow ridge
cube(-6,15,-1,-2,16,1, STONE);       // upper snout
cube(-6,13,-1,-2,13,1, STONE);       // lower jaw (open — gap = maw)
// fangs
block(-6,14,-1, SNOW); block(-2,14,-1, SNOW);
block(-6,14,1, SNOW);  block(-2,14,1, SNOW);
block(-6,16,-1, SNOW); block(-6,16,1, SNOW);
// blazing eyes
block(-2,16,-2, BRICK); block(-2,16,2, BRICK);
// swept-back horns
line(0,17,-2,4,21,-2, STONE); line(0,17,2,4,21,2, STONE);
line(-1,17,-1,2,20,-1, COBBLE); line(-1,17,1,2,20,1, COBBLE);

// --- FIREBREATH: widening cone pouring down onto the knight ---
for(let x=-6;x>=-13;x--){
  const t=(-6-x)/7;
  const cy=Math.round(lerp(14,7,t));
  const spread=1+Math.round(t*3);
  for(let dy=-spread;dy<=spread;dy++){
    for(let dz=-spread;dz<=spread;dz++){
      if(dy*dy+dz*dz<=spread*spread+1){
        block(x,cy+dy,dz, ((x+dy+dz)&1)?BRICK:SAND);
      }
    }
  }
}

// --- WINGS: near wing flared toward the camera, far wing behind ---
function wing(z){
  const S=[9,12], Wr=[13,21];
  const tips=[[17,18],[16,12],[11,9],[6,10]];
  // membrane
  fillTri(Wr[0],Wr[1], tips[0][0],tips[0][1], tips[1][0],tips[1][1], z, BRICK);
  fillTri(Wr[0],Wr[1], tips[1][0],tips[1][1], tips[2][0],tips[2][1], z, BRICK);
  fillTri(Wr[0],Wr[1], tips[2][0],tips[2][1], tips[3][0],tips[3][1], z, BRICK);
  fillTri(Wr[0],Wr[1], tips[3][0],tips[3][1], S[0],S[1],           z, BRICK);
  // ribs / finger bones over the membrane
  line(S[0],S[1],z, Wr[0],Wr[1],z, STONE);
  for(const t of tips) line(Wr[0],Wr[1],z, t[0],t[1],z, STONE);
}
wing(-4);   // near wing (camera side)
wing(4);    // far wing (depth)

// --- dorsal spines running crest → back → tail ---
spine(4,18,3); spine(6,16,3); spine(8,14,3);
spine(11,13,3); spine(14,12,2); spine(16,11,2);
spine(18,9,2); spine(20,7,2);

// --- hind legs with raking claws ---
function hindLeg(z){
  cube(13,3,z,16,8,z+2, STONE);      // thigh
  cube(13,0,z,15,3,z+1, STONE);      // shin
  cube(11,0,z,15,1,z+2, STONE);      // foot
  block(10,0,z, SNOW); block(10,0,z+2, SNOW); block(10,0,z+1, SNOW); // claws
}
hindLeg(-4);   // near
hindLeg(2);    // far

// --- forelegs reaching down at the knight ---
function foreLeg(z){
  cube(6,8,z,8,11,z+1, STONE);       // upper
  cube(3,4,z,7,8,z+1, STONE);        // lower reaching forward
  cube(1,3,z,3,5,z+1, STONE);        // wrist
  block(0,3,z, SNOW); block(0,4,z, SNOW); block(0,5,z, SNOW); // talons
}
foreLeg(-3);   // near (menacing the knight)
foreLeg(2);    // far

// --- tail curling east then down to the earth ---
const tail=[[17,8,0,3],[19,7,0,3],[21,6,1,2],[22,4,2,2],[21,2,3,2],[19,1,4,2],[17,1,5,2]];
for(const [x,y,z,r] of tail) sphere(x,y,z,r, STONE);
// barbed spade tip
fillTri(16,1,16,4,14,2, 5, BRICK);
block(15,2,5, BRICK); block(14,1,5, SNOW);
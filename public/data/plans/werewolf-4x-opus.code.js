// werewolf-4x-opus — prompt:
// a werewolf howling at the moon...

const meta = { name: "werewolf-howl", description: "werewolf howling at moon" }

// ---- helpers ----
function lerp(a,b,t){ return a+(b-a)*t; }
function capsule(x1,y1,z1,x2,y2,z2,r,id){
  const dx=x2-x1, dy=y2-y1, dz=z2-z1;
  const len=Math.sqrt(dx*dx+dy*dy+dz*dz);
  const steps=Math.max(1,Math.ceil(len));
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    sphere(Math.round(lerp(x1,x2,t)),Math.round(lerp(y1,y2,t)),Math.round(lerp(z1,z2,t)),r,id);
  }
}

// ---- clear the forest in the stage & sky path (AIR is free) ----
cube(-11,1,-11, 11,27,10, AIR);        // around the werewolf figure
cube(-9,20,-21, 3,32,-9, AIR);         // sky lane for the moon

// ================= ROCKY CRAG THE WOLF STANDS ON =================
disk(0,0,0,8,STONE);
disk(0,1,0,7,STONE);
disk(0,2,0,5,COBBLE);
disk(0,3,0,3,STONE);
// jagged boulders around the base
sphere(-6,1,3,2,COBBLE);
sphere(6,1,-2,2,STONE);
sphere(4,1,5,2,COBBLE);
sphere(-5,1,-4,2,STONE);
sphere(7,0,4,2,COBBLE);
sphere(-8,0,-2,2,STONE);
block(3,3,-3,COBBLE); block(-3,3,4,COBBLE); block(2,4,2,STONE);

// ================= WEREWOLF (leaning back, howling) =================
const FUR=STONE, DARK=COBBLE;

// --- hind legs (digitigrade) ---
// right
capsule(3,9,1, 4,6,4, 2, FUR);    // thigh
capsule(4,6,4, 3,3,1, 2, FUR);    // shin (heel raised)
capsule(3,3,1, 3,3,4, 2, FUR);    // foot
sphere(4,6,4,2,DARK);             // knee tuft
block(2,3,5,OAK_LOG); block(3,3,5,OAK_LOG); block(4,3,5,OAK_LOG); // claws
// left
capsule(-3,9,1, -4,6,4, 2, FUR);
capsule(-4,6,4, -3,3,1, 2, FUR);
capsule(-3,3,1, -3,3,4, 2, FUR);
sphere(-4,6,4,2,DARK);
block(-2,3,5,OAK_LOG); block(-3,3,5,OAK_LOG); block(-4,3,5,OAK_LOG);

// --- torso: spine leaning back, broad chest, lean waist ---
capsule(0,8,2, 0,16,-2, 3, FUR);   // back / spine
sphere(0,14,-1,4,FUR);             // broad chest
sphere(0,11,1,3,FUR);              // belly
sphere(0,16,-3,3,DARK);            // hunched shoulder mane
sphere(-4,15,-1,2,DARK);           // shoulder
sphere(4,15,-1,2,DARK);

// shaggy fur spikes down the spine
line(1,12,3, 2,15,-2, DARK);
line(-1,12,3, -2,15,-2, DARK);
block(0,17,-4,DARK); block(1,16,-4,DARK); block(-1,16,-4,DARK);
block(3,12,2,DARK); block(-3,12,2,DARK);

// --- arms with clawed paws ---
// right
capsule(4,15,-1, 6,11,1, 2, FUR);   // upper arm
capsule(6,11,1, 6,8,3, 1, FUR);     // forearm
sphere(6,7,3,2,DARK);               // paw
block(6,6,5,OAK_LOG); block(7,7,4,OAK_LOG); block(5,7,5,OAK_LOG); // claws
// left
capsule(-4,15,-1, -6,11,1, 2, FUR);
capsule(-6,11,1, -6,8,3, 1, FUR);
sphere(-6,7,3,2,DARK);
block(-6,6,5,OAK_LOG); block(-7,7,4,OAK_LOG); block(-5,7,5,OAK_LOG);

// --- neck & head thrown back, muzzle to the moon ---
capsule(0,16,-2, 0,19,-5, 2, FUR);  // neck
sphere(0,20,-5,3,FUR);              // skull
// snout / upper jaw angled up-and-back toward the moon
capsule(0,21,-5, 0,24,-9, 1, FUR);
sphere(0,24,-9,1,DARK);             // nose
// lower jaw (mouth agape, howling)
capsule(0,20,-5, 1,22,-8, 1, FUR);
block(0,23,-8,SNOW); block(1,22,-7,SNOW); block(0,22,-6,SNOW); // fangs
// glowing eyes
block(1,21,-7,BRICK); block(-1,21,-7,BRICK);
// pointed ears swept back
line(2,22,-4, 3,25,-3, FUR); block(3,25,-3,DARK);
line(-2,22,-4, -3,25,-3, FUR); block(-3,25,-3,DARK);
// cheek ruff
block(2,20,-6,DARK); block(-2,20,-6,DARK); block(2,19,-5,DARK); block(-2,19,-5,DARK);

// --- bushy tail sweeping up behind ---
capsule(0,9,3, -1,12,6, 2, FUR);
capsule(-1,12,6, -2,15,8, 2, DARK);
sphere(-2,15,8,3,FUR);
block(-3,17,8,DARK); block(-1,17,9,DARK);

// ================= THE MOON =================
sphere(-3,26,-15,5,SNOW);
// craters
sphere(-5,28,-18,1,STONE);
sphere(0,24,-12,1,STONE);
sphere(-4,25,-13,1,COBBLE);
block(-2,29,-16,STONE); block(-6,26,-16,COBBLE);

// ================= NIGHT SKY: stars =================
block(8,28,-18,SNOW); block(9,24,-14,SNOW); block(7,31,-12,SNOW);
block(-9,30,-16,SNOW); block(-8,22,-19,SNOW); block(10,26,-20,SNOW);
block(6,22,-21,SNOW); block(-6,32,-20,SNOW); block(4,30,-21,SNOW);
block(11,29,-15,SNOW); block(-10,25,-11,SNOW); block(2,32,-11,SNOW);

// ================= FOREGROUND: bare gnarled trees for depth =================
// left dead tree
capsule(-13,0,-3, -13,9,-2, 1, OAK_LOG);
line(-13,7,-2, -16,10,-4, OAK_LOG);
line(-13,8,-2, -11,11,0, OAK_LOG);
line(-13,6,-2, -15,8,1, OAK_LOG);
// right dead tree
capsule(12,0,-6, 13,10,-5, 1, OAK_LOG);
line(13,8,-5, 16,11,-6, OAK_LOG);
line(13,9,-5, 11,12,-3, OAK_LOG);
line(13,7,-5, 15,9,-8, OAK_LOG);

// scattered stones on the ground for texture
block(-9,0,6,COBBLE); block(9,0,7,STONE); block(-7,0,8,STONE);
block(8,0,-8,COBBLE); block(-10,0,-6,STONE); block(6,0,9,COBBLE);
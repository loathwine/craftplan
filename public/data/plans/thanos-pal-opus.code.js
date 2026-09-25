// thanos-pal-opus — prompt:
// Thanos...

cube(-6,-8,-6,6,-1,6,STONE);
disk(0,-1,0,10,COBBLE);
disk(0,0,0,8,STONE);
// scattered rubble around the base
const rubble=[[-9,-8],[9,-7],[-7,9],[8,8],[10,2],[-10,1],[-3,10],[4,-9],[-9,-3],[9,-1]];
for(const [rx,rz] of rubble){cube(rx,0,rz,rx+1,1+(Math.abs(rx+rz)%2),rz+1,COBBLE);}

// ===================== THANOS =====================
// He faces NORTH (-Z). Front is toward the viewer.

// ---- BOOTS (dark armor, gold trim) ----
cube(-6,0,-5,-1,3,4,GRAY);   // left boot
cube(1,0,-5,6,3,4,GRAY);     // right boot
cube(-6,0,-6,-1,1,-5,GOLD);  // left toe cap
cube(1,0,-6,6,1,-5,GOLD);    // right toe cap
cube(-6,3,-5,-1,4,4,GOLD);   // left ankle band
cube(1,3,-5,6,4,4,GOLD);     // right ankle band

// ---- LEGS (blue undersuit, gold shin/knee plates) ----
cube(-6,4,-4,-1,13,3,BLUE);  // left leg
cube(1,4,-4,6,13,3,BLUE);    // right leg
cube(-6,4,-5,-1,10,-4,GOLD); // left shin plate (front)
cube(1,4,-5,6,10,-4,GOLD);   // right shin plate
cube(-6,8,-5,-1,9,-4,IRON);  // left knee guard
cube(1,8,-5,6,9,-4,IRON);    // right knee guard
cube(-6,11,-5,-1,13,-4,GOLD);// left thigh plate
cube(1,11,-5,6,13,-4,GOLD);  // right thigh plate

// ---- PELVIS + BELT ----
cube(-7,13,-4,7,16,3,BLUE);
cube(-7,15,-5,7,17,-4,GOLD); // belt front
cube(-7,15,-4,7,16,3,GOLD);  // belt wrap
cube(-1,15,-6,1,17,-5,IRON); // belt buckle

// ---- TORSO ----
cube(-6,16,-4,6,20,3,BLUE);          // waist/abs
cube(-8,20,-5,8,25,3,BLUE);          // broad chest
// gold chest armor plates
cube(-8,22,-6,-1,25,-5,GOLD);        // left pectoral plate
cube(1,22,-6,8,25,-5,GOLD);          // right pectoral plate
cube(-1,20,-6,1,25,-5,IRON);         // central sternum ridge
cube(-6,20,-5,6,22,-4,GOLD);         // abdominal plate
// side ribs / definition
line(-8,20,3,8,20,3,IRON);
line(-8,25,3,8,25,3,IRON);

// ---- SHOULDER PAULDRONS ----
cube(-11,22,-4,-8,25,3,GOLD);        // left pauldron
cube(8,22,-4,11,25,3,GOLD);          // right pauldron
cube(-11,24,-5,-8,25,3,IRON);        // left pauldron rim
cube(8,24,-5,11,25,3,IRON);          // right pauldron rim
cube(-11,25,-3,-9,26,2,GOLD);        // left shoulder crest
cube(9,25,-3,11,26,2,GOLD);          // right shoulder crest

// ---- LEFT ARM (hanging at side) ----
cube(-11,15,-3,-8,22,3,PURPLE);      // upper arm (skin)
cube(-11,9,-3,-8,15,3,GOLD);         // gold vambrace/forearm
cube(-11,7,-3,-8,9,3,PURPLE);        // relaxed fist
cube(-11,14,-4,-8,15,-3,IRON);       // elbow guard

// ---- RIGHT ARM RAISED (the INFINITY GAUNTLET arm) ----
cube(8,22,-3,11,27,3,PURPLE);        // upper arm rising (skin)
cube(9,27,-4,12,28,3,IRON);          // elbow joint
cube(9,28,-4,12,32,3,GOLD);          // gauntlet forearm
cube(8,31,-5,12,34,3,GOLD);          // clenched fist
// knuckle ridges
cube(8,33,-5,12,34,-4,IRON);
// finger grooves on the fist
line(8,32,-5,8,33,-5,IRON);
line(10,32,-5,10,33,-5,IRON);
line(12,32,-5,12,33,-5,IRON);
// the six Infinity Stones set into the back of the gauntlet, facing the viewer
block(8,32,-6,NEON_RED);   // Reality
block(10,32,-6,NEON_BLUE); // Space
block(12,32,-6,YELLOW);    // Mind
block(8,31,-6,PURPLE);     // Power
block(10,31,-6,GREEN);     // Time
block(12,31,-6,ORANGE);    // Soul

// ---- NECK + GOLD COLLAR ----
cube(-3,24,-3,3,26,2,PURPLE);        // neck
cube(-5,24,-5,5,25,3,GOLD);          // gorget/collar
cube(-5,25,-5,-3,26,-4,GOLD);        // collar wing L
cube(3,25,-5,5,26,-4,GOLD);          // collar wing R

// ---- HEAD (purple, bald) ----
cube(-5,26,-4,5,31,3,PURPLE);        // main skull
cube(-4,31,-3,4,33,2,PURPLE);        // rounded crown
// round off the corners
block(-5,31,-4,AIR);block(5,31,-4,AIR);block(-5,31,3,AIR);block(5,31,3,AIR);
block(-4,33,-3,AIR);block(4,33,-3,AIR);block(-4,33,2,AIR);block(4,33,2,AIR);
block(-5,26,3,AIR);block(5,26,3,AIR);

// heavy brow ridge (protruding front)
cube(-5,29,-5,5,30,-4,PURPLE);
cube(-5,30,-5,5,30,-5,MAGENTA);      // brow highlight

// deep-set eyes
cube(-4,28,-5,-2,28,-5,BLACK);       // left eye socket
cube(2,28,-5,4,28,-5,BLACK);         // right eye socket
block(-3,28,-6,LIGHT_BLUE);          // left eye glow
block(3,28,-6,LIGHT_BLUE);           // right eye glow

// cheekbones
block(-5,27,-5,PURPLE);block(5,27,-5,PURPLE);

// mouth (grim line)
cube(-2,27,-5,2,27,-5,BLACK);

// ---- THE ICONIC RIBBED CHIN (protruding, grooved) ----
cube(-3,25,-6,3,27,-5,PURPLE);       // jaw pushed forward
// vertical shadow grooves
block(-3,25,-7,BLACK);block(-1,25,-7,BLACK);block(1,25,-7,BLACK);block(3,25,-7,BLACK);
block(-2,25,-7,PURPLE);block(0,25,-7,PURPLE);block(2,25,-7,PURPLE);
block(-3,26,-7,BLACK);block(-1,26,-7,BLACK);block(1,26,-7,BLACK);block(3,26,-7,BLACK);
block(-2,26,-7,PURPLE);block(0,26,-7,PURPLE);block(2,26,-7,PURPLE);
block(0,24,-6,PURPLE);               // chin tip

// ---- CAPE-LIKE BACK MANTLE for depth (dark blue) ----
cube(-8,20,4,8,25,5,BLUE);
cube(-7,14,5,7,25,6,BLUE);
cube(-6,10,6,6,20,6,BLUE);
line(-8,25,4,8,25,4,GOLD);           // mantle gold trim
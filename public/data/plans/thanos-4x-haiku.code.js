// thanos-4x-haiku — prompt:
// Thanos...

const STONE = 3;
const COBBLE = 8;
const BRICK = 10;
const GLASS = 11;

// LEGS - powerful stance, y=0-9
cube(2, 0, -1, 6, 9, 3, COBBLE);     // left leg forward
cube(2, 2, 4, 7, 8, 9, COBBLE);      // left leg back

cube(-6, 0, -1, -2, 9, 3, COBBLE);   // right leg forward
cube(-7, 2, 4, -2, 8, 9, COBBLE);    // right leg back

// Feet base
cube(2, 0, -2, 6, 1, 4, BRICK);      // left foot
cube(-6, 0, -2, -2, 1, 4, BRICK);    // right foot

// TORSO y=9-18 - massive and muscular
cube(-8, 9, -2, 8, 18, 8, STONE);    // main body
cube(-9, 11, -1, 9, 16, 6, STONE);   // upper chest/ribs

// Chest definition
line(-1, 12, -2, -1, 17, -2, BRICK); // center pec line
line(1, 12, -2, 1, 17, -2, BRICK);   // lateral definition
cube(-7, 12, -2, -2, 16, 1, BRICK);  // left pectoral
cube(2, 12, -2, 7, 16, 1, BRICK);    // right pectoral

// Back musculature
cube(-9, 12, 6, -6, 16, 8, BRICK);   // left back
cube(6, 12, 6, 9, 16, 8, BRICK);     // right back

// SHOULDERS y=13-17
cube(-10, 13, 0, -8, 17, 5, STONE);  // left shoulder cap
cube(8, 13, 0, 10, 17, 5, STONE);    // right shoulder cap

// Abdominal blocks
for (let y = 11; y < 16; y++) {
  block(-2, y, 2, BRICK);
  block(0, y, 2, BRICK);
  block(2, y, 2, BRICK);
}

// LEFT ARM (+X direction)
cube(10, 12, 0, 13, 17, 4, STONE);   // upper arm
cube(13, 10, 1, 16, 15, 3, COBBLE);  // forearm
cube(15, 9, 1, 18, 13, 3, BRICK);    // hand

// RIGHT ARM (-X direction) - EXTENDED POWER POSE
cube(-13, 12, 0, -10, 17, 4, STONE); // upper arm
cube(-16, 10, 1, -13, 15, 3, COBBLE); // forearm

// INFINITY GAUNTLET - dominant focal point
cube(-19, 8, 0, -15, 13, 3, GLASS);  // gauntlet main body
cube(-20, 9, 1, -14, 12, 2, BRICK);  // gauntlet ridges and armor
cube(-18, 10, 0, -16, 12, 3, BRICK); // gauntlet plates
sphere(-17, 11, 1, 2, GLASS);        // infinity stone - glowing center

// HEAD y=18-27
cube(-7, 18, -2, 7, 27, 6, COBBLE);  // main head volume
cube(-8, 20, -1, 8, 26, 5, COBBLE);  // head full width

// FACE - front facing camera (-Z)
cube(-6, 21, -2, 6, 25, -2, STONE);  // face panel

// Iconic Thanos brow ridge - distinctive feature
line(-8, 24, 0, 8, 24, 0, BRICK);    // pronounced brow
line(-7, 23, 0, 7, 23, 0, BRICK);    // brow depth

// Eyes
block(-3, 23, -2, GLASS);
block(3, 23, -2, GLASS);

// Nose and cheekbone structure
line(-2, 21, -1, 2, 21, -1, BRICK);  // center
line(-3, 20, -1, 3, 20, -1, STONE);  // cheeks

// Mouth
line(-4, 20, -2, 4, 20, -2, BRICK);

// Jaw and chin - prominent, powerful
cube(-7, 18, -1, 7, 20, 3, STONE);   // jaw
line(-6, 18, -1, 6, 18, -1, BRICK);  // jaw definition
cube(-5, 17, 0, 5, 19, 2, BRICK);    // chin prominence
block(-4, 16, 0, BRICK);
block(4, 16, 0, BRICK);

// Head side ridges - textural detail
line(-8, 22, 1, -8, 22, 5, BRICK);   // left ridge
line(8, 22, 1, 8, 22, 5, BRICK);     // right ridge

// NECK connecting head to body
cube(-4, 16, 0, 4, 18, 4, COBBLE);

// Arm muscularity definition
line(10, 14, 0, 10, 14, 4, BRICK);   // left arm definition
line(-10, 14, 0, -10, 14, 4, BRICK); // right arm detail
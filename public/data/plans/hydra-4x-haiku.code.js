// hydra-4x-haiku — prompt:
// a three-headed hydra...

// THREE-HEADED HYDRA - Serpentine Monster

// ===== MAIN BODY =====
// Central torso
cube(-7, 0, -1, 7, 9, 11, STONE);

// Body upper section
cube(-6, 8, 0, 6, 12, 10, COBBLE);

// Belly armor - brick scales
cube(-5, 1, 1, 5, 3, 9, BRICK);

// Chest plate
hollowCube(-6, 8, 0, 6, 12, 10, STONE);

// ===== LEFT HEAD NECK =====
line(-7, 8, -1, -13, 14, -10, STONE);

// Left neck bulges
sphere(-9, 10, -4, 2, STONE);
sphere(-11, 12, -8, 2, COBBLE);

// ===== LEFT HEAD =====
sphere(-14, 14, -11, 3, STONE);
cube(-17, 12, -14, -11, 18, -8, COBBLE);

// Left head snout
cube(-18, 13, -15, -12, 17, -10, BRICK);
hollowCube(-17, 12, -14, -11, 17, -8, STONE);

// Left head eyes
block(-15, 15, -16, GLASS);
block(-13, 16, -12, GLASS);
block(-16, 16, -10, GLASS);

// Left head jaw line
line(-16, 13, -15, -12, 13, -9, BRICK);

// ===== CENTER HEAD (MAIN) =====
// Central neck - prominent and tall
line(0, 9, -1, 0, 18, -12, STONE);
cube(-2, 17, -2, 2, 20, -1, COBBLE);

// Central head mass
sphere(0, 20, -14, 4, STONE);
cube(-5, 18, -18, 5, 24, -10, COBBLE);

// Central head snout
cube(-4, 19, -21, 4, 23, -16, BRICK);
hollowCube(-5, 18, -18, 5, 23, -10, STONE);

// Central head dominant eyes
block(-2, 21, -22, GLASS);
block(2, 21, -22, GLASS);
block(-3, 22, -14, GLASS);
block(3, 22, -14, GLASS);

// Central head crown spikes
line(-2, 24, -14, -1, 28, -10, BRICK);
line(2, 24, -14, 1, 28, -10, BRICK);
line(0, 24, -14, 0, 28, -12, BRICK);

// Central head jaw
line(-4, 19, -21, 4, 19, -21, BRICK);

// ===== RIGHT HEAD NECK =====
line(7, 8, -1, 13, 14, -10, STONE);

// Right neck bulges
sphere(9, 10, -4, 2, STONE);
sphere(11, 12, -8, 2, COBBLE);

// ===== RIGHT HEAD =====
sphere(14, 14, -11, 3, STONE);
cube(11, 12, -14, 17, 18, -8, COBBLE);

// Right head snout
cube(12, 13, -15, 18, 17, -10, BRICK);
hollowCube(11, 12, -14, 17, 17, -8, STONE);

// Right head eyes
block(13, 16, -12, GLASS);
block(15, 15, -16, GLASS);
block(16, 16, -10, GLASS);

// Right head jaw line
line(12, 13, -9, 16, 13, -15, BRICK);

// ===== LEGS =====
// Front legs
cube(-9, -2, -2, -6, 1, 4, STONE);
cube(6, -2, -2, 9, 1, 4, STONE);

// Back legs
cube(-8, -2, 9, -4, 1, 14, STONE);
cube(4, -2, 9, 8, 1, 14, STONE);

// Leg detail
cube(-9, 0, 0, -6, 1, 2, BRICK);
cube(6, 0, 0, 9, 1, 2, BRICK);

// ===== SPINAL RIDGE =====
line(-1, 12, 0, 0, 15, 6, BRICK);
line(1, 12, 0, 0, 15, 6, BRICK);

// Back armor
hollowCube(-3, 10, 2, 3, 11, 8, BRICK);
hollowCube(-2, 11, 5, 2, 12, 9, BRICK);

// ===== BODY SCALES & TEXTURE =====
// Horizontal scale bands
line(-6, 3, 1, 6, 3, 1, BRICK);
line(-6, 5, 4, 6, 5, 4, BRICK);
line(-6, 7, 7, 6, 7, 7, BRICK);
line(-6, 9, 10, 6, 9, 10, BRICK);

// Vertical scale ridges
line(-4, 2, 2, -4, 10, 8, BRICK);
line(4, 2, 2, 4, 10, 8, BRICK);

// Neck detail rings
line(-10, 11, -6, -12, 11, -6, BRICK);
line(10, 11, -6, 12, 11, -6, BRICK);
line(-8, 10, -4, -10, 10, -4, BRICK);
line(8, 10, -4, 10, 10, -4, BRICK);

// ===== NOSTRIL DETAILS =====
block(-14, 14, -12, GLASS);
block(14, 14, -12, GLASS);
block(0, 20, -18, GLASS);

// ===== HEAD JAW DETAIL =====
hollowCube(-17, 13, -14, -12, 16, -10, COBBLE);
hollowCube(12, 13, -14, 17, 16, -10, COBBLE);

// ===== EMBELLISHMENTS =====
// Central chest jewel
cube(-1, 11, 4, 1, 13, 6, BRICK);

// Body side plates
cube(-8, 6, 3, -7, 10, 7, BRICK);
cube(7, 6, 3, 8, 10, 7, BRICK);

// Underbelly detail
line(-3, 1, 3, 3, 1, 3, COBBLE);
line(-3, 2, 6, 3, 2, 6, COBBLE);
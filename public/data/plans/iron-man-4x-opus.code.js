// iron-man-4x-opus — prompt:
// Iron Man...

const meta = { name: "iron-man", description: "Iron Man" };

// palette
const RED = BRICK, GOLD = SAND, DARK = COBBLE, METAL = STONE, GLOW = ICE, WHITE = SNOW;

// mirror a box across x=0 (build both left+right limbs)
function mx(x1, y1, z1, x2, y2, z2, id) {
  cube(x1, y1, z1, x2, y2, z2, id);
  cube(-x2, y1, z1, -x1, y2, z2, id);
}

// ---- clear the figure's own volume of trees/leaves for a clean silhouette
cube(-12, 1, -8, 12, 33, 8, AIR);

// ---------------------------------------------------------------- PEDESTAL
cylinder(0, -2, 0, 12, 3, METAL);            // y -2..0 base
disk(0, 0, 0, 12, METAL);
hollowCylinder(0, 0, 0, 12, 1, DARK);        // raised rim
// cracked / scorched accents on the pad
disk(0, 0, 0, 7, COBBLE);
mx(3, 0, 4, 5, 0, 6, DARK);
mx(6, 0, -5, 8, 0, -3, DARK);
disk(0, 0, 0, 3, BRICK);                     // hot landing scorch center

// ================================================================ FIGURE
// ---- BOOTS (y0-2)
mx(1, 0, -4, 5, 2, 3, RED);                  // boot body, toe extends to z=-4
mx(1, 0, -4, 5, 1, -3, GOLD);                // gold toe cap
mx(1, 2, -2, 5, 2, 2, GOLD);                 // gold ankle trim
mx(1, 0, 3, 5, 2, 3, DARK);                  // dark heel

// ---- SHIN (y3-8)
mx(1, 3, -2, 5, 8, 2, RED);
mx(2, 3, -3, 4, 8, -2, GOLD);                // gold shin plate (front)
mx(1, 3, -1, 1, 7, 1, GOLD);                 // inner seam

// ---- KNEE (y8-9)
mx(1, 8, -2, 5, 9, 2, GOLD);

// ---- THIGH (y9-14)
mx(1, 9, -2, 5, 14, 2, RED);
mx(5, 9, -1, 5, 13, 1, GOLD);                // outer thigh trim
mx(2, 13, -3, 4, 14, -3, GOLD);              // front thigh accent

// ---- PELVIS / HIPS (y14-17)
cube(-5, 14, -2, 5, 17, 2, GOLD);            // gold belt/hips
cube(-5, 15, -3, 5, 16, -3, DARK);           // dark buckle band front
block(0, 15, -4, GLOW);                      // small hip light

// ---- ABDOMEN (y17-21)
cube(-5, 17, -3, 5, 21, 3, RED);
cube(-4, 18, -4, 4, 18, -4, GOLD);           // ab line 1 (proud)
cube(-4, 20, -4, 4, 20, -4, GOLD);           // ab line 2
cube(0, 17, -4, 0, 21, -4, GOLD);            // center seam

// ---- CHEST (y21-27) — wider
cube(-7, 21, -3, 7, 27, 3, RED);
mx(6, 22, -4, 7, 26, -4, GOLD);              // gold pectoral plates (proud)
cube(-7, 27, -3, 7, 27, 3, GOLD);            // collar trim

// ---- ARC REACTOR (chest front, protruding to z=-4)
cube(-2, 22, -4, 2, 26, -4, WHITE);          // glowing housing
cube(-1, 23, -4, 1, 25, -4, GLOW);           // bright core
block(-2, 22, -4, AIR); block(2, 22, -4, AIR);   // round corners
block(-2, 26, -4, AIR); block(2, 26, -4, AIR);
block(0, 24, -5, GLOW);                      // beam tip out front

// ---- NECK (y27-28)
cube(-2, 27, -2, 2, 28, 2, DARK);

// ---- HEAD / HELMET (y28-33)
cube(-3, 28, -3, 3, 33, 3, GOLD);            // gold face base
cube(-3, 28, 3, 3, 33, 3, RED);             // red back
cube(-3, 33, -3, 3, 33, 3, RED);            // red top
mx(3, 28, -3, 3, 33, 2, RED);               // red side panels
mx(3, 30, -3, 3, 31, -3, GOLD);             // cheek edge gold
// face plate vents (mouth)
cube(-1, 29, -4, 1, 29, -4, DARK);
cube(-1, 30, -4, 1, 30, -4, DARK);
// EYES — glowing angled slits (proud at z=-4)
cube(1, 31, -4, 2, 31, -4, GLOW);
block(2, 32, -4, GLOW);
cube(-2, 31, -4, -1, 31, -4, GLOW);
block(-2, 32, -4, GLOW);
block(0, 32, -4, GOLD);                      // forehead crest

// ---------------------------------------------------------------- ARMS
// ---- SHOULDER PAULDRON (y24-27, x6-9)
mx(6, 24, -3, 9, 27, 3, RED);
mx(6, 27, -3, 9, 27, 3, GOLD);               // pauldron trim
mx(9, 25, -2, 9, 26, 2, GOLD);               // outer cap

// ---- UPPER ARM (y17-24, x7-9)
mx(7, 17, -2, 9, 24, 2, RED);
mx(9, 18, -1, 9, 23, 1, GOLD);               // bicep trim

// ---- ELBOW (y16-17)
mx(7, 16, -2, 9, 17, 2, GOLD);

// ---- FOREARM / GAUNTLET (y9-16)
mx(7, 9, -2, 9, 16, 2, RED);
mx(7, 9, -3, 9, 15, -3, GOLD);               // gauntlet front gold
mx(9, 10, -1, 9, 15, 1, GOLD);

// ---- HAND (y7-9)
mx(7, 7, -2, 9, 9, 2, GOLD);
mx(7, 7, -2, 9, 7, 2, DARK);                 // knuckle underside
block(8, 7, 0, GLOW);                        // palm repulsor
block(-8, 7, 0, GLOW);

// ---------------------------------------------------------------- REPULSOR BLASTS
// both palms firing straight down onto the pad (landing pose)
cylinder(8, 0, 0, 1, 7, GLOW);
cylinder(-8, 0, 0, 1, 7, GLOW);
disk(8, 0, 0, 3, WHITE);                     // ground impact glow
disk(-8, 0, 0, 3, WHITE);
disk(8, 0, 0, 1, GLOW);
disk(-8, 0, 0, 1, GLOW);

// energy sparks kicking up around the impacts
mx(6, 1, 3, 6, 2, 3, GLOW);
mx(10, 1, -3, 10, 3, -3, GLOW);
mx(7, 3, 4, 7, 3, 4, WHITE);
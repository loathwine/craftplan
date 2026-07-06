// optimus-prime-4x-opus — prompt:
// Optimus Prime...

// ========= OPTIMUS PRIME — voxel hero statue =========
// Front faces -Z. Classic G1/movie palette:
//   red BRICK torso/pauldrons, blue GLASS limbs/helmet,
//   silver STONE joints/face, white SNOW faceplate accents.
// Centered on X=0.

function sym(x1, y1, z1, x2, y2, z2, id) {
  cube(x1, y1, z1, x2, y2, z2, id);
  cube(-x2, y1, z1, -x1, y2, z2, id);
}

// ---------- base platform ----------
cube(-10, -1, -7, 10, -1, 7, STONE);
cube(-11, -2, -8, 11, -2, 8, COBBLE);
// energon glow ring
hollowCube(-9, -1, -6, 9, -1, 6, GLASS);

// ============================================================
//  LEGS  (Y 0..16)
// ============================================================
// -- feet --
sym(-7, 0, -5, -1, 2, 3, STONE);          // silver boot
sym(-7, 0, -5, -1, 1, -3, BRICK);         // red toe cap
sym(-7, 0, 2, -1, 2, 3, STONE);           // heel
sym(-6, 2, -3, -2, 2, 1, BRICK);          // ankle collar (red)

// -- shins (blue) --
sym(-6, 3, -3, -2, 10, 1, GLASS);
sym(-6, 8, -4, -2, 10, -4, STONE);        // shin guard front lip
sym(-6, 3, -4, -2, 5, -4, BRICK);         // lower shin red trim
// knee joint
sym(-6, 10, -3, -2, 12, 1, STONE);
sym(-6, 11, -4, -2, 12, -3, BRICK);       // kneecap

// -- thighs (blue) --
sym(-6, 12, -3, -2, 16, 1, GLASS);
sym(-6, 13, -4, -2, 15, -4, BRICK);       // thigh armor plate

// ============================================================
//  PELVIS / WAIST  (Y 17..20)
// ============================================================
cube(-6, 17, -3, 6, 20, 2, STONE);
cube(-2, 17, -4, 2, 19, -3, BRICK);       // codpiece (red)
sym(-6, 17, -3, -5, 20, 2, BRICK);        // hip pods (red)
cube(-5, 20, -3, 5, 20, 2, COBBLE);       // belt line

// ============================================================
//  TORSO / CHEST  (Y 20..26)  — the truck cab
// ============================================================
cube(-7, 20, -3, 7, 26, 3, BRICK);        // red chest block
cube(-5, 20, -3, 5, 21, 3, STONE);        // silver abdomen band
// grille lines on abdomen
for (let gx = -4; gx <= 4; gx += 2) block(gx, 20, -4, COBBLE);
cube(-7, 20, -4, 7, 21, -4, COBBLE);

// windshield windows (blue glass, split cab)
sym(-6, 22, -4, -2, 25, -4, GLASS);
sym(-6, 22, -3, -2, 25, -3, GLASS);
block(0, 22, -4, STONE);                  // center pillar between windows
block(0, 23, -4, STONE);
block(0, 24, -4, STONE);
block(0, 25, -4, STONE);

// Autobot insignia (silver face) low-center chest
cube(-2, 20, -4, 2, 21, -4, SNOW);
block(-1, 21, -4, SNOW); block(1, 21, -4, SNOW);
block(0, 20, -5, SNOW);

// chest side vents
sym(-7, 22, -3, -7, 25, 3, STONE);

// ============================================================
//  SHOULDERS + ARMS
// ============================================================
// pauldrons (red, wide)
sym(7, 24, -3, 10, 27, 3, BRICK);
sym(8, 27, -2, 10, 27, 2, BRICK);         // rounded top
sym(7, 24, -4, 9, 26, -4, COBBLE);        // shoulder trim

// smokestacks (silver, behind shoulders) — Optimus trademark
sym(8, 27, 3, 10, 31, 5, STONE);
sym(8, 31, 4, 9, 32, 4, COBBLE);          // stack caps

// upper arms (blue)
sym(8, 20, -2, 10, 25, 2, GLASS);
// elbow
sym(8, 19, -2, 10, 20, 2, STONE);
sym(8, 18, -3, 10, 19, -3, BRICK);        // elbow guard
// forearms (silver)
sym(8, 13, -2, 10, 19, 2, STONE);
sym(8, 15, -3, 10, 17, -3, BRICK);        // forearm red band
// fists
sym(7, 11, -3, 11, 13, 3, STONE);
sym(8, 10, -2, 10, 11, 2, COBBLE);        // knuckles

// ---- ion blaster in right fist (points forward, -Z) ----
cube(8, 11, -9, 10, 13, -4, STONE);       // barrel
cube(8, 11, -10, 10, 12, -9, COBBLE);     // muzzle
cube(8, 10, -6, 10, 11, -5, STONE);       // under-grip

// ============================================================
//  NECK + HEAD  (Y 26..33)
// ============================================================
cube(-2, 26, -2, 2, 27, 2, STONE);        // neck

// helmet (blue)
cube(-4, 27, -3, 4, 32, 3, GLASS);
cube(-4, 32, -2, 4, 32, 2, GLASS);        // dome top
// helmet crest ridge (center)
cube(0, 27, -4, 0, 32, -4, BRICK);
block(0, 33, -1, GLASS); block(0, 33, 0, GLASS); block(0, 33, 1, GLASS);

// silver faceplate
cube(-3, 28, -4, 3, 31, -4, SNOW);
cube(-3, 28, -3, 3, 29, -3, STONE);       // mouth guard
// glowing blue eyes
block(-2, 30, -5, GLASS); block(-1, 30, -5, GLASS);
block(1, 30, -5, GLASS);  block(2, 30, -5, GLASS);
block(-2, 30, -4, GLASS); block(2, 30, -4, GLASS);
// brow
cube(-3, 31, -5, 3, 31, -5, STONE);

// side head "ears" / audio receptors
sym(-5, 28, -1, -5, 31, 1, STONE);
sym(-6, 29, 0, -5, 30, 0, COBBLE);

// twin head antennae (angle up-out)
sym(-4, 32, 0, -4, 32, 0, STONE);
sym(-5, 33, 0, -5, 33, 0, STONE);
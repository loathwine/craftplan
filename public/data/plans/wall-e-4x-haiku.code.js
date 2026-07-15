// wall-e-4x-haiku — prompt:
// Wall-E...

// Wall-E - Iconic trash-collecting robot
// Camera position: NORTH (looking south toward +Z)
// Facing north, body extends south

// === MAIN BODY STRUCTURE ===
cube(-5, 0, -1, 5, 10, 7, 3); // STONE main chassis

// Body segmentation bands - horizontal divisions
cube(-5, 2, -1, 5, 3, 7, 8); // COBBLE band 1
cube(-5, 5, -1, 5, 6, 7, 8); // COBBLE band 2
cube(-5, 8, -1, 5, 9, 7, 8); // COBBLE band 3

// Body side panels - asymmetric detail
cube(-6, 1, 1, -5, 9, 6, 8); // Left side accent
cube(5, 1, 1, 6, 9, 6, 8); // Right side accent

// === TREADS - Heavy-duty tank-style caterpillar tracks ===
// Left tread assembly
cube(-8, -2, -1, -6, 2, 8, 8); // COBBLE left track main
cube(-8, 0, 0, -7, 1, 7, 4); // OAK_LOG left belt detail

// Right tread assembly
cube(6, -2, -1, 8, 2, 8, 8); // COBBLE right track main
cube(7, 0, 0, 8, 1, 7, 4); // OAK_LOG right belt detail

// Tread sprocket wheels (evenly spaced)
cylinder(-7, -1, 1, 1.3, 4, 4); // Left wheel 1
cylinder(-7, -1, 4, 1.3, 4, 4); // Left wheel 2
cylinder(-7, -1, 6, 1.3, 4, 4); // Left wheel 3

cylinder(7, -1, 1, 1.3, 4, 4); // Right wheel 1
cylinder(7, -1, 4, 1.3, 4, 4); // Right wheel 2
cylinder(7, -1, 6, 1.3, 4, 4); // Right wheel 3

// === HEAD / UPPER CABIN ===
cube(-4, 10, 0, 4, 14, 6, 10); // BRICK cabin/head

// Cabin detailing
cube(-4, 14, 1, 4, 15, 5, 8); // COBBLE roof rim
cube(-3, 10, 5, 3, 11, 6, 8); // COBBLE cabin edge

// === FACE - Eyes and display (front-facing toward -Z) ===
// Large expressive left eye
cube(-3, 11, -2, -1, 13, -2, 11); // GLASS left eye

// Large expressive right eye
cube(1, 11, -2, 3, 13, -2, 11); // GLASS right eye

// Central display/monitor
cube(-2, 10, -2, 2, 11, -2, 11); // GLASS main screen

// Screen surround
cube(-4, 9, -2, 4, 15, -2, 8); // COBBLE screen frame

// === ARTICULATED ARMS ===
// Left arm - upper section
cube(-9, 6, 1, -6, 8, 5, 4); // OAK_LOG upper left arm

// Left arm - lower section (jointed)
cube(-10, 4, 0, -8, 6, 4, 3); // STONE lower left arm

// Left claw/gripper base
cube(-12, 2, 1, -10, 5, 3, 8); // COBBLE claw assembly

// Left claw fingers (two-pronged grabber)
cube(-13, 1, 0, -12, 3, 1, 8); // Finger 1
cube(-13, 1, 2, -12, 3, 3, 8); // Finger 2

// Right arm - upper section
cube(6, 6, 1, 9, 8, 5, 4); // OAK_LOG upper right arm

// Right arm - lower section
cube(8, 4, 0, 10, 6, 4, 3); // STONE lower right arm

// Right claw/gripper base
cube(10, 2, 1, 12, 5, 3, 8); // COBBLE claw assembly

// Right claw fingers
cube(12, 1, 0, 13, 3, 1, 8); // Finger 1
cube(12, 1, 2, 13, 3, 3, 8); // Finger 2

// === BACK COLLECTOR BIN ===
cube(-5, 3, 7, 5, 9, 8, 10); // BRICK trash collection area
cube(-4, 4, 8, 4, 8, 8, 8); // COBBLE collector panel

// === DECORATIVE DETAILS & MECHANICAL CHARACTER ===
// Top sensor post
cube(-1, 15, 3, 1, 17, 4, 3); // STONE antenna/sensor mast

// Front base accent stripe
cube(-5, 0, -1, 5, 1, 0, 7); // PLANKS front trim

// Undercarriage reinforcement bar
cube(-6, -1, 3, 6, 0, 5, 8); // COBBLE support bar

// Body corner reinforcement (asymmetric interest)
cube(-5, 0, 6, -4, 2, 7, 8); // Left corner detail
cube(4, 0, 6, 5, 2, 7, 8); // Right corner detail

// Center body accent panel
cube(-1, 3, -1, 1, 8, -1, 7); // PLANKS vertical stripe center

// Cabin side vents
cube(-4, 12, 1, -3, 13, 2, 8); // Left vent
cube(3, 12, 1, 4, 13, 2, 8); // Right vent

// Bottom chassis details
cube(-5, -1, 0, -3, 0, 2, 8); // Left foot
cube(3, -1, 0, 5, 0, 2, 8); // Right foot
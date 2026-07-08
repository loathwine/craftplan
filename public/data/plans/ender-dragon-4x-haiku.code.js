// ender-dragon-4x-haiku — prompt:
// the Ender Dragon...

// Ender Dragon - Minecraft boss
// Faces north (-Z), body extends south (+Z)

// ===== HEAD (North-facing) =====
cube(-5, 8, -9, 5, 16, 1, STONE);
cube(-3, 9, -12, 3, 14, -9, STONE);

// Forehead ridge
cube(-6, 17, -7, 6, 19, -5, COBBLE);

// Eyes - haunting gaze
sphere(-2, 12, -8, 1.3, GLASS);
sphere(2, 12, -8, 1.3, GLASS);

// Eye sockets
cube(-3, 11, -7, -1, 13, -6, STONE);
cube(1, 11, -7, 3, 13, -6, STONE);

// Mouth opening
cube(-2, 9, -11, 2, 10, -9, AIR);

// Jaw structure
cube(-5, 7, -10, 5, 9, -9, COBBLE);

// Upper fangs
cube(-2, 11, -13, 2, 13, -12, STONE);

// Horns - curved spikes
cube(-6, 19, -6, -4, 22, -3, STONE);
cube(4, 19, -6, 6, 22, -3, STONE);

// ===== NECK =====
cube(-4, 6, -1, 4, 15, 6, STONE);

// Neck ridges
cube(-6, 14, 0, -5, 17, 3, COBBLE);
cube(5, 14, 0, 6, 17, 3, COBBLE);

// ===== BODY (Main barrel) =====
cube(-7, 5, 6, 7, 14, 18, STONE);

// Chest detail
cube(-6, 6, 5, 6, 13, 7, COBBLE);

// Ribs
cube(-8, 7, 8, 8, 12, 8, COBBLE);
cube(-8, 7, 11, 8, 12, 11, COBBLE);
cube(-8, 7, 14, 8, 12, 14, COBBLE);
cube(-8, 7, 17, 8, 12, 17, COBBLE);

// ===== SPINE (Dorsal ridge) =====
cube(-2, 16, 0, 2, 19, 2, STONE);
cube(-2, 16, 4, 2, 19, 6, COBBLE);
cube(-2, 16, 8, 2, 19, 10, STONE);
cube(-2, 16, 12, 2, 19, 14, COBBLE);
cube(-2, 16, 16, 2, 19, 18, STONE);

// ===== WINGS (Large bat-like) =====
// Left wing main structure
cube(-16, 8, 5, -8, 15, 8, STONE);
cube(-18, 6, 9, -8, 12, 12, STONE);
cube(-19, 4, 13, -8, 10, 16, STONE);
cube(-17, 3, 17, -8, 8, 20, STONE);

// Right wing main structure
cube(8, 8, 5, 16, 15, 8, STONE);
cube(8, 6, 9, 18, 12, 12, STONE);
cube(8, 4, 13, 19, 10, 16, STONE);
cube(8, 3, 17, 17, 8, 20, STONE);

// Wing membranes (glass for ethereal effect)
cube(-15, 7, 6, -9, 14, 10, GLASS);
cube(9, 7, 6, 15, 14, 10, GLASS);

// Wing webbing detail
cube(-17, 5, 11, -9, 11, 15, GLASS);
cube(9, 5, 11, 17, 11, 15, GLASS);

// ===== LEGS (Four pillars) =====
// Front-left leg
cube(-5, 0, 3, -2, 7, 6, STONE);
cube(-6, -2, 3, -1, 1, 6, COBBLE);

// Front-right leg
cube(2, 0, 3, 5, 7, 6, STONE);
cube(1, -2, 3, 6, 1, 6, COBBLE);

// Back-left leg
cube(-5, 0, 14, -2, 7, 17, STONE);
cube(-6, -2, 14, -1, 1, 17, COBBLE);

// Back-right leg
cube(2, 0, 14, 5, 7, 17, STONE);
cube(1, -2, 14, 6, 1, 17, COBBLE);

// Clawed feet
cube(-6, -1, 2, -1, 0, 7, STONE);
cube(1, -1, 2, 6, 0, 7, STONE);
cube(-6, -1, 13, -1, 0, 18, STONE);
cube(1, -1, 13, 6, 0, 18, STONE);

// ===== TAIL (Long whip) =====
cube(-4, 7, 19, 4, 12, 22, STONE);

// Tail spikes - diminishing
cube(-1, 13, 18, 1, 16, 18, COBBLE);
cube(-1, 12, 20, 1, 15, 20, COBBLE);
cube(-1, 11, 22, 1, 14, 22, COBBLE);

// Tail tip
cube(-2, 9, 21, 2, 11, 22, COBBLE);

// ===== DECORATIVE DETAILS =====
// Chin spikes
cube(-3, 9, 3, -1, 13, 4, COBBLE);
cube(1, 9, 3, 3, 13, 4, COBBLE);

// Nostril cavities
cube(-2, 11, -12, 0, 12, -11, AIR);
cube(0, 11, -12, 2, 12, -11, AIR);

// Back spikes along body
cube(-3, 15, 6, -2, 18, 6, STONE);
cube(2, 15, 6, 3, 18, 6, STONE);
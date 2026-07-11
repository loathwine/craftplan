// space-shuttle-4x-haiku — prompt:
// the Space Shuttle on its launchpad...

const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, OAK_LOG = 4, LEAVES = 5;
const SAND = 6, PLANKS = 7, COBBLE = 8, BRICK = 10, GLASS = 11, SNOW = 12, ICE = 13;

// Massive concrete launch pad deck
cube(-20, -2, -18, 20, 0, 18, STONE);
cube(-20, 0, -18, 20, 2, 18, COBBLE);

// Pad perimeter wall/curbing
cube(-21, 0, -19, -20, 3, 19, COBBLE);
cube(20, 0, -19, 21, 3, 19, COBBLE);
cube(-21, 0, -19, 21, 3, -18, COBBLE);
cube(-21, 0, 18, 21, 3, 19, COBBLE);

// ============ EXTERNAL TANK (Orange) ============
// Main fuel tank cylinder - the central orange structure
const etX = 0, etZ = 0;
cylinder(etX, 0, etZ, 5, 18, BRICK);

// Upper section of ET (tapered)
cylinder(etX, 18, etZ, 4.5, 2, BRICK);
cylinder(etX, 20, etZ, 3.5, 2, BRICK);
sphere(etX, 23, etZ, 2.5, BRICK);

// ET structural bands/rings
cube(etX - 5.2, 5, etZ - 5.2, etX + 5.2, 5.8, etZ + 5.2, STONE);
cube(etX - 5.2, 11, etZ - 5.2, etX + 5.2, 11.8, etZ + 5.2, STONE);
cube(etX - 5.2, 17, etZ - 5.2, etX + 5.2, 17.8, etZ + 5.2, STONE);

// ============ SOLID ROCKET BOOSTERS (White) ============
// Left SRB
const sL_x = -7, sL_z = 0.5;
cylinder(sL_x, 0, sL_z, 2.8, 18, SNOW);
cylinder(sL_x, 18, sL_z, 2.3, 2, SNOW);
sphere(sL_x, 20.5, sL_z, 2, SNOW);
cube(sL_x - 3.2, 0, sL_z - 3.2, sL_x + 3.2, 1.2, sL_z + 3.2, STONE);

// Right SRB
const sR_x = 7, sR_z = 0.5;
cylinder(sR_x, 0, sR_z, 2.8, 18, SNOW);
cylinder(sR_x, 18, sR_z, 2.3, 2, SNOW);
sphere(sR_x, 20.5, sR_z, 2, SNOW);
cube(sR_x - 3.2, 0, sR_z - 3.2, sR_x + 3.2, 1.2, sR_z + 3.2, STONE);

// ============ ORBITER ============
const orb_x = 0, orb_z = 5, orb_y = 19;

// Main fuselage body
cube(orb_x - 2.5, orb_y, orb_z - 7, orb_x + 2.5, orb_y + 3, orb_z + 8, COBBLE);

// Upper fuselage taper
cube(orb_x - 2.2, orb_y + 3, orb_z - 6, orb_x + 2.2, orb_y + 3.8, orb_z + 7, COBBLE);

// Port wing (left)
cube(orb_x - 7, orb_y + 0.5, orb_z - 1, orb_x - 2.5, orb_y + 1.5, orb_z + 4, COBBLE);
// Wing strakes/leading edge
cube(orb_x - 7.5, orb_y + 0.8, orb_z, orb_x - 7, orb_y + 1.3, orb_z + 3, STONE);

// Starboard wing (right)
cube(orb_x + 2.5, orb_y + 0.5, orb_z - 1, orb_x + 7, orb_y + 1.5, orb_z + 4, COBBLE);
// Wing strakes/leading edge
cube(orb_x + 7, orb_y + 0.8, orb_z, orb_x + 7.5, orb_y + 1.3, orb_z + 3, STONE);

// Vertical stabilizer/tail fin
cube(orb_x - 0.8, orb_y + 3.2, orb_z + 7, orb_x + 0.8, orb_y + 6.5, orb_z + 8.5, COBBLE);

// Cockpit nose cone
cube(orb_x - 1.8, orb_y + 2.5, orb_z - 8, orb_x + 1.8, orb_y + 4.2, orb_z - 5.5, COBBLE);
cube(orb_x - 1.5, orb_y + 3.2, orb_z - 8.5, orb_x + 1.5, orb_y + 3.9, orb_z - 5, GLASS);

// Flight deck windows (large forward viewports)
cube(orb_x - 1.6, orb_y + 2.8, orb_z - 6.5, orb_x + 1.6, orb_y + 3.8, orb_z - 6, GLASS);

// Mid-deck windows (payload ops)
cube(orb_x - 2.3, orb_y + 2, orb_z + 1, orb_x - 2, orb_y + 2.8, orb_z + 3, GLASS);
cube(orb_x + 2, orb_y + 2, orb_z + 1, orb_x + 2.3, orb_y + 2.8, orb_z + 3, GLASS);

// Payload bay doors (internal) - slight offset indicating closure gap
cube(orb_x - 2.4, orb_y + 1.3, orb_z + 0.5, orb_x - 2.1, orb_y + 2.7, orb_z + 5, GLASS);
cube(orb_x + 2.1, orb_y + 1.3, orb_z + 0.5, orb_x + 2.4, orb_y + 2.7, orb_z + 5, GLASS);

// OMS (Orbital Maneuvering System) pods - tail mounted
cube(orb_x - 2.8, orb_y + 3.5, orb_z + 6.5, orb_x - 1.8, orb_y + 4.8, orb_z + 8, GLASS);
cube(orb_x + 1.8, orb_y + 3.5, orb_z + 6.5, orb_x + 2.8, orb_y + 4.8, orb_z + 8, GLASS);

// RCS (Reaction Control System) thrusters - quad arrangement
cube(orb_x - 2.5, orb_y + 3.8, orb_z + 5.5, orb_x - 2.2, orb_y + 4.2, orb_z + 6.2, GLASS);
cube(orb_x + 2.2, orb_y + 3.8, orb_z + 5.5, orb_x + 2.5, orb_y + 4.2, orb_z + 6.2, GLASS);

// Main engines (3x Space Shuttle Main Engines - SSME)
// Mount the engines at the aft end
cube(orb_x - 1.8, orb_y - 0.8, orb_z + 7.5, orb_x - 0.6, orb_y + 1.2, orb_z + 8.8, STONE);
cube(orb_x + 0.6, orb_y - 0.8, orb_z + 7.5, orb_x + 1.8, orb_y + 1.2, orb_z + 8.8, STONE);
cube(orb_x - 0.6, orb_y - 1.2, orb_z + 7.8, orb_x + 0.6, orb_y + 0.8, orb_z + 9, COBBLE);

// Engine bells (nozzles)
cube(orb_x - 2, orb_y - 1.5, orb_z + 8.5, orb_x - 1.6, orb_y - 0.8, orb_z + 9.5, COBBLE);
cube(orb_x + 1.6, orb_y - 1.5, orb_z + 8.5, orb_x + 2, orb_y - 0.8, orb_z + 9.5, COBBLE);
cube(orb_x - 0.8, orb_y - 2, orb_z + 8.8, orb_x + 0.8, orb_y - 1.2, orb_z + 9.8, COBBLE);

// Landing gear (triple configuration)
// Nose gear
cube(orb_x - 0.4, -0.5, orb_z - 8, orb_x + 0.4, orb_y - 3, orb_z - 6.5, OAK_LOG);
cube(orb_x - 0.8, -1.2, orb_z - 8.5, orb_x + 0.8, -0.5, orb_z - 6, STONE);

// Main landing gear - port
cube(orb_x - 3, -0.5, orb_z + 4, orb_x - 2.2, orb_y - 3, orb_z + 6, OAK_LOG);
cube(orb_x - 3.5, -1.2, orb_z + 3.5, orb_x - 1.7, -0.5, orb_z + 6.5, STONE);

// Main landing gear - starboard
cube(orb_x + 2.2, -0.5, orb_z + 4, orb_x + 3, orb_y - 3, orb_z + 6, OAK_LOG);
cube(orb_x + 1.7, -1.2, orb_z + 3.5, orb_x + 3.5, -0.5, orb_z + 6.5, STONE);

// ============ STRUCTURAL ATTACHMENTS ============
// External Tank to Orbiter attachment points
line(orb_x - 2.2, 19.5, orb_z - 1, etX - 1, 18, etZ, OAK_LOG);
line(orb_x + 2.2, 19.5, orb_z - 1, etX + 1, 18, etZ, OAK_LOG);
line(orb_x - 2.2, 19.5, orb_z + 3, etX - 2, 17, etZ + 1, OAK_LOG);
line(orb_x + 2.2, 19.5, orb_z + 3, etX + 2, 17, etZ + 1, OAK_LOG);

// ET to SRB struts (multiple levels)
line(etX - 1.5, 6, etZ - 2, sL_x + 1.5, 6, sL_z - 2, OAK_LOG);
line(etX - 1.5, 6, etZ + 2, sL_x + 1.5, 6, sL_z + 2, OAK_LOG);
line(etX + 1.5, 6, etZ - 2, sR_x - 1.5, 6, sR_z - 2, OAK_LOG);
line(etX + 1.5, 6, etZ + 2, sR_x - 1.5, 6, sR_z + 2, OAK_LOG);

line(etX - 2, 12, etZ - 3, sL_x + 2, 12, sL_z - 3, OAK_LOG);
line(etX - 2, 12, etZ + 3, sL_x + 2, 12, sL_z + 3, OAK_LOG);
line(etX + 2, 12, etZ - 3, sR_x - 2, 12, sR_z - 3, OAK_LOG);
line(etX + 2, 12, etZ + 3, sR_x - 2, 12, sR_z + 3, OAK_LOG);

// ============ LAUNCH TOWER (Mobile Launcher Platform tower) ============
const twrX = 16, twrZ = -1;

// Four main support legs
cube(twrX - 2, 0, twrZ - 2, twrX - 0.8, 24, twrZ - 0.8, COBBLE);
cube(twrX - 2, 0, twrZ + 0.8, twrX - 0.8, 24, twrZ + 2, COBBLE);
cube(twrX + 0.8, 0, twrZ - 2, twrX + 2, 24, twrZ - 0.8, COBBLE);
cube(twrX + 0.8, 0, twrZ + 0.8, twrX + 2, 24, twrZ + 2, COBBLE);

// Tower base platform with railings
cube(twrX - 4, 0, twrZ - 4, twrX + 4, 1.5, twrZ + 4, PLANKS);
cube(twrX - 4, 1.2, twrZ - 4.5, twrX + 4, 2, twrZ - 4, COBBLE);
cube(twrX - 4, 1.2, twrZ + 4, twrX + 4, 2, twrZ + 4.5, COBBLE);
cube(twrX - 4.5, 1.2, twrZ - 4, twrX - 4, 2, twrZ + 4, COBBLE);
cube(twrX + 4, 1.2, twrZ - 4, twrX + 4.5, 2, twrZ + 4, COBBLE);

// Horizontal tower bracing at multiple levels
cube(twrX - 3.5, 5.5, twrZ - 1.5, twrX - 0.8, 6.3, twrZ + 1.5, COBBLE);
cube(twrX + 0.8, 5.5, twrZ - 1.5, twrX + 3.5, 6.3, twrZ + 1.5, COBBLE);

cube(twrX - 3.5, 11.5, twrZ - 1.5, twrX - 0.8, 12.3, twrZ + 1.5, COBBLE);
cube(twrX + 0.8, 11.5, twrZ - 1.5, twrX + 3.5, 12.3, twrZ + 1.5, COBBLE);

cube(twrX - 3.5, 17.5, twrZ - 1.5, twrX - 0.8, 18.3, twrZ + 1.5, COBBLE);
cube(twrX + 0.8, 17.5, twrZ - 1.5, twrX + 3.5, 18.3, twrZ + 1.5, COBBLE);

cube(twrX - 3.5, 23, twrZ - 1.5, twrX - 0.8, 23.8, twrZ + 1.5, COBBLE);
cube(twrX + 0.8, 23, twrZ - 1.5, twrX + 3.5, 23.8, twrZ + 1.5, COBBLE);

// Diagonal X-bracing for tower rigidity
line(twrX - 1.5, 8, twrZ - 1, twrX + 1.5, 9.5, twrZ + 1, STONE);
line(twrX + 1.5, 8, twrZ - 1, twrX - 1.5, 9.5, twrZ + 1, STONE);
line(twrX - 1.5, 14.5, twrZ - 1, twrX + 1.5, 16, twrZ + 1, STONE);
line(twrX + 1.5, 14.5, twrZ - 1, twrX - 1.5, 16, twrZ + 1, STONE);
line(twrX - 1.5, 20.5, twrZ - 1, twrX + 1.5, 22, twrZ + 1, STONE);
line(twrX + 1.5, 20.5, twrZ - 1, twrX - 1.5, 22, twrZ + 1, STONE);

// Orbiter access arm - extends from tower toward shuttle nose
cube(twrX - 13, 17, twrZ - 0.8, twrX - 0.8, 17.8, twrZ + 0.8, PLANKS);
cube(twrX - 13, 16.8, twrZ - 1.2, twrX - 0.8, 17.2, twrZ + 1.2, COBBLE);

// Access arm support posts
cube(twrX - 11, 15.5, twrZ - 0.5, twrX - 10, 17, twrZ + 0.5, OAK_LOG);
cube(twrX - 7, 15.5, twrZ - 0.5, twrX - 6, 17, twrZ + 0.5, OAK_LOG);
cube(twrX - 3, 15.5, twrZ - 0.5, twrX - 2, 17, twrZ + 0.5, OAK_LOG);

// Service platforms on tower
cube(twrX - 12, 6, twrZ - 2.5, twrX - 1, 7, twrZ + 2.5, PLANKS);
cube(twrX - 12, 12, twrZ - 2.5, twrX - 1, 13, twrZ + 2.5, PLANKS);
cube(twrX - 12, 18, twrZ - 2.5, twrX - 1, 19, twrZ + 2.5, PLANKS);

// Platform safety railings
cube(twrX - 12.5, 7, twrZ - 3, twrX - 1, 7.8, twrZ - 2.5, PLANKS);
cube(twrX - 12.5, 13, twrZ - 3, twrX - 1, 13.8, twrZ - 2.5, PLANKS);
cube(twrX - 12.5, 19, twrZ - 3, twrX - 1, 19.8, twrZ - 2.5, PLANKS);

// ============ UMBILICAL/SERVICE TOWER (West side) ============
const utX = -16, utZ = -1;

cube(utX - 1.5, 0, utZ - 1.5, utX + 1.5, 22, utZ + 1.5, COBBLE);

// Umbilical base platform
cube(utX - 4, 0, utZ - 4, utX + 4, 1.2, utZ + 4, PLANKS);
cube(utX - 4, 0.8, utZ - 4.5, utX + 4, 1.6, utZ - 4, COBBLE);

// Service platforms and umbilical connections
cube(utX - 9, 7, utZ - 1.5, utX - 1.5, 8, utZ + 1.5, PLANKS);
cube(utX - 9, 13, utZ - 1.5, utX - 1.5, 14, utZ + 1.5, PLANKS);
cube(utX - 9, 19, utZ - 1.5, utX - 1.5, 20, utZ + 1.5, PLANKS);

// ============ FLAME DEFLECTOR / SOUND SUPPRESSION ============
cube(-14, -1.8, -12, 14, -0.5, -9, BRICK);
cube(-14, -2.5, -12, 14, -1.8, -9, COBBLE);

// Water deluge system channels
cube(-12, 1.5, -10, -8, 2.2, -8.5, PLANKS);
cube(8, 1.5, -10, 12, 2.2, -8.5, PLANKS);

// ============ CABLE/UMBILICAL RUNS ============
line(utX + 1, 9, utZ, etX - 3, 9, etZ, STONE);
line(utX + 1, 15, utZ, etX - 3, 15, etZ, STONE);
line(twrX - 1, 9, twrZ, etX + 3, 9, etZ, STONE);
line(twrX - 1, 15, twrZ, etX + 3, 15, etZ, STONE);

// ============ DETAILED ORBITER THERMAL PROTECTION ============
// Undercarriage tiles
cube(orb_x - 2.3, orb_y - 0.3, orb_z - 4, orb_x - 0.5, orb_y + 0.2, orb_z - 2, STONE);
cube(orb_x + 0.5, orb_y - 0.3, orb_z - 4, orb_x + 2.3, orb_y + 0.2, orb_z - 2, STONE);
cube(orb_x - 2.3, orb_y - 0.3, orb_z + 1.5, orb_x + 2.3, orb_y + 0.2, orb_z + 3.5, STONE);

// Cargo bay thermal radiators (deployable panels)
cube(orb_x - 7.3, orb_y + 1.2, orb_z + 1.5, orb_x - 7, orb_y + 3, orb_z + 4.5, GLASS);
cube(orb_x + 7, orb_y + 1.2, orb_z + 1.5, orb_x + 7.3, orb_y + 3, orb_z + 4.5, GLASS);

// ============ PAD SUPPORT STRUCTURE ============
// Reinforced concrete pedestal areas under assembly
cube(-8, -1.2, -4, -2, 0, 2, COBBLE);
cube(2, -1.2, -4, 8, 0, 2, COBBLE);
cube(-8, -1.2, -10, 8, 0, -6, COBBLE);
cube(-8, -1.2, 4, 8, 0, 8, COBBLE);

// Pad deck utilities/trunking
cube(-10, 1.8, -6, -8, 2.5, -4, PLANKS);
cube(8, 1.8, -6, 10, 2.5, -4, PLANKS);
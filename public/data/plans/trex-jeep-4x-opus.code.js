// trex-jeep-4x-opus — prompt:
// a T-Rex chasing a jeep...

// T-Rex chasing a jeep — side-profile chase running west→east (+X).
// Camera is due north looking south, so the near flank (-Z) is the lit,
// camera-facing side. All faces / eye / near legs live at negative Z.
// T-Rex (gray, JP-style) at the west end, head lunging east toward the
// fleeing red safari jeep, dust and flung luggage between them.

const S = STONE, C = COBBLE, W = SNOW, R = BRICK, G = GLASS, P = PLANKS, L = OAK_LOG, D = DIRT, SD = SAND, LV = LEAVES;

// ---------------------------------------------------------------
// GROUND — churned dirt chase-trail cut through the grass
// ---------------------------------------------------------------
cube(-22, 0, -3, 22, 0, 6, D);                 // torn earth path
const clods = [[-19,-2],[-16,4],[-13,-1],[-11,5],[-8,2],[-4,-2],[-1,5],[3,1],[7,-2],[11,4],[15,-1],[18,5],[20,2]];
for (const [x,z] of clods){ block(x,0,z,SD); block(x,1,z,SD); }   // kicked-up clumps
const sandPatch = [[-18,1],[-14,3],[-10,-2],[-6,4],[-2,0],[2,4],[6,-1],[10,2],[14,4],[17,-2],[21,3]];
for (const [x,z] of sandPatch){ block(x,0,z,SD); }

// ---------------------------------------------------------------
// T-REX  (profile, facing east; tail west at ~x=-22, head east at ~x=+11)
// ---------------------------------------------------------------

// --- Tail: thick at base, lifting and tapering to the west ---
cube(-14, 7, -2, -10, 11, 1, S);
cube(-18, 7, -1, -14, 10, 1, S);
cube(-21, 8, -1, -18, 10, 0, S);
cube(-22, 9,  0, -21, 10, 0, S);
cube(-14, 7, -2, -10, 7, 1, C);                // tail underside shade
cube(-18, 7, -1, -14, 7, 1, C);

// --- Torso ---
cube(-10, 6, -2, -1, 13, 2, S);                // main body
cube(-8,  5, -2, -4, 10, 2, S);                // hip bulge
cube(-10, 6, -2, -1, 7, 2, C);                 // belly / underside shade
cube(-1,  9, -2,  2, 13, 1, S);                // chest into neck

// --- Neck ---
cube(0, 11, -1, 4, 16, 1, S);

// --- Head / open roaring jaws (mouth gap y=9..11) ---
cube(4, 12, -2, 9, 17, 1, S);                  // skull
cube(8, 12, -2, 11, 13, 1, S);                 // upper snout
cube(6, 7,  -2, 11, 8, 1, C);                  // dropped lower jaw
block(10, 13, -2, S);                          // nostril bridge
cube(5, 16, -2, 7, 16, -2, S);                 // brow ridge (near side)
block(6, 15, -2, R); block(6, 15, -1, R);      // glaring eye
// interior + teeth
cube(6, 9, -1, 9, 10, 0, R);                   // red mouth interior / tongue
for (const x of [8,9,10]) { block(x,11,-2,W); block(x,11,-1,W); }   // upper fangs
for (const x of [7,8,9,10]) { block(x,9,-2,W); block(x,9,-1,W); }   // lower fangs

// --- Dorsal spikes (ridge from tail to head) ---
const ridge = [[-19,11],[-16,11],[-13,12],[-10,14],[-7,15],[-4,15],[-1,14],[2,15],[4,18]];
for (const [x,y] of ridge){ block(x,y,0,W); block(x,y-1,0,S); }

// --- Near flank mottled spots (camera side) ---
const spots = [[-8,11],[-6,9],[-4,12],[-3,8],[-7,7],[-5,10],[-2,11],[-9,10],[-1,9]];
for (const [x,y] of spots) block(x,y,-2,C);

// --- Tiny arms with claws ---
cube(-1, 9, -2, 1, 10, -2, C); block(2,9,-2,W); block(2,10,-2,W);   // near arm
cube(-1, 9,  2, 1, 10,  2, C); block(2,9,2,W);                       // far arm

// --- Hind legs (mid-stride) ---
// near leg (camera side) striding forward
cube(-6, 3, -2, -3, 10, -1, S);                // thigh
cube(-4, 0, -2, -2,  4, -1, S);                // shin
cube(-4, 0, -3, -1,  0, -1, C);                // foot
block(0,0,-2,W); block(0,0,-1,W); block(-1,0,-3,W);   // claws
// far leg pushing off behind
cube(-9, 3, 1, -6, 10, 2, C);                  // thigh
cube(-9, 0, 1, -7,  5, 2, C);                  // shin
cube(-10,0, 1, -7,  0, 2, C);                  // foot
block(-6,0,2,W); block(-10,0,1,W);             // claws

// ---------------------------------------------------------------
// JEEP  (red safari jeep, fleeing east; x≈12..21)
// ---------------------------------------------------------------
cube(12, 1, -2, 21, 1, 2, S);                  // chassis / bumper frame
cube(12, 2, -2, 20, 4, 2, R);                  // body tub
cube(19, 2, -2, 21, 3, 2, R);                  // hood
block(21, 3, -2, S); block(21, 2, -2, S);      // front grille (near)
block(21, 4, -2, W); block(21, 4, 2, W);       // headlights
block(12, 4, -2, R); block(12, 4, 2, R);       // taillights
cube(11, 2, -1, 11, 4, 1, C);                  // spare tire on tailgate

// roll cage
cube(13, 5, -2, 13, 6, -2, S); cube(13, 5, 2, 13, 6, 2, S);   // rear posts
cube(17, 5, -2, 17, 5, -2, S); cube(17, 5, 2, 17, 5, 2, S);   // front posts
cube(13, 6, -2, 18, 6, -2, S); cube(13, 6, 2, 18, 6, 2, S);   // top rails (near/far)
cube(13, 6, -2, 13, 6, 2, S);                                  // rear cross-rail
cube(18, 5, -2, 18, 5, 2, G);                                  // windshield

// interior + panicking driver
cube(13, 4, -1, 16, 4, 1, C);                  // seats
block(15, 5, -1, L); block(15, 6, -1, W);      // driver torso + head
block(16, 6, -1, W); block(16, 7, -1, W);      // arm flung up in panic

// wheels (COBBLE), sticking out on the near side (-Z)
cube(13, 0, -3, 14, 1, -2, C); cube(18, 0, -3, 19, 1, -2, C);   // near rear / front
cube(13, 0,  2, 14, 1,  3, C); cube(18, 0,  2, 19, 1,  3, C);   // far rear / front
for (const x of [13,18]){ block(x,0,-3,S); }   // hubcaps hint

// ---------------------------------------------------------------
// DUST & FLYING LUGGAGE between the jaws and the jeep
// ---------------------------------------------------------------
// suitcase + scattering papers bouncing out of the back
cube(9, 7, -1, 10, 8, 0, P); block(9,9,0,L);   // tumbling suitcase
const papers = [[8,9,1],[7,10,-1],[9,11,0],[10,12,1],[8,12,-2],[11,10,2]];
for (const [x,y,z] of papers) block(x,y,z,W);

// dust puffs kicked up behind wheels and rex feet (tan SAND)
const dust = [[10,1,-3],[11,2,3],[12,3,-3],[9,1,2],[16,1,4],[13,2,-4],
              [-11,1,-3],[-9,2,3],[-7,1,-4],[-12,2,2],[-5,1,-4],[-13,1,3],[-3,1,-4]];
for (const [x,y,z] of dust){ block(x,y,z,SD); block(x,y+1,z,SD); }

// ---------------------------------------------------------------
// BACKGROUND depth — rocks & a couple of dead trees far south (+Z)
// ---------------------------------------------------------------
sphere(-15, 1, 8, 2, S); sphere(-13, 1, 9, 1, C);     // rock cluster
sphere(6, 1, 9, 2, S); sphere(8, 2, 8, 1, S);         // rock cluster
sphere(19, 1, 8, 2, C);                               // rock
// bare dead trees
cube(-4, 1, 9, -4, 6, 9, L); block(-4,7,9,L); block(-5,5,9,L); block(-3,6,9,L);
cube(13, 1, 9, 13, 5, 9, L); block(14,5,9,L); block(12,4,9,L); block(13,6,9,L);
// warning sign, knocked askew
cube(2, 1, 7, 2, 4, 7, P); cube(1, 4, 7, 3, 5, 7, R); block(2,5,7,W);
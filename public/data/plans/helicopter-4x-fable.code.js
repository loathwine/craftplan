// helicopter-4x-fable — prompt:
// an attack helicopter...

// ATTACK HELICOPTER — combat scene: gunship hovering over the forest,
// firing rockets at a ruined compound (NE) and a burning tank (NW),
// chin-gun tracers, smoke columns, escort heli in the background.
// Nose faces NORTH (-Z) toward the camera.

const S = STONE, C = COBBLE, B = BRICK, G = GLASS, W = SNOW;

function dashed(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  for (let i = 0; i <= n; i++) {
    if (i % 3 === 2) continue;
    block(Math.round(x1 + (x2 - x1) * i / n),
          Math.round(y1 + (y2 - y1) * i / n),
          Math.round(z1 + (z2 - z1) * i / n), id);
  }
}

// ---- fitted air clears (trees out of the flight envelope / target sites) ----
cube(-13, 5, -16, 13, 16, 17, AIR);      // helicopter + rotor disk envelope
cube(11, 0, -22, 21, 10, -13, AIR);      // compound site NE
cube(-18, 0, -19, -10, 9, -11, AIR);     // tank site NW

// ================= GUNSHIP (hovering, center ~x0, nose z-13) =================
// main hull
cube(-2, 8, -7, 2, 11, 3, S);
cube(-1, 7, -6, 1, 7, 2, S);             // belly
cube(-1, 12, -6, 1, 12, 2, C);           // top deck
cube(-3, 9, -5, -3, 10, 1, C);           // armor cheeks
cube(3, 9, -5, 3, 10, 1, C);

// nose taper + sensor turret
cube(-2, 8, -10, 2, 10, -8, S);
cube(-1, 8, -12, 1, 9, -10, S);
cube(-1, 8, -13, 1, 8, -12, C);
block(0, 9, -13, C);
block(0, 9, -14, S);                     // targeting sensor boom

// stepped tandem canopy (glass overrides hull)
cube(-1, 10, -11, 1, 10, -9, G);
cube(-1, 11, -9, 1, 11, -7, G);
cube(-1, 12, -6, 1, 12, -4, G);

// chin cannon + muzzle flash
block(0, 7, -11, C);
block(0, 6, -11, C);
line(0, 6, -12, 0, 6, -15, C);
block(0, 6, -16, SAND);
block(1, 6, -16, SAND); block(-1, 6, -16, SAND);
block(0, 7, -16, SAND); block(0, 5, -16, SAND);

// stub wings + winglets
cube(-8, 10, -3, 8, 10, -1, S);
block(8, 11, -2, C); block(-8, 11, -2, C);

// rocket pods (red rocket faces toward camera)
cube(6, 9, -4, 7, 10, 0, C);  cube(6, 9, -5, 7, 10, -5, B);
cube(-7, 9, -4, -6, 10, 0, C); cube(-7, 9, -5, -6, 10, -5, B);

// hellfire missiles under wings
block(4, 9, -5, B);  line(4, 9, -4, 4, 9, -1, W);
block(5, 8, -4, B);  line(5, 8, -3, 5, 8, 0, W);
block(-4, 9, -5, B); line(-4, 9, -4, -4, 9, -1, W);
block(-5, 8, -4, B); line(-5, 8, -3, -5, 8, 0, W);

// engine nacelles + intakes + hot exhausts
cube(3, 11, -4, 4, 12, 1, C);  cube(3, 11, -5, 4, 12, -5, S);  cube(3, 11, 2, 4, 12, 2, B);
cube(-4, 11, -4, -3, 12, 1, C); cube(-4, 11, -5, -3, 12, -5, S); cube(-4, 11, 2, -3, 12, 2, B);

// rotor mast, hub, 4 wide blades (slightly rotated for motion)
block(0, 13, -2, C); block(0, 14, -2, C);
cube(-1, 15, -3, 1, 15, -1, C);
block(0, 16, -2, C);
line(0, 15, -2, 11, 15, 2, S);   line(0, 15, -1, 10, 15, 3, S);
line(0, 15, -2, -11, 15, -6, S); line(0, 15, -3, -10, 15, -7, S);
line(0, 15, -2, -4, 15, 9, S);   line(-1, 15, -2, -5, 15, 8, S);
line(0, 15, -2, 4, 15, -13, S);  line(1, 15, -2, 5, 15, -12, S);

// dashed motion-blur ring at blade tips
for (let i = 0; i < 72; i++) {
  if (i % 6 < 3) {
    const a = i / 72 * Math.PI * 2;
    block(Math.round(13 * Math.cos(a)), 15, Math.round(-2 + 13 * Math.sin(a)), W);
  }
}

// tail boom, stabilizer, fin
cube(-1, 9, 4, 1, 11, 6, S);
cube(-1, 10, 7, 1, 11, 10, S);
cube(0, 10, 11, 0, 11, 13, S);
cube(-3, 11, 10, 3, 11, 10, S);
block(3, 12, 10, C); block(-3, 12, 10, C);
cube(0, 10, 13, 0, 15, 14, S);
line(0, 12, 12, 0, 14, 13, C);
block(0, 16, 14, C);

// tail rotor (8-spoke spinning disk, east side)
block(1, 13, 14, C);
line(1, 10, 14, 1, 16, 14, S);
line(1, 13, 11, 1, 13, 17, S);
line(1, 11, 12, 1, 15, 16, S);
line(1, 15, 12, 1, 11, 16, S);

// landing gear (dangling in hover)
block(2, 7, -8, C); block(2, 6, -8, C);
block(-2, 7, -8, C); block(-2, 6, -8, C);
block(0, 9, 12, C); block(0, 8, 12, C);
block(0, 13, 1, C);                      // antenna

// ================= TARGET 1: ruined compound (NE), rocket impact =================
cube(12, -1, -22, 20, -1, -14, C);       // slab
cube(12, 0, -22, 20, 3, -22, C);         // north wall
cube(12, 0, -14, 20, 4, -14, C);         // south wall
cube(12, 0, -22, 12, 4, -14, C);         // west wall (faces the gunship)
cube(20, 0, -22, 20, 2, -14, C);         // east wall, blasted low
cube(18, 0, -22, 20, 7, -20, C);         // corner watchtower
// ragged battle damage
block(14, 3, -22, AIR); block(15, 3, -22, AIR); block(18, 3, -22, AIR);
block(15, 4, -14, AIR); block(16, 4, -14, AIR);
cube(18, 7, -21, 19, 7, -20, AIR);
block(18, 3, -21, AIR); block(18, 5, -21, AIR);
cube(12, 0, -19, 12, 3, -17, AIR);       // rocket breach in west wall
// impact fireball in the breach
sphere(12, 1, -18, 3, B);
block(12, 2, -18, SAND); block(11, 1, -18, SAND); block(13, 2, -18, SAND);
// burning interior + collapsed beams
cube(14, 0, -20, 18, 0, -16, B);
cube(15, 1, -19, 15, 2, -19, B);
block(17, 1, -17, B); block(14, 1, -16, B);
block(19, 6, -21, B); block(20, 7, -22, B);
line(12, 4, -21, 20, 2, -21, OAK_LOG);
line(12, 4, -16, 20, 2, -16, OAK_LOG);
line(14, 0, -19, 18, 1, -16, OAK_LOG);
// smoke column drifting up
sphere(15, 7, -18, 1, W);
sphere(16, 10, -17, 2, W);
sphere(18, 13, -16, 2, W);
sphere(19, 16, -15, 1, W);

// rocket trail from east pod + rocket in flight
dashed(7, 9, -6, 12, 3, -16, W);
block(10, 5, -13, B);

// ================= TARGET 2: burning tank (NW) =================
disk(-14, -1, -15, 4, C);                // scorched earth
cube(-16, 0, -17, -12, 1, -13, C);       // hull
cube(-17, 0, -17, -17, 0, -13, S);       // tracks
cube(-11, 0, -17, -11, 0, -13, S);
cube(-15, 2, -16, -13, 2, -14, S);       // turret
line(-14, 2, -16, -14, 2, -19, S);       // barrel
sphere(-14, 2, -15, 2, B);               // engulfed in fire
block(-14, 3, -15, SAND); block(-13, 2, -15, SAND);
block(-16, 1, -14, B); block(-12, 1, -16, B);
// smoke column
sphere(-14, 6, -15, 1, W);
sphere(-13, 9, -14, 2, W);
sphere(-12, 12, -14, 2, W);
sphere(-11, 15, -13, 1, W);

// rocket trail from west pod
dashed(-7, 9, -6, -13, 4, -12, W);

// chin-gun tracers + dirt impact
dashed(0, 6, -17, 2, 1, -21, SAND);
sphere(2, 0, -21, 1, SAND);
block(1, 1, -22, DIRT); block(3, 1, -22, DIRT); block(2, 2, -21, DIRT);

// ================= wingman escort, high in the background (SE) =================
cube(12, 21, 7, 14, 22, 12, S);          // hull
block(13, 22, 6, G);                     // canopy
block(13, 20, 8, C);                     // chin gun
line(13, 22, 13, 13, 22, 16, S);         // boom
block(13, 23, 16, S); block(13, 24, 16, C); // fin
block(13, 23, 9, C);                     // mast
line(13, 24, 9, 19, 24, 11, S);          // rotor blades
line(13, 24, 9, 7, 24, 7, S);
line(13, 24, 9, 11, 24, 15, S);
line(13, 24, 9, 15, 24, 3, S);
block(12, 20, 8, C); block(14, 20, 8, C); // gear
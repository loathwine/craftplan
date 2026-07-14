// trebuchet-4x-fable — prompt:
// a medieval trebuchet...

const T = OAK_LOG, P = PLANKS, C = COBBLE, S = STONE;

// ---- site clearing (targeted, AIR is free) ----
cube(-16, 1, -8, 22, 33, 8, AIR);        // machine volume + arm/boulder arc
cube(-22, 0, -12, -14, 9, 8, AIR);       // west: tent + boulder pile zone
cube(-16, 0, -12, 22, 6, -7, AIR);       // north: stake line / crater strip
cube(13, 0, -6, 22, 8, 8, AIR);          // east: cart zone

// ---- cobblestone siege pad with stone border ----
cube(-13, -2, -6, 13, 0, 6, C);
cube(-13, 0, -6, 13, 0, -6, S);
cube(-13, 0, 6, 13, 0, 6, S);
cube(-13, 0, -6, -13, 0, 6, S);
cube(13, 0, -6, 13, 0, 6, S);
// plank ramp off the east edge
cube(14, -1, -3, 16, -1, 3, P);
cube(15, -2, -3, 17, -2, 3, P);

// ---- helpers ----
function wheel(cx, cy, cz, r) {
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= r + 0.4 && d >= r - 0.6) block(cx + dx, cy + dy, cz, T);
      else if (d < r - 0.6 && (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)))
        block(cx + dx, cy + dy, cz, P);
    }
  }
  block(cx, cy, cz, S); // hub
}
function soldier(x, z) {
  block(x, 1, z, C);       // legs
  block(x, 2, z, BRICK);   // tunic
  block(x - 1, 2, z, BRICK);
  block(x, 3, z, SAND);    // head
  block(x + 1, 1, z, T);   // spear shaft
  block(x + 1, 2, z, T);
  block(x + 1, 3, z, T);
  block(x + 1, 4, z, S);   // spear tip
}

// ---- four ground wheels (outside the frame, planes face the camera) ----
wheel(-9, 4, -5, 3);
wheel(-9, 4, 5, 3);
wheel(9, 4, -5, 3);
wheel(9, 4, 5, 3);
line(-9, 4, -5, -9, 4, 5, T);  // wheel axles
line(9, 4, -5, 9, 4, 5, T);

// ---- base frame ----
cube(-11, 5, -4, 11, 6, -4, T);
cube(-11, 5, 4, 11, 6, 4, T);
for (const x of [-11, -8, -4, 0, 4, 8, 11]) cube(x, 5, -4, x, 5, 4, T);
cube(-3, 6, -3, 7, 6, 3, P);   // crew deck

// ---- A-frame trusses (z = -4 front, z = +4 back) ----
for (const z of [-4, 4]) {
  line(-6, 6, z, 0, 14, z, T);
  line(-6, 7, z, 0, 15, z, T);
  line(6, 6, z, 0, 14, z, T);
  line(6, 7, z, 0, 15, z, T);
  line(-10, 7, z, -4, 10, z, T);  // knee braces
  line(10, 7, z, 4, 10, z, T);
}
line(-3, 10, -4, -3, 10, 4, T);   // cross ties between trusses
line(3, 10, -4, 3, 10, 4, T);
line(0, 13, -4, 0, 13, 4, T);
line(0, 14, -5, 0, 14, 5, S);     // main axle

// ---- throwing arm, FIRED position: tip flung high to the east ----
for (const zo of [-1, 0]) {
  for (const yo of [0, 1]) {
    line(-6, 8 + yo, zo, 14, 28 + yo, zo, T);
  }
}

// ---- counterweight box hanging low off the short end ----
line(-6, 7, -2, -6, 7, 1, T);            // hanger bars
cube(-9, 2, -2, -4, 6, 1, C);            // stone fill
hollowCube(-9, 2, -2, -4, 6, 1, T);      // timber-framed edges

// ---- released sling + boulder mid-flight ----
line(14, 28, 0, 17, 31, 0, T);
line(14, 28, -1, 17, 30, -1, T);
block(17, 30, 0, P);                      // leather pouch
sphere(19, 31, 0, 2, S);                  // the shot, airborne

// ---- winch drum at east end of frame ----
block(10, 6, -4, T); block(10, 7, -4, T);
block(10, 6, 4, T); block(10, 7, 4, T);
line(10, 7, -3, 10, 7, 3, T);
block(11, 7, -5, S);                      // crank handles
block(11, 7, 5, S);

// ---- banner on the front truss apex ----
line(0, 16, -4, 0, 21, -4, T);
cube(1, 18, -4, 5, 20, -4, BRICK);
block(5, 19, -4, AIR);                    // swallowtail notch

// ---- ammo: cobble shot on deck + spare timber stack ----
block(4, 7, 2, C); block(5, 7, 2, C); block(4, 7, 3, C); block(5, 7, 1, C);
cube(-3, 1, 5, 3, 1, 6, T);
cube(-2, 2, 5, 2, 2, 5, T);

// ---- boulder pile, northwest foreground ----
sphere(-14, 1, -8, 2, S);
sphere(-11, 0, -10, 1, C);
sphere(-17, 0, -7, 1, S);
sphere(-12, 0, -7, 1, C);

// ---- sharpened defensive stakes facing the camera ----
for (const x of [-9, -5, -1, 3, 7, 11]) {
  line(x, 0, -8, x, 3, -11, T);
  block(x, 4, -12, S);
}

// ---- impact crater from a previous shot, northeast ----
sphere(18, 0, -7, 3, AIR);
sphere(18, -1, -7, 1, S);                 // half-buried boulder
block(15, 0, -7, DIRT); block(21, 0, -7, DIRT);
block(18, 0, -4, DIRT); block(18, 0, -10, DIRT);
block(16, 0, -5, C); block(20, 0, -9, C); block(20, 0, -5, DIRT);

// ---- ammo cart, east side ----
cube(15, 1, 2, 19, 2, 5, P);
block(16, 3, 3, S); block(17, 3, 4, S); block(18, 3, 3, C);
wheel(16, 1, 1, 2);
wheel(18, 1, 1, 2);
line(14, 1, 3, 12, 0, 3, T);              // tow bar

// ---- white canvas tent, southwest background ----
cube(-20, 0, 2, -15, 0, 2, SNOW);
cube(-20, 0, 7, -15, 0, 7, SNOW);
cube(-20, 1, 3, -15, 1, 3, SNOW);
cube(-20, 1, 6, -15, 1, 6, SNOW);
cube(-20, 2, 4, -15, 2, 5, SNOW);        // ridge
cube(-20, 0, 3, -20, 1, 6, SNOW);        // back gable
cube(-15, 1, 4, -15, 1, 5, SNOW);        // front gable, open door below
block(-15, 0, 3, SNOW); block(-15, 0, 6, SNOW);

// ---- braziers flanking the front edge ----
for (const x of [-12, 12]) {
  block(x, 1, -5, C);
  block(x, 2, -5, T);
  block(x, 3, -5, C);
  block(x, 4, -5, BRICK);
}

// ---- crew ----
soldier(-9, -3);   // loader by the boulder pile
soldier(3, 7 - 10); // spotter at the stake line
// lava-golem-sonnet — prompt:
// a lava golem...

// ===== LAVA GOLEM =====
// Front face (eyes/chest) points north (-Z). Body: obsidian rock shell
// with glowing lava cracks and a molten core. Standing in a small crater.

function crack(x1,y1,z1,x2,y2,z2){ line(x1,y1,z1,x2,y2,z2,LAVA); }

// ---------- 1. CRATER / LAVA POOL (place first so body overrides it) ----------
disk(0, -1, 1, 6, LAVA);
hollowCylinder(0, -1, 1, 7, 1, OBSIDIAN);
disk(0, -1, 1, 3, LAVA); // brighter inner glow ring stays lava
// scattered rubble around the crater rim
sphere(-8, 0, -2, 2, STONE);
sphere(8, 0, -1, 2, OBSIDIAN);
sphere(-9, 0, 4, 1, STONE);
sphere(9, 0, 5, 2, STONE);
sphere(6, 0, -4, 1, OBSIDIAN);
sphere(-6, 0, -4, 1, STONE);
// cracks in the ground radiating outward
crack(0,-1,1, -8,-1,-2, LAVA); line(0,-1,1,-8,-1,-2,LAVA);
line(0,-1,1, 8,-1,-1, LAVA);
line(0,-1,1, -2,-1,7, LAVA);
line(0,-1,1, 3,-1,7, LAVA);
// embers over the pool
for (let i=0;i<10;i++){
  const a = i/10*Math.PI*2;
  const ex = Math.round(Math.cos(a)*4);
  const ez = 1+Math.round(Math.sin(a)*4);
  block(ex, 0, ez, FIRE);
}

// ---------- 2. LEGS ----------
for (const s of [-1,1]) {
  const xo = s*2; // leg outer offset (left: -3..-2, right: 2..3)
  const x1 = s<0? -3:2, x2 = s<0? -2:3;
  cube(x1,0,0,x2,4,3, OBSIDIAN);
  cube(x1,0,-1,x2,1,3, STONE);      // foot, slightly forward
  crack(x1, 1, 0, x1, 4, 0);        // outer shin crack
  crack(x2, 2, 3, x2, 4, 1);
  block(x1, 0, -1, GLOWSTONE);      // toe glow ember
  block(x2, 0, -1, GLOWSTONE);
}
// inner ankle rubble/glow between legs
block(0,0,0, LAVA); block(0,0,1, LAVA);

// ---------- 3. WAIST / HIPS ----------
cube(-4,5,0, 4,6,4, OBSIDIAN);
cube(-4,5,0, 4,5,4, STONE);         // lower belt band texture
line(-4,5,0, 4,5,0, IRON);          // riveted belt front
block(-4,5,0, GOLD); block(4,5,0, GOLD); block(0,5,0, GOLD); // belt studs
crack(-4,6,0, -1,7,0); crack(4,6,0, 2,7,1);

// ---------- 4. TORSO ----------
cube(-5,7,0, 5,12,4, OBSIDIAN);
// alternating stone plating rows for rocky texture
for (let y=7;y<=12;y+=2) cube(-5,y,4,5,y,4, STONE);
for (let y=8;y<=12;y+=3) cube(-5,y,1,5,y,1, STONE);
// chest window carved to molten core
cube(-1,8,0, 1,10,0, AIR);
cube(-1,8,1, 1,10,1, LAVA);
hollowCube(-2,7,0, 2,11,0, STONE);  // stone frame around the window
// crack network fanning from the core
crack(-1,8,0, -5,11,2); crack(1,8,0, 5,11,2);
crack(-1,10,0, -3,7,2); crack(1,10,0, 3,7,2);
crack(0,8,0, 0,12,3);
line(-5,9,0, 5,9,0, undefined) // no-op placeholder removed below

// ---------- 5. SHOULDERS ----------
cube(-6,11,0, -5,13,4, OBSIDIAN);
cube(5,11,0, 6,13,4, OBSIDIAN);
crack(-6,13,0, -5,11,3); crack(6,13,0, 5,11,3);
block(-6,13,0, GLOWSTONE); block(6,13,0, GLOWSTONE);

// ---------- 6. ARMS (upper arm -> forearm -> fist) ----------
for (const s of [-1,1]) {
  const x1 = s<0?-6:5, x2 = s<0?-5:6;
  cube(x1,5,1, x2,11,3, OBSIDIAN);      // upper arm
  cube(x1,2,1, x2,5,3, OBSIDIAN);       // forearm
  for (let y=2;y<=11;y+=3) cube(x1,y,3, x2,y,3, STONE); // back-of-arm plating
  crack(x1,11,1, x1,2,2);
  crack(x2,10,3, x2,3,1);
  const fx1 = s<0?-7:5, fx2 = s<0?-5:7;
  cube(fx1,0,1, fx2,2,3, OBSIDIAN);      // fist
  cube(fx1,0,1, fx2,0,3, STONE);         // knuckle row
  block(s<0?-6:6, 1, 0, LAVA);           // knuckle glow crack
  block(s<0?-6:6, 2, 2, LAVA);
}

// ---------- 7. NECK + HEAD ----------
cube(-1,13,1, 1,14,3, OBSIDIAN);
cube(-2,14,0, 2,17,3, OBSIDIAN);
cube(-2,17,0, 2,17,3, STONE);          // brow ridge
cube(-2,14,0, 2,14,3, STONE);          // jaw
// face
block(-1,16,0, NEON_RED);              // left eye
block(1,16,0, NEON_RED);
block(-1,16,-0, GLOWSTONE);            // faint socket glow (same cell keeps eye bright)
crack(-1,15,0, 1,15,0);                // molten mouth crack
line(-1,17,0, 1,17,0, STONE);          // brow line
// horns
cube(-2,18,1, -2,19,1, STONE);
cube(2,18,1, 2,19,1, STONE);
block(-2,19,1, LAVA); block(2,19,1, LAVA);
// smoke/embers rising off head and shoulders
block(0, 18, 1, FIRE);
block(-6, 14, 2, FIRE);
block(6, 14, 2, FIRE);
block(-1, 18, 1, FIRE);
block(1, 18, 1, FIRE);

// ---------- 8. extra scattered surface cracks for asymmetry/detail ----------
const seedCracks = [
  [-5,8,0,-3,9,1],[4,7,0,2,9,1],[-4,11,0,-3,12,1],[3,10,0,4,12,1],
  [-2,6,0,-3,5,3],[2,6,0,3,5,3],[-3,3,1,-3,1,3],[3,4,1,3,2,3]
];
for (const c of seedCracks) crack(c[0],c[1],c[2],c[3],c[4],c[5]);

// stray glowing pebbles near feet
block(-1,0,-1, LAVA); block(1,0,-1, LAVA);
block(-2,0,2, GLOWSTONE); block(2,0,2, GLOWSTONE);
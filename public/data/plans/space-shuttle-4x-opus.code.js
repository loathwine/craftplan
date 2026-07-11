// space-shuttle-4x-opus — prompt:
// the Space Shuttle on its launchpad...

const meta = undefined; // (ignored)

// ===== The Space Shuttle on its Launchpad =====
// Orbiter (white/black) + orange External Tank + 2 white SRBs,
// standing vertical on a launch platform beside a gray service tower.
// Front (orbiter payload side + tail) faces NORTH (-Z) toward camera.

const ET_R = 3, ET_CZ = 5, ET_Y0 = 2, ET_H = 27;   // external tank
const SRB_R = 2, SRB_Y0 = 2, SRB_H = 23;           // solid rocket boosters
const SRB_X = 6;

// ---- helpers ----
function noseCone(cx, cyBase, cz, r, h, id){
  for (let i = 0; i < h; i++){
    const rr = Math.max(0, Math.round(r * (1 - i / h)));
    disk(cx, cyBase + i, cz, rr, id);
  }
}
function band(cx, cy, cz, r, id){        // thin ring band around a rocket
  disk(cx, cy, cz, r, id);
}

// ================= LAUNCH PLATFORM (Mobile Launcher) =================
cube(-9, -1, -1, 9, 1, 10, STONE);          // main deck slab
cube(-9, -1, -1, 9, -1, 10, COBBLE);        // darker underside
hollowCube(-9, 0, -1, 9, 1, 10, COBBLE);    // edge trim
// exhaust holes punched through for engine flame
cube(-1, -8, 3, 1, 1, 7, AIR);              // orbiter/ET main hole
cube(-6, -8, 3, -6, 1, 7, AIR);             // left SRB hole
cube( 6, -8, 3,  6, 1, 7, AIR);             // right SRB hole
// hold-down posts
for (const px of [-3,3]) cube(px, 1, 2, px, 2, 2, COBBLE);

// ================= EXTERNAL TANK (orange) =================
cylinder(0, ET_Y0, ET_CZ, ET_R, ET_H, SAND);       // y 2..28
noseCone(0, ET_Y0 + ET_H, ET_CZ, ET_R, 5, SAND);   // ogive nose y29..33
// intertank ribbed band + darker weld line detail
band(0, 10, ET_CZ, ET_R, PLANKS);
band(0, 11, ET_CZ, ET_R, PLANKS);
band(0, ET_Y0 + ET_H - 1, ET_CZ, ET_R, PLANKS);    // top flange
// feed line running down the tank face (toward orbiter, -Z side)
line(2, ET_Y0, ET_CZ - 2, 2, ET_Y0 + ET_H, ET_CZ - 2, PLANKS);

// ================= SOLID ROCKET BOOSTERS (white) =================
for (const sx of [-SRB_X, SRB_X]){
  cylinder(sx, SRB_Y0, ET_CZ, SRB_R, SRB_H, SNOW);          // body
  noseCone(sx, SRB_Y0 + SRB_H, ET_CZ, SRB_R, 4, COBBLE);    // black pointed nose
  band(sx, 8,  ET_CZ, SRB_R, STONE);                        // black field-joint bands
  band(sx, 15, ET_CZ, SRB_R, STONE);
  band(sx, SRB_Y0, ET_CZ, SRB_R, STONE);                    // aft skirt
  // flared nozzle poking below the deck
  disk(sx, 1, ET_CZ, SRB_R, COBBLE);
  disk(sx, 0, ET_CZ, SRB_R - 1, COBBLE);
  // attach struts to the tank
  line(sx + (sx < 0 ? SRB_R : -SRB_R), 15, ET_CZ, -Math.sign(sx)*(ET_R-1)+ (sx<0?-ET_R:ET_R), 15, ET_CZ, STONE);
}
// simple horizontal struts ET<->SRB
for (const yy of [7,16]){
  line(-ET_R, yy, ET_CZ, -SRB_X + SRB_R, yy, ET_CZ, STONE);
  line( ET_R, yy, ET_CZ,  SRB_X - SRB_R, yy, ET_CZ, STONE);
}

// ================= ORBITER (mounted on -Z / camera side of tank) =================
// Fuselage: nose points up, belly faces tank (+Z), payload bay faces camera (-Z)
const OZ0 = -2, OZ1 = 1;   // orbiter depth (north of tank front face at z=2)
cube(-1, 2, OZ0, 1, 24, OZ1, SNOW);        // fuselage body
// rounded belly black thermal tiles (tank-facing side, +Z face)
cube(-1, 2, OZ1, 1, 20, OZ1, STONE);
// nose cap (black)
noseCone(0, 24, (OZ0+OZ1)/2 | 0, 1, 3, COBBLE);
cube(-1, 22, OZ0, 1, 24, OZ0, COBBLE);     // black nose cap front
// cockpit windows
block(0, 21, OZ0, GLASS);
block(-1, 21, OZ0, GLASS);
block(1, 21, OZ0, GLASS);
// payload bay doors detail (camera side)
line(0, 6, OZ0, 0, 19, OZ0, GLASS);

// Delta wings (spread in X, taper up the body)
for (let dx = 2; dx <= 7; dx++){
  const topY = Math.max(3, Math.round(11 - (dx - 2) * 1.4));
  cube(dx, 3, OZ0, dx, topY, OZ1, SNOW);
  cube(-dx, 3, OZ0, -dx, topY, OZ1, SNOW);
  // black leading edge along the bottom
  block(dx, 3, OZ0, STONE);
  block(-dx, 3, OZ0, STONE);
}
// wing tip / elevon black trim
cube(-7, 3, OZ0, -7, 4, OZ1, STONE);
cube(7, 3, OZ0, 7, 4, OZ1, STONE);

// Vertical tail fin (top, sticking out toward camera -Z)
cube(0, 20, OZ0 - 2, 0, 26, OZ0, SNOW);
cube(0, 24, OZ0 - 2, 0, 26, OZ0 - 2, COBBLE);   // black leading edge of fin
// OMS pods at tail base of fin
block(-1, 20, OZ0 - 1, STONE);
block(1, 20, OZ0 - 1, STONE);

// 3 main engine nozzles at orbiter base
for (const nx of [-1, 0, 1]){
  cube(nx, -1, OZ1, nx, 1, OZ1, COBBLE);
}

// ================= FIXED SERVICE STRUCTURE (gray tower, east +X) =================
const TX0 = 10, TX1 = 14, TZ0 = 1, TZ1 = 5, TY0 = -1, TY1 = 31;
// four corner columns
for (const cx of [TX0, TX1]) for (const cz of [TZ0, TZ1])
  cube(cx, TY0, cz, cx, TY1, cz, COBBLE);
// horizontal lattice rungs + cross braces every 3 levels
for (let y = 0; y <= TY1; y += 3){
  line(TX0, y, TZ0, TX1, y, TZ0, STONE);
  line(TX0, y, TZ1, TX1, y, TZ1, STONE);
  line(TX0, y, TZ0, TX0, y, TZ1, STONE);
  line(TX1, y, TZ0, TX1, y, TZ1, STONE);
  // diagonal-ish brace
  block(TX0 + 1, y + 1, TZ0, STONE);
  block(TX1 - 1, y + 1, TZ1, STONE);
}
// service platforms
cube(TX0, 6, TZ0, TX1, 6, TZ1, STONE);
cube(TX0, 20, TZ0, TX1, 20, TZ1, STONE);
// hammerhead crane at top
cube(TX0 - 1, TY1, 2, TX1, TY1 + 1, 4, COBBLE);
line(TX0 - 3, TY1 + 1, 3, TX0, TY1 + 1, 3, STONE);
// lightning mast
cube(12, TY1 + 1, 3, 12, TY1 + 2, 3, STONE);

// Crew Access Arm (orange swing arm reaching to orbiter hatch)
cube(2, 18, 0, TX0, 18, 1, SAND);
cube(2, 17, 0, TX0, 17, 1, PLANKS);
block(2, 19, 0, SAND);                         // white room at orbiter end
cube(1, 18, -1, 3, 20, 1, SNOW);               // white room enclosure

// Gaseous-oxygen vent "beanie cap" arm near ET nose
cube(TX0, 30, 3, TX1, 30, 4, COBBLE);
cube(3, 30, 4, TX0, 30, 4, STONE);
disk(0, 31, ET_CZ, 2, PLANKS);                 // vent hood over tank nose

// ================= LAUNCH SMOKE / STEAM at base =================
// billowing white exhaust clouds around the platform (drama)
const clouds = [
  [-11, 1, 4, 3], [11, 1, 5, 3], [0, 0, 12, 3],
  [-7, 2, 12, 2], [7, 2, 12, 2], [-12, 0, 9, 2],
  [12, 1, 1, 2], [0, -1, -3, 2], [-4, 0, -2, 2], [5, 0, -2, 2],
];
for (const [cx, cy, cz, r] of clouds) sphere(cx, cy, cz, r, SNOW);
// steam rising along flame trench sides
for (let i = 0; i < 4; i++){
  sphere(-9 - i, 2 + i, 6, 2, SNOW);
  sphere(9 + i, 2 + i, 6, 2, SNOW);
}
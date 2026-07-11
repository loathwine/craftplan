// space-shuttle-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== Space Shuttle on its launchpad =====
// Layout: launch pad platform, Fixed Service Structure tower (west),
// stack = external tank + two SRBs + orbiter mounted on tank's north face.

// ---------- Launch pad ----------
cube(-8, -2, -6, 8, -1, 10, COBBLE);           // pad slab (2 thick)
cube(-9, -2, -7, 9, -2, 11, STONE);            // foundation lip
hollowCube(-9, -1, -7, 9, -1, 11, STONE);      // raised curb edge

// flame trench through the pad, under the stack
cube(-1, -2, -6, 3, -1, 10, AIR);              // carve trench
cube(-2, -2, -6, -2, -1, 10, BRICK);           // trench wall west
cube(4, -2, -6, 4, -1, 10, BRICK);             // trench wall east
cube(-1, -2, -6, 3, -2, 10, STONE);            // trench floor (deflector base)
// deflector wedge
for (let i = 0; i < 3; i++) {
  cube(-1 + i, -2, 1 - i, 3 - i, -2, 3 + i, COBBLE);
}

// crawler-transporter tracks leading off pad (south)
cube(-8, -1, 11, -6, -1, 20, STONE);
cube(6, -1, 11, 8, -1, 20, STONE);

// ---------- Fixed Service Structure (tower), west side ----------
const towerX0 = -8, towerX1 = -6, towerZ0 = 0, towerZ1 = 4, towerTop = 28;
// corner poles
line(towerX0, 0, towerZ0, towerX0, towerTop, towerZ0, OAK_LOG);
line(towerX0, 0, towerZ1, towerX0, towerTop, towerZ1, OAK_LOG);
line(towerX1, 0, towerZ0, towerX1, towerTop, towerZ0, OAK_LOG);
line(towerX1, 0, towerZ1, towerX1, towerTop, towerZ1, OAK_LOG);
// base block
cube(towerX0, -2, towerZ0, towerX1, -1, towerZ1, COBBLE);

// horizontal ring braces every 4 levels
for (let y = 4; y <= towerTop; y += 4) {
  line(towerX0, y, towerZ0, towerX0, y, towerZ1, PLANKS);
  line(towerX1, y, towerZ0, towerX1, y, towerZ1, PLANKS);
  line(towerX0, y, towerZ0, towerX1, y, towerZ0, PLANKS);
  line(towerX0, y, towerZ1, towerX1, y, towerZ1, PLANKS);
}
// diagonal cross-bracing on the face toward the stack (east face, x=towerX1)
for (let y = 0; y < towerTop; y += 8) {
  line(towerX1, y, towerZ0, towerX1, y + 4, towerZ1, PLANKS);
  line(towerX1, y, towerZ1, towerX1, y + 4, towerZ0, PLANKS);
}
// elevator shaft glass slits
for (let y = 2; y < towerTop; y += 6) {
  block(towerX0, y, (towerZ0 + towerZ1) / 2, GLASS);
}
// beacon lights on top corners
block(towerX0, towerTop + 1, towerZ0, BRICK);
block(towerX0, towerTop + 1, towerZ1, BRICK);
block(towerX1, towerTop + 1, towerZ0, BRICK);
block(towerX1, towerTop + 1, towerZ1, BRICK);

// rotating service structure arm reaching toward the stack
cube(towerX1, 14, 1, 0, 14, 3, PLANKS);
hollowCube(towerX1, 14, 1, 0, 16, 3, OAK_LOG);
block(0, 15, 2, GLASS); // access hatch window at the arm tip

// ---------- External tank ----------
const tankX = 1, tankZ = 5, tankR = 2, tankTop = 20;
cylinder(tankX, 0, tankZ, tankR, tankTop, SAND);
// nose cone (tapering disks)
for (let i = 0; i <= 4; i++) {
  const r = Math.max(0, tankR - Math.round((i * tankR) / 4));
  disk(tankX, tankTop + i, tankZ, r, SAND);
}
// rust/panel-line detail rings
disk(tankX, 6, tankZ, tankR, BRICK);
disk(tankX, 12, tankZ, tankR, BRICK);
disk(tankX, 18, tankZ, tankR, BRICK);
// dark aft skirt
disk(tankX, 0, tankZ, tankR, STONE);
disk(tankX, 1, tankZ, tankR, STONE);

// ---------- Solid Rocket Boosters ----------
function buildSRB(cx) {
  const cz = 5, r = 1, top = 22;
  cylinder(cx, 0, cz, r, top, SNOW);
  for (let i = 0; i <= 3; i++) {
    const rr = Math.max(0, r - Math.round((i * r) / 3));
    disk(cx, top + i, cz, rr, SNOW);
  }
  // segment joint rings
  disk(cx, 6, cz, r, COBBLE);
  disk(cx, 12, cz, r, COBBLE);
  disk(cx, 18, cz, r, COBBLE);
  // flared nozzle at base
  disk(cx, 0, cz, r + 1, STONE);
  disk(cx, -1, cz, r + 1, STONE);
}
buildSRB(-2);
buildSRB(4);

// ---------- Orbiter, mounted vertically on tank's north (camera) face ----------
const orbX = 1, orbZ = 2, orbR = 1, orbTailY = 2, orbNoseBaseY = 17;
cylinder(orbX, orbTailY, orbZ, orbR, orbNoseBaseY - orbTailY, SNOW);
// black nose cap (tapering)
for (let i = 0; i <= 3; i++) {
  const r = Math.max(0, orbR - Math.round((i * orbR) / 3));
  disk(orbX, orbNoseBaseY + i, orbZ, r, i === 0 ? STONE : SNOW);
}
// cockpit windows, facing north toward camera
cube(orbX - 1, 15, orbZ - 1, orbX + 1, 16, orbZ - 1, GLASS);

// belly tile stripe (tank-facing side, dark heat tiles)
line(orbX, orbTailY, orbZ + 1, orbX, orbNoseBaseY - 1, orbZ + 1, STONE);

// delta wings near the tail
function buildWing(side) {
  const rootX = orbX + side, span = 6, rootChord = 5, zLead = -1;
  for (let dx = 1; dx <= span; dx++) {
    const chord = Math.max(1, Math.round(rootChord * (1 - dx / (span + 1))));
    for (let dz = 0; dz < chord; dz++) {
      const x = rootX + side * dx, z = zLead + dz;
      block(x, 3, z, STONE);  // belly (dark)
      block(x, 4, z, SNOW);   // top (white)
    }
  }
}
buildWing(1);
buildWing(-1);

// vertical tail fin, sweeping toward the camera
function buildTailFin() {
  const baseY = 4, height = 6;
  for (let dy = 0; dy <= height; dy++) {
    const zExtent = Math.round(4 * (1 - dy / height));
    if (zExtent < 1) continue;
    cube(orbX, baseY + dy, -1 - zExtent, orbX + 1, baseY + dy, -1, SNOW);
  }
}
buildTailFin();

// OMS pods either side of the tail fin base
cube(orbX - 2, 3, 0, orbX - 1, 5, 2, STONE);
cube(orbX + 2, 3, 0, orbX + 3, 5, 2, STONE);

// three SSME nozzles clustered at the orbiter's tail, pointing down at the pad
disk(orbX - 1, 1, orbZ + 1, 1, STONE);
disk(orbX + 1, 1, orbZ + 1, 1, STONE);
disk(orbX, 1, orbZ + 2, 1, STONE);
disk(orbX - 1, 0, orbZ + 1, 1, COBBLE);
disk(orbX + 1, 0, orbZ + 1, 1, COBBLE);
disk(orbX, 0, orbZ + 2, 1, COBBLE);

// struts bracing orbiter to tank (bipod-style attach points)
line(orbX, 5, orbZ + 1, tankX, 5, tankZ - tankR, COBBLE);
line(orbX, 14, orbZ + 1, tankX, 14, tankZ - tankR, COBBLE);

// ---------- Exhaust / vapor at the base, drifting through the trench ----------
sphere(1, 0, 8, 2, SNOW);
sphere(-3, 0, 10, 1, SNOW);
sphere(5, 0, 10, 1, SNOW);

// tank-4x-opus — prompt:
// a battle tank...

// ===== BATTLE TANK — front (barrel) faces NORTH/-Z toward camera, angled east for light =====

// ---- helpers ----
function diskYZ(x, cy, cz, r, id) {            // filled wheel in the Y-Z plane (side view)
  for (let dy = -r; dy <= r; dy++)
    for (let dz = -r; dz <= r; dz++)
      if (dy*dy + dz*dz <= r*r + 0.4) block(x, cy+dy, cz+dz, id);
}
function ringYZ(x, cy, cz, r, id) {            // wheel rim / hub ring
  for (let dy = -r; dy <= r; dy++)
    for (let dz = -r; dz <= r; dz++) {
      const d = dy*dy + dz*dz;
      if (d <= r*r + 0.4 && d >= (r-1)*(r-1) - 0.4) block(x, cy+dy, cz+dz, id);
    }
}
function turretPlate(cx, cz, rx, rz, y, cut, id) {   // rectangle with beveled corners (cast-turret look)
  for (let x = cx-rx; x <= cx+rx; x++)
    for (let z = cz-rz; z <= cz+rz; z++) {
      const ex = Math.abs(x-cx), ez = Math.abs(z-cz);
      const ox = ex - (rx-cut), oz = ez - (rz-cut);
      if (ox > 0 && oz > 0 && ox + oz > cut) continue;
      block(x, y, z, id);
    }
}
function tubeLine(x1, y1, z1, x2, y2, z2, r, id) {   // thick gun barrel along an arbitrary line
  const steps = Math.max(Math.abs(x2-x1), Math.abs(y2-y1), Math.abs(z2-z1));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    sphere(Math.round(x1+(x2-x1)*t), Math.round(y1+(y2-y1)*t), Math.round(z1+(z2-z1)*t), r, id);
  }
}
function starTop(cx, cz, y, id) {              // allied roundel/star on a flat top surface (X-Z plane)
  const pts = [[0,-2],[0,-1],[0,0],[0,1],[0,2],[-2,0],[-1,0],[1,0],[2,0],[-1,-1],[1,-1],[-1,1],[1,1]];
  for (const [dx,dz] of pts) block(cx+dx, y, cz+dz, id);
}
function starYZ(x, cy, cz, id) {               // star on a vertical side (Y-Z plane)
  const pts = [[0,-2],[0,-1],[0,0],[0,1],[0,2],[-2,0],[-1,0],[1,0],[2,0],[-1,-1],[1,-1],[-1,1],[1,1]];
  for (const [dy,dz] of pts) block(x, cy+dy, cz+dz, id);
}

// ---- clear the footprint (remove trees/foliage the tank will occupy) ----
cube(-12, 0, -17, 12, 12, 11, AIR);

// ========================= TRACKS =========================
// two long track units (dark, COBBLE) running front(-Z) to rear(+Z)
cube(-10, 0, -13, -7, 3, 11, COBBLE);   // left track
cube( 7, 0, -13, 10, 3, 11, COBBLE);    // right track
// pointed drive sprocket (front) & idler (rear) — taper the ends
for (const sx of [-10, 7]) {
  block(sx, 3, -13, AIR); block(sx+3, 3, -13, AIR);   // bevel front-top corners
  block(sx, 3, 11, AIR);  block(sx+3, 3, 11, AIR);    // bevel rear-top corners
  block(sx, 0, -13, AIR); block(sx+3, 0, -13, AIR);
  block(sx, 0, 11, AIR);  block(sx+3, 0, 11, AIR);
}
// alternating track-link texture on the top return run
for (let z = -12; z <= 10; z += 2) {
  cube(-10, 3, z, -7, 3, z, STONE);
  cube( 7, 3, z, 10, 3, z, STONE);
}
// road wheels on the visible outer faces (left x=-11, right x=+11)
for (const [wx, hubx] of [[-11, -10], [11, 10]]) {
  // large drive sprocket (front) and idler (rear)
  diskYZ(wx, 1, -12, 2, STONE); ringYZ(wx, 1, -12, 2, COBBLE);
  diskYZ(wx, 1, 10, 2, STONE);  ringYZ(wx, 1, 10, 2, COBBLE);
  // road wheels
  for (const cz of [-8, -4, 0, 4, 7]) {
    diskYZ(wx, 1, cz, 2, STONE);
    block(wx, 1, cz, COBBLE);        // hub cap
    block(hubx, 1, cz, STONE);
  }
}

// ========================= HULL =========================
// main body between the tracks (ground clearance below y=1)
cube(-6, 1, -7, 6, 4, 10, STONE);
// top deck plate
cube(-6, 5, -7, 6, 5, 10, STONE);
// sloped front glacis (iconic angled nose rising back to the deck)
for (let z = -12; z <= -8; z++) {
  const top = 3 + Math.round((z + 12) * 0.5);   // z=-12 ->3  ...  z=-8 ->5
  cube(-6, 1, z, 6, top, z, STONE);
  cube(-6, top, z, 6, top, z, COBBLE);          // lighter armor plate face
}
// welded seam lines down the hull sides
line(-6, 3, -7, -6, 3, 10, COBBLE);
line( 6, 3, -7, 6, 3, 10, COBBLE);

// fenders / mudguards overhanging the tracks
cube(-11, 4, -13, -6, 4, 11, STONE);
cube( 6, 4, -13, 11, 4, 11, STONE);
// bevel the fender front tips
block(-11, 4, -13, AIR); block(-11, 4, 11, AIR);
block( 11, 4, -13, AIR); block( 11, 4, 11, AIR);

// stowage boxes riding on the fenders (wood crates)
cube(-11, 5, -2, -9, 6, 3, PLANKS);
cube( 9, 5, 1, 11, 6, 6, PLANKS);
cube(-11, 5, 6, -10, 6, 9, PLANKS);
// spare fuel drums on the rear deck
cylinder(-3, 6, 9, 1, 3, PLANKS);
cylinder( 3, 6, 9, 1, 3, PLANKS);
// rear exhaust muffler
cube(-10, 5, 9, -8, 6, 11, COBBLE);

// driver front deck: hatch + vision port
cube(-4, 5, -6, -1, 5, -4, COBBLE);
block(-3, 6, -5, GLASS);            // driver periscope
// front hull machine-gun ball mount
sphere(3, 5, -8, 1, COBBLE);
line(3, 5, -8, 3, 5, -12, STONE);   // bow MG barrel

// headlights with guards on the nose
for (const hx of [-5, 5]) {
  block(hx, 4, -12, GLASS);
  block(hx, 5, -12, COBBLE);
  block(hx, 4, -13, COBBLE);
}

// tow cables slung along the deck edges
line(-6, 6, -6, -6, 6, 9, OAK_LOG);
line( 6, 6, -6, 6, 6, 9, OAK_LOG);
// spare track links bolted to the glacis
for (let x = -4; x <= 4; x++) block(x, 6, -9, COBBLE);

// ========================= TURRET =========================
// cast rounded turret, set slightly rearward so the mantlet overhangs the deck
for (let y = 6; y <= 8; y++) turretPlate(0, 3, 4, 5, y, 2, STONE);
turretPlate(0, 3, 3, 4, 9, 2, STONE);      // sloped roof
// weld band around the turret base
turretPlate(0, 3, 4, 5, 6, 2, COBBLE);

// gun mantlet (rounded) at the turret front
sphere(1, 7, -2, 2, COBBLE);
cube(-1, 6, -2, 3, 8, -1, COBBLE);

// main gun — long barrel aimed NORTH and angled EAST toward the light
tubeLine(1, 7, -2, 7, 7, -16, 1, STONE);
// muzzle brake at the tip
sphere(7, 7, -16, 2, COBBLE);
ringYZ(8, 7, -16, 2, STONE);
block(7, 7, -16, AIR);              // hollow bore
// coaxial machine gun beside the main gun
line(3, 6, -2, 6, 6, -11, COBBLE);

// commander's cupola (rear-left of the roof) + hatch + AA machine gun
cylinder(-2, 9, 5, 2, 2, STONE);
ringYZ; // (no-op ref)
turretPlate(-2, 5, 1, 1, 11, 0, COBBLE);   // hatch rim
block(-2, 11, 5, GLASS);
line(-2, 11, 5, -2, 11, 2, COBBLE);         // AA MG pointing forward

// loader's hatch + periscopes on the roof
block(2, 10, 4, COBBLE);
block(-3, 9, 1, GLASS);
block(3, 9, 1, GLASS);

// rear turret stowage bin (wire basket -> wood)
cube(-3, 6, 7, 3, 8, 8, PLANKS);
line(-3, 8, 8, 3, 8, 8, OAK_LOG);

// long whip antenna off the turret rear
line(3, 9, 6, 3, 17, 6, OAK_LOG);
block(3, 18, 6, LEAVES);

// ---- allied white star markings (on the lit top + east side) ----
starTop(1, 3, 9, SNOW);             // turret roof
starYZ(5, 7, 3, SNOW);              // east turret side (extra light)
starTop(0, -6, 5, SNOW);            // front hull deck

// ===== ground detail: churned track marks trailing behind (south) =====
for (let z = 11; z <= 22; z++) {
  if (z % 2 === 0) { block(-9, 0, z, DIRT); block(-8, 0, z, DIRT); }
  else { block(8, 0, z, DIRT); block(9, 0, z, DIRT); }
}
// eagle-4x-fable — prompt:
// a bald eagle with wings spread...

// Bald eagle, wings spread, perched on a snowy rock crag — facing north (-Z) toward the camera.

// Clear the view corridor: two small trees directly north of the crag.
cube(-6, 0, -14, 8, 8, -3, AIR);

// ---------- helpers ----------
function blob(cx, cy, cz, rx, ry, rz, id) {
  for (let dy = -ry; dy <= ry; dy++)
    for (let dx = -rx; dx <= rx; dx++)
      for (let dz = -rz; dz <= rz; dz++)
        if (dx*dx/(rx*rx) + dy*dy/(ry*ry) + dz*dz/(rz*rz) <= 1.05)
          block(cx+dx, cy+dy, cz+dz, id);
}

// ---------- rock crag perch ----------
sphere(0, -3, 4, 7, STONE);        // main mound
sphere(2, 2, 4, 4, STONE);         // upper east mass
sphere(-3, 0, 2, 4, COBBLE);       // west shoulder
cube(-2, 4, 2, 2, 6, 6, STONE);    // summit column
cube(-2, 7, 2, 2, 7, 6, SNOW);     // snow-capped summit

// scattered boulders at the base
sphere(-7, -1, 8, 3, COBBLE);
sphere(8, 0, 3, 2, STONE);
sphere(-6, 0, 0, 2, COBBLE);

// snow accents on ledges and the sunlit north face
block(-3, 4, 3, SNOW); block(-4, 3, 6, SNOW); block(2, 3, 0, SNOW);
block(0, 2, -1, SNOW); block(-2, 3, 0, SNOW); block(4, 3, 7, SNOW);

// ---------- eagle body (dark brown) ----------
blob(0, 12, 4, 3, 5, 4, OAK_LOG);            // torso, chest toward -Z
cube(-3, 15, 2, 3, 16, 7, OAK_LOG);          // mantle across shoulders

// ---------- wings (spread wide, tips raised) ----------
for (const s of [-1, 1]) {
  for (let d = 0; d <= 18; d++) {
    const x = s * (3 + d);
    const y = 16 + Math.round(0.025*d*d + 0.15*d);            // arcs up to y=27
    const zL = 2 - Math.min(2, Math.floor(d/4)) + Math.max(0, Math.floor((d-10)/2));
    const chord = 9 - Math.floor(d/3);
    const zT = zL + chord - 1;
    cube(x, y, zL, x, y, zT, OAK_LOG);                        // top surface
    cube(x, y-1, zL+1, x, y-1, zT-1, DIRT);                   // darker underside
    if (d <= 5) cube(x, y-2, zL+2, x, y-2, zT-2, DIRT);       // thick inner wing
    if (d % 2 === 0) block(x, y, zT+1, OAK_LOG);              // scalloped trailing edge
    if (d % 3 === 2) cube(x, y, zL + Math.ceil(chord/2), x, y, zT, DIRT); // feather banding
  }
  // splayed primary feathers at the wingtip
  line(s*21, 28, 4, s*22, 31, 3, DIRT);
  line(s*21, 28, 5, s*22, 30, 6, DIRT);
  line(s*21, 27, 6, s*22, 28, 8, DIRT);
  line(s*20, 27, 6, s*22, 26, 9, DIRT);
}

// ---------- white fanned tail (angled down and back) ----------
cube(-1, 10, 7, 1, 10, 8, SNOW);   // upper coverts
cube(-1, 9, 7, 1, 9, 9, SNOW);
cube(-2, 8, 9, 2, 8, 11, SNOW);
cube(-2, 7, 10, 2, 7, 12, SNOW);
cube(-3, 6, 11, 3, 6, 13, SNOW);
for (const x of [-3, -1, 1, 3]) block(x, 5, 13, SNOW); // scalloped tips

// ---------- white head and neck ----------
blob(0, 18, 2, 2, 2, 3, SNOW);     // neck
blob(0, 20, 0, 2, 2, 3, SNOW);     // head, thrust north toward viewer

// eyes (dark, front-facing)
block(-1, 21, -2, STONE);
block(1, 21, -2, STONE);

// hooked yellow beak
cube(0, 19, -3, 0, 20, -3, SAND);
block(0, 20, -4, SAND);
block(0, 19, -4, SAND);            // downward hook tip

// ---------- yellow legs and talons gripping the summit ----------
for (const s of [-1, 1]) {
  const x = 2 * s;
  cube(x, 8, 1, x, 8, 3, SAND);    // foot
  block(x, 7, 1, SAND);            // claw curling over the edge
  block(x, 9, 2, SAND);
  block(x, 9, 3, SAND);            // tarsus
  block(x - s, 8, 1, SAND);        // inner toe
  block(x + s, 8, 2, SAND);        // outer toe
}

// ---------- fresh-caught salmon on an east ledge ----------
cube(3, 4, 0, 6, 4, 2, COBBLE);    // ledge
cube(3, 5, 1, 5, 5, 1, BRICK);     // salmon body
block(4, 6, 1, BRICK);             // dorsal hump
block(6, 5, 1, ICE);
block(6, 6, 1, ICE);               // forked tail
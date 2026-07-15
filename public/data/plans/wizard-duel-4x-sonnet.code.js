// wizard-duel-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// Clear canopy/foliage over the duel arena footprint
cube(-15, -1, -5, 15, 19, 7, 0);

const GLASS_C = 11, ICE_C = 13, SAND_C = 6, BRICK_C = 10, STONE_C = 3, COBBLE_C = 8, OAK_C = 4, SNOW_C = 12, PLANKS_C = 7;

function wizard(cx, cz, robeId, trimId, magicId, dir) {
  // cloak flare base
  const robeR = [4,4,3,3,2,2,1];
  for (let i = 0; i < robeR.length; i++) disk(cx, i, cz, robeR[i], robeId);
  cube(cx - 2, 0, cz + 1, cx + 2, 1, cz + 3, robeId); // cloak trails south (+Z)
  cube(cx - 2, 0, cz + 3, cx + 1, 0, cz + 4, robeId);

  // trim / belt / hem accents
  hollowCylinder(cx, 3, cz, 3, 1, trimId);
  hollowCylinder(cx, 0, cz, 4, 1, trimId);

  // boots
  block(cx - 1, 0, cz - 1, trimId);
  block(cx + 1, 0, cz - 1, trimId);

  // torso
  cylinder(cx, 7, cz, 1, 3, robeId);
  block(cx - 2, 9, cz, robeId); // shoulder pad
  block(cx + 2, 9, cz, robeId); // shoulder pad
  hollowCylinder(cx, 6, cz, 2, 1, trimId); // shoulder trim ring

  // resting arm + planted staff (opposite side from casting hand)
  const restX = cx - dir * 2;
  line(cx - dir * 1, 9, cz, restX, 6, cz, robeId);
  line(restX, 6, cz, restX, -1, cz, OAK_C);
  hollowCylinder(restX, 6, cz, 1, 1, trimId);
  sphere(restX, 8, cz, 1, magicId); // staff-top orb

  // casting arm reaching toward the duel's center
  const handX = cx + dir * 5;
  line(cx + dir * 2, 9, cz, handX, 9, cz, robeId);
  sphere(handX, 9, cz, 1, magicId); // charged hand orb
  block(handX + dir, 9, cz, magicId); // spark leading toward center

  // head + face
  sphere(cx, 10, cz, 1, SNOW_C);
  block(cx - 1, 10, cz - 1, STONE_C); // eye
  block(cx + 1, 10, cz - 1, STONE_C); // eye
  block(cx, 9, cz - 1, SNOW_C); // beard tuft

  // hat
  disk(cx, 11, cz, 3, trimId);
  const hatR = [2, 1, 1, 0];
  for (let i = 0; i < hatR.length; i++) {
    const y = 12 + i;
    if (hatR[i] > 0) disk(cx, y, cz, hatR[i], trimId);
    else block(cx, y, cz, trimId);
  }
  block(cx, 16, cz, trimId);
  block(cx + dir, 12, cz, robeId); // hat side charm

  return handX;
}

// Wizard A: arcane blue caster, casts toward +X
const handA = wizard(-9, 1, STONE_C, COBBLE_C, ICE_C, 1);
// Wizard B: fire caster, casts toward -X
const handB = wizard(9, 1, BRICK_C, STONE_C, SAND_C, -1);

// --- Magic beam clash ---
for (let x = handA + 1; x <= -1; x++) {
  cube(x, 9, 0, x, 10, 2, GLASS_C);
}
for (let x = 1; x <= handB - 1; x++) {
  cube(x, 9, 0, x, 10, 2, SAND_C);
}
// clash core
sphere(-1, 10, 1, 2, ICE_C);
sphere(1, 10, 1, 2, SAND_C);
sphere(0, 10, 1, 2, GLASS_C);
hollowSphere(0, 10, 1, 3, ICE_C);

// upward energy pillar from the clash
line(0, 12, 1, 0, 18, 1, GLASS_C);
block(0, 18, 1, ICE_C);

// zigzag "lightning" arcing down into the clash from above
line(0, 18, 1, -2, 16, 1, ICE_C);
line(-2, 16, 1, 2, 14, 1, ICE_C);
line(2, 14, 1, -1, 12, 1, ICE_C);
line(-1, 12, 1, 0, 10, 1, ICE_C);

// scattered sparks around the clash (deterministic ring)
for (let i = 0; i < 8; i++) {
  const ang = (i / 8) * Math.PI * 2;
  const sx = Math.round(Math.cos(ang) * 4);
  const sz = 1 + Math.round(Math.sin(ang) * 4);
  const sy = 10 + (i % 2 === 0 ? 1 : -1);
  block(sx, sy, sz, i % 2 === 0 ? ICE_C : SAND_C);
}

// --- Scorched arena floor ---
disk(0, -1, 1, 6, SAND_C);
hollowCylinder(0, -1, 1, 6, 1, BRICK_C);
hollowCylinder(0, -1, 1, 3, 1, BRICK_C);
for (let i = 0; i < 12; i++) {
  const ang = (i / 12) * Math.PI * 2;
  const rx = Math.round(Math.cos(ang) * 6);
  const rz = 1 + Math.round(Math.sin(ang) * 6);
  block(rx, -1, rz, i % 3 === 0 ? GLASS_C : STONE_C);
}
disk(-9, -1, 1, 2, BRICK_C); // ash mark under wizard A
disk(9, -1, 1, 2, BRICK_C);  // ash mark under wizard B

// --- Flanking arena pillars ---
function pillar(px, pz) {
  hollowCylinder(px, 0, pz, 1, 9, COBBLE_C);
  disk(px, 9, pz, 2, COBBLE_C);
  sphere(px, 11, pz, 1, GLASS_C);
}
pillar(-14, 3);
pillar(14, 3);
pillar(-14, -3);
pillar(14, -3);

// ender-dragon-4x-fable — prompt:
// the Ender Dragon...

// The Ender Dragon — flying over an End island with obsidian pillars, crystals and endermen
const B = STONE, SH = COBBLE, MEM = GLASS, SPK = SNOW, EYE = BRICK;

function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.02) block(x, y, z, id);
      }
}

// ---------- End island ground ----------
// clear trees over the island footprint, then pave with "end stone" (sand)
for (let y = 0; y <= 8; y++) disk(0, y, 1, 16, AIR);
// two stray rim trees just outside the cleared radius
cube(-11, 0, 13, -7, 7, 17, AIR);
cube(10, 0, -14, 14, 7, -10, AIR);
disk(0, -1, 1, 18, SAND);

// exit-portal fountain under the dragon
disk(0, 0, 1, 4, SH);
disk(0, 0, 1, 2, MEM);
// glowing rune ring set into the ground
for (let a = 0; a < 12; a++) {
  const t = a * Math.PI / 6;
  block(Math.round(7 * Math.cos(t)), -1, 1 + Math.round(7 * Math.sin(t)), MEM);
}

// ---------- Obsidian pillars with end crystals ----------
function pillar(x, z, h) {
  cylinder(x, 0, z, 2, h, SH);
  cube(x - 1, h, z - 1, x + 1, h, z + 1, SPK);       // bedrock cap
  hollowCube(x - 1, h + 1, z - 1, x + 1, h + 3, z + 1, MEM); // crystal cage
  block(x, h + 2, z, EYE);                            // crystal core
}
pillar(-13, -10, 10);
pillar(12, 11, 8);
pillar(7, -13, 6);

// ---------- Endermen wandering the island ----------
function enderman(x, z) {
  cube(x, 0, z, x, 3, z, B);          // legs, body, head
  block(x - 1, 2, z, B); block(x + 1, 2, z, B); // shoulders
  block(x - 1, 1, z, B); block(x + 1, 1, z, B); // hanging arms
}
enderman(-7, -4);
enderman(6, 9);
enderman(-4, 13);

// ---------- Dragon body ----------
ellipsoid(0, 15, -1, 3.6, 3.0, 4.6, B);   // chest
ellipsoid(0, 14.6, 3, 3.1, 2.7, 4.0, B);  // mid
ellipsoid(0, 14.2, 7, 2.4, 2.2, 3.2, B);  // hips
ellipsoid(0, 13.4, 1, 2.5, 1.7, 5.6, SH); // pale belly plating
sphere(3, 16, -3, 1.5, B);                // wing shoulders
sphere(-3, 16, -3, 1.5, B);

// back ridge spikes
for (const [z, y] of [[-5, 17], [-3, 18], [-1, 19], [1, 18], [3, 18], [5, 17], [7, 17]])
  block(0, y, z, SPK);

// ---------- Neck ----------
const neck = [[15.6, -4, 2.3], [16.2, -6, 2.0], [16.6, -8, 1.8], [16.6, -10, 1.6], [16.2, -12, 1.5]];
for (const [y, z, r] of neck) {
  sphere(0, y, z, r, B);
  block(0, Math.round(y + r), z, SPK);   // neck spikes
}

// ---------- Head (boxy ender-dragon skull, facing -Z) ----------
cube(-2, 14, -17, 2, 17, -12, B);         // skull
cube(-1, 15, -21, 1, 16, -17, B);         // snout
block(-1, 16, -21, SH); block(1, 16, -21, SH); // nostrils
cube(-1, 14, -20, 1, 14, -17, EYE);       // open mouth, fiery inside
block(-1, 14, -20, SPK); block(1, 14, -20, SPK); block(0, 14, -18, SPK); // fangs
cube(-1, 13, -21, 1, 13, -17, SH);        // lower jaw
block(-2, 16, -16, EYE); block(-2, 16, -15, EYE); // eyes
block(2, 16, -16, EYE); block(2, 16, -15, EYE);
// swept-back horns
line(2, 17, -12, 5, 20, -8, SH); line(2, 18, -12, 5, 21, -8, SH);
line(-2, 17, -12, -5, 20, -8, SH); line(-2, 18, -12, -5, 21, -8, SH);
block(5, 21, -7, SPK); block(-5, 21, -7, SPK);
// crown spikes behind the skull
block(0, 18, -13, SPK); block(-2, 18, -13, SPK); block(2, 18, -13, SPK);

// ---------- Wings ----------
function wingCol(s, i, id) {
  const yb = i <= 12 ? 16 + (i - 3) * 4 / 9 : 20 - (i - 12) * 2 / 9;
  const zle = -3 + (i - 3) * 0.12;
  const zte = 7 - 0.3 * (i - 3) - 1.3 * Math.abs(Math.sin((i - 3) * 0.9)); // scalloped edge
  for (let z = Math.round(zle); z <= Math.round(zte); z++) {
    const y = Math.round(yb - (z - zle) * 0.12);
    block(s * i, y, z, id);
  }
}
for (const s of [1, -1]) {
  for (let i = 4; i <= 21; i++) wingCol(s, i, MEM);        // membrane
  for (const i of [7, 11, 15, 19]) wingCol(s, i, SH);      // bone fingers
  line(s * 3, 16, -3, s * 12, 20, -2, SH);                 // leading-edge bone
  line(s * 4, 17, -3, s * 12, 21, -2, SH);
  line(s * 12, 20, -2, s * 21, 18, -1, SH);
  line(s * 12, 21, -2, s * 21, 19, -1, SH);
  block(s * 22, 17, -1, SPK); block(s * 22, 16, -2, SPK);  // wingtip claws
  block(s * 12, 22, -2, SPK);                              // elbow spike
}

// ---------- Legs (tucked, flying) ----------
function leg(x, z, big) {
  if (big) ellipsoid(x, 13, z, 1.7, 2.0, 2.3, B);   // haunch
  cube(x, 9, z - 1, x, 12, z, B);
  cube(x, 8, z - 2, x, 8, z, SH);                   // foot
  block(x, 8, z - 3, SPK);                          // claws
  block(x - Math.sign(x), 8, z - 2, SPK);
}
leg(3, -2, false); leg(-3, -2, false);
leg(3, 7, true); leg(-3, 7, true);

// ---------- Tail (long, swaying, rising) ----------
let tipX = 0, tipY = 0;
for (let i = 0; i <= 10; i++) {
  const t = i / 10;
  const z = 10 + i;
  const x = Math.round(2.5 * Math.sin(t * 2.8));
  const y = 14 + 1.5 * t + 3.5 * t * t;
  const r = 2.0 - 1.3 * t;
  sphere(x, Math.round(y), z, r, B);
  if (i % 2 === 0) block(x, Math.round(y + r), z, SPK);
  if (i === 10) { tipX = x; tipY = Math.round(y); }
}
// spiked tail tip
line(tipX, tipY, 20, tipX, tipY + 2, 22, SPK);
line(tipX, tipY, 20, tipX + 1, tipY + 1, 22, SPK);

// ---------- Floating end islets ----------
ellipsoid(-18, 10, 14, 3, 1.6, 3, SAND);
ellipsoid(18, 9, -14, 2.6, 1.4, 2.6, SAND);
cube(-18, 12, 14, -18, 13, 14, SH);   // mini crystal post
block(-18, 14, 14, MEM);
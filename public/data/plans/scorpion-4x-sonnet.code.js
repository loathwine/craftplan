// scorpion-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
function lerp(a, b, t) { return a + (b - a) * t; }

// ===== GROUND: desert patch under the scorpion =====
disk(0, -1, 2, 8, 6); // SAND

// ===== CEPHALOTHORAX (head/thorax) =====
cube(-4, 3, -7, 4, 7, -3, 3);           // STONE mass
hollowCube(-4, 3, -7, 4, 7, -3, 8);     // COBBLE exoskeleton rim
cube(-4, 3, -7, 4, 4, -7, 8);           // lower jaw ridge
cube(-1, 3, -8, 1, 3, -7, 8);           // chelicerae (mouth parts) jut forward
block(-2, 6, -7, 11);                   // GLASS eye
block(2, 6, -7, 11);                    // GLASS eye

// ===== MESOSOMA (segmented abdomen) =====
const segments = [
  [-4, 4, -3, 4, 8, -1],
  [-5, 4, -1, 5, 8, 1],
  [-5, 4, 1, 5, 8, 3],
  [-4, 3, 3, 4, 7, 5],
  [-4, 3, 5, 4, 7, 7],
  [-3, 3, 7, 3, 6, 9],
  [-3, 2, 9, 3, 5, 11],
];
for (const [x1, y1, z1, x2, y2, z2] of segments) {
  cube(x1, y1, z1, x2, y2, z2, 3); // STONE plate
}
for (const z of [-1, 1, 3, 5, 7, 9]) {
  cube(-5, 4, z, 5, 4, z, 8); // COBBLE ridge, belly seam
  cube(-5, 8, z, 5, 8, z, 8); // COBBLE ridge, dorsal seam
}

// ===== LEGS (4 pairs, bent, planted on ground) =====
function leg(sign, z) {
  cube(Math.min(4 * sign, 5 * sign), 3, z, Math.max(4 * sign, 5 * sign), 4, z + 1, 8);
  cube(Math.min(6 * sign, 10 * sign), 2, z, Math.max(6 * sign, 10 * sign), 3, z + 1, 8);
  cube(Math.min(11 * sign, 14 * sign), 0, z + 1, Math.max(11 * sign, 14 * sign), 2, z + 2, 8);
  cube(Math.min(14 * sign, 15 * sign), 0, z + 2, Math.max(14 * sign, 15 * sign), 0, z + 2, 3);
}
for (const z of [-2, 1, 4, 7]) {
  leg(1, z);
  leg(-1, z);
}

// ===== CLAWS (pedipalps), reaching forward toward the viewer =====
function claw(sign) {
  cube(Math.min(4 * sign, 9 * sign), 4, -8, Math.max(4 * sign, 9 * sign), 6, -6, 3);   // upper arm
  cube(Math.min(8 * sign, 13 * sign), 3, -12, Math.max(8 * sign, 13 * sign), 5, -9, 3); // forearm
  cube(Math.min(12 * sign, 16 * sign), 2, -16, Math.max(12 * sign, 16 * sign), 6, -13, 3); // pincer base
  cube(Math.min(13 * sign, 18 * sign), 5, -19, Math.max(13 * sign, 18 * sign), 6, -16, 8); // upper prong
  cube(Math.min(13 * sign, 18 * sign), 2, -19, Math.max(13 * sign, 18 * sign), 3, -16, 8); // lower prong
}
claw(1);
claw(-1);

// ===== TAIL (metasoma), arcing up and over the body toward the head =====
const tailJoints = [
  { x: 0, y: 5, z: 11, r: 2.4 },
  { x: 0, y: 7, z: 13, r: 2.2 },
  { x: 0, y: 11, z: 13, r: 2.0 },
  { x: 0, y: 15, z: 11, r: 1.8 },
  { x: 0, y: 18, z: 7, r: 1.6 },
  { x: 0, y: 20, z: 2, r: 1.4 },
  { x: 0, y: 19, z: -3, r: 1.2 },
  { x: 0, y: 16, z: -7, r: 0.9 },
];
for (let i = 0; i < tailJoints.length - 1; i++) {
  const a = tailJoints[i], b = tailJoints[i + 1];
  const steps = 3;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const x = Math.round(lerp(a.x, b.x, t));
    const y = Math.round(lerp(a.y, b.y, t));
    const z = Math.round(lerp(a.z, b.z, t));
    const r = lerp(a.r, b.r, t);
    sphere(x, y, z, Math.max(1, Math.round(r)), 3); // STONE tail segments
  }
}
for (const j of tailJoints) {
  hollowSphere(j.x, j.y, j.z, Math.max(1, Math.round(j.r)), 8); // COBBLE joint rings
}

// stinger, curving down toward the head
const tip = tailJoints[tailJoints.length - 1];
sphere(tip.x, tip.y - 2, tip.z - 2, 1, 10);   // BRICK barb
block(tip.x, tip.y - 3, tip.z - 3, 10);
block(tip.x, tip.y - 4, tip.z - 4, 10);

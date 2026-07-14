// alien-cow-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== UFO abducting a cow =====
const CX = 0, CZ = -3; // shared center: cow + beam + saucer all align here

// --- Clear a vertical shaft so the beam has an unobstructed sightline ---
cylinder(CX, 1, CZ, 7, 19, AIR);

// ================= COW (facing north / -Z, head toward viewer) =================
// Torso
cube(CX - 2, 4, CZ - 2, CX + 2, 7, CZ + 3, SNOW);
// Black patches (holstein spots)
cube(CX - 2, 6, CZ, CX - 2, 7, CZ + 2, STONE);
cube(CX + 2, 5, CZ - 1, CX + 2, 6, CZ + 1, STONE);
cube(CX - 1, 7, CZ + 1, CX + 1, 7, CZ + 2, STONE);
cube(CX - 1, 4, CZ + 2, CX + 1, 5, CZ + 3, STONE);

// Legs — front legs (near head, low z) dangle in the beam; rear legs still on ground
block(CX - 1, 3, CZ - 4, SNOW); block(CX - 1, 2, CZ - 4, SNOW); block(CX - 1, 1, CZ - 4, STONE); // hoof floating
block(CX + 1, 3, CZ - 4, SNOW); block(CX + 1, 2, CZ - 4, SNOW); block(CX + 1, 1, CZ - 4, STONE);
cube(CX - 1, 1, CZ + 2, CX - 1, 3, CZ + 2, SNOW); block(CX - 1, 1, CZ + 2, STONE);
cube(CX + 1, 1, CZ + 2, CX + 1, 3, CZ + 2, SNOW); block(CX + 1, 1, CZ + 2, STONE);

// Udder
cube(CX - 1, 3, CZ, CX + 1, 4, CZ + 1, BRICK);

// Head, raised & tilted up toward the beam
cube(CX - 1, 6, CZ - 5, CX + 1, 8, CZ - 2, SNOW);
cube(CX - 1, 6, CZ - 6, CX + 1, 7, CZ - 5, BRICK); // snout
block(CX - 1, 8, CZ - 3, STONE); block(CX + 1, 8, CZ - 3, STONE); // eyes
block(CX - 1, 9, CZ - 3, OAK_LOG); block(CX + 1, 9, CZ - 3, OAK_LOG); // horns
block(CX - 2, 8, CZ - 4, SNOW); block(CX + 2, 8, CZ - 4, SNOW); // ears
block(CX - 1, 6, CZ - 6, STONE); block(CX + 1, 6, CZ - 6, STONE); // nostrils accent

// Tail
line(CX, 6, CZ + 3, CX, 3, CZ + 5, OAK_LOG);
block(CX, 2, CZ + 5, COBBLE);

// ================= TRACTOR BEAM =================
function ringAt(cx, cy, cz, r, id) {
  const segs = Math.max(12, Math.round(r * 6));
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const x = Math.round(cx + r * Math.cos(a));
    const z = Math.round(cz + r * Math.sin(a));
    block(x, cy, z, id);
  }
}

for (let i = 0; i <= 12; i++) {
  const t = i / 12;
  const cy = Math.round(19 - t * 11); // 19 down to 8
  const r = 2 + t * 4;                // 2 up to 6
  const id = (i % 2 === 0) ? GLASS : ICE;
  ringAt(CX, cy, CZ, r, id);
}

// Vertical light struts holding the beam's shape
const struts = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
for (const a of struts) {
  const x1 = Math.round(CX + 2 * Math.cos(a)), z1 = Math.round(CZ + 2 * Math.sin(a));
  const x2 = Math.round(CX + 6 * Math.cos(a)), z2 = Math.round(CZ + 6 * Math.sin(a));
  line(x1, 19, z1, x2, 8, z2, GLASS);
}

// ================= UFO SAUCER =================
disk(CX, 20, CZ, 2, GLASS);   // emitter hub
disk(CX, 21, CZ, 5, COBBLE);
disk(CX, 22, CZ, 8, STONE);
disk(CX, 23, CZ, 10, COBBLE); // widest equator
disk(CX, 24, CZ, 8, STONE);
disk(CX, 25, CZ, 5, COBBLE);
sphere(CX, 27, CZ, 3, GLASS); // cockpit dome
block(CX, 30, CZ, STONE);     // antenna mast
block(CX, 31, CZ, GLASS);     // beacon tip

// Landing-light ring around the widest belt
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  const x = Math.round(CX + 6 * Math.cos(a));
  const z = Math.round(CZ + 6 * Math.sin(a));
  block(x, 21, z, GLASS);
}

// ================= CROP CIRCLE ON THE GROUND =================
for (let x = -9; x <= 9; x++) {
  for (let z = -12; z <= 6; z++) {
    const dx = x - CX, dz = z - CZ;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 2.5 && dist <= 9) {
      const band = Math.floor(dist / 1.8);
      if (band % 2 === 1) block(CX + dx, 0, CZ + dz, DIRT);
    }
  }
}

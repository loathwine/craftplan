// sonic-4x-fable — prompt:
// Sonic the Hedgehog...

function sp(cx, cy, cz, r, id) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        if (dx * dx + dy * dy + dz * dz <= r * r + 0.1) block(x, y, z, id);
      }
}

function spike(x0, y0, z0, x1, y1, z1, r0, r1, n, id) {
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    sp(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t, r0 + (r1 - r0) * t, id);
  }
}

function ring(cx, cy, cz, r, id) {
  const n = Math.ceil(r * 12);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    block(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), cz, id);
  }
}

// Clear trees/shrubs from the statue + trail footprint (local canopy tops out at y=8)
cube(-9, 1, -9, 9, 9, 14, AIR);

// ---- Green Hill checkered pedestal ----
for (let x = -8; x <= 8; x++)
  for (let z = -7; z <= 7; z++)
    for (let y = -1; y <= 0; y++) {
      const c = (Math.floor((x + 8) / 2) + Math.floor((z + 7) / 2)) % 2;
      block(x, y, z, c === 0 ? SAND : OAK_LOG);
    }

// ---- Legs (blue) — running pose, facing -Z ----
// Front leg, planted
cube(1, 5, -2, 2, 8, -1, GLASS);
// Back leg, kicked up behind
cube(-3, 7, 0, -2, 8, 1, GLASS);
cube(-3, 6, 1, -2, 7, 2, GLASS);
cube(-3, 5, 2, -2, 6, 3, GLASS);

// ---- Shoes (red with white strap, tan sole) ----
// Front shoe on the pedestal
cube(1, 1, -5, 3, 1, -1, PLANKS);
cube(1, 2, -5, 3, 3, -1, BRICK);
cube(1, 3, -3, 3, 3, -3, SNOW);
cube(1, 4, -2, 3, 4, -1, SNOW);        // sock cuff
// Back shoe, raised mid-stride
cube(-3, 4, 4, -1, 4, 7, PLANKS);
cube(-3, 5, 3, -1, 6, 7, BRICK);
cube(-3, 6, 5, -1, 6, 5, SNOW);
cube(-3, 7, 3, -1, 7, 4, SNOW);        // sock cuff

// ---- Body ----
sp(0, 12, 0, 4, GLASS);
sp(0, 11.5, -2.2, 2.4, SAND);          // tan belly patch
spike(0, 11, 3.5, 0, 13, 7, 1.2, 0.4, 3, GLASS);   // little back spike / tail

// ---- Arms (tan) with big white gloves ----
line(-3, 13, -1, -6, 11, -5, SAND);
line(-3, 12, -1, -6, 10, -5, SAND);
sp(-6, 10.5, -6, 1.7, SNOW);           // punching forward
line(3, 13, 0, 6, 12, 4, SAND);
line(3, 12, 0, 6, 11, 4, SAND);
sp(6, 11.5, 5, 1.7, SNOW);             // swung back

// ---- Head ----
sp(0, 21, 0, 6, GLASS);

// Swept-back quills
spike(0, 24.5, 2, 0, 27, 9, 2.2, 0.7, 5, GLASS);
spike(0, 22, 4.5, 0, 22.5, 12, 2.0, 0.6, 5, GLASS);
spike(0, 19.5, 4.5, 0, 18, 11, 1.8, 0.6, 5, GLASS);
spike(3, 21.5, 3, 5.5, 20, 9, 1.4, 0.5, 4, GLASS);
spike(-3, 21.5, 3, -5.5, 20, 9, 1.4, 0.5, 4, GLASS);

// Ears
cube(2, 27, -1, 4, 28, 1, GLASS);
cube(-4, 27, -1, -2, 28, 1, GLASS);
cube(3, 29, 0, 3, 30, 0, GLASS);
cube(-3, 29, 0, -3, 30, 0, GLASS);
block(3, 28, -2, SAND);
block(-3, 28, -2, SAND);

// Muzzle + cheeks (tan)
sp(0, 18.5, -4.6, 2.7, SAND);
sp(2.8, 19.3, -3.8, 1.4, SAND);
sp(-2.8, 19.3, -3.8, 1.4, SAND);
// Nose
sp(0, 20.3, -7, 1, OAK_LOG);
// Mouth
line(-1, 17, -7, 1, 17, -7, OAK_LOG);

// Eyes: joined white ovals, green iris, dark pupil
sp(2, 23, -5, 2.2, SNOW);
sp(-2, 23, -5, 2.2, SNOW);
sp(2, 22.7, -6.8, 1.2, LEAVES);
sp(-2, 22.7, -6.8, 1.2, LEAVES);
block(2, 23, -8, STONE);
block(-2, 23, -8, STONE);

// ---- Speed trail streaking off behind him ----
line(-3, 6, 7, -3, 6, 14, ICE);
line(0, 5, 7, 0, 5, 14, GLASS);
line(3, 7, 7, 3, 7, 14, ICE);
line(-1, 9, 7, -1, 9, 14, GLASS);
line(2, 10, 7, 2, 10, 14, ICE);
line(-2, 12, 7, -2, 12, 14, GLASS);
line(1, 13, 7, 1, 13, 14, ICE);
ring(0, 10, 11, 4, ICE);               // sonic-boom ring around the trail

// ---- Golden rings floating around the scene ----
ring(-11, 13, -4, 3, SAND);
ring(11, 12, -5, 3, SAND);
ring(13, 20, 2, 3, SAND);
ring(-13, 21, 3, 3, SAND);

// ---- Spring pad on the pedestal corner ----
cylinder(6, 1, -4, 1, 2, COBBLE);
disk(6, 3, -4, 2, SAND);
// mammoth-4x-fable — prompt:
// a woolly mammoth...

// Woolly mammoth with calf on snowy tundra — adult faces NORTH (-Z), calf to the east.

// Clear forest from the build footprint (trunk/tusk zone extends north)
cube(-9, 0, -20, 16, 21, 15, AIR);

// deterministic hash for shaggy fur variation
function h(x, y, z) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

// shaggy fur block: brown coat, darker below y=9 (hanging under-fur)
function fur(x, y, z, dust) {
  const r = h(x, y, z);
  let id = OAK_LOG;
  const dirtChance = y < 9 ? 0.35 : 0.18;
  if (r < dirtChance) id = DIRT;
  else if (r > 0.94) id = PLANKS;
  if (dust && r > 0.6) id = SNOW; // snow dusting on top surfaces
  block(x, y, z, id);
}

function furEllipsoid(cx, cy, cz, rx, ry, rz, dusted) {
  for (let x = Math.ceil(cx - rx); x <= Math.floor(cx + rx); x++)
    for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++)
      for (let z = Math.ceil(cz - rz); z <= Math.floor(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        const d = dx * dx + dy * dy + dz * dz;
        if (d <= 1) fur(x, y, z, dusted && dy > 0.72);
      }
}

function furBox(x1, y1, z1, x2, y2, z2) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++) fur(x, y, z, false);
}

// ============ ADULT MAMMOTH ============

// legs first (anchored 2 deep into ground for uneven terrain)
furBox(-5, -2, -3, -3, 9, -1);  // front left
furBox(3, -2, -3, 5, 9, -1);    // front right
furBox(-5, -2, 8, -3, 9, 10);   // hind left
furBox(3, -2, 8, 5, 9, 10);     // hind right
// toenails on visible north faces of front legs
block(-5, 0, -3, SNOW); block(-3, 0, -3, SNOW);
block(3, 0, -3, SNOW); block(5, 0, -3, SNOW);

// massive body + high shoulder hump (mammoth silhouette: front high, rear sloping)
furEllipsoid(0, 13, 4, 6.5, 5.8, 9, true);      // main barrel
furEllipsoid(0, 16.5, 0, 4.6, 4.2, 5.5, true);  // shoulder hump

// domed head with peaked crown knob
furEllipsoid(0, 15, -8, 4.2, 4.5, 4, true);
furEllipsoid(0, 18.5, -8, 2.6, 2.4, 2.6, true);

// small ears (dark, flat against head sides)
for (const s of [-1, 1]) {
  for (let y = 14; y <= 17; y++)
    for (let z = -9; z <= -7; z++) {
      if (y === 17 && z === -9) continue;
      if (y === 14 && z === -7) continue;
      block(s * 5, y, z, DIRT);
    }
}

// eyes + brows on the north-facing head front
block(-2, 16, -11, STONE); block(2, 16, -11, STONE);
block(-2, 17, -11, DIRT); block(2, 17, -11, DIRT);

// trunk: hangs from head front, curls forward at the tip
for (let i = 0; i <= 10; i++) {
  const y = 12 - i;
  const z = Math.round(-11 - i * 0.18);
  if (i < 6) {
    furBox(-1, y, z, 0, y, z + 1); // thick upper trunk 2x2
  } else {
    fur(0, y, z, false); fur(-1, y, z, false); // tapered lower
  }
}
block(0, 2, -14, OAK_LOG); block(0, 3, -14, DIRT); // curled tip

// tusks: sweep down from mouth, forward, then curl up and inward (SNOW = ivory)
for (const s of [-1, 1]) {
  for (let i = 0; i <= 21; i++) {
    const phi = (90 - i * 10) * Math.PI / 180; // 90deg -> -120deg
    const t = i / 21;
    const y = 10 - 4.5 * Math.cos(phi);
    const z = -14 + 4.5 * Math.sin(phi);
    const x = s * (2.5 + 1.8 * Math.sin(Math.PI * t) - 1.2 * t);
    const xi = Math.round(x), yi = Math.round(y), zi = Math.round(z);
    if (i < 10) {
      sphere(xi, yi, zi, 1, SNOW); // thick at base
    } else {
      block(xi, yi, zi, SNOW);
      block(xi, yi + (i > 15 ? -1 : 0), zi + 1, SNOW);
    }
  }
}

// hanging fur skirt along the body's lower flanks (irregular lengths)
for (let z = -4; z <= 12; z++) {
  const u = (z - 4) / 9;
  if (Math.abs(u) >= 0.98) continue;
  const w = Math.sqrt(1 - u * u);
  const half = 6.5 * w;
  const yTop = Math.ceil(13 - 5.8 * 0.53 * w);
  for (const s of [-1, 1]) {
    const x = Math.round(s * (half - 0.3));
    const len = 2 + Math.floor(h(x, 7, z) * 4);
    for (let y = yTop; y >= Math.max(2, yTop - len); y--) {
      block(x, y, z, h(x, y, z + 3) < 0.5 ? DIRT : OAK_LOG);
    }
  }
}
// chest fringe under the head/front
for (let x = -3; x <= 3; x++) {
  const len = 2 + Math.floor(h(x, 3, -5) * 3);
  for (let y = 10; y >= 10 - len; y--) block(x, y, -5, DIRT);
}

// tail with tuft
block(0, 13, 13, OAK_LOG); block(0, 13, 14, OAK_LOG);
block(0, 12, 14, OAK_LOG); block(0, 11, 14, DIRT);
block(0, 10, 15, DIRT); block(0, 9, 15, DIRT);

// ============ CALF (east of adult, also facing north) ============

furBox(10, -2, -3, 11, 4, -2); // front left leg
furBox(13, -2, -3, 14, 4, -2); // front right leg
furBox(10, -2, 2, 11, 4, 3);   // hind left
furBox(13, -2, 2, 14, 4, 3);   // hind right

furEllipsoid(12, 6.5, 0, 3.2, 2.8, 4.6, true); // body
furEllipsoid(12, 7.5, -5.5, 2.2, 2.3, 2, true); // head

// calf trunk
block(12, 5, -7, OAK_LOG); block(12, 4, -7, OAK_LOG);
block(12, 3, -8, OAK_LOG); block(12, 2, -8, DIRT);
// tiny tusk nubs
block(10, 5, -7, SNOW); block(10, 4, -8, SNOW);
block(14, 5, -7, SNOW); block(14, 4, -8, SNOW);
// eyes
block(11, 8, -7, STONE); block(13, 8, -7, STONE);
// ears
for (let y = 7; y <= 8; y++)
  for (let z = -6; z <= -5; z++) {
    block(9, y, z, DIRT); block(15, y, z, DIRT);
  }
// tail
block(12, 7, 5, OAK_LOG); block(12, 6, 5, DIRT);

// ============ TUNDRA DRESSING ============

// snow drift mounds (based below grade so they meet uneven ground)
function drift(cx, cz) {
  disk(cx, -2, cz, 3, SNOW);
  disk(cx, -1, cz, 3, SNOW);
  disk(cx, 0, cz, 2, SNOW);
  disk(cx, 1, cz, 1, SNOW);
}
drift(-11, -9);
drift(-12, 8);
drift(18, 11);
drift(8, -15);

// glacial boulders
sphere(-9, 0, 2, 2, COBBLE);
sphere(7, -1, 13, 2, STONE);
// jack-o-lantern-4x-fable — prompt:
// a jack-o'-lantern...

const S = SAND, B = BRICK, L = LEAVES, O = OAK_LOG, P = PLANKS;

// --- clear trees/canopy from the build footprint (targeted, AIR is free) ---
cube(-13, 0, -8, 13, 17, 15, AIR);   // main pumpkin volume
cube(-13, 0, -14, 13, 10, -8, AIR);  // camera corridor in front of the face
cube(-19, 0, 7, -11, 10, 13, AIR);   // scarecrow spot
cube(11, 0, 4, 19, 8, 12, AIR);      // back-east pumpkin spot
cube(-13, 0, 15, 13, 6, 17, AIR);    // fence line

// --- carved face mask in normalized (10-unit) pumpkin coords, facing -Z ---
function faceMask(nu, nv) {
  for (const e of [-4.2, 4.2]) {
    if (nv >= 0.8 && nv <= 4.2 && Math.abs(nu - e) <= (4.6 - nv) * 0.85) return true; // triangle eyes
  }
  if (nv >= -1.2 && nv <= 0.8 && Math.abs(nu) <= 1.4 - nv * 0.5) return true; // nose
  const vc = -4.6 + 0.055 * nu * nu; // grin curves up at the corners
  if (Math.abs(nu) <= 7 && nv >= vc - 1.4 && nv <= vc + 1.7) {
    const t = Math.floor(nu + 100) % 4;
    if (nv > vc + 0.4 && (t === 0 || t === 1)) return false; // upper teeth
    if (nv < vc - 0.5 && (t === 2 || t === 3)) return false; // lower teeth
    return true;
  }
  return false;
}

// --- ribbed hollow pumpkin; face is a 1-block recess with a SAND glow layer behind ---
function pumpkin(cx, cy, cz, R, sy, thick, withFace) {
  const s = R / 10, rv = R * sy;
  const carve = Math.max(1.2, thick * 0.6);
  for (let x = Math.floor(cx - R - 1); x <= Math.ceil(cx + R + 1); x++) {
    for (let z = Math.floor(cz - R - 1); z <= Math.ceil(cz + R + 1); z++) {
      for (let y = Math.max(-1, Math.floor(cy - rv - 1)); y <= Math.ceil(cy + rv + 1); y++) {
        const u = x - cx, w = z - cz, v = (y - cy) / sy;
        const rib = 1 + 0.05 * Math.cos(6 * Math.atan2(w, u));
        const hor = Math.sqrt(u * u + w * w) / rib;
        const dist = Math.sqrt(hor * hor + v * v);
        if (dist > R) continue;
        const inFace = withFace && w < -0.3 * R && faceMask(u / s, (y - cy) / (sy * s));
        if (dist >= R - thick) {
          if (inFace) block(x, y, z, dist >= R - carve ? AIR : S);
          else block(x, y, z, B);
        } else if (inFace && dist >= R - thick - 1.4) {
          block(x, y, z, S); // glow wall behind the openings
        }
      }
    }
  }
}

// --- the big jack-o'-lantern, face north ---
pumpkin(0, 6.5, 3, 10.4, 0.78, 1.9, true);

// stem, tilted with a curl, plus a few leaves
disk(0, 13, 3, 2, O);
disk(0, 14, 3, 2, O);
disk(0, 15, 3, 1, O);
block(0, 16, 3, O);
block(1, 16, 2, O);
block(2, 17, 2, O);
block(3, 17, 1, L);
block(-2, 14, 4, L);
block(2, 14, 5, L);
line(2, 14, 3, 4, 13, 5, L);

// --- pumpkin patch: little companions (one carved, rest plain) ---
pumpkin(12, 1.8, -4, 3.8, 0.85, 1.5, true);
block(12, 5, -4, O);
block(12, 6, -4, O);
pumpkin(-10, 1.2, -4, 2.8, 0.8, 1.3, false);
block(-10, 3, -4, O);
pumpkin(-6, 0.8, -9, 2.2, 0.85, 1.2, false);
block(-6, 2, -9, O);
pumpkin(15, 1.5, 8, 3.2, 0.8, 1.4, false);
block(15, 4, 8, O);

// ground vines linking the patch
line(6, 0, 0, 10, 0, -2, L);
line(10, 0, -2, 12, 0, -6, L);
line(-7, 0, 0, -10, 0, -2, L);
line(-9, 0, -3, -6, 0, -7, L);
line(9, 0, 6, 13, 0, 8, L);
block(8, 0, -2, L);
block(-8, 0, -5, L);
block(11, 0, 7, L);

// candlelight spilling onto the grass in front of the grin
for (const [gx, gz] of [[0, -9], [1, -9], [-1, -9], [2, -10], [-2, -10], [0, -10], [1, -11], [-1, -11], [0, -12], [3, -9], [-3, -9], [0, -13]]) {
  block(gx, -1, gz, S);
}

// --- rustic fence along the back (south) ---
for (const px of [-12, -8, -4, 0, 4, 8, 12]) {
  cube(px, -1, 16, px, 2, 16, O);
}
line(-12, 1, 16, 12, 1, 16, P);
line(-12, 2, 16, 12, 2, 16, P);
// a little stone crow perched on a post
block(4, 3, 16, STONE);
block(4, 4, 16, STONE);
block(4, 4, 15, STONE);

// --- scarecrow with a mini pumpkin head, west side ---
cube(-15, -1, 10, -15, 4, 10, O);          // pole
line(-18, 3, 10, -12, 3, 10, O);           // arms
cube(-16, 0, 10, -14, 2, 10, P);           // shirt
block(-19, 2, 10, S);                      // straw hands
block(-11, 2, 10, S);
pumpkin(-15, 5.5, 10, 1.6, 0.9, 1.6, false);
block(-16, 6, 9, S);                       // little glowing eyes + mouth
block(-14, 6, 9, S);
block(-15, 5, 9, S);
disk(-15, 7, 10, 2, S);                    // straw hat brim
block(-15, 8, 10, S);                      // hat crown
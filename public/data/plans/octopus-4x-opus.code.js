// octopus-4x-opus — prompt:
// a giant octopus...

const meta = {}; // (ignored by sandbox)

// ---- helpers ----
function ellShell(cx, cy, cz, rx, ry, rz, id, th) {
  th = th || 2;
  const ix = rx - th, iy = ry - th, iz = rz - th;
  for (let x = -rx; x <= rx; x++)
    for (let y = -ry; y <= ry; y++)
      for (let z = -rz; z <= rz; z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d > 1) continue;
        const di = (x*x)/(ix*ix) + (y*y)/(iy*iy) + (z*z)/(iz*iz);
        if (di > 1) block(cx + x, cy + y, cz + z, id);
      }
}

function tentacle(angDeg, reach, curlUp, sway, id) {
  const a = angDeg * Math.PI / 180;
  const dx = Math.sin(a), dz = -Math.cos(a);
  const px = Math.cos(a), pz = Math.sin(a);
  const baseX = 0, baseY = 9, baseZ = 5;
  const steps = 34;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const rad = 3 + reach * Math.pow(t, 0.85);
    const cu = Math.max(0, (t - 0.65) / 0.35);
    const y = baseY - 12 * t + curlUp * cu * cu;
    const swayOff = sway * Math.sin(t * Math.PI * 1.4);
    const cx = baseX + dx * rad + px * swayOff;
    const cz = baseZ + dz * rad + pz * swayOff;
    const r = Math.max(1, 3.4 * (1 - t) + 0.7);
    const RX = Math.round(cx), RY = Math.round(y), RZ = Math.round(cz);
    sphere(RX, RY, RZ, Math.round(r), id);
    // suckers along underside (light dots)
    if (i % 2 === 0 && t > 0.12) {
      const sy = Math.round(y - r * 0.7);
      block(RX, sy, RZ, SAND);
      // second staggered row toward front
      block(Math.round(cx + px * 0.9), sy, Math.round(cz + pz * 0.9), SAND);
    }
  }
}

// ---- MANTLE (head) : bulbous red body, faces NORTH (-Z) ----
const HX = 0, HY = 20, HZ = 5;
ellShell(HX, HY, HZ, 7, 9, 7, BRICK, 2);
// rounded pointed top cap
sphere(HX, HY + 8, HZ + 1, 3, BRICK);
sphere(HX, HY + 9, HZ + 1, 2, BRICK);

// arm-crown blob linking mantle base to tentacles
sphere(0, 11, 5, 5, BRICK);
sphere(0, 10, 4, 5, BRICK);

// mottled skin spots (asymmetric texture)
[[4,25,-1,2],[-3,26,3,2],[5,22,2,2],[-5,23,-1,1],[1,28,4,2],
 [3,24,6,1],[-4,19,5,2],[6,20,4,1],[-6,25,2,1],[2,17,-2,1]]
  .forEach(([x,y,z,r]) => sphere(HX + x, y, HZ + z, r, COBBLE));

// ---- EYES on the front (north) face ----
function eye(ex) {
  sphere(ex, 23, -2, 2, SNOW);            // eyeball bulge
  sphere(ex, 23, -3, 1, SNOW);
  cube(ex - 1, 23, -4, ex + 1, 23, -4, STONE); // horizontal slit pupil
  block(ex, 22, -4, STONE);
  // heavy brow ridge above eye (octopus eye-bump)
  sphere(ex, 26, -1, 2, BRICK);
  cube(ex - 2, 25, -2, ex + 2, 25, 0, BRICK);
}
eye(6);
eye(-6);

// brow bridge / frown between eyes
cube(-3, 25, -2, 3, 26, -1, BRICK);

// ---- BEAK / mouth , centered below eyes ----
cube(-1, 16, -4, 1, 17, -3, STONE);
block(0, 15, -4, STONE);
block(0, 16, -5, STONE);

// ---- SIPHON (funnel) on lower front-side ----
sphere(4, 13, -2, 2, BRICK);
block(5, 12, -4, STONE);

// ---- 8 TENTACLES ----   angle: 0=-Z(north/camera), +east
tentacle(-28, 16, 5, 2.2, BRICK);   // front-left toward camera
tentacle( 28, 16, 6, -2.2, BRICK);  // front-right toward camera
tentacle(-72, 16, 3, 2.5, BRICK);   // left side
tentacle( 72, 17, 7, -2.5, BRICK);  // right side (curled up, dynamic)
tentacle(-115, 13, 2, 2.0, BRICK);  // back-left
tentacle( 118, 13, 4, -2.0, BRICK); // back-right
tentacle(-158, 10, 1, 1.5, BRICK);  // rear
tentacle( 156, 11, 3, -1.5, BRICK); // rear

// ---- SCENE: floating bubbles (background/foreground depth) ----
[[11,21,-7],[-12,17,-4],[14,11,-8],[-14,9,-2],[9,27,-5],
 [-9,29,0],[16,15,-3],[-16,13,3],[12,6,-9],[-11,5,-6]]
  .forEach(([x,y,z]) => sphere(x, y, z, 1, GLASS));

// ---- SCENE: a few sea rocks at base for grounding ----
sphere(13, 0, 4, 3, STONE);
sphere(-14, 0, 8, 3, COBBLE);
sphere(-10, 0, -6, 2, STONE);
sphere(15, 0, -2, 2, COBBLE);
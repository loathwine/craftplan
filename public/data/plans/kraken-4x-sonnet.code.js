// kraken-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function rs(x, y, z, r, id) {
  sphere(Math.round(x), Math.round(y), Math.round(z), Math.max(0.5, r), id);
}

// ---------- clear footprint & lay the sea ----------
cylinder(0, -2, 0, 19, 15, AIR);           // clear trees/terrain above water (free)
disk(0, -1, 0, 16, GLASS);                  // open sea surface
disk(0, -1, 0, 5, GLASS);                   // (redundant center, cheap, keeps water under head clean)

// foam rings where big tentacles breach the surface
function foamRing(cx, cz, r) {
  for (let a = 0; a < 360; a += 18) {
    const rad = a * Math.PI / 180;
    rs(cx + Math.cos(rad) * r, -1, cz + Math.sin(rad) * r, 0.8, i => (a % 36 === 0 ? SNOW : ICE));
  }
}
// (foamRing uses id param incorrectly above trick removed below)

// ---------- head / mantle ----------
const HEAD = { x: 0, y: 9, z: -1 };
sphere(HEAD.x, HEAD.y, HEAD.z, 5, STONE);
sphere(HEAD.x, HEAD.y + 1, HEAD.z - 1, 4, COBBLE);      // mottled texture cap
sphere(HEAD.x, HEAD.y - 2, HEAD.z + 1, 4, STONE);       // lower jaw bulge

// brow ridge
cube(HEAD.x - 4, HEAD.y + 3, HEAD.z + 1, HEAD.x + 4, HEAD.y + 3, HEAD.z + 3, COBBLE);

// crown spikes
for (let i = 0; i < 6; i++) {
  const ang = i * 60 * Math.PI / 180;
  const hx = HEAD.x + Math.cos(ang) * 3.2;
  const hz = HEAD.z + Math.sin(ang) * 3.2;
  for (let j = 0; j < 4; j++) {
    rs(hx + Math.cos(ang) * j * 0.4, HEAD.y + 4 + j, hz + Math.sin(ang) * j * 0.4, 1.3 - j * 0.3, COBBLE);
  }
}

// eyes (glowing red, poking through the brow)
rs(HEAD.x - 2.2, HEAD.y + 1.5, HEAD.z + 4.6, 1.1, BRICK);
rs(HEAD.x + 2.2, HEAD.y + 1.5, HEAD.z + 4.6, 1.1, BRICK);
rs(HEAD.x - 2.2, HEAD.y + 1.5, HEAD.z + 5.2, 0.5, STONE); // pupil
rs(HEAD.x + 2.2, HEAD.y + 1.5, HEAD.z + 5.2, 0.5, STONE);

// beak / maw
sphere(HEAD.x, HEAD.y - 3, HEAD.z + 3, 2, COBBLE);
cube(HEAD.x - 2, HEAD.y - 4, HEAD.z + 3, HEAD.x + 2, HEAD.y - 4, HEAD.z + 5, STONE);
for (let i = -2; i <= 2; i++) {
  rs(HEAD.x + i * 0.9, HEAD.y - 3.5, HEAD.z + 5, 0.4, COBBLE); // teeth row
}

// ---------- tentacles ----------
function buildTentacle(cfg) {
  const ang0 = cfg.angle * Math.PI / 180;
  const totalSuckers = [];
  for (let i = 0; i <= cfg.seg; i++) {
    const t = i / cfg.seg;
    const r = cfg.r0 * (1 - t) + cfg.r1 * t;
    const dist = cfg.len * t;
    const wobble = (cfg.wobbleDeg || 0) * Math.PI / 180 *
      Math.sin(t * Math.PI * (cfg.wobbleFreq || 2) + (cfg.phase || 0));
    const ang = ang0 + wobble + (cfg.spiral || 0) * t * t;
    const x = cfg.originX + Math.cos(ang) * dist;
    const z = cfg.originZ + Math.sin(ang) * dist;
    const y = cfg.baseY + Math.sin(t * Math.PI * (cfg.riseFreq || 1)) * (cfg.riseAmp || 0) +
      (cfg.tipDrop || 0) * t * t;
    rs(x, y, z, r, STONE);
    if (i % 2 === 0) rs(x, y, z, r * 0.9, COBBLE); // mottled shading pass, cheap overlap
    if (cfg.suckers && i % 3 === 0 && t > 0.12 && t < 0.95) {
      const sx = x + Math.cos(ang + Math.PI / 2) * (r * 0.6 + 0.4);
      const sz = z + Math.sin(ang + Math.PI / 2) * (r * 0.6 + 0.4);
      rs(sx, y - r * 0.2, sz, 0.6, BRICK);
    }
  }
}

// two dramatic rearing tentacles flanking the head
buildTentacle({ originX: -3, originZ: -3, angle: 200, len: 17, seg: 26, r0: 2.6, r1: 0.6,
  baseY: 1, riseAmp: 19, riseFreq: 1.0, wobbleDeg: 14, wobbleFreq: 1.5, tipDrop: -4, suckers: true });
buildTentacle({ originX: 3, originZ: -3, angle: -20, len: 17, seg: 26, r0: 2.6, r1: 0.6,
  baseY: 1, riseAmp: 19, riseFreq: 1.0, wobbleDeg: -14, wobbleFreq: 1.5, tipDrop: -4, suckers: true });

// arching tentacle striking up from behind the head
buildTentacle({ originX: 0, originZ: -2, angle: 260, len: 15, seg: 22, r0: 2.2, r1: 0.5,
  baseY: 2, riseAmp: 16, riseFreq: 1.25, wobbleDeg: 10, wobbleFreq: 1.2, suckers: true });

// two low snaking tentacles along the water surface
buildTentacle({ originX: -2, originZ: 2, angle: 150, len: 16, seg: 22, r0: 2.0, r1: 0.5,
  baseY: 0, riseAmp: 3, riseFreq: 2.4, wobbleDeg: 26, wobbleFreq: 2.5, suckers: true });
buildTentacle({ originX: 2, originZ: 2, angle: 30, len: 14, seg: 20, r0: 1.8, r1: 0.5,
  baseY: 0, riseAmp: 2.5, riseFreq: 2.2, wobbleDeg: 24, wobbleFreq: 2.5, suckers: true });

// stub tentacle for silhouette fullness near the head
buildTentacle({ originX: 4, originZ: 1, angle: 0, len: 8, seg: 12, r0: 1.6, r1: 0.4,
  baseY: 2, riseAmp: 4, riseFreq: 1.5, wobbleDeg: 10, wobbleFreq: 1.5, suckers: true });

// grabbing tentacle reaching toward the shipwreck (built below, at ~angle 90, dist ~12)
buildTentacle({ originX: 0, originZ: 0, angle: 95, len: 13, seg: 20, r0: 2.2, r1: 0.7,
  baseY: 0.5, riseAmp: 2.5, riseFreq: 2, wobbleDeg: 8, wobbleFreq: 1.2, suckers: true });

// coil wrap around the ship's mast/hull
for (let h = 0; h < 3; h++) {
  hollowCylinder(1, -1 + h * 2, 11, 1.8, 1, STONE);
}

// ---------- shipwreck being dragged under ----------
for (let z = 7; z <= 15; z++) {
  const t = (z - 7) / 8;
  const y = Math.round(1 - t * 3);          // stern high, bow sinking
  const halfW = Math.round(2 - t * 0.5);
  cube(-halfW, y, z, halfW, y, z, PLANKS);          // deck
  cube(-halfW, y - 1, z, -halfW, y - 1, z, COBBLE);  // hull sides
  cube(halfW, y - 1, z, halfW, y - 1, z, COBBLE);
}
// broken mast
line(0, 1, 8, 0, 6, 8, OAK_LOG);
line(0, 6, 8, 3, 8, 6, OAK_LOG);      // snapped upper mast, leaning
cube(-1, 6, 7, 1, 6, 9, PLANKS);       // crow's nest platform remnant
// scattered debris
rs(-3, 0, 9, 0.6, PLANKS);
rs(4, -1, 10, 0.6, PLANKS);
rs(-2, -1, 13, 0.5, OAK_LOG);
rs(5, 0, 12, 0.5, PLANKS);

// ---------- foam / sea spray where big tentacles breach ----------
function foam(cx, cz, r) {
  for (let a = 0; a < 360; a += 20) {
    const rad = a * Math.PI / 180;
    const id = (a % 40 === 0) ? SNOW : ICE;
    rs(cx + Math.cos(rad) * r, -1, cz + Math.sin(rad) * r, 0.7, id);
  }
}
foam(-3 + Math.cos(200 * Math.PI / 180) * 17, -3 + Math.sin(200 * Math.PI / 180) * 17, 2.5);
foam(3 + Math.cos(-20 * Math.PI / 180) * 17, -3 + Math.sin(-20 * Math.PI / 180) * 17, 2.5);
foam(0, -1, 6);   // ripples around the head/mantle
```

// volcano-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== Erupting Volcano =====
const deg = Math.PI / 180;

function safeBlock(x, y, z, id) {
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  block(x, y, z, id);
}

const baseR = 19;      // radius at ground level
const craterR = 4;     // radius at top of main cone (before rim)
const coneTop = 16;    // y where main taper ends
const rimTop = 20;      // y of crater rim lip (open mouth above this)
const rimOuterR = 6;
const rimInnerR = 3;
const shellThick = 3;

function coneRadius(y) {
  const t = Math.min(Math.max(y / coneTop, 0), 1);
  const eased = Math.pow(t, 0.85);
  return baseR * (1 - eased) + craterR * eased;
}

// lava flow channels (angle 0 = north/-Z, positive = toward +X/east)
const flow1Angle = 15 * deg;   // main flow, north catching light
const flow2Angle = -40 * deg;  // secondary smaller flow, north-west

function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// ---- Main cone shell (hollow, rocky, with painted lava flows) ----
for (let y = 0; y <= coneTop; y++) {
  const outerR = coneRadius(y);
  const innerR = outerR - shellThick;
  const ext = Math.ceil(outerR) + 1;
  const halfW1 = 2.6 / Math.max(outerR, 1.5);
  const halfW2 = 1.8 / Math.max(outerR, 1.5);
  for (let x = -ext; x <= ext; x++) {
    for (let z = -ext; z <= ext; z++) {
      const d = Math.sqrt(x * x + z * z);
      if (d > outerR + 0.4 || d < innerR - 0.4) continue;
      const isOuterSkin = d >= outerR - 1.2;
      const ang = Math.atan2(x, -z);
      const onFlow1 = isOuterSkin && y <= rimTop && Math.abs(angleDiff(ang, flow1Angle)) < halfW1;
      const onFlow2 = isOuterSkin && y <= rimTop - 2 && Math.abs(angleDiff(ang, flow2Angle)) < halfW2 && (Math.random() < 0.75);

      let id;
      if (onFlow1 || onFlow2) {
        id = BRICK;
      } else {
        const r = Math.random();
        if (y <= 2 && r < 0.2) id = DIRT;
        else if (r < 0.12) id = COBBLE;
        else id = STONE;
      }
      safeBlock(x, y, z, id);
    }
  }
}

// ---- Crater rim (truncated top, open mouth) ----
for (let y = coneTop + 1; y <= rimTop; y++) {
  const halfW1 = 2.6 / rimOuterR;
  const halfW2 = 1.8 / rimOuterR;
  for (let x = -rimOuterR - 1; x <= rimOuterR + 1; x++) {
    for (let z = -rimOuterR - 1; z <= rimOuterR + 1; z++) {
      const d = Math.sqrt(x * x + z * z);
      if (d > rimOuterR + 0.4 || d < rimInnerR - 0.4) continue;
      const ang = Math.atan2(x, -z);
      const onFlow1 = Math.abs(angleDiff(ang, flow1Angle)) < halfW1;
      const onFlow2 = y <= rimTop - 1 && Math.abs(angleDiff(ang, flow2Angle)) < halfW2 && Math.random() < 0.75;
      let id;
      if (onFlow1 || onFlow2) id = BRICK;
      else id = Math.random() < 0.15 ? COBBLE : STONE;
      safeBlock(x, y, z, id);
    }
  }
}

// ---- Lava column inside the crater, rising toward the rim ----
for (let y = 12; y <= rimTop; y++) {
  const r = y >= rimTop - 2 ? 3 : 2;
  disk(0, y, 0, r, BRICK);
}

// ---- Flow 1: main lava river spilling to a lake at the base ----
{
  const ex = Math.round(coneRadius(0) * Math.sin(flow1Angle));
  const ez = Math.round(-coneRadius(0) * Math.cos(flow1Angle));
  disk(ex, -1, ez, 4, BRICK);
  disk(ex, 0, ez, 3, BRICK);
  // cooled crust border
  for (let x = -5; x <= 5; x++) {
    for (let z = -5; z <= 5; z++) {
      const d = Math.sqrt(x * x + z * z);
      if (d > 4 && d <= 5.4) safeBlock(ex + x, -1, ez + z, COBBLE);
    }
  }
}

// ---- Flow 2: smaller secondary lava pool ----
{
  const ex2 = Math.round(coneRadius(0) * Math.sin(flow2Angle));
  const ez2 = Math.round(-coneRadius(0) * Math.cos(flow2Angle));
  disk(ex2, -1, ez2, 3, BRICK);
}

// ---- Scorched ash ring around the volcano's base ----
for (let x = -22; x <= 22; x++) {
  for (let z = -22; z <= 22; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d >= baseR + 1 && d <= baseR + 3) {
      safeBlock(x, -1, z, Math.random() < 0.5 ? SAND : DIRT);
    }
  }
}

// ---- Boulders scattered on the slope ----
for (let i = 0; i < 16; i++) {
  const y = 1 + Math.floor(Math.random() * 8);
  const r = coneRadius(y) + 1;
  const ang = Math.random() * Math.PI * 2;
  const bx = Math.round(r * Math.sin(ang));
  const bz = Math.round(-r * Math.cos(ang));
  sphere(bx, y, bz, 1 + Math.floor(Math.random() * 2), COBBLE);
}

// ---- Ejected lava bombs frozen near the crater ----
for (let i = 0; i < 10; i++) {
  const bx = Math.round((Math.random() - 0.5) * 16);
  const bz = Math.round((Math.random() - 0.5) * 16);
  const by = rimTop + 1 + Math.floor(Math.random() * 5);
  sphere(bx, by, bz, 1, Math.random() < 0.5 ? BRICK : COBBLE);
}

// ---- Ash / smoke plume drifting up and east ----
for (let i = 0, y = rimTop + 2; y <= rimTop + 16; y += 2, i++) {
  const drift = i * 1.4;
  const r = Math.max(3 - i * 0.4, 1);
  sphere(Math.round(drift), y, Math.round(-1 - i * 0.3), r, STONE);
}
```

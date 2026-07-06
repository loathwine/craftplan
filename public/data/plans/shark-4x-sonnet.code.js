// shark-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function lerp(a, b, t) { return a + (b - a) * t; }

const MAXY = 31;      // snout tip
const HINGE_Y = 24;    // jaw hinge / throat
const TAIL_Y = 0;      // tail stock meets water

function leanZ(t) { return 6.5 * t; } // forward lean as shark rises

function bodyRadius(t) {
  if (t < 0.12) return lerp(0.9, 3.4, t / 0.12);
  if (t < 0.5)  return lerp(3.4, 6.2, (t - 0.12) / 0.38);
  if (t < 0.78) return lerp(6.2, 3.2, (t - 0.5) / 0.28);
  if (t < 0.9)  return lerp(3.2, 1.8, (t - 0.78) / 0.12);
  return lerp(1.8, 0.5, (t - 0.9) / 0.1);
}

// ===== MAIN TORSO + SKULL (with carved open mouth near the top) =====
for (let y = 0; y <= MAXY; y++) {
  const t = y / MAXY;
  const r = bodyRadius(t);
  const rx = r * 0.82;
  const rz = r * 1.0;
  const czc = leanZ(t);
  let frontCut = 999;
  if (y > HINGE_Y) {
    const ht = (y - HINGE_Y) / (MAXY - HINGE_Y);
    frontCut = rz * (1.0 - 2.3 * ht);
  }
  const rxi = Math.ceil(rx), rzi = Math.ceil(rz);
  for (let x = -rxi; x <= rxi; x++) {
    const nx = x / rx;
    if (nx * nx > 1) continue;
    for (let zz = -rzi; zz <= rzi; zz++) {
      const nz = zz / rz;
      if (nx * nx + nz * nz > 1) continue;
      if (y > HINGE_Y) {
        if (zz > frontCut + 2) continue;          // open mouth cavity, left empty
        if (zz > frontCut) { block(x, y, Math.round(czc) + zz, BRICK); continue; } // red mouth lining
      }
      const beltEdge = -0.12 * rz;
      let id;
      if (Math.abs(zz - beltEdge) < Math.max(0.6, 0.35 * r)) id = COBBLE;
      else if (zz > beltEdge) id = SNOW;   // white belly (+Z / front)
      else id = STONE;                     // gray dorsal (-Z / back)
      block(x, y, Math.round(czc) + zz, id);
    }
  }
}

// ===== UPPER JAW TEETH (hang down from the carved rim) =====
for (let y = HINGE_Y + 1; y <= MAXY - 1; y++) {
  const t = y / MAXY;
  const r = bodyRadius(t);
  const rx = r * 0.82, rz = r * 1.0;
  const czc = leanZ(t);
  const ht = (y - HINGE_Y) / (MAXY - HINGE_Y);
  const frontCut = rz * (1.0 - 2.3 * ht);
  if (frontCut < -rz) continue;
  const rxi = Math.floor(rx);
  for (let x = -rxi; x <= rxi; x += 2) {
    const z = Math.round(czc) + Math.round(frontCut);
    block(x, y - 1, z, SNOW);
    block(x, y - 2, z, SNOW);
  }
}

// ===== LOWER JAW (curves forward & down from the hinge, open gape) =====
const hingeT = HINGE_Y / MAXY;
const hingeR = bodyRadius(hingeT);
const hingeRx = hingeR * 0.82, hingeRz = hingeR;
const hingeCz = leanZ(hingeT);
const JAW_STEPS = 36;
for (let i = 0; i <= JAW_STEPS; i++) {
  const s = i / JAW_STEPS;
  const jy = Math.round(HINGE_Y - 1 - 5 * s + Math.sin(s * Math.PI) * 1.2);
  const jz = Math.round(hingeCz + hingeRz * 0.2 + 10 * s);
  const halfw = lerp(hingeRx * 0.8, 0.5, s);
  const thick = lerp(2.2, 0.6, s);
  const rxi = Math.ceil(halfw);
  const dcount = Math.ceil(thick);
  for (let x = -rxi; x <= rxi; x++) {
    if (Math.abs(x) > halfw) continue;
    for (let dy = 0; dy < dcount; dy++) block(x, jy - dy, jz, STONE);
    block(x, jy - dcount, jz, COBBLE);
  }
  if (i % 2 === 0) {
    for (let x = -Math.floor(halfw); x <= Math.floor(halfw); x += 2) block(x, jy + 1, jz, SNOW);
  }
}

// ===== EYES =====
const eyeT = 0.87;
const eyeY = Math.round(eyeT * MAXY);
const eyeR = bodyRadius(eyeT);
const eyeRx = eyeR * 0.82, eyeRz = eyeR;
const eyeCz = leanZ(eyeT);
for (const sign of [1, -1]) {
  const ex = sign * Math.round(eyeRx * 0.85);
  const ez = Math.round(eyeCz - eyeRz * 0.3);
  block(ex, eyeY, ez, COBBLE);
  block(ex, eyeY + 1, ez, COBBLE);
}

// ===== GILL SLITS =====
for (let g = 0; g < 5; g++) {
  const t = 0.68 + (0.76 - 0.68) * g / 4;
  const gy = Math.round(t * MAXY);
  const r = bodyRadius(t);
  const rx = r * 0.82;
  const czc = leanZ(t);
  for (const sign of [1, -1]) {
    const gx = sign * Math.round(rx * 0.97);
    for (let dz = -1; dz <= 1; dz++) block(gx, gy, Math.round(czc) + dz, COBBLE);
  }
}

// ===== FINS =====
function finZ(y0, cz0, rz0, sign, FH, FD, sweepY, vdir) {
  for (let d = 0; d <= FD; d++) {
    const frac = d / FD;
    const h = Math.round(FH * Math.pow(1 - frac, 1.3));
    const yShift = Math.round(sweepY * d);
    const zpos = Math.round(cz0 + sign * (rz0 * 0.3 + d));
    const width = Math.max(1, Math.round(2.4 * (1 - frac)));
    for (let hh = 0; hh <= h; hh++) {
      const y = y0 + yShift + vdir * hh;
      for (let x = -Math.floor(width / 2); x <= Math.floor(width / 2); x++) {
        block(x, y, zpos, (hh === h || d === FD) ? COBBLE : STONE);
      }
    }
  }
}
function finX(y0, cx0, cz0, sign, FD, dropPerStep, offset) {
  for (let d = 0; d <= FD; d++) {
    const frac = d / FD;
    const zthick = Math.max(1, Math.round(2.6 * (1 - frac)));
    const yShift = Math.round(-dropPerStep * d);
    const xpos = Math.round(cx0 + sign * (offset + d));
    for (let dz = -zthick; dz <= zthick; dz++) {
      block(xpos, y0 + yShift, cz0 + dz, (Math.abs(dz) === zthick || d === FD) ? COBBLE : STONE);
    }
  }
}

// main dorsal (back)
{
  const t = 0.42, y0 = Math.round(t * MAXY), r0 = bodyRadius(t), cz0 = leanZ(t);
  finZ(y0, cz0, r0, -1, 9, 6, -0.6, 1);
}
// second dorsal
{
  const t = 0.66, y0 = Math.round(t * MAXY), r0 = bodyRadius(t), cz0 = leanZ(t);
  finZ(y0, cz0, r0, -1, 4, 3, -0.4, 1);
}
// pelvic fins (belly, small, either side)
{
  const t = 0.22, y0 = Math.round(t * MAXY), r0 = bodyRadius(t), cz0 = leanZ(t);
  finZ(y0, cz0, r0, 1, 4, 3, -0.2, -1);
}
// anal fin (belly, further back)
{
  const t = 0.1, y0 = Math.round(t * MAXY), r0 = bodyRadius(t), cz0 = leanZ(t);
  finZ(y0, cz0, r0, 1, 3, 2, -0.1, -1);
}
// pectoral fins (both sides)
{
  const t = 0.58, y0 = Math.round(t * MAXY), r0 = bodyRadius(t), rx0 = r0 * 0.82, cz0 = leanZ(t);
  finX(y0, 0, cz0, 1, 9, 0.55, rx0 * 0.7);
  finX(y0, 0, cz0, -1, 9, 0.55, rx0 * 0.7);
}

// ===== CAUDAL (TAIL) FIN — heterocercal, dipping into the water =====
{
  const tailR = bodyRadius(0);
  const tailCz = leanZ(0);
  function tailLobe(lengthY, backZ, widthMax, curl) {
    const STEPS = 9;
    for (let i = 0; i <= STEPS; i++) {
      const f = i / STEPS;
      const y = Math.round(TAIL_Y - lengthY * f);
      const z = Math.round(tailCz - backZ * f + curl * Math.sin(f * Math.PI * 0.5));
      const w = Math.max(1, Math.round(widthMax * (1 - f * 0.85)));
      for (let x = -w; x <= w; x++) {
        block(x, y, z, (i === STEPS || Math.abs(x) === w) ? COBBLE : STONE);
      }
    }
  }
  tailLobe(7, 4, tailR * 1.4, 1.0);   // upper lobe, longer, sweeps back
  tailLobe(4, -3, tailR * 1.0, -0.6); // lower lobe, shorter, sweeps forward
}

// ===== REMORA HITCHHIKERS (small storytelling detail) =====
function remora(x, y, z) {
  sphere(x, y, z, 1, COBBLE);
  line(x, y, z + 2, x, y, z + 3, COBBLE);
}
{
  const t = 0.35, r0 = bodyRadius(t), cz0 = leanZ(t);
  remora(Math.round(r0 * 0.9), Math.round(t * MAXY), Math.round(cz0));
  remora(-Math.round(r0 * 0.85), Math.round(t * MAXY) - 2, Math.round(cz0 - 1));
}

// ===== WATER SPLASH AT THE BASE =====
disk(0, -1, -1, 10, GLASS);
for (let a = 0; a < 40; a++) {
  const ang = (a / 40) * Math.PI * 2;
  const rad = 9 + Math.sin(a * 2.3) * 1.5;
  const x = Math.round(Math.cos(ang) * rad);
  const z = Math.round(-1 + Math.sin(ang) * rad);
  block(x, 0, z, SNOW);
  if (a % 3 === 0) block(x, 1, z, SNOW);
}
for (let i = 0; i < 60; i++) {
  const ang = i * 2.399963;
  const rad = 2 + (i % 9);
  const x = Math.round(Math.cos(ang) * rad);
  const z = Math.round(-1 + Math.sin(ang) * rad * 0.8);
  const h = Math.round(1 + Math.abs(Math.sin(i * 1.7)) * 6);
  block(x, h, z, (i % 4 === 0) ? GLASS : SNOW);
}
```

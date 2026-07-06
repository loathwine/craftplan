// phoenix-4x-opus — prompt:
// phoenix...

const meta = { name: "phoenix", description: "Rising phoenix firebird with spread wings, flaming tail, crest" };

const CX = 0, CZ = 0;
function lerp(a, b, t) { return a + (b - a) * t; }
function inR(x, lo, hi) { return x >= lo && x <= hi; }
function blob(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (inR(x, -22, 22) && inR(y, -8, 33) && inR(z, -22, 22)) block(x, y, z, id);
}
function fireColor(t) { // 0=inner core .. 1=tip
  if (t < 0.45) return BRICK;
  if (t < 0.78) return SAND;
  return SNOW;
}

// ---------- BODY ----------
sphere(0, 6, 0, 4, BRICK);
sphere(0, 10, 0, 4, BRICK);
sphere(0, 13, 0, 3, BRICK);
sphere(0, 16, 0, 2, BRICK);
// golden breast (front = -Z)
sphere(0, 8, -2, 3, SAND);
sphere(0, 11, -2, 2, SAND);
sphere(0, 13, -2, 1, SAND);

// ---------- HEAD ----------
sphere(0, 19, 0, 3, BRICK);
sphere(0, 19, -2, 2, SAND);
// eyes
blob(-1, 20, -2, GLASS); blob(1, 20, -2, GLASS);
blob(-1, 20, -1, STONE); blob(1, 20, -1, STONE);
// beak (golden), pointing forward/down -Z
for (let f = 0; f <= 1; f += 0.15) {
  const x = 0, y = lerp(19, 16.5, f), z = lerp(-2, -6, f);
  blob(x, y, z, SAND);
  blob(x, y + 0.5, z, SAND);
}
blob(0, 17, -3, STONE); // beak seam

// ---------- CREST feathers (up & back) ----------
function crest(ax, spread) {
  const sy = 22;
  const ang = (100 + spread) * Math.PI / 180;
  const len = 6 - Math.abs(spread) * 0.05;
  for (let s = 0; s <= len; s += 0.6) {
    const f = s / len;
    const x = ax + Math.cos(ang) * s * 0.6;
    const y = sy + Math.sin(ang) * s;
    const z = 0 + f * 3; // sweep back
    blob(x, y, z, fireColor(f));
  }
}
for (const sp of [-40, -20, 0, 20, 40]) crest(0, sp);

// ---------- WINGS ----------
function wing(side) {
  const shx = 2 * side, shy = 14, shz = 0;
  // membrane (scan angle x radius)
  for (let a = -38; a <= 58; a += 2.2) {
    const ang = a * Math.PI / 180;
    const nrm = (a + 38) / 96; // 0..1
    const maxr = 11 + 9 * Math.sin(nrm * Math.PI);
    for (let r = 3; r <= maxr; r += 0.7) {
      const rr = r / maxr;
      const dx = side * Math.cos(ang) * r;
      const dy = Math.sin(ang) * r;
      const droop = rr * rr * 2.5;
      const fwd = -Math.sin(rr * Math.PI) * 3; // curve toward viewer (-Z)
      blob(shx + dx, shy + dy - droop, shz + fwd, fireColor(rr));
    }
  }
  // leading feather ridges + spiky tips
  for (const a of [-38, -25, -12, 0, 14, 28, 42, 56]) {
    const ang = a * Math.PI / 180;
    const nrm = (a + 38) / 96;
    const maxr = 11 + 9 * Math.sin(nrm * Math.PI) + 3; // extend past membrane for tips
    for (let r = 4; r <= maxr; r += 0.6) {
      const rr = r / (maxr);
      const dx = side * Math.cos(ang) * r;
      const dy = Math.sin(ang) * r;
      const droop = rr * rr * 2.5;
      const fwd = -Math.sin(rr * Math.PI) * 3 - 1;
      const id = rr > 0.82 ? SNOW : (rr > 0.55 ? SAND : BRICK);
      blob(shx + dx, shy + dy - droop, shz + fwd, id);
    }
  }
  // shoulder covert bump for volume
  sphere(shx + side * 2, 14, -1, 2, BRICK);
}
wing(1);
wing(-1);

// ---------- TAIL flames (down & back) ----------
function tailFeather(spread, lenBoost) {
  const sx = 0, sy = 4, sz = 1;
  const len = 18 + lenBoost;
  for (let s = 0; s <= len; s += 0.5) {
    const f = s / len;
    const wob = Math.sin(f * Math.PI * 2.2) * 1.2;
    const x = sx + spread * (2 + 5 * f) + wob * 0.4;
    const y = sy - 11 * f;               // descend
    const z = sz + 16 * f + wob;         // trail back
    const id = fireColor(f);
    blob(x, y, z, id);
    // thickness
    blob(x + 1, y, z, id);
    blob(x, y, z + 1, id);
    if (f > 0.3 && f < 0.9) blob(x - 1, y, z, id);
  }
}
tailFeather(-1.0, 0);
tailFeather(-0.6, 3);
tailFeather(-0.25, 6);
tailFeather(0.0, 8);
tailFeather(0.25, 6);
tailFeather(0.6, 3);
tailFeather(1.0, 0);
// central plume core (bright)
for (let s = 0; s <= 20; s += 0.5) {
  const f = s / 20;
  blob(0, 4 - 12 * f, 1 + 17 * f, f < 0.5 ? SAND : SNOW);
}

// ---------- TALONS (tucked golden legs) ----------
function leg(side) {
  for (let s = 0; s <= 4; s += 0.7) {
    const f = s / 4;
    blob(side * 1.5, 3 - f * 3, -1 + f * 1.5, SAND);
  }
  // claws
  blob(side * 1.5, 0, 1, STONE);
  blob(side * 1.5, 0, 0, STONE);
  blob(side * 2, 0, 1, STONE);
}
leg(1); leg(-1);

// ---------- rising embers (background separation / ambiance) ----------
for (let i = 0; i < 40; i++) {
  const a = i * 2.399963; // golden-angle spiral, deterministic
  const rad = 8 + (i % 7);
  const x = Math.cos(a) * rad;
  const z = Math.sin(a) * rad * 0.6;
  const y = 2 + (i * 0.7) % 22;
  const id = (i % 3 === 0) ? SNOW : (i % 3 === 1 ? SAND : BRICK);
  blob(x, y, z, id);
}
// a few high sparks above the crest
for (let i = 0; i < 8; i++) {
  blob(lerp(-4, 4, i / 7), 27 + (i % 3), (i % 2) * 2 - 1, SAND);
}
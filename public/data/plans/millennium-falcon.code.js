// millennium-falcon — prompt:
// The Millennium Falcon, the iconic Star Wars freighter spaceship, hovering low. SHAPE IS KEY: a flat round saucer disc hull (like a circular plate) with a distinctive front MANDIBLE fork - two prongs j...

// ===== The Millennium Falcon — hovering, mandible fork toward viewer (-Z) =====
const CX = 0, CZ = 4, R = 15;            // saucer center + max radius (31 across)

// radial sector/ring checker -> alternating STONE / COBBLE panels
function panel(x, z){
  const dx = x - CX, dz = z - CZ;
  const ang = Math.atan2(dz, dx);
  const rad = Math.hypot(dx, dz);
  const sec = Math.floor((ang + Math.PI) / (Math.PI / 9));   // 18 sectors
  const ring = Math.floor(rad / 2.6);
  return ((sec + ring) % 2 === 0) ? STONE : COBBLE;
}
// stepped lens profile: surface Y at a given radius
function topY(r){ return r <= 10 ? 12 : (r <= 13 ? 11 : 10); }
function botY(r){ return r <= 10 ? 7  : (r <= 13 ? 8  : 9);  }

// ---- clear forest canopy under the hovering ship (footprint only) ----
for (let y = 1; y <= 8; y++) disk(CX, y, CZ, 17, AIR);

// ---- main saucer body: stacked disks -> rounded flat hull ----
const layers = [[7,10],[8,13],[9,15],[10,15],[11,13],[12,10]];
for (const L of layers) disk(CX, L[0], CZ, L[1], STONE);

// ---- paneled skin: top surface, underside, and thick rim faces ----
for (let x = CX - R; x <= CX + R; x++)
  for (let z = CZ - R; z <= CZ + R; z++){
    const r = Math.hypot(x - CX, z - CZ);
    if (r > R - 0.4) continue;
    block(x, topY(r), z, panel(x, z));
    block(x, botY(r), z, panel(x, z));
    if (r > 11){ block(x, 9, z, panel(x, z)); block(x, 10, z, panel(x, z)); }
  }

// ---- raised central hull dome ----
disk(CX, 13, CZ, 9, STONE);
disk(CX, 14, CZ, 8, STONE);
for (let x = CX - 9; x <= CX + 9; x++)
  for (let z = CZ - 9; z <= CZ + 9; z++){
    const r = Math.hypot(x - CX, z - CZ);
    if (r <= 8.0) block(x, 14, z, panel(x, z));
    else if (r <= 9.0) block(x, 13, z, panel(x, z));
  }

// ---- concentric panel-line grooves + raised outer rim lip ----
hollowCylinder(CX, 14, CZ, 6, 1, COBBLE);
hollowCylinder(CX, 12, CZ, 9, 1, COBBLE);
hollowCylinder(CX, 11, CZ, 12, 1, COBBLE);
hollowCylinder(CX, 10, CZ, 14, 1, COBBLE);
hollowCylinder(CX, 11, CZ, 15, 1, STONE);

// ---- radial panel lines across the rim tiers ----
for (let k = 0; k < 16; k++){
  const a = k * Math.PI / 8, c = Math.cos(a), s = Math.sin(a);
  line(Math.round(CX+11*c),11,Math.round(CZ+11*s),
       Math.round(CX+14*c),10,Math.round(CZ+14*s), COBBLE);
}

// ---- raised rectangular detailing on the dome (asymmetric, some lit) ----
cube(-5,15,1,-1,16,6, COBBLE);
cube(1,15,-1,5,16,2, STONE);
cube(-2,15,-3,2,15,-1, GLASS);          // forward lit strip
cube(2,15,3,6,16,7, COBBLE);
block(-3,16,4, GLASS); block(4,16,5, GLASS); block(-1,16,2, GLASS);

// ---- round dish on a stalk, offset to one side ----
cylinder(8,12,11,1,3, STONE);
disk(8,15,11,3, COBBLE);
hollowCylinder(8,16,11,3,1, STONE);
block(8,16,11, GLASS);

// ---- rear engine band (BRICK housing + GLASS glow, following back arc) ----
for (let x = -11; x <= 11; x++){
  const zr = R*R - x*x; if (zr < 0) continue;
  const zb = CZ + Math.round(Math.sqrt(zr));
  block(x, 9, zb-1, BRICK);
  block(x, 10, zb-1, BRICK);
  block(x, 10, zb-2, GLASS);
}
cube(-3,9,18,3,11,19, BRICK);           // central engine block

// ---- lit running-light ports around the rim ----
for (let d = 0; d < 360; d += 22){
  const a = d*Math.PI/180, c = Math.cos(a), s = Math.sin(a);
  const x = Math.round(CX+13*c), z = Math.round(CZ+13*s);
  if (z-CZ < -6 && Math.abs(x-CX) < 6) continue;   // skip notch mouth
  block(x, topY(Math.hypot(x-CX,z-CZ)), z, GLASS);
}

// ---- carve the U-notch (after skin/lines so the gap is clean) ----
cube(CX-3, 7, CZ-22, CX+3, 13, CZ-9, AIR);

// ---- forward mandible prongs (the fork) ----
function prong(sgn){
  for (let z = -16; z <= -3; z++){
    const t = (z + 16) / 13;                          // 0 tip .. 1 base
    const outer = Math.round(4 + 7*Math.min(1, t*1.25));
    const yTop = (z < -11) ? 9 : 10;
    for (let ax = 4; ax <= outer; ax++)
      for (let y = 8; y <= yTop; y++)
        block(sgn*ax, y, z, ((ax+z)%2===0) ? STONE : COBBLE);
    if (z <= -6 && z >= -14 && z%2===0) block(sgn*4, 9, z, GLASS);  // mandible lights
  }
}
prong(1); prong(-1);

// ---- cockpit pod on a short arm, front-right (-X) ----
cube(-13, 8, -11, -9, 10, -5, STONE);                // connecting arm
sphere(-14, 9, -10, 3, STONE);                       // pod body
for (let dx=-3; dx<=3; dx++)
 for (let dy=-2; dy<=2; dy++)
  for (let dz=-3; dz<=3; dz++){
    const q = dx*dx + dy*dy + dz*dz;
    if (q >= 4 && q <= 9 && (dz <= -1 || dx <= -1))
      block(-14+dx, 9+dy, -10+dz, GLASS);            // cockpit windows
  }

// ---- belly sensor bump underneath ----
disk(CX, 6, CZ, 5, STONE);
disk(CX, 5, CZ, 3, COBBLE);
block(CX, 5, CZ+1, GLASS); block(CX, 5, CZ-1, GLASS);
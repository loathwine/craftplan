// wizard-duel-4x-fable — prompt:
// two wizards dueling with magic...

// Two wizards dueling with magic — frost wizard (west) vs fire wizard (east),
// beams clashing in an explosion at center, cracked scorched/frozen arena.

// ---- clear a corridor through the forest for the duel ----
cube(-22, 1, -12, 22, 25, 10, AIR);

// ---- arena floor: flatten ellipse, mottle west=frost / east=scorch ----
for (let x = -18; x <= 18; x++) {
  for (let z = -9; z <= 9; z++) {
    if ((x * x) / (18 * 18) + (z * z) / (9 * 9) > 1) continue;
    block(x, 0, z, AIR); // flatten bumps
    const h = ((x * 37 + z * 61) % 100 + 100) % 100;
    if (Math.abs(x) <= 1) {
      if (h < 80) block(x, -1, z, h < 40 ? STONE : COBBLE);
    } else if (x < 0) {
      if (h < 18) block(x, -1, z, ICE);
      else if (h < 36) block(x, -1, z, SNOW);
    } else {
      if (h < 15) block(x, -1, z, BRICK);
      else if (h < 32) block(x, -1, z, COBBLE);
      else if (h < 40) block(x, -1, z, STONE);
    }
  }
}

// radial cracks from the blast
const cr = [[1,0],[0.9,0.45],[0.45,0.9],[0,1],[-0.45,0.9],[-0.9,0.45],[-1,0],[-0.9,-0.45],[-0.45,-0.9],[0,-1],[0.45,-0.9],[0.9,-0.45]];
cr.forEach((d, i) => {
  const L = 9 + (i % 3) * 2;
  line(Math.round(4 * d[0]), -1, Math.round(4 * d[1]),
       Math.round(L * d[0]), -1, Math.round(L * d[1]), COBBLE);
});

// crater under the clash point
disk(0, -1, 0, 3, AIR);
disk(0, -2, 0, 2, AIR);
disk(0, -3, 0, 2, COBBLE);
hollowCylinder(0, -2, 0, 3, 1, COBBLE);
hollowCylinder(0, -1, 0, 4, 1, COBBLE);

// ---- wizard builder ----
function wizard(cx, dir, robe, trim, eye, orbCore, orbTip, dais, cape, beard) {
  // magic circle + dais
  hollowCylinder(cx, 0, 0, 7, 1, trim);
  [[7,0],[-7,0],[0,7],[0,-7]].forEach(p => block(cx + p[0], 0, p[1], SNOW));
  disk(cx, 0, 0, 5, dais);
  // robe cone
  cylinder(cx, 1, 0, 5, 2, robe);
  cylinder(cx, 3, 0, 4, 2, robe);
  cylinder(cx, 5, 0, 3, 2, robe);
  cylinder(cx, 7, 0, 2, 8, robe); // torso y7..14
  hollowCylinder(cx, 1, 0, 5, 1, trim); // hem
  hollowCylinder(cx, 8, 0, 2, 1, trim); // belt
  // robe ornaments (front face, toward camera)
  block(cx, 2, -5, trim); block(cx - 3, 2, -4, trim); block(cx + 3, 2, -4, trim);
  block(cx, 4, -4, trim); block(cx - 2, 3, -3, trim); block(cx + 2, 4, -3, trim);
  block(cx, 5, -3, trim); block(cx - 2, 6, -2, trim); block(cx + 2, 6, -2, trim);
  block(cx, 10, -2, trim); block(cx, 12, -2, trim);
  // wind-blown cape trailing away from the fight
  for (let t = 0; t < 5; t++) {
    const x = cx - (3 + t) * dir, yb = 12 - 2 * t;
    cube(x, yb, -2, x, yb + 3, 2, cape);
  }
  // shoulders, head, face
  disk(cx, 15, 0, 3, robe);
  cube(cx - 1, 16, -1, cx + 1, 18, 1, SAND);
  block(cx - 1, 17, -1, eye); block(cx + 1, 17, -1, eye);
  // beard hanging over the chest
  cube(cx - 1, 14, -2, cx + 1, 16, -2, beard);
  block(cx, 13, -2, beard);
  // hat: wide brim + leaning point
  disk(cx, 19, 0, 4, robe);
  cylinder(cx, 20, 0, 2, 2, robe);
  hollowCylinder(cx, 20, 0, 2, 1, trim);
  block(cx, 21, -2, trim); // emblem
  cylinder(cx, 22, 0, 1, 2, robe);
  block(cx, 24, 0, robe);
  block(cx + dir, 25, 0, robe);
  block(cx + dir, 26, 0, trim);
  // casting arm thrust toward the enemy
  line(cx + 2 * dir, 14, 0, cx + 7 * dir, 12, 0, robe);
  line(cx + 3 * dir, 13, 0, cx + 7 * dir, 11, 0, robe);
  block(cx + 7 * dir, 12, 0, SAND); // hand
  // staff arm + staff with glowing orb (off-hand, north side so camera sees it)
  const sx = cx - 4 * dir;
  line(cx - 2 * dir, 14, 0, sx, 12, -2, robe);
  line(sx, 1, -2, sx, 18, -2, OAK_LOG);
  sphere(sx, 20, -2, 1, orbCore);
  block(sx, 22, -2, orbTip);
}

// frost wizard (west), fire wizard (east)
wizard(-14,  1, GLASS, ICE,  ICE,   ICE,   SNOW, SNOW,   SNOW, SNOW);
wizard( 14, -1, BRICK, SAND, BRICK, BRICK, SAND, COBBLE, SAND, SNOW);

// ---- duel beams: cores with double-helix energy ----
for (let i = 0; i <= 5; i++) {
  // frost beam, west hand (-7) toward center
  let xa = -6 + i;
  block(xa, 12, 0, ICE);
  let a = i * 1.1;
  let dy = Math.round(1.7 * Math.sin(a)), dz = Math.round(1.7 * Math.cos(a));
  block(xa, 12 + dy, dz, GLASS);
  block(xa, 12 - dy, -dz, SNOW);
  // fire beam, east hand (7) toward center
  let xb = 6 - i;
  block(xb, 12, 0, BRICK);
  let b = i * 1.1 + 1.5;
  dy = Math.round(1.7 * Math.sin(b)); dz = Math.round(1.7 * Math.cos(b));
  block(xb, 12 + dy, dz, SAND);
  block(xb, 12 - dy, -dz, BRICK);
}

// ---- clash explosion at center ----
sphere(0, 12, 0, 2, SNOW);
for (let dx = -5; dx <= 5; dx++)
  for (let dy = -5; dy <= 5; dy++)
    for (let dz = -5; dz <= 5; dz++) {
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d >= 3.7 && d <= 4.4) {
        if ((dx + dy + dz + 15) % 3 === 0) continue; // ragged energy shell
        block(dx, 12 + dy, dz, dx < 0 ? ICE : BRICK);
      }
    }

// shockwave ring in the vertical plane between them
for (let k = 0; k < 20; k++) {
  const a = (k * Math.PI) / 10;
  block(0, 12 + Math.round(6 * Math.sin(a)), Math.round(6 * Math.cos(a)),
        k % 2 === 0 ? SNOW : GLASS);
}

// sparks flying off the clash (biased up and toward camera)
const rays = [[0,1,0],[0,0.8,-0.6],[0.6,0.8,0],[-0.6,0.8,0],[0,0.6,0.8],
              [0.8,0.2,-0.6],[-0.8,0.2,-0.6],[0.7,-0.4,-0.6],[-0.7,-0.4,-0.6],[0,-0.3,-0.95]];
rays.forEach(r => {
  const c = r[0] < 0 ? ICE : (r[0] > 0 ? BRICK : SNOW);
  line(Math.round(5 * r[0]), 12 + Math.round(5 * r[1]), Math.round(5 * r[2]),
       Math.round(9 * r[0]), 12 + Math.round(9 * r[1]), Math.round(9 * r[2]), c);
});

// rubble levitating in the magical turbulence
const rocks = [[-5,6,-6],[4,7,-7],[-7,9,-5],[7,10,-4],[-3,17,-4],[3,18,-3],
               [-8,14,2],[8,15,2],[0,19,-3],[-6,18,3],[6,19,3],[-9,8,4],[9,9,4]];
rocks.forEach((r, i) => {
  block(r[0], r[1], r[2], i % 2 === 0 ? STONE : COBBLE);
  if (i % 3 === 0) block(r[0], r[1] + 1, r[2], COBBLE);
});

// ---- battlefield dressing ----
// ice spikes erupting behind the frost wizard
[[-19,-5,7],[-21,3,9],[-18,5,6],[-17,-7,5],[-20,7,5]].forEach(s => {
  cylinder(s[0], 0, s[1], 1, Math.floor(s[2] / 2), ICE);
  line(s[0], Math.floor(s[2] / 2), s[1], s[0], s[2], s[1], ICE);
  block(s[0], s[2] + 1, s[1], SNOW);
});
// flame pillars behind the fire wizard
[[19,-5],[21,3],[18,5],[17,-7],[20,7]].forEach(p => {
  cylinder(p[0], 0, p[1], 1, 2, COBBLE);
  sphere(p[0], 3, p[1], 1, BRICK);
  block(p[0], 5, p[1], BRICK);
  block(p[0], 6, p[1], SAND);
});
// drifting snowflakes / embers
[[-11,9,-4,SNOW],[-10,14,-3,ICE],[-8,16,1,SNOW],[-12,17,-2,ICE],
 [-9,6,3,SNOW],[-6,11,-5,ICE],[-10,11,4,SNOW],[-12,7,2,ICE],
 [11,9,-4,SAND],[10,14,-3,BRICK],[8,16,1,SAND],[12,17,-2,BRICK],
 [9,6,3,SAND],[6,11,-5,BRICK],[10,11,4,SAND],[12,7,2,BRICK]]
  .forEach(p => block(p[0], p[1], p[2], p[3]));
// ground-level frost crystals (west) and small fires (east)
[[-7,-6],[-10,5],[-5,7],[-11,-5]].forEach(p => {
  cube(p[0], 0, p[1], p[0], 1, p[1], ICE);
  block(p[0], 2, p[1], SNOW);
});
[[7,-6],[10,5],[5,7],[11,-5]].forEach(p => {
  block(p[0], 0, p[1], OAK_LOG);
  block(p[0], 1, p[1], BRICK);
  block(p[0], 2, p[1], SAND);
});
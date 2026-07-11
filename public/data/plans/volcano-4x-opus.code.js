// volcano-4x-opus — prompt:
// an erupting volcano...

cube(-1,-1,-1,-1,-1,-1,STONE); // no-op anchor so linter of geometry present

// ===== ERUPTING VOLCANO =====
// Camera looks south (-Z is front). Glowing lava veins + main crater face the viewer.

const H = 22;          // summit height
const baseR = 15;      // radius at ground
const topR  = 4;       // crater opening radius
function radiusAt(y){ return baseR + (topR - baseR) * (y / H); }

// lumpy surface noise (deterministic)
function lump(x, z, y){
  return Math.sin(x*0.7)*1.3 + Math.cos(z*0.65)*1.3
       + Math.sin((x+z)*0.35 + y*0.2)*1.1;
}

// glowing lava veins running down the surface, concentrated on the FRONT (-Z)
const veins = [-Math.PI/2, -Math.PI/2+0.75, -Math.PI/2-0.75, -Math.PI/4, -Math.PI/2+1.5];
function glow(x, z, y){
  if (y < 2 || y > H-1) return false;
  const th = Math.atan2(z, x);
  for (const c of veins){
    const cc = c + Math.sin(y*0.4)*0.22;      // vein meanders as it descends
    let d = Math.abs(th - cc);
    if (d > Math.PI) d = 2*Math.PI - d;
    if (d < 0.11 + (1 - y/H)*0.06) return true;
  }
  return false;
}

function coneBlock(x, y, z){
  if (y >= H-2) return BRICK;                              // molten crater rim
  if (glow(x, z, y)) return BRICK;                         // lava veins
  if (y > H-6 && (((x*5 + z*3 + y) % 4) + 4) % 4 === 0) return BRICK; // heat near summit
  if ((((x*7 + z*13 + y*5) % 5) + 5) % 5 === 0) return COBBLE;
  if ((((x*3 + z*11 + y*7) % 7) + 7) % 7 === 0) return DIRT;          // ash patches
  return STONE;
}

// ---- build the hollow cone (crater is naturally open at the top) ----
for (let y = 0; y <= H; y++){
  const r = radiusAt(y);
  const lim = Math.ceil(r) + 4;
  for (let x = -lim; x <= lim; x++){
    for (let z = -lim; z <= lim; z++){
      const d = Math.sqrt(x*x + z*z);
      const rO = r + lump(x, z, y);
      if (d <= rO && d >= rO - 2){
        block(x, y, z, coneBlock(x, y, z));
      }
    }
  }
}

// close the interior just under the lava lake so you can't see through the crater
disk(0, H-6, 0, radiusAt(H-6) - 1, STONE);

// ---- lava lake inside the crater ----
for (let y = H-5; y <= H-1; y++){
  disk(0, y, 0, Math.max(1, radiusAt(y) - 1), BRICK);
}
// bubbling gouts rising from the lake
for (const b of [[0,0],[2,1],[-2,-1],[1,-2],[-1,2]]){
  cylinder(b[0], H-4, b[1], 1, 5 + (Math.abs(b[0])+Math.abs(b[1])), BRICK);
}

// ---- lava flows spilling down the outer face ----
function flow(aStart){
  for (let t = 0; t <= 1.0001; t += 0.045){
    const y = Math.round((H-1) - t*(H-1));
    if (y < 0) break;
    const r = radiusAt(y) + lump(Math.cos(aStart)*10, Math.sin(aStart)*10, y) + 0.3;
    const a = aStart + Math.sin(y*0.45)*0.18;
    const x = Math.round(Math.cos(a)*r);
    const z = Math.round(Math.sin(a)*r);
    block(x, y, z, BRICK);
    // widen for visibility
    block(x + (Math.abs(Math.cos(a))>0.5?0:1), y, z + (Math.abs(Math.cos(a))>0.5?1:0), BRICK);
    if (t > 0.25 && ((y % 4)===0)) block(x, y+1, z, BRICK); // dribbles
  }
}
[-Math.PI/2, -Math.PI/2+0.8, -Math.PI/2-0.8, -Math.PI/4].forEach(flow);

// pooled lava at the base of the front where flows collect
disk(0, 0, -13, 4, BRICK);
disk(-9, 0, -9, 3, BRICK);
hollowCylinder(0, 0, -13, 5, 1, COBBLE); // cooled crust rim

// ---- eruption plume ----
cylinder(0, H-1, 0, 2, 9, BRICK);          // molten jet
cylinder(0, H+6, 0, 1, 4, BRICK);          // thinning tip
// billowing ash cloud (drifts east/+X and catches the light)
hollowSphere( 1, H+9, 0, 4, COBBLE);
hollowSphere( 4, H+11, 1, 4, STONE);
hollowSphere( 6, H+9, -1, 3, COBBLE);
hollowSphere(-2, H+11, 0, 3, STONE);
hollowSphere( 3, H+12, 0, 3, DIRT);

// glowing embers scattered through the lower plume
for (let i = 0; i < 44; i++){
  const a = i * 2.399;                       // golden-angle spread
  const rad = 1 + (i % 5);
  const ex = Math.round(Math.cos(a) * rad);
  const ez = Math.round(Math.sin(a) * rad * 0.7);
  const ey = H + 1 + (i % 8);
  block(ex, ey, ez, BRICK);
}

// ---- lava bombs arcing out and landing on the slopes / ground ----
function bomb(a, dist, apex){
  for (let t = 0; t <= 1.0001; t += 0.06){
    const horiz = t * dist;
    const x = Math.round(Math.cos(a) * horiz);
    const z = Math.round(Math.sin(a) * horiz);
    const y = Math.round((H) + (0 - H)*t + apex*Math.sin(Math.PI*t));
    if (y < -1) continue;
    block(x, y, z, BRICK);
  }
}
bomb(-Math.PI/2, 20, 9);
bomb(-Math.PI/2 - 0.5, 18, 11);
bomb(-Math.PI/3, 21, 8);
bomb(-2.4, 19, 10);
bomb(-0.7, 20, 12);

// ---- foreground scene: charred ground, cracks, burnt trees, boulders ----
// radiating molten cracks across the scorched ground (front side)
function crack(a, len){
  for (let s = baseR + 1; s <= baseR + len; s++){
    const x = Math.round(Math.cos(a) * s);
    const z = Math.round(Math.sin(a) * s);
    if (Math.abs(x) > 21 || Math.abs(z) > 21) break;
    block(x, 0, z, BRICK);
    if (s % 2 === 0) block(x, -1, z, BRICK);
  }
}
[-Math.PI/2, -Math.PI/2+0.4, -Math.PI/2-0.4, -Math.PI/3, -2.2].forEach(a => crack(a, 6));

// small secondary cinder cone (asymmetry, front-left)
(function secondaryVent(cx, cz){
  for (let y = 0; y <= 5; y++){
    const r = 4 - y*0.6;
    for (let x = -5; x <= 5; x++) for (let z = -5; z <= 5; z++){
      const d = Math.sqrt(x*x + z*z);
      if (d <= r && d >= r - 1.5) block(cx+x, y, cz+z, y >= 4 ? BRICK : COBBLE);
    }
  }
  block(cx, 5, cz, BRICK);
  block(cx, 6, cz, BRICK);
})(-12, -8);

// burnt, leaning trees dotted around the base
function burntTree(bx, bz, h, lean){
  for (let y = 0; y <= h; y++){
    block(bx + Math.round(y*lean), y, bz, OAK_LOG);
  }
  block(bx + Math.round(h*lean), h+1, bz, OAK_LOG);
  block(bx + Math.round(h*lean)+1, h, bz, OAK_LOG); // snapped branch
}
burntTree(-17, -11, 5, 0.15);
burntTree(15, -13, 4, -0.2);
burntTree(-18, -3, 6, 0.1);
burntTree(17, -6, 5, -0.15);
burntTree(-15, -16, 4, 0.2);

// scattered volcanic boulders (foreground rocks)
[[-8,-16],[9,-15],[-13,-14],[13,-9],[-6,-18],[5,-17],[-11,-17]].forEach(p => {
  sphere(p[0], 0, p[1], 1 + ((p[0]+p[1]) % 2 === 0 ? 1 : 0), COBBLE);
});

// a few ash-dusted patches (SNOW-free grey) on the near ground for texture
[[-4,-15],[3,-14],[-9,-13],[7,-12],[-2,-17]].forEach(p => {
  block(p[0], 0, p[1], DIRT);
  block(p[0]+1, 0, p[1], COBBLE);
});
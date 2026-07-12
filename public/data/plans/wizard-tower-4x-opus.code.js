// wizard-tower-4x-opus — prompt:
// a wizard's tower...

const BUILD = (() => {
const CX = 0, CZ = 2;            // tower center; front (north) is toward -Z
const groundY = 0;

// ---------- helpers ----------
function radiusAt(y){
  if (y <= 8)  return 6;
  if (y <= 16) return 5;
  return 4;
}
function ring(cx, cy, cz, R, id, step, phase){
  for (let d = phase||0; d < 360 + (phase||0); d += step){
    const a = d * Math.PI / 180;
    block(cx + Math.round(R*Math.cos(a)), cy, cz + Math.round(R*Math.sin(a)), id);
  }
}
// place a vertical strip at an angle on the tower wall (follows taper)
function ribAt(cx, cz, angleDeg, y0, y1, id){
  const a = angleDeg * Math.PI/180;
  for (let y = y0; y <= y1; y++){
    const R = radiusAt(y);
    block(cx + Math.round(R*Math.cos(a)), y, cz + Math.round(R*Math.sin(a)), id);
  }
}
function windowStrip(cx, cz, angleDeg, y0, h, id){
  const a = angleDeg * Math.PI/180;
  for (let s = 0; s < h; s++){
    const y = y0 + s;
    const R = radiusAt(y);
    for (let dr = -1; dr <= 0; dr++){       // pane + carve one deep
      const x = cx + Math.round((R+dr)*Math.cos(a));
      const z = cz + Math.round((R+dr)*Math.sin(a));
      if (dr === 0) block(x, y, z, id);      // glowing pane
      else block(x, y, z, AIR);              // hollow behind so light reads
    }
  }
}
function solidCone(cx, cy, cz, baseR, id){
  let y = cy, top = cy;
  for (let r = baseR; r >= 0; r--){
    disk(cx, y, cz, r, id);
    top = y; y++;
  }
  return top;
}

// ---------- foundation dug into the ground ----------
cylinder(CX, -6, CZ, 8, 3, STONE);          // deep footing
cylinder(CX, -3, CZ, 8, 3, COBBLE);         // base plinth y-3..-1
disk(CX, -1, CZ, 9, COBBLE);                // wide skirt at grade
ring(CX, -1, CZ, 9, STONE, 22);             // rim stones

// ---------- main shaft (three tapering drums) ----------
hollowCylinder(CX, groundY, CZ, 6, 9, STONE);   // y0..8
hollowCylinder(CX, 9,       CZ, 5, 8, STONE);   // y9..16
hollowCylinder(CX, 17,      CZ, 4, 8, COBBLE);  // y17..24

// double up the wall for a heavier look (inner course)
hollowCylinder(CX, groundY, CZ, 5, 9, STONE);
hollowCylinder(CX, 9,       CZ, 4, 8, STONE);

// overhanging balcony rings at the drum transitions
disk(CX, 8,  CZ, 7, COBBLE);  ring(CX, 9,  CZ, 7, STONE, 20);
disk(CX, 16, CZ, 6, COBBLE);  ring(CX, 17, CZ, 6, STONE, 20);

// re-hollow the balcony floors so the tower interior stays open
cylinder(CX, 8,  CZ, 4, 1, AIR);
cylinder(CX, 16, CZ, 3, 1, AIR);

// interior floor slabs (planks)
disk(CX, 0,  CZ, 5, PLANKS);
disk(CX, 9,  CZ, 4, PLANKS);
disk(CX, 17, CZ, 3, PLANKS);

// ---------- timber ribs running up the tower ----------
for (let d = 0; d < 360; d += 45){
  ribAt(CX, CZ, d, 0, 24, OAK_LOG);
}

// ---------- glowing arched windows (front-biased, wizard light) ----------
// front = -90deg (toward -Z north), east +X = 0deg
windowStrip(CX, CZ, -90, 3, 4, GLASS);   // main north window low
windowStrip(CX, CZ, -90, 11, 4, GLASS);  // north window mid
windowStrip(CX, CZ, -60, 12, 3, ICE);
windowStrip(CX, CZ, -120,12, 3, ICE);
windowStrip(CX, CZ, -90, 19, 3, GLASS);  // north window high
windowStrip(CX, CZ, 0,   5, 3, GLASS);   // east (lit side)
windowStrip(CX, CZ, 180, 5, 3, GLASS);   // west
windowStrip(CX, CZ, 0,   19, 3, ICE);
windowStrip(CX, CZ, -45, 20, 2, GLASS);

// ---------- doorway at the north base ----------
(function door(){
  for (let dx = -1; dx <= 1; dx++)
    for (let y = 0; y <= 3; y++){
      block(CX+dx, y, CZ-6, AIR);
      block(CX+dx, y, CZ-5, AIR);
    }
  // plank frame + arch
  for (let y = 0; y <= 4; y++){ block(CX-2, y, CZ-6, PLANKS); block(CX+2, y, CZ-6, PLANKS); }
  block(CX-1,4,CZ-6,PLANKS); block(CX,4,CZ-6,PLANKS); block(CX+1,4,CZ-6,PLANKS);
  block(CX,5,CZ-6,OAK_LOG);
  // stone stoop / steps out to the north
  cube(CX-2, -1, CZ-8, CX+2, -1, CZ-7, STONE);
  cube(CX-1,  0, CZ-8, CX+1,  0, CZ-8, COBBLE);
})();

// ---------- crenellated parapet above the top drum ----------
ring(CX, 25, CZ, 4, COBBLE, 18);
for (let d = 0; d < 360; d += 36){
  const a = d*Math.PI/180;
  block(CX+Math.round(4*Math.cos(a)), 26, CZ+Math.round(4*Math.sin(a)), STONE);
}

// ---------- the wizard's hat: brim + tall spire ----------
disk(CX, 27, CZ, 6, COBBLE);            // wide brim
ring(CX, 27, CZ, 6, STONE, 18);
ring(CX, 27, CZ, 5, STONE, 20);
const spireTop = solidCone(CX, 28, CZ, 5, BRICK);   // red conical roof

// spiral band of glass runes up the hat
for (let t = 0; t < 40; t++){
  const y = 28 + t*0.12;
  const r = 5 - t*0.12;
  if (r < 0.6) break;
  const a = t * 0.9;
  block(CX + Math.round(r*Math.cos(a)), Math.round(y), CZ + Math.round(r*Math.sin(a)), GLASS);
}

// ---------- glowing crystal orb crowning the spire ----------
hollowSphere(CX, spireTop+2, CZ, 2, GLASS);
block(CX, spireTop+2, CZ, ICE);
block(CX, spireTop+4, CZ, ICE);       // antenna spark

// ---------- buttresses (four sloped stone braces) ----------
[[45],[135],[225],[315]].forEach(([deg])=>{
  const a = deg*Math.PI/180;
  for (let y = -1; y <= 10; y++){
    const R = 6 + (10 - y)*0.35;
    const x = CX + Math.round(R*Math.cos(a));
    const z = CZ + Math.round(R*Math.sin(a));
    block(x, y, z, COBBLE);
    if (y < 5) block(x, y, z + (a>0?1:-1), STONE);
  }
});

// ---------- adjoining small turret (front-east, catches light) ----------
(function turret(){
  const tx = 9, tz = CZ - 3;
  cylinder(tx, -4, tz, 3, 4, COBBLE);          // footing
  hollowCylinder(tx, 0, tz, 3, 14, STONE);
  hollowCylinder(tx, 0, tz, 2, 14, STONE);
  disk(tx, 0, tz, 2, PLANKS);
  // ribs
  for (let d = 0; d < 360; d += 90) ribAt2(tx, tz, d, 3, 0, 13);
  function ribAt2(cx,cz,deg,R,y0,y1){
    const a=deg*Math.PI/180;
    for(let y=y0;y<=y1;y++) block(cx+Math.round(R*Math.cos(a)),y,cz+Math.round(R*Math.sin(a)),OAK_LOG);
  }
  // windows on the lit north/east faces
  for (let y = 5; y <= 7; y++){ block(tx, y, tz-3, GLASS); block(tx+3, y, tz, GLASS); }
  block(tx, 10, tz-3, ICE);
  // little conical cap
  ring(tx, 15, tz, 4, COBBLE, 24);
  solidCone(tx, 16, tz, 3, BRICK);
  block(tx, 20, tz, ICE);
  // covered walkway linking turret to the main tower
  cube(2, 3, CZ-3, 7, 3, CZ-2, PLANKS);
  cube(2, 0, CZ-3, 2, 3, CZ-3, OAK_LOG);
  cube(6, 0, CZ-3, 6, 3, CZ-3, OAK_LOG);
})();

// ---------- hanging banners from the mid balcony (front) ----------
for (const bx of [-3, -1, 1, 3]){
  for (let y = 15; y >= 11; y--) block(CX+bx, y, CZ-5, BRICK);
  block(CX+bx, 11, CZ-5, GLASS);
}

// ---------- ground magic: rune circle + floating shards ----------
ring(CX, 0, CZ, 11, GLASS, 30);
ring(CX, 0, CZ, 11, ICE, 30, 15);
[[-13,6,-4],[12,7,10],[-9,5,12],[14,4,-6],[-15,6,3]].forEach(([x,y,z])=>{
  block(x, y, z, ICE);
  block(x, y+1, z, GLASS);
  block(x, y-1, z, GLASS);
});

// scattered mushrooms / lanterns along the north approach
[[-4,-9],[4,-10],[-6,-6],[6,-7]].forEach(([x,z])=>{
  block(x, 0, z, OAK_LOG);
  block(x, 1, z, GLASS);
});
})();
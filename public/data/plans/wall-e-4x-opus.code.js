// wall-e-4x-opus — prompt:
// Wall-E...

const meta = { name: 'walle', description: 'Wall-E robot voxel build' };

// ---- helpers ----
function boxShell(x1,y1,z1,x2,y2,z2,id){
  cube(x1,y1,z1,x2,y2,z1,id);
  cube(x1,y1,z2,x2,y2,z2,id);
  cube(x1,y1,z1,x1,y2,z2,id);
  cube(x2,y1,z1,x2,y2,z2,id);
  cube(x1,y1,z1,x2,y1,z2,id);
  cube(x1,y2,z1,x2,y2,z2,id);
}
function tubeZ(cx,cy,z1,z2,r,id){
  const zi=Math.min(z1,z2), za=Math.max(z1,z2), R=Math.ceil(r);
  for(let z=zi;z<=za;z++)
    for(let x=-R;x<=R;x++)
      for(let y=-R;y<=R;y++)
        if(x*x+y*y<=r*r) block(cx+x,cy+y,z,id);
}
function eyeFace(cx,cy,z){
  for(let x=-3;x<=3;x++)
    for(let y=-3;y<=3;y++){
      const d2=x*x+y*y;
      if(d2<=6){
        if(d2<=2) block(cx+x,cy+y,z,COBBLE);
        else block(cx+x,cy+y,z,ICE);
      }
    }
  block(cx-1,cy+1,z,SNOW); // glint
}
function jointLine(x1,y1,z1,x2,y2,z2,id){
  line(x1,y1,z1,x2,y2,z2,id);
  sphere(x1,y1,z1,1,id);
  sphere(x2,y2,z2,1,id);
}
function trashCube(x,y,z,id){ cube(x,y,z,x+1,y+1,z+1,id); }

// ---- clear intersecting trees + lay a trash-earth pad ----
cube(-12,0,-12, 12,25,12, AIR);
cube(-11,-1,-9, 11,-1,9, DIRT);

// ============ TREADS (tank tracks) ============
cube(-9,0,-6,-4,4,6,STONE);   // left tread
cube(4,0,-6,9,4,6,STONE);     // right tread
// angled nose (front -Z) + tail (back +Z) for both treads
[[-9,-4],[4,9]].forEach(([xa,xb])=>{
  cube(xa,0,-7,xb,3,-7,STONE);
  cube(xa,0,-8,xb,1,-8,STONE);
  cube(xa,0,7,xb,3,7,STONE);
  cube(xa,0,8,xb,1,8,STONE);
});
// grousers (tread ridges) on outer faces
for(let z=-6;z<=6;z+=2)
  for(let y=0;y<=4;y++){
    block(-9,y,z,COBBLE);
    block(9,y,z,COBBLE);
  }
// dark top rail + bright wheel hubs
cube(-9,4,-6,-4,4,6,COBBLE);
cube(4,4,-6,9,4,6,COBBLE);
[-3,3].forEach(hz=>{ block(-9,2,hz,STONE); block(9,2,hz,STONE); });

// ============ BODY (yellow compactor cube) ============
boxShell(-8,5,-5,8,15,5,SAND);

// front hatch / chest
cube(-5,6,-5,5,12,-5,COBBLE);
cube(-5,9,-5,5,9,-5,STONE);   // fold line
block(-6,9,-5,STONE); block(6,9,-5,STONE); // side latches
cube(-3,14,-5,3,14,-5,STONE); // name plate
for(let x=-6;x<=6;x+=2) block(x,13,-5,COBBLE); // caution dashes

// solar panel on top
cube(-7,15,-4,-2,15,-1,ICE);
line(-7,15,-4,-2,15,-4,STONE); line(-7,15,-1,-2,15,-1,STONE);
line(-7,15,-4,-7,15,-1,STONE); line(-2,15,-4,-2,15,-1,STONE);
block(-5,15,-2,STONE); block(-4,15,-3,STONE);

// weathering: rust + grime patches (asymmetric)
[[-8,7,-3,BRICK],[-8,10,2,DIRT],[-8,13,-1,BRICK],[-8,6,4,DIRT],
 [8,6,2,BRICK],[8,9,-3,DIRT],[8,12,3,BRICK],[8,8,-1,BRICK],
 [-3,7,-5,BRICK],[4,11,-5,DIRT],
 [-6,15,3,DIRT],[5,15,-3,BRICK],[1,15,4,DIRT]].forEach(([x,y,z,id])=>block(x,y,z,id));

// ============ NECK + HEAD ============
cube(-2,15,-1,2,18,2,STONE);   // neck
cube(-4,16,-1,4,21,1,STONE);   // eye bar / head yoke

// eyes (binocular tubes facing north)
tubeZ(-3,19,-9,-1,3,STONE);
tubeZ(3,19,-9,-1,3,STONE);
eyeFace(-3,19,-9);
eyeFace(3,19,-9);
// expressive brows (curl up-outward)
block(-5,22,-9,STONE); block(-4,23,-9,STONE); block(-3,23,-9,STONE);
block(5,22,-9,STONE);  block(4,23,-9,STONE);  block(3,23,-9,STONE);

// ============ ARMS ============
// right arm reaching down-forward toward the plant
jointLine(8,12,-1, 10,9,-4, STONE);
jointLine(10,9,-4, 9,5,-8, STONE);
jointLine(9,5,-8, 7,3,-10, STONE);
cube(6,2,-11,8,4,-9,STONE);          // right hand/claw
block(6,3,-11,COBBLE); block(8,3,-11,COBBLE);
// left arm relaxed at side
jointLine(-8,12,-1, -11,9,-2, STONE);
jointLine(-11,9,-2, -11,5,-2, STONE);
jointLine(-11,5,-2, -10,3,-3, STONE);
cube(-11,2,-4,-9,4,-2,STONE);        // left hand/claw
block(-11,3,-3,COBBLE); block(-9,3,-3,COBBLE);

// ============ PLANT IN A BOOT (foreground icon) ============
cube(3,0,-12,6,3,-9,COBBLE);   // boot
cube(3,0,-13,5,1,-12,COBBLE);  // toe
cube(3,3,-12,6,3,-9,DIRT);     // soil
block(4,4,-11,OAK_LOG); block(4,5,-11,OAK_LOG); // stem
[[4,6,-11],[3,5,-11],[5,5,-11],[4,5,-12],[4,5,-10],[4,6,-10],[3,6,-11]]
  .forEach(([x,y,z])=>block(x,y,z,LEAVES));

// ============ COMPACTED TRASH CUBES (background + scatter) ============
// background stack (south)
[[-8,0,9,BRICK],[-6,0,9,STONE],[-8,2,9,COBBLE],[-6,2,9,BRICK],
 [7,0,9,STONE],[9,0,8,BRICK],[7,0,11,COBBLE],[7,2,9,OAK_LOG],
 [-2,0,10,OAK_LOG],[0,0,11,STONE],[-1,0,9,BRICK]]
  .forEach(([x,y,z,id])=>trashCube(x,y,z,id));
// foreground / side scatter
[[10,0,-8,COBBLE],[-11,0,-8,BRICK],[-9,0,-11,STONE],[9,0,-13,OAK_LOG]]
  .forEach(([x,y,z,id])=>trashCube(x,y,z,id));

// loose debris + tread tracks trailing south
[[-3,0,-11,COBBLE],[2,0,-13,STONE],[-10,0,4,BRICK],[10,0,3,SAND],
 [-6,0,12,STONE],[6,0,13,COBBLE]].forEach(([x,y,z,id])=>block(x,y,z,id));
for(let z=9;z<=12;z++){ block(-6,0,z,STONE); block(6,0,z,STONE); }
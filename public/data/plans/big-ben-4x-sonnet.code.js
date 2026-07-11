// big-ben-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function vRing(x1,y,z1,x2,y2,z2,id){ hollowCube(x1,y,z1,x2,y,z2,id); }

function clockFace(place, cy, r){
  for (let u=-r-1; u<=r+1; u++){
    for (let y=cy-r-1; y<=cy+r+1; y++){
      const dv=y-cy, d2=u*u+dv*dv;
      if (d2<=(r+1)*(r+1)+0.4 && d2>r*r+0.4) place(u,y,STONE);
      else if (d2<=r*r+0.4) place(u,y,GLASS);
    }
  }
  place(0,cy+r,STONE); place(0,cy-r,STONE);
  place(r,cy,STONE);   place(-r,cy,STONE);
  for (let i=1;i<=r;i++) place(0,cy+i,STONE);
  place(1,cy,STONE);
}

// Plinth
cube(-5,0,-5,5,0,5,COBBLE);
cube(-4,1,-4,4,1,4,STONE);

// Lower shaft (9x9), y2-13
hollowCube(-4,2,-4,4,13,4,COBBLE);
line(-4,2,-4,-4,13,-4,STONE);
line(4,2,-4,4,13,-4,STONE);
line(-4,2,4,-4,13,4,STONE);
line(4,2,4,4,13,4,STONE);
vRing(-4,6,-4,4,6,4,STONE);
vRing(-4,10,-4,4,10,4,STONE);
cube(-3,2,-3,3,2,3,PLANKS);

cube(-1,2,-4,1,4,-4,AIR);
cube(-1,2,-4,1,3,-4,PLANKS);
block(-1,4,-4,STONE); block(0,4,-4,STONE); block(1,4,-4,STONE);
cube(-1,0,-5,1,0,-5,BRICK);

for (const off of [-2,0,2]){
  cube(off,4,-4,off,5,-4,GLASS);
  cube(off,4,4,off,5,4,GLASS);
  cube(-4,4,off,-4,5,off,GLASS);
  cube(4,4,off,4,5,off,GLASS);
  cube(off,8,-4,off,9,-4,GLASS);
  cube(off,8,4,off,9,4,GLASS);
  cube(-4,8,off,-4,9,off,GLASS);
  cube(4,8,off,4,9,off,GLASS);
}
cube(-1,2,-4,1,4,-4,AIR);
cube(-1,2,-4,1,3,-4,PLANKS);
block(-1,4,-4,STONE); block(0,4,-4,STONE); block(1,4,-4,STONE);

// Upper shaft (7x7), y14-20
hollowCube(-3,14,-3,3,20,3,COBBLE);
line(-3,14,-3,-3,20,-3,STONE);
line(3,14,-3,3,20,-3,STONE);
line(-3,14,3,-3,20,3,STONE);
line(3,14,3,3,20,3,STONE);
vRing(-3,17,-3,3,17,3,STONE);
cube(-3,14,-3,3,14,3,PLANKS);

for (const off of [-1,1]){
  cube(off,16,-3,off,17,-3,GLASS);
  cube(off,16,3,off,17,3,GLASS);
  cube(-3,16,off,-3,17,off,GLASS);
  cube(3,16,off,3,17,off,GLASS);
}

// Belfry / clock section, y21-27
hollowCube(-3,21,-3,3,27,3,COBBLE);
line(-3,21,-3,-3,27,-3,STONE);
line(3,21,-3,3,27,-3,STONE);
line(-3,21,3,-3,27,3,STONE);
line(3,21,3,3,27,3,STONE);
cube(-3,21,-3,3,21,3,PLANKS);

for (const off of [-1,1]){
  cube(off,22,-3,off,22,-3,PLANKS);
  cube(off,22,3,off,22,3,PLANKS);
  cube(-3,22,off,-3,22,off,PLANKS);
  cube(3,22,off,3,22,off,PLANKS);
}

clockFace((u,y,id)=>block(u,y,-3,id), 24, 2); // north
clockFace((u,y,id)=>block(u,y,3,id), 24, 2);  // south
clockFace((u,y,id)=>block(-3,y,u,id), 24, 2); // west
clockFace((u,y,id)=>block(3,y,u,id), 24, 2);  // east

vRing(-3,27,-3,3,27,3,BRICK);

// Cornice ledge, y28
cube(-4,28,-4,4,28,4,STONE);
hollowCube(-4,28,-4,4,28,4,BRICK);

for (const [px,pz] of [[-4,-4],[4,-4],[-4,4],[4,4]]){
  cylinder(px,29,pz,1,3,STONE);
  block(px,32,pz,STONE);
}

// Spire
cube(-2,29,-2,2,29,2,STONE);
cube(-1,30,-1,1,30,1,STONE);
cube(-1,31,-1,1,31,1,STONE);
block(0,32,0,STONE);
block(0,33,0,OAK_LOG);

// Front plaza
cube(-1,0,-8,1,0,-5,STONE);
line(-2,1,-7,-2,3,-7,OAK_LOG); block(-2,4,-7,GLASS);
line(2,1,-7,2,3,-7,OAK_LOG);   block(2,4,-7,GLASS);
```

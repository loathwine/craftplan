// neuschwanstein-4x-fable — prompt:
// Neuschwanstein Castle...

function wallBox(x1,y1,z1,x2,y2,z2,id){
  cube(x1,y1,z1,x2,y2,z1,id);
  cube(x1,y1,z2,x2,y2,z2,id);
  cube(x1,y1,z1,x1,y2,z2,id);
  cube(x2,y1,z1,x2,y2,z2,id);
}
function spire(cx,y0,cz,id){
  disk(cx,y0,cz,3,id);
  disk(cx,y0+1,cz,2,id);
  disk(cx,y0+2,cz,2,id);
  disk(cx,y0+3,cz,1,id);
  disk(cx,y0+4,cz,1,id);
  block(cx,y0+5,cz,id);
}
function smallSpire(cx,y0,cz,id){
  disk(cx,y0,cz,2,id);
  disk(cx,y0+1,cz,1,id);
  block(cx,y0+2,cz,id);
  block(cx,y0+3,cz,id);
}

// clear vegetation over the castle footprint only
cube(-13,0,-17,11,28,15,AIR);
block(1,-1,-7,GRASS); block(4,-1,-3,GRASS); block(12,-1,11,GRASS);

// ---- rock plinth under the Palas ----
wallBox(-8,-2,0,8,0,13,COBBLE);

// ---- Palas (main hall), white limestone ----
wallBox(-7,-2,1,7,14,12,SNOW);
// ceiling plate + stepped slate roof, ridge running east-west
cube(-6,14,2,6,14,11,STONE);
cube(-8,15,0,8,15,0,STONE);   cube(-8,15,13,8,15,13,STONE);
cube(-7,15,1,7,15,1,STONE);   cube(-7,15,12,7,15,12,STONE);
cube(-7,16,2,7,16,2,STONE);   cube(-7,16,11,7,16,11,STONE);
cube(-7,17,3,7,17,3,STONE);   cube(-7,17,10,7,17,10,STONE);
cube(-7,18,4,7,18,4,STONE);   cube(-7,18,9,7,18,9,STONE);
cube(-7,19,5,7,19,5,STONE);   cube(-7,19,8,7,19,8,STONE);
cube(-8,20,6,8,20,7,STONE);
// white gable ends east & west
for (const gx of [-7,7]) {
  cube(gx,15,2,gx,15,11,SNOW);
  cube(gx,16,3,gx,16,10,SNOW);
  cube(gx,17,4,gx,17,9,SNOW);
  cube(gx,18,5,gx,18,8,SNOW);
  cube(gx,19,6,gx,19,7,SNOW);
}
// ridge ornaments
block(-4,21,6,STONE); block(-4,22,6,STONE);
block(0,21,7,STONE);

// palas windows (blue glass), north front / sides / rear
for (const wx of [-5,-3,-1,1,3,5]) {
  for (const wy of [1,4,7,10]) cube(wx,wy,1,wx,wy+1,1,GLASS);
  block(wx,13,1,GLASS);
}
for (const wz of [3,5,7,9]) for (const wy of [4,7,10]) {
  cube(-7,wy,wz,-7,wy+1,wz,GLASS);
  cube(7,wy,wz,7,wy+1,wz,GLASS);
}
for (const wx of [-4,0,4]) for (const wy of [4,7,10]) cube(wx,wy,12,wx,wy+1,12,GLASS);

// oriel bay on the north front
cube(-1,5,0,1,11,0,SNOW);
cube(0,6,0,0,7,0,GLASS); cube(0,9,0,0,10,0,GLASS);
cube(-1,12,0,1,12,0,SNOW); block(0,13,0,SNOW);

// ---- great round tower, northwest (the tall one) ----
cylinder(-9,-2,2,2,29,SNOW);
hollowCylinder(-9,22,2,3,1,SNOW);
disk(-9,26,2,3,SNOW);
spire(-9,27,2,STONE);
for (const wy of [3,7,11,15,19,24]) block(-9,wy,0,GLASS);

// ---- southeast round tower ----
cylinder(8,-2,13,2,24,SNOW);
spire(8,22,13,STONE);
for (const wy of [3,8,13,18]) block(8,wy,11,GLASS);

// ---- square tower rising through the palas roof ----
wallBox(2,8,8,5,22,11,SNOW);
cube(2,23,8,5,23,11,STONE);
cube(3,24,9,4,24,10,STONE);
block(3,25,9,STONE); block(3,26,9,STONE);
block(2,24,8,STONE); block(5,24,8,STONE); block(2,24,11,STONE); block(5,24,11,STONE);
for (const wy of [10,14,18]) cube(3,wy,8,4,wy+1,8,GLASS);

// ---- cantilevered corner turrets ----
block(8,7,1,SNOW); block(7,7,0,SNOW);
cylinder(7,8,1,1,12,SNOW);
smallSpire(7,20,1,STONE);
block(7,12,0,GLASS); block(7,16,0,GLASS);
block(-8,7,12,SNOW); block(-7,7,13,SNOW);
cylinder(-7,8,12,1,12,SNOW);
smallSpire(-7,20,12,STONE);
block(-7,12,13,GLASS); block(-7,16,13,GLASS);

// ---- gatehouse, red brick with stepped gables ----
wallBox(-5,-2,-15,5,7,-10,BRICK);
cube(-4,7,-14,4,7,-11,STONE);
// saddle roof, ridge north-south
cube(-5,8,-15,-5,8,-10,STONE); cube(5,8,-15,5,8,-10,STONE);
cube(-4,9,-15,-4,9,-10,STONE); cube(4,9,-15,4,9,-10,STONE);
cube(-3,10,-15,-3,10,-10,STONE); cube(3,10,-15,3,10,-10,STONE);
cube(-2,11,-15,-2,11,-10,STONE); cube(2,11,-15,2,11,-10,STONE);
cube(-1,12,-15,1,12,-10,STONE);
for (const gz of [-15,-10]) {
  cube(-4,8,gz,4,8,gz,BRICK);
  cube(-3,9,gz,3,9,gz,BRICK);
  cube(-2,10,gz,2,10,gz,BRICK);
  cube(-1,11,gz,1,11,gz,BRICK);
  block(0,13,gz,BRICK);
}
// flanking brick towers with slate caps
cylinder(-6,-2,-15,1,14,BRICK); cylinder(6,-2,-15,1,14,BRICK);
smallSpire(-6,12,-15,STONE); smallSpire(6,12,-15,STONE);
for (const tx of [-6,6]) for (const wy of [2,6,10]) block(tx,wy,-16,GLASS);
// white portal frame + windows over the gate
cube(-2,-1,-15,2,4,-15,SNOW);
cube(-3,5,-15,-3,6,-15,GLASS); cube(0,5,-15,0,6,-15,GLASS); cube(3,5,-15,3,6,-15,GLASS);

// ---- courtyard walls linking gatehouse to palas ----
cube(-6,-1,-10,-6,3,0,SNOW); cube(6,-1,-10,6,3,0,SNOW);
cube(-6,-1,-10,-6,-1,0,COBBLE); cube(6,-1,-10,6,-1,0,COBBLE);
for (let bz=-10; bz<=0; bz+=2) { block(-6,4,bz,SNOW); block(6,4,bz,SNOW); }

// courtyard fountain
disk(-3,0,-4,1,COBBLE);
block(-3,0,-4,GLASS); block(-3,1,-4,GLASS);

// cobble approach path, through the gate to the palas door
cube(-1,-1,-18,1,-1,1,COBBLE);

// two small trees flanking the approach
for (const tx of [-4,4]) {
  block(tx,0,-17,OAK_LOG); block(tx,1,-17,OAK_LOG);
  sphere(tx,3,-17,1,LEAVES);
}

// ---- final carves ----
// gate passage
cube(-1,0,-16,1,2,-9,AIR);
block(0,3,-15,AIR); block(0,3,-10,AIR);
// palas door
cube(-1,1,1,1,3,1,AIR);
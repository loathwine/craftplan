// dracula-castle-fable — prompt:
// Dracula's castle on a cliff...

const h=(a,b)=>{const s=Math.sin(a*12.9898+b*78.233)*43758.5453;return s-Math.floor(s);};

// clear foreground trees north of the cliff and around the graveyard
cube(-5,1,-22,5,9,-9,AIR);
cube(-12,1,-18,-6,8,-10,AIR);
cube(8,1,-18,16,8,-9,AIR);

// ---- CLIFF: stacked tapering rock rings, hollow inside ----
for(let y=-3;y<=9;y++){
  const r=Math.round(7+(9-y)*0.4);
  const id=(y<2)?STONE:(h(y,3)<0.35?COBBLE:STONE);
  hollowCylinder(0,y,2,r,1,id);
}
disk(0,9,2,8,COBBLE);
// jutting boulders on the slopes
sphere(-10,3,-2,2,STONE); sphere(9,1,-5,2,STONE);
sphere(-7,6,-7,2,STONE); sphere(11,5,6,2,COBBLE);
sphere(3,0,-10,2,STONE);
// a little snow on the north ledges
line(-6,10,-5,6,10,-5,SNOW);

// ---- KEEP ----
hollowCube(-6,10,-3,6,24,7,STONE);
// cobble banding
cube(-6,16,-3,6,16,-3,COBBLE); cube(-6,21,-3,6,21,-3,COBBLE);
line(-6,16,7,6,16,7,COBBLE);
// front buttresses
cube(-3,10,-4,-3,20,-4,COBBLE); cube(3,10,-4,3,20,-4,COBBLE);
// battlements on the keep roof
for(let x=-6;x<=6;x+=2){block(x,25,-3,STONE);block(x,25,7,STONE);}
for(let z=-1;z<=5;z+=2){block(-6,25,z,STONE);block(6,25,z,STONE);}
// great doorway with pointed arch
cube(-1,10,-3,1,13,-3,AIR); block(0,14,-3,AIR);
cube(-1,10,-2,1,10,-2,OBSIDIAN);
block(-2,13,-4,FIRE); block(2,13,-4,FIRE);
// lit windows on the north face
for(const x of [-5,-2,2,5]){cube(x,14,-3,x,15,-3,NEON_RED);cube(x,19,-3,x,20,-3,NEON_RED);}
// dark gothic windows on east/west faces (carved)
for(const z of [0,3]){cube(-6,15,z,-6,17,z,AIR);cube(6,15,z,6,17,z,AIR);}

// ---- CORNER TOWERS ----
function tower(cx,cz,y0,top,roofId){
  hollowCylinder(cx,y0,cz,2,top-y0+1,STONE);
  cube(cx-2,y0+6,cz-2,cx+2,y0+6,cz+2,COBBLE);
  cube(cx-2,y0+7,cz-2,cx+2,y0+7,cz+2,AIR);
  hollowCylinder(cx,y0+7,cz,2,1,STONE);
  disk(cx,top+1,cz,2,roofId); disk(cx,top+2,cz,1,roofId); block(cx,top+3,cz,roofId);
  for(const y of [y0+9,y0+15,top-3]) block(cx,y,cz-2,NEON_RED);
}
tower(-7,-4,7,30,BLACK);
tower(7,-4,7,30,BLACK);
tower(-7,8,10,28,BLACK);
tower(7,8,10,28,BLACK);

// ---- CENTRAL SPIRE ----
hollowCylinder(0,24,2,3,7,STONE);
disk(0,31,2,3,OBSIDIAN); disk(0,32,2,2,OBSIDIAN); block(0,33,2,OBSIDIAN);
for(const dz of [-3]) {block(0,27,2+dz,NEON_RED);block(0,29,2+dz,NEON_RED);}
block(0,33,0,ELECTRIC); block(1,33,4,ELECTRIC);
// corner braziers
block(-6,26,-3,FIRE); block(6,26,-3,FIRE);

// ---- ROPE BRIDGE down to the valley ----
line(0,9,-6,0,1,-20,PLANKS);
line(-1,10,-6,-1,2,-20,OAK_LOG);
line(1,10,-6,1,2,-20,OAK_LOG);
for(const z of [-9,-13,-17]){
  const y=Math.round(9-(z+6)*(8/14));
  line(-1,y-2,z,-1,y+1,z,OAK_LOG); line(1,y-2,z,1,y+1,z,OAK_LOG);
}
block(-1,1,-20,OAK_LOG); block(1,1,-20,OAK_LOG);

// ---- DEAD TREES ----
function deadTree(x,y,z){
  line(x,y,z,x,y+6,z,OAK_LOG);
  line(x,y+4,z,x-3,y+7,z-1,OAK_LOG);
  line(x,y+5,z,x+2,y+8,z+1,OAK_LOG);
  line(x,y+3,z,x+2,y+4,z-2,OAK_LOG);
}
deadTree(-13,0,-9); deadTree(12,1,-11); deadTree(-16,1,3);

// ---- GRAVEYARD ----
for(const [x,z] of [[-10,-15],[-8,-13],[-11,-12],[-7,-16],[-9,-11]]){
  block(x,1,z,COBBLE); block(x,2,z,COBBLE);
}
line(-6,1,-14,-6,3,-14,COBBLE); line(-7,2,-14,-5,2,-14,COBBLE);
line(10,1,-15,10,3,-15,COBBLE); line(9,2,-15,11,2,-15,COBBLE);

// ---- BATS over the valley ----
function bat(x,y,z){block(x,y,z,BLACK);block(x-1,y+1,z,BLACK);block(x+1,y+1,z,BLACK);block(x-2,y+1,z,BLACK);block(x+2,y+1,z,BLACK);}
bat(-11,22,-9); bat(10,26,-8); bat(-3,29,-11); bat(13,19,-13); bat(-15,17,-13); bat(4,24,-14);